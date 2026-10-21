# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-21 · crypto through 2026-10-20 (completed UTC days), equities through 2026-10-20 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.93 | +84.6% | +261.5% | 1.00 | +109% | -89% | +110.5% |
| 2 | **UNI-USD** | crypto | 0.79 | +37.8% | +129.5% | 0.68 | +107% | -87% | +65.1% |
| 3 | **AAPL** | stock | 0.77 | +34.4% | +27.6% | 0.98 | +27% | -33% | +15.8% |
| 4 | **XLK** | etf | 0.77 | +36.7% | +19.9% | 1.21 | +25% | -26% | +10.4% |
| 5 | **NVDA** | stock | 0.75 | +24.1% | +8.3% | 1.40 | +47% | -37% | +6.5% |
| 6 | **QQQ** | etf | 0.72 | +22.8% | +11.4% | 1.25 | +20% | -23% | +6.2% |
| 7 | **XLE** | etf | 0.71 | +45.3% | +21.7% | 0.77 | +22% | -22% | +17.5% |
| 8 | **XOM** | stock | 0.71 | +41.0% | +19.9% | 0.82 | +23% | -21% | +16.8% |
| 9 | **AAVE-USD** | crypto | 0.68 | -39.9% | +70.3% | 0.70 | +94% | -84% | +46.1% |
| 10 | **SPY** | etf | 0.68 | +16.4% | +9.2% | 1.41 | +15% | -19% | +5.9% |

Bottom of the screen: ADA-USD (0.19), ATOM-USD (0.14), TLT (0.14), DOGE-USD (0.13), BCH-USD (0.10).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -67.2% | -65.6% | above 200d |
| DOT-USD | -64.8% | -63.2% | above 200d |
| DOGE-USD | -60.3% | -56.4% | below 200d |
| BCH-USD | -56.7% | -47.2% | below 200d |
| AVAX-USD | -53.2% | -44.4% | above 200d |
| XRP-USD | -49.6% | -43.5% | above 200d |
| SOL-USD | -46.8% | -41.4% | above 200d |
| ATOM-USD | -46.3% | -46.0% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **6 of 38** assets — and 6 of those 6 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+69.7%**
- Median walk-forward degradation: **+115%** of the in-sample edge lost out-of-sample (over the 23 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.9%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.6%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 6/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +365.7% | n/a | n/a | 4 |
| UNI-USD | +3.8% | +76.2% | n/a | n/a | 4 |
| AAPL | -13.6% | +96.2% | -0.4% | n/a | 20 |
| BTC-USD | +17.2% | +176.4% | +5.2% | +57% | 27 |
| ETH-USD | +11.1% | +47.0% | +3.0% | +54% | 30 |
| SPY | -6.2% | +82.9% | -3.5% | n/a | 20 |
| QQQ | -5.7% | +101.8% | -1.7% | +196% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-21. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
