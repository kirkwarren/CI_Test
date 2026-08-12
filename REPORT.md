# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-08-12 · crypto through 2026-08-11 (completed UTC days), equities through 2026-08-11 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.015% over 720 overlapping days
- ETH-USD: median divergence 0.016% over 720 overlapping days
- SOL-USD: median divergence 0.016% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **XLK** | etf | 0.93 | +36.3% | +29.8% | 1.18 | +25% | -26% | +18.6% |
| 2 | **JPM** | stock | 0.84 | +15.9% | +12.4% | 1.35 | +23% | -25% | +15.3% |
| 3 | **AMZN** | stock | 0.81 | +11.1% | +30.4% | 0.85 | +32% | -31% | +14.8% |
| 4 | **GOOGL** | stock | 0.80 | +75.0% | +6.0% | 1.21 | +31% | -30% | +4.1% |
| 5 | **NVDA** | stock | 0.80 | +11.4% | +14.4% | 1.38 | +47% | -37% | +11.9% |
| 6 | **QQQ** | etf | 0.80 | +23.9% | +17.0% | 1.19 | +21% | -23% | +10.7% |
| 7 | **IWM** | etf | 0.78 | +33.2% | +12.8% | 0.83 | +21% | -28% | +12.4% |
| 8 | **SPY** | etf | 0.77 | +17.6% | +11.0% | 1.26 | +15% | -19% | +9.5% |
| 9 | **AAPL** | stock | 0.73 | +38.4% | +11.0% | 0.80 | +27% | -33% | +8.9% |
| 10 | **XLE** | etf | 0.73 | +33.6% | +13.6% | 0.58 | +22% | -22% | +14.6% |

Bottom of the screen: ADA-USD (0.13), ATOM-USD (0.10), AVAX-USD (0.09), BCH-USD (0.09), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -82.6% | -78.1% | below 200d |
| AVAX-USD | -82.1% | -71.9% | below 200d |
| ADA-USD | -80.6% | -79.1% | below 200d |
| AAVE-USD | -75.3% | -67.0% | below 200d |
| DOGE-USD | -75.2% | -67.3% | below 200d |
| ATOM-USD | -70.6% | -65.1% | below 200d |
| SOL-USD | -69.2% | -56.0% | below 200d |
| UNI-USD | -69.1% | -67.5% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 9 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.1%** vs median buy-and-hold: **+40.8%**
- Median walk-forward degradation: **+118%** of the in-sample edge lost out-of-sample (over the 20 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.2%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.3%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | +0.6% | +119.5% | -4.1% | +716% | 20 |
| JPM | +6.5% | +133.9% | -1.0% | +123% | 28 |
| AMZN | +1.5% | +93.7% | -4.6% | +813% | 24 |
| BTC-USD | +17.5% | +117.0% | -2.7% | +151% | 37 |
| ETH-USD | +10.4% | +2.3% | +1.9% | +69% | 31 |
| SPY | +2.0% | +72.0% | -0.4% | +110% | 33 |
| QQQ | -5.8% | +94.0% | -4.8% | +639% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-08-12. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
