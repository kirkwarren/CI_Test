# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-13 · crypto through 2026-10-12 (completed UTC days), equities through 2026-10-12 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.93 | -3.7% | +277.8% | 1.03 | +108% | -89% | +132.5% |
| 2 | **XLK** | etf | 0.87 | +29.3% | +34.9% | 1.26 | +25% | -26% | +17.8% |
| 3 | **UNI-USD** | crypto | 0.78 | -3.8% | +130.8% | 0.67 | +106% | -87% | +60.4% |
| 4 | **NVDA** | stock | 0.77 | +13.4% | +19.5% | 1.39 | +47% | -37% | +11.9% |
| 5 | **QQQ** | etf | 0.77 | +17.1% | +20.8% | 1.28 | +20% | -23% | +10.9% |
| 6 | **AAPL** | stock | 0.75 | +30.8% | +31.5% | 0.94 | +27% | -33% | +17.1% |
| 7 | **MSFT** | stock | 0.72 | -5.1% | +40.8% | 0.77 | +26% | -35% | +24.6% |
| 8 | **AAVE-USD** | crypto | 0.70 | -50.0% | +74.3% | 0.78 | +94% | -84% | +51.5% |
| 9 | **SPY** | etf | 0.70 | +13.9% | +13.4% | 1.37 | +15% | -19% | +7.6% |
| 10 | **XLE** | etf | 0.66 | +48.5% | +15.6% | 0.71 | +22% | -22% | +15.5% |

Bottom of the screen: VNQ (0.23), ATOM-USD (0.19), DOGE-USD (0.15), TLT (0.10), BCH-USD (0.07).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -68.1% | -70.4% | above 200d |
| DOT-USD | -65.4% | -68.6% | above 200d |
| DOGE-USD | -61.6% | -59.1% | below 200d |
| BCH-USD | -59.4% | -58.1% | below 200d |
| AVAX-USD | -57.5% | -67.2% | above 200d |
| ATOM-USD | -50.4% | -54.0% | above 200d |
| SOL-USD | -49.4% | -48.4% | above 200d |
| XRP-USD | -49.3% | -46.0% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **6 of 38** assets — and 6 of those 6 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.0%** vs median buy-and-hold: **+68.1%**
- Median walk-forward degradation: **+92%** of the in-sample edge lost out-of-sample (over the 24 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.3%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **+0.0%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 6/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +402.5% | n/a | n/a | 4 |
| XLK | -5.6% | +132.9% | +1.5% | n/a | 20 |
| UNI-USD | +3.8% | +70.3% | n/a | n/a | 4 |
| BTC-USD | +16.6% | +204.4% | +7.8% | +28% | 27 |
| ETH-USD | +6.9% | +57.2% | +3.4% | +48% | 31 |
| SPY | -6.2% | +80.3% | +1.0% | -67% | 20 |
| QQQ | -11.1% | +104.2% | +1.8% | -59% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-13. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
