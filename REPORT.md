# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-07-12 · crypto through 2026-07-11 (completed UTC days), equities through 2026-07-10 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.016% over 720 overlapping days
- ETH-USD: median divergence 0.016% over 720 overlapping days
- SOL-USD: median divergence 0.016% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **GOOGL** | stock | 0.94 | +106.2% | +10.9% | 1.38 | +30% | -30% | +12.0% |
| 2 | **XLK** | etf | 0.93 | +40.2% | +26.8% | 1.16 | +25% | -26% | +21.6% |
| 3 | **QQQ** | etf | 0.86 | +27.3% | +16.3% | 1.20 | +20% | -23% | +13.7% |
| 4 | **EEM** | etf | 0.84 | +36.3% | +17.7% | 0.96 | +19% | -19% | +12.4% |
| 5 | **NVDA** | stock | 0.84 | +27.8% | +11.6% | 1.36 | +47% | -37% | +10.1% |
| 6 | **AAPL** | stock | 0.82 | +37.6% | +21.1% | 0.78 | +26% | -33% | +15.7% |
| 7 | **SPY** | etf | 0.77 | +18.1% | +9.5% | 1.23 | +15% | -19% | +8.7% |
| 8 | **IWM** | etf | 0.77 | +27.4% | +15.9% | 0.79 | +21% | -28% | +12.9% |
| 9 | **JPM** | stock | 0.76 | +10.4% | +2.9% | 1.31 | +23% | -25% | +8.9% |
| 10 | **UNH** | stock | 0.68 | +36.3% | +24.3% | 0.14 | +37% | -62% | +25.1% |

Bottom of the screen: LTC-USD (0.16), BCH-USD (0.12), AVAX-USD (0.11), ADA-USD (0.07), DOT-USD (0.02).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -82.8% | -76.0% | below 200d |
| AVAX-USD | -81.4% | -67.9% | below 200d |
| DOT-USD | -81.3% | -75.7% | below 200d |
| DOGE-USD | -74.7% | -57.2% | below 200d |
| AAVE-USD | -72.6% | -78.4% | below 200d |
| LINK-USD | -70.4% | -48.5% | below 200d |
| UNI-USD | -69.9% | -71.3% | below 200d |
| ATOM-USD | -69.5% | -56.2% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **11 of 38** assets — and 9 of those 11 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **+0.9%** vs median buy-and-hold: **+30.8%**
- Median walk-forward degradation: **+100%** of the in-sample edge lost out-of-sample (over the 23 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 34 assets: **+3.7%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.7%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 11/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| GOOGL | -3.5% | +200.3% | +1.3% | +62% | 20 |
| XLK | -0.3% | +113.6% | -1.0% | +131% | 21 |
| QQQ | -0.3% | +94.6% | -4.3% | n/a | 20 |
| BTC-USD | +26.9% | +102.6% | -1.6% | +132% | 39 |
| ETH-USD | +14.5% | -10.9% | +0.7% | +92% | 32 |
| SPY | +6.1% | +69.3% | -3.1% | +239% | 32 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-07-12. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
