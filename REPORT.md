# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-12 · crypto through 2026-10-11 (completed UTC days), equities through 2026-10-09 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.94 | +2.6% | +319.6% | 1.07 | +108% | -89% | +171.7% |
| 2 | **XLK** | etf | 0.86 | +27.4% | +39.4% | 1.25 | +25% | -26% | +19.5% |
| 3 | **UNI-USD** | crypto | 0.81 | +2.5% | +146.2% | 0.71 | +106% | -87% | +79.4% |
| 4 | **NVDA** | stock | 0.77 | +15.5% | +21.6% | 1.37 | +47% | -37% | +13.4% |
| 5 | **AAVE-USD** | crypto | 0.73 | -46.7% | +81.1% | 0.81 | +94% | -84% | +66.2% |
| 6 | **QQQ** | etf | 0.73 | +15.9% | +22.9% | 1.27 | +20% | -23% | +11.8% |
| 7 | **AAPL** | stock | 0.72 | +26.5% | +29.2% | 0.91 | +27% | -33% | +15.8% |
| 8 | **MSFT** | stock | 0.67 | -6.2% | +44.3% | 0.74 | +26% | -35% | +23.3% |
| 9 | **GOOGL** | stock | 0.65 | +36.0% | +10.8% | 1.17 | +31% | -30% | +3.4% |
| 10 | **SOL-USD** | crypto | 0.65 | -42.4% | +30.9% | 1.06 | +83% | -76% | +28.1% |

Bottom of the screen: TSLA (0.22), VNQ (0.21), DOGE-USD (0.17), BCH-USD (0.10), TLT (0.08).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -65.4% | -67.4% | above 200d |
| DOT-USD | -62.9% | -65.4% | above 200d |
| DOGE-USD | -59.5% | -54.6% | below 200d |
| BCH-USD | -56.3% | -54.4% | below 200d |
| AVAX-USD | -54.0% | -65.3% | above 200d |
| ATOM-USD | -47.4% | -47.8% | above 200d |
| SOL-USD | -46.8% | -42.4% | above 200d |
| XRP-USD | -46.8% | -43.1% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **4 of 38** assets — and 3 of those 4 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.0%** vs median buy-and-hold: **+70.5%**
- Median walk-forward degradation: **+84%** of the in-sample edge lost out-of-sample (over the 25 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.2%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **+0.2%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 4/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +485.1% | n/a | n/a | 4 |
| XLK | -5.6% | +132.4% | +1.0% | n/a | 20 |
| UNI-USD | +3.8% | +92.7% | n/a | n/a | 4 |
| BTC-USD | +17.5% | +211.5% | +7.9% | +28% | 27 |
| ETH-USD | +6.9% | +63.3% | +3.5% | +47% | 31 |
| SPY | -6.2% | +79.5% | +0.9% | +15% | 20 |
| QQQ | -5.7% | +103.1% | +1.4% | +15% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-12. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
