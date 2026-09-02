# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-02 · crypto through 2026-09-01 (completed UTC days), equities through 2026-09-01 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLK** | etf | 0.85 | +35.7% | +33.6% | 1.10 | +25% | -26% | +15.0% |
| 2 | **JPM** | stock | 0.79 | +17.0% | +18.2% | 1.42 | +23% | -25% | +11.8% |
| 3 | **NVDA** | stock | 0.78 | +18.6% | +20.8% | 1.31 | +47% | -37% | +10.9% |
| 4 | **AAPL** | stock | 0.77 | +30.7% | +23.3% | 0.81 | +27% | -33% | +14.9% |
| 5 | **GOOGL** | stock | 0.73 | +75.4% | +10.4% | 1.14 | +31% | -30% | -0.0% |
| 6 | **QQQ** | etf | 0.72 | +22.7% | +17.6% | 1.13 | +20% | -23% | +7.9% |
| 7 | **SPY** | etf | 0.70 | +17.5% | +12.0% | 1.23 | +15% | -19% | +7.2% |
| 8 | **EEM** | etf | 0.70 | +29.0% | +14.3% | 0.99 | +20% | -19% | +8.5% |
| 9 | **XLE** | etf | 0.68 | +30.1% | +14.6% | 0.65 | +22% | -22% | +18.7% |
| 10 | **AMZN** | stock | 0.66 | +24.0% | +22.1% | 0.80 | +32% | -31% | +6.8% |

Bottom of the screen: ADA-USD (0.12), AVAX-USD (0.11), BCH-USD (0.09), ATOM-USD (0.05), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -80.8% | -78.4% | below 200d |
| AVAX-USD | -79.5% | -71.8% | below 200d |
| ADA-USD | -78.9% | -76.4% | below 200d |
| DOGE-USD | -71.8% | -66.4% | below 200d |
| ATOM-USD | -69.7% | -71.2% | below 200d |
| BCH-USD | -62.4% | -61.1% | below 200d |
| AAVE-USD | -61.0% | -69.8% | above 200d |
| LTC-USD | -60.7% | -58.9% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **7 of 38** assets — and 7 of those 7 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.7%** vs median buy-and-hold: **+52.9%**
- Median walk-forward degradation: **+132%** of the in-sample edge lost out-of-sample (over the 20 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.9%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.2%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 7/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | -4.9% | +107.7% | -4.6% | n/a | 20 |
| JPM | +2.3% | +144.5% | -3.0% | +181% | 28 |
| NVDA | +8.0% | +347.9% | -0.6% | +111% | 32 |
| BTC-USD | +17.4% | +198.0% | +0.2% | +98% | 37 |
| ETH-USD | +12.9% | +47.8% | +3.3% | +5% | 30 |
| SPY | -0.6% | +69.6% | -1.0% | +128% | 21 |
| QQQ | -11.2% | +87.2% | -3.4% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-02. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
