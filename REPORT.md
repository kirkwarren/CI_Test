# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-02 · crypto through 2026-10-01 (completed UTC days), equities through 2026-10-01 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.014% over 720 overlapping days
- ETH-USD: median divergence 0.015% over 720 overlapping days
- SOL-USD: median divergence 0.015% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **NEAR-USD** | crypto | 0.90 | -33.5% | +304.1% | 0.98 | +107% | -89% | +142.8% |
| 2 | **XLK** | etf | 0.86 | +30.3% | +46.6% | 1.29 | +25% | -26% | +20.1% |
| 3 | **UNI-USD** | crypto | 0.81 | -27.7% | +151.8% | 0.73 | +106% | -87% | +119.2% |
| 4 | **NVDA** | stock | 0.80 | +16.5% | +31.4% | 1.41 | +47% | -37% | +15.2% |
| 5 | **QQQ** | etf | 0.73 | +17.9% | +27.0% | 1.28 | +20% | -23% | +11.1% |
| 6 | **AAPL** | stock | 0.70 | +27.7% | +29.2% | 0.94 | +27% | -33% | +14.4% |
| 7 | **SOL-USD** | crypto | 0.68 | -55.0% | +45.8% | 1.06 | +83% | -76% | +38.4% |
| 8 | **AAVE-USD** | crypto | 0.67 | -55.4% | +74.7% | 0.81 | +94% | -84% | +71.3% |
| 9 | **SPY** | etf | 0.65 | +14.4% | +16.6% | 1.35 | +15% | -19% | +6.1% |
| 10 | **GOOGL** | stock | 0.63 | +37.8% | +13.7% | 1.16 | +31% | -30% | -0.1% |

Bottom of the screen: DOT-USD (0.20), TSLA (0.14), BCH-USD (0.13), TLT (0.11), ATOM-USD (0.10).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -73.3% | -78.9% | above 200d |
| ADA-USD | -71.7% | -76.9% | above 200d |
| AVAX-USD | -65.0% | -76.5% | above 200d |
| DOGE-USD | -64.6% | -67.2% | above 200d |
| ATOM-USD | -60.5% | -64.7% | above 200d |
| BCH-USD | -52.7% | -58.5% | below 200d |
| XRP-USD | -50.9% | -54.2% | above 200d |
| SOL-USD | -49.6% | -55.0% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **6 of 38** assets — and 5 of those 6 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+70.1%**
- Median walk-forward degradation: **+92%** of the in-sample edge lost out-of-sample (over the 23 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.6%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **+0.4%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 6/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +338.3% | n/a | n/a | 4 |
| XLK | -5.6% | +138.8% | -0.9% | +132% | 20 |
| UNI-USD | +3.8% | +105.7% | n/a | n/a | 4 |
| BTC-USD | +14.3% | +209.3% | +6.1% | +53% | 27 |
| ETH-USD | +8.3% | +63.3% | +4.2% | +41% | 30 |
| SPY | -6.2% | +78.8% | +2.5% | n/a | 20 |
| QQQ | -5.7% | +105.4% | +0.6% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-02. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
