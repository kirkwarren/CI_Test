# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-07-17 · crypto through 2026-07-16 (completed UTC days), equities through 2026-07-16 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **GOOGL** | stock | 0.95 | +102.9% | +5.5% | 1.32 | +30% | -30% | +10.4% |
| 2 | **XLK** | etf | 0.90 | +48.7% | +21.2% | 1.06 | +25% | -26% | +15.6% |
| 3 | **AAPL** | stock | 0.86 | +41.8% | +27.7% | 0.82 | +27% | -33% | +21.7% |
| 4 | **QQQ** | etf | 0.83 | +33.6% | +12.7% | 1.11 | +20% | -23% | +10.2% |
| 5 | **JPM** | stock | 0.83 | +11.5% | +10.4% | 1.29 | +23% | -25% | +10.8% |
| 6 | **NVDA** | stock | 0.82 | +24.5% | +11.6% | 1.30 | +47% | -37% | +7.9% |
| 7 | **IWM** | etf | 0.77 | +34.6% | +13.1% | 0.78 | +21% | -28% | +12.3% |
| 8 | **SPY** | etf | 0.77 | +21.3% | +8.2% | 1.19 | +15% | -19% | +7.8% |
| 9 | **EEM** | etf | 0.76 | +43.3% | +11.6% | 0.86 | +20% | -19% | +7.4% |
| 10 | **XLE** | etf | 0.71 | +27.9% | +21.3% | 0.63 | +22% | -22% | +10.0% |

Bottom of the screen: ATOM-USD (0.14), BCH-USD (0.13), AVAX-USD (0.10), ADA-USD (0.06), DOT-USD (0.05).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -83.3% | -77.4% | below 200d |
| AVAX-USD | -81.5% | -69.7% | below 200d |
| DOT-USD | -81.1% | -75.7% | below 200d |
| DOGE-USD | -75.0% | -59.1% | below 200d |
| AAVE-USD | -74.5% | -76.5% | below 200d |
| ATOM-USD | -70.9% | -58.0% | below 200d |
| UNI-USD | -70.9% | -63.0% | below 200d |
| SOL-USD | -69.6% | -57.7% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 9 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **+0.4%** vs median buy-and-hold: **+39.6%**
- Median walk-forward degradation: **+100%** of the in-sample edge lost out-of-sample (over the 21 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.4%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.6%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| GOOGL | -3.5% | +184.4% | +1.9% | +39% | 20 |
| XLK | -0.3% | +99.2% | +0.1% | +96% | 21 |
| AAPL | -9.6% | +71.8% | -0.1% | n/a | 20 |
| BTC-USD | +22.0% | +113.6% | -2.7% | +163% | 38 |
| ETH-USD | +13.1% | -1.8% | +0.7% | +90% | 33 |
| SPY | +5.7% | +66.5% | -1.1% | +188% | 32 |
| QQQ | -0.3% | +84.5% | -3.9% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-07-17. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
