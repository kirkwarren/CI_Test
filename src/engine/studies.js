// Deep empirical studies over real market data.
//
// These are not alpha-hunting models. They test the handful of empirical
// regularities about markets that are actually well-established — the "truths"
// most investors have heard of but never verified on real data:
//
//   1. Returns are fat-tailed (Gaussian risk models understate extremes)
//   2. A few days carry most of the return (why market-timing is punished)
//   3. Volatility clusters and is predictable; direction mostly is not
//   4. Correlations rise under stress (diversification fades when needed most)
//   5. Cross-sectional momentum: did past winners keep winning HERE?
//   6. Luck vs skill: is a strategy distinguishable from random trading?
//
// Every function is pure and deterministic so results are reproducible and
// unit-testable. Nothing here predicts; it measures.

import { mean, stddev } from './metrics';
import { makeRng } from './random';

export function simpleReturns(closes) {
  const out = [];
  for (let i = 1; i < closes.length; i++) out.push(closes[i] / closes[i - 1] - 1);
  return out;
}

// ---- Study 1: fat tails ------------------------------------------------------
// Excess kurtosis and the count of |move| > 3σ days vs the Gaussian expectation
// (~0.27% of days). Positive excess kurtosis + a 3σ count well above expectation
// = fat tails.
export function tailStats(returns) {
  const n = returns.length;
  if (n < 30) throw new Error('tailStats: need >= 30 returns');
  const m = mean(returns);
  const sd = stddev(returns);
  if (sd === 0) throw new Error('tailStats: zero variance');

  let skewSum = 0;
  let kurtSum = 0;
  let beyond3 = 0;
  for (const r of returns) {
    const z = (r - m) / sd;
    skewSum += z ** 3;
    kurtSum += z ** 4;
    if (Math.abs(z) > 3) beyond3++;
  }
  return {
    days: n,
    annFactorFreeMean: m,
    dailyStd: sd,
    skewness: skewSum / n,
    excessKurtosis: kurtSum / n - 3,
    worstDay: Math.min(...returns),
    bestDay: Math.max(...returns),
    beyond3Sigma: beyond3,
    // Gaussian expectation: P(|z|>3) ≈ 0.0027
    gaussianExpected3Sigma: n * 0.0027,
  };
}

// ---- Study 2: return concentration ------------------------------------------
// Total-period return with all days, vs the same period missing the N best
// days, vs missing the N worst days. Also measures best/worst-day CLUSTERING:
// the fraction of best-N days that fall within ±proximityDays of a worst-N day
// — the reason "step aside until it calms down" misses the rebounds.
export function returnConcentration(closes, topN = 10, proximityDays = 5) {
  const rets = simpleReturns(closes);
  if (rets.length <= topN * 2) throw new Error('returnConcentration: series too short');
  const total = closes[closes.length - 1] / closes[0] - 1;

  const sorted = [...rets].sort((a, b) => b - a);
  // Handle duplicates by counting occurrences, not identity.
  const bestVals = sorted.slice(0, topN);
  const worstVals = sorted.slice(-topN);

  // Indices of best/worst days for the clustering measurement.
  const indicesOf = (vals) => {
    const pool = [...vals];
    const idxs = [];
    for (let i = 0; i < rets.length; i++) {
      const k = pool.indexOf(rets[i]);
      if (k !== -1) {
        pool.splice(k, 1);
        idxs.push(i);
      }
    }
    return idxs;
  };
  const bestIdx = indicesOf(bestVals);
  const worstIdx = indicesOf(worstVals);
  const nearWorst = bestIdx.filter((b) =>
    worstIdx.some((w) => Math.abs(w - b) <= proximityDays)
  ).length;

  const compound = (skipVals) => {
    const pool = [...skipVals];
    let acc = 1;
    for (const r of rets) {
      const idx = pool.indexOf(r);
      if (idx !== -1) {
        pool.splice(idx, 1); // skip this day (treated as flat)
        continue;
      }
      acc *= 1 + r;
    }
    return acc - 1;
  };

  return {
    days: rets.length,
    topN,
    totalReturn: total,
    missingBest: compound(bestVals),
    missingWorst: compound(worstVals),
    // Fraction of the N best days that occur within ±proximityDays of one of
    // the N worst days (0..1). High values mean the extremes cluster.
    proximityDays,
    bestNearWorstPct: bestIdx.length ? nearWorst / bestIdx.length : null,
  };
}

// ---- Study 3: volatility clustering ------------------------------------------
// Autocorrelation of raw returns (direction) vs |returns| (volatility) over
// lags 1..maxLag. The canonical result: direction autocorrelation ≈ 0,
// |return| autocorrelation clearly > 0 — volatility is predictable, sign isn't.
function autocorr(xs, lag) {
  const n = xs.length - lag;
  if (n < 10) return null;
  const m = mean(xs);
  let num = 0;
  let den = 0;
  for (let i = 0; i < xs.length; i++) den += (xs[i] - m) ** 2;
  for (let i = 0; i < n; i++) num += (xs[i] - m) * (xs[i + lag] - m);
  return den === 0 ? 0 : num / den;
}

export function volClustering(returns, maxLag = 10) {
  const absR = returns.map(Math.abs);
  const rawAc = [];
  const absAc = [];
  for (let lag = 1; lag <= maxLag; lag++) {
    rawAc.push(autocorr(returns, lag));
    absAc.push(autocorr(absR, lag));
  }
  return {
    lags: maxLag,
    avgRawAutocorr: mean(rawAc.filter((x) => x != null)),
    avgAbsAutocorr: mean(absAc.filter((x) => x != null)),
    rawByLag: rawAc,
    absByLag: absAc,
  };
}

// ---- Study 4: correlation under stress ---------------------------------------
// Pearson correlation of two aligned return series, split into "calm" and
// "stress" days (stress = combined |move| in the top quartile). The canonical
// result: stress-day correlation exceeds calm-day correlation.
function pearson(xs, ys) {
  const n = xs.length;
  if (n < 10) return null;
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    dx += (xs[i] - mx) ** 2;
    dy += (ys[i] - my) ** 2;
  }
  const den = Math.sqrt(dx * dy);
  return den === 0 ? 0 : num / den;
}

// Align two bar series into return pairs over IDENTICAL horizons: returns are
// computed between consecutive SHARED dates for both assets. This matters for
// mixed calendars (crypto trades weekends, equities don't) — naively pairing
// each asset's own close-to-close returns would compare SPY's Fri→Mon move
// against BTC's Sun→Mon move and silently drop BTC's weekend, biasing the
// correlation. Here both legs of every pair span the same calendar interval.
export function alignReturns(barsA, barsB) {
  const mapA = new Map(barsA.map((x) => [x.date, x.close]));
  const mapB = new Map(barsB.map((x) => [x.date, x.close]));
  const shared = [...mapA.keys()].filter((d) => mapB.has(d)).sort();
  const a = [];
  const b = [];
  for (let i = 1; i < shared.length; i++) {
    a.push(mapA.get(shared[i]) / mapA.get(shared[i - 1]) - 1);
    b.push(mapB.get(shared[i]) / mapB.get(shared[i - 1]) - 1);
  }
  return { a, b };
}

export function stressCorrelation(barsA, barsB) {
  const { a, b } = alignReturns(barsA, barsB);
  if (a.length < 100) throw new Error('stressCorrelation: < 100 shared days');
  const combined = a.map((x, i) => Math.abs(x) + Math.abs(b[i]));
  const cutoff = [...combined].sort((x, y) => x - y)[Math.floor(combined.length * 0.75)];
  const calmA = [];
  const calmB = [];
  const stressA = [];
  const stressB = [];
  for (let i = 0; i < a.length; i++) {
    if (combined[i] >= cutoff) {
      stressA.push(a[i]);
      stressB.push(b[i]);
    } else {
      calmA.push(a[i]);
      calmB.push(b[i]);
    }
  }
  return {
    sharedDays: a.length,
    fullCorr: pearson(a, b),
    calmCorr: pearson(calmA, calmB),
    stressCorr: pearson(stressA, stressB),
  };
}

// ---- Study 5: cross-sectional momentum ---------------------------------------
// Within one asset class (shared calendar), at each rebalance: rank assets by
// trailing 12-1 momentum, hold the top and bottom quartiles equal-weight for
// `holdBars`, chain the returns. This directly tests the screen's core premise
// on OUR data — with no parameter fitting (fixed classic windows).
//
// universe: [{ symbol, bars }], all from the same class.
export function crossSectionalMomentum(universe, { periodsPerYear = 252 } = {}) {
  const lookback = periodsPerYear; // 12 months
  const skip = Math.round(periodsPerYear / 12); // skip most recent month
  const holdBars = Math.round(periodsPerYear / 12); // monthly rebalance

  // Intersect dates present in EVERY asset.
  let shared = null;
  const closeMaps = new Map();
  for (const u of universe) {
    const m = new Map(u.bars.map((b) => [b.date, b.close]));
    closeMaps.set(u.symbol, m);
    const dates = new Set(m.keys());
    shared = shared === null ? dates : new Set([...shared].filter((d) => dates.has(d)));
  }
  const dates = [...shared].sort();
  if (dates.length < lookback + holdBars + skip + 5) {
    return { insufficientData: true };
  }

  const closeAt = (sym, di) => closeMaps.get(sym).get(dates[di]);
  const q = Math.max(2, Math.floor(universe.length / 4));

  let topAcc = 1;
  let botAcc = 1;
  let allAcc = 1;
  let rebalances = 0;
  let topWins = 0;

  for (let di = lookback + skip; di + holdBars < dates.length; di += holdBars) {
    // Rank by classic 12-1 momentum as of dates[di]: the return from t-12mo to
    // t-1mo (an 11-month window ending one month before entry). Past data only.
    const ranked = universe
      .map((u) => ({
        symbol: u.symbol,
        mom: closeAt(u.symbol, di - skip) / closeAt(u.symbol, di - lookback) - 1,
      }))
      .sort((a, b) => b.mom - a.mom);

    const hold = (syms) =>
      mean(syms.map((s) => closeAt(s, di + holdBars) / closeAt(s, di) - 1));

    const topRet = hold(ranked.slice(0, q).map((r) => r.symbol));
    const botRet = hold(ranked.slice(-q).map((r) => r.symbol));
    const allRet = hold(ranked.map((r) => r.symbol));

    topAcc *= 1 + topRet;
    botAcc *= 1 + botRet;
    allAcc *= 1 + allRet;
    rebalances++;
    if (topRet > botRet) topWins++;
  }

  return {
    insufficientData: false,
    assets: universe.length,
    quartileSize: q,
    rebalances,
    topQuartileReturn: topAcc - 1,
    bottomQuartileReturn: botAcc - 1,
    equalWeightReturn: allAcc - 1,
    topBeatBottomPct: rebalances ? topWins / rebalances : null,
  };
}

// ---- Study 6: luck vs skill ----------------------------------------------------
// Given the real strategy's trades on an asset, generate N random traders that
// make the same NUMBER of trades with the same DURATIONS, at random times, with
// random direction, paying the same costs — then report where the real
// strategy's total P&L falls in that random distribution. A strategy that isn't
// comfortably above the ~95th percentile is not distinguishable from luck.
export function luckBenchmark(bars, trades, {
  n = 1000,
  seed = 11,
  feeBps = 5,
  slippageBps = 5,
} = {}) {
  if (trades.length < 3) return { insufficientData: true };
  const rng = makeRng(seed);
  const durations = trades.map((t) => Math.max(1, t.barOut - t.barIn));
  const frac = (feeBps + slippageBps) / 10_000;

  // Real strategy's total return in R-free terms: compound trade returns on
  // price (unit position per trade for comparability).
  const tradeReturn = (entryIdx, exitIdx, dir) => {
    const entry = bars[entryIdx].open * (dir > 0 ? 1 + frac : 1 - frac);
    const exit = bars[exitIdx].close * (dir > 0 ? 1 - frac : 1 + frac);
    return dir * (exit - entry) / entry;
  };

  const realReturn = trades.reduce((acc, t) => {
    const r = tradeReturn(
      Math.min(t.barIn, bars.length - 1),
      Math.min(t.barOut, bars.length - 1),
      t.dir
    );
    return acc * (1 + r);
  }, 1) - 1;

  const randomReturns = [];
  for (let k = 0; k < n; k++) {
    let acc = 1;
    for (const d of durations) {
      const maxStart = bars.length - d - 1;
      const start = 1 + Math.floor(rng() * (maxStart - 1));
      const dir = rng() < 0.5 ? 1 : -1;
      acc *= 1 + tradeReturn(start, start + d, dir);
    }
    randomReturns.push(acc - 1);
  }
  randomReturns.sort((a, b) => a - b);
  const below = randomReturns.filter((r) => r < realReturn).length;

  return {
    insufficientData: false,
    trades: trades.length,
    randomTraders: n,
    realReturn,
    randomMedian: randomReturns[Math.floor(n / 2)],
    randomP95: randomReturns[Math.floor(n * 0.95)],
    percentile: below / n,
  };
}
