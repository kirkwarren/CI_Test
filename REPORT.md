# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-13 · crypto through 2026-09-12 (completed UTC days), equities through 2026-09-11 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLK** | etf | 0.89 | +39.8% | +36.2% | 1.18 | +25% | -26% | +16.3% |
| 2 | **JPM** | stock | 0.84 | +21.5% | +25.9% | 1.41 | +23% | -25% | +11.5% |
| 3 | **AAPL** | stock | 0.82 | +33.3% | +29.9% | 0.94 | +27% | -33% | +16.6% |
| 4 | **NVDA** | stock | 0.81 | +26.4% | +19.2% | 1.36 | +47% | -37% | +10.5% |
| 5 | **EEM** | etf | 0.74 | +28.9% | +19.1% | 1.03 | +20% | -19% | +9.4% |
| 6 | **NEAR-USD** | crypto | 0.74 | -41.3% | +77.6% | 0.75 | +104% | -89% | +38.1% |
| 7 | **QQQ** | etf | 0.73 | +24.6% | +19.7% | 1.16 | +20% | -23% | +8.3% |
| 8 | **XLE** | etf | 0.70 | +37.0% | +13.3% | 0.64 | +22% | -22% | +17.9% |
| 9 | **SPY** | etf | 0.68 | +18.4% | +14.7% | 1.25 | +15% | -19% | +7.0% |
| 10 | **GOOGL** | stock | 0.68 | +43.6% | +11.5% | 1.15 | +31% | -30% | +0.5% |

Bottom of the screen: ADA-USD (0.13), ATOM-USD (0.09), AVAX-USD (0.09), BCH-USD (0.07), DOT-USD (0.05).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| AVAX-USD | -79.0% | -77.8% | below 200d |
| ADA-USD | -77.7% | -80.1% | below 200d |
| DOT-USD | -77.5% | -82.1% | below 200d |
| DOGE-USD | -70.7% | -74.6% | below 200d |
| ATOM-USD | -66.7% | -68.4% | below 200d |
| BCH-USD | -65.4% | -65.5% | below 200d |
| AAVE-USD | -60.2% | -72.7% | above 200d |
| SOL-USD | -58.9% | -68.6% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **7 of 38** assets — and 7 of those 7 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.0%** vs median buy-and-hold: **+56.5%**
- Median walk-forward degradation: **+75%** of the in-sample edge lost out-of-sample (over the 23 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.3%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **+0.0%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 7/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | -5.7% | +119.5% | -3.2% | n/a | 20 |
| JPM | +2.5% | +143.3% | +0.5% | +89% | 28 |
| AAPL | -8.3% | +90.7% | -2.2% | n/a | 20 |
| BTC-USD | +7.1% | +191.2% | +3.7% | +59% | 21 |
| ETH-USD | +6.4% | +55.2% | +4.5% | +21% | 31 |
| SPY | -0.6% | +71.2% | +0.8% | +75% | 21 |
| QQQ | -5.7% | +91.0% | -1.6% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-13. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
