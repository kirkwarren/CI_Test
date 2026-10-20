# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-20 · crypto through 2026-10-19 (completed UTC days), equities through 2026-10-19 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.014% over 720 overlapping days
- ETH-USD: median divergence 0.014% over 720 overlapping days
- SOL-USD: median divergence 0.014% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **NEAR-USD** | crypto | 0.93 | +58.6% | +269.7% | 1.01 | +109% | -89% | +111.0% |
| 2 | **AAPL** | stock | 0.79 | +35.8% | +25.6% | 0.99 | +27% | -33% | +17.1% |
| 3 | **UNI-USD** | crypto | 0.78 | +38.5% | +126.1% | 0.68 | +107% | -87% | +63.2% |
| 4 | **XLK** | etf | 0.77 | +33.3% | +20.3% | 1.22 | +25% | -26% | +10.9% |
| 5 | **NVDA** | stock | 0.74 | +22.3% | +7.4% | 1.43 | +47% | -37% | +6.9% |
| 6 | **XOM** | stock | 0.73 | +47.8% | +20.7% | 0.80 | +23% | -21% | +17.3% |
| 7 | **XLE** | etf | 0.72 | +50.8% | +23.1% | 0.74 | +22% | -22% | +17.4% |
| 8 | **QQQ** | etf | 0.71 | +20.2% | +11.1% | 1.26 | +20% | -23% | +6.4% |
| 9 | **AAVE-USD** | crypto | 0.69 | -36.6% | +65.3% | 0.73 | +94% | -84% | +41.7% |
| 10 | **MSFT** | stock | 0.68 | -3.5% | +27.6% | 0.76 | +26% | -35% | +22.5% |

Bottom of the screen: ADA-USD (0.18), ATOM-USD (0.15), TLT (0.14), DOGE-USD (0.13), BCH-USD (0.10).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -68.0% | -65.1% | above 200d |
| DOT-USD | -64.7% | -62.6% | above 200d |
| DOGE-USD | -61.3% | -55.1% | below 200d |
| BCH-USD | -57.1% | -46.1% | below 200d |
| AVAX-USD | -53.9% | -51.0% | above 200d |
| XRP-USD | -50.8% | -41.0% | above 200d |
| SOL-USD | -47.5% | -40.9% | above 200d |
| ATOM-USD | -46.7% | -45.9% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **5 of 38** assets — and 5 of those 5 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.0%** vs median buy-and-hold: **+67.2%**
- Median walk-forward degradation: **+106%** of the in-sample edge lost out-of-sample (over the 25 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.1%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.6%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 5/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +371.4% | n/a | n/a | 4 |
| AAPL | -13.6% | +98.4% | -1.1% | n/a | 20 |
| UNI-USD | +3.8% | +76.5% | n/a | n/a | 4 |
| BTC-USD | +16.7% | +173.5% | +6.2% | +47% | 27 |
| ETH-USD | +11.1% | +47.6% | +3.1% | +49% | 30 |
| SPY | -6.2% | +82.0% | -3.6% | n/a | 20 |
| QQQ | -5.7% | +102.6% | -1.4% | +288% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-20. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
