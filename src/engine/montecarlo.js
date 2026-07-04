// Monte Carlo robustness analysis.
//
// A single backtest is one path through history — it can look great by luck.
// The honest question is: "given this strategy's trade distribution, what's the
// RANGE of outcomes, including the bad ones?"
//
// We bootstrap-resample the realized trade R-multiples many times, reordering
// and recompounding them, to build a distribution of ending equity and worst
// drawdown. The screenshot shows a Monte Carlo panel too — but only ever the
// rosy expected value. The whole point of Monte Carlo is the *downside tail*.

import { makeRng } from './random';
import { maxDrawdown } from './metrics';

// trades: array with `rMultiple`. riskPerTrade: fraction of equity risked
// per trade (matches the backtest's cap so the compounding is realistic).
export function monteCarlo(trades, {
  paths = 5000,
  startingEquity = 10_000,
  riskPerTrade = 0.02,
  seed = 7,
} = {}) {
  const rmults = trades.map((t) => t.rMultiple).filter((r) => Number.isFinite(r));
  if (rmults.length < 5) {
    return {
      paths: 0,
      insufficientData: true,
      endings: [],
      percentiles: {},
      probLoss: null,
      medianMaxDrawdown: null,
    };
  }

  const rng = makeRng(seed);
  const n = rmults.length;
  const endings = [];
  const drawdowns = [];

  for (let p = 0; p < paths; p++) {
    let equity = startingEquity;
    const curve = [equity];
    for (let k = 0; k < n; k++) {
      const r = rmults[(rng() * n) | 0];
      // Each trade risks `riskPerTrade` of current equity; gain is r * that risk.
      equity += equity * riskPerTrade * r;
      if (equity <= 0) {
        equity = 0;
        curve.push(0);
        break;
      }
      curve.push(equity);
    }
    endings.push(equity);
    drawdowns.push(maxDrawdown(curve));
  }

  endings.sort((a, b) => a - b);
  drawdowns.sort((a, b) => a - b);

  const pct = (arr, q) => arr[Math.min(arr.length - 1, Math.floor(q * arr.length))];

  return {
    paths,
    insufficientData: false,
    endings,
    percentiles: {
      p5: pct(endings, 0.05),
      p25: pct(endings, 0.25),
      p50: pct(endings, 0.5),
      p75: pct(endings, 0.75),
      p95: pct(endings, 0.95),
    },
    // Honest headline number: how often did this strategy LOSE money?
    probLoss: endings.filter((e) => e < startingEquity).length / endings.length,
    probRuin: endings.filter((e) => e <= startingEquity * 0.5).length / endings.length,
    medianMaxDrawdown: pct(drawdowns, 0.5),
    worstMaxDrawdown: drawdowns[drawdowns.length - 1],
  };
}
