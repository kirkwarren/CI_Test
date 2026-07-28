# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-07-28 · crypto through 2026-07-27 (completed UTC days), equities through 2026-07-27 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **AAPL** | stock | 0.90 | +28.7% | +35.8% | 0.82 | +27% | -33% | +21.9% |
| 2 | **JPM** | stock | 0.90 | +13.0% | +19.6% | 1.31 | +23% | -25% | +14.6% |
| 3 | **XLK** | etf | 0.88 | +41.2% | +20.1% | 1.04 | +25% | -26% | +12.6% |
| 4 | **GOOGL** | stock | 0.82 | +78.9% | -0.4% | 1.16 | +30% | -30% | +0.7% |
| 5 | **QQQ** | etf | 0.77 | +26.8% | +9.5% | 1.05 | +20% | -23% | +6.0% |
| 6 | **EEM** | etf | 0.77 | +36.9% | +7.7% | 0.81 | +20% | -19% | +5.8% |
| 7 | **IWM** | etf | 0.77 | +33.7% | +10.6% | 0.74 | +21% | -28% | +10.6% |
| 8 | **SPY** | etf | 0.76 | +15.7% | +7.2% | 1.13 | +15% | -19% | +5.8% |
| 9 | **XOM** | stock | 0.76 | +24.2% | +14.7% | 0.69 | +23% | -21% | +11.9% |
| 10 | **XLF** | etf | 0.75 | +0.7% | +7.2% | 1.08 | +16% | -16% | +7.8% |

Bottom of the screen: AVAX-USD (0.11), BCH-USD (0.11), ADA-USD (0.08), ATOM-USD (0.08), DOT-USD (0.02).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -83.8% | -82.6% | below 200d |
| DOT-USD | -83.3% | -80.8% | below 200d |
| AVAX-USD | -81.8% | -75.4% | below 200d |
| DOGE-USD | -75.7% | -69.1% | below 200d |
| ATOM-USD | -73.4% | -67.6% | below 200d |
| AAVE-USD | -72.6% | -69.3% | below 200d |
| SOL-USD | -70.1% | -62.7% | below 200d |
| UNI-USD | -69.4% | -73.4% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 9 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **+0.1%** vs median buy-and-hold: **+33.9%**
- Median walk-forward degradation: **+135%** of the in-sample edge lost out-of-sample (over the 20 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 32 assets: **+4.2%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-2.0%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| AAPL | -9.6% | +72.0% | +2.3% | n/a | 20 |
| JPM | +14.3% | +127.0% | -1.9% | +168% | 28 |
| XLK | +0.5% | +95.9% | -2.8% | +250% | 20 |
| BTC-USD | +22.1% | +117.0% | -1.1% | +117% | 38 |
| ETH-USD | +13.1% | +0.5% | +2.2% | +76% | 33 |
| SPY | -2.5% | +61.8% | -1.5% | +185% | 23 |
| QQQ | -5.8% | +77.9% | -3.9% | +641% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-07-28. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
