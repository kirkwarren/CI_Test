# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-10-07 · crypto through 2026-10-06 (completed UTC days), equities through 2026-10-06 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.014% over 720 overlapping days
- ETH-USD: median divergence 0.014% over 720 overlapping days
- SOL-USD: median divergence 0.015% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **NEAR-USD** | crypto | 0.91 | -20.1% | +306.0% | 1.00 | +107% | -89% | +144.6% |
| 2 | **NVDA** | stock | 0.86 | +22.8% | +34.3% | 1.43 | +47% | -37% | +18.8% |
| 3 | **XLK** | etf | 0.85 | +31.6% | +47.0% | 1.29 | +25% | -26% | +22.0% |
| 4 | **UNI-USD** | crypto | 0.81 | -12.6% | +176.5% | 0.72 | +106% | -87% | +102.6% |
| 5 | **QQQ** | etf | 0.76 | +19.2% | +29.1% | 1.30 | +20% | -23% | +13.4% |
| 6 | **AAVE-USD** | crypto | 0.73 | -54.0% | +93.2% | 0.82 | +94% | -84% | +76.7% |
| 7 | **AAPL** | stock | 0.69 | +24.0% | +31.6% | 0.91 | +27% | -33% | +15.1% |
| 8 | **SOL-USD** | crypto | 0.68 | -54.2% | +50.8% | 1.07 | +83% | -76% | +39.9% |
| 9 | **SPY** | etf | 0.68 | +15.1% | +18.2% | 1.37 | +15% | -19% | +8.0% |
| 10 | **EEM** | etf | 0.66 | +26.7% | +19.1% | 1.10 | +20% | -19% | +8.1% |

Bottom of the screen: TSLA (0.21), VNQ (0.20), BCH-USD (0.14), ATOM-USD (0.14), TLT (0.07).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -71.4% | -77.8% | above 200d |
| ADA-USD | -68.1% | -74.4% | above 200d |
| DOGE-USD | -63.4% | -65.8% | above 200d |
| AVAX-USD | -59.7% | -74.2% | above 200d |
| ATOM-USD | -57.3% | -62.7% | above 200d |
| BCH-USD | -52.3% | -56.4% | above 200d |
| XRP-USD | -48.0% | -52.4% | above 200d |
| SOL-USD | -47.3% | -54.2% | above 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **5 of 38** assets — and 4 of those 5 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-1.0%** vs median buy-and-hold: **+72.7%**
- Median walk-forward degradation: **+84%** of the in-sample edge lost out-of-sample (over the 25 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 33 assets: **+2.3%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **+0.2%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 5/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| NEAR-USD | -2.2% | +363.2% | n/a | n/a | 4 |
| NVDA | +3.8% | +428.4% | -1.5% | +269% | 29 |
| XLK | -5.7% | +138.9% | +0.6% | +33% | 20 |
| BTC-USD | +18.4% | +206.2% | +8.3% | +26% | 27 |
| ETH-USD | +8.2% | +65.1% | +4.0% | +42% | 30 |
| SPY | -6.2% | +80.2% | +1.7% | +37% | 20 |
| QQQ | -11.2% | +107.2% | +1.2% | +16% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-10-07. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
