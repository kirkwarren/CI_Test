# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-09 · crypto through 2026-10-08 (completed UTC days), equities through 2026-10-08 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.91 | -21.7% | +235.2% | 0.98 | +108% | -89% | +111.7% |
| 2 | **XLK** | etf | 0.86 | +31.5% | +39.2% | 1.26 | +25% | -26% | +19.1% |
| 3 | **NVDA** | stock | 0.83 | +20.9% | +25.3% | 1.40 | +47% | -37% | +14.1% |
| 4 | **UNI-USD** | crypto | 0.81 | -16.4% | +128.0% | 0.67 | +106% | -87% | +66.8% |
| 5 | **AAPL** | stock | 0.77 | +22.9% | +30.7% | 0.94 | +27% | -33% | +17.2% |
| 6 | **QQQ** | etf | 0.75 | +18.5% | +22.5% | 1.27 | +20% | -23% | +11.3% |
| 7 | **SPY** | etf | 0.70 | +13.9% | +13.8% | 1.35 | +15% | -19% | +7.1% |
| 8 | **AAVE-USD** | crypto | 0.69 | -54.9% | +80.5% | 0.80 | +94% | -84% | +62.3% |
| 9 | **XLE** | etf | 0.67 | +46.0% | +13.8% | 0.71 | +22% | -22% | +14.6% |
| 10 | **MSFT** | stock | 0.66 | -6.2% | +40.1% | 0.72 | +26% | -35% | +20.5% |

Bottom of the screen: DOGE-USD (0.16), ATOM-USD (0.15), DOT-USD (0.14), TLT (0.13), BCH-USD (0.08).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -73.3% | -70.3% | above 200d |
| ADA-USD | -71.5% | -73.9% | above 200d |
| DOGE-USD | -66.2% | -64.8% | below 200d |
| AVAX-USD | -64.6% | -72.2% | above 200d |
| BCH-USD | -58.6% | -55.7% | below 200d |
| ATOM-USD | -56.7% | -55.5% | above 200d |
| XRP-USD | -50.8% | -50.8% | above 200d |
| SOL-USD | -50.4% | -54.9% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **6 of 38** assets — and 6 of those 6 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.0%** vs median buy-and-hold: **+68.4%**
- Median walk-forward degradation: **+89%** of the in-sample edge lost out-of-sample (over the 25 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.3%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **+0.2%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 6/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +327.7% | n/a | n/a | 4 |
| XLK | -5.7% | +133.9% | +0.6% | +33% | 20 |
| NVDA | +3.5% | +409.1% | -1.5% | +269% | 29 |
| BTC-USD | +16.6% | +198.2% | +6.6% | +31% | 27 |
| ETH-USD | +6.9% | +57.7% | +3.5% | +50% | 31 |
| SPY | -6.2% | +79.0% | +1.7% | +37% | 20 |
| QQQ | -11.2% | +103.9% | +1.2% | +16% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-09. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
