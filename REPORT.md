# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-01 · crypto through 2026-08-31 (completed UTC days), equities through 2026-08-31 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLK** | etf | 0.85 | +31.6% | +33.7% | 1.13 | +25% | -26% | +16.9% |
| 2 | **JPM** | stock | 0.81 | +16.8% | +19.6% | 1.41 | +23% | -25% | +12.2% |
| 3 | **NVDA** | stock | 0.78 | +11.4% | +21.0% | 1.32 | +47% | -37% | +12.7% |
| 4 | **QQQ** | etf | 0.74 | +19.2% | +17.9% | 1.15 | +20% | -23% | +9.3% |
| 5 | **GOOGL** | stock | 0.73 | +68.3% | +10.7% | 1.16 | +31% | -30% | +1.4% |
| 6 | **AAPL** | stock | 0.72 | +32.8% | +19.7% | 0.78 | +27% | -33% | +12.0% |
| 7 | **NEAR-USD** | crypto | 0.71 | -29.3% | +67.2% | 0.68 | +104% | -89% | +17.0% |
| 8 | **XLE** | etf | 0.70 | +32.5% | +12.1% | 0.64 | +22% | -22% | +17.5% |
| 9 | **AMZN** | stock | 0.68 | +17.3% | +24.7% | 0.82 | +32% | -31% | +8.8% |
| 10 | **EEM** | etf | 0.68 | +27.9% | +9.0% | 0.99 | +20% | -19% | +9.0% |

Bottom of the screen: ADA-USD (0.10), AVAX-USD (0.10), BCH-USD (0.09), ATOM-USD (0.05), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -81.5% | -79.2% | below 200d |
| AVAX-USD | -79.5% | -73.5% | below 200d |
| ADA-USD | -78.7% | -78.5% | below 200d |
| DOGE-USD | -71.4% | -67.7% | below 200d |
| ATOM-USD | -69.5% | -72.5% | below 200d |
| BCH-USD | -62.2% | -61.8% | below 200d |
| AAVE-USD | -62.2% | -71.3% | above 200d |
| LTC-USD | -61.5% | -59.4% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **7 of 38** assets — and 7 of those 7 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-2.6%** vs median buy-and-hold: **+55.2%**
- Median walk-forward degradation: **+108%** of the in-sample edge lost out-of-sample (over the 17 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.1%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.0%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 7/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | -5.7% | +111.7% | -4.4% | n/a | 20 |
| JPM | +2.4% | +142.5% | -3.1% | +201% | 28 |
| NVDA | +8.3% | +355.1% | -0.3% | +105% | 32 |
| BTC-USD | +14.4% | +203.7% | +0.6% | +93% | 30 |
| ETH-USD | +5.7% | +50.7% | +3.1% | -25% | 31 |
| SPY | -0.6% | +70.0% | -1.9% | +197% | 21 |
| QQQ | -11.2% | +89.8% | -3.5% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-01. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
