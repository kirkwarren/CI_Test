# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-11-10 · crypto through 2026-11-09 (completed UTC days), equities through 2026-11-09 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.86 | +71.8% | +131.8% | 0.78 | +109% | -89% | +38.0% |
| 2 | **XLV** | etf | 0.86 | +17.0% | +31.7% | 0.96 | +15% | -18% | +18.0% |
| 3 | **AAPL** | stock | 0.82 | +24.8% | +19.8% | 0.92 | +27% | -33% | +17.2% |
| 4 | **UNI-USD** | crypto | 0.81 | +15.3% | +74.8% | 0.59 | +107% | -87% | +42.9% |
| 5 | **JPM** | stock | 0.80 | +6.2% | +14.0% | 1.34 | +23% | -25% | +5.6% |
| 6 | **XLF** | etf | 0.77 | +4.4% | +13.3% | 1.19 | +16% | -16% | +7.7% |
| 7 | **MSFT** | stock | 0.76 | +7.6% | +32.1% | 0.62 | +27% | -35% | +23.8% |
| 8 | **SPY** | etf | 0.76 | +16.2% | +1.8% | 1.24 | +15% | -19% | +3.0% |
| 9 | **XOM** | stock | 0.75 | +47.5% | +10.1% | 0.78 | +24% | -21% | +5.8% |
| 10 | **XLE** | etf | 0.69 | +47.5% | +8.3% | 0.71 | +22% | -22% | +4.6% |

Bottom of the screen: BCH-USD (0.16), DOGE-USD (0.13), ADA-USD (0.09), ATOM-USD (0.05), DOT-USD (0.04).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -73.8% | -61.1% | below 200d |
| ADA-USD | -70.1% | -57.0% | below 200d |
| BCH-USD | -63.5% | -44.4% | below 200d |
| DOGE-USD | -61.5% | -52.2% | below 200d |
| XRP-USD | -56.5% | -40.8% | below 200d |
| ATOM-USD | -56.0% | -34.4% | below 200d |
| AVAX-USD | -52.5% | -41.7% | above 200d |
| XLM-USD | -50.9% | -31.3% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 8 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.9%** vs median buy-and-hold: **+52.8%**
- Median walk-forward degradation: **+83%** of the in-sample edge lost out-of-sample (over the 22 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 32 assets: **+1.9%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **+0.1%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +127.2% | n/a | n/a | 4 |
| XLV | +10.5% | +49.1% | +0.2% | n/a | 20 |
| AAPL | -13.6% | +88.1% | -0.5% | +132% | 20 |
| BTC-USD | +7.1% | +102.6% | +4.9% | +34% | 24 |
| ETH-USD | +5.8% | +3.8% | +4.2% | +4% | 29 |
| SPY | -6.2% | +70.8% | -3.3% | +247% | 20 |
| QQQ | -5.7% | +79.5% | +0.4% | +74% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-11-10. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
