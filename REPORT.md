# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-26 · crypto through 2026-09-25 (completed UTC days), equities through 2026-09-25 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.90 | -30.3% | +304.6% | 1.00 | +107% | -89% | +164.7% |
| 2 | **XLK** | etf | 0.83 | +31.3% | +48.1% | 1.31 | +25% | -26% | +19.9% |
| 3 | **UNI-USD** | crypto | 0.82 | -41.3% | +173.2% | 0.76 | +106% | -87% | +144.4% |
| 4 | **NVDA** | stock | 0.79 | +18.5% | +31.4% | 1.44 | +47% | -37% | +12.8% |
| 5 | **QQQ** | etf | 0.74 | +19.3% | +29.8% | 1.32 | +20% | -23% | +11.9% |
| 6 | **AAPL** | stock | 0.70 | +24.2% | +34.9% | 0.99 | +27% | -33% | +18.5% |
| 7 | **SOL-USD** | crypto | 0.67 | -47.0% | +41.2% | 1.15 | +84% | -76% | +44.3% |
| 8 | **SPY** | etf | 0.64 | +15.9% | +19.6% | 1.38 | +15% | -19% | +7.4% |
| 9 | **EEM** | etf | 0.62 | +26.4% | +22.6% | 1.08 | +20% | -19% | +8.5% |
| 10 | **GOOGL** | stock | 0.62 | +38.4% | +22.4% | 1.23 | +31% | -30% | +1.7% |

Bottom of the screen: DOT-USD (0.22), VNQ (0.21), TSLA (0.14), ATOM-USD (0.13), TLT (0.09).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -72.5% | -77.0% | above 200d |
| ADA-USD | -70.3% | -72.2% | above 200d |
| AVAX-USD | -66.0% | -74.1% | above 200d |
| DOGE-USD | -62.8% | -60.7% | above 200d |
| ATOM-USD | -58.4% | -62.3% | above 200d |
| XRP-USD | -48.4% | -48.2% | above 200d |
| AAVE-USD | -48.3% | -51.3% | above 200d |
| SOL-USD | -48.0% | -47.0% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **5 of 38** assets — and 4 of those 5 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+74.2%**
- Median walk-forward degradation: **+105%** of the in-sample edge lost out-of-sample (over the 25 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.4%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.2%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 5/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +359.8% | n/a | n/a | 4 |
| XLK | -4.6% | +142.4% | -1.0% | +147% | 20 |
| UNI-USD | +3.8% | +126.7% | n/a | n/a | 4 |
| BTC-USD | +14.0% | +219.0% | +6.8% | +44% | 27 |
| ETH-USD | +16.6% | +68.5% | +4.3% | +34% | 31 |
| SPY | -0.6% | +81.1% | +2.7% | -294% | 21 |
| QQQ | -5.7% | +110.2% | +1.0% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-26. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
