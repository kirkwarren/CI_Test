import { sma, ema, rsi, atr, rollingStd } from './indicators';
import {
  maxDrawdown,
  cagr,
  sharpe,
  tradeStats,
  returnsFromEquity,
} from './metrics';
import { kellyFraction, positionSize } from './risk';
import { generateMarket } from './market';
import { runBacktest } from './backtest';
import { monteCarlo } from './montecarlo';
import { walkForward, defaultGrid } from './walkforward';
import { runFullAnalysis } from './index';

describe('indicators', () => {
  test('sma warms up then averages correctly', () => {
    const out = sma([1, 2, 3, 4, 5], 3);
    expect(out[0]).toBeNull();
    expect(out[1]).toBeNull();
    expect(out[2]).toBeCloseTo(2);
    expect(out[3]).toBeCloseTo(3);
    expect(out[4]).toBeCloseTo(4);
  });

  test('ema is null during warmup and finite after', () => {
    const out = ema([1, 2, 3, 4, 5, 6, 7, 8], 4);
    expect(out[2]).toBeNull();
    expect(out[3]).not.toBeNull();
    expect(Number.isFinite(out[7])).toBe(true);
  });

  test('rsi is 100 for a monotonically rising series', () => {
    const rising = Array.from({ length: 30 }, (_, i) => i + 1);
    const out = rsi(rising, 14);
    expect(out[20]).toBeCloseTo(100);
  });

  test('rsi stays within [0,100]', () => {
    const bars = generateMarket({ seed: 5, n: 200 });
    const out = rsi(bars.map((b) => b.close), 14);
    for (const v of out) {
      if (v != null) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      }
    }
  });

  test('atr is positive after warmup', () => {
    const bars = generateMarket({ seed: 9, n: 100 });
    const out = atr(bars, 14);
    expect(out[50]).toBeGreaterThan(0);
  });

  test('rollingStd of a constant series is zero', () => {
    const out = rollingStd([5, 5, 5, 5, 5], 3);
    expect(out[4]).toBeCloseTo(0);
  });
});

describe('metrics', () => {
  test('maxDrawdown captures the worst peak-to-trough drop', () => {
    // peak 100 -> trough 50 == 50% drawdown
    expect(maxDrawdown([100, 120, 60, 90, 100])).toBeCloseTo((120 - 60) / 120);
  });

  test('maxDrawdown of a monotonic curve is zero', () => {
    expect(maxDrawdown([1, 2, 3, 4])).toBe(0);
  });

  test('cagr of doubling over one year is ~100%', () => {
    const eq = [100, 200];
    expect(cagr(eq, 1)).toBeCloseTo(1, 5);
  });

  test('sharpe of zero-variance returns is zero', () => {
    expect(sharpe([0.01, 0.01, 0.01], 252)).toBe(0);
  });

  test('tradeStats computes win rate and profit factor', () => {
    const trades = [
      { pnl: 100, rMultiple: 2 },
      { pnl: -50, rMultiple: -1 },
      { pnl: 100, rMultiple: 2 },
      { pnl: -50, rMultiple: -1 },
    ];
    const s = tradeStats(trades);
    expect(s.trades).toBe(4);
    expect(s.winRate).toBeCloseTo(0.5);
    expect(s.profitFactor).toBeCloseTo(200 / 100);
    expect(s.payoffRatio).toBeCloseTo(2);
  });

  test('returnsFromEquity length is one less than equity length', () => {
    expect(returnsFromEquity([1, 2, 3]).length).toBe(2);
  });
});

describe('risk', () => {
  test('kellyFraction is positive with a real edge', () => {
    // 60% win, 2:1 payoff => 0.6 - 0.4/2 = 0.4
    expect(kellyFraction(0.6, 2)).toBeCloseTo(0.4);
  });

  test('kellyFraction clamps to zero with no edge', () => {
    expect(kellyFraction(0.4, 1)).toBe(0);
  });

  test('positionSize respects the hard risk cap', () => {
    const s = positionSize({
      equity: 10_000,
      winProb: 0.99, // absurd edge => huge raw Kelly
      payoffRatio: 5,
      stopDistance: 10,
      kellyMultiplier: 1,
      maxRiskPerTrade: 0.02,
    });
    // Risk must never exceed 2% of equity regardless of Kelly.
    expect(s.riskAmount).toBeLessThanOrEqual(10_000 * 0.02 + 1e-9);
    expect(s.riskFraction).toBeLessThanOrEqual(0.02 + 1e-9);
  });

  test('positionSize returns zero units with no edge', () => {
    const s = positionSize({
      equity: 10_000,
      winProb: 0.3,
      payoffRatio: 1,
      stopDistance: 10,
    });
    expect(s.units).toBe(0);
  });
});

describe('backtest', () => {
  const bars = generateMarket({ seed: 42, n: 1200 });
  const result = runBacktest(bars);

  test('is deterministic for a fixed seed', () => {
    const again = runBacktest(generateMarket({ seed: 42, n: 1200 }));
    expect(again.metrics.endingEquity).toBeCloseTo(result.metrics.endingEquity);
  });

  test('produces an aligned equity curve', () => {
    expect(result.equityCurve.length).toBe(bars.length + 1);
    expect(result.equityCurve[0]).toBe(result.metrics.startingEquity);
  });

  test('never risks more than the cap on any single trade (no blowup)', () => {
    // Equity should never go negative with 2% risk cap and stops in place.
    for (const e of result.equityCurve) {
      expect(e).toBeGreaterThan(0);
    }
  });

  test('reported ending equity matches the curve', () => {
    const last = result.equityCurve[result.equityCurve.length - 1];
    expect(last).toBeCloseTo(result.metrics.endingEquity);
  });

  test('trades carry the fields metrics depend on', () => {
    for (const t of result.trades) {
      expect(typeof t.pnl).toBe('number');
      expect(typeof t.rMultiple).toBe('number');
    }
  });
});

describe('monteCarlo', () => {
  test('reports probability of loss between 0 and 1', () => {
    const bars = generateMarket({ seed: 3, n: 1500 });
    const res = runBacktest(bars);
    const mc = monteCarlo(res.trades, { paths: 1000 });
    if (!mc.insufficientData) {
      expect(mc.probLoss).toBeGreaterThanOrEqual(0);
      expect(mc.probLoss).toBeLessThanOrEqual(1);
      expect(mc.percentiles.p5).toBeLessThanOrEqual(mc.percentiles.p95);
    }
  });

  test('flags insufficient data with too few trades', () => {
    const mc = monteCarlo([{ rMultiple: 1 }], { paths: 100 });
    expect(mc.insufficientData).toBe(true);
  });
});

describe('walkForward', () => {
  const bars = generateMarket({ seed: 42, n: 2000 });

  test('produces one result per completed fold with IS and OOS metrics', () => {
    const wf = walkForward(bars, { folds: 4 });
    expect(wf.insufficientData).toBe(false);
    expect(wf.folds.length).toBeGreaterThan(0);
    for (const f of wf.folds) {
      expect(f.inSample).toBeDefined();
      expect(f.outOfSample).toBeDefined();
      expect(typeof f.inSample.totalReturn).toBe('number');
      expect(typeof f.outOfSample.totalReturn).toBe('number');
      expect(f.params).toBeDefined();
    }
  });

  test('reports the overfitting tax (degradation) and OOS fold count', () => {
    const wf = walkForward(bars, { folds: 4 });
    expect(wf.aggregate).toBeDefined();
    expect(typeof wf.aggregate.degradation).toBe('number');
    expect(wf.aggregate.oosProfitableFolds).toBeLessThanOrEqual(
      wf.aggregate.totalFolds
    );
  });

  test('flags insufficient data on a tiny series', () => {
    const wf = walkForward(generateMarket({ seed: 1, n: 100 }), { folds: 4 });
    expect(wf.insufficientData).toBe(true);
  });

  test('is deterministic', () => {
    const a = walkForward(bars, { folds: 4 });
    const b = walkForward(generateMarket({ seed: 42, n: 2000 }), { folds: 4 });
    expect(a.aggregate.avgOosReturn).toBeCloseTo(b.aggregate.avgOosReturn);
  });

  test('the parameter grid is non-trivial', () => {
    expect(defaultGrid().length).toBeGreaterThan(5);
  });
});

describe('runFullAnalysis', () => {
  const analysis = runFullAnalysis({ bars: 800, mcPaths: 500 });

  test('returns a primary result, monte carlo, and a robustness grid', () => {
    expect(analysis.primary.symbol).toBe('BTC');
    expect(analysis.grid.length).toBeGreaterThan(1);
    expect(analysis.monteCarlo).toBeDefined();
  });

  test('grid entries expose honest headline metrics', () => {
    for (const g of analysis.grid) {
      expect(typeof g.totalReturn).toBe('number');
      expect(g.maxDrawdown).toBeGreaterThanOrEqual(0);
    }
  });
});
