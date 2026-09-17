# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-17 · crypto through 2026-09-16 (completed UTC days), equities through 2026-09-16 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLK** | etf | 0.87 | +39.3% | +31.8% | 1.16 | +25% | -26% | +13.5% |
| 2 | **AAPL** | stock | 0.83 | +29.1% | +30.8% | 0.91 | +27% | -33% | +16.3% |
| 3 | **NVDA** | stock | 0.83 | +26.6% | +17.6% | 1.37 | +47% | -37% | +8.1% |
| 4 | **JPM** | stock | 0.79 | +16.9% | +21.6% | 1.35 | +23% | -25% | +9.0% |
| 5 | **NEAR-USD** | crypto | 0.79 | -39.6% | +80.4% | 0.79 | +105% | -89% | +50.4% |
| 6 | **QQQ** | etf | 0.72 | +23.4% | +16.8% | 1.16 | +20% | -23% | +6.5% |
| 7 | **XLE** | etf | 0.70 | +41.7% | +9.4% | 0.62 | +22% | -22% | +15.3% |
| 8 | **GOOGL** | stock | 0.69 | +36.7% | +10.3% | 1.15 | +31% | -30% | +1.7% |
| 9 | **SPY** | etf | 0.68 | +16.9% | +12.4% | 1.24 | +15% | -19% | +5.4% |
| 10 | **EEM** | etf | 0.66 | +27.9% | +11.9% | 0.97 | +20% | -19% | +5.6% |

Bottom of the screen: AVAX-USD (0.14), ADA-USD (0.10), BCH-USD (0.08), DOT-USD (0.07), ATOM-USD (0.05).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -78.8% | -80.2% | below 200d |
| AVAX-USD | -78.8% | -78.9% | below 200d |
| DOT-USD | -77.5% | -82.1% | below 200d |
| DOGE-USD | -71.4% | -74.0% | below 200d |
| ATOM-USD | -67.5% | -69.0% | below 200d |
| BCH-USD | -66.2% | -65.7% | below 200d |
| AAVE-USD | -61.4% | -70.1% | above 200d |
| SOL-USD | -60.2% | -68.0% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **7 of 38** assets — and 7 of those 7 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.9%** vs median buy-and-hold: **+55.7%**
- Median walk-forward degradation: **+120%** of the in-sample edge lost out-of-sample (over the 25 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.9%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.1%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 7/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | -5.7% | +117.2% | -1.6% | +261% | 20 |
| AAPL | -8.3% | +86.8% | -1.1% | +196% | 20 |
| NVDA | +4.7% | +386.5% | -1.1% | +126% | 31 |
| BTC-USD | +16.8% | +184.5% | +4.6% | +58% | 37 |
| ETH-USD | +12.9% | +47.6% | +4.6% | +29% | 30 |
| SPY | -6.3% | +70.0% | +2.6% | +20% | 20 |
| QQQ | -11.2% | +90.1% | -1.3% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-17. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
