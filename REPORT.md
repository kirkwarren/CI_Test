# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-11-17 · crypto through 2026-11-16 (completed UTC days), equities through 2026-11-16 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLV** | etf | 0.89 | +15.7% | +28.9% | 0.92 | +15% | -18% | +17.2% |
| 2 | **AAPL** | stock | 0.86 | +25.8% | +18.4% | 0.91 | +27% | -33% | +16.9% |
| 3 | **NEAR-USD** | crypto | 0.85 | +112.0% | +109.6% | 0.71 | +109% | -89% | +17.0% |
| 4 | **JPM** | stock | 0.84 | +9.8% | +12.5% | 1.26 | +23% | -25% | +4.1% |
| 5 | **XLF** | etf | 0.84 | +4.8% | +12.4% | 1.13 | +16% | -16% | +7.8% |
| 6 | **XOM** | stock | 0.80 | +50.7% | +4.0% | 0.78 | +24% | -21% | +6.6% |
| 7 | **XLE** | etf | 0.78 | +50.8% | +5.1% | 0.73 | +22% | -22% | +7.0% |
| 8 | **SPY** | etf | 0.77 | +13.6% | +0.2% | 1.15 | +16% | -19% | +1.1% |
| 9 | **MSFT** | stock | 0.76 | +5.1% | +22.3% | 0.56 | +27% | -35% | +17.2% |
| 10 | **UNI-USD** | crypto | 0.68 | -0.5% | +48.8% | 0.51 | +107% | -87% | +4.0% |

Bottom of the screen: BCH-USD (0.17), ATOM-USD (0.11), DOGE-USD (0.09), ADA-USD (0.08), DOT-USD (0.02).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -73.4% | -60.0% | below 200d |
| BCH-USD | -68.1% | -43.1% | below 200d |
| ADA-USD | -67.8% | -54.7% | below 200d |
| DOGE-USD | -63.6% | -50.0% | below 200d |
| XRP-USD | -59.3% | -41.6% | below 200d |
| LTC-USD | -53.5% | -38.6% | below 200d |
| AVAX-USD | -52.7% | -35.6% | below 200d |
| ATOM-USD | -51.6% | -38.4% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 10 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.9%** vs median buy-and-hold: **+48.1%**
- Median walk-forward degradation: **+76%** of the in-sample edge lost out-of-sample (over the 22 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 31 assets: **+1.8%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.2%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLV | +10.4% | +46.5% | -1.4% | n/a | 20 |
| AAPL | -13.6% | +86.0% | +0.1% | +94% | 20 |
| NEAR-USD | -2.2% | +78.3% | n/a | n/a | 4 |
| BTC-USD | +11.2% | +77.1% | +5.1% | +29% | 24 |
| ETH-USD | +7.8% | -7.4% | +4.1% | -13% | 30 |
| SPY | -2.2% | +64.1% | -5.5% | +545% | 24 |
| QQQ | -5.6% | +71.4% | -1.6% | +188% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-11-17. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
