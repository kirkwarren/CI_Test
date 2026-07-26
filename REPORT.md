# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-07-26 · crypto through 2026-07-25 (completed UTC days), equities through 2026-07-24 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLK** | etf | 0.90 | +40.7% | +21.4% | 1.06 | +25% | -26% | +13.7% |
| 2 | **AAPL** | stock | 0.89 | +36.9% | +34.1% | 0.81 | +27% | -33% | +20.7% |
| 3 | **JPM** | stock | 0.87 | +12.4% | +16.3% | 1.29 | +23% | -25% | +13.7% |
| 4 | **NVDA** | stock | 0.83 | +16.5% | +11.9% | 1.32 | +47% | -37% | +7.2% |
| 5 | **GOOGL** | stock | 0.80 | +81.5% | -3.3% | 1.16 | +30% | -30% | -1.3% |
| 6 | **QQQ** | etf | 0.77 | +26.0% | +10.2% | 1.08 | +20% | -23% | +6.4% |
| 7 | **XLE** | etf | 0.77 | +23.4% | +21.9% | 0.61 | +22% | -22% | +14.1% |
| 8 | **XOM** | stock | 0.76 | +24.5% | +17.4% | 0.69 | +23% | -21% | +13.6% |
| 9 | **SPY** | etf | 0.75 | +15.6% | +7.2% | 1.13 | +15% | -19% | +5.8% |
| 10 | **IWM** | etf | 0.74 | +30.9% | +7.9% | 0.73 | +21% | -28% | +10.0% |

Bottom of the screen: AVAX-USD (0.12), BCH-USD (0.10), ATOM-USD (0.09), ADA-USD (0.08), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -82.9% | -82.4% | below 200d |
| DOT-USD | -82.1% | -79.4% | below 200d |
| AVAX-USD | -80.8% | -74.0% | below 200d |
| DOGE-USD | -75.2% | -68.4% | below 200d |
| AAVE-USD | -74.3% | -72.0% | below 200d |
| ATOM-USD | -71.7% | -65.8% | below 200d |
| SOL-USD | -69.9% | -63.8% | below 200d |
| UNI-USD | -69.8% | -72.4% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **11 of 38** assets — and 10 of those 11 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.2%** vs median buy-and-hold: **+34.1%**
- Median walk-forward degradation: **+123%** of the in-sample edge lost out-of-sample (over the 20 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 32 assets: **+3.8%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.8%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 11/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | +0.5% | +99.8% | -1.8% | +225% | 20 |
| AAPL | -14.8% | +71.2% | +1.3% | n/a | 20 |
| JPM | +13.9% | +123.9% | -2.7% | +220% | 28 |
| BTC-USD | +21.8% | +120.1% | -0.7% | +111% | 38 |
| ETH-USD | +13.1% | +0.7% | +2.4% | +73% | 33 |
| SPY | -4.6% | +62.2% | -1.7% | +157% | 29 |
| QQQ | -5.8% | +81.2% | -4.2% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-07-26. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
