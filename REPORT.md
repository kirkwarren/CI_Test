# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-29 · crypto through 2026-10-28 (completed UTC days), equities through 2026-10-28 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.014% over 720 overlapping days
- ETH-USD: median divergence 0.013% over 720 overlapping days
- SOL-USD: median divergence 0.014% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **NEAR-USD** | crypto | 0.89 | +115.9% | +251.6% | 0.92 | +109% | -89% | +90.9% |
| 2 | **XLK** | etf | 0.83 | +30.1% | +20.0% | 1.26 | +25% | -26% | +12.9% |
| 3 | **AAPL** | stock | 0.81 | +22.5% | +27.3% | 1.01 | +27% | -33% | +16.3% |
| 4 | **XOM** | stock | 0.81 | +39.2% | +17.7% | 0.90 | +23% | -21% | +18.2% |
| 5 | **UNI-USD** | crypto | 0.79 | +38.8% | +123.4% | 0.68 | +107% | -87% | +55.6% |
| 6 | **QQQ** | etf | 0.77 | +17.5% | +9.7% | 1.30 | +20% | -23% | +6.9% |
| 7 | **NVDA** | stock | 0.75 | +18.7% | +2.9% | 1.42 | +47% | -37% | +5.5% |
| 8 | **XLE** | etf | 0.75 | +39.4% | +16.0% | 0.85 | +22% | -22% | +17.0% |
| 9 | **SPY** | etf | 0.75 | +11.5% | +8.5% | 1.44 | +15% | -19% | +6.1% |
| 10 | **XLV** | etf | 0.74 | +16.6% | +25.8% | 0.91 | +15% | -18% | +13.5% |

Bottom of the screen: TLT (0.15), ADA-USD (0.14), DOGE-USD (0.13), DOT-USD (0.09), ATOM-USD (0.08).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -69.1% | -61.3% | below 200d |
| ADA-USD | -67.9% | -61.7% | below 200d |
| DOGE-USD | -58.6% | -51.5% | below 200d |
| BCH-USD | -55.9% | -44.4% | above 200d |
| AVAX-USD | -54.2% | -45.5% | above 200d |
| XRP-USD | -48.1% | -42.5% | above 200d |
| SOL-USD | -47.2% | -38.8% | above 200d |
| ATOM-USD | -47.2% | -44.0% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **6 of 38** assets — and 6 of those 6 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+72.0%**
- Median walk-forward degradation: **+91%** of the in-sample edge lost out-of-sample (over the 22 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.3%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.8%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 6/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +257.4% | n/a | n/a | 4 |
| XLK | -5.6% | +134.6% | -1.0% | n/a | 20 |
| AAPL | -13.6% | +101.9% | -0.6% | n/a | 20 |
| BTC-USD | +16.4% | +135.5% | +4.7% | +55% | 27 |
| ETH-USD | +10.6% | +30.2% | +3.3% | +49% | 30 |
| SPY | -6.2% | +85.8% | -2.2% | n/a | 20 |
| QQQ | -5.7% | +107.8% | -1.4% | +261% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-29. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
