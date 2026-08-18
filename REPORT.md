# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-08-18 · crypto through 2026-08-17 (completed UTC days), equities through 2026-08-17 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLK** | etf | 0.93 | +31.2% | +36.4% | 1.25 | +25% | -26% | +20.7% |
| 2 | **NVDA** | stock | 0.88 | +11.4% | +23.1% | 1.42 | +47% | -37% | +15.4% |
| 3 | **JPM** | stock | 0.86 | +16.0% | +19.3% | 1.40 | +23% | -25% | +14.5% |
| 4 | **QQQ** | etf | 0.84 | +19.9% | +21.3% | 1.27 | +21% | -23% | +12.1% |
| 5 | **IWM** | etf | 0.79 | +28.8% | +15.6% | 0.90 | +21% | -28% | +13.1% |
| 6 | **GOOGL** | stock | 0.78 | +70.9% | +12.5% | 1.24 | +31% | -30% | +3.7% |
| 7 | **EEM** | etf | 0.77 | +26.9% | +10.1% | 1.05 | +20% | -19% | +10.5% |
| 8 | **SPY** | etf | 0.77 | +15.2% | +13.3% | 1.32 | +15% | -19% | +9.5% |
| 9 | **XLE** | etf | 0.77 | +34.8% | +15.1% | 0.64 | +22% | -22% | +17.0% |
| 10 | **XOM** | stock | 0.76 | +37.2% | +8.8% | 0.67 | +23% | -21% | +14.1% |

Bottom of the screen: ADA-USD (0.10), ATOM-USD (0.09), AVAX-USD (0.09), BCH-USD (0.08), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -83.2% | -79.3% | below 200d |
| AVAX-USD | -82.0% | -73.8% | below 200d |
| ADA-USD | -81.3% | -82.7% | below 200d |
| DOGE-USD | -75.7% | -69.1% | below 200d |
| AAVE-USD | -75.0% | -70.4% | below 200d |
| UNI-USD | -71.3% | -67.7% | below 200d |
| ATOM-USD | -71.2% | -67.6% | below 200d |
| SOL-USD | -69.3% | -60.5% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **9 of 38** assets — and 8 of those 9 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.1%** vs median buy-and-hold: **+54.8%**
- Median walk-forward degradation: **+122%** of the in-sample edge lost out-of-sample (over the 24 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.2%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.6%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 9/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | +0.5% | +130.7% | -1.7% | +276% | 20 |
| NVDA | +12.8% | +419.7% | +0.4% | +96% | 33 |
| JPM | +5.9% | +142.3% | -0.1% | +101% | 29 |
| BTC-USD | +19.5% | +147.1% | -1.7% | +124% | 36 |
| ETH-USD | +11.0% | +14.5% | -0.3% | +108% | 31 |
| SPY | -6.5% | +77.0% | -1.5% | +142% | 20 |
| QQQ | -5.8% | +103.8% | -3.4% | +349% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-08-18. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
