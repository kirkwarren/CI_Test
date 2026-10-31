# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-31 · crypto through 2026-10-30 (completed UTC days), equities through 2026-10-30 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.87 | +154.2% | +230.2% | 0.85 | +109% | -89% | +71.1% |
| 2 | **XOM** | stock | 0.85 | +40.7% | +22.6% | 0.94 | +23% | -21% | +21.1% |
| 3 | **AAPL** | stock | 0.83 | +22.5% | +23.0% | 1.01 | +27% | -33% | +16.2% |
| 4 | **XLV** | etf | 0.81 | +15.4% | +27.4% | 0.96 | +15% | -18% | +16.5% |
| 5 | **XLE** | etf | 0.80 | +42.5% | +19.0% | 0.87 | +22% | -22% | +19.2% |
| 6 | **XLK** | etf | 0.79 | +30.1% | +10.9% | 1.16 | +25% | -26% | +5.9% |
| 7 | **UNI-USD** | crypto | 0.77 | +51.9% | +123.9% | 0.63 | +107% | -87% | +52.1% |
| 8 | **JPM** | stock | 0.76 | +9.1% | +7.9% | 1.40 | +23% | -25% | +4.4% |
| 9 | **SPY** | etf | 0.73 | +11.1% | +4.9% | 1.38 | +15% | -19% | +3.7% |
| 10 | **QQQ** | etf | 0.70 | +16.7% | +2.4% | 1.21 | +21% | -23% | +1.6% |

Bottom of the screen: TLT (0.21), DOGE-USD (0.11), DOT-USD (0.09), ADA-USD (0.08), ATOM-USD (0.06).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -70.2% | -57.4% | below 200d |
| ADA-USD | -68.2% | -59.0% | below 200d |
| DOGE-USD | -59.5% | -48.3% | below 200d |
| BCH-USD | -55.1% | -43.4% | above 200d |
| AVAX-USD | -54.7% | -39.6% | above 200d |
| XRP-USD | -50.4% | -38.9% | below 200d |
| ATOM-USD | -50.3% | -41.0% | below 200d |
| LTC-USD | -49.3% | -28.0% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **7 of 38** assets — and 7 of those 7 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+65.4%**
- Median walk-forward degradation: **+88%** of the in-sample edge lost out-of-sample (over the 22 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.3%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.8%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 7/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +180.9% | n/a | n/a | 4 |
| XOM | -19.2% | +76.9% | +5.4% | -4% | 20 |
| AAPL | -13.6% | +101.8% | -1.4% | n/a | 20 |
| BTC-USD | +14.5% | +117.8% | +4.2% | +59% | 27 |
| ETH-USD | +12.1% | +21.3% | +3.7% | +42% | 30 |
| SPY | -6.2% | +80.7% | -2.7% | +296% | 20 |
| QQQ | -11.1% | +96.8% | -1.4% | +192% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-31. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
