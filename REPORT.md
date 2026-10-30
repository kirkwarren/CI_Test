# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-30 · crypto through 2026-10-29 (completed UTC days), equities through 2026-10-29 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.88 | +114.5% | +205.6% | 0.87 | +109% | -89% | +62.7% |
| 2 | **AAPL** | stock | 0.85 | +23.8% | +28.6% | 1.03 | +27% | -33% | +17.8% |
| 3 | **XLK** | etf | 0.84 | +29.7% | +18.3% | 1.24 | +25% | -26% | +11.4% |
| 4 | **XOM** | stock | 0.83 | +41.5% | +18.8% | 0.91 | +23% | -21% | +18.8% |
| 5 | **JPM** | stock | 0.78 | +8.3% | +9.7% | 1.45 | +23% | -25% | +6.4% |
| 6 | **XLV** | etf | 0.78 | +15.8% | +26.1% | 0.96 | +15% | -18% | +16.1% |
| 7 | **SPY** | etf | 0.77 | +11.0% | +7.1% | 1.43 | +15% | -19% | +5.6% |
| 8 | **UNI-USD** | crypto | 0.77 | +41.1% | +102.3% | 0.64 | +107% | -87% | +38.2% |
| 9 | **XLE** | etf | 0.77 | +40.8% | +15.2% | 0.85 | +22% | -22% | +17.2% |
| 10 | **QQQ** | etf | 0.76 | +16.9% | +7.1% | 1.28 | +20% | -23% | +5.3% |

Bottom of the screen: BCH-USD (0.16), DOGE-USD (0.13), ADA-USD (0.11), ATOM-USD (0.06), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -72.3% | -61.3% | below 200d |
| ADA-USD | -69.0% | -61.8% | below 200d |
| DOGE-USD | -59.9% | -51.2% | below 200d |
| BCH-USD | -58.2% | -44.6% | below 200d |
| AVAX-USD | -56.1% | -41.9% | above 200d |
| ATOM-USD | -51.9% | -44.4% | below 200d |
| XRP-USD | -51.1% | -41.6% | below 200d |
| LTC-USD | -50.3% | -32.2% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **8 of 38** assets — and 7 of those 8 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+65.9%**
- Median walk-forward degradation: **+92%** of the in-sample edge lost out-of-sample (over the 22 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.3%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.9%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 8/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +204.0% | n/a | n/a | 4 |
| AAPL | -13.6% | +104.9% | -0.6% | n/a | 20 |
| XLK | -5.6% | +131.8% | -1.0% | n/a | 20 |
| BTC-USD | +14.8% | +124.4% | +5.1% | +52% | 27 |
| ETH-USD | +12.0% | +23.9% | +3.0% | +56% | 30 |
| SPY | -6.2% | +85.1% | -2.2% | n/a | 20 |
| QQQ | -5.7% | +104.9% | -1.4% | +261% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-30. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
