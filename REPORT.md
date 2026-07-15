# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-07-15 · crypto through 2026-07-14 (completed UTC days), equities through 2026-07-14 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **GOOGL** | stock | 0.95 | +98.6% | +9.4% | 1.34 | +30% | -30% | +12.4% |
| 2 | **XLK** | etf | 0.92 | +43.2% | +25.6% | 1.11 | +25% | -26% | +19.9% |
| 3 | **QQQ** | etf | 0.86 | +29.4% | +14.8% | 1.15 | +20% | -23% | +12.6% |
| 4 | **NVDA** | stock | 0.84 | +24.2% | +14.6% | 1.32 | +47% | -37% | +10.3% |
| 5 | **AAPL** | stock | 0.82 | +40.0% | +21.4% | 0.75 | +26% | -33% | +15.3% |
| 6 | **EEM** | etf | 0.79 | +39.9% | +14.9% | 0.91 | +20% | -19% | +10.1% |
| 7 | **JPM** | stock | 0.77 | +9.3% | +4.2% | 1.29 | +23% | -25% | +10.8% |
| 8 | **SPY** | etf | 0.77 | +18.3% | +8.3% | 1.20 | +15% | -19% | +8.1% |
| 9 | **IWM** | etf | 0.76 | +31.0% | +13.2% | 0.77 | +21% | -28% | +12.1% |
| 10 | **XLE** | etf | 0.70 | +28.2% | +22.0% | 0.63 | +22% | -22% | +10.1% |

Bottom of the screen: ATOM-USD (0.14), BCH-USD (0.12), AVAX-USD (0.10), ADA-USD (0.08), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -82.8% | -75.1% | below 200d |
| DOT-USD | -81.3% | -74.8% | below 200d |
| AVAX-USD | -81.0% | -68.1% | below 200d |
| DOGE-USD | -74.3% | -55.0% | below 200d |
| AAVE-USD | -72.4% | -78.3% | below 200d |
| ATOM-USD | -69.9% | -56.0% | below 200d |
| UNI-USD | -69.8% | -71.6% | below 200d |
| LINK-USD | -68.8% | -48.1% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 9 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **+0.4%** vs median buy-and-hold: **+40.2%**
- Median walk-forward degradation: **+100%** of the in-sample edge lost out-of-sample (over the 21 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.4%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.6%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| GOOGL | -3.5% | +188.4% | +1.9% | +39% | 20 |
| XLK | -0.3% | +106.0% | +0.1% | +96% | 21 |
| QQQ | -0.3% | +88.1% | -3.9% | n/a | 20 |
| BTC-USD | +21.5% | +114.9% | -2.7% | +163% | 38 |
| ETH-USD | +13.1% | -1.7% | +0.3% | +96% | 33 |
| SPY | +5.8% | +66.8% | -1.1% | +188% | 32 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-07-15. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
