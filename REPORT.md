# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-11-20 · crypto through 2026-11-19 (completed UTC days), equities through 2026-11-19 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **AAPL** | stock | 0.91 | +28.6% | +14.5% | 0.88 | +27% | -33% | +15.3% |
| 2 | **NEAR-USD** | crypto | 0.89 | +107.6% | +88.3% | 0.71 | +108% | -89% | +17.5% |
| 3 | **XLV** | etf | 0.85 | +17.3% | +19.8% | 0.78 | +15% | -18% | +10.4% |
| 4 | **XLF** | etf | 0.85 | +9.1% | +7.4% | 1.03 | +16% | -16% | +2.9% |
| 5 | **JPM** | stock | 0.84 | +12.0% | +5.7% | 1.17 | +23% | -25% | -1.5% |
| 6 | **XOM** | stock | 0.78 | +49.6% | +2.3% | 0.71 | +24% | -21% | +1.4% |
| 7 | **AMZN** | stock | 0.77 | +17.9% | -4.1% | 0.75 | +32% | -31% | +5.0% |
| 8 | **SPY** | etf | 0.77 | +17.1% | -3.6% | 1.06 | +16% | -19% | -2.3% |
| 9 | **XLE** | etf | 0.77 | +49.7% | +3.0% | 0.66 | +22% | -22% | +2.0% |
| 10 | **MSFT** | stock | 0.70 | +7.9% | +18.9% | 0.48 | +27% | -35% | +12.4% |

Bottom of the screen: BCH-USD (0.19), ADA-USD (0.10), DOGE-USD (0.09), ATOM-USD (0.08), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -71.9% | -57.2% | below 200d |
| BCH-USD | -68.5% | -41.7% | below 200d |
| ADA-USD | -67.7% | -51.8% | below 200d |
| DOGE-USD | -62.4% | -47.0% | below 200d |
| XRP-USD | -59.1% | -36.7% | below 200d |
| ATOM-USD | -53.9% | -36.0% | below 200d |
| AVAX-USD | -53.5% | -31.7% | below 200d |
| UNI-USD | -51.8% | +2.9% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 10 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.6%** vs median buy-and-hold: **+41.9%**
- Median walk-forward degradation: **+80%** of the in-sample edge lost out-of-sample (over the 23 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 31 assets: **+2.3%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **+0.0%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| AAPL | -13.6% | +82.4% | +0.4% | +80% | 20 |
| NEAR-USD | -2.2% | +82.9% | n/a | n/a | 4 |
| XLV | +7.2% | +37.5% | -0.4% | n/a | 20 |
| BTC-USD | +1.6% | +73.2% | +5.3% | +22% | 21 |
| ETH-USD | +0.7% | -9.2% | +2.7% | n/a | 29 |
| SPY | -2.2% | +57.6% | -0.7% | +137% | 24 |
| QQQ | -5.6% | +65.1% | +0.3% | +80% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-11-20. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
