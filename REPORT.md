# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-11-12 · crypto through 2026-11-11 (completed UTC days), equities through 2026-11-11 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.87 | +99.8% | +122.8% | 0.78 | +109% | -89% | +35.2% |
| 2 | **AAPL** | stock | 0.86 | +26.7% | +19.0% | 0.95 | +27% | -33% | +18.4% |
| 3 | **XLV** | etf | 0.85 | +15.2% | +28.8% | 0.96 | +15% | -18% | +18.2% |
| 4 | **JPM** | stock | 0.82 | +4.6% | +14.4% | 1.35 | +23% | -25% | +5.8% |
| 5 | **XLF** | etf | 0.82 | +3.5% | +15.0% | 1.22 | +16% | -16% | +8.8% |
| 6 | **SPY** | etf | 0.77 | +14.2% | +2.4% | 1.26 | +15% | -19% | +3.9% |
| 7 | **UNI-USD** | crypto | 0.77 | -15.6% | +65.4% | 0.56 | +107% | -87% | +26.8% |
| 8 | **XOM** | stock | 0.76 | +47.3% | +10.0% | 0.78 | +23% | -21% | +6.8% |
| 9 | **XLE** | etf | 0.74 | +48.8% | +10.0% | 0.74 | +22% | -22% | +6.8% |
| 10 | **XLK** | etf | 0.74 | +32.8% | -1.4% | 0.99 | +26% | -26% | +2.2% |

Bottom of the screen: BCH-USD (0.14), ADA-USD (0.12), DOGE-USD (0.11), ATOM-USD (0.06), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -71.3% | -61.7% | below 200d |
| ADA-USD | -68.1% | -58.2% | below 200d |
| BCH-USD | -65.1% | -47.5% | below 200d |
| DOGE-USD | -60.4% | -52.2% | below 200d |
| XRP-USD | -56.0% | -43.9% | below 200d |
| ATOM-USD | -51.8% | -38.5% | below 200d |
| LTC-USD | -50.6% | -38.8% | below 200d |
| AVAX-USD | -49.4% | -40.4% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 10 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.6%** vs median buy-and-hold: **+54.0%**
- Median walk-forward degradation: **+80%** of the in-sample edge lost out-of-sample (over the 22 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 32 assets: **+1.6%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **+0.2%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +125.9% | n/a | n/a | 4 |
| AAPL | -13.6% | +92.4% | +0.8% | +67% | 20 |
| XLV | +10.7% | +48.8% | +0.6% | n/a | 20 |
| BTC-USD | +7.7% | +102.7% | +5.1% | +34% | 24 |
| ETH-USD | +6.7% | -0.0% | +4.1% | +1% | 29 |
| SPY | -6.2% | +72.6% | -1.9% | +207% | 20 |
| QQQ | -5.7% | +83.0% | +0.5% | +46% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-11-12. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
