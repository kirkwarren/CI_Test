import {
  normCdf,
  normInv,
  psr,
  expectedMaxSharpe,
  deflatedSharpe,
  returnMoments,
} from './validation';
import { makeRng, makeGaussian } from './random';

describe('normal distribution helpers', () => {
  test('normCdf matches known values', () => {
    expect(normCdf(0)).toBeCloseTo(0.5, 6);
    expect(normCdf(1.96)).toBeCloseTo(0.975, 3);
    expect(normCdf(-1.96)).toBeCloseTo(0.025, 3);
    expect(normCdf(3)).toBeCloseTo(0.99865, 4);
  });

  test('normInv is the inverse of normCdf', () => {
    for (const p of [0.01, 0.1, 0.5, 0.9, 0.975, 0.999]) {
      expect(normCdf(normInv(p))).toBeCloseTo(p, 4);
    }
  });

  test('normInv rejects out-of-range p', () => {
    expect(() => normInv(0)).toThrow();
    expect(() => normInv(1)).toThrow();
  });
});

describe('psr (probabilistic Sharpe ratio)', () => {
  test('zero observed Sharpe over any horizon gives PSR 0.5 vs zero benchmark', () => {
    expect(psr(0, 500, 0, 3, 0)).toBeCloseTo(0.5, 6);
  });

  test('positive Sharpe with long history approaches certainty', () => {
    expect(psr(0.1, 2000, 0, 3, 0)).toBeGreaterThan(0.99);
  });

  test('same Sharpe, shorter history => less confidence', () => {
    const long = psr(0.05, 2000, 0, 3, 0);
    const short = psr(0.05, 100, 0, 3, 0);
    expect(long).toBeGreaterThan(short);
  });

  test('negative skew and fat tails reduce confidence', () => {
    const clean = psr(0.08, 500, 0, 3, 0);
    const ugly = psr(0.08, 500, -1.5, 8, 0);
    expect(clean).toBeGreaterThan(ugly);
  });
});

describe('expectedMaxSharpe', () => {
  test('one trial has no selection penalty', () => {
    expect(expectedMaxSharpe(1, 0.01)).toBe(0);
  });

  test('penalty grows with the number of trials', () => {
    const e10 = expectedMaxSharpe(10, 0.01);
    const e100 = expectedMaxSharpe(100, 0.01);
    expect(e100).toBeGreaterThan(e10);
    expect(e10).toBeGreaterThan(0);
  });

  test('penalty scales with cross-trial variance', () => {
    expect(expectedMaxSharpe(10, 0.04)).toBeCloseTo(2 * expectedMaxSharpe(10, 0.01), 10);
  });
});

describe('deflatedSharpe', () => {
  const gauss = makeGaussian(makeRng(21));

  test('a genuinely strong strategy survives deflation', () => {
    // Daily returns with true Sharpe ~0.15/day over 1500 days — implausibly
    // good in real life, which is the point: DSR should be near 1.
    const rets = Array.from({ length: 1500 }, () => 0.0015 + gauss() * 0.01);
    const { dsr } = deflatedSharpe([0.15, 0.01, -0.02, 0.005], rets);
    expect(dsr).toBeGreaterThan(0.99);
  });

  test('the best of many junk variants does NOT survive deflation', () => {
    // Zero-mean noise "winner" picked from 20 junk trials whose Sharpes spread
    // around zero: after the selection penalty, confidence collapses.
    const rets = Array.from({ length: 500 }, () => gauss() * 0.01);
    const junkSharpes = Array.from({ length: 20 }, (_, k) => (k - 10) * 0.01);
    const { dsr, expectedMax } = deflatedSharpe(junkSharpes, rets);
    expect(expectedMax).toBeGreaterThan(0);
    expect(dsr).toBeLessThan(0.95);
  });

  test('returnMoments computes sane skew/kurtosis on gaussian data', () => {
    const rets = Array.from({ length: 5000 }, () => gauss() * 0.01);
    const m = returnMoments(rets);
    expect(Math.abs(m.skewness)).toBeLessThan(0.15);
    expect(m.kurtosis).toBeGreaterThan(2.5);
    expect(m.kurtosis).toBeLessThan(3.5);
  });
});
