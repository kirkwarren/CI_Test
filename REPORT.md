# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-22 · crypto through 2026-10-21 (completed UTC days), equities through 2026-10-21 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.93 | +92.5% | +279.5% | 1.01 | +109% | -89% | +122.8% |
| 2 | **AAPL** | stock | 0.79 | +29.6% | +25.9% | 0.99 | +27% | -33% | +17.2% |
| 3 | **UNI-USD** | crypto | 0.78 | +43.8% | +127.4% | 0.67 | +107% | -87% | +64.7% |
| 4 | **XLK** | etf | 0.77 | +36.2% | +19.3% | 1.23 | +25% | -26% | +12.1% |
| 5 | **NVDA** | stock | 0.76 | +25.3% | +9.6% | 1.41 | +47% | -37% | +9.1% |
| 6 | **XLE** | etf | 0.72 | +42.2% | +20.6% | 0.77 | +22% | -22% | +17.6% |
| 7 | **XOM** | stock | 0.71 | +40.8% | +19.1% | 0.82 | +23% | -21% | +16.7% |
| 8 | **AAVE-USD** | crypto | 0.70 | -33.4% | +68.5% | 0.68 | +93% | -84% | +46.1% |
| 9 | **QQQ** | etf | 0.70 | +22.2% | +10.7% | 1.27 | +20% | -23% | +7.2% |
| 10 | **SPY** | etf | 0.68 | +15.2% | +8.7% | 1.42 | +15% | -19% | +6.4% |

Bottom of the screen: ADA-USD (0.18), ATOM-USD (0.14), DOGE-USD (0.13), TLT (0.13), BCH-USD (0.10).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -67.0% | -61.9% | above 200d |
| DOT-USD | -64.9% | -59.9% | above 200d |
| DOGE-USD | -60.2% | -48.6% | below 200d |
| BCH-USD | -56.2% | -44.5% | below 200d |
| AVAX-USD | -53.7% | -42.6% | above 200d |
| XRP-USD | -48.4% | -36.6% | above 200d |
| SOL-USD | -46.6% | -36.0% | above 200d |
| ATOM-USD | -46.2% | -43.2% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **6 of 38** assets — and 6 of those 6 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+68.8%**
- Median walk-forward degradation: **+118%** of the in-sample edge lost out-of-sample (over the 23 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.9%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.8%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 6/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +378.1% | n/a | n/a | 4 |
| AAPL | -13.6% | +98.8% | -0.4% | n/a | 20 |
| UNI-USD | +3.8% | +70.1% | n/a | n/a | 4 |
| BTC-USD | +17.7% | +153.9% | +3.7% | +61% | 27 |
| ETH-USD | +11.1% | +39.9% | +3.6% | +48% | 30 |
| SPY | -6.2% | +83.9% | -3.5% | n/a | 20 |
| QQQ | -5.7% | +103.9% | -1.7% | +196% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-22. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
