# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-07-29 · crypto through 2026-07-28 (completed UTC days), equities through 2026-07-28 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.016% over 720 overlapping days
- ETH-USD: median divergence 0.016% over 720 overlapping days
- SOL-USD: median divergence 0.016% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **JPM** | stock | 0.90 | +10.2% | +18.7% | 1.31 | +23% | -25% | +14.8% |
| 2 | **AAPL** | stock | 0.89 | +32.7% | +33.2% | 0.82 | +27% | -33% | +22.9% |
| 3 | **XLK** | etf | 0.86 | +38.3% | +17.1% | 1.01 | +25% | -26% | +10.4% |
| 4 | **GOOGL** | stock | 0.83 | +74.7% | +0.1% | 1.18 | +30% | -30% | +2.8% |
| 5 | **IWM** | etf | 0.80 | +33.6% | +11.1% | 0.72 | +21% | -28% | +10.6% |
| 6 | **QQQ** | etf | 0.77 | +24.7% | +8.0% | 1.03 | +20% | -23% | +4.9% |
| 7 | **SPY** | etf | 0.77 | +14.4% | +6.9% | 1.13 | +15% | -19% | +6.0% |
| 8 | **XOM** | stock | 0.76 | +23.7% | +13.5% | 0.63 | +23% | -21% | +10.5% |
| 9 | **XLF** | etf | 0.74 | +0.2% | +7.8% | 1.10 | +16% | -16% | +9.1% |
| 10 | **NVDA** | stock | 0.72 | +11.0% | +5.7% | 1.26 | +47% | -37% | +2.1% |

Bottom of the screen: AVAX-USD (0.12), BCH-USD (0.09), ADA-USD (0.08), ATOM-USD (0.08), DOT-USD (0.02).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -83.2% | -79.6% | below 200d |
| ADA-USD | -83.2% | -81.9% | below 200d |
| AVAX-USD | -81.3% | -74.5% | below 200d |
| DOGE-USD | -75.6% | -67.7% | below 200d |
| ATOM-USD | -73.3% | -66.2% | below 200d |
| AAVE-USD | -71.8% | -68.3% | below 200d |
| SOL-USD | -70.2% | -61.1% | below 200d |
| LINK-USD | -68.5% | -59.9% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **11 of 38** assets — and 10 of those 11 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.1%** vs median buy-and-hold: **+35.6%**
- Median walk-forward degradation: **+127%** of the in-sample edge lost out-of-sample (over the 19 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 32 assets: **+3.6%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.3%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 11/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| JPM | +14.5% | +126.2% | -1.7% | +158% | 28 |
| AAPL | -14.8% | +73.1% | +1.2% | n/a | 20 |
| XLK | +0.5% | +91.9% | -2.0% | +181% | 20 |
| BTC-USD | +22.0% | +118.0% | -1.3% | +127% | 38 |
| ETH-USD | +13.6% | +3.1% | +3.0% | +67% | 30 |
| SPY | -2.5% | +61.8% | -3.4% | +218% | 23 |
| QQQ | -5.8% | +76.1% | -3.7% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-07-29. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
