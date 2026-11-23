# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-11-23 · crypto through 2026-11-22 (completed UTC days), equities through 2026-11-20 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.013% over 720 overlapping days
- ETH-USD: median divergence 0.013% over 720 overlapping days
- SOL-USD: median divergence 0.014% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **AAPL** | stock | 0.92 | +29.7% | +10.9% | 0.87 | +27% | -33% | +13.0% |
| 2 | **XLV** | etf | 0.87 | +19.0% | +18.2% | 0.74 | +15% | -18% | +10.2% |
| 3 | **NEAR-USD** | crypto | 0.87 | +154.6% | +21.6% | 0.68 | +108% | -89% | +8.3% |
| 4 | **XLF** | etf | 0.86 | +9.9% | +5.1% | 0.97 | +16% | -16% | +1.0% |
| 5 | **XOM** | stock | 0.85 | +51.9% | +3.3% | 0.72 | +24% | -21% | +2.0% |
| 6 | **JPM** | stock | 0.82 | +11.0% | +1.4% | 1.12 | +24% | -25% | -4.5% |
| 7 | **XLE** | etf | 0.79 | +50.4% | +1.7% | 0.65 | +22% | -22% | +1.3% |
| 8 | **SPY** | etf | 0.77 | +15.3% | -7.5% | 0.97 | +16% | -19% | -5.9% |
| 9 | **AMZN** | stock | 0.73 | +12.4% | -7.3% | 0.70 | +32% | -31% | +0.7% |
| 10 | **MSFT** | stock | 0.70 | +7.0% | +15.8% | 0.45 | +27% | -35% | +9.2% |

Bottom of the screen: BCH-USD (0.17), ADA-USD (0.13), DOGE-USD (0.11), ATOM-USD (0.07), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -72.0% | -53.1% | below 200d |
| BCH-USD | -69.5% | -49.4% | below 200d |
| ADA-USD | -69.3% | -48.0% | below 200d |
| DOGE-USD | -64.3% | -44.0% | below 200d |
| XRP-USD | -60.5% | -33.7% | below 200d |
| AVAX-USD | -55.6% | -31.6% | below 200d |
| ATOM-USD | -55.5% | -32.3% | below 200d |
| UNI-USD | -54.2% | +13.1% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **12 of 38** assets — and 12 of those 12 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+35.7%**
- Median walk-forward degradation: **+81%** of the in-sample edge lost out-of-sample (over the 25 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 31 assets: **+1.9%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **+0.4%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 12/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| AAPL | -13.6% | +80.3% | -0.5% | +133% | 20 |
| XLV | +7.1% | +35.2% | -1.8% | n/a | 20 |
| NEAR-USD | -2.2% | +62.3% | n/a | n/a | 4 |
| BTC-USD | +1.6% | +62.0% | +4.6% | +21% | 21 |
| ETH-USD | +0.7% | -17.3% | +3.5% | -463% | 29 |
| SPY | -2.2% | +51.5% | -3.0% | +222% | 24 |
| QQQ | -5.6% | +56.2% | +1.6% | +38% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-11-23. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
