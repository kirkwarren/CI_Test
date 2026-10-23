# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-23 · crypto through 2026-10-22 (completed UTC days), equities through 2026-10-22 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.014% over 720 overlapping days
- ETH-USD: median divergence 0.013% over 720 overlapping days
- SOL-USD: median divergence 0.014% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **NEAR-USD** | crypto | 0.93 | +103.5% | +247.5% | 0.98 | +109% | -89% | +105.0% |
| 2 | **AAPL** | stock | 0.83 | +28.3% | +27.4% | 1.01 | +27% | -33% | +18.5% |
| 3 | **UNI-USD** | crypto | 0.78 | +69.3% | +110.8% | 0.66 | +107% | -87% | +54.1% |
| 4 | **XLK** | etf | 0.77 | +35.5% | +17.0% | 1.18 | +25% | -26% | +8.3% |
| 5 | **NVDA** | stock | 0.76 | +24.5% | +6.3% | 1.38 | +47% | -37% | +4.3% |
| 6 | **XOM** | stock | 0.74 | +43.0% | +18.4% | 0.82 | +23% | -21% | +16.6% |
| 7 | **SPY** | etf | 0.72 | +14.4% | +7.8% | 1.39 | +15% | -19% | +5.1% |
| 8 | **XLE** | etf | 0.71 | +43.9% | +18.6% | 0.76 | +22% | -22% | +16.4% |
| 9 | **XLV** | etf | 0.71 | +16.3% | +24.0% | 0.87 | +15% | -18% | +14.8% |
| 10 | **QQQ** | etf | 0.69 | +21.2% | +8.1% | 1.22 | +21% | -23% | +4.1% |

Bottom of the screen: TLT (0.15), ADA-USD (0.14), ATOM-USD (0.14), DOGE-USD (0.13), BCH-USD (0.10).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -68.9% | -59.2% | above 200d |
| DOT-USD | -66.0% | -58.3% | above 200d |
| DOGE-USD | -61.7% | -47.1% | below 200d |
| BCH-USD | -58.0% | -27.1% | below 200d |
| AVAX-USD | -56.3% | -40.5% | above 200d |
| XRP-USD | -50.6% | -33.5% | above 200d |
| SOL-USD | -48.3% | -34.2% | above 200d |
| ATOM-USD | -47.3% | -40.8% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **6 of 38** assets — and 6 of those 6 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+66.7%**
- Median walk-forward degradation: **+115%** of the in-sample edge lost out-of-sample (over the 23 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.9%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.7%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 6/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +329.1% | n/a | n/a | 4 |
| AAPL | -13.6% | +101.3% | -0.4% | n/a | 20 |
| UNI-USD | +3.8% | +65.8% | n/a | n/a | 4 |
| BTC-USD | +16.4% | +139.7% | +2.9% | +72% | 27 |
| ETH-USD | +11.1% | +33.6% | +3.7% | +44% | 30 |
| SPY | -6.2% | +81.7% | -3.5% | n/a | 20 |
| QQQ | -5.7% | +98.1% | -1.7% | +196% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-23. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
