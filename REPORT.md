# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-08-27 · crypto through 2026-08-26 (completed UTC days), equities through 2026-08-26 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.015% over 720 overlapping days
- ETH-USD: median divergence 0.016% over 720 overlapping days
- SOL-USD: median divergence 0.015% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **XLK** | etf | 0.83 | +30.7% | +27.9% | 1.15 | +25% | -26% | +15.1% |
| 2 | **JPM** | stock | 0.82 | +21.2% | +17.5% | 1.40 | +23% | -25% | +12.6% |
| 3 | **NEAR-USD** | crypto | 0.75 | -33.2% | +96.6% | 0.66 | +104% | -89% | +17.2% |
| 4 | **AAPL** | stock | 0.72 | +49.7% | +14.3% | 0.83 | +27% | -33% | +11.1% |
| 5 | **GOOGL** | stock | 0.72 | +60.1% | +9.3% | 1.21 | +31% | -30% | +2.4% |
| 6 | **QQQ** | etf | 0.69 | +18.4% | +15.4% | 1.19 | +20% | -23% | +8.7% |
| 7 | **XLE** | etf | 0.68 | +30.3% | +13.8% | 0.64 | +22% | -22% | +15.2% |
| 8 | **SPY** | etf | 0.68 | +15.3% | +10.5% | 1.27 | +15% | -19% | +8.1% |
| 9 | **IWM** | etf | 0.67 | +26.3% | +13.0% | 0.86 | +21% | -28% | +10.4% |
| 10 | **EEM** | etf | 0.66 | +23.9% | +6.1% | 1.00 | +20% | -19% | +9.6% |

Bottom of the screen: ADA-USD (0.13), AVAX-USD (0.12), BCH-USD (0.11), ATOM-USD (0.05), DOT-USD (0.02).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -80.7% | -80.5% | below 200d |
| AVAX-USD | -78.9% | -73.5% | below 200d |
| ADA-USD | -77.2% | -82.0% | below 200d |
| DOGE-USD | -69.8% | -67.8% | below 200d |
| ATOM-USD | -68.6% | -71.3% | below 200d |
| AAVE-USD | -61.3% | -70.8% | above 200d |
| LTC-USD | -59.9% | -59.5% | below 200d |
| BCH-USD | -58.9% | -61.6% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **8 of 38** assets — and 8 of those 8 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-2.4%** vs median buy-and-hold: **+57.0%**
- Median walk-forward degradation: **+108%** of the in-sample edge lost out-of-sample (over the 19 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.8%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.0%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 8/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | -4.6% | +115.0% | -3.2% | n/a | 20 |
| JPM | +2.5% | +141.6% | -1.9% | +146% | 28 |
| NEAR-USD | -2.2% | +59.3% | n/a | n/a | 4 |
| BTC-USD | +14.2% | +202.8% | -0.1% | +102% | 30 |
| ETH-USD | +6.1% | +51.8% | -0.0% | +102% | 31 |
| SPY | -3.3% | +73.0% | -1.2% | +139% | 29 |
| QQQ | -11.2% | +94.0% | -3.1% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-08-27. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
