// Luck-adjusted performance validation.
//
// The Probabilistic and Deflated Sharpe Ratios of Bailey & López de Prado
// ("The Deflated Sharpe Ratio", Journal of Portfolio Management 2014).
//
// The problem they solve: if you try N strategy variants and report the best
// one, its backtest Sharpe is inflated by selection — with enough variants,
// SOMETHING always looks great by chance. The DSR asks: given how many things
// were tried (N), how long the sample is (T), and how non-normal the returns
// are (skew, kurtosis), what is the probability that the best variant's true
// Sharpe actually exceeds zero? Professionals kill strategies on this number;
// hype accounts have never heard of it.
//
// Conventions: Sharpe ratios here are PER-PERIOD (not annualized) — e.g. daily
// Sharpe from daily returns. T is the number of return observations.

import { mean, stddev } from './metrics';

// Standard normal CDF via the Abramowitz-Stegun erf approximation (max error
// ~1.5e-7, ample for p-values here).
export function normCdf(x) {
  const t = 1 / (1 + 0.3275911 * Math.abs(x) / Math.SQRT2);
  const erf =
    1 -
    (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-(x * x) / 2);
  return x >= 0 ? 0.5 * (1 + erf) : 0.5 * (1 - erf);
}

// Inverse standard normal CDF (Acklam's rational approximation).
export function normInv(p) {
  if (p <= 0 || p >= 1) throw new Error(`normInv: p must be in (0,1), got ${p}`);
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425;

  let q;
  let r;
  if (p < pl) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p <= 1 - pl) {
    q = p - 0.5;
    r = q * q;
    return ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  q = Math.sqrt(-2 * Math.log(1 - p));
  return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
    ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
}

// Sample skewness and excess-kurtosis-adjusted moments of a return series.
export function returnMoments(returns) {
  const n = returns.length;
  const m = mean(returns);
  const sd = stddev(returns);
  let s3 = 0;
  let s4 = 0;
  for (const r of returns) {
    const z = sd === 0 ? 0 : (r - m) / sd;
    s3 += z ** 3;
    s4 += z ** 4;
  }
  return {
    n,
    mean: m,
    std: sd,
    skewness: s3 / n,
    kurtosis: s4 / n, // RAW kurtosis (normal = 3), as the PSR formula expects
  };
}

// Probabilistic Sharpe Ratio: P(true Sharpe > srBenchmark) given an observed
// per-period Sharpe over T observations with the given return skew/kurtosis.
export function psr(observedSr, T, skewness, kurtosis, srBenchmark = 0) {
  if (T < 2) throw new Error('psr: need T >= 2');
  const denom = Math.sqrt(1 - skewness * observedSr + ((kurtosis - 1) / 4) * observedSr ** 2);
  if (!Number.isFinite(denom) || denom <= 0) return null; // pathological moments
  const z = ((observedSr - srBenchmark) * Math.sqrt(T - 1)) / denom;
  return normCdf(z);
}

// Expected maximum Sharpe among N independent trials under the null of zero
// true Sharpe, given the cross-trial variance of Sharpe estimates.
// (Bailey & López de Prado eq. for E[max]; γ is the Euler–Mascheroni constant.)
export function expectedMaxSharpe(nTrials, varianceOfTrialSharpes) {
  if (nTrials < 1) throw new Error('expectedMaxSharpe: nTrials >= 1');
  if (nTrials === 1) return 0;
  const gamma = 0.5772156649015329;
  const sd = Math.sqrt(Math.max(0, varianceOfTrialSharpes));
  return sd * ((1 - gamma) * normInv(1 - 1 / nTrials) + gamma * normInv(1 - 1 / (nTrials * Math.E)));
}

// Deflated Sharpe Ratio: PSR of the BEST variant, benchmarked not against zero
// but against the Sharpe you'd expect the best of N junk variants to show.
//
//   trialSharpes  - per-period Sharpe of every variant tried (incl. the best)
//   bestReturns   - per-period returns of the winning variant
//
// Returns { dsr, expectedMax, observedSr, trials } — dsr is the probability
// that the winner's true Sharpe exceeds zero AFTER the selection penalty.
// Read: dsr < 0.95 ⇒ the "winner" is not distinguishable from lucky junk.
export function deflatedSharpe(trialSharpes, bestReturns) {
  if (trialSharpes.length < 1) throw new Error('deflatedSharpe: no trials');
  const moments = returnMoments(bestReturns);
  if (moments.std === 0) return { dsr: null, reason: 'zero-variance returns' };
  const observedSr = moments.mean / moments.std;

  const varTrials =
    trialSharpes.length > 1
      ? stddev(trialSharpes) ** 2
      : 0;
  const expectedMax = expectedMaxSharpe(trialSharpes.length, varTrials);
  const dsr = psr(observedSr, moments.n, moments.skewness, moments.kurtosis, expectedMax);
  return {
    dsr,
    expectedMax,
    observedSr,
    trials: trialSharpes.length,
    T: moments.n,
  };
}
