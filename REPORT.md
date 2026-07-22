# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-07-22 · crypto through 2026-07-21 (completed UTC days), equities through 2026-07-21 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLK** | etf | 0.90 | +46.8% | +24.1% | 1.10 | +25% | -26% | +17.3% |
| 2 | **GOOGL** | stock | 0.89 | +98.9% | +5.2% | 1.32 | +30% | -30% | +7.6% |
| 3 | **QQQ** | etf | 0.84 | +32.0% | +14.1% | 1.15 | +20% | -23% | +10.5% |
| 4 | **AAPL** | stock | 0.83 | +41.1% | +28.3% | 0.80 | +27% | -33% | +19.2% |
| 5 | **NVDA** | stock | 0.83 | +22.2% | +11.3% | 1.33 | +47% | -37% | +7.6% |
| 6 | **JPM** | stock | 0.81 | +11.7% | +10.5% | 1.26 | +23% | -25% | +11.3% |
| 7 | **EEM** | etf | 0.79 | +44.2% | +12.9% | 0.90 | +20% | -19% | +9.1% |
| 8 | **SPY** | etf | 0.76 | +19.0% | +8.2% | 1.17 | +15% | -19% | +7.3% |
| 9 | **IWM** | etf | 0.75 | +33.0% | +11.6% | 0.77 | +21% | -28% | +12.3% |
| 10 | **XLE** | etf | 0.74 | +25.1% | +22.7% | 0.59 | +22% | -22% | +12.5% |

Bottom of the screen: BCH-USD (0.12), ATOM-USD (0.11), AVAX-USD (0.10), ADA-USD (0.08), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -82.0% | -82.4% | below 200d |
| DOT-USD | -81.4% | -79.1% | below 200d |
| AVAX-USD | -81.3% | -76.0% | below 200d |
| DOGE-USD | -74.7% | -69.8% | below 200d |
| AAVE-USD | -73.3% | -77.1% | below 200d |
| ATOM-USD | -70.9% | -66.2% | below 200d |
| UNI-USD | -69.4% | -72.5% | above 200d |
| SOL-USD | -68.5% | -63.0% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 8 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **+0.4%** vs median buy-and-hold: **+38.7%**
- Median walk-forward degradation: **+118%** of the in-sample edge lost out-of-sample (over the 22 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.7%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.6%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | +0.5% | +104.9% | -0.5% | +110% | 20 |
| GOOGL | -4.6% | +185.6% | +0.9% | +79% | 20 |
| QQQ | -5.8% | +88.4% | -3.5% | n/a | 20 |
| BTC-USD | +20.7% | +121.1% | -2.8% | +153% | 38 |
| ETH-USD | +13.1% | +2.1% | +1.0% | +88% | 33 |
| SPY | +5.4% | +64.7% | -0.4% | +116% | 32 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-07-22. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
