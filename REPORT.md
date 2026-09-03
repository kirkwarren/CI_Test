# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-03 · crypto through 2026-09-02 (completed UTC days), equities through 2026-09-02 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NVDA** | stock | 0.87 | +24.1% | +22.6% | 1.33 | +47% | -37% | +14.3% |
| 2 | **XLK** | etf | 0.86 | +43.9% | +31.3% | 1.10 | +25% | -26% | +14.8% |
| 3 | **JPM** | stock | 0.78 | +19.3% | +19.0% | 1.42 | +23% | -25% | +12.1% |
| 4 | **AAPL** | stock | 0.76 | +34.7% | +23.8% | 0.81 | +27% | -33% | +14.7% |
| 5 | **GOOGL** | stock | 0.73 | +78.7% | +11.2% | 1.15 | +31% | -30% | +0.5% |
| 6 | **EEM** | etf | 0.72 | +32.5% | +13.7% | 1.00 | +20% | -19% | +9.0% |
| 7 | **QQQ** | etf | 0.72 | +28.0% | +16.1% | 1.13 | +20% | -23% | +8.0% |
| 8 | **XLE** | etf | 0.69 | +29.3% | +15.9% | 0.66 | +22% | -22% | +19.1% |
| 9 | **SPY** | etf | 0.68 | +20.5% | +11.7% | 1.24 | +15% | -19% | +7.6% |
| 10 | **SOL-USD** | crypto | 0.66 | -64.9% | +15.4% | 1.07 | +83% | -76% | +22.4% |

Bottom of the screen: ADA-USD (0.12), AVAX-USD (0.10), BCH-USD (0.09), ATOM-USD (0.05), DOT-USD (0.03).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -80.9% | -78.4% | below 200d |
| AVAX-USD | -79.6% | -73.2% | below 200d |
| ADA-USD | -78.4% | -76.8% | below 200d |
| DOGE-USD | -71.8% | -67.4% | below 200d |
| ATOM-USD | -69.8% | -69.2% | below 200d |
| BCH-USD | -62.6% | -63.5% | below 200d |
| AAVE-USD | -61.2% | -70.8% | above 200d |
| LTC-USD | -60.6% | -60.4% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **7 of 38** assets — and 7 of those 7 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.7%** vs median buy-and-hold: **+54.2%**
- Median walk-forward degradation: **+131%** of the in-sample edge lost out-of-sample (over the 20 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.9%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.2%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 7/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NVDA | +8.6% | +362.2% | -0.6% | +111% | 32 |
| XLK | -4.9% | +107.7% | -4.6% | n/a | 20 |
| JPM | +2.5% | +145.3% | -3.0% | +181% | 28 |
| BTC-USD | +17.3% | +199.5% | +0.4% | +96% | 37 |
| ETH-USD | +12.6% | +46.7% | +1.7% | +37% | 30 |
| SPY | -0.6% | +70.3% | -1.0% | +128% | 21 |
| QQQ | -11.2% | +87.6% | -3.4% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-03. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
