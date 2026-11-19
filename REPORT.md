# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-11-19 · crypto through 2026-11-18 (completed UTC days), equities through 2026-11-18 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.013% over 720 overlapping days
- ETH-USD: median divergence 0.013% over 720 overlapping days
- SOL-USD: median divergence 0.014% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **AAPL** | stock | 0.89 | +26.9% | +16.6% | 0.89 | +27% | -33% | +16.5% |
| 2 | **NEAR-USD** | crypto | 0.87 | +115.3% | +106.0% | 0.68 | +108% | -89% | +21.3% |
| 3 | **XLV** | etf | 0.85 | +18.5% | +23.1% | 0.82 | +15% | -18% | +12.8% |
| 4 | **XLF** | etf | 0.85 | +8.3% | +9.2% | 1.06 | +16% | -16% | +4.5% |
| 5 | **JPM** | stock | 0.81 | +11.6% | +7.3% | 1.19 | +23% | -25% | -0.3% |
| 6 | **XOM** | stock | 0.78 | +51.1% | +2.8% | 0.73 | +24% | -21% | +2.5% |
| 7 | **SPY** | etf | 0.77 | +15.5% | -1.5% | 1.10 | +16% | -19% | -0.3% |
| 8 | **XLE** | etf | 0.77 | +50.5% | +2.5% | 0.67 | +22% | -22% | +2.7% |
| 9 | **AMZN** | stock | 0.75 | +12.8% | +1.0% | 0.79 | +32% | -31% | +9.3% |
| 10 | **UNI-USD** | crypto | 0.73 | -2.5% | +50.4% | 0.51 | +107% | -87% | +3.8% |

Bottom of the screen: BCH-USD (0.17), ATOM-USD (0.10), ADA-USD (0.09), DOGE-USD (0.09), DOT-USD (0.02).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -73.3% | -58.2% | below 200d |
| BCH-USD | -68.1% | -46.4% | below 200d |
| ADA-USD | -67.8% | -54.1% | below 200d |
| DOGE-USD | -62.0% | -50.7% | below 200d |
| XRP-USD | -58.8% | -41.2% | below 200d |
| AVAX-USD | -53.3% | -34.2% | below 200d |
| LTC-USD | -52.6% | -37.6% | below 200d |
| ATOM-USD | -52.5% | -36.7% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 10 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+42.5%**
- Median walk-forward degradation: **+80%** of the in-sample edge lost out-of-sample (over the 23 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 31 assets: **+2.3%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.4%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| AAPL | -13.6% | +84.1% | +0.4% | +80% | 20 |
| NEAR-USD | -2.2% | +65.2% | n/a | n/a | 4 |
| XLV | +8.3% | +40.4% | -0.4% | n/a | 20 |
| BTC-USD | +1.6% | +68.1% | +5.1% | +25% | 21 |
| ETH-USD | +0.7% | -12.3% | +2.7% | n/a | 29 |
| SPY | -2.2% | +60.7% | -0.7% | +137% | 24 |
| QQQ | -5.6% | +68.8% | +0.3% | +80% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-11-19. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
