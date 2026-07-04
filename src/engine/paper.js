// Automated paper-trading executor.
//
// This is the honest form of "make trades automatically": a stateful engine
// that consumes market bars ONE AT A TIME (as they would arrive live), runs the
// strategy pipeline, and places SIMULATED orders — tracking cash, position,
// a trade blotter, and a live equity curve. It moves no real money and needs no
// exchange credentials.
//
// Deploy path: `onBar()` is data-source agnostic. Today it's fed simulated bars;
// point it at a real websocket/candle feed and the same code paper-trades live.
// You watch it behave for weeks BEFORE the question of real capital ever arises.
// Nothing here promises profit — it promises transparency.

import { computeContext, detect, validate, DEFAULT_PARAMS } from './strategy';
import { positionSize } from './risk';

const DEFAULTS = {
  startingEquity: 10_000,
  feeBps: 5,
  slippageBps: 5,
  kellyMultiplier: 0.25,
  maxRiskPerTrade: 0.02,
  priorWinProb: 0.5,
  priorPayoff: 1.5,
  // How many bars of history to keep for indicator computation.
  lookback: 260,
};

export class PaperTrader {
  constructor({ params = {}, config = {} } = {}) {
    this.params = { ...DEFAULT_PARAMS, ...params };
    this.cfg = { ...DEFAULTS, ...config };

    this.cash = this.cfg.startingEquity;
    this.position = null; // { dir, entry, units, stop, target, riskAmount, openedAt }
    this.pending = null; // order queued on bar t, filled at open of bar t+1
    this.bars = []; // rolling history buffer
    this.blotter = []; // closed trades
    this.equityCurve = []; // marked-to-market each bar
    this.barCount = 0;

    // Rolling edge estimate (same discipline as the backtester).
    this._wins = 0;
    this._losses = 0;
    this._sumWinR = 0;
    this._sumLossR = 0;
  }

  _cost(price, side) {
    const frac = (this.cfg.feeBps + this.cfg.slippageBps) / 10_000;
    return side > 0 ? price * (1 + frac) : price * (1 - frac);
  }

  _estimateEdge() {
    const n = this._wins + this._losses;
    const winProb = n >= 20 ? this._wins / n : this.cfg.priorWinProb;
    const avgWinR = this._wins > 0 ? this._sumWinR / this._wins : 1;
    const avgLossR = this._losses > 0 ? this._sumLossR / this._losses : 1;
    const payoff =
      n >= 20 && avgLossR > 0 ? avgWinR / avgLossR : this.cfg.priorPayoff;
    return { winProb, payoff };
  }

  _closePosition(exitPriceRaw, reason) {
    const p = this.position;
    const exitPrice = this._cost(exitPriceRaw, p.dir > 0 ? -1 : 1);
    const pnl = p.dir * (exitPrice - p.entry) * p.units;
    this.cash += pnl;
    const rMultiple = p.riskAmount > 0 ? pnl / p.riskAmount : 0;

    if (pnl > 0) {
      this._wins++;
      this._sumWinR += rMultiple;
    } else {
      this._losses++;
      this._sumLossR += Math.abs(rMultiple);
    }

    this.blotter.push({
      dir: p.dir,
      entry: p.entry,
      exit: exitPrice,
      units: p.units,
      pnl,
      rMultiple,
      openedAt: p.openedAt,
      closedAt: this.barCount,
      reason,
    });
    this.position = null;
  }

  // Feed the trader the next bar. Returns a lightweight event describing what
  // happened (for logging / a live blotter UI).
  onBar(bar) {
    this.barCount++;
    this.bars.push(bar);
    if (this.bars.length > this.cfg.lookback) this.bars.shift();

    const events = [];

    // 1) Fill any order queued on the previous bar, at this bar's open.
    if (this.pending && !this.position) {
      const o = this.pending;
      const entry = this._cost(bar.open, o.dir > 0 ? 1 : -1);
      const stop = o.dir > 0 ? entry - o.stopDistance : entry + o.stopDistance;
      const target =
        o.dir > 0
          ? entry + this.params.takeProfitR * o.stopDistance
          : entry - this.params.takeProfitR * o.stopDistance;
      this.position = {
        dir: o.dir,
        entry,
        units: o.units,
        stop,
        target,
        riskAmount: o.riskAmount,
        openedAt: this.barCount,
      };
      events.push({ type: 'FILL', dir: o.dir, price: entry, units: o.units });
    }
    this.pending = null;

    // 2) Manage an open position: stop / target / opposing signal.
    if (this.position) {
      const hitStop =
        this.position.dir > 0 ? bar.low <= this.position.stop : bar.high >= this.position.stop;
      const hitTarget =
        this.position.dir > 0
          ? bar.high >= this.position.target
          : bar.low <= this.position.target;

      if (hitStop) {
        this._closePosition(this.position.stop, 'stop');
        events.push({ type: 'EXIT', reason: 'stop' });
      } else if (hitTarget) {
        this._closePosition(this.position.target, 'target');
        events.push({ type: 'EXIT', reason: 'target' });
      }
    }

    // 3) Look for a new entry when flat (signal from data up to THIS bar; fill
    //    next bar's open — no lookahead).
    if (!this.position && this.bars.length >= 40) {
      const ctx = computeContext(this.bars, this.params);
      const i = this.bars.length - 1;
      const dir = detect(ctx, i, this.params);

      // Exit on an opposing signal while in a position is handled above via
      // stop/target; here we only open when flat.
      const v = validate(ctx, i, dir, this.params);
      if (v.ok && ctx.atr[i] != null) {
        const stopDistance = this.params.atrStopMult * ctx.atr[i];
        const { winProb, payoff } = this._estimateEdge();
        const sized = positionSize({
          equity: this.cash,
          winProb,
          payoffRatio: payoff,
          stopDistance,
          kellyMultiplier: this.cfg.kellyMultiplier,
          maxRiskPerTrade: this.cfg.maxRiskPerTrade,
        });
        if (sized.units > 0) {
          this.pending = {
            dir,
            units: sized.units,
            stopDistance,
            riskAmount: sized.riskAmount,
            confidence: v.confidence,
          };
          events.push({ type: 'ORDER', dir, confidence: v.confidence });
        }
      }
    }

    // 4) Mark-to-market equity.
    let equity = this.cash;
    if (this.position) {
      equity += this.position.dir * (bar.close - this.position.entry) * this.position.units;
    }
    this.equityCurve.push(equity);

    return { bar: this.barCount, events, equity };
  }

  // Current state for a dashboard / log line.
  snapshot() {
    const equity = this.equityCurve[this.equityCurve.length - 1] ?? this.cash;
    return {
      barCount: this.barCount,
      cash: this.cash,
      equity,
      openPosition: this.position
        ? { dir: this.position.dir, entry: this.position.entry, units: this.position.units }
        : null,
      closedTrades: this.blotter.length,
      totalReturn: equity / this.cfg.startingEquity - 1,
    };
  }
}

// Convenience: run a whole (simulated or real) bar series through a fresh trader.
export function runPaperSession(bars, opts = {}) {
  const trader = new PaperTrader(opts);
  const log = [];
  for (const bar of bars) {
    const r = trader.onBar(bar);
    if (r.events.length) log.push(r);
  }
  return { trader, log, snapshot: trader.snapshot(), blotter: trader.blotter };
}
