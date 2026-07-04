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

import { ema, rsi, atr, sma } from './indicators';

// Precompute all indicator series once for the whole dataset.
export function computeContext(bars, params) {
  const closes = bars.map((b) => b.close);
  return {
    emaFast: ema(closes, params.emaFast),
    emaSlow: ema(closes, params.emaSlow),
    rsi: rsi(closes, params.rsiPeriod),
    atr: atr(bars, params.atrPeriod),
    smaTrend: sma(closes, params.trendPeriod),
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
};

// STAGE 1 (Scan) + STAGE 2 (Detect): return a raw directional signal for bar i.
//   +1 => long bias, -1 => short bias, 0 => stand aside
export function detect(ctx, i, params) {
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

  // Volatility sanity: reject dead or berserk markets.
  const atrPct = a / price;
  if (atrPct < 0.0005 || atrPct > 0.05) {
    return { ok: false, confidence: 0, reason: 'volatility-out-of-band' };
  }

  // Momentum confirmation.
  if (direction === 1 && !(r >= params.rsiLongMin && r <= params.rsiLongMax)) {
    return { ok: false, confidence: 0, reason: 'rsi-reject-long' };
  }
  if (direction === -1 && !(r <= 100 - params.rsiLongMin && r >= 100 - params.rsiLongMax)) {
    return { ok: false, confidence: 0, reason: 'rsi-reject-short' };
  }

  // Confidence heuristic: how far EMAs have separated (trend strength),
  // squashed into [0,1]. This is a feature score, not a win probability.
  const sep = Math.abs(ctx.emaFast[i] - ctx.emaSlow[i]) / price;
  const confidence = Math.max(0, Math.min(1, sep / 0.01));

  return { ok: true, confidence, reason: 'ok' };
}
