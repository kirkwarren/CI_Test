# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-22 · crypto through 2026-09-21 (completed UTC days), equities through 2026-09-21 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.89 | -40.1% | +235.1% | 0.94 | +106% | -89% | +136.7% |
| 2 | **XLK** | etf | 0.84 | +32.6% | +44.0% | 1.28 | +25% | -26% | +19.8% |
| 3 | **NVDA** | stock | 0.83 | +23.0% | +31.7% | 1.45 | +47% | -37% | +14.5% |
| 4 | **UNI-USD** | crypto | 0.82 | -52.5% | +158.7% | 0.73 | +106% | -87% | +135.0% |
| 5 | **AAPL** | stock | 0.73 | +30.9% | +36.7% | 0.96 | +27% | -33% | +18.3% |
| 6 | **QQQ** | etf | 0.71 | +19.4% | +27.4% | 1.30 | +20% | -23% | +11.8% |
| 7 | **JPM** | stock | 0.67 | +12.2% | +22.9% | 1.40 | +23% | -25% | +9.8% |
| 8 | **EEM** | etf | 0.66 | +25.4% | +23.7% | 1.08 | +20% | -19% | +10.3% |
| 9 | **BTC-USD** | crypto | 0.64 | -33.2% | +27.6% | 1.07 | +47% | -53% | +22.7% |
| 10 | **GOOGL** | stock | 0.64 | +35.2% | +17.9% | 1.25 | +31% | -30% | +5.1% |

Bottom of the screen: DOT-USD (0.18), TSLA (0.18), TLT (0.13), ATOM-USD (0.11), BCH-USD (0.06).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -72.6% | -78.4% | above 200d |
| ADA-USD | -71.9% | -74.5% | above 200d |
| AVAX-USD | -66.9% | -77.3% | above 200d |
| DOGE-USD | -62.5% | -64.8% | above 200d |
| BCH-USD | -59.2% | -53.4% | below 200d |
| ATOM-USD | -58.1% | -64.1% | above 200d |
| AAVE-USD | -51.0% | -57.0% | above 200d |
| LTC-USD | -50.8% | -54.0% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **5 of 38** assets — and 5 of those 5 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+76.5%**
- Median walk-forward degradation: **+98%** of the in-sample edge lost out-of-sample (over the 23 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.5%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.2%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 5/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +282.6% | n/a | n/a | 4 |
| XLK | -5.7% | +137.0% | -0.4% | +135% | 20 |
| NVDA | +5.5% | +446.5% | -0.1% | +103% | 31 |
| BTC-USD | +21.8% | +225.8% | +6.9% | +33% | 37 |
| ETH-USD | +17.5% | +74.1% | +4.6% | +0% | 31 |
| SPY | -0.6% | +79.7% | +4.6% | -62% | 21 |
| QQQ | -11.2% | +107.2% | +0.4% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-22. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
