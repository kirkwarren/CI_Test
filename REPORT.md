# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-08-07 · crypto through 2026-08-06 (completed UTC days), equities through 2026-08-06 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLK** | etf | 0.93 | +39.5% | +34.2% | 1.15 | +25% | -26% | +18.6% |
| 2 | **NVDA** | stock | 0.88 | +14.5% | +25.7% | 1.35 | +47% | -37% | +13.0% |
| 3 | **GOOGL** | stock | 0.84 | +85.9% | +7.4% | 1.25 | +31% | -30% | +8.9% |
| 4 | **JPM** | stock | 0.82 | +13.5% | +12.3% | 1.31 | +23% | -25% | +13.8% |
| 5 | **QQQ** | etf | 0.81 | +27.0% | +18.0% | 1.15 | +21% | -23% | +10.4% |
| 6 | **AAPL** | stock | 0.80 | +54.4% | +13.0% | 0.83 | +27% | -33% | +11.9% |
| 7 | **AMZN** | stock | 0.78 | +14.0% | +16.9% | 0.83 | +32% | -31% | +15.2% |
| 8 | **IWM** | etf | 0.77 | +32.9% | +14.5% | 0.78 | +21% | -28% | +11.7% |
| 9 | **SPY** | etf | 0.76 | +18.7% | +12.0% | 1.24 | +15% | -19% | +9.4% |
| 10 | **EEM** | etf | 0.73 | +35.6% | +10.6% | 0.90 | +20% | -19% | +7.4% |

Bottom of the screen: ADA-USD (0.14), AVAX-USD (0.11), BCH-USD (0.08), ATOM-USD (0.06), DOT-USD (0.02).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -81.9% | -76.9% | below 200d |
| AVAX-USD | -81.7% | -69.9% | below 200d |
| ADA-USD | -79.1% | -76.4% | below 200d |
| DOGE-USD | -76.2% | -63.9% | below 200d |
| AAVE-USD | -74.9% | -65.9% | below 200d |
| ATOM-USD | -72.3% | -63.6% | below 200d |
| SOL-USD | -70.7% | -52.1% | below 200d |
| LINK-USD | -69.4% | -52.9% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **11 of 38** assets — and 10 of those 11 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.1%** vs median buy-and-hold: **+39.9%**
- Median walk-forward degradation: **+120%** of the in-sample edge lost out-of-sample (over the 19 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 32 assets: **+2.7%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.7%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 11/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | +0.5% | +116.0% | -2.9% | n/a | 20 |
| NVDA | +16.4% | +382.2% | -1.8% | +114% | 34 |
| GOOGL | -5.4% | +172.0% | -2.3% | +184% | 20 |
| BTC-USD | +17.2% | +115.9% | -1.5% | +122% | 37 |
| ETH-USD | +3.7% | +2.5% | +2.9% | +53% | 32 |
| SPY | -2.5% | +70.5% | -0.5% | +118% | 23 |
| QQQ | -5.8% | +90.5% | -3.0% | +481% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-08-07. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
