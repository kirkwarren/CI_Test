// Deterministic pseudo-random number generation.
//
// Everything downstream (market simulation, Monte Carlo resampling) is seeded
// so that results are reproducible. This is deliberate: an honest backtesting
// tool must produce the *same* numbers every run, otherwise you can silently
// "reroll" until you find a lucky seed — which is exactly how misleading
// track records get manufactured.

// mulberry32: a small, fast, well-distributed 32-bit PRNG.
export function makeRng(seed = 1) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Box–Muller transform: turn two uniform draws into a standard-normal draw.
export function makeGaussian(rng) {
  let spare = null;
  return function gaussian() {
    if (spare !== null) {
      const v = spare;
      spare = null;
      return v;
    }
    let u = 0;
    let v = 0;
    let s = 0;
    do {
      u = rng() * 2 - 1;
      v = rng() * 2 - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);
    const mul = Math.sqrt((-2 * Math.log(s)) / s);
    spare = v * mul;
    return u * mul;
  };
}
