# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-25 · crypto through 2026-10-24 (completed UTC days), equities through 2026-10-23 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.91 | +101.8% | +219.1% | 0.94 | +109% | -89% | +86.2% |
| 2 | **AAPL** | stock | 0.84 | +30.0% | +28.3% | 1.02 | +27% | -33% | +18.1% |
| 3 | **UNI-USD** | crypto | 0.79 | +46.4% | +110.4% | 0.66 | +107% | -87% | +49.7% |
| 4 | **XOM** | stock | 0.77 | +41.3% | +23.0% | 0.87 | +23% | -21% | +19.6% |
| 5 | **XLK** | etf | 0.77 | +36.4% | +14.4% | 1.20 | +25% | -26% | +8.7% |
| 6 | **XLE** | etf | 0.76 | +42.6% | +21.9% | 0.82 | +22% | -22% | +19.2% |
| 7 | **NVDA** | stock | 0.75 | +24.6% | +1.3% | 1.40 | +47% | -37% | +3.6% |
| 8 | **QQQ** | etf | 0.74 | +22.4% | +6.1% | 1.25 | +20% | -23% | +4.0% |
| 9 | **SPY** | etf | 0.74 | +14.9% | +6.4% | 1.39 | +15% | -19% | +4.5% |
| 10 | **JPM** | stock | 0.71 | +15.1% | +7.6% | 1.36 | +23% | -25% | +2.8% |

Bottom of the screen: BCH-USD (0.14), ADA-USD (0.14), DOT-USD (0.14), DOGE-USD (0.12), ATOM-USD (0.08).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -69.5% | -62.3% | below 200d |
| DOT-USD | -67.9% | -62.5% | above 200d |
| DOGE-USD | -62.3% | -51.6% | below 200d |
| BCH-USD | -57.6% | -32.8% | below 200d |
| AVAX-USD | -56.9% | -47.7% | above 200d |
| XRP-USD | -50.9% | -38.9% | above 200d |
| ATOM-USD | -49.7% | -44.0% | below 200d |
| SOL-USD | -48.9% | -39.6% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **6 of 38** assets — and 6 of those 6 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+68.6%**
- Median walk-forward degradation: **+109%** of the in-sample edge lost out-of-sample (over the 24 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+1.8%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.7%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 6/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +277.0% | n/a | n/a | 4 |
| AAPL | -13.6% | +103.2% | -0.7% | n/a | 20 |
| UNI-USD | +3.8% | +66.5% | n/a | n/a | 4 |
| BTC-USD | +16.2% | +136.5% | +3.4% | +68% | 27 |
| ETH-USD | +11.1% | +30.6% | +4.1% | +43% | 30 |
| SPY | -6.2% | +82.0% | -1.2% | n/a | 20 |
| QQQ | -5.7% | +101.1% | -1.6% | +161% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-25. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
