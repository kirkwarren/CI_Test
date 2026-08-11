# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-08-11 · crypto through 2026-08-10 (completed UTC days), equities through 2026-08-10 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **XLK** | etf | 0.93 | +41.1% | +32.0% | 1.20 | +25% | -26% | +18.9% |
| 2 | **GOOGL** | stock | 0.83 | +81.8% | +10.7% | 1.27 | +31% | -30% | +8.5% |
| 3 | **JPM** | stock | 0.83 | +17.3% | +11.6% | 1.34 | +23% | -25% | +14.7% |
| 4 | **NVDA** | stock | 0.83 | +16.7% | +17.3% | 1.43 | +47% | -37% | +12.0% |
| 5 | **AMZN** | stock | 0.82 | +10.0% | +32.2% | 0.89 | +32% | -31% | +17.4% |
| 6 | **QQQ** | etf | 0.82 | +27.5% | +18.2% | 1.21 | +21% | -23% | +11.2% |
| 7 | **IWM** | etf | 0.78 | +34.6% | +13.2% | 0.82 | +21% | -28% | +12.2% |
| 8 | **AAPL** | stock | 0.76 | +43.3% | +10.8% | 0.82 | +27% | -33% | +10.2% |
| 9 | **SPY** | etf | 0.74 | +19.4% | +11.9% | 1.28 | +15% | -19% | +9.9% |
| 10 | **EEM** | etf | 0.71 | +35.2% | +8.5% | 0.95 | +20% | -19% | +7.5% |

Bottom of the screen: ADA-USD (0.14), ATOM-USD (0.10), AVAX-USD (0.10), BCH-USD (0.10), DOT-USD (0.02).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -82.2% | -78.9% | below 200d |
| AVAX-USD | -81.7% | -72.5% | below 200d |
| ADA-USD | -80.2% | -79.4% | below 200d |
| DOGE-USD | -75.9% | -68.7% | below 200d |
| AAVE-USD | -75.1% | -68.0% | below 200d |
| ATOM-USD | -71.4% | -66.1% | below 200d |
| SOL-USD | -69.3% | -58.0% | below 200d |
| XRP-USD | -69.1% | -65.6% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 9 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.1%** vs median buy-and-hold: **+39.6%**
- Median walk-forward degradation: **+131%** of the in-sample edge lost out-of-sample (over the 19 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.7%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.7%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | +0.6% | +123.3% | -3.2% | n/a | 20 |
| GOOGL | -5.4% | +175.9% | -3.6% | +247% | 20 |
| JPM | +6.3% | +132.9% | -1.0% | +127% | 28 |
| BTC-USD | +17.3% | +117.3% | -3.4% | +149% | 37 |
| ETH-USD | +10.2% | +1.2% | +2.2% | +66% | 31 |
| SPY | +2.2% | +73.5% | -1.6% | +140% | 33 |
| QQQ | -5.8% | +96.8% | -3.2% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-08-11. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
