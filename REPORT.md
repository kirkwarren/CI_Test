# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-11-07 · crypto through 2026-11-06 (completed UTC days), equities through 2026-11-06 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.90 | +154.0% | +152.3% | 0.82 | +109% | -89% | +42.9% |
| 2 | **AAPL** | stock | 0.85 | +26.0% | +16.7% | 0.92 | +27% | -33% | +14.6% |
| 3 | **XLV** | etf | 0.84 | +15.4% | +28.8% | 0.88 | +15% | -18% | +15.9% |
| 4 | **JPM** | stock | 0.79 | +6.3% | +10.7% | 1.33 | +23% | -25% | +3.3% |
| 5 | **UNI-USD** | crypto | 0.79 | +50.6% | +100.3% | 0.59 | +107% | -87% | +42.5% |
| 6 | **XLF** | etf | 0.78 | +3.1% | +11.6% | 1.18 | +16% | -16% | +6.2% |
| 7 | **XOM** | stock | 0.76 | +48.2% | +14.7% | 0.78 | +23% | -21% | +6.6% |
| 8 | **MSFT** | stock | 0.73 | +3.0% | +27.8% | 0.62 | +27% | -35% | +20.6% |
| 9 | **XLE** | etf | 0.70 | +49.3% | +10.6% | 0.70 | +22% | -22% | +4.2% |
| 10 | **SPY** | etf | 0.70 | +14.2% | -0.3% | 1.21 | +15% | -19% | +0.7% |

Bottom of the screen: XLM-USD (0.20), DOGE-USD (0.14), ADA-USD (0.09), DOT-USD (0.05), ATOM-USD (0.04).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -72.0% | -58.1% | below 200d |
| ADA-USD | -69.0% | -52.0% | below 200d |
| DOGE-USD | -60.2% | -44.9% | below 200d |
| BCH-USD | -59.7% | -36.5% | below 200d |
| ATOM-USD | -55.5% | -34.9% | below 200d |
| AVAX-USD | -54.2% | -30.9% | above 200d |
| XRP-USD | -53.4% | -35.8% | below 200d |
| LTC-USD | -52.4% | -24.0% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **8 of 38** assets — and 8 of those 8 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+50.6%**
- Median walk-forward degradation: **+77%** of the in-sample edge lost out-of-sample (over the 23 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 32 assets: **+1.7%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **+0.4%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 8/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +153.0% | n/a | n/a | 4 |
| AAPL | -13.6% | +88.3% | -1.0% | n/a | 20 |
| XLV | +9.4% | +44.0% | +0.0% | n/a | 20 |
| BTC-USD | +7.0% | +112.5% | +4.4% | +42% | 24 |
| ETH-USD | +4.6% | +18.3% | +3.4% | +23% | 29 |
| SPY | -6.2% | +68.3% | -0.0% | +102% | 20 |
| QQQ | -5.7% | +76.0% | +0.7% | +67% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-11-07. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
