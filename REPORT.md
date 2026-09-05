# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-05 · crypto through 2026-09-04 (completed UTC days), equities through 2026-09-04 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NVDA** | stock | 0.91 | +27.6% | +29.5% | 1.35 | +47% | -37% | +17.1% |
| 2 | **XLK** | etf | 0.86 | +41.1% | +36.4% | 1.13 | +25% | -26% | +16.8% |
| 3 | **JPM** | stock | 0.78 | +17.3% | +23.9% | 1.43 | +23% | -25% | +12.7% |
| 4 | **EEM** | etf | 0.74 | +30.4% | +19.9% | 1.04 | +20% | -19% | +11.3% |
| 5 | **NEAR-USD** | crypto | 0.73 | -28.5% | +71.4% | 0.72 | +104% | -89% | +30.9% |
| 6 | **QQQ** | etf | 0.73 | +24.2% | +19.9% | 1.15 | +20% | -23% | +9.3% |
| 7 | **GOOGL** | stock | 0.71 | +54.0% | +13.4% | 1.15 | +31% | -30% | +0.7% |
| 8 | **AAPL** | stock | 0.70 | +30.3% | +24.3% | 0.78 | +27% | -33% | +12.7% |
| 9 | **SPY** | etf | 0.67 | +18.4% | +14.5% | 1.25 | +15% | -19% | +8.1% |
| 10 | **XLE** | etf | 0.65 | +30.6% | +13.2% | 0.63 | +22% | -22% | +16.8% |

Bottom of the screen: ADA-USD (0.14), AVAX-USD (0.11), BCH-USD (0.09), ATOM-USD (0.05), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -80.1% | -77.6% | below 200d |
| AVAX-USD | -79.0% | -72.5% | below 200d |
| ADA-USD | -77.3% | -76.4% | below 200d |
| DOGE-USD | -70.7% | -67.0% | below 200d |
| ATOM-USD | -69.0% | -69.1% | below 200d |
| BCH-USD | -62.0% | -63.4% | below 200d |
| LTC-USD | -59.7% | -59.2% | above 200d |
| AAVE-USD | -59.5% | -70.7% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **7 of 38** assets — and 7 of those 7 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.7%** vs median buy-and-hold: **+55.7%**
- Median walk-forward degradation: **+131%** of the in-sample edge lost out-of-sample (over the 20 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.1%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.2%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 7/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NVDA | +9.2% | +374.5% | -0.6% | +111% | 32 |
| XLK | -4.9% | +111.8% | -4.6% | n/a | 20 |
| JPM | +2.7% | +147.0% | -3.0% | +181% | 28 |
| BTC-USD | +12.0% | +209.4% | +0.9% | +88% | 27 |
| ETH-USD | +5.6% | +50.5% | +2.7% | -47% | 31 |
| SPY | -0.6% | +71.4% | -1.0% | +128% | 21 |
| QQQ | -11.2% | +90.2% | -3.4% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-05. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
