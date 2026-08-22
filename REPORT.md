# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-08-22 · crypto through 2026-08-21 (completed UTC days), equities through 2026-08-21 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLK** | etf | 0.84 | +37.3% | +30.1% | 1.17 | +25% | -26% | +15.7% |
| 2 | **NEAR-USD** | crypto | 0.79 | -23.6% | +95.4% | 0.66 | +104% | -89% | +22.8% |
| 3 | **JPM** | stock | 0.77 | +19.7% | +13.1% | 1.39 | +23% | -25% | +11.2% |
| 4 | **NVDA** | stock | 0.73 | +19.0% | +13.1% | 1.35 | +47% | -37% | +10.0% |
| 5 | **XOM** | stock | 0.73 | +44.6% | +12.1% | 0.72 | +23% | -21% | +15.8% |
| 6 | **QQQ** | etf | 0.70 | +22.3% | +17.2% | 1.20 | +21% | -23% | +9.3% |
| 7 | **GOOGL** | stock | 0.70 | +59.4% | +9.5% | 1.23 | +31% | -30% | +3.5% |
| 8 | **XLE** | etf | 0.68 | +38.4% | +16.0% | 0.69 | +22% | -22% | +18.1% |
| 9 | **IWM** | etf | 0.68 | +29.6% | +13.4% | 0.88 | +21% | -28% | +11.1% |
| 10 | **AAPL** | stock | 0.67 | +42.3% | +16.9% | 0.83 | +27% | -33% | +9.9% |

Bottom of the screen: ADA-USD (0.14), AVAX-USD (0.14), BCH-USD (0.11), ATOM-USD (0.05), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -79.3% | -78.0% | below 200d |
| AVAX-USD | -77.7% | -70.9% | below 200d |
| ADA-USD | -75.4% | -79.5% | above 200d |
| DOGE-USD | -68.4% | -66.0% | above 200d |
| ATOM-USD | -67.3% | -66.8% | below 200d |
| AAVE-USD | -65.7% | -67.5% | above 200d |
| UNI-USD | -63.8% | -63.0% | above 200d |
| SOL-USD | -62.1% | -56.8% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **8 of 38** assets — and 8 of those 8 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.7%** vs median buy-and-hold: **+60.5%**
- Median walk-forward degradation: **+116%** of the in-sample edge lost out-of-sample (over the 21 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.1%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.1%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 8/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | +0.5% | +118.3% | -2.1% | +390% | 20 |
| NEAR-USD | -2.2% | +62.6% | n/a | n/a | 4 |
| JPM | +7.6% | +140.2% | +0.2% | +95% | 29 |
| BTC-USD | +22.3% | +196.4% | +0.5% | +92% | 38 |
| ETH-USD | +15.5% | +49.8% | -0.1% | +104% | 32 |
| SPY | -3.2% | +74.8% | -1.3% | +129% | 29 |
| QQQ | -5.8% | +96.3% | -2.7% | +205% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-08-22. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
