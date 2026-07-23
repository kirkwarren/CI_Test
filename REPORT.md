# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-07-23 · crypto through 2026-07-22 (completed UTC days), equities through 2026-07-22 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLK** | etf | 0.91 | +47.1% | +27.1% | 1.09 | +25% | -26% | +16.8% |
| 2 | **GOOGL** | stock | 0.86 | +83.9% | +6.2% | 1.31 | +30% | -30% | +5.8% |
| 3 | **AAPL** | stock | 0.85 | +39.8% | +32.1% | 0.79 | +27% | -33% | +18.4% |
| 4 | **NVDA** | stock | 0.85 | +21.7% | +19.1% | 1.35 | +47% | -37% | +10.0% |
| 5 | **JPM** | stock | 0.84 | +13.9% | +15.0% | 1.27 | +23% | -25% | +12.2% |
| 6 | **QQQ** | etf | 0.82 | +30.8% | +16.0% | 1.14 | +20% | -23% | +9.8% |
| 7 | **EEM** | etf | 0.78 | +44.1% | +13.4% | 0.89 | +20% | -19% | +8.4% |
| 8 | **SPY** | etf | 0.77 | +18.4% | +10.3% | 1.17 | +15% | -19% | +7.1% |
| 9 | **IWM** | etf | 0.74 | +34.7% | +11.9% | 0.75 | +21% | -28% | +11.2% |
| 10 | **XLE** | etf | 0.74 | +27.1% | +24.4% | 0.61 | +22% | -22% | +13.6% |

Bottom of the screen: ATOM-USD (0.12), BCH-USD (0.12), AVAX-USD (0.10), ADA-USD (0.08), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -81.9% | -82.5% | below 200d |
| DOT-USD | -81.6% | -79.5% | below 200d |
| AVAX-USD | -81.2% | -75.9% | below 200d |
| DOGE-USD | -74.8% | -69.6% | below 200d |
| AAVE-USD | -72.8% | -75.9% | below 200d |
| ATOM-USD | -70.0% | -64.9% | below 200d |
| UNI-USD | -68.8% | -72.4% | above 200d |
| SOL-USD | -68.5% | -65.1% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 9 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **+0.4%** vs median buy-and-hold: **+38.8%**
- Median walk-forward degradation: **+114%** of the in-sample edge lost out-of-sample (over the 22 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.5%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.7%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | +0.5% | +104.3% | -0.5% | +110% | 20 |
| GOOGL | -4.6% | +181.5% | +0.9% | +79% | 20 |
| AAPL | -9.6% | +69.1% | -0.7% | n/a | 20 |
| BTC-USD | +20.9% | +126.5% | -1.2% | +120% | 38 |
| ETH-USD | +13.1% | +4.5% | +1.6% | +83% | 33 |
| SPY | +5.3% | +64.6% | -0.4% | +116% | 32 |
| QQQ | -5.8% | +87.5% | -3.5% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-07-23. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
