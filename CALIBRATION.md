# Forecast Register & Calibration Record

*The only honest meaning of "accurately predicts": make explicit probability-interval forecasts, register them BEFORE the outcome, then score every one when it matures. Accuracy is calibration — 68% intervals should contain the outcome ~68% of the time, 95% intervals ~95%. This page is the platform's complete accuracy record, misses included. Point predictions of direction are deliberately absent; they are not honestly makeable.*

Registered forecasts: **1280** (0 added this run) · matured & scored: **146** · pending: **1134**

| Horizon | Matured | 68%-interval coverage (target ≈68%) | 95%-interval coverage (target ≈95%) |
|---|---|---|---|
| 1m | 146 | 79% | 97% |
| 3m | 0 | awaiting maturity | awaiting maturity |
| 1y | 0 | awaiting maturity | awaiting maturity |
| 5y | 0 | awaiting maturity | awaiting maturity |

**Forecast construction** (fully transparent): dispersion from measured volatility scaled by √horizon; drift zero below 1 year (direction is unpredictable — INSIGHTS study 3) and the historical median rolling CAGR at 1y/5y, labeled as a base rate, not a view. The 5-year forecasts registered today mature in 2031; the 1-month ones start scoring within weeks — the record builds itself and cannot be quietly edited (append-only ledger, in git).

*Regenerate/score: `./scripts/forecast.sh` (runs weekly). Ledger: `data/forecasts/ledger.json`.*
