import {
  tailStats,
  returnConcentration,
  volClustering,
  stressCorrelation,
  alignReturns,
  crossSectionalMomentum,
  luckBenchmark,
  simpleReturns,
} from './studies';
import { makeRng, makeGaussian } from './random';
import { generateMarket } from './market';
import { runBacktest } from './backtest';

function barsFromCloses(closes, startDate = '2023-01-01') {
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

describe('tailStats', () => {
  test('near-gaussian returns have small excess kurtosis; an outlier day inflates it', () => {
    const gauss = makeGaussian(makeRng(3));
    const normal = Array.from({ length: 2000 }, () => gauss() * 0.01);
    const t1 = tailStats(normal);
    expect(Math.abs(t1.excessKurtosis)).toBeLessThan(0.5);

    const withCrash = [...normal, -0.25]; // one -25% day
    const t2 = tailStats(withCrash);
    expect(t2.excessKurtosis).toBeGreaterThan(t1.excessKurtosis + 1);
    expect(t2.worstDay).toBeCloseTo(-0.25);
  });

  test('counts 3-sigma days and reports the gaussian expectation', () => {
    const gauss = makeGaussian(makeRng(5));
    const rets = Array.from({ length: 1000 }, () => gauss() * 0.01);
    const t = tailStats(rets);
    expect(t.gaussianExpected3Sigma).toBeCloseTo(2.7);
    expect(t.beyond3Sigma).toBeGreaterThanOrEqual(0);
  });
});

describe('returnConcentration', () => {
  test('removing the single best/worst day moves the total the right way', () => {
    // Gentle drift plus one +50% day and one -20% day.
    const closes = [100];
    for (let i = 0; i < 100; i++) closes.push(closes[closes.length - 1] * 1.001);
    closes.push(closes[closes.length - 1] * 1.5); // the big up day
    for (let i = 0; i < 50; i++) closes.push(closes[closes.length - 1] * 1.001);
    closes.push(closes[closes.length - 1] * 0.8); // the crash day
    for (let i = 0; i < 50; i++) closes.push(closes[closes.length - 1] * 1.001);

    const c = returnConcentration(closes, 1);
    // Missing the +50% day guts the return; missing the -20% day helps.
    expect(c.missingBest).toBeLessThan(c.totalReturn - 0.3);
    expect(c.missingWorst).toBeGreaterThan(c.totalReturn + 0.1);
  });

  test('measures best/worst-day clustering', () => {
    // Best day immediately followed by the worst day → 100% proximity.
    const closes = [100];
    for (let i = 0; i < 60; i++) closes.push(closes[closes.length - 1] * 1.0005);
    closes.push(closes[closes.length - 1] * 1.3); // best day
    closes.push(closes[closes.length - 1] * 0.75); // worst day, adjacent
    for (let i = 0; i < 60; i++) closes.push(closes[closes.length - 1] * 1.0005);
    const near = returnConcentration(closes, 1, 5);
    expect(near.bestNearWorstPct).toBe(1);

    // Best and worst far apart → 0% proximity.
    const far = [100];
    for (let i = 0; i < 60; i++) far.push(far[far.length - 1] * 1.0005);
    far.push(far[far.length - 1] * 1.3); // best day
    for (let i = 0; i < 100; i++) far.push(far[far.length - 1] * 1.0005);
    far.push(far[far.length - 1] * 0.75); // worst day, 100 days later
    for (let i = 0; i < 60; i++) far.push(far[far.length - 1] * 1.0005);
    expect(returnConcentration(far, 1, 5).bestNearWorstPct).toBe(0);
  });
});

describe('volClustering', () => {
  test('calm/storm blocks show |r| autocorrelation without direction autocorrelation', () => {
    // Alternate 50-day calm (0.2% vol) and 50-day storm (3% vol) blocks with
    // random signs: |returns| are highly autocorrelated, raw returns are not.
    const rng = makeRng(7);
    const rets = [];
    for (let block = 0; block < 20; block++) {
      const vol = block % 2 === 0 ? 0.002 : 0.03;
      for (let i = 0; i < 50; i++) rets.push((rng() < 0.5 ? 1 : -1) * vol * (0.5 + rng()));
    }
    const v = volClustering(rets, 10);
    expect(v.avgAbsAutocorr).toBeGreaterThan(0.2);
    expect(Math.abs(v.avgRawAutocorr)).toBeLessThan(0.1);
    expect(v.avgAbsAutocorr).toBeGreaterThan(Math.abs(v.avgRawAutocorr) + 0.15);
  });
});

describe('stressCorrelation / alignReturns', () => {
  test('aligns on shared dates only', () => {
    const a = barsFromCloses([1, 2, 3, 4, 5]);
    const b = barsFromCloses([10, 20, 30], '2023-01-03'); // overlaps days 3-5
    const { a: ra, b: rb } = alignReturns(a, b);
    expect(ra.length).toBe(rb.length);
    expect(ra.length).toBe(2); // shared return days: Jan 4, Jan 5
  });

  test('identical series correlate at ~1 in calm and stress', () => {
    const gauss = makeGaussian(makeRng(9));
    const closes = [100];
    for (let i = 0; i < 500; i++) closes.push(closes[closes.length - 1] * (1 + gauss() * 0.02));
    const bars = barsFromCloses(closes);
    const s = stressCorrelation(bars, bars);
    expect(s.fullCorr).toBeCloseTo(1, 5);
    expect(s.stressCorr).toBeCloseTo(1, 5);
  });

  test('detects correlation that exists only on big days', () => {
    // b follows a on large moves, is independent noise otherwise.
    const rng = makeRng(13);
    const gauss = makeGaussian(makeRng(14));
    const closesA = [100];
    const closesB = [100];
    for (let i = 0; i < 800; i++) {
      const big = rng() < 0.1;
      const ra = big ? (rng() < 0.5 ? 1 : -1) * 0.05 : gauss() * 0.005;
      const rb = big ? ra * (0.9 + rng() * 0.2) : gauss() * 0.005;
      closesA.push(closesA[closesA.length - 1] * (1 + ra));
      closesB.push(closesB[closesB.length - 1] * (1 + rb));
    }
    const s = stressCorrelation(barsFromCloses(closesA), barsFromCloses(closesB));
    expect(s.stressCorr).toBeGreaterThan(s.calmCorr + 0.3);
  });
});

describe('crossSectionalMomentum', () => {
  test('persistent winners produce a positive top-minus-bottom spread', () => {
    // 8 assets with persistent, distinct drifts: past ranking predicts future
    // ranking by construction, so the momentum spread must be positive.
    const universe = [];
    for (let k = 0; k < 8; k++) {
      const drift = -0.002 + 0.0006 * k; // -0.2% .. +0.22% per day
      const closes = [100];
      const rng = makeRng(100 + k);
      for (let i = 0; i < 900; i++) {
        const wobble = (rng() - 0.5) * 0.004;
        closes.push(closes[closes.length - 1] * (1 + drift + wobble));
      }
      universe.push({ symbol: `A${k}`, bars: barsFromCloses(closes) });
    }
    const r = crossSectionalMomentum(universe, { periodsPerYear: 365 });
    expect(r.insufficientData).toBe(false);
    expect(r.topQuartileReturn).toBeGreaterThan(r.bottomQuartileReturn);
    expect(r.topBeatBottomPct).toBeGreaterThan(0.6);
  });

  test('flags insufficient data on short series', () => {
    const universe = [
      { symbol: 'X', bars: barsFromCloses(Array.from({ length: 50 }, (_, i) => 100 + i)) },
    ];
    expect(crossSectionalMomentum(universe).insufficientData).toBe(true);
  });
});

describe('luckBenchmark', () => {
  const bars = generateMarket({ seed: 42, n: 1200 });
  const bt = runBacktest(bars);

  test('reports a percentile in [0,1] and is deterministic', () => {
    const l1 = luckBenchmark(bars, bt.trades, { n: 300 });
    const l2 = luckBenchmark(bars, bt.trades, { n: 300 });
    expect(l1.insufficientData).toBe(false);
    expect(l1.percentile).toBeGreaterThanOrEqual(0);
    expect(l1.percentile).toBeLessThanOrEqual(1);
    expect(l1.realReturn).toBeCloseTo(l2.realReturn);
    expect(l1.percentile).toBeCloseTo(l2.percentile);
  });

  test('flags insufficient data with too few trades', () => {
    expect(luckBenchmark(bars, [], {}).insufficientData).toBe(true);
  });
});
