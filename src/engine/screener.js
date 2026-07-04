// Cross-sectional screener over real market data.
//
// Computes, for each asset, the descriptive statistics a systematic investor
// actually uses to compare assets — then combines three DOCUMENTED, transparent
// pillars into a composite rank:
//
//   1. Momentum   — 12-1 month return + 6-month return. Cross-sectional momentum
//                   is one of the most replicated effects in the academic
//                   literature (Jegadeesh & Titman 1993 and hundreds since).
//   2. Risk-adjusted quality — full-sample Sharpe and Sortino. Rewards return
//                   per unit of pain, not raw return.
//   3. Trend      — position vs. the 200-day moving average. A blunt but
//                   well-studied regime filter (Faber 2007).
//
// "Undervalued" is reported honestly: percent below the 52-week high and the
// current drawdown are shown SEPARATELY and are NOT part of the composite,
// because "down a lot" is as often a falling knife as a bargain. Price data
// alone cannot establish intrinsic value — that requires fundamentals.
//
// Every metric here describes the PAST. None of it is a promise about the
// future, and the composite is a transparent heuristic, not an oracle.

import { sma, rsi } from './indicators';
import { mean, stddev, maxDrawdown } from './metrics';

// Simple return over the last `n` bars, ending `skip` bars before the end.
function windowReturn(closes, n, skip = 0) {
  const end = closes.length - 1 - skip;
  const start = end - n;
  if (start < 0) return null;
  return closes[end] / closes[start] - 1;
}

export function screenAsset(bars, { symbol, assetClass = '?', periodsPerYear = 252 } = {}) {
  const closes = bars.map((b) => b.close);
  const n = closes.length;
  // The 12-1 momentum window needs periodsPerYear+1 closes and the 52-week
  // stats need a full year — gate on that, not a fixed count.
  const minBars = Math.max(270, periodsPerYear + 1);
  if (n < minBars) throw new Error(`${symbol}: need >= ${minBars} bars for a 12-month screen, got ${n}`);

  const oneMonth = Math.round(periodsPerYear / 12);
  const rets = [];
  for (let i = 1; i < n; i++) rets.push(closes[i] / closes[i - 1] - 1);

  const annVol = stddev(rets) * Math.sqrt(periodsPerYear);
  const annRet = mean(rets) * periodsPerYear;
  // Sortino denominator: target (MAR=0) downside deviation over ALL periods —
  // sqrt(mean(min(r,0)^2)) — NOT the stddev of losses around their own mean,
  // which would cancel out the average loss and ignore loss frequency.
  const downsideVar = rets.reduce((a, r) => a + Math.min(r, 0) ** 2, 0) / rets.length;
  const downsideDev = Math.sqrt(downsideVar) * Math.sqrt(periodsPerYear);

  // 52-week window for the "on sale" stats.
  const yearCloses = closes.slice(-periodsPerYear);
  const high52 = Math.max(...yearCloses);
  const low52 = Math.min(...yearCloses);

  const sma200 = sma(closes, 200);
  const lastSma200 = sma200[n - 1];
  const rsi14 = rsi(closes, 14)[n - 1];

  const years = (n - 1) / periodsPerYear;
  const cagr = Math.pow(closes[n - 1] / closes[0], 1 / years) - 1;

  return {
    symbol,
    assetClass,
    periodsPerYear,
    bars: n,
    lastDate: bars[n - 1].date,
    lastClose: closes[n - 1],

    // Momentum pillar
    mom12_1: windowReturn(closes, periodsPerYear - oneMonth, oneMonth), // classic 12-1
    ret6m: windowReturn(closes, Math.round(periodsPerYear / 2)),
    ret3m: windowReturn(closes, Math.round(periodsPerYear / 4)),
    ret1m: windowReturn(closes, oneMonth),

    // Risk pillar
    annVol,
    sharpe: annVol > 0 ? annRet / annVol : 0,
    sortino: downsideDev > 0 ? annRet / downsideDev : 0,
    maxDrawdown: maxDrawdown(closes),

    // Trend pillar
    above200d: lastSma200 != null ? closes[n - 1] > lastSma200 : null,
    dist200d: lastSma200 != null ? closes[n - 1] / lastSma200 - 1 : null,

    // "On sale" stats — reported, NOT ranked (drawdown ≠ undervalued)
    pctBelow52wHigh: 1 - closes[n - 1] / high52,
    pctAbove52wLow: closes[n - 1] / low52 - 1,
    rsi14,

    // Long-run context
    cagr,
  };
}

// Rank helper: position of each value within the cross-section, scaled 0..1
// (1 = best). Nulls sink to the bottom. Ties receive the AVERAGE of their
// positions (SciPy rankdata "average" convention) so identical inputs get
// identical ranks regardless of input order.
function pctRank(values) {
  const n = values.length;
  const idx = values
    .map((v, i) => ({ v: v == null || Number.isNaN(v) ? -Infinity : v, i }))
    .sort((a, b) => (a.v < b.v ? -1 : a.v > b.v ? 1 : 0));
  const out = new Array(n).fill(0);
  let k = 0;
  while (k < n) {
    let j = k;
    while (j + 1 < n && idx[j + 1].v === idx[k].v) j++;
    const r = n > 1 ? (k + j) / 2 / (n - 1) : 0.5;
    for (let m = k; m <= j; m++) out[idx[m].i] = r;
    k = j + 1;
  }
  return out;
}

// Combine screened assets into a transparent composite ranking.
// Weights are equal across the three pillars and stated in the output so
// nobody has to trust a black box.
export function rankAssets(screens) {
  // Unknown momentum must SINK (null → pctRank bottom), not be coerced to a
  // mid-pack zero — an asset we can't measure is not an average asset.
  const momRank = pctRank(
    screens.map((s) => (s.mom12_1 == null ? null : s.mom12_1 + (s.ret6m ?? 0)))
  );
  const riskRank = pctRank(screens.map((s) => s.sharpe + s.sortino));
  const trendRank = pctRank(screens.map((s) => s.dist200d));

  const ranked = screens.map((s, i) => ({
    ...s,
    ranks: {
      momentum: momRank[i],
      riskAdjusted: riskRank[i],
      trend: trendRank[i],
    },
    composite: (momRank[i] + riskRank[i] + trendRank[i]) / 3,
  }));

  ranked.sort((a, b) => b.composite - a.composite);
  return {
    weights: { momentum: 1 / 3, riskAdjusted: 1 / 3, trend: 1 / 3 },
    note:
      'Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.',
    assets: ranked,
  };
}
