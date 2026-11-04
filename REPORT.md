# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-11-04 · crypto through 2026-11-03 (completed UTC days), equities through 2026-11-03 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.86 | +157.2% | +203.2% | 0.79 | +109% | -89% | +49.6% |
| 2 | **XLV** | etf | 0.83 | +16.0% | +26.6% | 0.88 | +15% | -18% | +15.8% |
| 3 | **XOM** | stock | 0.82 | +43.4% | +14.6% | 0.86 | +23% | -21% | +14.4% |
| 4 | **AAPL** | stock | 0.80 | +23.1% | +16.8% | 0.91 | +27% | -33% | +11.6% |
| 5 | **UNI-USD** | crypto | 0.80 | +74.6% | +120.7% | 0.63 | +107% | -87% | +51.5% |
| 6 | **XLE** | etf | 0.75 | +44.0% | +12.2% | 0.79 | +22% | -22% | +13.2% |
| 7 | **XLK** | etf | 0.75 | +33.7% | +6.6% | 1.07 | +26% | -26% | +3.9% |
| 8 | **JPM** | stock | 0.74 | +6.8% | +9.2% | 1.36 | +23% | -25% | +4.6% |
| 9 | **NVDA** | stock | 0.73 | +18.0% | +5.2% | 1.32 | +47% | -37% | +1.0% |
| 10 | **XLF** | etf | 0.73 | +2.9% | +10.9% | 1.19 | +16% | -16% | +6.4% |

Bottom of the screen: TLT (0.18), DOGE-USD (0.14), ADA-USD (0.10), DOT-USD (0.06), ATOM-USD (0.05).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -71.3% | -53.5% | below 200d |
| ADA-USD | -68.0% | -53.0% | below 200d |
| DOGE-USD | -58.7% | -42.7% | below 200d |
| BCH-USD | -58.1% | -37.0% | below 200d |
| ATOM-USD | -54.8% | -30.3% | below 200d |
| AVAX-USD | -53.2% | -33.3% | above 200d |
| LTC-USD | -50.8% | -19.1% | above 200d |
| XRP-USD | -49.5% | -34.2% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **8 of 38** assets — and 7 of those 8 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.0%** vs median buy-and-hold: **+56.6%**
- Median walk-forward degradation: **+85%** of the in-sample edge lost out-of-sample (over the 25 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+1.9%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **+0.2%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 8/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +133.8% | n/a | n/a | 4 |
| XLV | -2.5% | +43.5% | -1.4% | n/a | 20 |
| XOM | -23.3% | +67.6% | +5.8% | -85% | 20 |
| BTC-USD | +7.6% | +120.7% | +6.2% | +34% | 24 |
| ETH-USD | +11.7% | +20.0% | +4.0% | +33% | 30 |
| SPY | -6.2% | +73.1% | -1.2% | +159% | 20 |
| QQQ | -5.7% | +85.6% | +1.5% | +26% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-11-04. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
