// Public entry point for the trading engine.
//
// `runFullAnalysis` wires the whole honest pipeline together:
//   simulate market -> backtest strategy -> Monte Carlo robustness ->
//   multi-asset/timeframe robustness grid.
//
// Everything is deterministic given the seeds, and every number it returns is
// one you'd actually want before risking money — especially the drawdowns and
// the probability-of-loss, which the hype dashboards omit.

import { generateMarket } from './market';
import { runBacktest, DEFAULT_CONFIG } from './backtest';
import { monteCarlo } from './montecarlo';
import { walkForward } from './walkforward';
import { DEFAULT_PARAMS } from './strategy';

export { generateMarket } from './market';
export { runBacktest, DEFAULT_CONFIG } from './backtest';
export { monteCarlo } from './montecarlo';
export { walkForward, defaultGrid } from './walkforward';
export { PaperTrader, runPaperSession } from './paper';
export { DEFAULT_PARAMS, computeContext, detect, validate } from './strategy';
export { kellyFraction, positionSize } from './risk';
export * as indicators from './indicators';
export * as metrics from './metrics';

// A small roster of pretend assets with different characters, so the robustness
// grid isn't all one market. (Names are illustrative — the data is simulated.)
export const ASSETS = [
  { symbol: 'BTC', seed: 101, volAnnual: 0.55, driftAnnual: 0.08 },
  { symbol: 'ETH', seed: 202, volAnnual: 0.7, driftAnnual: 0.05 },
  { symbol: 'SOL', seed: 303, volAnnual: 0.95, driftAnnual: 0.02 },
  { symbol: 'XRP', seed: 404, volAnnual: 0.8, driftAnnual: -0.03 },
  { symbol: 'ADA', seed: 505, volAnnual: 0.75, driftAnnual: 0.0 },
  { symbol: 'DOGE', seed: 606, volAnnual: 1.2, driftAnnual: -0.05 },
];

export function runFullAnalysis({
  bars = 1500,
  params = {},
  config = {},
  mcPaths = 4000,
} = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const mergedParams = { ...DEFAULT_PARAMS, ...params };

  // Primary asset (BTC) — the one the dashboard shows in detail.
  const primary = ASSETS[0];
  const primaryBars = generateMarket({
    seed: primary.seed,
    n: bars,
    volAnnual: primary.volAnnual,
    driftAnnual: primary.driftAnnual,
  });
  const primaryResult = runBacktest(primaryBars, mergedParams, cfg);
  const mc = monteCarlo(primaryResult.trades, {
    paths: mcPaths,
    startingEquity: cfg.startingEquity,
    riskPerTrade: cfg.maxRiskPerTrade,
  });

  // Walk-forward: optimize on in-sample windows, test out-of-sample. This is the
  // honest torture test that most "trading bots" quietly fail.
  const wf = walkForward(primaryBars, { folds: 4, config: cfg });

  // Robustness grid: run every asset and collect headline metrics. A strategy
  // that only works on one cherry-picked asset is not a strategy.
  const grid = ASSETS.map((a) => {
    const b = generateMarket({
      seed: a.seed,
      n: bars,
      volAnnual: a.volAnnual,
      driftAnnual: a.driftAnnual,
    });
    const res = runBacktest(b, mergedParams, cfg);
    return {
      symbol: a.symbol,
      totalReturn: res.metrics.totalReturn,
      sharpe: res.metrics.sharpe,
      maxDrawdown: res.metrics.maxDrawdown,
      trades: res.metrics.trades,
      winRate: res.metrics.winRate,
    };
  });

  return {
    primary: {
      symbol: primary.symbol,
      bars: primaryBars,
      ...primaryResult,
    },
    monteCarlo: mc,
    walkForward: wf,
    grid,
    config: cfg,
    params: mergedParams,
  };
}
