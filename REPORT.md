# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-11-03 · crypto through 2026-11-02 (completed UTC days), equities through 2026-11-02 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.014% over 720 overlapping days
- ETH-USD: median divergence 0.013% over 720 overlapping days
- SOL-USD: median divergence 0.014% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **NEAR-USD** | crypto | 0.89 | +120.7% | +203.1% | 0.82 | +109% | -89% | +51.5% |
| 2 | **XLV** | etf | 0.84 | +15.2% | +27.5% | 0.91 | +15% | -18% | +16.2% |
| 3 | **AAPL** | stock | 0.83 | +23.0% | +22.2% | 0.95 | +27% | -33% | +13.9% |
| 4 | **JPM** | stock | 0.82 | +7.4% | +10.7% | 1.38 | +23% | -25% | +5.4% |
| 5 | **XOM** | stock | 0.82 | +43.0% | +16.9% | 0.85 | +23% | -21% | +16.0% |
| 6 | **UNI-USD** | crypto | 0.79 | +54.5% | +119.6% | 0.63 | +107% | -87% | +49.2% |
| 7 | **XLE** | etf | 0.76 | +43.6% | +13.2% | 0.79 | +22% | -22% | +14.3% |
| 8 | **SPY** | etf | 0.75 | +13.2% | +4.7% | 1.29 | +15% | -19% | +3.1% |
| 9 | **XLF** | etf | 0.74 | +2.4% | +11.6% | 1.20 | +16% | -16% | +7.1% |
| 10 | **XLK** | etf | 0.72 | +33.0% | +7.5% | 1.06 | +26% | -26% | +2.7% |

Bottom of the screen: TLT (0.21), DOGE-USD (0.12), ADA-USD (0.09), DOT-USD (0.07), ATOM-USD (0.05).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -71.3% | -60.3% | below 200d |
| ADA-USD | -68.2% | -60.1% | below 200d |
| DOGE-USD | -59.2% | -50.2% | below 200d |
| BCH-USD | -57.8% | -40.4% | below 200d |
| ATOM-USD | -54.0% | -43.7% | below 200d |
| AVAX-USD | -53.9% | -40.9% | above 200d |
| LTC-USD | -51.4% | -29.3% | above 200d |
| XRP-USD | -50.6% | -41.2% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **8 of 38** assets — and 7 of those 8 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+57.0%**
- Median walk-forward degradation: **+83%** of the in-sample edge lost out-of-sample (over the 21 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 32 assets: **+2.0%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.4%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 8/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +155.0% | n/a | n/a | 4 |
| XLV | -2.5% | +44.9% | -0.5% | n/a | 20 |
| AAPL | -13.6% | +91.5% | -1.2% | n/a | 20 |
| BTC-USD | +14.3% | +118.5% | +6.5% | +28% | 27 |
| ETH-USD | +11.9% | +21.1% | +3.5% | +41% | 30 |
| SPY | -6.2% | +73.0% | -3.9% | +384% | 20 |
| QQQ | -5.7% | +85.2% | -0.5% | +153% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-11-03. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
