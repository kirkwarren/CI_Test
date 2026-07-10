# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-07-10 · crypto through 2026-07-09 (completed UTC days), equities through 2026-07-09 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **GOOGL** | stock | 0.95 | +108.4% | +14.2% | 1.41 | +30% | -30% | +12.7% |
| 2 | **XLK** | etf | 0.92 | +43.7% | +26.4% | 1.17 | +25% | -26% | +21.5% |
| 3 | **QQQ** | etf | 0.85 | +29.6% | +16.0% | 1.22 | +20% | -23% | +13.5% |
| 4 | **AAPL** | stock | 0.83 | +43.6% | +20.5% | 0.79 | +26% | -33% | +16.2% |
| 5 | **EEM** | etf | 0.83 | +35.9% | +16.6% | 1.01 | +19% | -19% | +12.3% |
| 6 | **NVDA** | stock | 0.79 | +30.4% | +8.3% | 1.36 | +47% | -37% | +5.9% |
| 7 | **SPY** | etf | 0.78 | +19.2% | +8.7% | 1.25 | +15% | -19% | +8.3% |
| 8 | **IWM** | etf | 0.77 | +28.4% | +16.1% | 0.83 | +21% | -28% | +13.5% |
| 9 | **JPM** | stock | 0.76 | +10.0% | +0.3% | 1.34 | +23% | -25% | +8.6% |
| 10 | **NEAR-USD** | crypto | 0.68 | -8.3% | +11.5% | 0.62 | +104% | -89% | +23.0% |

Bottom of the screen: LTC-USD (0.16), AVAX-USD (0.11), BCH-USD (0.11), ADA-USD (0.08), DOT-USD (0.02).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -82.7% | -73.5% | below 200d |
| DOT-USD | -81.9% | -73.6% | below 200d |
| AVAX-USD | -81.0% | -66.0% | below 200d |
| DOGE-USD | -74.8% | -53.1% | below 200d |
| AAVE-USD | -74.5% | -79.4% | below 200d |
| UNI-USD | -72.1% | -70.1% | below 200d |
| LINK-USD | -71.1% | -45.0% | below 200d |
| ATOM-USD | -70.1% | -58.8% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 9 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **+0.9%** vs median buy-and-hold: **+39.5%**
- Median walk-forward degradation: **+100%** of the in-sample edge lost out-of-sample (over the 23 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 34 assets: **+3.1%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.4%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| GOOGL | -9.1% | +208.2% | +1.8% | +52% | 20 |
| XLK | -4.7% | +116.0% | +2.3% | +57% | 20 |
| QQQ | -0.3% | +97.4% | -3.2% | n/a | 20 |
| BTC-USD | +27.2% | +106.3% | -2.1% | +133% | 39 |
| ETH-USD | +10.4% | -7.2% | -0.4% | +106% | 33 |
| SPY | +5.8% | +71.0% | -1.0% | +129% | 32 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-07-10. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
