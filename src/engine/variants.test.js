import { computeContext, detect, signalVotes, DEFAULT_PARAMS } from './strategy';
import { runBacktest } from './backtest';
import { generateMarket } from './market';

const P = (over = {}) => ({ ...DEFAULT_PARAMS, ...over });

function barsFromCloses(closes) {
  return closes.map((c, i) => ({
    i,
    date: `d${i}`,
    open: c,
    high: c * 1.005,
    low: c * 0.995,
    close: c,
    volume: 1,
  }));
}

describe('signal modes', () => {
  test('meanrev goes long at oversold RSI and short at overbought', () => {
    // 30 down days then flat => RSI deeply oversold at the trough.
    const down = [];
    let p = 100;
    for (let i = 0; i < 60; i++) {
      p *= 0.99;
      down.push(p);
    }
    const params = P({ signalMode: 'meanrev' });
    const ctx = computeContext(barsFromCloses(down), params);
    expect(detect(ctx, down.length - 1, params)).toBe(1); // fade the dump

    const up = [];
    p = 100;
    for (let i = 0; i < 60; i++) {
      p *= 1.01;
      up.push(p);
    }
    const ctx2 = computeContext(barsFromCloses(up), params);
    expect(detect(ctx2, up.length - 1, params)).toBe(-1); // fade the rip
  });

  test('breakout fires only beyond the PRIOR channel extreme', () => {
    // 60 flat bars then a bar clearly above the prior 55-bar high.
    const closes = Array.from({ length: 60 }, () => 100);
    closes.push(103); // breaks above prior highs (~100.5 incl. wick)
    const params = P({ signalMode: 'breakout' });
    const ctx = computeContext(barsFromCloses(closes), params);
    expect(detect(ctx, closes.length - 1, params)).toBe(1);
    // A bar inside the channel does not fire.
    expect(detect(ctx, closes.length - 2, params)).toBe(0);
  });

  test('ensemble requires at least two agreeing votes', () => {
    const bars = generateMarket({ seed: 42, n: 600 });
    const params = P({ signalMode: 'ensemble' });
    const ctx = computeContext(bars, params);
    for (let i = 100; i < bars.length; i++) {
      const d = detect(ctx, i, params);
      if (d !== 0) {
        const v = signalVotes(ctx, i, params);
        const sum = v.trend + v.meanRev + v.breakout;
        expect(Math.abs(sum)).toBeGreaterThanOrEqual(2);
        expect(Math.sign(sum)).toBe(d);
      }
    }
  });

  test('all modes produce runnable, deterministic backtests', () => {
    const bars = generateMarket({ seed: 7, n: 900 });
    for (const signalMode of ['trend', 'meanrev', 'breakout', 'ensemble']) {
      const a = runBacktest(bars, { signalMode });
      const b = runBacktest(bars, { signalMode });
      expect(a.metrics.endingEquity).toBeCloseTo(b.metrics.endingEquity);
      expect(a.equityCurve.length).toBe(bars.length + 1);
    }
  });
});

describe('vol targeting', () => {
  test('never levers up and shrinks size in high-vol regimes', () => {
    const bars = generateMarket({ seed: 42, n: 1200, volAnnual: 0.9 });
    const base = runBacktest(bars, {}, { barsPerYear: 365 });
    const vt = runBacktest(bars, {}, { barsPerYear: 365, volTargetAnnual: 0.15 });

    // Same signals, so same-or-fewer units per trade — compare matched trades.
    const n = Math.min(base.trades.length, vt.trades.length);
    for (let k = 0; k < n; k++) {
      if (base.trades[k].barIn === vt.trades[k].barIn) {
        expect(vt.trades[k].units).toBeLessThanOrEqual(base.trades[k].units + 1e-12);
      }
    }
  });

  test('a tight vol target reduces equity-curve volatility', () => {
    const bars = generateMarket({ seed: 3, n: 1500, volAnnual: 0.8 });
    const sd = (curve) => {
      const rets = [];
      for (let i = 1; i < curve.length; i++) rets.push(curve[i] / curve[i - 1] - 1);
      const m = rets.reduce((a, b) => a + b, 0) / rets.length;
      return Math.sqrt(rets.reduce((a, b) => a + (b - m) ** 2, 0) / rets.length);
    };
    const base = runBacktest(bars, {}, { barsPerYear: 365 });
    const vt = runBacktest(bars, {}, { barsPerYear: 365, volTargetAnnual: 0.1 });
    expect(sd(vt.equityCurve)).toBeLessThanOrEqual(sd(base.equityCurve) + 1e-12);
  });
});
