# Strategy Lab — six variants through the honest gauntlet

*6 strategy variants × 38 real assets. Identical costs (10bps round-trip), risk caps, and exit machinery — only the signal and sizing differ. Multiple testing is penalized by the deflated Sharpe ratio (Bailey & López de Prado): trying 6 variants and picking the best inflates its backtest, and the DSR quantifies by how much.*

**Pre-registered expectation** (written before results): vol targeting and ensembling should smooth equity curves (lower drawdown/vol), not beat buy-and-hold. Judge the table against that claim.

## Variant aggregates (medians across all assets)

| Variant | Beats hold | Median return | Median max DD | Median curve vol | Median WF out-of-sample | Median luck percentile | Median trades |
|---|---|---|---|---|---|---|---|
| trend | 8/38 | -1.6% | -12.1% | 0.40% | -1.4% | 48 | 20 |
| trend+vt | 8/38 | -0.4% | -6.7% | 0.26% | -0.6% | 48 | 20 |
| meanrev | 8/38 | -5.9% | -12.9% | 0.41% | +0.0% | 36 | 18 |
| breakout | 7/38 | -0.1% | -9.9% | 0.42% | -1.3% | 52 | 18 |
| ensemble | 7/38 | +0.0% | -6.6% | 0.23% | +0.6% | 38 | 9 |
| ensemble+vt | 7/38 | +0.0% | -2.9% | 0.14% | +0.5% | 38 | 9 |

Median buy-and-hold across the same assets: **+54.1%**.

## Deflated Sharpe verdict

For each asset, the best of the 6 variants was tested against the Sharpe that the best of 6 junk variants would show by luck alone:

**0 of 38 assets** produced a best-variant that survives deflation (DSR > 0.95). After correcting for selection across variants, no variant on any asset shows statistically credible positive true Sharpe. This is the normal, honest result — and the one the hype dashboards never compute.

Which variant most often had the best raw Sharpe per asset (before deflation): breakout (10), meanrev (10), ensemble+vt (6), trend+vt (5), trend (4), ensemble (3).

## Reading

1. **Compare drawdown and curve-vol columns first** — that is where vol targeting and ensembling are supposed to help, and the honest measure of whether they did.
2. **The beats-hold column is the alpha reality check.** Expect it to stay low; costs and the concentration of returns in a few days (INSIGHTS.md study 2) work against all timing variants.
3. **The luck percentile** (vs 400 duration-matched random traders) below ~95 means the variant is indistinguishable from luck on that asset class.
4. **Nothing here is a recommendation.** It is a controlled comparison on one 3-year window of history, with every anti-fooling device we have turned on.

*Regenerate: `./scripts/lab.sh`. Full per-asset numbers: `src/data/lab.json`. Engine: `src/engine/` (91+ tests).*
