# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-11-11 · crypto through 2026-11-10 (completed UTC days), equities through 2026-11-10 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLV** | etf | 0.87 | +17.7% | +29.5% | 0.96 | +15% | -18% | +18.3% |
| 2 | **NEAR-USD** | crypto | 0.86 | +111.5% | +131.5% | 0.76 | +109% | -89% | +35.7% |
| 3 | **AAPL** | stock | 0.83 | +27.0% | +18.2% | 0.92 | +27% | -33% | +16.3% |
| 4 | **JPM** | stock | 0.83 | +6.4% | +12.2% | 1.34 | +23% | -25% | +5.5% |
| 5 | **UNI-USD** | crypto | 0.80 | -16.9% | +71.1% | 0.57 | +107% | -87% | +36.0% |
| 6 | **XLF** | etf | 0.79 | +4.3% | +13.0% | 1.21 | +16% | -16% | +8.2% |
| 7 | **SPY** | etf | 0.77 | +16.0% | +1.6% | 1.23 | +15% | -19% | +2.6% |
| 8 | **XOM** | stock | 0.76 | +46.9% | +9.2% | 0.76 | +23% | -21% | +5.5% |
| 9 | **MSFT** | stock | 0.75 | +8.9% | +30.8% | 0.60 | +27% | -35% | +21.0% |
| 10 | **XLE** | etf | 0.72 | +47.4% | +8.1% | 0.71 | +22% | -22% | +5.0% |

Bottom of the screen: BCH-USD (0.16), ADA-USD (0.12), DOGE-USD (0.12), ATOM-USD (0.08), DOT-USD (0.04).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -72.4% | -61.6% | below 200d |
| ADA-USD | -68.7% | -57.5% | below 200d |
| BCH-USD | -64.7% | -44.7% | below 200d |
| DOGE-USD | -60.5% | -52.3% | below 200d |
| XRP-USD | -55.9% | -44.2% | below 200d |
| ATOM-USD | -52.4% | -38.4% | below 200d |
| AVAX-USD | -50.8% | -39.8% | above 200d |
| LTC-USD | -50.1% | -38.0% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 9 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.9%** vs median buy-and-hold: **+49.7%**
- Median walk-forward degradation: **+85%** of the in-sample edge lost out-of-sample (over the 23 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.7%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.2%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLV | +10.7% | +48.7% | +0.6% | n/a | 20 |
| NEAR-USD | -2.2% | +110.3% | n/a | n/a | 4 |
| AAPL | -13.6% | +88.6% | +0.8% | +67% | 20 |
| BTC-USD | +7.8% | +98.7% | +5.2% | +35% | 24 |
| ETH-USD | +6.8% | +0.2% | +4.1% | +2% | 29 |
| SPY | -6.2% | +70.4% | -1.9% | +207% | 20 |
| QQQ | -5.7% | +78.9% | +0.5% | +46% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-11-11. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
