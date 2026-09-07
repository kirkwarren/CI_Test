# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-07 · crypto through 2026-09-06 (completed UTC days), equities through 2026-09-04 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NVDA** | stock | 0.90 | +27.6% | +29.5% | 1.38 | +47% | -37% | +17.1% |
| 2 | **XLK** | etf | 0.86 | +41.1% | +36.4% | 1.16 | +25% | -26% | +16.8% |
| 3 | **NEAR-USD** | crypto | 0.79 | -33.8% | +100.6% | 0.75 | +104% | -89% | +45.5% |
| 4 | **JPM** | stock | 0.78 | +17.3% | +23.9% | 1.45 | +23% | -25% | +12.7% |
| 5 | **QQQ** | etf | 0.74 | +24.2% | +19.9% | 1.18 | +20% | -23% | +9.3% |
| 6 | **AAPL** | stock | 0.73 | +30.3% | +24.3% | 0.87 | +27% | -33% | +12.7% |
| 7 | **EEM** | etf | 0.72 | +30.4% | +19.9% | 1.07 | +20% | -19% | +11.3% |
| 8 | **UNI-USD** | crypto | 0.70 | -57.4% | +93.4% | 0.66 | +104% | -87% | +104.3% |
| 9 | **GOOGL** | stock | 0.68 | +54.0% | +13.4% | 1.16 | +31% | -30% | +0.7% |
| 10 | **SPY** | etf | 0.65 | +18.4% | +14.5% | 1.28 | +15% | -19% | +8.1% |

Bottom of the screen: ADA-USD (0.16), AVAX-USD (0.13), BCH-USD (0.09), ATOM-USD (0.06), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -78.4% | -78.6% | below 200d |
| AVAX-USD | -77.6% | -73.6% | below 200d |
| ADA-USD | -76.0% | -75.5% | above 200d |
| DOGE-USD | -68.6% | -67.8% | above 200d |
| ATOM-USD | -67.0% | -69.1% | below 200d |
| BCH-USD | -60.1% | -63.9% | below 200d |
| AAVE-USD | -57.5% | -69.9% | above 200d |
| SOL-USD | -57.0% | -63.2% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **7 of 38** assets — and 7 of those 7 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.9%** vs median buy-and-hold: **+63.9%**
- Median walk-forward degradation: **+102%** of the in-sample edge lost out-of-sample (over the 21 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.4%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.6%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 7/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NVDA | +9.2% | +398.2% | +0.6% | +92% | 32 |
| XLK | -0.2% | +117.2% | -2.5% | +364% | 21 |
| NEAR-USD | -2.2% | +111.9% | n/a | n/a | 4 |
| BTC-USD | +18.8% | +210.1% | +1.7% | +73% | 37 |
| ETH-USD | +14.1% | +53.7% | +2.9% | +13% | 30 |
| SPY | -0.6% | +73.1% | +1.8% | +74% | 21 |
| QQQ | -11.2% | +93.2% | -0.9% | +143% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-07. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
