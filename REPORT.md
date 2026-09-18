# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-18 · crypto through 2026-09-17 (completed UTC days), equities through 2026-09-17 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLK** | etf | 0.89 | +36.3% | +36.3% | 1.19 | +25% | -26% | +15.9% |
| 2 | **NEAR-USD** | crypto | 0.86 | -43.8% | +126.6% | 0.84 | +105% | -89% | +79.5% |
| 3 | **NVDA** | stock | 0.84 | +25.7% | +21.6% | 1.38 | +47% | -37% | +10.7% |
| 4 | **AAPL** | stock | 0.82 | +30.2% | +34.8% | 0.93 | +27% | -33% | +17.8% |
| 5 | **JPM** | stock | 0.77 | +17.5% | +21.4% | 1.35 | +23% | -25% | +9.0% |
| 6 | **UNI-USD** | crypto | 0.76 | -65.6% | +111.5% | 0.68 | +105% | -87% | +108.9% |
| 7 | **QQQ** | etf | 0.72 | +21.4% | +20.5% | 1.18 | +20% | -23% | +8.3% |
| 8 | **XLE** | etf | 0.68 | +41.9% | +10.4% | 0.63 | +22% | -22% | +15.9% |
| 9 | **GOOGL** | stock | 0.68 | +37.0% | +12.9% | 1.16 | +31% | -30% | +3.0% |
| 10 | **SPY** | etf | 0.68 | +16.3% | +15.3% | 1.26 | +15% | -19% | +6.5% |

Bottom of the screen: AVAX-USD (0.14), ADA-USD (0.11), DOT-USD (0.10), BCH-USD (0.07), ATOM-USD (0.05).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| AVAX-USD | -78.4% | -80.1% | below 200d |
| ADA-USD | -78.1% | -80.9% | below 200d |
| DOT-USD | -76.2% | -83.0% | below 200d |
| DOGE-USD | -70.7% | -75.2% | below 200d |
| ATOM-USD | -66.3% | -69.4% | below 200d |
| BCH-USD | -64.3% | -67.0% | below 200d |
| SOL-USD | -59.0% | -68.6% | above 200d |
| AAVE-USD | -58.5% | -71.4% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **7 of 38** assets — and 7 of those 7 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.9%** vs median buy-and-hold: **+58.6%**
- Median walk-forward degradation: **+104%** of the in-sample edge lost out-of-sample (over the 25 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.9%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.1%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 7/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | -5.7% | +122.1% | -1.6% | +261% | 20 |
| NEAR-USD | -2.2% | +179.9% | n/a | n/a | 4 |
| NVDA | +5.0% | +398.9% | -1.1% | +126% | 31 |
| BTC-USD | +10.5% | +180.5% | +5.4% | +51% | 27 |
| ETH-USD | +5.5% | +48.8% | +2.4% | +40% | 31 |
| SPY | -6.3% | +71.9% | +2.6% | +20% | 20 |
| QQQ | -11.2% | +93.4% | -1.3% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-18. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
