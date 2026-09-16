# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-16 · crypto through 2026-09-15 (completed UTC days), equities through 2026-09-15 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLK** | etf | 0.86 | +40.3% | +32.4% | 1.16 | +25% | -26% | +13.6% |
| 2 | **AAPL** | stock | 0.81 | +30.7% | +31.1% | 0.91 | +27% | -33% | +16.1% |
| 3 | **JPM** | stock | 0.81 | +18.2% | +23.2% | 1.37 | +23% | -25% | +10.2% |
| 4 | **NVDA** | stock | 0.80 | +26.6% | +15.8% | 1.36 | +47% | -37% | +7.3% |
| 5 | **QQQ** | etf | 0.74 | +24.6% | +17.3% | 1.16 | +20% | -23% | +6.6% |
| 6 | **XLE** | etf | 0.73 | +39.8% | +13.9% | 0.66 | +22% | -22% | +18.9% |
| 7 | **GOOGL** | stock | 0.73 | +43.6% | +12.9% | 1.15 | +31% | -30% | +2.3% |
| 8 | **NEAR-USD** | crypto | 0.69 | -39.1% | +56.7% | 0.75 | +105% | -89% | +34.7% |
| 9 | **SPY** | etf | 0.68 | +18.1% | +13.2% | 1.25 | +15% | -19% | +5.9% |
| 10 | **XOM** | stock | 0.68 | +42.7% | +7.7% | 0.64 | +23% | -21% | +15.8% |

Bottom of the screen: AVAX-USD (0.12), ADA-USD (0.11), BCH-USD (0.08), ATOM-USD (0.07), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| AVAX-USD | -79.4% | -78.8% | below 200d |
| DOT-USD | -79.2% | -81.8% | below 200d |
| ADA-USD | -78.9% | -79.8% | below 200d |
| DOGE-USD | -71.7% | -74.1% | below 200d |
| ATOM-USD | -67.5% | -67.7% | below 200d |
| BCH-USD | -66.9% | -65.7% | below 200d |
| SOL-USD | -60.9% | -68.2% | above 200d |
| AAVE-USD | -60.5% | -71.3% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **7 of 38** assets — and 7 of those 7 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.9%** vs median buy-and-hold: **+53.9%**
- Median walk-forward degradation: **+120%** of the in-sample edge lost out-of-sample (over the 25 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.5%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.1%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 7/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | -5.7% | +117.0% | -1.6% | +261% | 20 |
| AAPL | -8.3% | +86.2% | -1.1% | +196% | 20 |
| JPM | +1.2% | +136.4% | -0.2% | +104% | 29 |
| BTC-USD | +6.4% | +184.9% | +4.6% | +60% | 21 |
| ETH-USD | +12.7% | +47.7% | +4.7% | +9% | 30 |
| SPY | -6.3% | +70.7% | +2.6% | +20% | 20 |
| QQQ | -11.2% | +90.1% | -1.3% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-16. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
