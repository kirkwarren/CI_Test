# Market Truths — measured on our own verified data

*Six empirical studies on 3 years of real daily history (38 assets, Coinbase + Nasdaq, integrity-gated). These are measurements of well-documented market regularities — the things that are actually true about markets, as opposed to the "secret edge" fantasy. Nothing here predicts; everything here is reproducible: `./scripts/insights.sh`.*

## 1 · Returns are fat-tailed — Gaussian risk math understates reality

| Asset | Excess kurtosis (0 = normal) | Worst day | 3σ days observed | 3σ days a normal distribution predicts |
|---|---|---|---|---|
| BTC-USD | 3.38 | -14.0% | 16 | 3.0 |
| SPY | 20.59 | -5.9% | 7 | 2.0 |
| NVDA | 4.99 | -17.0% | 8 | 2.0 |

**What it means:** every asset shows positive excess kurtosis — extreme days happen far more often than bell-curve math allows. Any risk model (or position size) calibrated to "normal" volatility will be blindsided by the tails. This is why the engine sizes positions off a hard risk cap, not off average volatility.

## 2 · A handful of days carry the returns — and they cluster with the crashes

| Asset | Full-period return | Missing the 10 BEST days | Missing the 10 WORST days | Best days within ±5d of a worst day |
|---|---|---|---|---|
| BTC-USD | +201.0% | +17.0% | +587.6% | 50% |
| ETH-USD | +47.4% | -64.2% | +397.2% | 40% |
| SPY | +73.0% | +25.5% | +143.8% | 40% |
| QQQ | +93.8% | +29.2% | +196.2% | 40% |
| NVDA | +354.9% | +71.6% | +1068.5% | 30% |

**What it means:** missing just the 10 best days destroys most (sometimes all) of the return. Missing the 10 worst days would of course be even better — but the last column is why you can't have one without the other: it MEASURES how often the best days land within a week of the worst ones. Where that clustering is high, "getting out until things calm down" mechanically forfeits the rebound days too. Perfect foresight of bad days is not on the menu; being absent for the good ones is the realistic cost of trying.

## 3 · Volatility is predictable; direction is not

| Asset | Direction: lag-1 autocorr | Direction: avg lags 1–10 | Volatility (\|r\|): lag-1 autocorr | Volatility: avg lags 1–10 |
|---|---|---|---|---|
| BTC-USD | -0.050 | -0.002 | 0.145 | 0.061 |
| SPY | -0.069 | -0.012 | 0.204 | 0.134 |

**What it means:** yesterday's return says little about which WAY today goes (direction autocorrelation small, slightly negative here — mild mean reversion at best), but yesterday's SIZE of move says a lot about today's size (volatility autocorrelation several times larger, and it persists across lags). This asymmetry is the closest thing to a free, robust "truth" in market data — and note what it implies: the predictable quantity (risk) is the one honest systems manage, while the unpredictable one (direction) is the one hype systems claim to know.

## 4 · Diversification weakens exactly when you need it

| Pair | Calm-day correlation | Stress-day correlation (top-quartile moves) |
|---|---|---|
| BTC-USD/ETH-USD | 0.57 | 0.87 |
| BTC-USD/SPY | 0.19 | 0.43 |
| SPY/QQQ | 0.82 | 0.97 |
| SPY/TLT | 0.13 | 0.16 |
| SPY/GLD | 0.06 | 0.21 |

**What it means:** where correlations rise on stress days (they usually do for risk assets), the portfolio "diversification" you measured in calm markets partially evaporates in crashes. Pairs that hold near-zero stress correlation (see SPY/TLT and SPY/GLD in the table — check the table, not the folklore) are the scarce, valuable kind.

*Methodology caveat, stated because honesty applies to our own tables too: conditioning on large joint moves mechanically inflates a conditional correlation even when the true dependence is constant (Boyer–Gibson–Loretan). Part of each calm→stress gap is that selection artifact rather than a regime change — the cross-pair COMPARISON (risk pairs jumping vs. hedge pairs staying flat) is the robust reading, not the absolute gap sizes. Mixed-calendar pairs (BTC/SPY) are computed over identical shared-date intervals so weekends don't bias the estimate.*

## 5 · Did past winners keep winning here? (the screen's premise, tested)

Classic 12-1 momentum (the 11-month return ending one month before entry), monthly rebalance, top vs bottom quartile, no fitted parameters:

| Universe | Top-quartile (past winners) | Bottom-quartile (past losers) | Equal-weight all | Months top beat bottom |
|---|---|---|---|---|
| 16 crypto | -61.8% | -39.7% | -24.1% | 48% |
| 22 equities/ETFs | +36.2% | +22.2% | +37.5% | 59% |

**What it means:** this is the honest test of the dashboard screen's core premise on our own data, and the result cuts however it cuts: in crypto, past winners LAGGED past losers (-61.8% vs -39.7%); in equities, past winners beat past losers (+36.2% vs +22.2%). Factor premia are noisy and episodic, and three years is a short sample — which is precisely why a screen built on momentum must be treated as a tilt, not a truth. The equal-weight column shows how much of everything is just market beta. Where our own screen's premise fails on our own data, we say so.

## 6 · Is the strategy distinguishable from luck? (usually: no)

2,000 random traders per asset — same number of trades, same durations, random timing and direction, same costs. To make the comparison like-for-like, the real strategy's trades are replayed at unit notional on the same basis as the random traders (its actual risk-sized backtest return, shown in parentheses, is smaller):

| Asset | Trend strategy, unit-notional replay (actual sized backtest) | Random-trader median | Random 95th percentile | Strategy's percentile among random |
|---|---|---|---|---|
| BTC-USD | +28.7% (+17.6%) | -34.6% | +170.4% | 78th |
| SPY | +13.1% (-3.3%) | -8.9% | +31.0% | 83rd |

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
