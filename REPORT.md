# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-15 · crypto through 2026-09-14 (completed UTC days), equities through 2026-09-14 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.015% over 720 overlapping days
- ETH-USD: median divergence 0.015% over 720 overlapping days
- SOL-USD: median divergence 0.015% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **XLK** | etf | 0.86 | +40.8% | +34.7% | 1.17 | +25% | -26% | +14.1% |
| 2 | **AAPL** | stock | 0.83 | +32.7% | +33.2% | 0.94 | +27% | -33% | +16.8% |
| 3 | **JPM** | stock | 0.77 | +18.8% | +23.5% | 1.36 | +23% | -25% | +9.5% |
| 4 | **NVDA** | stock | 0.77 | +27.2% | +17.0% | 1.36 | +47% | -37% | +6.8% |
| 5 | **NEAR-USD** | crypto | 0.76 | -40.2% | +82.8% | 0.76 | +105% | -89% | +42.8% |
| 6 | **QQQ** | etf | 0.75 | +25.3% | +19.4% | 1.17 | +20% | -23% | +7.3% |
| 7 | **GOOGL** | stock | 0.70 | +44.1% | +15.6% | 1.17 | +31% | -30% | +3.7% |
| 8 | **XLE** | etf | 0.68 | +37.0% | +11.8% | 0.63 | +22% | -22% | +16.6% |
| 9 | **SPY** | etf | 0.68 | +18.3% | +14.9% | 1.26 | +15% | -19% | +6.5% |
| 10 | **SOL-USD** | crypto | 0.65 | -68.6% | +11.0% | 1.08 | +83% | -76% | +23.3% |

Bottom of the screen: ADA-USD (0.15), AVAX-USD (0.14), ATOM-USD (0.07), BCH-USD (0.07), DOT-USD (0.05).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| AVAX-USD | -78.5% | -78.5% | below 200d |
| DOT-USD | -77.9% | -82.4% | below 200d |
| ADA-USD | -77.5% | -80.2% | below 200d |
| DOGE-USD | -70.4% | -75.0% | below 200d |
| ATOM-USD | -66.1% | -68.2% | below 200d |
| BCH-USD | -65.9% | -66.2% | below 200d |
| SOL-USD | -58.6% | -68.6% | above 200d |
| AAVE-USD | -58.5% | -71.9% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **7 of 38** assets — and 7 of those 7 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.0%** vs median buy-and-hold: **+58.7%**
- Median walk-forward degradation: **+88%** of the in-sample edge lost out-of-sample (over the 23 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.5%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.6%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 7/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | -5.7% | +118.2% | -2.2% | +373% | 20 |
| AAPL | -8.3% | +90.3% | -1.4% | n/a | 20 |
| JPM | +1.8% | +135.3% | +0.2% | +95% | 28 |
| BTC-USD | +17.7% | +194.2% | +5.6% | +43% | 37 |
| ETH-USD | +14.1% | +53.9% | +4.3% | +16% | 30 |
| SPY | -0.6% | +71.6% | +1.8% | +37% | 21 |
| QQQ | -11.2% | +91.3% | -0.8% | +224% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-15. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
