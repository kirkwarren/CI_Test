# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-07-21 · crypto through 2026-07-20 (completed UTC days), equities through 2026-07-20 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.016% over 720 overlapping days
- ETH-USD: median divergence 0.016% over 720 overlapping days
- SOL-USD: median divergence 0.016% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **GOOGL** | stock | 0.94 | +98.2% | +5.8% | 1.35 | +30% | -30% | +9.2% |
| 2 | **XLK** | etf | 0.90 | +42.3% | +20.8% | 1.06 | +25% | -26% | +14.1% |
| 3 | **AAPL** | stock | 0.86 | +40.9% | +26.5% | 0.80 | +27% | -33% | +18.9% |
| 4 | **JPM** | stock | 0.83 | +15.0% | +9.6% | 1.26 | +23% | -25% | +9.4% |
| 5 | **QQQ** | etf | 0.82 | +28.6% | +11.9% | 1.12 | +20% | -23% | +8.5% |
| 6 | **NVDA** | stock | 0.77 | +18.3% | +8.7% | 1.32 | +47% | -37% | +5.6% |
| 7 | **SPY** | etf | 0.77 | +18.0% | +7.2% | 1.16 | +15% | -19% | +6.5% |
| 8 | **IWM** | etf | 0.75 | +29.5% | +10.1% | 0.75 | +21% | -28% | +10.9% |
| 9 | **XLE** | etf | 0.75 | +26.2% | +21.7% | 0.60 | +22% | -22% | +11.5% |
| 10 | **EEM** | etf | 0.74 | +39.4% | +9.4% | 0.88 | +20% | -19% | +6.2% |

Bottom of the screen: BCH-USD (0.12), ATOM-USD (0.11), AVAX-USD (0.10), ADA-USD (0.08), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -82.4% | -81.0% | below 200d |
| DOT-USD | -81.9% | -78.4% | below 200d |
| AVAX-USD | -81.3% | -75.1% | below 200d |
| DOGE-USD | -75.1% | -69.5% | below 200d |
| AAVE-USD | -74.9% | -76.6% | below 200d |
| ATOM-USD | -71.2% | -65.2% | below 200d |
| UNI-USD | -70.1% | -71.8% | below 200d |
| XRP-USD | -68.7% | -66.8% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 8 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **+0.1%** vs median buy-and-hold: **+38.1%**
- Median walk-forward degradation: **+115%** of the in-sample edge lost out-of-sample (over the 24 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.9%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.8%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| GOOGL | -4.6% | +193.3% | +0.6% | +85% | 20 |
| XLK | +0.6% | +99.5% | +0.4% | +91% | 20 |
| AAPL | -9.6% | +70.2% | +1.4% | n/a | 20 |
| BTC-USD | +21.4% | +118.9% | -2.9% | +161% | 38 |
| ETH-USD | +13.1% | +2.0% | +0.6% | +92% | 33 |
| SPY | -0.8% | +64.1% | -0.4% | +114% | 20 |
| QQQ | -5.8% | +85.3% | -3.5% | +590% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-07-21. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
