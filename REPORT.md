# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-09-23 · crypto through 2026-09-22 (completed UTC days), equities through 2026-09-22 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

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
| 1 | **NEAR-USD** | crypto | 0.88 | -32.1% | +235.6% | 0.95 | +106% | -89% | +142.0% |
| 2 | **XLK** | etf | 0.84 | +31.4% | +43.3% | 1.28 | +25% | -26% | +20.4% |
| 3 | **UNI-USD** | crypto | 0.83 | -45.0% | +184.7% | 0.78 | +106% | -87% | +165.0% |
| 4 | **NVDA** | stock | 0.81 | +21.5% | +30.3% | 1.45 | +47% | -37% | +15.1% |
| 5 | **AAPL** | stock | 0.73 | +26.0% | +35.1% | 0.96 | +27% | -33% | +18.4% |
| 6 | **QQQ** | etf | 0.71 | +19.0% | +27.1% | 1.30 | +20% | -23% | +12.6% |
| 7 | **EEM** | etf | 0.67 | +26.6% | +20.6% | 1.09 | +20% | -19% | +10.6% |
| 8 | **SPY** | etf | 0.65 | +15.4% | +18.0% | 1.35 | +15% | -19% | +7.8% |
| 9 | **SOL-USD** | crypto | 0.64 | -56.7% | +29.7% | 1.14 | +84% | -76% | +41.0% |
| 10 | **BTC-USD** | crypto | 0.63 | -31.1% | +21.6% | 1.07 | +47% | -53% | +22.0% |

Bottom of the screen: VNQ (0.23), DOT-USD (0.20), TSLA (0.16), ATOM-USD (0.15), TLT (0.13).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -72.3% | -77.0% | above 200d |
| ADA-USD | -70.8% | -72.5% | above 200d |
| AVAX-USD | -66.4% | -77.6% | above 200d |
| DOGE-USD | -62.3% | -61.3% | above 200d |
| ATOM-USD | -57.3% | -61.6% | above 200d |
| AAVE-USD | -50.3% | -47.7% | above 200d |
| LTC-USD | -50.0% | -50.6% | above 200d |
| SOL-USD | -49.5% | -56.7% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **4 of 38** assets — and 4 of those 4 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+76.6%**
- Median walk-forward degradation: **+83%** of the in-sample edge lost out-of-sample (over the 23 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.3%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.1%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 4/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +302.2% | n/a | n/a | 4 |
| XLK | -5.7% | +138.0% | -0.7% | +151% | 20 |
| UNI-USD | +3.8% | +141.3% | n/a | n/a | 4 |
| BTC-USD | +10.9% | +228.4% | +6.1% | +43% | 21 |
| ETH-USD | +9.2% | +74.2% | +3.7% | +33% | 32 |
| SPY | -6.2% | +78.9% | +3.6% | -46% | 20 |
| QQQ | -11.2% | +107.9% | +1.2% | n/a | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-09-23. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
