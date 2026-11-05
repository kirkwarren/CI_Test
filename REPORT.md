# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-11-05 · crypto through 2026-11-04 (completed UTC days), equities through 2026-11-04 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.86 | +188.9% | +208.8% | 0.82 | +109% | -89% | +55.6% |
| 2 | **XLV** | etf | 0.84 | +15.7% | +30.4% | 0.95 | +15% | -18% | +19.2% |
| 3 | **AAPL** | stock | 0.83 | +24.0% | +21.6% | 0.97 | +27% | -33% | +17.3% |
| 4 | **UNI-USD** | crypto | 0.81 | +79.1% | +127.0% | 0.63 | +107% | -87% | +59.0% |
| 5 | **JPM** | stock | 0.78 | +7.1% | +11.8% | 1.41 | +23% | -25% | +8.9% |
| 6 | **XLF** | etf | 0.77 | +3.6% | +14.2% | 1.26 | +16% | -16% | +10.1% |
| 7 | **MSFT** | stock | 0.74 | +2.4% | +34.3% | 0.69 | +26% | -35% | +26.6% |
| 8 | **XOM** | stock | 0.72 | +44.6% | +13.8% | 0.79 | +23% | -21% | +9.0% |
| 9 | **SPY** | etf | 0.71 | +14.0% | +4.5% | 1.32 | +15% | -19% | +5.1% |
| 10 | **XLK** | etf | 0.71 | +33.8% | +3.8% | 1.07 | +25% | -26% | +3.8% |

Bottom of the screen: TLT (0.16), ADA-USD (0.13), DOGE-USD (0.10), DOT-USD (0.05), ATOM-USD (0.05).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -70.8% | -51.0% | below 200d |
| ADA-USD | -66.7% | -48.1% | below 200d |
| DOGE-USD | -57.6% | -41.2% | below 200d |
| BCH-USD | -57.0% | -34.0% | above 200d |
| ATOM-USD | -52.6% | -27.8% | below 200d |
| AVAX-USD | -52.0% | -30.4% | above 200d |
| LTC-USD | -49.0% | -17.7% | above 200d |
| XRP-USD | -48.4% | -31.6% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **8 of 38** assets — and 7 of those 8 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.0%** vs median buy-and-hold: **+57.4%**
- Median walk-forward degradation: **+84%** of the in-sample edge lost out-of-sample (over the 24 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 32 assets: **+1.9%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **+0.3%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 8/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +152.8% | n/a | n/a | 4 |
| XLV | -2.5% | +47.9% | -1.4% | n/a | 20 |
| AAPL | -13.6% | +95.0% | -0.7% | +196% | 20 |
| BTC-USD | +8.9% | +129.4% | +5.3% | +37% | 24 |
| ETH-USD | +9.8% | +27.4% | +3.6% | +34% | 30 |
| SPY | -6.2% | +76.0% | -1.2% | +159% | 20 |
| QQQ | -5.7% | +87.4% | +1.5% | +26% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-11-05. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
