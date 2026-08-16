# Strategy Lab — six variants through the honest gauntlet

*6 strategy variants × 38 real assets. Identical costs (10bps round-trip), risk caps, and exit machinery — only the signal and sizing differ. Multiple testing is penalized by the deflated Sharpe ratio (Bailey & López de Prado): trying 6 variants and picking the best inflates its backtest, and the DSR quantifies by how much.*

**Pre-registered expectation** (written before results): vol targeting and ensembling should smooth equity curves (lower drawdown/vol), not beat buy-and-hold. Judge the table against that claim.

## Variant aggregates (medians across all assets)

| Variant | Beats hold | Median return | Median max DD | Median curve vol | Median WF out-of-sample | Median luck percentile | Median trades |
|---|---|---|---|---|---|---|---|
| trend | 9/38 | -0.6% | -12.5% | 0.42% | -1.3% | 54 | 20 |
| trend+vt | 8/38 | -0.1% | -7.2% | 0.26% | -0.5% | 54 | 20 |
| meanrev | 8/38 | -5.7% | -12.1% | 0.40% | +0.0% | 39 | 17.5 |
| breakout | 8/38 | -0.4% | -9.8% | 0.41% | -1.2% | 50 | 17.5 |
| ensemble | 7/38 | +0.0% | -6.3% | 0.24% | +0.0% | 36 | 9 |
| ensemble+vt | 7/38 | +0.0% | -2.8% | 0.14% | -0.1% | 36 | 9 |

Median buy-and-hold across the same assets: **+53.6%**.

## Deflated Sharpe verdict

For each asset, the best of the 6 variants was tested against the Sharpe that the best of 6 junk variants would show by luck alone:

**1 of 38 assets** produced a best-variant with DSR > 0.95: GLD (ensemble+vt, 0.971). Treat survivors with suspicion, not excitement: 3 years of daily data is a short sample, and this correction covers only OUR 6 trials — not the millions of variants the industry has collectively tried on the same public signals.

Which variant most often had the best raw Sharpe per asset (before deflation): breakout (9), meanrev (9), trend+vt (7), ensemble (5), ensemble+vt (4), trend (4).

## Reading

1. **Compare drawdown and curve-vol columns first** — that is where vol targeting and ensembling are supposed to help, and the honest measure of whether they did.
2. **The beats-hold column is the alpha reality check.** Expect it to stay low; costs and the concentration of returns in a few days (INSIGHTS.md study 2) work against all timing variants.
3. **The luck percentile** (vs 400 duration-matched random traders) below ~95 means the variant is indistinguishable from luck on that asset class.
4. **Nothing here is a recommendation.** It is a controlled comparison on one 3-year window of history, with every anti-fooling device we have turned on.

*Regenerate: `./scripts/lab.sh`. Full per-asset numbers: `src/data/lab.json`. Engine: `src/engine/` (91+ tests).*
