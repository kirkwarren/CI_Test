# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-06 · crypto through 2026-09-05 (completed UTC days), equities through 2026-09-04 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.015% over 720 overlapping days
- ETH-USD: median divergence 0.015% over 720 overlapping days
- SOL-USD: median divergence 0.015% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **NVDA** | stock | 0.91 | +27.6% | +29.5% | 1.37 | +47% | -37% | +17.1% |
| 2 | **XLK** | etf | 0.86 | +41.1% | +36.4% | 1.14 | +25% | -26% | +16.8% |
| 3 | **JPM** | stock | 0.78 | +17.3% | +23.9% | 1.43 | +23% | -25% | +12.7% |
| 4 | **NEAR-USD** | crypto | 0.76 | -31.0% | +78.6% | 0.71 | +104% | -89% | +31.4% |
| 5 | **EEM** | etf | 0.74 | +30.4% | +19.9% | 1.05 | +20% | -19% | +11.3% |
| 6 | **QQQ** | etf | 0.73 | +24.2% | +19.9% | 1.17 | +20% | -23% | +9.3% |
| 7 | **AAPL** | stock | 0.71 | +30.3% | +24.3% | 0.83 | +27% | -33% | +12.7% |
| 8 | **GOOGL** | stock | 0.69 | +54.0% | +13.4% | 1.16 | +31% | -30% | +0.7% |
| 9 | **UNI-USD** | crypto | 0.68 | -57.3% | +83.2% | 0.64 | +104% | -87% | +98.6% |
| 10 | **SPY** | etf | 0.66 | +18.4% | +14.5% | 1.27 | +15% | -19% | +8.1% |

Bottom of the screen: ADA-USD (0.14), AVAX-USD (0.11), BCH-USD (0.09), ATOM-USD (0.06), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -79.8% | -78.6% | below 200d |
| AVAX-USD | -78.4% | -73.7% | below 200d |
| ADA-USD | -76.5% | -75.8% | below 200d |
| DOGE-USD | -69.0% | -68.3% | above 200d |
| ATOM-USD | -67.7% | -69.5% | below 200d |
| BCH-USD | -60.8% | -65.0% | below 200d |
| SOL-USD | -58.3% | -64.3% | above 200d |
| AAVE-USD | -58.2% | -70.3% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **7 of 38** assets — and 7 of those 7 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.7%** vs median buy-and-hold: **+58.3%**
- Median walk-forward degradation: **+108%** of the in-sample edge lost out-of-sample (over the 22 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.7%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.3%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 7/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NVDA | +9.2% | +389.5% | -0.3% | +105% | 32 |
| XLK | -5.7% | +114.1% | -3.0% | n/a | 20 |
| JPM | +2.7% | +147.4% | -2.1% | +164% | 28 |
| BTC-USD | +18.5% | +203.8% | +3.7% | +56% | 37 |
| ETH-USD | +13.7% | +50.6% | +2.7% | -11% | 30 |
| SPY | -0.7% | +72.6% | -0.6% | +112% | 21 |
| QQQ | -11.2% | +91.9% | -1.0% | +239% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-06. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
