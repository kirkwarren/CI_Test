# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-27 · crypto through 2026-09-26 (completed UTC days), equities through 2026-09-25 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.90 | -30.7% | +327.4% | 0.99 | +107% | -89% | +166.7% |
| 2 | **XLK** | etf | 0.85 | +31.3% | +48.1% | 1.31 | +25% | -26% | +19.9% |
| 3 | **UNI-USD** | crypto | 0.82 | -38.5% | +186.6% | 0.75 | +106% | -87% | +144.5% |
| 4 | **NVDA** | stock | 0.79 | +18.5% | +31.4% | 1.43 | +47% | -37% | +12.8% |
| 5 | **QQQ** | etf | 0.74 | +19.3% | +29.8% | 1.32 | +20% | -23% | +11.9% |
| 6 | **AAPL** | stock | 0.71 | +24.2% | +34.9% | 1.00 | +27% | -33% | +18.5% |
| 7 | **SOL-USD** | crypto | 0.68 | -46.8% | +46.1% | 1.13 | +84% | -76% | +43.1% |
| 8 | **SPY** | etf | 0.64 | +15.9% | +19.6% | 1.38 | +15% | -19% | +7.4% |
| 9 | **EEM** | etf | 0.63 | +26.4% | +22.6% | 1.08 | +20% | -19% | +8.5% |
| 10 | **GOOGL** | stock | 0.62 | +38.4% | +22.4% | 1.21 | +31% | -30% | +1.7% |

Bottom of the screen: BCH-USD (0.21), VNQ (0.21), ATOM-USD (0.19), TSLA (0.16), TLT (0.09).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -71.8% | -77.5% | above 200d |
| ADA-USD | -70.9% | -73.0% | above 200d |
| AVAX-USD | -65.4% | -74.1% | above 200d |
| DOGE-USD | -63.7% | -61.7% | above 200d |
| ATOM-USD | -56.8% | -62.0% | above 200d |
| XRP-USD | -49.8% | -47.8% | above 200d |
| BCH-USD | -48.6% | -50.8% | above 200d |
| SOL-USD | -48.3% | -46.8% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **5 of 38** assets — and 4 of those 5 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.4%** vs median buy-and-hold: **+72.4%**
- Median walk-forward degradation: **+89%** of the in-sample edge lost out-of-sample (over the 24 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.1%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **+0.0%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 5/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +354.7% | n/a | n/a | 4 |
| XLK | -0.2% | +142.0% | -0.2% | +105% | 21 |
| UNI-USD | +3.8% | +119.9% | n/a | n/a | 4 |
| BTC-USD | +14.1% | +212.3% | +6.4% | +45% | 27 |
| ETH-USD | +16.6% | +63.1% | +4.6% | +31% | 31 |
| SPY | -0.6% | +81.0% | +1.6% | -162% | 21 |
| QQQ | -11.2% | +109.7% | +1.7% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-27. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
