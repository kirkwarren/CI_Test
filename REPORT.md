# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-08 · crypto through 2026-10-07 (completed UTC days), equities through 2026-10-07 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.014% over 720 overlapping days
- ETH-USD: median divergence 0.014% over 720 overlapping days
- SOL-USD: median divergence 0.015% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **NEAR-USD** | crypto | 0.93 | -21.8% | +307.0% | 1.03 | +107% | -89% | +154.9% |
| 2 | **XLK** | etf | 0.87 | +30.6% | +42.1% | 1.29 | +25% | -26% | +21.4% |
| 3 | **NVDA** | stock | 0.86 | +21.7% | +30.4% | 1.42 | +47% | -37% | +17.7% |
| 4 | **UNI-USD** | crypto | 0.81 | -11.8% | +141.0% | 0.71 | +106% | -87% | +86.3% |
| 5 | **QQQ** | etf | 0.77 | +18.2% | +25.0% | 1.30 | +20% | -23% | +12.9% |
| 6 | **AAPL** | stock | 0.72 | +23.2% | +30.0% | 0.92 | +27% | -33% | +16.1% |
| 7 | **AAVE-USD** | crypto | 0.70 | -52.3% | +81.7% | 0.82 | +94% | -84% | +70.7% |
| 8 | **SPY** | etf | 0.68 | +14.0% | +15.0% | 1.36 | +15% | -19% | +7.6% |
| 9 | **MSFT** | stock | 0.67 | -6.5% | +41.5% | 0.74 | +26% | -35% | +22.2% |
| 10 | **SOL-USD** | crypto | 0.67 | -52.8% | +35.9% | 1.08 | +83% | -76% | +34.5% |

Bottom of the screen: VNQ (0.21), DOT-USD (0.14), BCH-USD (0.13), ATOM-USD (0.12), TLT (0.11).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -73.4% | -74.3% | above 200d |
| ADA-USD | -69.6% | -73.1% | above 200d |
| DOGE-USD | -65.2% | -63.4% | above 200d |
| AVAX-USD | -61.4% | -71.1% | above 200d |
| ATOM-USD | -58.7% | -59.8% | above 200d |
| BCH-USD | -54.1% | -55.1% | below 200d |
| XRP-USD | -50.7% | -51.1% | above 200d |
| SOL-USD | -49.3% | -52.8% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **5 of 38** assets — and 4 of those 5 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.0%** vs median buy-and-hold: **+70.9%**
- Median walk-forward degradation: **+89%** of the in-sample edge lost out-of-sample (over the 25 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.3%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **+0.2%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 5/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +413.1% | n/a | n/a | 4 |
| XLK | -5.7% | +138.2% | +0.6% | +33% | 20 |
| NVDA | +3.8% | +424.5% | -1.5% | +269% | 29 |
| BTC-USD | +17.3% | +201.8% | +5.9% | +44% | 27 |
| ETH-USD | +6.9% | +62.8% | +3.3% | +52% | 31 |
| SPY | -6.2% | +79.8% | +1.7% | +37% | 20 |
| QQQ | -11.2% | +106.7% | +1.2% | +16% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-08. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
