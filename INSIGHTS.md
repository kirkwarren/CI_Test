# Market Truths — measured on our own verified data

*Six empirical studies on 3 years of real daily history (38 assets, Coinbase + Nasdaq, integrity-gated). These are measurements of well-documented market regularities — the things that are actually true about markets, as opposed to the "secret edge" fantasy. Nothing here predicts; everything here is reproducible: `./scripts/insights.sh`.*

## 1 · Returns are fat-tailed — Gaussian risk math understates reality

| Asset | Excess kurtosis (0 = normal) | Worst day | 3σ days observed | 3σ days a normal distribution predicts |
|---|---|---|---|---|
| BTC-USD | 3.48 | -14.0% | 16 | 3.0 |
| SPY | 20.73 | -5.9% | 7 | 2.0 |
| NVDA | 4.83 | -17.0% | 8 | 2.0 |

**What it means:** every asset shows positive excess kurtosis — extreme days happen far more often than bell-curve math allows. Any risk model (or position size) calibrated to "normal" volatility will be blindsided by the tails. This is why the engine sizes positions off a hard risk cap, not off average volatility.

## 2 · A handful of days carry the returns — and they cluster with the crashes

| Asset | Full-period return | Missing the 10 BEST days | Missing the 10 WORST days | Best days within ±5d of a worst day |
|---|---|---|---|---|
| BTC-USD | +118.0% | -15.3% | +402.6% | 50% |
| ETH-USD | +3.1% | -73.6% | +247.9% | 50% |
| SPY | +61.8% | +17.4% | +128.1% | 40% |
| QQQ | +76.1% | +18.5% | +169.1% | 40% |
| NVDA | +321.6% | +56.4% | +983.0% | 30% |

**What it means:** missing just the 10 best days destroys most (sometimes all) of the return. Missing the 10 worst days would of course be even better — but the last column is why you can't have one without the other: it MEASURES how often the best days land within a week of the worst ones. Where that clustering is high, "getting out until things calm down" mechanically forfeits the rebound days too. Perfect foresight of bad days is not on the menu; being absent for the good ones is the realistic cost of trying.

## 3 · Volatility is predictable; direction is not

| Asset | Direction: lag-1 autocorr | Direction: avg lags 1–10 | Volatility (\|r\|): lag-1 autocorr | Volatility: avg lags 1–10 |
|---|---|---|---|---|
| BTC-USD | -0.056 | -0.003 | 0.142 | 0.062 |
| SPY | -0.070 | -0.012 | 0.201 | 0.135 |

**What it means:** yesterday's return says little about which WAY today goes (direction autocorrelation small, slightly negative here — mild mean reversion at best), but yesterday's SIZE of move says a lot about today's size (volatility autocorrelation several times larger, and it persists across lags). This asymmetry is the closest thing to a free, robust "truth" in market data — and note what it implies: the predictable quantity (risk) is the one honest systems manage, while the unpredictable one (direction) is the one hype systems claim to know.

## 4 · Diversification weakens exactly when you need it

| Pair | Calm-day correlation | Stress-day correlation (top-quartile moves) |
|---|---|---|
| BTC-USD/ETH-USD | 0.56 | 0.87 |
| BTC-USD/SPY | 0.21 | 0.44 |
| SPY/QQQ | 0.83 | 0.97 |
| SPY/TLT | 0.13 | 0.16 |
| SPY/GLD | 0.07 | 0.21 |

**What it means:** where correlations rise on stress days (they usually do for risk assets), the portfolio "diversification" you measured in calm markets partially evaporates in crashes. Pairs that hold near-zero stress correlation (see SPY/TLT and SPY/GLD in the table — check the table, not the folklore) are the scarce, valuable kind.

*Methodology caveat, stated because honesty applies to our own tables too: conditioning on large joint moves mechanically inflates a conditional correlation even when the true dependence is constant (Boyer–Gibson–Loretan). Part of each calm→stress gap is that selection artifact rather than a regime change — the cross-pair COMPARISON (risk pairs jumping vs. hedge pairs staying flat) is the robust reading, not the absolute gap sizes. Mixed-calendar pairs (BTC/SPY) are computed over identical shared-date intervals so weekends don't bias the estimate.*

## 5 · Did past winners keep winning here? (the screen's premise, tested)

Classic 12-1 momentum (the 11-month return ending one month before entry), monthly rebalance, top vs bottom quartile, no fitted parameters:

| Universe | Top-quartile (past winners) | Bottom-quartile (past losers) | Equal-weight all | Months top beat bottom |
|---|---|---|---|---|
| 16 crypto | -47.6% | -9.6% | -16.6% | 43% |
| 22 equities/ETFs | +38.3% | +22.7% | +37.8% | 55% |

**What it means:** this is the honest test of the dashboard screen's core premise on our own data, and the result cuts however it cuts: in crypto, past winners LAGGED past losers (-47.6% vs -9.6%); in equities, past winners beat past losers (+38.3% vs +22.7%). Factor premia are noisy and episodic, and three years is a short sample — which is precisely why a screen built on momentum must be treated as a tilt, not a truth. The equal-weight column shows how much of everything is just market beta. Where our own screen's premise fails on our own data, we say so.

## 6 · Is the strategy distinguishable from luck? (usually: no)

2,000 random traders per asset — same number of trades, same durations, random timing and direction, same costs. To make the comparison like-for-like, the real strategy's trades are replayed at unit notional on the same basis as the random traders (its actual risk-sized backtest return, shown in parentheses, is smaller):

| Asset | Trend strategy, unit-notional replay (actual sized backtest) | Random-trader median | Random 95th percentile | Strategy's percentile among random |
|---|---|---|---|---|
| BTC-USD | +51.6% (+22.0%) | -33.0% | +180.6% | 84th |
| SPY | -2.9% (-2.5%) | -5.6% | +21.9% | 57th |

**What it means:** a strategy below the ~95th percentile of random traders is statistically indistinguishable from luck. This is the test every "look at my bot's returns" screenshot silently fails — with enough random traders, some always look brilliant. Survivors post; the rest delete their accounts.

---

## The system these truths actually support

Put together, the measurements point to an investment approach that is boring, robust, and honest:

1. **Size for the tails you measured, not the average day** (Study 1) — hard risk caps, not vol-calibrated leverage.
2. **Stay invested; do not time** (Study 2) — the measured clustering of best days around worst days means exiting after pain forfeits the rebounds that carry the whole return.
3. **Manage risk, not direction** (Study 3) — the predictable thing is how wild markets are, not where they go.
4. **Diversify with stress correlations, not calm ones** (Study 4).
5. **Treat factor tilts as tilts, not truths** (Study 5) — small, patient, and allowed to fail for years.
6. **Demand luck-adjusted evidence from any active claim** (Study 6) — including your own.

*None of this promises returns. It is the empirical case for why nobody can honestly promise them — and what a sane system does instead.*
