import {
  trailingCagr,
  rollingOutcomes,
  relativeStrength,
  horizonCone,
  megaTrendSummary,
} from './megatrends';
import { inverseVolWeights, buildAllocation, portfolioVol } from './allocation';

function barsFromCloses(closes, startDate = '2016-01-01') {
  const start = new Date(startDate).getTime();
  return closes.map((c, i) => ({
    i,
    date: new Date(start + i * 86400000).toISOString().slice(0, 10),
    open: c,
    high: c * 1.001,
    low: c * 0.999,
    close: c,
    volume: 1,
  }));
}

const steadyCloses = (n, dailyRet) => {
  const out = [100];
  for (let i = 1; i < n; i++) {
    const wobble = (i % 2 === 0 ? 1 : -1) * 0.0003;
    out.push(out[i - 1] * (1 + dailyRet + wobble));
  }
  return out;
};

describe('megatrends', () => {
  test('trailingCagr recovers a known constant growth rate', () => {
    // 10% annual over 252-bar years.
    const daily = Math.pow(1.1, 1 / 252) - 1;
    const closes = steadyCloses(1300, daily);
    expect(trailingCagr(closes, 5, 252)).toBeCloseTo(0.1, 1);
    expect(trailingCagr(closes, 20, 252)).toBeNull(); // not enough data
  });

  test('rollingOutcomes exposes the worst window, not just the average', () => {
    // 4 good years, a 40% crash year, then 4 good years: the rolling 2y
    // distribution must contain negative windows even though the full-period
    // return is positive.
    const daily = Math.pow(1.15, 1 / 252) - 1;
    const closes = [100];
    for (let i = 0; i < 1008; i++) closes.push(closes[closes.length - 1] * (1 + daily));
    for (let i = 0; i < 252; i++) closes.push(closes[closes.length - 1] * (1 - 0.002));
    for (let i = 0; i < 1008; i++) closes.push(closes[closes.length - 1] * (1 + daily));

    const r = rollingOutcomes(closes, 2, 252);
    expect(r.insufficientData).toBe(false);
    expect(r.worst).toBeLessThan(0);
    expect(r.best).toBeGreaterThan(0.1);
    expect(r.pctNegative).toBeGreaterThan(0);
    expect(r.worst).toBeLessThanOrEqual(r.p10);
    expect(r.p10).toBeLessThanOrEqual(r.median);
    expect(r.median).toBeLessThanOrEqual(r.p90);
  });

  test('relativeStrength is positive for the faster asset and ~zero vs itself', () => {
    const fast = barsFromCloses(steadyCloses(1400, 0.0008));
    const slow = barsFromCloses(steadyCloses(1400, 0.0002));
    expect(relativeStrength(fast, slow, 5, 252)).toBeGreaterThan(0.02);
    expect(Math.abs(relativeStrength(fast, fast, 5, 252))).toBeLessThan(1e-9);
  });

  test('horizonCone widens with time and brackets the last price', () => {
    const c5 = horizonCone(100, 0.01, 5, 252);
    const c10 = horizonCone(100, 0.01, 10, 252);
    expect(c5.low1).toBeLessThan(100);
    expect(c5.high1).toBeGreaterThan(100);
    expect(c10.high2).toBeGreaterThan(c5.high2);
    expect(c10.low2).toBeLessThan(c5.low2);
  });

  test('megaTrendSummary assembles all pieces', () => {
    const bars = barsFromCloses(steadyCloses(2600, 0.0004));
    const s = megaTrendSummary(bars, { symbol: 'X', ppy: 252 });
    expect(s.cagr10y).not.toBeNull();
    expect(s.rolling5y.insufficientData).toBe(false);
    expect(s.cone10y.high2).toBeGreaterThan(s.cone5y.high2);
  });
});

describe('allocation', () => {
  test('inverseVolWeights sums to 1 and favors the calmer asset', () => {
    const w = inverseVolWeights([0.1, 0.4]);
    expect(w[0] + w[1]).toBeCloseTo(1);
    expect(w[0]).toBeGreaterThan(w[1]);
  });

  test('inverseVolWeights respects the cap and redistributes', () => {
    const w = inverseVolWeights([0.05, 0.5, 0.5], 0.5);
    expect(Math.max(...w)).toBeLessThanOrEqual(0.5 + 1e-9);
    expect(w.reduce((a, b) => a + b, 0)).toBeCloseTo(1);
  });

  test('buildAllocation: weights + cash sum to 1, crypto gate works', () => {
    const vols = { SPY: 0.15, QQQ: 0.2, EFA: 0.16, EEM: 0.19, IWM: 0.21, TLT: 0.14, GLD: 0.13 };
    const open = buildAllocation({
      volsBySymbol: vols,
      screenTop: ['XLK', 'QQQ', 'GOOGL'],
      cryptoAbove200d: true,
    });
    const closed = buildAllocation({
      volsBySymbol: vols,
      screenTop: ['XLK', 'QQQ', 'GOOGL'],
      cryptoAbove200d: false,
    });
    const total = (r) => r.allocations.reduce((a, l) => a + l.weight, 0) + r.cash;
    expect(total(open)).toBeCloseTo(1, 9);
    expect(total(closed)).toBeCloseTo(1, 9);
    expect(open.allocations.some((l) => l.symbol === 'BTC-USD')).toBe(true);
    expect(closed.allocations.some((l) => l.symbol === 'BTC-USD')).toBe(false);
    expect(closed.cash).toBeGreaterThan(open.cash);
  });

  test('duplicate symbols across sleeves merge into one line', () => {
    const vols = { SPY: 0.15, QQQ: 0.2, EFA: 0.16, EEM: 0.19, IWM: 0.21, TLT: 0.14, GLD: 0.13 };
    const r = buildAllocation({
      volsBySymbol: vols,
      screenTop: ['QQQ', 'SPY', 'XLK'], // overlaps core
      cryptoAbove200d: false,
    });
    const symbols = r.allocations.map((l) => l.symbol);
    expect(new Set(symbols).size).toBe(symbols.length);
    const qqq = r.allocations.find((l) => l.symbol === 'QQQ');
    expect(qqq.rule).toMatch(/momentum-tilt/);
  });

  test('every allocation line carries an auditable rule', () => {
    const vols = { SPY: 0.15, QQQ: 0.2, EFA: 0.16, EEM: 0.19, IWM: 0.21, TLT: 0.14, GLD: 0.13 };
    const r = buildAllocation({ volsBySymbol: vols, screenTop: [], cryptoAbove200d: false });
    for (const l of r.allocations) {
      expect(l.rule.length).toBeGreaterThan(10);
      expect(l.weight).toBeGreaterThan(0);
    }
    expect(r.disclaimer).toMatch(/not a prediction/i);
  });

  test('vol-target overlay scales risk into cash when portfolio vol is high', () => {
    // Two perfectly volatile synthetic assets => high realized portfolio vol.
    const wild = (seedShift) =>
      barsFromCloses(
        Array.from({ length: 200 }, (_, i) => 100 * (1 + 0.03 * Math.sin(i + seedShift)))
      );
    const barsBySymbol = { SPY: wild(0), TLT: wild(1) };
    const r = buildAllocation({
      volsBySymbol: { SPY: 0.5, QQQ: 0.5, EFA: 0.5, EEM: 0.5, IWM: 0.5, TLT: 0.5, GLD: 0.5 },
      screenTop: [],
      cryptoAbove200d: false,
      barsBySymbol,
    });
    if (r.overlay.realizedVol != null && r.overlay.realizedVol > r.overlay.target) {
      expect(r.overlay.scale).toBeLessThan(1);
      expect(r.cash).toBeGreaterThan(0.05);
    }
  });

  test('portfolioVol returns null with insufficient overlap', () => {
    const tiny = { SPY: barsFromCloses([100, 101, 102]) };
    expect(portfolioVol(tiny, { SPY: 1 })).toBeNull();
  });
});
