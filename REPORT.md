# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-24 · crypto through 2026-10-23 (completed UTC days), equities through 2026-10-23 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.93 | +96.6% | +232.8% | 0.96 | +109% | -89% | +95.4% |
| 2 | **AAPL** | stock | 0.82 | +30.0% | +28.3% | 1.00 | +27% | -33% | +18.1% |
| 3 | **XOM** | stock | 0.80 | +41.3% | +23.0% | 0.87 | +23% | -21% | +19.6% |
| 4 | **UNI-USD** | crypto | 0.78 | +46.2% | +111.2% | 0.67 | +107% | -87% | +52.7% |
| 5 | **XLK** | etf | 0.77 | +36.4% | +14.4% | 1.18 | +25% | -26% | +8.7% |
| 6 | **XLE** | etf | 0.76 | +42.6% | +21.9% | 0.82 | +22% | -22% | +19.2% |
| 7 | **NVDA** | stock | 0.74 | +24.6% | +1.3% | 1.36 | +47% | -37% | +3.6% |
| 8 | **SPY** | etf | 0.74 | +14.9% | +6.4% | 1.36 | +15% | -19% | +4.5% |
| 9 | **QQQ** | etf | 0.73 | +22.4% | +6.1% | 1.20 | +21% | -23% | +4.0% |
| 10 | **JPM** | stock | 0.70 | +15.1% | +7.6% | 1.35 | +23% | -25% | +2.8% |

Bottom of the screen: ADA-USD (0.15), BCH-USD (0.15), TLT (0.15), ATOM-USD (0.14), DOGE-USD (0.12).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -69.1% | -62.9% | below 200d |
| DOT-USD | -66.8% | -63.3% | above 200d |
| DOGE-USD | -61.9% | -52.5% | below 200d |
| BCH-USD | -56.9% | -29.8% | below 200d |
| AVAX-USD | -56.6% | -46.4% | above 200d |
| XRP-USD | -51.1% | -37.3% | above 200d |
| SOL-USD | -48.7% | -39.9% | above 200d |
| LTC-USD | -48.1% | -34.3% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **6 of 38** assets — and 6 of those 6 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+66.8%**
- Median walk-forward degradation: **+114%** of the in-sample edge lost out-of-sample (over the 26 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.1%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.7%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 6/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +309.6% | n/a | n/a | 4 |
| AAPL | -13.6% | +100.5% | -2.5% | n/a | 20 |
| XOM | -19.2% | +69.0% | +5.1% | -2% | 20 |
| BTC-USD | +16.3% | +135.0% | +2.8% | +73% | 27 |
| ETH-USD | +11.1% | +33.4% | +3.7% | +44% | 30 |
| SPY | -6.2% | +79.4% | -1.1% | n/a | 20 |
| QQQ | -5.7% | +96.1% | -1.0% | +146% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-24. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
