# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-16 · crypto through 2026-10-15 (completed UTC days), equities through 2026-10-15 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.93 | +0.4% | +272.8% | 1.04 | +108% | -89% | +134.0% |
| 2 | **UNI-USD** | crypto | 0.81 | -3.2% | +129.9% | 0.71 | +107% | -87% | +68.6% |
| 3 | **AAPL** | stock | 0.79 | +34.2% | +29.8% | 0.94 | +27% | -33% | +17.1% |
| 4 | **XLK** | etf | 0.77 | +30.7% | +24.5% | 1.19 | +25% | -26% | +13.1% |
| 5 | **NVDA** | stock | 0.73 | +18.8% | +9.5% | 1.34 | +47% | -37% | +7.1% |
| 6 | **QQQ** | etf | 0.71 | +17.8% | +13.7% | 1.21 | +20% | -23% | +7.9% |
| 7 | **SPY** | etf | 0.69 | +13.9% | +10.0% | 1.33 | +15% | -19% | +6.5% |
| 8 | **XOM** | stock | 0.68 | +45.4% | +14.9% | 0.79 | +23% | -21% | +15.4% |
| 9 | **XLE** | etf | 0.68 | +48.3% | +17.6% | 0.71 | +22% | -22% | +15.8% |
| 10 | **GOOGL** | stock | 0.66 | +39.7% | +3.9% | 1.16 | +31% | -30% | +2.5% |

Bottom of the screen: TSLA (0.19), TLT (0.16), ATOM-USD (0.14), DOGE-USD (0.13), BCH-USD (0.11).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -66.3% | -70.8% | above 200d |
| DOT-USD | -64.8% | -70.0% | above 200d |
| DOGE-USD | -60.6% | -59.2% | below 200d |
| BCH-USD | -57.5% | -58.5% | below 200d |
| AVAX-USD | -52.2% | -66.9% | above 200d |
| XRP-USD | -49.6% | -46.8% | above 200d |
| SOL-USD | -47.3% | -50.1% | above 200d |
| ATOM-USD | -46.6% | -54.5% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **5 of 38** assets — and 5 of those 5 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.0%** vs median buy-and-hold: **+66.2%**
- Median walk-forward degradation: **+110%** of the in-sample edge lost out-of-sample (over the 21 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+1.9%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.6%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 5/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +420.4% | n/a | n/a | 4 |
| UNI-USD | +3.8% | +90.8% | n/a | n/a | 4 |
| AAPL | -13.6% | +91.4% | -1.3% | n/a | 20 |
| BTC-USD | +16.8% | +189.1% | +5.6% | +46% | 27 |
| ETH-USD | +11.1% | +55.9% | +2.5% | +58% | 30 |
| SPY | -6.2% | +77.0% | -0.3% | n/a | 20 |
| QQQ | -5.7% | +97.1% | -0.7% | +186% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-16. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
