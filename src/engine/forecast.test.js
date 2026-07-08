import {
  makeIntervalForecast,
  generateForecasts,
  mergeIntoLedger,
  scoreLedger,
  calibrationReport,
  HORIZONS,
} from './forecast';

const ASSET = {
  symbol: 'TEST',
  lastDate: '2026-07-07',
  lastClose: 100,
  dailyVol: 0.01,
  ppy: 252,
};

describe('makeIntervalForecast', () => {
  test('intervals are ordered, widen with horizon, and bracket the center', () => {
    const f1 = makeIntervalForecast({ ...ASSET, horizonYears: 1 / 12, horizonKey: '1m' });
    const f5 = makeIntervalForecast({ ...ASSET, horizonYears: 5, horizonKey: '5y' });
    for (const f of [f1, f5]) {
      expect(f.low95).toBeLessThan(f.low68);
      expect(f.low68).toBeLessThan(f.center);
      expect(f.center).toBeLessThan(f.high68);
      expect(f.high68).toBeLessThan(f.high95);
    }
    expect(f5.high95 - f5.low95).toBeGreaterThan(f1.high95 - f1.low95);
  });

  test('zero drift centers on the last close; positive drift shifts up', () => {
    const flat = makeIntervalForecast({ ...ASSET, horizonYears: 1, horizonKey: '1y' });
    expect(flat.center).toBeCloseTo(100);
    const up = makeIntervalForecast({ ...ASSET, horizonYears: 1, horizonKey: '1y', driftAnnual: 0.1 });
    expect(up.center).toBeCloseTo(110, 0);
  });

  test('maturity date is horizon years after made-at', () => {
    const f = makeIntervalForecast({ ...ASSET, horizonYears: 1, horizonKey: '1y' });
    expect(f.maturesAt.slice(0, 4)).toBe('2027');
  });
});

describe('generateForecasts', () => {
  test('emits one forecast per asset per horizon, drift only at >=1y with base rate', () => {
    const fs = generateForecasts([ASSET], { baseRates: { TEST: { '1y': 0.08, '5y': 0.08 } } });
    expect(fs.length).toBe(HORIZONS.length);
    const oneM = fs.find((f) => f.horizon === '1m');
    const oneY = fs.find((f) => f.horizon === '1y');
    expect(oneM.driftAnnual).toBe(0);
    expect(oneY.driftAnnual).toBe(0.08);
    expect(oneY.driftSource).toBe('median-rolling-cagr');
  });
});

describe('ledger merge + scoring + calibration', () => {
  test('same-week duplicates are not re-registered', () => {
    const fs = generateForecasts([ASSET]);
    const r1 = mergeIntoLedger([], fs);
    expect(r1.added).toBe(HORIZONS.length);
    const r2 = mergeIntoLedger(r1.ledger, fs);
    expect(r2.added).toBe(0);
  });

  test('scores matured forecasts and computes coverage', () => {
    // Register at 100 with tight known intervals, then mature everything.
    const f = makeIntervalForecast({ ...ASSET, horizonYears: 1 / 12, horizonKey: '1m' });
    const inside = { ...f, id: 'a' };
    const outside = { ...f, id: 'b', symbol: 'TEST2' };
    const prices = { TEST: 101, TEST2: 999 }; // one hit, one wild miss
    const { ledger, newlyScored } = scoreLedger(
      [inside, outside],
      (sym) => prices[sym],
      '2027-01-01' // past maturity
    );
    expect(newlyScored).toBe(2);
    const a = ledger.find((x) => x.id === 'a');
    const b = ledger.find((x) => x.id === 'b');
    expect(a.outcome.inside68).toBe(true);
    expect(b.outcome.inside95).toBe(false);

    const report = calibrationReport(ledger);
    expect(report.totalMatured).toBe(2);
    expect(report.byHorizon['1m'].coverage68).toBeCloseTo(0.5);
    expect(report.note).toMatch(/too wide are as dishonest/);
  });

  test('unmatured and unpriceable forecasts stay pending', () => {
    const f = makeIntervalForecast({ ...ASSET, horizonYears: 5, horizonKey: '5y' });
    const { ledger, newlyScored } = scoreLedger([f], () => null, '2026-07-08');
    expect(newlyScored).toBe(0);
    expect(ledger[0].outcome).toBeUndefined();
    expect(calibrationReport(ledger).pending).toBe(1);
  });
});
