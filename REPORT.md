# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-08-13 · crypto through 2026-08-12 (completed UTC days), equities through 2026-08-12 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLK** | etf | 0.93 | +39.0% | +32.5% | 1.20 | +25% | -26% | +20.2% |
| 2 | **NVDA** | stock | 0.88 | +16.3% | +18.9% | 1.40 | +47% | -37% | +15.2% |
| 3 | **JPM** | stock | 0.86 | +18.4% | +14.7% | 1.36 | +23% | -25% | +16.2% |
| 4 | **QQQ** | etf | 0.82 | +25.6% | +18.4% | 1.20 | +21% | -23% | +11.4% |
| 5 | **GOOGL** | stock | 0.80 | +78.9% | +7.8% | 1.21 | +31% | -30% | +3.9% |
| 6 | **IWM** | etf | 0.78 | +33.7% | +13.7% | 0.84 | +21% | -28% | +12.9% |
| 7 | **EEM** | etf | 0.76 | +33.2% | +9.7% | 0.99 | +20% | -19% | +9.4% |
| 8 | **AMZN** | stock | 0.75 | +11.8% | +29.1% | 0.83 | +32% | -31% | +12.6% |
| 9 | **SPY** | etf | 0.75 | +18.2% | +11.6% | 1.26 | +15% | -19% | +9.7% |
| 10 | **XLE** | etf | 0.74 | +35.2% | +13.9% | 0.59 | +22% | -22% | +14.6% |

Bottom of the screen: ADA-USD (0.13), ATOM-USD (0.09), AVAX-USD (0.09), BCH-USD (0.08), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -82.9% | -79.9% | below 200d |
| AVAX-USD | -82.1% | -73.9% | below 200d |
| ADA-USD | -81.0% | -81.3% | below 200d |
| DOGE-USD | -76.0% | -69.5% | below 200d |
| AAVE-USD | -75.4% | -70.7% | below 200d |
| ATOM-USD | -71.4% | -67.3% | below 200d |
| UNI-USD | -70.6% | -69.3% | above 200d |
| SOL-USD | -69.5% | -60.9% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 9 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.1%** vs median buy-and-hold: **+39.7%**
- Median walk-forward degradation: **+117%** of the in-sample edge lost out-of-sample (over the 20 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.3%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.0%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | +0.6% | +122.8% | -4.1% | +716% | 20 |
| NVDA | +17.1% | +412.2% | +0.1% | +99% | 34 |
| JPM | +6.9% | +136.0% | -1.0% | +123% | 29 |
| BTC-USD | +20.0% | +115.6% | +0.2% | +98% | 36 |
| ETH-USD | +12.8% | +1.8% | +1.3% | +79% | 30 |
| SPY | +2.1% | +72.4% | -0.4% | +110% | 33 |
| QQQ | -5.8% | +95.4% | -4.8% | +639% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-08-13. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
