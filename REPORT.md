# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-15 · crypto through 2026-10-14 (completed UTC days), equities through 2026-10-14 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.014% over 720 overlapping days
- ETH-USD: median divergence 0.014% over 720 overlapping days
- SOL-USD: median divergence 0.015% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **NEAR-USD** | crypto | 0.93 | +0.2% | +258.7% | 1.01 | +108% | -89% | +119.2% |
| 2 | **XLK** | etf | 0.80 | +28.9% | +26.7% | 1.20 | +25% | -26% | +14.0% |
| 3 | **UNI-USD** | crypto | 0.79 | -4.3% | +129.4% | 0.68 | +107% | -87% | +64.1% |
| 4 | **AAPL** | stock | 0.78 | +33.8% | +28.7% | 0.95 | +27% | -33% | +17.5% |
| 5 | **XOM** | stock | 0.72 | +50.9% | +18.8% | 0.81 | +23% | -21% | +17.1% |
| 6 | **NVDA** | stock | 0.71 | +12.7% | +11.3% | 1.36 | +47% | -37% | +9.2% |
| 7 | **QQQ** | etf | 0.71 | +17.0% | +14.4% | 1.22 | +20% | -23% | +8.2% |
| 8 | **XLE** | etf | 0.71 | +52.7% | +21.3% | 0.74 | +22% | -22% | +17.8% |
| 9 | **SPY** | etf | 0.69 | +14.2% | +10.0% | 1.32 | +15% | -19% | +6.3% |
| 10 | **MSFT** | stock | 0.68 | -3.3% | +29.8% | 0.73 | +26% | -35% | +22.7% |

Bottom of the screen: TSLA (0.22), ATOM-USD (0.15), DOGE-USD (0.14), TLT (0.14), BCH-USD (0.07).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -66.3% | -70.2% | above 200d |
| DOT-USD | -64.9% | -69.1% | above 200d |
| DOGE-USD | -60.3% | -59.1% | below 200d |
| BCH-USD | -59.0% | -58.5% | below 200d |
| AVAX-USD | -54.3% | -66.8% | above 200d |
| XRP-USD | -49.7% | -43.2% | above 200d |
| SOL-USD | -47.9% | -49.4% | above 200d |
| ATOM-USD | -47.2% | -54.4% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **5 of 38** assets — and 5 of those 5 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.0%** vs median buy-and-hold: **+63.7%**
- Median walk-forward degradation: **+110%** of the in-sample edge lost out-of-sample (over the 21 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+1.9%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.6%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 5/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +372.3% | n/a | n/a | 4 |
| XLK | -5.6% | +123.7% | -0.2% | n/a | 20 |
| UNI-USD | +3.8% | +74.5% | n/a | n/a | 4 |
| BTC-USD | +16.5% | +186.0% | +6.0% | +48% | 27 |
| ETH-USD | +11.1% | +51.2% | +2.3% | +62% | 30 |
| SPY | -6.2% | +76.5% | -0.3% | n/a | 20 |
| QQQ | -5.7% | +97.3% | -0.7% | +186% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-15. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
