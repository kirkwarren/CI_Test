# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-08-08 · crypto through 2026-08-07 (completed UTC days), equities through 2026-08-07 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.015% over 720 overlapping days
- ETH-USD: median divergence 0.016% over 720 overlapping days
- SOL-USD: median divergence 0.016% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **XLK** | etf | 0.93 | +40.9% | +38.6% | 1.18 | +25% | -26% | +20.1% |
| 2 | **NVDA** | stock | 0.91 | +13.0% | +30.3% | 1.38 | +47% | -37% | +15.5% |
| 3 | **QQQ** | etf | 0.83 | +27.5% | +21.1% | 1.19 | +21% | -23% | +11.6% |
| 4 | **JPM** | stock | 0.81 | +15.1% | +15.3% | 1.32 | +23% | -25% | +14.1% |
| 5 | **GOOGL** | stock | 0.80 | +83.0% | +7.0% | 1.24 | +31% | -30% | +7.7% |
| 6 | **AAPL** | stock | 0.79 | +48.3% | +13.6% | 0.83 | +27% | -33% | +12.1% |
| 7 | **AMZN** | stock | 0.79 | +11.1% | +23.3% | 0.86 | +32% | -31% | +16.0% |
| 8 | **IWM** | etf | 0.78 | +34.8% | +17.9% | 0.81 | +21% | -28% | +12.9% |
| 9 | **SPY** | etf | 0.77 | +18.8% | +14.1% | 1.26 | +15% | -19% | +10.0% |
| 10 | **EEM** | etf | 0.74 | +36.1% | +12.1% | 0.94 | +20% | -19% | +8.4% |

Bottom of the screen: ADA-USD (0.14), AVAX-USD (0.11), BCH-USD (0.08), ATOM-USD (0.05), DOT-USD (0.02).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -81.9% | -78.6% | below 200d |
| AVAX-USD | -81.7% | -72.3% | below 200d |
| ADA-USD | -79.1% | -78.8% | below 200d |
| DOGE-USD | -76.0% | -67.5% | below 200d |
| AAVE-USD | -74.9% | -69.1% | below 200d |
| ATOM-USD | -72.1% | -65.0% | below 200d |
| SOL-USD | -70.3% | -55.7% | below 200d |
| LINK-USD | -69.4% | -58.7% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **11 of 38** assets — and 10 of those 11 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.1%** vs median buy-and-hold: **+37.8%**
- Median walk-forward degradation: **+129%** of the in-sample edge lost out-of-sample (over the 22 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 32 assets: **+3.2%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.9%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 11/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | +0.5% | +120.7% | -2.4% | +464% | 20 |
| NVDA | +14.7% | +401.4% | -3.5% | +130% | 35 |
| QQQ | -5.8% | +94.4% | -4.6% | +416% | 20 |
| BTC-USD | +19.3% | +119.5% | -0.2% | +102% | 36 |
| ETH-USD | +11.1% | +3.2% | +2.9% | +61% | 31 |
| SPY | -2.5% | +72.3% | -1.8% | +153% | 23 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-08-08. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
