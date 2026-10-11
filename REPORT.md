# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-11 · crypto through 2026-10-10 (completed UTC days), equities through 2026-10-09 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.93 | +2.2% | +289.1% | 1.04 | +108% | -89% | +146.6% |
| 2 | **XLK** | etf | 0.86 | +27.4% | +39.4% | 1.25 | +25% | -26% | +19.5% |
| 3 | **UNI-USD** | crypto | 0.81 | +1.3% | +139.5% | 0.70 | +106% | -87% | +76.2% |
| 4 | **NVDA** | stock | 0.77 | +15.5% | +21.6% | 1.37 | +47% | -37% | +13.4% |
| 5 | **AAPL** | stock | 0.74 | +26.5% | +29.2% | 0.92 | +27% | -33% | +15.8% |
| 6 | **QQQ** | etf | 0.73 | +15.9% | +22.9% | 1.26 | +20% | -23% | +11.8% |
| 7 | **AAVE-USD** | crypto | 0.72 | -47.2% | +79.7% | 0.81 | +94% | -84% | +63.7% |
| 8 | **MSFT** | stock | 0.68 | -6.2% | +44.3% | 0.74 | +26% | -35% | +23.3% |
| 9 | **SOL-USD** | crypto | 0.67 | -47.8% | +29.6% | 1.07 | +83% | -76% | +26.8% |
| 10 | **GOOGL** | stock | 0.65 | +36.0% | +10.8% | 1.16 | +31% | -30% | +3.4% |

Bottom of the screen: TSLA (0.23), VNQ (0.21), DOGE-USD (0.16), BCH-USD (0.10), TLT (0.09).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -65.9% | -68.9% | above 200d |
| DOT-USD | -62.8% | -65.0% | above 200d |
| DOGE-USD | -59.9% | -57.9% | below 200d |
| BCH-USD | -57.2% | -56.4% | below 200d |
| AVAX-USD | -56.5% | -64.2% | above 200d |
| SOL-USD | -47.3% | -47.8% | above 200d |
| XRP-USD | -47.0% | -43.8% | above 200d |
| ATOM-USD | -46.5% | -44.8% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **5 of 38** assets — and 4 of those 5 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.0%** vs median buy-and-hold: **+69.0%**
- Median walk-forward degradation: **+92%** of the in-sample edge lost out-of-sample (over the 24 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.4%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.0%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 5/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +423.4% | n/a | n/a | 4 |
| XLK | -5.6% | +132.6% | +0.1% | +90% | 20 |
| UNI-USD | +3.8% | +89.4% | n/a | n/a | 4 |
| BTC-USD | +17.2% | +209.9% | +6.3% | +43% | 27 |
| ETH-USD | +6.9% | +62.7% | +3.4% | +48% | 31 |
| SPY | -6.2% | +78.4% | +1.4% | +32% | 20 |
| QQQ | -5.7% | +102.4% | +1.3% | -57% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-11. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
