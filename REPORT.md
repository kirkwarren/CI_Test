# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-08-20 · crypto through 2026-08-19 (completed UTC days), equities through 2026-08-19 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLK** | etf | 0.90 | +35.8% | +30.3% | 1.17 | +25% | -26% | +16.2% |
| 2 | **JPM** | stock | 0.85 | +18.4% | +15.7% | 1.38 | +23% | -25% | +13.2% |
| 3 | **AAPL** | stock | 0.79 | +41.9% | +19.9% | 0.87 | +27% | -33% | +12.7% |
| 4 | **GOOGL** | stock | 0.77 | +70.6% | +13.6% | 1.24 | +31% | -30% | +3.7% |
| 5 | **NVDA** | stock | 0.77 | +13.9% | +15.7% | 1.34 | +47% | -37% | +11.5% |
| 6 | **QQQ** | etf | 0.77 | +22.8% | +18.2% | 1.21 | +21% | -23% | +9.8% |
| 7 | **XOM** | stock | 0.77 | +42.2% | +9.4% | 0.71 | +23% | -21% | +16.0% |
| 8 | **IWM** | etf | 0.75 | +30.1% | +14.3% | 0.88 | +21% | -28% | +12.0% |
| 9 | **XLE** | etf | 0.75 | +37.6% | +16.1% | 0.67 | +22% | -22% | +18.4% |
| 10 | **SPY** | etf | 0.72 | +16.3% | +12.1% | 1.30 | +15% | -19% | +8.8% |

Bottom of the screen: ADA-USD (0.10), AVAX-USD (0.10), ATOM-USD (0.07), BCH-USD (0.07), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -82.6% | -77.8% | below 200d |
| AVAX-USD | -80.8% | -70.6% | below 200d |
| ADA-USD | -79.9% | -80.0% | below 200d |
| DOGE-USD | -74.1% | -65.6% | below 200d |
| AAVE-USD | -73.4% | -67.6% | below 200d |
| ATOM-USD | -69.5% | -65.2% | below 200d |
| UNI-USD | -68.2% | -63.5% | above 200d |
| BCH-USD | -67.4% | -60.0% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **7 of 38** assets — and 7 of those 7 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.7%** vs median buy-and-hold: **+53.2%**
- Median walk-forward degradation: **+163%** of the in-sample edge lost out-of-sample (over the 22 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.2%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.6%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 7/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | -5.8% | +118.5% | -1.7% | n/a | 20 |
| JPM | +5.3% | +139.0% | +0.3% | +92% | 29 |
| AAPL | -9.5% | +80.2% | -0.9% | +153% | 20 |
| BTC-USD | +15.3% | +165.3% | -0.6% | +110% | 38 |
| ETH-USD | +15.5% | +35.1% | +2.3% | +3% | 32 |
| SPY | -6.5% | +75.0% | -2.4% | +175% | 20 |
| QQQ | -11.2% | +96.8% | -3.9% | +390% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-08-20. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
