// Performance metrics.
//
// These are the numbers that actually matter when judging a strategy — and the
// ones a hype screenshot conveniently leaves out or distorts. Max drawdown and
// Sharpe tell you far more than a big "all-time PnL" number does.

// Per-step simple returns from an equity curve.
export function returnsFromEquity(equity) {
  const out = [];
  for (let i = 1; i < equity.length; i++) {
    out.push(equity[i] / equity[i - 1] - 1);
  }
  return out;
}

export function mean(xs) {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

export function stddev(xs) {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  const v = xs.reduce((a, b) => a + (b - m) * (b - m), 0) / (xs.length - 1);
  return Math.sqrt(v);
}

// Annualized Sharpe ratio. `periodsPerYear` scales the per-bar Sharpe up to an
// annual figure. Returns 0 if there's no volatility (avoids divide-by-zero).
export function sharpe(returns, periodsPerYear, riskFreeAnnual = 0) {
  if (returns.length < 2) return 0;
  const rfPerPeriod = riskFreeAnnual / periodsPerYear;
  const excess = returns.map((r) => r - rfPerPeriod);
  const sd = stddev(excess);
  if (sd === 0) return 0;
  return (mean(excess) / sd) * Math.sqrt(periodsPerYear);
}

// Maximum peak-to-trough drawdown of an equity curve, as a positive fraction
// (0.25 => the account was, at worst, down 25% from a prior high).
export function maxDrawdown(equity) {
  let peak = -Infinity;
  let maxDd = 0;
  for (const v of equity) {
    if (v > peak) peak = v;
    if (peak > 0) {
      const dd = (peak - v) / peak;
      if (dd > maxDd) maxDd = dd;
    }
  }
  return maxDd;
}

// Compound annual growth rate given start/end equity and number of bars.
export function cagr(equity, periodsPerYear) {
  if (equity.length < 2) return 0;
  const start = equity[0];
  const end = equity[equity.length - 1];
  if (start <= 0 || end <= 0) return -1;
  const years = (equity.length - 1) / periodsPerYear;
  if (years <= 0) return 0;
  return Math.pow(end / start, 1 / years) - 1;
}

// Trade-level statistics. `trades` is an array of objects with a numeric `pnl`
// (realized profit/loss in account currency) and `rMultiple` (pnl expressed in
// units of initial risk).
export function tradeStats(trades) {
  const n = trades.length;
  if (n === 0) {
    return {
      trades: 0,
      winRate: 0,
      profitFactor: 0,
      avgWin: 0,
      avgLoss: 0,
      payoffRatio: 0,
      expectancyR: 0,
    };
  }
  const wins = trades.filter((t) => t.pnl > 0);
  const losses = trades.filter((t) => t.pnl <= 0);
  const grossWin = wins.reduce((a, t) => a + t.pnl, 0);
  const grossLoss = Math.abs(losses.reduce((a, t) => a + t.pnl, 0));
  const avgWin = wins.length ? grossWin / wins.length : 0;
  const avgLoss = losses.length ? grossLoss / losses.length : 0;

  return {
    trades: n,
    winRate: wins.length / n,
    profitFactor: grossLoss === 0 ? (grossWin > 0 ? Infinity : 0) : grossWin / grossLoss,
    avgWin,
    avgLoss,
    payoffRatio: avgLoss === 0 ? 0 : avgWin / avgLoss,
    // Expectancy in R: average of the R-multiples across all trades.
    expectancyR: mean(trades.map((t) => t.rMultiple || 0)),
  };
}
