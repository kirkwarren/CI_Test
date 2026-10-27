# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-27 · crypto through 2026-10-26 (completed UTC days), equities through 2026-10-26 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.91 | +112.5% | +222.8% | 0.93 | +109% | -89% | +84.3% |
| 2 | **AAPL** | stock | 0.83 | +31.4% | +28.5% | 1.03 | +27% | -33% | +16.6% |
| 3 | **XOM** | stock | 0.82 | +38.5% | +24.5% | 0.93 | +23% | -21% | +20.3% |
| 4 | **XLK** | etf | 0.80 | +35.8% | +16.0% | 1.24 | +25% | -26% | +10.4% |
| 5 | **UNI-USD** | crypto | 0.78 | +45.6% | +117.4% | 0.68 | +107% | -87% | +54.8% |
| 6 | **NVDA** | stock | 0.76 | +23.6% | -0.3% | 1.44 | +47% | -37% | +6.0% |
| 7 | **XLE** | etf | 0.76 | +39.5% | +22.7% | 0.88 | +22% | -22% | +19.5% |
| 8 | **QQQ** | etf | 0.75 | +21.9% | +7.2% | 1.29 | +20% | -23% | +5.1% |
| 9 | **XLV** | etf | 0.74 | +16.9% | +25.0% | 0.92 | +15% | -18% | +13.3% |
| 10 | **SPY** | etf | 0.73 | +14.8% | +7.0% | 1.45 | +15% | -19% | +5.2% |

Bottom of the screen: BCH-USD (0.17), ADA-USD (0.14), DOGE-USD (0.13), ATOM-USD (0.07), DOT-USD (0.07).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -69.1% | -61.2% | below 200d |
| ADA-USD | -69.1% | -62.7% | below 200d |
| DOGE-USD | -61.3% | -53.0% | below 200d |
| BCH-USD | -57.1% | -40.0% | below 200d |
| AVAX-USD | -56.0% | -48.0% | above 200d |
| XRP-USD | -50.4% | -42.3% | above 200d |
| SOL-USD | -49.3% | -39.3% | above 200d |
| LTC-USD | -48.6% | -27.5% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **6 of 38** assets — and 6 of those 6 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+70.0%**
- Median walk-forward degradation: **+94%** of the in-sample edge lost out-of-sample (over the 22 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.0%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.1%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 6/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +269.1% | n/a | n/a | 4 |
| AAPL | -13.6% | +104.4% | -0.1% | n/a | 20 |
| XOM | -19.2% | +74.8% | +6.0% | -43% | 20 |
| BTC-USD | +21.1% | +134.7% | +3.7% | +67% | 36 |
| ETH-USD | +11.1% | +30.6% | +3.7% | +45% | 30 |
| SPY | -6.2% | +86.4% | -2.6% | +567% | 20 |
| QQQ | -5.7% | +106.2% | -0.4% | +120% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-27. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
