# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-25 · crypto through 2026-09-24 (completed UTC days), equities through 2026-09-24 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.89 | -38.4% | +258.7% | 0.97 | +107% | -89% | +147.7% |
| 2 | **XLK** | etf | 0.84 | +29.7% | +42.4% | 1.27 | +25% | -26% | +19.1% |
| 3 | **UNI-USD** | crypto | 0.82 | -46.0% | +146.8% | 0.74 | +106% | -87% | +133.9% |
| 4 | **NVDA** | stock | 0.80 | +19.4% | +25.7% | 1.43 | +47% | -37% | +12.7% |
| 5 | **QQQ** | etf | 0.74 | +18.8% | +26.1% | 1.29 | +20% | -23% | +11.4% |
| 6 | **AAPL** | stock | 0.72 | +21.8% | +33.0% | 0.94 | +27% | -33% | +16.9% |
| 7 | **META** | stock | 0.66 | -24.5% | +30.7% | 1.02 | +38% | -34% | +24.2% |
| 8 | **SPY** | etf | 0.64 | +15.5% | +16.8% | 1.33 | +15% | -19% | +6.8% |
| 9 | **SOL-USD** | crypto | 0.63 | -54.4% | +27.6% | 1.14 | +84% | -76% | +38.6% |
| 10 | **GOOGL** | stock | 0.62 | +37.9% | +17.7% | 1.20 | +31% | -30% | +1.3% |

Bottom of the screen: VNQ (0.22), TSLA (0.19), DOT-USD (0.15), ATOM-USD (0.14), TLT (0.12).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -73.7% | -78.7% | above 200d |
| ADA-USD | -71.6% | -74.3% | above 200d |
| AVAX-USD | -67.4% | -77.3% | above 200d |
| DOGE-USD | -64.0% | -64.5% | above 200d |
| ATOM-USD | -58.6% | -63.3% | above 200d |
| AAVE-USD | -50.6% | -54.5% | above 200d |
| SOL-USD | -50.2% | -54.4% | above 200d |
| XRP-USD | -49.6% | -51.0% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **5 of 38** assets — and 4 of those 5 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+72.1%**
- Median walk-forward degradation: **+83%** of the in-sample edge lost out-of-sample (over the 23 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.3%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.2%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 5/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +324.4% | n/a | n/a | 4 |
| XLK | -5.7% | +136.1% | -0.7% | +151% | 20 |
| UNI-USD | +3.8% | +114.8% | n/a | n/a | 4 |
| BTC-USD | +14.1% | +222.0% | +6.6% | +48% | 27 |
| ETH-USD | +16.5% | +68.7% | +4.2% | +34% | 31 |
| SPY | -6.2% | +77.5% | +3.6% | -46% | 20 |
| QQQ | -11.2% | +106.1% | +1.2% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-25. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
