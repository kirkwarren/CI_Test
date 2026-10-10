# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-10 · crypto through 2026-10-09 (completed UTC days), equities through 2026-10-09 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.014% over 720 overlapping days
- ETH-USD: median divergence 0.014% over 720 overlapping days
- SOL-USD: median divergence 0.015% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **NEAR-USD** | crypto | 0.92 | -13.9% | +257.1% | 1.01 | +108% | -89% | +129.5% |
| 2 | **XLK** | etf | 0.86 | +27.4% | +39.4% | 1.26 | +25% | -26% | +19.5% |
| 3 | **UNI-USD** | crypto | 0.79 | -21.7% | +135.4% | 0.68 | +106% | -87% | +70.8% |
| 4 | **NVDA** | stock | 0.77 | +15.5% | +21.6% | 1.39 | +47% | -37% | +13.4% |
| 5 | **AAPL** | stock | 0.74 | +26.5% | +29.2% | 0.93 | +27% | -33% | +15.8% |
| 6 | **QQQ** | etf | 0.73 | +15.9% | +22.9% | 1.27 | +20% | -23% | +11.8% |
| 7 | **AAVE-USD** | crypto | 0.72 | -54.1% | +84.7% | 0.81 | +94% | -84% | +63.1% |
| 8 | **MSFT** | stock | 0.70 | -6.2% | +44.3% | 0.75 | +26% | -35% | +23.3% |
| 9 | **SPY** | etf | 0.66 | +12.6% | +14.6% | 1.36 | +15% | -19% | +7.7% |
| 10 | **GOOGL** | stock | 0.65 | +36.0% | +10.8% | 1.18 | +31% | -30% | +3.4% |

Bottom of the screen: TSLA (0.23), VNQ (0.22), DOGE-USD (0.16), TLT (0.12), BCH-USD (0.08).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -66.7% | -74.0% | above 200d |
| DOT-USD | -63.4% | -72.5% | above 200d |
| DOGE-USD | -60.1% | -65.3% | below 200d |
| BCH-USD | -57.7% | -56.6% | below 200d |
| AVAX-USD | -56.6% | -72.6% | above 200d |
| SOL-USD | -47.8% | -54.1% | above 200d |
| XRP-USD | -47.3% | -50.2% | above 200d |
| XLM-USD | -44.6% | -52.3% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **4 of 38** assets — and 3 of those 4 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.0%** vs median buy-and-hold: **+68.8%**
- Median walk-forward degradation: **+89%** of the in-sample edge lost out-of-sample (over the 24 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.8%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **+0.4%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 4/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +375.0% | n/a | n/a | 4 |
| XLK | -5.6% | +134.8% | +0.9% | +35% | 20 |
| UNI-USD | +3.8% | +77.3% | n/a | n/a | 4 |
| BTC-USD | +17.0% | +207.2% | +6.2% | +34% | 27 |
| ETH-USD | +6.9% | +58.7% | +3.4% | +51% | 31 |
| SPY | -6.2% | +79.2% | +1.1% | +65% | 20 |
| QQQ | -5.7% | +103.8% | +2.0% | +3% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-10. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
