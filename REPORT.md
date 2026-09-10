# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-10 · crypto through 2026-09-09 (completed UTC days), equities through 2026-09-09 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLK** | etf | 0.88 | +40.7% | +34.4% | 1.16 | +25% | -26% | +16.8% |
| 2 | **NVDA** | stock | 0.85 | +29.3% | +21.1% | 1.38 | +47% | -37% | +13.5% |
| 3 | **JPM** | stock | 0.81 | +22.8% | +22.9% | 1.42 | +23% | -25% | +11.2% |
| 4 | **NEAR-USD** | crypto | 0.80 | -39.3% | +93.5% | 0.77 | +104% | -89% | +46.5% |
| 5 | **XLE** | etf | 0.72 | +38.1% | +17.5% | 0.67 | +22% | -22% | +18.7% |
| 6 | **QQQ** | etf | 0.71 | +24.5% | +17.9% | 1.16 | +20% | -23% | +8.7% |
| 7 | **AAPL** | stock | 0.69 | +29.6% | +20.9% | 0.84 | +27% | -33% | +10.9% |
| 8 | **EEM** | etf | 0.69 | +28.0% | +16.7% | 1.04 | +20% | -19% | +10.7% |
| 9 | **XOM** | stock | 0.68 | +45.5% | +10.9% | 0.64 | +23% | -21% | +13.1% |
| 10 | **SOL-USD** | crypto | 0.68 | -65.1% | +18.2% | 1.11 | +83% | -76% | +22.7% |

Bottom of the screen: TLT (0.15), ADA-USD (0.13), AVAX-USD (0.11), DOT-USD (0.11), BCH-USD (0.08).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| AVAX-USD | -77.8% | -75.2% | below 200d |
| ADA-USD | -77.2% | -78.0% | below 200d |
| DOT-USD | -75.2% | -80.6% | above 200d |
| DOGE-USD | -70.2% | -71.1% | below 200d |
| ATOM-USD | -61.6% | -69.6% | above 200d |
| BCH-USD | -61.5% | -63.3% | below 200d |
| AAVE-USD | -60.9% | -70.1% | above 200d |
| SOL-USD | -59.0% | -65.1% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **7 of 38** assets — and 7 of those 7 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.0%** vs median buy-and-hold: **+58.4%**
- Median walk-forward degradation: **+94%** of the in-sample edge lost out-of-sample (over the 23 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.1%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.7%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 7/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | -0.2% | +116.3% | -3.4% | n/a | 21 |
| NVDA | +8.6% | +395.1% | +0.7% | +90% | 32 |
| JPM | +2.3% | +145.5% | -0.7% | +115% | 28 |
| BTC-USD | +17.8% | +211.2% | +3.1% | +59% | 37 |
| ETH-USD | +13.6% | +59.1% | +5.5% | +10% | 30 |
| SPY | -0.6% | +70.0% | +0.7% | +87% | 21 |
| QQQ | -11.2% | +90.0% | -1.7% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-10. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
