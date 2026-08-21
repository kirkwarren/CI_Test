# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-08-21 · crypto through 2026-08-20 (completed UTC days), equities through 2026-08-20 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLK** | etf | 0.89 | +37.8% | +30.6% | 1.17 | +25% | -26% | +15.7% |
| 2 | **NVDA** | stock | 0.83 | +20.7% | +15.4% | 1.33 | +47% | -37% | +11.1% |
| 3 | **JPM** | stock | 0.81 | +19.8% | +14.1% | 1.36 | +23% | -25% | +11.3% |
| 4 | **XOM** | stock | 0.78 | +43.8% | +10.1% | 0.73 | +23% | -21% | +16.8% |
| 5 | **AAPL** | stock | 0.76 | +41.3% | +19.5% | 0.84 | +27% | -33% | +10.7% |
| 6 | **XLE** | etf | 0.75 | +39.2% | +15.5% | 0.68 | +22% | -22% | +18.5% |
| 7 | **GOOGL** | stock | 0.74 | +69.7% | +12.5% | 1.22 | +31% | -30% | +2.4% |
| 8 | **QQQ** | etf | 0.74 | +23.9% | +17.8% | 1.20 | +21% | -23% | +9.0% |
| 9 | **IWM** | etf | 0.72 | +29.9% | +12.5% | 0.86 | +21% | -28% | +10.4% |
| 10 | **EEM** | etf | 0.70 | +30.4% | +9.1% | 1.02 | +20% | -19% | +9.1% |

Bottom of the screen: AVAX-USD (0.14), ADA-USD (0.12), BCH-USD (0.08), ATOM-USD (0.05), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -81.3% | -78.2% | below 200d |
| AVAX-USD | -79.3% | -72.0% | below 200d |
| ADA-USD | -78.6% | -80.3% | below 200d |
| AAVE-USD | -72.3% | -68.1% | above 200d |
| DOGE-USD | -72.2% | -66.9% | below 200d |
| ATOM-USD | -69.0% | -66.8% | below 200d |
| UNI-USD | -67.1% | -65.0% | above 200d |
| BCH-USD | -65.9% | -60.1% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **7 of 38** assets — and 7 of those 7 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.9%** vs median buy-and-hold: **+53.0%**
- Median walk-forward degradation: **+153%** of the in-sample edge lost out-of-sample (over the 21 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.4%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.7%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 7/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | -5.8% | +117.8% | -1.7% | n/a | 20 |
| NVDA | +11.7% | +361.7% | -0.7% | +108% | 33 |
| JPM | +4.7% | +135.2% | +0.3% | +92% | 30 |
| BTC-USD | +17.9% | +180.4% | +0.0% | +100% | 38 |
| ETH-USD | +15.5% | +42.3% | +0.6% | +83% | 32 |
| SPY | -6.5% | +73.6% | -2.4% | +175% | 20 |
| QQQ | -11.2% | +95.4% | -3.9% | +390% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-08-21. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
