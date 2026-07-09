# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-07-09 · crypto through 2026-07-08 (completed UTC days), equities through 2026-07-08 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.016% over 720 overlapping days
- ETH-USD: median divergence 0.016% over 720 overlapping days
- SOL-USD: median divergence 0.016% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **GOOGL** | stock | 0.96 | +108.5% | +14.3% | 1.42 | +30% | -30% | +13.9% |
| 2 | **XLK** | etf | 0.92 | +41.5% | +25.4% | 1.15 | +25% | -26% | +19.1% |
| 3 | **AAPL** | stock | 0.83 | +46.4% | +17.3% | 0.78 | +26% | -33% | +15.3% |
| 4 | **QQQ** | etf | 0.83 | +27.7% | +15.1% | 1.20 | +20% | -23% | +11.7% |
| 5 | **EEM** | etf | 0.82 | +34.4% | +16.5% | 0.99 | +19% | -19% | +11.6% |
| 6 | **NVDA** | stock | 0.80 | +29.6% | +8.5% | 1.36 | +47% | -37% | +6.6% |
| 7 | **SPY** | etf | 0.78 | +18.8% | +8.4% | 1.23 | +15% | -19% | +7.5% |
| 8 | **IWM** | etf | 0.77 | +28.2% | +16.1% | 0.81 | +21% | -28% | +12.2% |
| 9 | **JPM** | stock | 0.73 | +7.0% | -1.0% | 1.32 | +23% | -25% | +7.0% |
| 10 | **XLE** | etf | 0.72 | +33.8% | +18.6% | 0.59 | +22% | -22% | +8.0% |

Bottom of the screen: LTC-USD (0.16), AVAX-USD (0.11), BCH-USD (0.11), ADA-USD (0.08), DOT-USD (0.02).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -82.6% | -71.0% | below 200d |
| DOT-USD | -81.9% | -71.7% | below 200d |
| AVAX-USD | -81.6% | -63.1% | below 200d |
| AAVE-USD | -75.3% | -78.3% | below 200d |
| DOGE-USD | -75.0% | -49.5% | below 200d |
| UNI-USD | -73.0% | -67.2% | below 200d |
| LINK-USD | -71.5% | -42.8% | below 200d |
| ATOM-USD | -69.8% | -57.2% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **11 of 38** assets — and 10 of those 11 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **+0.9%** vs median buy-and-hold: **+39.3%**
- Median walk-forward degradation: **+103%** of the in-sample edge lost out-of-sample (over the 22 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.1%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.4%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 11/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| GOOGL | -9.1% | +210.8% | +1.8% | +52% | 20 |
| XLK | -4.7% | +111.3% | +2.3% | +57% | 20 |
| AAPL | -9.6% | +66.2% | +0.4% | n/a | 20 |
| BTC-USD | +27.6% | +104.6% | -1.5% | +122% | 39 |
| ETH-USD | +10.4% | -7.4% | -0.4% | +107% | 33 |
| SPY | +5.2% | +69.5% | -1.0% | +129% | 32 |
| QQQ | -0.3% | +94.2% | -3.2% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-07-09. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
