# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-08-26 · crypto through 2026-08-25 (completed UTC days), equities through 2026-08-25 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLK** | etf | 0.85 | +32.8% | +29.5% | 1.14 | +25% | -26% | +14.5% |
| 2 | **JPM** | stock | 0.82 | +20.2% | +20.0% | 1.40 | +23% | -25% | +12.7% |
| 3 | **NEAR-USD** | crypto | 0.76 | -23.3% | +89.7% | 0.65 | +104% | -89% | +15.2% |
| 4 | **GOOGL** | stock | 0.72 | +58.5% | +11.6% | 1.22 | +31% | -30% | +4.0% |
| 5 | **QQQ** | etf | 0.68 | +19.3% | +16.9% | 1.19 | +20% | -23% | +8.7% |
| 6 | **AAPL** | stock | 0.68 | +47.9% | +13.9% | 0.81 | +27% | -33% | +9.9% |
| 7 | **NVDA** | stock | 0.68 | +10.4% | +10.5% | 1.32 | +47% | -37% | +9.0% |
| 8 | **XLE** | etf | 0.68 | +32.4% | +12.6% | 0.64 | +22% | -22% | +14.7% |
| 9 | **IWM** | etf | 0.67 | +24.7% | +13.6% | 0.86 | +21% | -28% | +10.6% |
| 10 | **EEM** | etf | 0.66 | +25.7% | +7.4% | 1.01 | +20% | -19% | +9.8% |

Bottom of the screen: ADA-USD (0.13), AVAX-USD (0.12), BCH-USD (0.12), ATOM-USD (0.05), DOT-USD (0.01).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -81.2% | -77.9% | below 200d |
| AVAX-USD | -79.2% | -71.1% | below 200d |
| ADA-USD | -77.5% | -80.2% | below 200d |
| DOGE-USD | -70.4% | -65.0% | below 200d |
| ATOM-USD | -68.4% | -68.3% | below 200d |
| AAVE-USD | -62.3% | -68.2% | above 200d |
| SOL-USD | -61.0% | -59.0% | above 200d |
| LTC-USD | -60.3% | -56.2% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **8 of 38** assets — and 8 of those 8 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-2.4%** vs median buy-and-hold: **+55.8%**
- Median walk-forward degradation: **+119%** of the in-sample edge lost out-of-sample (over the 19 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.6%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.5%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 8/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | -4.6% | +113.7% | -3.2% | n/a | 20 |
| JPM | +2.5% | +141.7% | -1.9% | +146% | 28 |
| NEAR-USD | -2.2% | +58.2% | n/a | n/a | 4 |
| BTC-USD | +17.6% | +201.0% | -0.1% | +103% | 37 |
| ETH-USD | +13.2% | +47.4% | -0.3% | +119% | 30 |
| SPY | -3.3% | +73.0% | -1.2% | +139% | 29 |
| QQQ | -11.2% | +93.8% | -3.1% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-08-26. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
