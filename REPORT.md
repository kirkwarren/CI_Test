# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-07-14 · crypto through 2026-07-13 (completed UTC days), equities through 2026-07-13 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **GOOGL** | stock | 0.95 | +100.6% | +8.3% | 1.31 | +30% | -30% | +10.4% |
| 2 | **XLK** | etf | 0.92 | +37.5% | +25.7% | 1.11 | +25% | -26% | +18.5% |
| 3 | **QQQ** | etf | 0.85 | +24.9% | +14.7% | 1.14 | +20% | -23% | +11.5% |
| 4 | **AAPL** | stock | 0.83 | +37.3% | +22.5% | 0.78 | +26% | -33% | +16.3% |
| 5 | **EEM** | etf | 0.79 | +33.5% | +13.4% | 0.88 | +20% | -19% | +8.3% |
| 6 | **NVDA** | stock | 0.79 | +22.1% | +10.0% | 1.31 | +47% | -37% | +6.1% |
| 7 | **SPY** | etf | 0.78 | +15.9% | +8.7% | 1.20 | +15% | -19% | +7.8% |
| 8 | **IWM** | etf | 0.77 | +25.5% | +13.6% | 0.78 | +21% | -28% | +11.9% |
| 9 | **JPM** | stock | 0.76 | +7.3% | +1.4% | 1.29 | +23% | -25% | +8.2% |
| 10 | **XLE** | etf | 0.73 | +31.3% | +21.9% | 0.62 | +22% | -22% | +9.9% |

Bottom of the screen: ATOM-USD (0.14), BCH-USD (0.12), AVAX-USD (0.11), ADA-USD (0.06), DOT-USD (0.04).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -83.6% | -76.7% | below 200d |
| AVAX-USD | -81.7% | -68.3% | below 200d |
| DOT-USD | -81.6% | -75.5% | below 200d |
| DOGE-USD | -75.2% | -55.8% | below 200d |
| AAVE-USD | -73.6% | -78.1% | below 200d |
| UNI-USD | -70.7% | -70.0% | below 200d |
| LINK-USD | -70.6% | -49.1% | below 200d |
| ATOM-USD | -70.4% | -58.4% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 10 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **+1.1%** vs median buy-and-hold: **+40.0%**
- Median walk-forward degradation: **+110%** of the in-sample edge lost out-of-sample (over the 23 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.7%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.6%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| GOOGL | -3.5% | +181.1% | +2.2% | +20% | 20 |
| XLK | +0.6% | +106.0% | +0.9% | +76% | 20 |
| QQQ | -0.3% | +87.8% | -3.4% | n/a | 20 |
| BTC-USD | +27.6% | +105.5% | -0.7% | +113% | 39 |
| ETH-USD | +14.7% | -8.1% | +0.0% | +99% | 32 |
| SPY | +5.6% | +66.7% | -2.2% | +174% | 32 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-07-14. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
