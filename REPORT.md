# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-08-06 · crypto through 2026-08-05 (completed UTC days), equities through 2026-08-05 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.015% over 720 overlapping days
- ETH-USD: median divergence 0.016% over 720 overlapping days
- SOL-USD: median divergence 0.016% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **XLK** | etf | 0.91 | +36.6% | +30.8% | 1.16 | +25% | -26% | +19.1% |
| 2 | **GOOGL** | stock | 0.87 | +88.2% | +6.7% | 1.27 | +31% | -30% | +10.5% |
| 3 | **NVDA** | stock | 0.87 | +9.4% | +21.6% | 1.36 | +47% | -37% | +13.2% |
| 4 | **JPM** | stock | 0.83 | +15.3% | +14.1% | 1.32 | +23% | -25% | +14.9% |
| 5 | **QQQ** | etf | 0.82 | +25.8% | +16.3% | 1.16 | +21% | -23% | +10.9% |
| 6 | **AAPL** | stock | 0.80 | +52.8% | +15.4% | 0.82 | +27% | -33% | +11.5% |
| 7 | **AMZN** | stock | 0.79 | +16.2% | +14.3% | 0.84 | +32% | -31% | +15.6% |
| 8 | **IWM** | etf | 0.77 | +34.8% | +14.1% | 0.79 | +21% | -28% | +12.4% |
| 9 | **EEM** | etf | 0.76 | +34.9% | +10.3% | 0.92 | +20% | -19% | +8.7% |
| 10 | **SPY** | etf | 0.76 | +18.5% | +11.6% | 1.24 | +15% | -19% | +9.7% |

Bottom of the screen: ADA-USD (0.14), AVAX-USD (0.11), BCH-USD (0.08), ATOM-USD (0.06), DOT-USD (0.02).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -81.4% | -75.6% | below 200d |
| AVAX-USD | -81.1% | -68.4% | below 200d |
| ADA-USD | -80.1% | -74.6% | below 200d |
| DOGE-USD | -75.8% | -61.7% | below 200d |
| AAVE-USD | -74.9% | -63.1% | below 200d |
| ATOM-USD | -72.3% | -62.1% | below 200d |
| SOL-USD | -70.1% | -50.1% | below 200d |
| LINK-USD | -69.5% | -51.0% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **11 of 38** assets — and 10 of those 11 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.3%** vs median buy-and-hold: **+39.9%**
- Median walk-forward degradation: **+118%** of the in-sample edge lost out-of-sample (over the 19 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 32 assets: **+2.7%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.4%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 11/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | +0.5% | +116.6% | -2.9% | n/a | 20 |
| GOOGL | -5.4% | +175.5% | -2.3% | +184% | 20 |
| NVDA | +16.8% | +382.7% | -1.8% | +114% | 34 |
| BTC-USD | +21.6% | +121.4% | -1.3% | +116% | 38 |
| ETH-USD | +11.1% | +4.4% | +2.8% | +63% | 31 |
| SPY | -2.5% | +70.8% | -0.5% | +118% | 23 |
| QQQ | -5.8% | +91.2% | -3.0% | +481% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-08-06. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
