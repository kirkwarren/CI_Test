// Strategy decision pipeline.
//
// This mirrors the six-stage cycle shown in the screenshot
// (Scan → Detect → Validate → Size → Fill → Settle) but as real, inspectable
// functions rather than dashboard decoration. Stages 1–4 live here; "Fill" and
// "Settle" are handled by the backtest loop because they involve order
// execution and accounting.
//
// The strategy itself is a deliberately *modest* trend-following system:
//   - trade in the direction of a fast/slow EMA crossover
//   - only when RSI confirms momentum and isn't already exhausted
//   - only when volatility (ATR) is in a sane band
// It is NOT a magic edge. It exists to demonstrate the machinery honestly.

import { ema, rsi, atr, sma, rollingStd } from './indicators';

// Precompute all indicator series once for the whole dataset.
export function computeContext(bars, params) {
  const closes = bars.map((b) => b.close);

  // Rolling realized volatility of simple returns (for vol-targeted sizing).
  // Aligned to bars: dailyVol[i] uses returns up to and including bar i.
  const rets = new Array(closes.length).fill(0);
  for (let i = 1; i < closes.length; i++) rets[i] = closes[i] / closes[i - 1] - 1;
  const volRaw = rollingStd(rets, params.volLookback ?? 20);

  // Donchian channel (exclusive of the current bar — a breakout must exceed
  // the PRIOR n-bar extreme, otherwise every new high trivially "breaks out").
  const n = params.breakoutPeriod ?? 55;
  const donchianHigh = new Array(bars.length).fill(null);
  const donchianLow = new Array(bars.length).fill(null);
  for (let i = n; i < bars.length; i++) {
    let hi = -Infinity;
    let lo = Infinity;
    for (let j = i - n; j < i; j++) {
      if (bars[j].high > hi) hi = bars[j].high;
      if (bars[j].low < lo) lo = bars[j].low;
    }
    donchianHigh[i] = hi;
    donchianLow[i] = lo;
  }

  return {
    emaFast: ema(closes, params.emaFast),
    emaSlow: ema(closes, params.emaSlow),
    rsi: rsi(closes, params.rsiPeriod),
    atr: atr(bars, params.atrPeriod),
    smaTrend: sma(closes, params.trendPeriod),
    dailyVol: volRaw,
    donchianHigh,
    donchianLow,
    bars,
    closes,
  };
}

export const DEFAULT_PARAMS = {
  emaFast: 12,
  emaSlow: 26,
  rsiPeriod: 14,
  atrPeriod: 14,
  trendPeriod: 100,
  rsiLongMin: 50,
  rsiLongMax: 78, // don't chase overbought
  atrStopMult: 2.0, // stop distance = atrStopMult * ATR
  takeProfitR: 2.0, // exit target in multiples of initial risk
  // Signal selection: 'trend' (default), 'meanrev', 'breakout', or 'ensemble'
  // (majority vote of the three). All share the same exit/sizing machinery so
  // variants differ ONLY in the signal — clean attribution.
  signalMode: 'trend',
  meanRevLow: 30, // RSI below => long fade
  meanRevHigh: 70, // RSI above => short fade
  breakoutPeriod: 55,
  volLookback: 20,
};

// Mean-reversion signal: fade RSI extremes.
function detectMeanRev(ctx, i, params) {
  const r = ctx.rsi[i];
  if (r == null) return 0;
  if (r <= params.meanRevLow) return 1;
  if (r >= params.meanRevHigh) return -1;
  return 0;
}

// Breakout signal: close beyond the prior N-bar extreme.
function detectBreakout(ctx, i) {
  const hi = ctx.donchianHigh[i];
  const lo = ctx.donchianLow[i];
  if (hi == null || lo == null) return 0;
  if (ctx.closes[i] > hi) return 1;
  if (ctx.closes[i] < lo) return -1;
  return 0;
}

// Trend signal (the original): EMA cross confirmed by the long trend filter.
function detectTrend(ctx, i, params) {
  const { emaFast, emaSlow, smaTrend, closes } = ctx;
  if (
    emaFast[i] == null ||
    emaSlow[i] == null ||
    smaTrend[i] == null
  ) {
    return 0;
  }
  const price = closes[i];
  const longCross = emaFast[i] > emaSlow[i] && price > smaTrend[i];
  const shortCross = emaFast[i] < emaSlow[i] && price < smaTrend[i];
  if (longCross) return 1;
  if (shortCross) return -1;
  return 0;
}

// Vote breakdown across the three signals — exported so callers can size by
// conviction and tests can assert attribution.
export function signalVotes(ctx, i, params) {
  return {
    trend: detectTrend(ctx, i, params),
    meanRev: detectMeanRev(ctx, i, params),
    breakout: detectBreakout(ctx, i),
  };
}

// STAGE 1 (Scan) + STAGE 2 (Detect): return a raw directional signal for bar i.
//   +1 => long bias, -1 => short bias, 0 => stand aside
export function detect(ctx, i, params) {
  switch (params.signalMode ?? 'trend') {
    case 'meanrev':
      return detectMeanRev(ctx, i, params);
    case 'breakout':
      return detectBreakout(ctx, i);
    case 'ensemble': {
      // Majority vote: act only when at least two of the three independent
      // signals agree on a direction.
      const v = signalVotes(ctx, i, params);
      const sum = v.trend + v.meanRev + v.breakout;
      if (sum >= 2) return 1;
      if (sum <= -2) return -1;
      return 0;
    }
    case 'trend':
    default:
      return detectTrend(ctx, i, params);
  }
}

// STAGE 3 (Validate): confirm the signal with a momentum + volatility filter and
// attach an honest "edge confidence" score. The score is a bounded heuristic in
// [0,1] — NOT a probability of profit. Anyone quoting you "95.7% edge" as if it
// were a guarantee is selling a fantasy.
export function validate(ctx, i, direction, params) {
  if (direction === 0) return { ok: false, confidence: 0, reason: 'no-signal' };

  const r = ctx.rsi[i];
  const a = ctx.atr[i];
  const price = ctx.closes[i];
  if (r == null || a == null) {
    return { ok: false, confidence: 0, reason: 'warmup' };
  }

  // Volatility sanity: reject dead or berserk markets. Applies to all modes.
  const atrPct = a / price;
  if (atrPct < 0.0005 || atrPct > 0.05) {
    return { ok: false, confidence: 0, reason: 'volatility-out-of-band' };
  }

  // The RSI momentum-confirmation band only makes sense for the trend signal —
  // mean-reversion deliberately enters at RSI extremes, and the ensemble's
  // votes already embed each signal's own logic.
  const mode = params.signalMode ?? 'trend';
  if (mode === 'trend') {
    if (direction === 1 && !(r >= params.rsiLongMin && r <= params.rsiLongMax)) {
      return { ok: false, confidence: 0, reason: 'rsi-reject-long' };
    }
    if (direction === -1 && !(r <= 100 - params.rsiLongMin && r >= 100 - params.rsiLongMax)) {
      return { ok: false, confidence: 0, reason: 'rsi-reject-short' };
    }
  }

  // Confidence heuristic: how far EMAs have separated (trend strength),
  // squashed into [0,1]. This is a feature score, not a win probability.
  const sep = Math.abs(ctx.emaFast[i] - ctx.emaSlow[i]) / price;
  const confidence = Math.max(0, Math.min(1, sep / 0.01));

  return { ok: true, confidence, reason: 'ok' };
}
