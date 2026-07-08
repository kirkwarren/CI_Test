// Mega-trends & long-horizon analysis over DEEP (up to 10-year) history.
//
// The honest answer to "where will investments be in 5-10 years" is not a
// point forecast — it is a DISTRIBUTION, and history already contains one:
// every rolling 5-year window that actually happened. This module measures
//   - multi-year trend state (3y/5y/10y CAGRs, relative strength vs a bench)
//   - the full distribution of realized rolling 5-year outcomes
//   - zero-drift long-horizon uncertainty cones from measured volatility
// Nothing here extrapolates; everything is a measurement of what long horizons
// have actually delivered, including the windows people prefer to forget.

import { mean, stddev } from './metrics';

function annualizedFrom(closes, startIdx, endIdx, ppy) {
  const years = (endIdx - startIdx) / ppy;
  if (years <= 0) return null;
  return Math.pow(closes[endIdx] / closes[startIdx], 1 / years) - 1;
}

// CAGR over the trailing `years` (null if the series is too short).
export function trailingCagr(closes, years, ppy) {
  const span = Math.round(years * ppy);
  const end = closes.length - 1;
  const start = end - span;
  if (start < 0) return null;
  return annualizedFrom(closes, start, end, ppy);
}

// Distribution of ALL realized rolling `windowYears` outcomes, stepped weekly.
// This is the honest "5-year prediction": the range of what 5 years has
// actually done, not what we hope it does.
export function rollingOutcomes(closes, windowYears, ppy, stepBars = 5) {
  const span = Math.round(windowYears * ppy);
  if (closes.length <= span + stepBars) return { insufficientData: true };
  const cagrs = [];
  for (let end = span; end < closes.length; end += stepBars) {
    cagrs.push(annualizedFrom(closes, end - span, end, ppy));
  }
  cagrs.sort((a, b) => a - b);
  const q = (p) => cagrs[Math.min(cagrs.length - 1, Math.floor(p * cagrs.length))];
  return {
    insufficientData: false,
    windows: cagrs.length,
    worst: cagrs[0],
    p10: q(0.1),
    median: q(0.5),
    p90: q(0.9),
    best: cagrs[cagrs.length - 1],
    pctNegative: cagrs.filter((c) => c < 0).length / cagrs.length,
  };
}

// Multi-year relative strength vs a benchmark on shared dates:
// (asset return over window) minus (benchmark return over window), annualized.
export function relativeStrength(assetBars, benchBars, years, ppy) {
  const bench = new Map(benchBars.map((b) => [b.date, b.close]));
  const shared = assetBars.filter((b) => bench.has(b.date));
  const span = Math.round(years * ppy);
  if (shared.length <= span) return null;
  const a0 = shared[shared.length - 1 - span].close;
  const a1 = shared[shared.length - 1].close;
  const b0 = bench.get(shared[shared.length - 1 - span].date);
  const b1 = bench.get(shared[shared.length - 1].date);
  const aCagr = Math.pow(a1 / a0, 1 / years) - 1;
  const bCagr = Math.pow(b1 / b0, 1 / years) - 1;
  return aCagr - bCagr;
}

// Zero-drift uncertainty cone at `years`: ±1σ/±2σ multiplicative bands from
// measured DAILY volatility of the deep series. Deliberately symmetric in log
// space — the point is the WIDTH, which is what a decade of measured vol
// actually implies, not the direction.
export function horizonCone(lastClose, dailyVol, years, ppy) {
  const sigma = dailyVol * Math.sqrt(years * ppy);
  return {
    years,
    low2: lastClose * Math.exp(-2 * sigma),
    low1: lastClose * Math.exp(-sigma),
    high1: lastClose * Math.exp(sigma),
    high2: lastClose * Math.exp(2 * sigma),
  };
}

// Full per-asset mega-trend summary from deep bars.
export function megaTrendSummary(bars, { symbol, benchBars = null, ppy = 252 } = {}) {
  const closes = bars.map((b) => b.close);
  const rets = [];
  for (let i = 1; i < closes.length; i++) rets.push(closes[i] / closes[i - 1] - 1);
  const dailyVol = stddev(rets);
  const last = closes[closes.length - 1];

  return {
    symbol,
    from: bars[0]?.date,
    to: bars[bars.length - 1]?.date,
    yearsOfData: (closes.length - 1) / ppy,
    lastClose: last,
    cagr3y: trailingCagr(closes, 3, ppy),
    cagr5y: trailingCagr(closes, 5, ppy),
    cagr10y: trailingCagr(closes, 10, ppy),
    relStrength5yVsBench: benchBars ? relativeStrength(bars, benchBars, 5, ppy) : null,
    rolling5y: rollingOutcomes(closes, 5, ppy),
    cone5y: horizonCone(last, dailyVol, 5, ppy),
    cone10y: horizonCone(last, dailyVol, 10, ppy),
    annVol: dailyVol * Math.sqrt(ppy),
    meanDailyReturn: mean(rets),
  };
}
