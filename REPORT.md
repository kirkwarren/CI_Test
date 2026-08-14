# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-08-14 · crypto through 2026-08-13 (completed UTC days), equities through 2026-08-13 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLK** | etf | 0.93 | +35.4% | +33.4% | 1.21 | +25% | -26% | +21.3% |
| 2 | **NVDA** | stock | 0.88 | +16.0% | +18.5% | 1.41 | +47% | -37% | +15.7% |
| 3 | **JPM** | stock | 0.86 | +18.5% | +16.8% | 1.35 | +23% | -25% | +15.4% |
| 4 | **QQQ** | etf | 0.83 | +23.7% | +19.4% | 1.21 | +21% | -23% | +12.6% |
| 5 | **GOOGL** | stock | 0.80 | +82.4% | +11.4% | 1.21 | +31% | -30% | +4.6% |
| 6 | **IWM** | etf | 0.80 | +30.4% | +14.5% | 0.84 | +21% | -28% | +13.1% |
| 7 | **AMZN** | stock | 0.77 | +15.1% | +29.9% | 0.82 | +32% | -31% | +11.6% |
| 8 | **SPY** | etf | 0.77 | +17.4% | +12.4% | 1.28 | +15% | -19% | +10.3% |
| 9 | **EEM** | etf | 0.74 | +31.4% | +8.3% | 0.99 | +20% | -19% | +9.7% |
| 10 | **AAPL** | stock | 0.72 | +42.6% | +10.8% | 0.80 | +27% | -33% | +8.9% |

Bottom of the screen: ADA-USD (0.12), ATOM-USD (0.11), AVAX-USD (0.10), BCH-USD (0.08), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -83.0% | -80.1% | below 200d |
| AVAX-USD | -81.7% | -73.7% | below 200d |
| ADA-USD | -81.0% | -81.7% | below 200d |
| DOGE-USD | -75.8% | -69.6% | below 200d |
| AAVE-USD | -75.4% | -70.2% | below 200d |
| UNI-USD | -69.6% | -69.8% | above 200d |
| ATOM-USD | -69.3% | -67.8% | below 200d |
| SOL-USD | -69.2% | -61.4% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **11 of 38** assets — and 10 of those 11 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.1%** vs median buy-and-hold: **+41.8%**
- Median walk-forward degradation: **+118%** of the in-sample edge lost out-of-sample (over the 20 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.2%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.2%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 11/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | +0.6% | +125.0% | -4.1% | +716% | 20 |
| NVDA | +17.3% | +414.9% | +0.1% | +99% | 34 |
| JPM | +6.2% | +134.6% | -1.0% | +123% | 29 |
| BTC-USD | +17.6% | +117.4% | -2.3% | +140% | 37 |
| ETH-USD | +10.5% | +3.1% | +1.7% | +63% | 31 |
| SPY | +2.5% | +73.6% | -0.4% | +110% | 33 |
| QQQ | -5.8% | +97.7% | -4.8% | +639% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-08-14. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
