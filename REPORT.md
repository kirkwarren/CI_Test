# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-07-31 · crypto through 2026-07-30 (completed UTC days), equities through 2026-07-30 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLK** | etf | 0.88 | +44.3% | +17.8% | 1.04 | +25% | -26% | +13.2% |
| 2 | **AAPL** | stock | 0.87 | +37.0% | +30.0% | 0.80 | +27% | -33% | +20.1% |
| 3 | **JPM** | stock | 0.86 | +10.2% | +16.7% | 1.27 | +23% | -25% | +12.6% |
| 4 | **GOOGL** | stock | 0.81 | +82.6% | -0.7% | 1.18 | +30% | -30% | +2.4% |
| 5 | **QQQ** | etf | 0.78 | +29.8% | +7.9% | 1.05 | +20% | -23% | +6.0% |
| 6 | **IWM** | etf | 0.77 | +34.9% | +11.1% | 0.72 | +21% | -28% | +10.2% |
| 7 | **SPY** | etf | 0.76 | +17.6% | +6.7% | 1.13 | +15% | -19% | +6.0% |
| 8 | **XLF** | etf | 0.75 | +1.5% | +7.6% | 1.08 | +16% | -16% | +7.9% |
| 9 | **XOM** | stock | 0.75 | +21.1% | +14.1% | 0.66 | +23% | -21% | +13.0% |
| 10 | **EEM** | etf | 0.71 | +39.0% | +4.7% | 0.80 | +20% | -19% | +5.6% |

Bottom of the screen: AVAX-USD (0.11), ADA-USD (0.09), BCH-USD (0.09), ATOM-USD (0.07), DOT-USD (0.02).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -83.1% | -78.4% | below 200d |
| ADA-USD | -82.3% | -81.1% | below 200d |
| AVAX-USD | -81.7% | -72.0% | below 200d |
| DOGE-USD | -75.6% | -67.3% | below 200d |
| ATOM-USD | -73.8% | -65.8% | below 200d |
| AAVE-USD | -72.2% | -69.0% | below 200d |
| SOL-USD | -69.9% | -58.6% | below 200d |
| LINK-USD | -68.5% | -59.4% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 9 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.1%** vs median buy-and-hold: **+38.7%**
- Median walk-forward degradation: **+120%** of the in-sample edge lost out-of-sample (over the 17 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 32 assets: **+2.9%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.4%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | +0.5% | +97.1% | -2.0% | +181% | 20 |
| AAPL | -14.8% | +69.7% | +1.2% | n/a | 20 |
| JPM | +13.5% | +122.1% | -1.7% | +158% | 28 |
| BTC-USD | +19.4% | +117.9% | -1.4% | +120% | 36 |
| ETH-USD | +13.1% | +2.3% | +2.0% | +77% | 33 |
| SPY | -2.5% | +62.0% | -3.4% | +218% | 23 |
| QQQ | -5.8% | +78.2% | -3.7% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-07-31. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
