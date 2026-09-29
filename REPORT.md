# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-29 · crypto through 2026-09-28 (completed UTC days), equities through 2026-09-28 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.90 | -33.3% | +313.9% | 0.97 | +107% | -89% | +150.2% |
| 2 | **XLK** | etf | 0.86 | +35.7% | +49.7% | 1.28 | +25% | -26% | +18.7% |
| 3 | **NVDA** | stock | 0.84 | +28.3% | +36.6% | 1.42 | +47% | -37% | +14.6% |
| 4 | **UNI-USD** | crypto | 0.81 | -39.6% | +162.1% | 0.72 | +106% | -87% | +118.8% |
| 5 | **QQQ** | etf | 0.75 | +21.5% | +30.9% | 1.28 | +20% | -23% | +10.6% |
| 6 | **AAPL** | stock | 0.74 | +22.5% | +36.0% | 0.99 | +27% | -33% | +17.5% |
| 7 | **SOL-USD** | crypto | 0.68 | -49.9% | +46.0% | 1.10 | +84% | -76% | +39.6% |
| 8 | **SPY** | etf | 0.66 | +17.2% | +20.7% | 1.35 | +15% | -19% | +6.5% |
| 9 | **LINK-USD** | crypto | 0.65 | -47.2% | +83.7% | 0.67 | +86% | -75% | +64.0% |
| 10 | **EEM** | etf | 0.64 | +28.0% | +21.7% | 1.06 | +20% | -19% | +7.1% |

Bottom of the screen: DOT-USD (0.20), TSLA (0.14), BCH-USD (0.12), TLT (0.11), ATOM-USD (0.10).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -73.1% | -78.8% | above 200d |
| ADA-USD | -71.6% | -75.1% | above 200d |
| AVAX-USD | -66.1% | -75.6% | above 200d |
| DOGE-USD | -64.7% | -64.1% | above 200d |
| ATOM-USD | -59.8% | -64.1% | above 200d |
| BCH-USD | -52.6% | -55.6% | below 200d |
| XRP-USD | -50.8% | -51.3% | above 200d |
| AAVE-USD | -49.7% | -53.9% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **6 of 38** assets — and 5 of those 6 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+70.2%**
- Median walk-forward degradation: **+95%** of the in-sample edge lost out-of-sample (over the 23 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.0%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.1%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 6/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +324.8% | n/a | n/a | 4 |
| XLK | -5.6% | +137.3% | -1.0% | +143% | 20 |
| NVDA | +3.5% | +426.1% | +1.0% | +66% | 29 |
| BTC-USD | +13.7% | +209.5% | +8.7% | +34% | 27 |
| ETH-USD | +12.4% | +60.8% | +4.6% | +33% | 29 |
| SPY | -6.2% | +79.1% | +2.7% | n/a | 20 |
| QQQ | -5.7% | +105.6% | -0.1% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-29. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
