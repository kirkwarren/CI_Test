# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-08-15 · crypto through 2026-08-14 (completed UTC days), equities through 2026-08-14 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.015% over 720 overlapping days
- ETH-USD: median divergence 0.016% over 720 overlapping days
- SOL-USD: median divergence 0.016% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **XLK** | etf | 0.93 | +32.3% | +36.5% | 1.22 | +25% | -26% | +20.6% |
| 2 | **NVDA** | stock | 0.86 | +14.2% | +20.4% | 1.40 | +47% | -37% | +15.5% |
| 3 | **JPM** | stock | 0.86 | +18.1% | +19.9% | 1.39 | +23% | -25% | +15.2% |
| 4 | **QQQ** | etf | 0.82 | +21.6% | +21.7% | 1.23 | +21% | -23% | +12.4% |
| 5 | **GOOGL** | stock | 0.80 | +75.5% | +11.9% | 1.23 | +31% | -30% | +4.4% |
| 6 | **IWM** | etf | 0.80 | +27.8% | +17.6% | 0.87 | +21% | -28% | +13.6% |
| 7 | **XLE** | etf | 0.77 | +33.2% | +14.7% | 0.64 | +22% | -22% | +15.9% |
| 8 | **SPY** | etf | 0.77 | +16.4% | +14.0% | 1.30 | +15% | -19% | +10.0% |
| 9 | **AAPL** | stock | 0.74 | +42.8% | +16.9% | 0.81 | +27% | -33% | +9.1% |
| 10 | **AMZN** | stock | 0.74 | +11.3% | +31.6% | 0.83 | +32% | -31% | +10.5% |

Bottom of the screen: ATOM-USD (0.13), ADA-USD (0.12), AVAX-USD (0.11), BCH-USD (0.08), DOT-USD (0.02).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -83.1% | -78.8% | below 200d |
| AVAX-USD | -81.6% | -71.7% | below 200d |
| ADA-USD | -81.3% | -82.2% | below 200d |
| AAVE-USD | -75.9% | -69.4% | below 200d |
| DOGE-USD | -75.8% | -67.0% | below 200d |
| UNI-USD | -72.1% | -66.8% | below 200d |
| SOL-USD | -69.6% | -59.9% | below 200d |
| ATOM-USD | -69.1% | -65.7% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 8 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.1%** vs median buy-and-hold: **+47.5%**
- Median walk-forward degradation: **+120%** of the in-sample edge lost out-of-sample (over the 22 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.8%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.5%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | +0.6% | +126.4% | -3.2% | +447% | 20 |
| NVDA | +17.3% | +412.4% | +0.0% | +100% | 34 |
| JPM | +6.2% | +140.6% | -0.6% | +112% | 29 |
| BTC-USD | +17.8% | +119.4% | -2.4% | +138% | 37 |
| ETH-USD | +10.4% | +4.1% | +1.1% | +70% | 31 |
| SPY | +2.4% | +75.3% | -0.9% | +121% | 33 |
| QQQ | -5.8% | +99.5% | -4.2% | +581% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-08-15. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
