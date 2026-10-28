# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-28 · crypto through 2026-10-27 (completed UTC days), equities through 2026-10-27 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.014% over 720 overlapping days
- ETH-USD: median divergence 0.013% over 720 overlapping days
- SOL-USD: median divergence 0.014% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **NEAR-USD** | crypto | 0.90 | +130.9% | +242.8% | 0.93 | +109% | -89% | +90.1% |
| 2 | **AAPL** | stock | 0.86 | +28.8% | +28.2% | 1.03 | +27% | -33% | +17.6% |
| 3 | **XLK** | etf | 0.82 | +32.5% | +20.0% | 1.25 | +25% | -26% | +12.2% |
| 4 | **XOM** | stock | 0.80 | +40.8% | +19.5% | 0.88 | +23% | -21% | +17.0% |
| 5 | **UNI-USD** | crypto | 0.79 | +48.6% | +117.7% | 0.67 | +107% | -87% | +52.6% |
| 6 | **NVDA** | stock | 0.78 | +22.9% | +2.2% | 1.43 | +47% | -37% | +6.8% |
| 7 | **QQQ** | etf | 0.76 | +19.4% | +9.7% | 1.29 | +20% | -23% | +6.3% |
| 8 | **XLE** | etf | 0.75 | +41.0% | +18.2% | 0.84 | +22% | -22% | +16.8% |
| 9 | **XLV** | etf | 0.74 | +17.3% | +24.6% | 0.90 | +15% | -18% | +13.2% |
| 10 | **SPY** | etf | 0.73 | +13.0% | +8.1% | 1.44 | +15% | -19% | +5.8% |

Bottom of the screen: TLT (0.18), ADA-USD (0.12), DOGE-USD (0.12), ATOM-USD (0.07), DOT-USD (0.06).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -69.4% | -59.6% | below 200d |
| ADA-USD | -68.2% | -61.8% | below 200d |
| DOGE-USD | -59.2% | -51.7% | below 200d |
| BCH-USD | -54.8% | -40.1% | above 200d |
| AVAX-USD | -54.5% | -46.4% | above 200d |
| XRP-USD | -48.9% | -42.4% | above 200d |
| LTC-USD | -48.2% | -28.3% | above 200d |
| SOL-USD | -47.9% | -38.6% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **6 of 38** assets — and 6 of those 6 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+69.7%**
- Median walk-forward degradation: **+96%** of the in-sample edge lost out-of-sample (over the 22 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.3%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.6%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 6/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +266.4% | n/a | n/a | 4 |
| AAPL | -13.6% | +103.8% | -0.6% | n/a | 20 |
| XLK | -5.6% | +132.7% | -1.0% | n/a | 20 |
| BTC-USD | +21.4% | +134.0% | +3.4% | +69% | 36 |
| ETH-USD | +10.7% | +30.7% | +3.4% | +49% | 30 |
| SPY | -6.2% | +85.2% | -2.2% | n/a | 20 |
| QQQ | -5.7% | +106.5% | -1.4% | +261% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-28. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
