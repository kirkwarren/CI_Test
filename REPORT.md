# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-11-08 · crypto through 2026-11-07 (completed UTC days), equities through 2026-11-06 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.88 | +61.4% | +133.6% | 0.82 | +109% | -89% | +43.1% |
| 2 | **AAPL** | stock | 0.85 | +26.0% | +16.7% | 0.91 | +27% | -33% | +14.6% |
| 3 | **XLV** | etf | 0.84 | +15.4% | +28.8% | 0.89 | +15% | -18% | +15.9% |
| 4 | **UNI-USD** | crypto | 0.81 | +21.1% | +94.3% | 0.61 | +107% | -87% | +48.9% |
| 5 | **JPM** | stock | 0.80 | +6.3% | +10.7% | 1.32 | +23% | -25% | +3.3% |
| 6 | **XLF** | etf | 0.77 | +3.1% | +11.6% | 1.18 | +16% | -16% | +6.2% |
| 7 | **XOM** | stock | 0.77 | +48.2% | +14.7% | 0.80 | +23% | -21% | +6.6% |
| 8 | **MSFT** | stock | 0.73 | +3.0% | +27.8% | 0.61 | +27% | -35% | +20.6% |
| 9 | **SPY** | etf | 0.71 | +14.2% | -0.3% | 1.21 | +15% | -19% | +0.7% |
| 10 | **XLE** | etf | 0.70 | +49.3% | +10.6% | 0.72 | +22% | -22% | +4.2% |

Bottom of the screen: BCH-USD (0.16), DOGE-USD (0.13), ADA-USD (0.09), DOT-USD (0.05), ATOM-USD (0.04).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -72.5% | -66.6% | below 200d |
| ADA-USD | -69.4% | -59.7% | below 200d |
| BCH-USD | -61.9% | -47.0% | below 200d |
| DOGE-USD | -60.6% | -53.0% | below 200d |
| ATOM-USD | -55.8% | -42.3% | below 200d |
| AVAX-USD | -54.8% | -43.2% | above 200d |
| XRP-USD | -54.0% | -40.4% | below 200d |
| LTC-USD | -52.8% | -38.0% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 9 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+51.6%**
- Median walk-forward degradation: **+80%** of the in-sample edge lost out-of-sample (over the 24 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 32 assets: **+1.4%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.2%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +159.6% | n/a | n/a | 4 |
| AAPL | -13.6% | +87.2% | -0.0% | +102% | 20 |
| XLV | +9.4% | +44.2% | -0.6% | n/a | 20 |
| BTC-USD | +6.9% | +106.4% | +5.5% | +17% | 24 |
| ETH-USD | +4.6% | +5.4% | +3.7% | +15% | 29 |
| SPY | -6.2% | +68.2% | -1.9% | +210% | 20 |
| QQQ | -11.2% | +75.9% | +0.4% | +76% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-11-08. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
