# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-08-29 · crypto through 2026-08-28 (completed UTC days), equities through 2026-08-28 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.015% over 720 overlapping days
- ETH-USD: median divergence 0.016% over 720 overlapping days
- SOL-USD: median divergence 0.015% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **XLK** | etf | 0.86 | +32.9% | +33.8% | 1.14 | +25% | -26% | +16.5% |
| 2 | **JPM** | stock | 0.85 | +17.2% | +19.1% | 1.39 | +23% | -25% | +12.8% |
| 3 | **AAPL** | stock | 0.77 | +44.7% | +21.0% | 0.82 | +27% | -33% | +13.1% |
| 4 | **NVDA** | stock | 0.77 | +7.4% | +22.8% | 1.30 | +47% | -37% | +11.1% |
| 5 | **QQQ** | etf | 0.76 | +19.2% | +18.0% | 1.16 | +20% | -23% | +9.3% |
| 6 | **GOOGL** | stock | 0.74 | +60.8% | +11.2% | 1.19 | +31% | -30% | +3.6% |
| 7 | **XLE** | etf | 0.70 | +32.2% | +12.1% | 0.65 | +22% | -22% | +15.3% |
| 8 | **AMZN** | stock | 0.68 | +2.8% | +26.9% | 0.87 | +32% | -31% | +11.6% |
| 9 | **EEM** | etf | 0.68 | +27.4% | +7.3% | 0.98 | +20% | -19% | +9.3% |
| 10 | **SOL-USD** | crypto | 0.67 | -65.7% | +21.2% | 1.06 | +83% | -76% | +27.7% |

Bottom of the screen: ADA-USD (0.11), AVAX-USD (0.11), BCH-USD (0.10), ATOM-USD (0.05), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -81.3% | -80.8% | below 200d |
| AVAX-USD | -79.2% | -74.2% | below 200d |
| ADA-USD | -78.1% | -81.1% | below 200d |
| DOGE-USD | -70.6% | -68.8% | below 200d |
| ATOM-USD | -69.3% | -73.2% | below 200d |
| AAVE-USD | -62.8% | -69.8% | above 200d |
| BCH-USD | -62.1% | -62.1% | below 200d |
| LTC-USD | -60.8% | -60.1% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **8 of 38** assets — and 8 of those 8 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.6%** vs median buy-and-hold: **+54.1%**
- Median walk-forward degradation: **+125%** of the in-sample edge lost out-of-sample (over the 19 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.1%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.4%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 8/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | -4.6% | +114.1% | -4.5% | n/a | 20 |
| JPM | +2.6% | +140.4% | -1.5% | +137% | 28 |
| AAPL | -9.5% | +73.6% | -1.3% | +195% | 20 |
| BTC-USD | +14.2% | +185.1% | -0.6% | +109% | 30 |
| ETH-USD | +5.4% | +43.2% | +1.5% | -1% | 31 |
| SPY | -0.7% | +71.3% | -2.6% | +213% | 21 |
| QQQ | -11.2% | +91.2% | -4.4% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-08-29. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
