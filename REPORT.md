# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-07-13 · crypto through 2026-07-12 (completed UTC days), equities through 2026-07-10 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **GOOGL** | stock | 0.94 | +106.2% | +10.9% | 1.34 | +30% | -30% | +12.0% |
| 2 | **XLK** | etf | 0.93 | +40.2% | +26.8% | 1.14 | +25% | -26% | +21.6% |
| 3 | **QQQ** | etf | 0.86 | +27.3% | +16.3% | 1.18 | +20% | -23% | +13.7% |
| 4 | **EEM** | etf | 0.84 | +36.3% | +17.7% | 0.94 | +19% | -19% | +12.4% |
| 5 | **NVDA** | stock | 0.84 | +27.8% | +11.6% | 1.33 | +47% | -37% | +10.1% |
| 6 | **AAPL** | stock | 0.82 | +37.6% | +21.1% | 0.77 | +26% | -33% | +15.7% |
| 7 | **SPY** | etf | 0.77 | +18.1% | +9.5% | 1.21 | +15% | -19% | +8.7% |
| 8 | **IWM** | etf | 0.77 | +27.4% | +15.9% | 0.78 | +21% | -28% | +12.9% |
| 9 | **JPM** | stock | 0.76 | +10.4% | +2.9% | 1.31 | +23% | -25% | +8.9% |
| 10 | **UNH** | stock | 0.69 | +36.3% | +24.3% | 0.14 | +37% | -62% | +25.1% |

Bottom of the screen: ATOM-USD (0.15), BCH-USD (0.12), AVAX-USD (0.09), ADA-USD (0.08), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -83.2% | -76.1% | below 200d |
| AVAX-USD | -81.8% | -68.3% | below 200d |
| DOT-USD | -81.5% | -75.4% | below 200d |
| DOGE-USD | -74.9% | -56.5% | below 200d |
| AAVE-USD | -72.9% | -78.8% | below 200d |
| UNI-USD | -70.4% | -70.2% | below 200d |
| LINK-USD | -70.1% | -48.0% | below 200d |
| ATOM-USD | -69.8% | -56.8% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 9 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **+1.4%** vs median buy-and-hold: **+35.5%**
- Median walk-forward degradation: **+112%** of the in-sample edge lost out-of-sample (over the 24 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.7%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.8%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| GOOGL | -3.5% | +186.8% | +0.9% | +73% | 20 |
| XLK | +1.2% | +110.8% | -0.5% | +114% | 20 |
| QQQ | -0.3% | +91.4% | -2.6% | n/a | 20 |
| BTC-USD | +26.9% | +110.2% | -2.0% | +144% | 39 |
| ETH-USD | +14.3% | -6.9% | -0.8% | +111% | 32 |
| SPY | +6.1% | +67.9% | -2.6% | +191% | 32 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-07-13. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
