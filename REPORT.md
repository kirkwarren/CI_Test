# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-08-02 · crypto through 2026-08-01 (completed UTC days), equities through 2026-07-31 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **GOOGL** | stock | 0.90 | +83.8% | +5.3% | 1.28 | +30% | -30% | +9.2% |
| 2 | **XLK** | etf | 0.87 | +40.3% | +19.4% | 1.07 | +25% | -26% | +12.8% |
| 3 | **JPM** | stock | 0.86 | +11.5% | +14.8% | 1.30 | +23% | -25% | +12.8% |
| 4 | **AAPL** | stock | 0.79 | +40.8% | +19.6% | 0.72 | +27% | -33% | +11.1% |
| 5 | **AMZN** | stock | 0.79 | +5.0% | +12.3% | 0.94 | +33% | -31% | +15.6% |
| 6 | **QQQ** | etf | 0.78 | +27.7% | +9.3% | 1.10 | +20% | -23% | +6.7% |
| 7 | **IWM** | etf | 0.77 | +35.1% | +10.6% | 0.74 | +21% | -28% | +9.5% |
| 8 | **SPY** | etf | 0.76 | +17.5% | +7.6% | 1.18 | +15% | -19% | +6.7% |
| 9 | **XLE** | etf | 0.73 | +20.5% | +17.9% | 0.62 | +22% | -22% | +13.2% |
| 10 | **XOM** | stock | 0.73 | +21.8% | +10.6% | 0.68 | +23% | -21% | +11.7% |

Bottom of the screen: ADA-USD (0.10), AVAX-USD (0.10), BCH-USD (0.09), ATOM-USD (0.05), DOT-USD (0.02).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -82.8% | -76.3% | below 200d |
| AVAX-USD | -82.4% | -68.4% | below 200d |
| ADA-USD | -81.9% | -77.4% | below 200d |
| DOGE-USD | -76.1% | -63.1% | below 200d |
| ATOM-USD | -74.9% | -62.3% | below 200d |
| AAVE-USD | -74.7% | -66.2% | below 200d |
| SOL-USD | -71.0% | -50.4% | below 200d |
| LINK-USD | -69.9% | -51.8% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 9 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.1%** vs median buy-and-hold: **+42.9%**
- Median walk-forward degradation: **+128%** of the in-sample edge lost out-of-sample (over the 22 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 32 assets: **+2.9%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.3%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| GOOGL | -5.4% | +177.4% | -1.1% | +131% | 20 |
| XLK | +0.5% | +101.3% | -2.4% | +211% | 20 |
| JPM | +5.6% | +126.4% | -2.8% | +173% | 28 |
| BTC-USD | +20.3% | +115.1% | -2.4% | +137% | 36 |
| ETH-USD | +3.7% | +0.5% | +1.8% | +72% | 32 |
| SPY | -4.2% | +66.0% | -1.4% | +153% | 29 |
| QQQ | -5.8% | +83.8% | -3.0% | +569% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-08-02. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
