import { parseCsvBars, inferPeriodsPerYear, qualityReport } from './loader';
import { screenAsset, rankAssets } from './screener';

// ---------- loader ----------

const GOOD_CSV = `date,open,high,low,close,volume
2024-01-01,100,105,99,104,1000
2024-01-02,104,106,103,105,1200
2024-01-03,105,107,104,106,900
`;

describe('parseCsvBars', () => {
  test('parses well-formed CSV into ascending bars', () => {
    const bars = parseCsvBars(GOOD_CSV, 'TEST');
    expect(bars.length).toBe(3);
    expect(bars[0].close).toBe(104);
    expect(bars[2].date).toBe('2024-01-03');
    expect(bars[1].i).toBe(1);
  });

  test('rejects wrong header', () => {
    expect(() => parseCsvBars('a,b,c\n1,2,3', 'X')).toThrow(/header/);
  });

  test('rejects high < low', () => {
    const bad = 'date,open,high,low,close,volume\n2024-01-01,100,99,101,100,5';
    expect(() => parseCsvBars(bad, 'X')).toThrow(/high < low/);
  });

  test('rejects out-of-order dates', () => {
    const bad =
      'date,open,high,low,close,volume\n2024-01-02,1,2,1,1,5\n2024-01-01,1,2,1,1,5';
    expect(() => parseCsvBars(bad, 'X')).toThrow(/ascending/);
  });

  test('rejects non-positive prices', () => {
    const bad = 'date,open,high,low,close,volume\n2024-01-01,0,2,0,1,5';
    expect(() => parseCsvBars(bad, 'X')).toThrow(/non-positive/);
  });

  test('rejects NaN or negative volume', () => {
    const nanVol = 'date,open,high,low,close,volume\n2024-01-01,1,2,0.5,1.5,N/A';
    expect(() => parseCsvBars(nanVol, 'X')).toThrow(/volume/);
    const negVol = 'date,open,high,low,close,volume\n2024-01-01,1,2,0.5,1.5,-3';
    expect(() => parseCsvBars(negVol, 'X')).toThrow(/volume/);
  });
});

describe('inferPeriodsPerYear', () => {
  function makeDaily(n, everyDay) {
    const bars = [];
    const start = new Date('2023-01-02').getTime();
    let added = 0;
    let day = 0;
    while (added < n) {
      const d = new Date(start + day * 86400000);
      const dow = d.getUTCDay();
      if (everyDay || (dow !== 0 && dow !== 6)) {
        bars.push({ date: d.toISOString().slice(0, 10), open: 1, high: 1, low: 1, close: 1, volume: 1 });
        added++;
      }
      day++;
    }
    return bars;
  }

  test('crypto-like series (7 days/week) snaps to 365', () => {
    expect(inferPeriodsPerYear(makeDaily(730, true))).toBe(365);
  });

  test('equity-like series (5 days/week) snaps to 252', () => {
    expect(inferPeriodsPerYear(makeDaily(500, false))).toBe(252);
  });
});

describe('qualityReport', () => {
  test('counts gaps and extreme moves', () => {
    const bars = parseCsvBars(
      'date,open,high,low,close,volume\n2024-01-01,100,101,99,100,5\n2024-01-10,140,141,139,140,5',
      'X'
    );
    const q = qualityReport(bars, 'X');
    expect(q.maxGapDays).toBe(9);
    expect(q.extremeMoves).toBe(1); // +40% single-bar move
  });
});

// ---------- screener ----------

function syntheticBars(n, dailyRet) {
  const bars = [];
  let price = 100;
  const start = new Date('2023-01-01').getTime();
  for (let i = 0; i < n; i++) {
    // Deterministic wobble so volatility is non-zero (a zero-vol series has an
    // undefined Sharpe, which the screener guards to 0).
    const wobble = (i % 2 === 0 ? 1 : -1) * 0.0004;
    price *= 1 + dailyRet + wobble;
    bars.push({
      i,
      date: new Date(start + i * 86400000).toISOString().slice(0, 10),
      open: price,
      high: price * 1.001,
      low: price * 0.999,
      close: price,
      volume: 1,
    });
  }
  return bars;
}

describe('screenAsset', () => {
  test('a steadily rising asset screens as: positive momentum, above trend, at its high', () => {
    const s = screenAsset(syntheticBars(400, 0.002), {
      symbol: 'UP',
      periodsPerYear: 365,
    });
    expect(s.mom12_1).toBeGreaterThan(0);
    expect(s.above200d).toBe(true);
    expect(s.pctBelow52wHigh).toBeCloseTo(0, 5);
    expect(s.sharpe).toBeGreaterThan(0);
    expect(s.cagr).toBeGreaterThan(0);
  });

  test('a steadily falling asset screens as the mirror image', () => {
    const s = screenAsset(syntheticBars(400, -0.002), {
      symbol: 'DOWN',
      periodsPerYear: 365,
    });
    expect(s.mom12_1).toBeLessThan(0);
    expect(s.above200d).toBe(false);
    expect(s.pctBelow52wHigh).toBeGreaterThan(0.3);
    expect(s.sharpe).toBeLessThan(0);
  });

  test('refuses series too short for a 12-month screen', () => {
    expect(() =>
      screenAsset(syntheticBars(100, 0.001), { symbol: 'SHORT' })
    ).toThrow(/270/);
  });

  test('12-1 momentum excludes the most recent month', () => {
    // Flat for a year, then a huge final-month spike: 12-1 momentum should
    // ignore the spike (that is its entire purpose — short-term reversal).
    const bars = syntheticBars(400, 0);
    const oneMonth = Math.round(365 / 12);
    for (let k = bars.length - oneMonth; k < bars.length; k++) {
      const mult = 2;
      bars[k] = { ...bars[k], open: bars[k].open * mult, high: bars[k].high * mult, low: bars[k].low * mult, close: bars[k].close * mult };
    }
    const s = screenAsset(bars, { symbol: 'SPIKE', periodsPerYear: 365 });
    expect(Math.abs(s.mom12_1)).toBeLessThan(0.01); // spike excluded
    expect(s.ret1m).toBeGreaterThan(0.5); // spike visible in 1m return
  });
});

describe('rankAssets', () => {
  test('ranks the strong asset above the weak one and exposes its weights', () => {
    const up = screenAsset(syntheticBars(400, 0.002), { symbol: 'UP', periodsPerYear: 365 });
    const down = screenAsset(syntheticBars(400, -0.002), { symbol: 'DOWN', periodsPerYear: 365 });
    const flat = screenAsset(syntheticBars(400, 0), { symbol: 'FLAT', periodsPerYear: 365 });
    const r = rankAssets([down, flat, up]);
    expect(r.assets[0].symbol).toBe('UP');
    expect(r.assets[r.assets.length - 1].symbol).toBe('DOWN');
    expect(r.weights.momentum).toBeCloseTo(1 / 3);
    expect(r.note).toMatch(/does not predict/);
  });

  test('identical assets receive identical composites regardless of input order', () => {
    const a = screenAsset(syntheticBars(400, 0.001), { symbol: 'A', periodsPerYear: 365 });
    const b = { ...a, symbol: 'B' };
    const up = screenAsset(syntheticBars(400, 0.003), { symbol: 'UP', periodsPerYear: 365 });
    const r1 = rankAssets([a, b, up]);
    const r2 = rankAssets([b, up, a]);
    const comp = (r, sym) => r.assets.find((x) => x.symbol === sym).composite;
    // Tied twins must share a composite, in both orderings.
    expect(comp(r1, 'A')).toBeCloseTo(comp(r1, 'B'), 12);
    expect(comp(r1, 'A')).toBeCloseTo(comp(r2, 'A'), 12);
  });
});

describe('sortino correctness (target downside deviation)', () => {
  test('constant-magnitude losses do NOT produce a zero denominator', () => {
    // Alternating +0.4%/-0.2% pattern: losses all identical. The old (wrong)
    // formula — stddev of losses around their own mean — collapsed to ~0 and
    // made sortino blow up or zero out. The correct MAR=0 target deviation is
    // strictly positive here, and sortino stays finite and sane.
    const bars = [];
    let price = 100;
    const start = new Date('2023-01-01').getTime();
    for (let i = 0; i < 400; i++) {
      price *= 1 + (i % 2 === 0 ? 0.004 : -0.002);
      bars.push({
        i,
        date: new Date(start + i * 86400000).toISOString().slice(0, 10),
        open: price, high: price * 1.001, low: price * 0.999, close: price, volume: 1,
      });
    }
    const s = screenAsset(bars, { symbol: 'ALT', periodsPerYear: 365 });
    expect(s.sortino).toBeGreaterThan(0);
    expect(Number.isFinite(s.sortino)).toBe(true);
    // Sanity: with MAR=0, sortino should exceed sharpe (denominator only
    // counts downside), but not by an absurd factor for this pattern.
    expect(s.sortino).toBeGreaterThan(s.sharpe);
    expect(s.sortino).toBeLessThan(s.sharpe * 10);
  });
});
