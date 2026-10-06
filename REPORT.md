# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-06 · crypto through 2026-10-05 (completed UTC days), equities through 2026-10-05 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.91 | -25.9% | +323.2% | 1.01 | +107% | -89% | +157.7% |
| 2 | **XLK** | etf | 0.86 | +30.0% | +46.9% | 1.29 | +25% | -26% | +21.6% |
| 3 | **NVDA** | stock | 0.85 | +20.9% | +34.5% | 1.42 | +47% | -37% | +18.8% |
| 4 | **UNI-USD** | crypto | 0.81 | -12.5% | +188.6% | 0.73 | +106% | -87% | +116.2% |
| 5 | **QQQ** | etf | 0.74 | +18.5% | +28.5% | 1.30 | +20% | -23% | +13.0% |
| 6 | **AAVE-USD** | crypto | 0.72 | -53.0% | +95.6% | 0.82 | +94% | -84% | +81.7% |
| 7 | **AAPL** | stock | 0.69 | +27.6% | +28.6% | 0.92 | +27% | -33% | +15.0% |
| 8 | **SOL-USD** | crypto | 0.68 | -54.9% | +47.6% | 1.07 | +83% | -76% | +40.2% |
| 9 | **EEM** | etf | 0.65 | +24.8% | +20.3% | 1.10 | +20% | -19% | +9.0% |
| 10 | **SPY** | etf | 0.64 | +15.5% | +17.6% | 1.37 | +15% | -19% | +7.5% |

Bottom of the screen: TSLA (0.22), VNQ (0.20), BCH-USD (0.15), ATOM-USD (0.14), TLT (0.09).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -72.0% | -77.9% | above 200d |
| ADA-USD | -69.0% | -73.9% | above 200d |
| DOGE-USD | -64.1% | -64.5% | above 200d |
| AVAX-USD | -63.7% | -74.8% | above 200d |
| ATOM-USD | -57.7% | -62.4% | above 200d |
| BCH-USD | -51.6% | -56.9% | above 200d |
| XRP-USD | -49.6% | -52.4% | above 200d |
| SOL-USD | -48.0% | -54.9% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **4 of 38** assets — and 3 of those 4 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.0%** vs median buy-and-hold: **+73.1%**
- Median walk-forward degradation: **+83%** of the in-sample edge lost out-of-sample (over the 25 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.5%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **+0.0%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 4/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +384.5% | n/a | n/a | 4 |
| XLK | -5.6% | +138.9% | +0.6% | +35% | 20 |
| NVDA | +3.8% | +422.0% | -1.6% | +157% | 29 |
| BTC-USD | +18.5% | +206.5% | +8.6% | +34% | 27 |
| ETH-USD | +8.4% | +65.8% | +4.3% | +41% | 30 |
| SPY | -6.2% | +80.4% | +1.0% | +58% | 20 |
| QQQ | -5.7% | +107.3% | +2.0% | -32% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-06. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
