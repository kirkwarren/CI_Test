# Honest Quant · Backtest & Risk Lab

An interactive trading-strategy **backtesting and risk-analysis** tool — built as
the honest counterpart to those viral "my bot made +2,140% in 42 days"
screenshots.

It implements the same machinery those dashboards show off (a
Scan → Detect → Validate → Size → Fill → Settle pipeline, Kelly position sizing,
Monte Carlo, multi-asset robustness) but it reports the numbers the hype posts
hide: **drawdowns, out-of-sample degradation, and the probability of losing
money.**

> ⚠️ **This is an educational tool. It uses simulated market data, places no real
> orders, and moves no real money. Nothing here is financial advice.** No trading
> strategy — however sophisticated — can reliably produce the returns shown in
> influencer marketing. Real edges are small, fragile, and heavily competed away.

## Why it exists

The screenshot that inspired this claimed +2,140% in six weeks with a "95.7%
edge." Those numbers are marketing fiction. This project makes the point
concretely: run a real strategy pipeline honestly, with fees and slippage, and
watch how modest (often negative) the results actually are — and how the
"edge" collapses the moment you test it on data the optimizer never saw.

## The engine (`src/engine/`)

Everything is plain, dependency-free, deterministic JavaScript with unit tests.

| Module | Responsibility |
| --- | --- |
| `random.js` | Seeded PRNG + Gaussian draws (reproducible results) |
| `market.js` | Simulated OHLC data (GBM + regime switches). Swap for a real feed loader in production. |
| `indicators.js` | SMA, EMA, RSI (Wilder), ATR, rolling stdev |
| `strategy.js` | The Scan → Detect → Validate → Size decision pipeline |
| `risk.js` | Kelly criterion + **fractional** Kelly with a hard per-trade risk cap |
| `backtest.js` | Fill + Settle: order execution with commission & slippage, ATR stops, R-multiple targets |
| `metrics.js` | Sharpe, max drawdown, CAGR, win rate, profit factor, expectancy |
| `montecarlo.js` | Bootstrap-resamples trades to show the **distribution** of outcomes — including the downside tail |
| `walkforward.js` | Walk-forward optimization: tune in-sample, test out-of-sample, measure the "overfitting tax" |
| `paper.js` | Automated **paper-trading** executor: consumes bars one at a time, places simulated orders, tracks a live blotter + equity. No real money, no credentials. Swap the feed for real data to paper-trade live. |
| `loader.js` | Strict CSV→bars parsing for the real data under `data/`, plus periods-per-year inference |
| `screener.js` | Cross-sectional momentum / risk-adjusted / trend screen with a transparent composite rank |
| `studies.js` | Six empirical market studies: fat tails, return concentration & best/worst-day clustering, volatility clustering, stress correlations, cross-sectional momentum, luck-vs-skill benchmark |

## Real data & reports

`scripts/fetch-data.mjs` pulls ~3 years of real daily OHLCV (16 crypto pairs from
Coinbase — BTC/ETH/SOL cross-validated against Kraken with hard divergence
gates — and 22 equities/ETFs from Nasdaq) into `data/`, completed days only.

- `./scripts/analyze.sh` → **REPORT.md** + `src/data/realAnalysis.json` — the
  screen, strategy-vs-buy-and-hold, walk-forward, Monte Carlo, paper trading on
  every asset
- `./scripts/insights.sh` → **INSIGHTS.md** + `src/data/insights.json` — the six
  empirical studies, adversarially verified claim-by-claim

A daily scheduled routine refreshes the data and reports automatically.

### Design principles

- **Deterministic.** Seeded RNG everywhere, so nobody can quietly re-roll until a
  lucky track record appears.
- **Costs are never optional.** Every fill pays commission + slippage. Zero-cost
  backtests are the #1 way results lie.
- **Risk is capped.** Fractional Kelly, then a hard cap on risk-per-trade, so the
  account can't blow up on one trade.
- **Out-of-sample is the truth.** In-sample results are treated as suspect until
  they survive walk-forward validation.

## The dashboard (`src/App.js`)

A React + Tailwind UI that mirrors the aesthetic of the hype screenshot but
surfaces honest metrics: an equity curve, a Monte Carlo distribution with the
probability-of-loss called out in red, a multi-asset robustness grid, and a
walk-forward panel showing how much of the in-sample edge evaporates on unseen
data. Tune the risk/Kelly/take-profit/fee sliders and watch how fragile the
"edge" is.

## Running it

```bash
npm install
npm start        # dev server at http://localhost:3000
npm test         # run the engine + UI test suites
npm run build    # production build
```

## What a *real* deployment would need (and why it's hard)

This repo is honest about its limits. To trade real money you would additionally
need: real historical + live market data, an exchange/broker API with
authentication, robust order and error handling, latency and partial-fill
modeling, slippage that reflects real order-book depth, portfolio-level risk
controls, monitoring/alerting, and — most importantly — a genuine, statistically
validated edge that survives fees and competition. The last one is the part no
tool can hand you.
