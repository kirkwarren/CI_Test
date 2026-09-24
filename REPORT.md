# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-24 · crypto through 2026-09-23 (completed UTC days), equities through 2026-09-23 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.88 | -33.1% | +235.2% | 0.95 | +106% | -89% | +136.0% |
| 2 | **XLK** | etf | 0.86 | +27.4% | +43.5% | 1.28 | +25% | -26% | +19.7% |
| 3 | **UNI-USD** | crypto | 0.83 | -46.3% | +156.0% | 0.74 | +106% | -87% | +137.9% |
| 4 | **NVDA** | stock | 0.77 | +13.5% | +28.7% | 1.43 | +47% | -37% | +13.3% |
| 5 | **QQQ** | etf | 0.75 | +17.3% | +26.9% | 1.29 | +20% | -23% | +11.6% |
| 6 | **AAPL** | stock | 0.74 | +21.2% | +33.9% | 0.95 | +27% | -33% | +17.4% |
| 7 | **SOL-USD** | crypto | 0.67 | -53.6% | +26.7% | 1.12 | +84% | -76% | +36.5% |
| 8 | **SPY** | etf | 0.66 | +14.5% | +17.5% | 1.33 | +15% | -19% | +7.0% |
| 9 | **BTC-USD** | crypto | 0.65 | -29.5% | +19.6% | 1.06 | +47% | -53% | +19.2% |
| 10 | **EEM** | etf | 0.64 | +24.1% | +19.8% | 1.05 | +20% | -19% | +8.2% |

Bottom of the screen: VNQ (0.23), TSLA (0.19), TLT (0.13), DOT-USD (0.08), ATOM-USD (0.07).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -75.0% | -77.3% | above 200d |
| ADA-USD | -72.7% | -72.5% | above 200d |
| AVAX-USD | -68.2% | -77.6% | above 200d |
| DOGE-USD | -65.2% | -62.0% | above 200d |
| ATOM-USD | -60.7% | -63.1% | below 200d |
| AAVE-USD | -53.3% | -51.9% | above 200d |
| SOL-USD | -51.0% | -53.6% | above 200d |
| LTC-USD | -50.9% | -51.3% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **5 of 38** assets — and 5 of those 5 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+66.9%**
- Median walk-forward degradation: **+83%** of the in-sample edge lost out-of-sample (over the 23 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.2%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.2%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 5/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +293.3% | n/a | n/a | 4 |
| XLK | -5.7% | +136.9% | -0.7% | +151% | 20 |
| UNI-USD | +3.8% | +116.5% | n/a | n/a | 4 |
| BTC-USD | +10.1% | +220.9% | +6.4% | +46% | 21 |
| ETH-USD | +8.4% | +69.0% | +3.3% | +40% | 32 |
| SPY | -6.2% | +77.6% | +3.6% | -46% | 20 |
| QQQ | -11.2% | +106.1% | +1.2% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-24. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
