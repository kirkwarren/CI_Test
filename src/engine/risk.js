// Risk & position sizing.
//
// The screenshot brags about a "Kelly" sizing engine. Kelly is real math, but
// full-Kelly is dangerously aggressive — its optimal bet size assumes you know
// your edge exactly, which you never do. Professionals use *fractional* Kelly
// (often 1/4 to 1/2) plus a hard cap on risk-per-trade. This module does both.

// The Kelly fraction for a bet with win probability `p` and payoff ratio `b`
// (average win / average loss). Returns the fraction of capital to risk.
// Clamped at 0: a negative Kelly means "no edge, don't bet".
export function kellyFraction(p, b) {
  if (b <= 0) return 0;
  const f = p - (1 - p) / b;
  return Math.max(0, f);
}

// Compute a position size in units.
//
//   equity          - current account equity
//   winProb         - estimated win probability (0..1)
//   payoffRatio     - estimated avg win / avg loss
//   stopDistance    - price distance from entry to stop (per unit risk)
//   kellyMultiplier - fraction of full Kelly to actually use (e.g. 0.25)
//   maxRiskPerTrade - hard cap on fraction of equity risked on one trade
//
// Returns { units, riskFraction, riskAmount, kelly }.
export function positionSize({
  equity,
  winProb,
  payoffRatio,
  stopDistance,
  kellyMultiplier = 0.25,
  maxRiskPerTrade = 0.02,
}) {
  const kelly = kellyFraction(winProb, payoffRatio);
  // Fractional Kelly, then never exceed the hard per-trade risk cap.
  const riskFraction = Math.min(kelly * kellyMultiplier, maxRiskPerTrade);
  const riskAmount = equity * riskFraction;

  if (stopDistance <= 0 || riskAmount <= 0) {
    return { units: 0, riskFraction: 0, riskAmount: 0, kelly };
  }

  return {
    units: riskAmount / stopDistance,
    riskFraction,
    riskAmount,
    kelly,
  };
}
