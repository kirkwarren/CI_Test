# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-19 · crypto through 2026-09-18 (completed UTC days), equities through 2026-09-18 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.015% over 720 overlapping days
- ETH-USD: median divergence 0.015% over 720 overlapping days
- SOL-USD: median divergence 0.015% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **NEAR-USD** | crypto | 0.89 | -45.6% | +182.1% | 0.90 | +106% | -89% | +113.4% |
| 2 | **XLK** | etf | 0.87 | +35.3% | +37.0% | 1.20 | +25% | -26% | +16.7% |
| 3 | **NVDA** | stock | 0.86 | +27.8% | +24.5% | 1.40 | +47% | -37% | +12.0% |
| 4 | **UNI-USD** | crypto | 0.83 | -62.2% | +147.6% | 0.72 | +105% | -87% | +136.2% |
| 5 | **AAPL** | stock | 0.81 | +32.6% | +35.0% | 0.92 | +27% | -33% | +17.4% |
| 6 | **QQQ** | etf | 0.73 | +21.4% | +21.7% | 1.20 | +20% | -23% | +8.9% |
| 7 | **JPM** | stock | 0.72 | +14.6% | +21.4% | 1.35 | +23% | -25% | +9.1% |
| 8 | **SOL-USD** | crypto | 0.67 | -65.5% | +26.8% | 1.10 | +84% | -76% | +34.9% |
| 9 | **GOOGL** | stock | 0.66 | +38.1% | +13.8% | 1.17 | +31% | -30% | +3.6% |
| 10 | **XLE** | etf | 0.65 | +41.3% | +8.3% | 0.64 | +22% | -22% | +15.4% |

Bottom of the screen: TLT (0.16), AVAX-USD (0.15), DOT-USD (0.14), ATOM-USD (0.11), BCH-USD (0.08).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| AVAX-USD | -75.8% | -80.8% | above 200d |
| ADA-USD | -74.9% | -79.8% | above 200d |
| DOT-USD | -74.2% | -82.6% | above 200d |
| DOGE-USD | -67.3% | -73.1% | below 200d |
| ATOM-USD | -61.5% | -68.1% | above 200d |
| BCH-USD | -61.0% | -65.9% | below 200d |
| XRP-USD | -54.1% | -64.0% | above 200d |
| LTC-USD | -53.8% | -60.4% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **7 of 38** assets — and 7 of those 7 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.5%** vs median buy-and-hold: **+63.0%**
- Median walk-forward degradation: **+98%** of the in-sample edge lost out-of-sample (over the 22 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.8%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.9%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 7/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +235.7% | n/a | n/a | 4 |
| XLK | -11.2% | +124.0% | -1.9% | n/a | 20 |
| NVDA | +5.2% | +410.7% | -0.8% | +120% | 31 |
| BTC-USD | +19.0% | +198.2% | +6.1% | +47% | 37 |
| ETH-USD | +7.4% | +61.0% | +2.2% | +48% | 31 |
| SPY | -6.3% | +72.1% | +2.6% | +17% | 20 |
| QQQ | -11.2% | +95.1% | -1.9% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-19. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
