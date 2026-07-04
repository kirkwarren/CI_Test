// Walk-forward analysis — the gold standard for honest strategy evaluation.
//
// This is the technique that actually separates professional quant research from
// influencer screenshots. The trap: if you tune a strategy's parameters on a
// chunk of history, you can ALWAYS make the backtest look spectacular — you've
// just memorized the noise. The only honest question is: do those tuned
// parameters still work on data the optimizer never saw?
//
// Walk-forward answers it. We roll a window across time. In each fold we:
//   1. grid-search parameters on an IN-SAMPLE window (optimize)
//   2. lock those parameters and run them on the next, UNSEEN OUT-OF-SAMPLE
//      window (test)
// Stitching the out-of-sample slices together gives a realistic equity curve.
// The gap between in-sample and out-of-sample performance is the "overfitting
// tax" — and it is almost always brutal. That collapse is the whole lesson.

import { runBacktest } from './backtest';

// A deliberately small grid — enough to overfit on, which is exactly the point.
export function defaultGrid() {
  const grid = [];
  for (const atrStopMult of [1.5, 2.0, 2.5]) {
    for (const takeProfitR of [1.5, 2.0, 3.0]) {
      for (const emaFast of [8, 12]) {
        grid.push({ atrStopMult, takeProfitR, emaFast });
      }
    }
  }
  return grid;
}

// Score a backtest for the optimizer. Reward return, punish drawdown, and
// refuse to trust results with too few trades (small samples lie).
function score(metrics) {
  if (metrics.trades < 3) return -Infinity;
  return metrics.totalReturn / (metrics.maxDrawdown + 0.02);
}

export function walkForward(bars, {
  folds = 4,
  grid = defaultGrid(),
  config = {},
} = {}) {
  const window = Math.floor(bars.length / (folds + 1));
  if (window < 60) {
    return { insufficientData: true, folds: [], aggregate: null };
  }

  const foldResults = [];

  for (let f = 0; f < folds; f++) {
    const isBars = bars.slice(f * window, (f + 1) * window);
    const oosBars = bars.slice((f + 1) * window, (f + 2) * window);
    if (oosBars.length < 60) break;

    // 1) Optimize on in-sample.
    let best = null;
    for (const params of grid) {
      const res = runBacktest(isBars, params, config);
      const s = score(res.metrics);
      if (!best || s > best.score) {
        best = { score: s, params, metrics: res.metrics };
      }
    }
    if (!best || best.score === -Infinity) continue;

    // 2) Test the winning params on untouched out-of-sample data.
    const oos = runBacktest(oosBars, best.params, config);

    foldResults.push({
      fold: f,
      params: best.params,
      inSample: {
        totalReturn: best.metrics.totalReturn,
        sharpe: best.metrics.sharpe,
        maxDrawdown: best.metrics.maxDrawdown,
        trades: best.metrics.trades,
      },
      outOfSample: {
        totalReturn: oos.metrics.totalReturn,
        sharpe: oos.metrics.sharpe,
        maxDrawdown: oos.metrics.maxDrawdown,
        trades: oos.metrics.trades,
      },
    });
  }

  if (foldResults.length === 0) {
    return { insufficientData: true, folds: [], aggregate: null };
  }

  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const isReturns = foldResults.map((r) => r.inSample.totalReturn);
  const oosReturns = foldResults.map((r) => r.outOfSample.totalReturn);
  const isSharpes = foldResults.map((r) => r.inSample.sharpe);
  const oosSharpes = foldResults.map((r) => r.outOfSample.sharpe);

  const avgIsReturn = avg(isReturns);
  const avgOosReturn = avg(oosReturns);

  // The degradation RATIO is only meaningful when there is a real positive
  // in-sample edge to lose — dividing by a near-zero or negative IS return
  // produces garbage (thousands of percent). Below the threshold we report
  // null and let callers use the absolute gap instead.
  const MIN_IS_EDGE = 0.005;

  return {
    insufficientData: false,
    folds: foldResults,
    aggregate: {
      avgIsReturn,
      avgOosReturn,
      avgIsSharpe: avg(isSharpes),
      avgOosSharpe: avg(oosSharpes),
      // Absolute overfitting gap in return points: always well-defined.
      oosGap: avgIsReturn - avgOosReturn,
      // The overfitting tax as a fraction of the in-sample edge. ~1 means the
      // edge fully collapsed out-of-sample; null when IS edge is too small for
      // the ratio to mean anything.
      degradation:
        avgIsReturn > MIN_IS_EDGE ? (avgIsReturn - avgOosReturn) / avgIsReturn : null,
      oosProfitableFolds: oosReturns.filter((r) => r > 0).length,
      totalFolds: foldResults.length,
    },
  };
}
