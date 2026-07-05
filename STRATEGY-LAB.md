# Strategy Lab — six variants through the honest gauntlet

*6 strategy variants × 38 real assets. Identical costs (10bps round-trip), risk caps, and exit machinery — only the signal and sizing differ. Multiple testing is penalized by the deflated Sharpe ratio (Bailey & López de Prado): trying 6 variants and picking the best inflates its backtest, and the DSR quantifies by how much.*

**Pre-registered expectation** (written before results): vol targeting and ensembling should smooth equity curves (lower drawdown/vol), not beat buy-and-hold. Judge the table against that claim.

## Variant aggregates (medians across all assets)

| Variant | Beats hold | Median return | Median max DD | Median curve vol | Median WF out-of-sample | Median luck percentile | Median trades |
|---|---|---|---|---|---|---|---|
| trend | 9/38 | +0.0% | -12.7% | 0.42% | +0.0% | 52 | 20 |
| trend+vt | 10/38 | +0.5% | -7.2% | 0.26% | +0.1% | 52 | 20 |
| meanrev | 9/38 | -5.0% | -12.2% | 0.41% | +0.0% | 41 | 17.5 |
| breakout | 9/38 | -2.0% | -9.8% | 0.41% | +0.0% | 48 | 18.5 |
| ensemble | 9/38 | -0.3% | -7.0% | 0.24% | +0.0% | 45 | 9 |
| ensemble+vt | 9/38 | -0.2% | -3.8% | 0.14% | +0.0% | 45 | 9 |

Median buy-and-hold across the same assets: **+40.3%**.

## Deflated Sharpe verdict

For each asset, the best of the 6 variants was tested against the Sharpe that the best of 6 junk variants would show by luck alone:

**0 of 38 assets** produced a best-variant that survives deflation (DSR > 0.95). After correcting for selection across variants, no variant on any asset shows statistically credible positive true Sharpe. This is the normal, honest result — and the one the hype dashboards never compute.

Which variant most often had the best raw Sharpe per asset (before deflation): breakout (10), meanrev (8), trend+vt (8), trend (5), ensemble (5), ensemble+vt (2).

## Reading

1. **Compare drawdown and curve-vol columns first** — that is where vol targeting and ensembling are supposed to help, and the honest measure of whether they did.
2. **The beats-hold column is the alpha reality check.** Expect it to stay low; costs and the concentration of returns in a few days (INSIGHTS.md study 2) work against all timing variants.
3. **The luck percentile** (vs 400 duration-matched random traders) below ~95 means the variant is indistinguishable from luck on that asset class.
4. **Nothing here is a recommendation.** It is a controlled comparison on one 3-year window of history, with every anti-fooling device we have turned on.

*Regenerate: `./scripts/lab.sh`. Full per-asset numbers: `src/data/lab.json`. Engine: `src/engine/` (91+ tests).*
