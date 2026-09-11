# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-11 · crypto through 2026-09-10 (completed UTC days), equities through 2026-09-10 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.015% over 720 overlapping days
- ETH-USD: median divergence 0.015% over 720 overlapping days
- SOL-USD: median divergence 0.015% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **XLK** | etf | 0.87 | +40.3% | +31.9% | 1.14 | +25% | -26% | +15.0% |
| 2 | **JPM** | stock | 0.83 | +21.6% | +23.0% | 1.42 | +23% | -25% | +10.8% |
| 3 | **NVDA** | stock | 0.82 | +27.4% | +17.4% | 1.36 | +47% | -37% | +10.7% |
| 4 | **AAPL** | stock | 0.81 | +30.1% | +25.2% | 0.88 | +27% | -33% | +14.7% |
| 5 | **NEAR-USD** | crypto | 0.79 | -40.7% | +88.4% | 0.77 | +104% | -89% | +43.7% |
| 6 | **XLE** | etf | 0.72 | +39.1% | +14.0% | 0.66 | +22% | -22% | +17.8% |
| 7 | **XOM** | stock | 0.70 | +44.4% | +9.0% | 0.65 | +23% | -21% | +13.6% |
| 8 | **QQQ** | etf | 0.70 | +23.8% | +16.6% | 1.14 | +20% | -23% | +7.5% |
| 9 | **EEM** | etf | 0.69 | +27.8% | +13.9% | 1.00 | +20% | -19% | +8.1% |
| 10 | **SPY** | etf | 0.69 | +18.5% | +12.1% | 1.22 | +15% | -19% | +6.2% |

Bottom of the screen: TLT (0.16), ADA-USD (0.13), AVAX-USD (0.10), DOT-USD (0.10), BCH-USD (0.08).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| AVAX-USD | -78.9% | -78.6% | below 200d |
| ADA-USD | -78.0% | -78.9% | below 200d |
| DOT-USD | -75.8% | -81.3% | below 200d |
| DOGE-USD | -71.4% | -70.7% | below 200d |
| BCH-USD | -65.7% | -63.2% | below 200d |
| ATOM-USD | -62.9% | -69.4% | above 200d |
| AAVE-USD | -62.5% | -70.6% | above 200d |
| SOL-USD | -60.2% | -66.0% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **7 of 38** assets — and 7 of those 7 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.0%** vs median buy-and-hold: **+54.5%**
- Median walk-forward degradation: **+94%** of the in-sample edge lost out-of-sample (over the 23 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+3.1%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.7%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 7/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| XLK | -0.2% | +113.3% | -3.4% | n/a | 21 |
| JPM | +2.2% | +144.7% | -0.7% | +115% | 28 |
| NVDA | +8.1% | +383.3% | +0.7% | +90% | 32 |
| BTC-USD | +10.6% | +196.2% | +2.3% | +73% | 27 |
| ETH-USD | +13.2% | +53.0% | +5.3% | +12% | 30 |
| SPY | -0.6% | +69.0% | +0.7% | +87% | 21 |
| QQQ | -11.2% | +88.0% | -1.7% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-11. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
