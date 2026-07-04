// Simulated market data.
//
// IMPORTANT / HONESTY NOTE:
// These are NOT real prices. This module generates synthetic OHLC bars using a
// geometric Brownian motion with a small regime-switching component so the
// series has trends, chop, and volatility clusters — enough to exercise a
// strategy realistically. It runs fully offline (no API keys, no data feed),
// which is why the demo works anywhere including CI.
//
// A real deployment would replace `generateMarket` with a loader that pulls
// actual historical OHLCV from an exchange/data vendor. The rest of the engine
// (indicators, strategy, backtest, metrics) is data-source agnostic and would
// work unchanged.

import { makeRng, makeGaussian } from './random';

// Generate `n` OHLC bars.
//
// params:
//   seed         - reproducibility seed
//   n            - number of bars
//   start        - starting price
//   driftAnnual  - expected annual drift (kept small & realistic)
//   volAnnual    - annualized volatility
//   barsPerYear  - used to scale drift/vol per bar (e.g. 5-min bars ≈ 105_000/yr)
export function generateMarket({
  seed = 42,
  n = 1500,
  start = 100,
  driftAnnual = 0.05,
  volAnnual = 0.6,
  barsPerYear = 105_000,
} = {}) {
  const rng = makeRng(seed);
  const gauss = makeGaussian(rng);

  const dt = 1 / barsPerYear;
  const mu = driftAnnual;
  const bars = [];

  let price = start;
  // Regime state: occasionally flip between calm and volatile / trending markets
  // so a naive strategy can't just print money forever.
  let regimeVol = volAnnual;
  let regimeDrift = mu;

  for (let i = 0; i < n; i++) {
    if (rng() < 0.01) {
      // ~1% chance per bar to switch regime
      regimeVol = volAnnual * (0.5 + rng() * 1.5);
      regimeDrift = mu * (rng() < 0.5 ? -1 : 1) * (0.5 + rng() * 2);
    }

    const shock = gauss();
    // GBM log-return step
    const ret =
      (regimeDrift - 0.5 * regimeVol * regimeVol) * dt +
      regimeVol * Math.sqrt(dt) * shock;
    const open = price;
    const close = open * Math.exp(ret);

    // Build an intrabar range around open/close from the per-bar volatility.
    const wick = Math.abs(regimeVol * Math.sqrt(dt) * open);
    const high = Math.max(open, close) + Math.abs(gauss()) * wick * 0.5;
    const low = Math.min(open, close) - Math.abs(gauss()) * wick * 0.5;

    bars.push({
      i,
      open,
      high,
      low,
      close,
      // volume is decorative here but strategies often key off it
      volume: 1000 + Math.abs(gauss()) * 500,
    });

    price = close;
  }

  return bars;
}
