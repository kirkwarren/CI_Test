# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-11-13 · crypto through 2026-11-12 (completed UTC days), equities through 2026-11-12 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.013% over 720 overlapping days
- ETH-USD: median divergence 0.013% over 720 overlapping days
- SOL-USD: median divergence 0.014% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **NEAR-USD** | crypto | 0.87 | +98.9% | +117.3% | 0.78 | +109% | -89% | +28.5% |
| 2 | **AAPL** | stock | 0.86 | +24.6% | +19.0% | 0.94 | +27% | -33% | +18.0% |
| 3 | **XLV** | etf | 0.84 | +15.4% | +28.1% | 0.94 | +15% | -18% | +17.4% |
| 4 | **JPM** | stock | 0.83 | +6.2% | +14.3% | 1.34 | +23% | -25% | +5.6% |
| 5 | **XLF** | etf | 0.80 | +2.5% | +13.5% | 1.20 | +16% | -16% | +8.0% |
| 6 | **UNI-USD** | crypto | 0.79 | -0.4% | +67.4% | 0.56 | +107% | -87% | +23.0% |
| 7 | **XOM** | stock | 0.78 | +47.8% | +11.1% | 0.81 | +23% | -21% | +8.7% |
| 8 | **SPY** | etf | 0.77 | +12.7% | +1.2% | 1.25 | +15% | -19% | +3.5% |
| 9 | **XLE** | etf | 0.74 | +47.8% | +10.8% | 0.76 | +22% | -22% | +8.3% |
| 10 | **XLK** | etf | 0.74 | +30.0% | -3.2% | 0.99 | +26% | -26% | +1.8% |

Bottom of the screen: ADA-USD (0.14), BCH-USD (0.13), ATOM-USD (0.11), DOGE-USD (0.10), DOT-USD (0.05).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -70.8% | -60.4% | below 200d |
| ADA-USD | -67.1% | -56.8% | below 200d |
| BCH-USD | -65.6% | -46.0% | below 200d |
| DOGE-USD | -59.4% | -50.4% | below 200d |
| XRP-USD | -55.7% | -42.8% | below 200d |
| LTC-USD | -50.8% | -37.3% | below 200d |
| ATOM-USD | -49.9% | -36.4% | below 200d |
| AVAX-USD | -48.1% | -39.2% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **11 of 38** assets — and 10 of those 11 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.9%** vs median buy-and-hold: **+51.6%**
- Median walk-forward degradation: **+85%** of the in-sample edge lost out-of-sample (over the 22 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 32 assets: **+1.6%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **+0.2%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 11/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +122.5% | n/a | n/a | 4 |
| AAPL | -13.6% | +92.0% | +0.8% | +67% | 20 |
| XLV | +10.4% | +47.9% | +0.6% | n/a | 20 |
| BTC-USD | +8.8% | +100.7% | +5.1% | +35% | 24 |
| ETH-USD | +7.1% | +1.9% | +3.8% | +4% | 29 |
| SPY | -6.2% | +72.0% | -1.9% | +207% | 20 |
| QQQ | -5.7% | +82.4% | +0.5% | +46% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-11-13. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
