# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-07-20 · crypto through 2026-07-19 (completed UTC days), equities through 2026-07-17 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **GOOGL** | stock | 0.92 | +104.0% | +3.3% | 1.35 | +30% | -30% | +7.8% |
| 2 | **XLK** | etf | 0.89 | +44.1% | +21.3% | 1.06 | +25% | -26% | +14.2% |
| 3 | **AAPL** | stock | 0.87 | +42.4% | +28.4% | 0.82 | +27% | -33% | +21.7% |
| 4 | **QQQ** | etf | 0.83 | +31.0% | +12.2% | 1.11 | +20% | -23% | +8.5% |
| 5 | **JPM** | stock | 0.83 | +15.9% | +10.8% | 1.26 | +23% | -25% | +10.1% |
| 6 | **IWM** | etf | 0.77 | +32.2% | +11.7% | 0.76 | +21% | -28% | +11.6% |
| 7 | **NVDA** | stock | 0.77 | +21.0% | +10.7% | 1.30 | +47% | -37% | +5.4% |
| 8 | **SPY** | etf | 0.77 | +20.2% | +7.7% | 1.16 | +15% | -19% | +6.7% |
| 9 | **XLE** | etf | 0.75 | +28.5% | +20.0% | 0.61 | +22% | -22% | +11.2% |
| 10 | **EEM** | etf | 0.75 | +40.3% | +9.6% | 0.87 | +20% | -19% | +5.8% |

Bottom of the screen: BCH-USD (0.13), ATOM-USD (0.12), AVAX-USD (0.09), ADA-USD (0.08), DOT-USD (0.02).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -82.8% | -80.5% | below 200d |
| DOT-USD | -82.0% | -78.2% | below 200d |
| AVAX-USD | -81.7% | -76.0% | below 200d |
| DOGE-USD | -75.0% | -65.4% | below 200d |
| AAVE-USD | -75.0% | -77.0% | below 200d |
| ATOM-USD | -71.6% | -63.9% | below 200d |
| UNI-USD | -71.0% | -69.7% | below 200d |
| SOL-USD | -69.2% | -60.6% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 10 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **+0.4%** vs median buy-and-hold: **+39.0%**
- Median walk-forward degradation: **+107%** of the in-sample edge lost out-of-sample (over the 22 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.6%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.5%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| GOOGL | -3.0% | +190.9% | +0.0% | +99% | 20 |
| XLK | +0.6% | +99.3% | +1.0% | +78% | 20 |
| AAPL | -9.6% | +72.8% | +0.1% | n/a | 20 |
| BTC-USD | +21.6% | +116.3% | -2.6% | +154% | 38 |
| ETH-USD | +13.1% | -1.1% | +1.3% | +81% | 33 |
| SPY | -2.3% | +64.4% | -0.3% | +111% | 35 |
| QQQ | -0.3% | +84.6% | -2.7% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-07-20. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
