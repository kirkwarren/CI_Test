# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-07-06 · crypto through 2026-07-05 (completed UTC days), equities through 2026-07-02 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.016% over 720 overlapping days
- ETH-USD: median divergence 0.016% over 720 overlapping days
- SOL-USD: median divergence 0.017% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **GOOGL** | stock | 0.95 | +105.8% | +14.7% | 1.38 | +30% | -30% | +13.8% |
| 2 | **XLK** | etf | 0.92 | +58.0% | +24.2% | 1.14 | +25% | -26% | +19.1% |
| 3 | **QQQ** | etf | 0.85 | +36.4% | +15.0% | 1.20 | +20% | -23% | +12.2% |
| 4 | **EEM** | etf | 0.84 | +46.5% | +19.7% | 1.01 | +19% | -19% | +11.0% |
| 5 | **IWM** | etf | 0.83 | +33.8% | +20.0% | 0.88 | +21% | -28% | +14.1% |
| 6 | **AAPL** | stock | 0.79 | +51.7% | +13.0% | 0.74 | +26% | -33% | +14.0% |
| 7 | **SPY** | etf | 0.77 | +23.0% | +8.4% | 1.23 | +15% | -19% | +7.6% |
| 8 | **NVDA** | stock | 0.77 | +45.3% | +3.9% | 1.33 | +47% | -37% | +2.0% |
| 9 | **JPM** | stock | 0.73 | +3.6% | +3.4% | 1.36 | +23% | -25% | +8.4% |
| 10 | **NEAR-USD** | crypto | 0.69 | -8.4% | +17.8% | 0.64 | +104% | -89% | +30.0% |

Bottom of the screen: LTC-USD (0.16), BCH-USD (0.12), AVAX-USD (0.11), ADA-USD (0.09), DOT-USD (0.02).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -80.7% | -71.8% | below 200d |
| AVAX-USD | -80.4% | -62.4% | below 200d |
| ADA-USD | -80.3% | -72.8% | below 200d |
| AAVE-USD | -75.1% | -77.2% | below 200d |
| UNI-USD | -73.9% | -66.5% | below 200d |
| DOGE-USD | -73.1% | -50.4% | below 200d |
| LINK-USD | -69.9% | -44.4% | below 200d |
| ATOM-USD | -69.2% | -58.7% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **9 of 38** assets — and 9 of those 9 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **+0.0%** vs median buy-and-hold: **+41.8%**
- Median walk-forward degradation: **+100%** of the in-sample edge lost out-of-sample (over the 24 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 34 assets: **+3.0%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.1%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 9/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| GOOGL | -9.1% | +199.7% | +3.1% | +2% | 20 |
| XLK | -0.3% | +110.0% | +2.3% | +63% | 21 |
| QQQ | -0.3% | +93.9% | -1.9% | +183% | 20 |
| BTC-USD | +27.0% | +109.5% | -3.7% | +166% | 39 |
| ETH-USD | +2.3% | -4.6% | -0.2% | +104% | 34 |
| SPY | +5.2% | +69.4% | -0.8% | +132% | 32 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-07-06. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
