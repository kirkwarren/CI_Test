# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-04 · crypto through 2026-10-03 (completed UTC days), equities through 2026-10-02 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.014% over 720 overlapping days
- ETH-USD: median divergence 0.015% over 720 overlapping days
- SOL-USD: median divergence 0.015% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **NEAR-USD** | crypto | 0.90 | -35.6% | +300.0% | 0.99 | +107% | -89% | +139.8% |
| 2 | **XLK** | etf | 0.86 | +29.0% | +46.9% | 1.31 | +25% | -26% | +21.1% |
| 3 | **NVDA** | stock | 0.84 | +19.9% | +31.9% | 1.43 | +47% | -37% | +16.6% |
| 4 | **UNI-USD** | crypto | 0.81 | -22.7% | +185.5% | 0.74 | +106% | -87% | +118.3% |
| 5 | **QQQ** | etf | 0.74 | +17.6% | +28.1% | 1.31 | +20% | -23% | +12.1% |
| 6 | **AAVE-USD** | crypto | 0.72 | -54.3% | +91.6% | 0.82 | +94% | -84% | +80.4% |
| 7 | **AAPL** | stock | 0.71 | +27.2% | +30.4% | 0.95 | +27% | -33% | +15.4% |
| 8 | **SOL-USD** | crypto | 0.68 | -55.4% | +48.8% | 1.08 | +83% | -76% | +39.4% |
| 9 | **SPY** | etf | 0.65 | +14.5% | +17.4% | 1.38 | +15% | -19% | +6.8% |
| 10 | **EEM** | etf | 0.64 | +24.8% | +19.6% | 1.10 | +20% | -19% | +7.4% |

Bottom of the screen: DOT-USD (0.21), BCH-USD (0.17), TSLA (0.17), TLT (0.10), ATOM-USD (0.08).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -73.1% | -79.5% | above 200d |
| ADA-USD | -72.0% | -74.5% | above 200d |
| DOGE-USD | -65.1% | -66.0% | above 200d |
| AVAX-USD | -63.7% | -76.0% | above 200d |
| ATOM-USD | -59.8% | -64.8% | above 200d |
| BCH-USD | -51.1% | -57.9% | above 200d |
| XRP-USD | -50.3% | -52.3% | above 200d |
| SOL-USD | -48.6% | -55.4% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **6 of 38** assets — and 5 of those 6 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.7%** vs median buy-and-hold: **+74.0%**
- Median walk-forward degradation: **+106%** of the in-sample edge lost out-of-sample (over the 26 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.6%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-0.5%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 6/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +350.3% | n/a | n/a | 4 |
| XLK | -5.6% | +142.3% | -1.3% | +233% | 20 |
| NVDA | +3.6% | +431.2% | -0.8% | +122% | 29 |
| BTC-USD | +18.0% | +209.1% | +6.6% | +51% | 27 |
| ETH-USD | +8.1% | +66.7% | +4.2% | +42% | 30 |
| SPY | -6.2% | +81.2% | -0.2% | +107% | 20 |
| QQQ | -5.7% | +108.4% | -0.5% | +151% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-04. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
