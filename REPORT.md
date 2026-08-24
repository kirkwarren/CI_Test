# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-08-24 · crypto through 2026-08-23 (completed UTC days), equities through 2026-08-21 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.015% over 720 overlapping days
- ETH-USD: median divergence 0.016% over 720 overlapping days
- SOL-USD: median divergence 0.015% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **XLK** | etf | 0.85 | +37.3% | +30.1% | 1.18 | +25% | -26% | +15.7% |
| 2 | **JPM** | stock | 0.77 | +19.7% | +13.1% | 1.38 | +23% | -25% | +11.2% |
| 3 | **NEAR-USD** | crypto | 0.77 | -33.1% | +91.0% | 0.68 | +104% | -89% | +25.2% |
| 4 | **NVDA** | stock | 0.73 | +19.0% | +13.1% | 1.33 | +47% | -37% | +10.0% |
| 5 | **XOM** | stock | 0.72 | +44.6% | +12.1% | 0.75 | +23% | -21% | +15.8% |
| 6 | **GOOGL** | stock | 0.71 | +59.4% | +9.5% | 1.23 | +31% | -30% | +3.5% |
| 7 | **QQQ** | etf | 0.70 | +22.3% | +17.2% | 1.22 | +20% | -23% | +9.3% |
| 8 | **XLE** | etf | 0.68 | +38.4% | +16.0% | 0.70 | +22% | -22% | +18.1% |
| 9 | **AAPL** | stock | 0.68 | +42.3% | +16.9% | 0.84 | +27% | -33% | +9.9% |
| 10 | **IWM** | etf | 0.68 | +29.6% | +13.4% | 0.89 | +21% | -28% | +11.1% |

Bottom of the screen: ADA-USD (0.14), AVAX-USD (0.13), BCH-USD (0.10), ATOM-USD (0.05), DOT-USD (0.04).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -79.5% | -80.9% | below 200d |
| AVAX-USD | -78.4% | -76.0% | below 200d |
| ADA-USD | -75.6% | -82.1% | above 200d |
| DOGE-USD | -67.7% | -70.6% | above 200d |
| ATOM-USD | -66.8% | -71.5% | below 200d |
| SOL-USD | -61.5% | -63.8% | above 200d |
| AAVE-USD | -59.4% | -74.0% | above 200d |
| UNI-USD | -58.6% | -66.7% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **8 of 38** assets — and 8 of those 8 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.7%** vs median buy-and-hold: **+62.5%**
- Median walk-forward degradation: **+125%** of the in-sample edge lost out-of-sample (over the 19 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.5%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.3%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 8/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | -5.8% | +119.5% | -3.6% | n/a | 20 |
| JPM | +7.7% | +138.8% | -0.4% | +109% | 29 |
| NEAR-USD | -2.2% | +69.4% | n/a | n/a | 4 |
| BTC-USD | +19.8% | +198.4% | -1.8% | +125% | 39 |
| ETH-USD | +13.5% | +49.0% | +0.8% | +64% | 30 |
| SPY | -2.5% | +75.3% | -2.1% | +150% | 23 |
| QQQ | -11.2% | +97.5% | -3.7% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-08-24. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
