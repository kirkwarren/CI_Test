# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-19 · crypto through 2026-10-18 (completed UTC days), equities through 2026-10-16 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.014% over 720 overlapping days
- ETH-USD: median divergence 0.014% over 720 overlapping days
- SOL-USD: median divergence 0.014% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **NEAR-USD** | crypto | 0.93 | +73.6% | +272.3% | 1.02 | +109% | -89% | +117.3% |
| 2 | **UNI-USD** | crypto | 0.79 | +47.0% | +114.5% | 0.69 | +107% | -87% | +61.3% |
| 3 | **AAPL** | stock | 0.78 | +35.2% | +27.1% | 0.97 | +27% | -33% | +17.4% |
| 4 | **NVDA** | stock | 0.76 | +22.0% | +6.2% | 1.40 | +47% | -37% | +5.5% |
| 5 | **XLK** | etf | 0.76 | +32.3% | +18.9% | 1.18 | +25% | -26% | +9.5% |
| 6 | **XOM** | stock | 0.72 | +46.3% | +22.2% | 0.78 | +23% | -21% | +18.0% |
| 7 | **JPM** | stock | 0.71 | +14.3% | +9.5% | 1.35 | +23% | -25% | +5.4% |
| 8 | **QQQ** | etf | 0.71 | +19.0% | +9.4% | 1.22 | +20% | -23% | +5.2% |
| 9 | **XLE** | etf | 0.71 | +49.4% | +24.0% | 0.72 | +22% | -22% | +18.4% |
| 10 | **SPY** | etf | 0.69 | +14.6% | +7.5% | 1.36 | +15% | -19% | +5.3% |

Bottom of the screen: ADA-USD (0.19), TLT (0.17), ATOM-USD (0.13), DOGE-USD (0.12), BCH-USD (0.09).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| ADA-USD | -67.6% | -64.6% | above 200d |
| DOT-USD | -65.8% | -61.3% | above 200d |
| DOGE-USD | -61.4% | -53.9% | below 200d |
| BCH-USD | -57.8% | -45.5% | below 200d |
| AVAX-USD | -53.1% | -59.4% | above 200d |
| XRP-USD | -50.7% | -40.9% | above 200d |
| ATOM-USD | -48.4% | -46.0% | below 200d |
| SOL-USD | -48.0% | -39.9% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **5 of 38** assets — and 5 of those 5 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.0%** vs median buy-and-hold: **+63.2%**
- Median walk-forward degradation: **+100%** of the in-sample edge lost out-of-sample (over the 25 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.0%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.4%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 5/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +397.9% | n/a | n/a | 4 |
| UNI-USD | +3.8% | +79.6% | n/a | n/a | 4 |
| AAPL | -13.6% | +95.7% | -0.7% | n/a | 20 |
| BTC-USD | +16.8% | +176.3% | +5.0% | +52% | 27 |
| ETH-USD | +11.1% | +50.0% | +2.8% | +51% | 30 |
| SPY | -6.2% | +79.0% | -2.6% | n/a | 20 |
| QQQ | -5.7% | +97.2% | -0.8% | +142% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-19. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
