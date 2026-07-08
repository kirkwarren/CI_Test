// Weekly rules-based model allocation.
//
// NOT financial advice, NOT a prediction. This is a transparent, deterministic
// rule set whose every line traces to something this project MEASURED:
//
//   - Core sleeve, inverse-vol weighted ......... vol is the predictable input
//     (INSIGHTS study 3); inverse-vol weighting equalizes risk contributions
//   - Stress-diversifier sleeve (TLT/GLD) ....... the only pairs whose
//     correlation stayed low on stress days (study 4)
//   - Momentum tilt, SMALL and bounded .......... the factor is documented but
//     FAILED in our own 3y window (study 5) — hence a tilt, never a core
//   - Crypto capped and trend-gated ............. highest tails/vol in the
//     data (study 1), no luck-adjusted evidence for any timing edge (DSR 0/38)
//   - Vol-target overlay into cash .............. sizing for measured risk,
//     the one thing the data says we can manage
//
// Output is a set of weights plus the rule that produced each one, so the
// reasoning is auditable line by line.

import { mean, stddev } from './metrics';

export const ALLOCATION_RULES = {
  coreSleeve: 0.55,
  coreAssets: ['SPY', 'QQQ', 'EFA', 'EEM', 'IWM'],
  coreMaxWeight: 0.2,
  diversifierSleeve: 0.25,
  diversifierAssets: ['TLT', 'GLD'],
  momentumSleeve: 0.1,
  momentumPicks: 3, // top-N equities/ETFs by composite screen
  cryptoSleeve: 0.05, // granted ONLY when the trend gate is open
  cryptoAsset: 'BTC-USD',
  cashFloor: 0.05,
  portfolioVolTarget: 0.12, // annualized; overlay scales risk sleeves into cash
  volLookbackDays: 90,
};

// Inverse-vol weights over a sleeve, with a per-asset cap; excess is
// redistributed proportionally among uncapped members.
export function inverseVolWeights(vols, cap = 1) {
  const inv = vols.map((v) => (v > 0 ? 1 / v : 0));
  const total = inv.reduce((a, b) => a + b, 0);
  if (total === 0) return vols.map(() => 1 / vols.length);
  let w = inv.map((x) => x / total);
  // Iteratively enforce the cap.
  for (let iter = 0; iter < 10; iter++) {
    const over = w.map((x) => x > cap);
    if (!over.some(Boolean)) break;
    let excess = 0;
    let freeSum = 0;
    w = w.map((x, i) => {
      if (over[i]) {
        excess += x - cap;
        return cap;
      }
      freeSum += x;
      return x;
    });
    if (freeSum === 0) break;
    w = w.map((x, i) => (over[i] ? x : x + (excess * x) / freeSum));
  }
  return w;
}

// Aligned daily returns matrix for portfolio-vol estimation (shared dates).
function alignedReturns(barsBySymbol, symbols, lookback) {
  const maps = symbols.map((s) => new Map(barsBySymbol[s].map((b) => [b.date, b.close])));
  let shared = null;
  for (const m of maps) {
    const ds = new Set(m.keys());
    shared = shared === null ? ds : new Set([...shared].filter((d) => ds.has(d)));
  }
  const dates = [...shared].sort().slice(-(lookback + 1));
  const rets = [];
  for (let i = 1; i < dates.length; i++) {
    rets.push(symbols.map((s, k) => maps[k].get(dates[i]) / maps[k].get(dates[i - 1]) - 1));
  }
  return rets; // rows = days, cols = symbols
}

// Realized annualized vol of a weighted portfolio over the lookback window.
export function portfolioVol(barsBySymbol, weights, { lookback = 90, ppy = 252 } = {}) {
  const symbols = Object.keys(weights).filter((s) => weights[s] > 0 && barsBySymbol[s]);
  if (!symbols.length) return 0;
  const rows = alignedReturns(barsBySymbol, symbols, lookback);
  if (rows.length < 20) return null;
  const pr = rows.map((r) => r.reduce((a, x, k) => a + x * weights[symbols[k]], 0));
  return stddev(pr) * Math.sqrt(ppy);
}

// Build the weekly allocation.
//   inputs.volsBySymbol   - trailing 12m annualized vol per symbol
//   inputs.screenTop      - equities/ETFs ordered by composite screen (best first)
//   inputs.cryptoAbove200d- trend gate state for the crypto sleeve
//   inputs.barsBySymbol   - daily bars for portfolio-vol overlay (optional)
export function buildAllocation(inputs, rules = ALLOCATION_RULES) {
  const lines = []; // { symbol, weight, sleeve, rule }
  const R = rules;

  // Core sleeve — inverse vol, capped.
  const coreVols = R.coreAssets.map((s) => inputs.volsBySymbol[s] ?? 0.2);
  const coreW = inverseVolWeights(coreVols, R.coreMaxWeight / R.coreSleeve);
  R.coreAssets.forEach((s, i) => {
    lines.push({
      symbol: s,
      weight: R.coreSleeve * coreW[i],
      sleeve: 'core',
      rule: `inverse-vol core (12m vol ${(coreVols[i] * 100).toFixed(0)}%), cap ${(R.coreMaxWeight * 100).toFixed(0)}%`,
    });
  });

  // Stress diversifiers — inverse vol.
  const divVols = R.diversifierAssets.map((s) => inputs.volsBySymbol[s] ?? 0.15);
  const divW = inverseVolWeights(divVols);
  R.diversifierAssets.forEach((s, i) => {
    lines.push({
      symbol: s,
      weight: R.diversifierSleeve * divW[i],
      sleeve: 'diversifier',
      rule: 'low measured STRESS-day correlation to equities (study 4)',
    });
  });

  // Momentum tilt — small, top-N from the screen, equal weight.
  const picks = (inputs.screenTop ?? []).slice(0, R.momentumPicks);
  for (const s of picks) {
    lines.push({
      symbol: s,
      weight: R.momentumSleeve / Math.max(1, picks.length),
      sleeve: 'momentum-tilt',
      rule: `top-${R.momentumPicks} composite screen; documented factor, but it FAILED our own 3y test (study 5) — kept small`,
    });
  }

  // Crypto — trend-gated, capped.
  let cash = R.cashFloor;
  if (inputs.cryptoAbove200d) {
    lines.push({
      symbol: R.cryptoAsset,
      weight: R.cryptoSleeve,
      sleeve: 'crypto',
      rule: 'above 200d trend gate; capped small — fattest measured tails (study 1), no luck-adjusted timing evidence (DSR 0/38)',
    });
  } else {
    cash += R.cryptoSleeve;
  }

  // Merge duplicate symbols (a momentum pick can also be a core holding).
  const merged = new Map();
  for (const l of lines) {
    const prev = merged.get(l.symbol);
    if (prev) {
      prev.weight += l.weight;
      prev.rule += ` + ${l.sleeve}: ${l.rule}`;
    } else {
      merged.set(l.symbol, { ...l });
    }
  }

  // Vol-target overlay: scale ALL risk lines toward cash if the portfolio's
  // realized vol exceeds target. Uses actual co-movements, not folklore.
  let overlayScale = 1;
  let realizedVol = null;
  if (inputs.barsBySymbol) {
    const weights = Object.fromEntries([...merged.values()].map((l) => [l.symbol, l.weight]));
    realizedVol = portfolioVol(inputs.barsBySymbol, weights, {
      lookback: R.volLookbackDays,
      ppy: 252,
    });
    if (realizedVol && realizedVol > R.portfolioVolTarget) {
      overlayScale = R.portfolioVolTarget / realizedVol;
    }
  }

  const allocations = [...merged.values()]
    .map((l) => ({ ...l, weight: l.weight * overlayScale }))
    .sort((a, b) => b.weight - a.weight);
  const invested = allocations.reduce((a, l) => a + l.weight, 0);
  cash = 1 - invested;

  return {
    asOf: inputs.asOf ?? null,
    allocations,
    cash,
    overlay: { realizedVol, target: R.portfolioVolTarget, scale: overlayScale },
    rules: R,
    disclaimer:
      'Rules-based model portfolio for research/education. Not financial advice, not a prediction. Every weight traces to a measured, cited rule; the rules are tilts and risk controls, not knowledge of the future.',
  };
}
