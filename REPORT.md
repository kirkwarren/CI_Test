# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-20 · crypto through 2026-09-19 (completed UTC days), equities through 2026-09-18 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.88 | -43.4% | +172.6% | 0.88 | +106% | -89% | +102.0% |
| 2 | **XLK** | etf | 0.86 | +35.3% | +37.0% | 1.22 | +25% | -26% | +16.7% |
| 3 | **NVDA** | stock | 0.85 | +27.8% | +24.5% | 1.42 | +47% | -37% | +12.0% |
| 4 | **UNI-USD** | crypto | 0.83 | -59.0% | +140.3% | 0.72 | +105% | -87% | +129.7% |
| 5 | **AAPL** | stock | 0.81 | +32.6% | +35.0% | 0.95 | +27% | -33% | +17.4% |
| 6 | **QQQ** | etf | 0.72 | +21.4% | +21.7% | 1.22 | +20% | -23% | +8.9% |
| 7 | **JPM** | stock | 0.71 | +14.6% | +21.4% | 1.36 | +23% | -25% | +9.1% |
| 8 | **GOOGL** | stock | 0.66 | +38.1% | +13.8% | 1.20 | +31% | -30% | +3.6% |
| 9 | **SOL-USD** | crypto | 0.65 | -63.3% | +23.6% | 1.11 | +84% | -76% | +32.7% |
| 10 | **XLE** | etf | 0.64 | +41.3% | +8.3% | 0.65 | +22% | -22% | +15.4% |

Bottom of the screen: DOGE-USD (0.17), TLT (0.16), DOT-USD (0.12), ATOM-USD (0.11), BCH-USD (0.08).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -74.5% | -77.6% | above 200d |
| DOT-USD | -74.4% | -80.6% | above 200d |
| AVAX-USD | -70.2% | -78.4% | above 200d |
| DOGE-USD | -67.3% | -69.7% | below 200d |
| BCH-USD | -61.1% | -62.9% | below 200d |
| ATOM-USD | -60.8% | -66.2% | above 200d |
| LTC-USD | -53.7% | -58.1% | above 200d |
| SOL-USD | -53.7% | -63.3% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **6 of 38** assets — and 6 of those 6 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+69.1%**
- Median walk-forward degradation: **+108%** of the in-sample edge lost out-of-sample (over the 24 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.8%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.6%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 6/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +218.7% | n/a | n/a | 4 |
| XLK | -4.8% | +127.6% | -1.6% | +202% | 20 |
| NVDA | +5.2% | +426.2% | -1.5% | +138% | 31 |
| BTC-USD | +19.2% | +205.8% | +5.0% | +56% | 37 |
| ETH-USD | +15.6% | +66.2% | +3.0% | +22% | 30 |
| SPY | -0.6% | +73.6% | +4.2% | +14% | 21 |
| QQQ | -5.7% | +97.9% | +1.0% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-20. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
