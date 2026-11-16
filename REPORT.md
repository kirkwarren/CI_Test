# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-11-16 · crypto through 2026-11-15 (completed UTC days), equities through 2026-11-13 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLV** | etf | 0.87 | +15.9% | +30.2% | 0.93 | +15% | -18% | +17.9% |
| 2 | **AAPL** | stock | 0.86 | +25.1% | +18.7% | 0.92 | +27% | -33% | +18.3% |
| 3 | **NEAR-USD** | crypto | 0.85 | +110.4% | +114.9% | 0.70 | +109% | -89% | +19.6% |
| 4 | **JPM** | stock | 0.83 | +4.7% | +16.2% | 1.31 | +23% | -25% | +6.6% |
| 5 | **XLF** | etf | 0.81 | +3.0% | +14.8% | 1.16 | +16% | -16% | +8.8% |
| 6 | **XOM** | stock | 0.81 | +47.9% | +8.0% | 0.85 | +24% | -21% | +9.1% |
| 7 | **XLE** | etf | 0.80 | +47.5% | +9.3% | 0.79 | +22% | -22% | +9.2% |
| 8 | **SPY** | etf | 0.78 | +12.9% | +2.1% | 1.20 | +15% | -19% | +3.1% |
| 9 | **MSFT** | stock | 0.75 | +5.5% | +24.2% | 0.55 | +27% | -35% | +18.7% |
| 10 | **XLK** | etf | 0.69 | +28.7% | -3.4% | 0.93 | +26% | -26% | -0.3% |

Bottom of the screen: BCH-USD (0.16), ATOM-USD (0.09), DOGE-USD (0.09), ADA-USD (0.08), DOT-USD (0.02).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -73.6% | -58.3% | below 200d |
| ADA-USD | -67.9% | -55.2% | below 200d |
| BCH-USD | -67.8% | -44.9% | below 200d |
| DOGE-USD | -63.0% | -50.4% | below 200d |
| XRP-USD | -58.5% | -41.4% | below 200d |
| ATOM-USD | -52.5% | -38.0% | below 200d |
| LTC-USD | -52.4% | -41.3% | below 200d |
| AVAX-USD | -51.7% | -35.9% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **11 of 38** assets — and 11 of those 11 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.9%** vs median buy-and-hold: **+51.0%**
- Median walk-forward degradation: **+98%** of the in-sample edge lost out-of-sample (over the 21 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 32 assets: **+1.9%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.7%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 11/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLV | +10.7% | +47.0% | -2.1% | n/a | 20 |
| AAPL | -13.6% | +87.8% | -0.0% | +100% | 20 |
| NEAR-USD | -2.2% | +71.7% | n/a | n/a | 4 |
| BTC-USD | +11.1% | +78.3% | +5.6% | +20% | 24 |
| ETH-USD | +7.8% | -6.5% | +4.3% | -11% | 30 |
| SPY | -6.2% | +67.6% | -3.8% | +606% | 20 |
| QQQ | -5.7% | +76.2% | -2.0% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-11-16. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
