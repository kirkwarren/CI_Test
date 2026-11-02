# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-11-02 · crypto through 2026-11-01 (completed UTC days), equities through 2026-10-30 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.89 | +115.9% | +229.3% | 0.86 | +109% | -89% | +69.0% |
| 2 | **AAPL** | stock | 0.83 | +22.5% | +23.0% | 0.97 | +27% | -33% | +16.2% |
| 3 | **XOM** | stock | 0.83 | +40.7% | +22.6% | 0.90 | +23% | -21% | +21.1% |
| 4 | **XLV** | etf | 0.81 | +15.4% | +27.4% | 0.92 | +15% | -18% | +16.5% |
| 5 | **UNI-USD** | crypto | 0.79 | +52.7% | +121.2% | 0.64 | +107% | -87% | +52.3% |
| 6 | **XLE** | etf | 0.78 | +42.5% | +19.0% | 0.84 | +22% | -22% | +19.2% |
| 7 | **XLK** | etf | 0.77 | +30.1% | +10.9% | 1.11 | +25% | -26% | +5.9% |
| 8 | **JPM** | stock | 0.75 | +9.1% | +7.9% | 1.38 | +23% | -25% | +4.4% |
| 9 | **SPY** | etf | 0.71 | +11.1% | +4.9% | 1.32 | +15% | -19% | +3.7% |
| 10 | **AAVE-USD** | crypto | 0.70 | -19.4% | +44.4% | 0.60 | +94% | -84% | +24.6% |

Bottom of the screen: TLT (0.21), DOGE-USD (0.13), ADA-USD (0.10), DOT-USD (0.06), ATOM-USD (0.05).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -70.9% | -61.2% | below 200d |
| ADA-USD | -68.4% | -60.1% | below 200d |
| DOGE-USD | -59.5% | -50.4% | below 200d |
| BCH-USD | -56.6% | -43.7% | above 200d |
| AVAX-USD | -53.8% | -42.3% | above 200d |
| ATOM-USD | -52.8% | -45.5% | below 200d |
| XRP-USD | -50.6% | -40.7% | below 200d |
| SOL-USD | -49.7% | -36.3% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **7 of 38** assets — and 7 of those 7 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.0%** vs median buy-and-hold: **+60.9%**
- Median walk-forward degradation: **+94%** of the in-sample edge lost out-of-sample (over the 21 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 32 assets: **+1.7%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.7%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 7/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +190.4% | n/a | n/a | 4 |
| AAPL | -13.6% | +94.1% | -0.9% | n/a | 20 |
| XOM | -19.2% | +71.6% | +4.9% | -25% | 20 |
| BTC-USD | +15.0% | +125.2% | +5.1% | +46% | 27 |
| ETH-USD | +11.7% | +23.9% | +3.7% | +39% | 30 |
| SPY | -6.2% | +75.4% | -3.1% | +297% | 20 |
| QQQ | -5.7% | +90.0% | -0.8% | +182% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-11-02. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
