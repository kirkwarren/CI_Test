// Backtest engine — the "Fill" and "Settle" stages of the pipeline.
//
// Runs the strategy over historical (here: simulated) bars with realistic
// frictions: commission and slippage on every fill. Ignoring these is the #1
// way backtests lie — a strategy that looks great at zero cost often bleeds out
// once you pay the spread on every trade.
//
// Model: single asset, long/short, one position at a time. Entry at next bar's
// open after a validated signal (no same-bar lookahead). Exit on ATR stop,
// take-profit at R multiple, or an opposing signal.

import { computeContext, detect, validate, DEFAULT_PARAMS } from './strategy';
import { positionSize } from './risk';
import {
  returnsFromEquity,
  sharpe,
  maxDrawdown,
  cagr,
  tradeStats,
} from './metrics';

export const DEFAULT_CONFIG = {
  startingEquity: 10_000,
  feeBps: 5, // 0.05% commission per side
  slippageBps: 5, // 0.05% slippage per side
  kellyMultiplier: 0.25, // fractional Kelly
  maxRiskPerTrade: 0.02, // hard cap: risk at most 2% of equity per trade
  barsPerYear: 105_000, // ~5-min crypto bars
  // Rolling estimates of edge, seeded conservatively and updated as trades close.
  priorWinProb: 0.5,
  priorPayoff: 1.5,
};

function applyCost(price, side, cfg) {
  // side: +1 buy (pay up), -1 sell (receive less)
  const frac = (cfg.feeBps + cfg.slippageBps) / 10_000;
  return side > 0 ? price * (1 + frac) : price * (1 - frac);
}

export function runBacktest(bars, userParams = {}, userConfig = {}) {
  const params = { ...DEFAULT_PARAMS, ...userParams };
  const cfg = { ...DEFAULT_CONFIG, ...userConfig };
  const ctx = computeContext(bars, params);

  let equity = cfg.startingEquity;
  const equityCurve = [equity];
  const trades = [];

  // Rolling edge estimate (updated from realized trades; falls back to priors).
  let winCount = 0;
  let lossCount = 0;
  let sumWinR = 0;
  let sumLossR = 0;

  let position = null; // { dir, entry, units, stop, target, initialRisk, barIn }

  const estimateEdge = () => {
    const n = winCount + lossCount;
    const winProb = n >= 20 ? winCount / n : cfg.priorWinProb;
    const avgWinR = winCount > 0 ? sumWinR / winCount : 1;
    const avgLossR = lossCount > 0 ? sumLossR / lossCount : 1;
    const payoff = n >= 20 && avgLossR > 0 ? avgWinR / avgLossR : cfg.priorPayoff;
    return { winProb, payoff };
  };

  const closePosition = (exitPriceRaw, barIndex, reason) => {
    const exitPrice = applyCost(exitPriceRaw, position.dir > 0 ? -1 : 1, cfg);
    const pnl = position.dir * (exitPrice - position.entry) * position.units;
    equity += pnl;
    const rMultiple = position.riskAmount > 0 ? pnl / position.riskAmount : 0;

    if (pnl > 0) {
      winCount++;
      sumWinR += rMultiple;
    } else {
      lossCount++;
      sumLossR += Math.abs(rMultiple);
    }

    trades.push({
      dir: position.dir,
      entry: position.entry,
      exit: exitPrice,
      units: position.units,
      pnl,
      rMultiple,
      barIn: position.barIn,
      barOut: barIndex,
      reason,
    });
    position = null;
  };

  for (let i = 0; i < bars.length; i++) {
    const bar = bars[i];

    // --- Manage an open position (check stop / target intrabar) ---
    if (position) {
      const hitStop =
        position.dir > 0 ? bar.low <= position.stop : bar.high >= position.stop;
      const hitTarget =
        position.dir > 0
          ? bar.high >= position.target
          : bar.low <= position.target;

      if (hitStop) {
        closePosition(position.stop, i, 'stop');
      } else if (hitTarget) {
        closePosition(position.target, i, 'target');
      } else {
        // Opposing signal => exit at close.
        const sig = detect(ctx, i, params);
        if (sig !== 0 && sig !== position.dir) {
          closePosition(bar.close, i, 'reverse');
        }
      }
    }

    // --- Look for a new entry (only when flat) ---
    if (!position && i + 1 < bars.length) {
      const dir = detect(ctx, i, params);
      const v = validate(ctx, i, dir, params);
      if (v.ok) {
        const atrVal = ctx.atr[i];
        const nextOpenRaw = bars[i + 1].open;
        const entry = applyCost(nextOpenRaw, dir > 0 ? 1 : -1, cfg);
        const stopDistance = params.atrStopMult * atrVal;
        const stop = dir > 0 ? entry - stopDistance : entry + stopDistance;
        const target =
          dir > 0
            ? entry + params.takeProfitR * stopDistance
            : entry - params.takeProfitR * stopDistance;

        const { winProb, payoff } = estimateEdge();
        const sized = positionSize({
          equity,
          winProb,
          payoffRatio: payoff,
          stopDistance,
          kellyMultiplier: cfg.kellyMultiplier,
          maxRiskPerTrade: cfg.maxRiskPerTrade,
        });

        if (sized.units > 0) {
          position = {
            dir,
            entry,
            units: sized.units,
            stop,
            target,
            initialRisk: stopDistance,
            riskAmount: sized.riskAmount,
            barIn: i + 1,
          };
        }
      }
    }

    // --- Mark-to-market equity for the curve ---
    let markEquity = equity;
    if (position) {
      markEquity += position.dir * (bar.close - position.entry) * position.units;
    }
    equityCurve.push(markEquity);
  }

  // Force-close any position still open at the end.
  if (position) {
    closePosition(bars[bars.length - 1].close, bars.length - 1, 'eod');
    equityCurve[equityCurve.length - 1] = equity;
  }

  const rets = returnsFromEquity(equityCurve);
  const tstats = tradeStats(trades);

  return {
    equityCurve,
    trades,
    metrics: {
      startingEquity: cfg.startingEquity,
      endingEquity: equity,
      totalReturn: equity / cfg.startingEquity - 1,
      cagr: cagr(equityCurve, cfg.barsPerYear),
      sharpe: sharpe(rets, cfg.barsPerYear),
      maxDrawdown: maxDrawdown(equityCurve),
      ...tstats,
    },
  };
}
