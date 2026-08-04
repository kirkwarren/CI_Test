# Real-Data Quant Screen & Strategy Analysis

*Generated 2026-08-04 · crypto through 2026-08-03 (completed UTC days), equities through 2026-08-03 (last close) · 38 assets (16 crypto via Coinbase, 22 equities/ETFs via Nasdaq)*

> **This report describes the past.** Every number below is a historical
> measurement on real market data — none of it is a prediction, and
> none of it is financial advice. The walk-forward section exists precisely
> to show how much apparent edge evaporates on unseen data.

## Data integrity

Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):

- BTC-USD: median divergence 0.016% over 720 overlapping days
- ETH-USD: median divergence 0.016% over 720 overlapping days
- SOL-USD: median divergence 0.016% over 720 overlapping days

Caveats: Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated. Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here. All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.

## Composite screen — top 10 of 38

Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. Composite ranks past momentum, risk-adjusted return, and trend. It describes history; it does not predict the future. "% below 52w high" is informational only.

| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |
|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|
| 1 | **GOOGL** | stock | 0.96 | +87.6% | +10.5% | 1.33 | +31% | -30% | +14.3% |
| 2 | **XLK** | etf | 0.90 | +37.5% | +23.7% | 1.11 | +25% | -26% | +14.4% |
| 3 | **JPM** | stock | 0.85 | +12.9% | +15.3% | 1.30 | +23% | -25% | +13.0% |
| 4 | **AMZN** | stock | 0.80 | +3.7% | +18.7% | 0.90 | +32% | -31% | +20.7% |
| 5 | **QQQ** | etf | 0.78 | +26.1% | +12.6% | 1.14 | +20% | -23% | +8.4% |
| 6 | **IWM** | etf | 0.77 | +35.6% | +14.1% | 0.77 | +21% | -28% | +11.3% |
| 7 | **AAPL** | stock | 0.75 | +48.7% | +16.9% | 0.77 | +27% | -33% | +9.1% |
| 8 | **SPY** | etf | 0.73 | +17.8% | +9.5% | 1.23 | +15% | -19% | +8.1% |
| 9 | **EEM** | etf | 0.71 | +35.3% | +8.8% | 0.88 | +20% | -19% | +6.6% |
| 10 | **NVDA** | stock | 0.71 | +9.5% | +8.1% | 1.33 | +47% | -37% | +6.9% |

Bottom of the screen: ADA-USD (0.14), AVAX-USD (0.11), BCH-USD (0.09), ATOM-USD (0.08), DOT-USD (0.02).

## "On sale" — furthest below 52-week high (informational only)

A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.

| Asset | Below 52w high | 12-1 Mom | Trend |
|-------|----------------|----------|-------|
| DOT-USD | -81.8% | -75.5% | below 200d |
| AVAX-USD | -81.3% | -67.5% | below 200d |
| ADA-USD | -79.9% | -73.6% | below 200d |
| DOGE-USD | -75.8% | -61.0% | below 200d |
| AAVE-USD | -74.2% | -66.0% | below 200d |
| ATOM-USD | -72.1% | -62.7% | below 200d |
| SOL-USD | -70.3% | -49.6% | below 200d |
| LINK-USD | -69.5% | -50.9% | below 200d |

## Strategy vs buy-and-hold (the honest test)

The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all 38 real series and compared to simply holding the asset:

- Strategy beat buy-and-hold on **10 of 38** assets — and 9 of those 10 "wins" were on assets that lost money to hold (crash-dodging, not out-earning)
- Median strategy return: **-0.2%** vs median buy-and-hold: **+43.7%**
- Median walk-forward degradation: **+123%** of the in-sample edge lost out-of-sample (over the 20 assets with a meaningful in-sample edge; the ratio is undefined near zero)
- Median in-sample→out-of-sample gap across all 32 assets: **+2.9%** in absolute return
- Median per-asset average out-of-sample fold return (cross-asset median): **-1.2%**

*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than 10/38.*

Selected rows (top-3 screened assets + benchmarks):

| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |
|-------|----------|------------|------------------|----------------|--------------|
| GOOGL | -5.4% | +191.6% | -1.3% | +143% | 20 |
| XLK | +0.5% | +108.0% | -1.4% | +194% | 20 |
| JPM | +5.7% | +126.0% | -3.1% | +228% | 28 |
| BTC-USD | +20.0% | +118.5% | -0.1% | +101% | 36 |
| ETH-USD | +3.7% | +1.3% | +3.2% | +48% | 32 |
| SPY | -2.5% | +69.6% | -1.5% | +150% | 23 |
| QQQ | -5.8% | +88.2% | -3.5% | +566% | 20 |

## What this actually says

1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.
2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.
3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.
4. **Paper trading is the correct next step** for anything here — not real capital.

*Data: Coinbase Exchange & Nasdaq public APIs, fetched 2026-08-04. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*
