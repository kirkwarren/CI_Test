# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-30 · crypto through 2026-09-29 (completed UTC days), equities through 2026-09-29 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.90 | -34.6% | +320.8% | 0.97 | +107% | -89% | +151.2% |
| 2 | **XLK** | etf | 0.86 | +33.2% | +52.5% | 1.27 | +25% | -26% | +18.5% |
| 3 | **NVDA** | stock | 0.82 | +22.1% | +37.6% | 1.40 | +47% | -37% | +13.7% |
| 4 | **UNI-USD** | crypto | 0.81 | -33.7% | +155.4% | 0.71 | +106% | -87% | +119.5% |
| 5 | **QQQ** | etf | 0.74 | +20.2% | +32.2% | 1.27 | +20% | -23% | +10.7% |
| 6 | **AAPL** | stock | 0.69 | +25.1% | +33.6% | 0.93 | +27% | -33% | +14.2% |
| 7 | **SOL-USD** | crypto | 0.66 | -52.2% | +44.4% | 1.06 | +83% | -76% | +39.7% |
| 8 | **SPY** | etf | 0.66 | +16.2% | +20.9% | 1.35 | +15% | -19% | +6.2% |
| 9 | **EEM** | etf | 0.65 | +27.4% | +23.1% | 1.07 | +20% | -19% | +7.3% |
| 10 | **GOOGL** | stock | 0.64 | +40.6% | +24.7% | 1.17 | +31% | -30% | +0.7% |

Bottom of the screen: DOT-USD (0.21), TSLA (0.14), BCH-USD (0.12), TLT (0.11), ATOM-USD (0.10).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -72.9% | -79.4% | above 200d |
| ADA-USD | -72.0% | -76.1% | above 200d |
| DOGE-USD | -64.7% | -65.1% | above 200d |
| AVAX-USD | -63.5% | -76.6% | above 200d |
| ATOM-USD | -60.1% | -64.6% | above 200d |
| BCH-USD | -53.0% | -56.7% | below 200d |
| XRP-USD | -51.0% | -52.9% | above 200d |
| SOL-USD | -49.3% | -52.2% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **5 of 38** assets — and 5 of those 5 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+71.4%**
- Median walk-forward degradation: **+92%** of the in-sample edge lost out-of-sample (over the 23 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.6%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **+0.2%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 5/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +321.1% | n/a | n/a | 4 |
| XLK | -5.6% | +134.8% | -0.9% | +132% | 20 |
| NVDA | +3.4% | +407.4% | +1.6% | +62% | 29 |
| BTC-USD | +13.8% | +198.8% | +5.9% | +52% | 27 |
| ETH-USD | +12.3% | +54.4% | +4.5% | +38% | 29 |
| SPY | -6.2% | +78.8% | +2.5% | n/a | 20 |
| QQQ | -5.7% | +104.3% | +0.6% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-30. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
