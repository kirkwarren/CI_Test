# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-08-25 · crypto through 2026-08-24 (completed UTC days), equities through 2026-08-24 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.015% over 720 overlapping days
- ETH-USD: median divergence 0.016% over 720 overlapping days
- SOL-USD: median divergence 0.015% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **XLK** | etf | 0.82 | +35.9% | +30.0% | 1.14 | +25% | -26% | +13.6% |
| 2 | **JPM** | stock | 0.79 | +21.2% | +19.7% | 1.40 | +23% | -25% | +12.7% |
| 3 | **NEAR-USD** | crypto | 0.74 | -32.6% | +91.0% | 0.67 | +104% | -89% | +21.1% |
| 4 | **GOOGL** | stock | 0.72 | +60.1% | +11.7% | 1.24 | +31% | -30% | +4.4% |
| 5 | **XOM** | stock | 0.72 | +43.7% | +8.8% | 0.71 | +23% | -21% | +14.9% |
| 6 | **QQQ** | etf | 0.69 | +21.5% | +17.4% | 1.19 | +20% | -23% | +8.1% |
| 7 | **AAPL** | stock | 0.68 | +48.1% | +16.6% | 0.82 | +27% | -33% | +10.2% |
| 8 | **XLE** | etf | 0.68 | +38.0% | +14.4% | 0.67 | +22% | -22% | +16.9% |
| 9 | **IWM** | etf | 0.67 | +28.9% | +14.4% | 0.87 | +21% | -28% | +10.3% |
| 10 | **SPY** | etf | 0.66 | +16.3% | +11.9% | 1.28 | +15% | -19% | +7.8% |

Bottom of the screen: ADA-USD (0.14), AVAX-USD (0.13), BCH-USD (0.10), ATOM-USD (0.04), DOT-USD (0.04).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -80.2% | -80.2% | below 200d |
| AVAX-USD | -78.6% | -73.8% | below 200d |
| ADA-USD | -76.2% | -81.9% | below 200d |
| DOGE-USD | -68.9% | -69.1% | above 200d |
| ATOM-USD | -68.4% | -71.1% | below 200d |
| AAVE-USD | -60.6% | -73.6% | above 200d |
| SOL-USD | -60.0% | -63.9% | above 200d |
| LTC-USD | -59.0% | -60.6% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **8 of 38** assets — and 8 of those 8 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.7%** vs median buy-and-hold: **+61.1%**
- Median walk-forward degradation: **+116%** of the in-sample edge lost out-of-sample (over the 20 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.2%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.4%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 8/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | -5.8% | +113.4% | -3.2% | n/a | 20 |
| JPM | +7.7% | +142.4% | -0.5% | +109% | 29 |
| NEAR-USD | -2.2% | +64.0% | n/a | n/a | 4 |
| BTC-USD | +19.8% | +203.7% | -1.4% | +119% | 39 |
| ETH-USD | +13.7% | +50.8% | +0.3% | +86% | 30 |
| SPY | -3.4% | +73.5% | -1.4% | +141% | 29 |
| QQQ | -11.2% | +94.0% | -3.4% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-08-25. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
