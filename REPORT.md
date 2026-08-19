# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-08-19 · crypto through 2026-08-18 (completed UTC days), equities through 2026-08-18 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLK** | etf | 0.91 | +32.3% | +33.1% | 1.19 | +25% | -26% | +17.6% |
| 2 | **JPM** | stock | 0.89 | +16.7% | +18.3% | 1.41 | +23% | -25% | +15.2% |
| 3 | **NVDA** | stock | 0.84 | +12.7% | +18.8% | 1.34 | +47% | -37% | +12.6% |
| 4 | **QQQ** | etf | 0.80 | +20.6% | +19.3% | 1.21 | +21% | -23% | +10.1% |
| 5 | **GOOGL** | stock | 0.80 | +72.6% | +14.0% | 1.24 | +31% | -30% | +3.6% |
| 6 | **XLE** | etf | 0.79 | +35.4% | +18.5% | 0.67 | +22% | -22% | +18.8% |
| 7 | **XOM** | stock | 0.79 | +39.3% | +13.2% | 0.72 | +23% | -21% | +16.8% |
| 8 | **IWM** | etf | 0.78 | +28.7% | +14.1% | 0.88 | +21% | -28% | +11.6% |
| 9 | **AAPL** | stock | 0.77 | +41.0% | +17.5% | 0.84 | +27% | -33% | +10.4% |
| 10 | **SPY** | etf | 0.74 | +15.3% | +12.4% | 1.29 | +15% | -19% | +8.7% |

Bottom of the screen: ADA-USD (0.10), AVAX-USD (0.10), ATOM-USD (0.08), BCH-USD (0.08), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -83.4% | -79.1% | below 200d |
| AVAX-USD | -82.0% | -72.8% | below 200d |
| ADA-USD | -81.3% | -82.1% | below 200d |
| DOGE-USD | -75.7% | -67.5% | below 200d |
| AAVE-USD | -75.5% | -69.0% | below 200d |
| UNI-USD | -71.2% | -66.5% | below 200d |
| ATOM-USD | -71.1% | -67.0% | below 200d |
| SOL-USD | -68.9% | -58.3% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **9 of 38** assets — and 8 of those 9 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.2%** vs median buy-and-hold: **+52.7%**
- Median walk-forward degradation: **+147%** of the in-sample edge lost out-of-sample (over the 24 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.6%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.6%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 9/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | -5.8% | +120.8% | -1.7% | n/a | 20 |
| JPM | +6.2% | +143.0% | +0.3% | +92% | 29 |
| NVDA | +12.1% | +367.9% | -0.7% | +108% | 33 |
| BTC-USD | +19.4% | +147.0% | +0.2% | +97% | 36 |
| ETH-USD | +11.1% | +13.7% | -0.9% | +120% | 31 |
| SPY | -6.5% | +74.7% | -2.4% | +175% | 20 |
| QQQ | -11.2% | +97.2% | -3.9% | +390% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-08-19. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
