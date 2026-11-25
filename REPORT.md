# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-11-25 · crypto through 2026-11-24 (completed UTC days), equities through 2026-11-24 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **AAPL** | stock | 0.92 | +26.7% | +13.9% | 0.91 | +27% | -33% | +16.5% |
| 2 | **XLV** | etf | 0.87 | +16.0% | +24.1% | 0.84 | +15% | -18% | +14.6% |
| 3 | **XLF** | etf | 0.86 | +8.4% | +9.1% | 1.03 | +16% | -16% | +3.8% |
| 4 | **NEAR-USD** | crypto | 0.85 | +140.6% | +4.2% | 0.67 | +108% | -89% | +4.3% |
| 5 | **JPM** | stock | 0.83 | +12.1% | +6.0% | 1.15 | +24% | -25% | -2.5% |
| 6 | **SPY** | etf | 0.79 | +16.1% | -4.2% | 1.04 | +16% | -19% | -1.9% |
| 7 | **XOM** | stock | 0.78 | +57.6% | +7.0% | 0.71 | +24% | -21% | +0.8% |
| 8 | **XLE** | etf | 0.77 | +55.8% | +6.1% | 0.65 | +22% | -22% | +1.1% |
| 9 | **AMZN** | stock | 0.72 | +12.9% | -7.2% | 0.71 | +32% | -31% | +2.7% |
| 10 | **MSFT** | stock | 0.72 | +12.8% | +20.2% | 0.47 | +27% | -35% | +11.6% |

Bottom of the screen: BCH-USD (0.16), ADA-USD (0.10), DOGE-USD (0.10), ATOM-USD (0.08), DOT-USD (0.01).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -72.4% | -56.1% | below 200d |
| BCH-USD | -69.8% | -49.2% | below 200d |
| ADA-USD | -69.3% | -52.3% | below 200d |
| DOGE-USD | -64.3% | -49.4% | below 200d |
| XRP-USD | -60.6% | -41.9% | below 200d |
| AVAX-USD | -56.3% | -35.8% | below 200d |
| UNI-USD | -53.9% | +9.8% | below 200d |
| AAVE-USD | -53.6% | -23.6% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **12 of 38** assets — and 12 of those 12 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+42.3%**
- Median walk-forward degradation: **+67%** of the in-sample edge lost out-of-sample (over the 25 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 32 assets: **+2.0%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.0%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 12/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| AAPL | -13.6% | +86.6% | -1.1% | +171% | 20 |
| XLV | +9.4% | +41.8% | -2.7% | n/a | 20 |
| XLF | -0.2% | +59.1% | +0.9% | -18% | 21 |
| BTC-USD | +1.6% | +59.5% | +3.9% | +21% | 21 |
| ETH-USD | +0.7% | -18.7% | +3.5% | -327% | 30 |
| SPY | -2.2% | +58.2% | -3.6% | +240% | 24 |
| QQQ | -5.6% | +64.0% | +1.0% | +67% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-11-25. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
