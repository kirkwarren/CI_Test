# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-11-06 · crypto through 2026-11-05 (completed UTC days), equities through 2026-11-05 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.90 | +159.7% | +145.8% | 0.82 | +109% | -89% | +41.6% |
| 2 | **AAPL** | stock | 0.86 | +24.7% | +19.7% | 0.94 | +27% | -33% | +15.4% |
| 3 | **XLV** | etf | 0.83 | +16.3% | +27.8% | 0.88 | +15% | -18% | +16.1% |
| 4 | **JPM** | stock | 0.80 | +6.6% | +10.1% | 1.34 | +23% | -25% | +4.2% |
| 5 | **UNI-USD** | crypto | 0.79 | +60.1% | +95.9% | 0.61 | +107% | -87% | +41.5% |
| 6 | **XLF** | etf | 0.79 | +2.5% | +11.5% | 1.19 | +16% | -16% | +6.9% |
| 7 | **XOM** | stock | 0.75 | +43.7% | +12.8% | 0.75 | +24% | -21% | +6.3% |
| 8 | **MSFT** | stock | 0.74 | +3.0% | +27.4% | 0.65 | +27% | -35% | +22.0% |
| 9 | **SPY** | etf | 0.73 | +15.1% | +0.2% | 1.21 | +15% | -19% | +0.4% |
| 10 | **AAVE-USD** | crypto | 0.69 | -11.1% | +36.6% | 0.56 | +93% | -84% | +18.7% |

Bottom of the screen: XLM-USD (0.22), DOGE-USD (0.11), ADA-USD (0.09), DOT-USD (0.05), ATOM-USD (0.04).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -72.2% | -55.0% | below 200d |
| ADA-USD | -69.5% | -51.0% | below 200d |
| DOGE-USD | -60.9% | -44.0% | below 200d |
| BCH-USD | -58.4% | -36.3% | below 200d |
| ATOM-USD | -56.5% | -33.2% | below 200d |
| AVAX-USD | -55.1% | -30.1% | above 200d |
| LTC-USD | -53.3% | -22.8% | below 200d |
| XRP-USD | -52.3% | -36.1% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **8 of 38** assets — and 8 of those 8 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.0%** vs median buy-and-hold: **+50.0%**
- Median walk-forward degradation: **+84%** of the in-sample edge lost out-of-sample (over the 25 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+1.9%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **+0.2%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 8/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +152.5% | n/a | n/a | 4 |
| AAPL | -13.6% | +92.0% | -0.7% | +196% | 20 |
| XLV | -2.5% | +44.2% | -1.4% | n/a | 20 |
| BTC-USD | +7.0% | +114.5% | +4.5% | +42% | 24 |
| ETH-USD | +4.6% | +18.5% | +4.4% | -2% | 29 |
| SPY | -6.2% | +68.2% | -1.2% | +159% | 20 |
| QQQ | -5.7% | +75.3% | +1.5% | +26% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-11-06. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
