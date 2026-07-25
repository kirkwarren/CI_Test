# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-07-25 · crypto through 2026-07-24 (completed UTC days), equities through 2026-07-24 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **AAPL** | stock | 0.89 | +36.9% | +34.1% | 0.81 | +27% | -33% | +20.7% |
| 2 | **XLK** | etf | 0.88 | +40.7% | +21.4% | 1.04 | +25% | -26% | +13.7% |
| 3 | **JPM** | stock | 0.86 | +12.4% | +16.3% | 1.30 | +23% | -25% | +13.7% |
| 4 | **NVDA** | stock | 0.83 | +16.5% | +11.9% | 1.31 | +47% | -37% | +7.2% |
| 5 | **GOOGL** | stock | 0.81 | +81.5% | -3.3% | 1.22 | +30% | -30% | -1.3% |
| 6 | **QQQ** | etf | 0.77 | +26.0% | +10.2% | 1.08 | +20% | -23% | +6.4% |
| 7 | **XLE** | etf | 0.77 | +23.4% | +21.9% | 0.61 | +22% | -22% | +14.1% |
| 8 | **SPY** | etf | 0.75 | +15.6% | +7.2% | 1.13 | +15% | -19% | +5.8% |
| 9 | **XOM** | stock | 0.75 | +24.5% | +17.4% | 0.68 | +23% | -21% | +13.6% |
| 10 | **IWM** | etf | 0.74 | +30.9% | +7.9% | 0.74 | +21% | -28% | +10.0% |

Bottom of the screen: ATOM-USD (0.12), AVAX-USD (0.10), BCH-USD (0.10), ADA-USD (0.07), DOT-USD (0.04).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -83.0% | -81.7% | below 200d |
| DOT-USD | -82.2% | -77.9% | below 200d |
| AVAX-USD | -82.1% | -72.8% | below 200d |
| DOGE-USD | -76.0% | -67.2% | below 200d |
| AAVE-USD | -74.0% | -72.0% | below 200d |
| ATOM-USD | -71.5% | -64.4% | below 200d |
| SOL-USD | -70.1% | -62.8% | below 200d |
| LINK-USD | -68.9% | -58.6% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 10 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.1%** vs median buy-and-hold: **+35.3%**
- Median walk-forward degradation: **+132%** of the in-sample edge lost out-of-sample (over the 21 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 32 assets: **+3.9%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.5%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| AAPL | -14.8% | +72.0% | +0.5% | n/a | 20 |
| XLK | +0.5% | +97.1% | -1.0% | +130% | 20 |
| JPM | +13.9% | +125.2% | -2.9% | +236% | 28 |
| BTC-USD | +21.9% | +118.3% | -0.9% | +115% | 38 |
| ETH-USD | +13.1% | -0.6% | +2.0% | +78% | 33 |
| SPY | -4.6% | +62.2% | -1.6% | +148% | 29 |
| QQQ | -5.8% | +80.6% | -4.5% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-07-25. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
