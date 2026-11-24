# vrt_check.py — NOG 2.15 ride-through triage checker

Grades a Large Computational Load's voltage and power time series against
**ERCOT Nodal Operating Guide §2.15, *Voltage Ride-Through Requirements for
Large Computational Loads*** (NOGRR282, effective 1 August 2026; rule text read
from the NOG Section 2 version dated 1 November 2026).

It is the first-hour tool of a triage engagement. Export the run from PSCAD or
PSS/E (or a field PMU record) at the Service Delivery Point, run the checker, and
it tells you which clause the response fails and by how much.

**It is a triage aid, not a compliance determination.** ERCOT tests the submitted
models itself, and several checks rest on our reading of the rule. Those are
flagged `[INTERPRETATION]` in every report.

## Run it

```bash
python3 vrt_check.py run.csv                        # pre-2028 tier, no transfer scheme
python3 vrt_check.py run.csv --tier post2028        # load completes PG 9.5 after 1 Jan 2028
python3 vrt_check.py run.csv --transfer-scheme      # facility uses a load-transfer scheme below 0.8 pu
python3 vrt_check.py run.csv --report-both          # also show the load-transfer reading (R6)
python3 vrt_check.py run.csv --json                 # machine-readable report
python3 vrt_check.py --demo                         # grade the built-in synthetic cases
python3 -m unittest test_vrt_check -v               # 32 tests
```

Exit codes: `0` pass or not applicable, `1` fail or warning, `2` bad input.
Pure Python 3.8+, no dependencies.

## Input

CSV with a header row. Column names are case-insensitive.

| Column | Meaning | Required |
|---|---|---|
| `t` | time, seconds, strictly ascending | yes |
| `v` | RMS voltage, per unit | yes |
| `p` | active power drawn from the grid, MW | yes |
| `i` | current, per unit of **maximum normal** operating current | for the overcurrent check |
| `p_cooling` | the cooling/mechanical part of `p`, MW | for the cooling-load adjustment |

Include at least 0.5 s of steady state before the first disturbance. That
window sets the pre-disturbance level.

## What it checks

| Clause | Check |
|---|---|
| Table A, 2.15(4) | Is ride-through **required** for this excursion? 0.80–0.90 pu ≤ 2.0 s · 0.50–0.80 ≤ 0.5 s · 0.35–0.50 ≤ 0.25 s · < 0.35 ≤ 0.15 s · 1.10–1.20 pu < 1.0 s. Outside the envelope the load may trip and the event is N/A. |
| 2.15(3)(a) | Short overvoltage (1.10–1.20 pu, < 1.0 s): consumption held at pre-disturbance level. |
| 2.15(3)(b) | Shallow dip (stays ≥ 0.8 pu): keep consuming; any reduction no more than proportional to the voltage drop; back to 90% within 2 s. |
| 2.15(3)(c) | Deeper dip: back to **90% of pre-disturbance within 2 s** of voltage returning above 0.9 pu, and stays there. This is where ERCOT's 68% "load loss" and 24% "slow recovery" failures show up. |
| 2.15(3)(c)(i)/(ii) | 0.8–0.5 pu: proportional reduction is advisory ("if capable") for the pre-2028 tier and **mandatory** for loads completing PG 9.5 after 1 Jan 2028. |
| 2.15(3)(c), cooling | If cooling load trips below 0.35 pu, it is subtracted from the recovery target. |
| 2.15(3)(d) | Current ≤ 150% of maximum normal, above-normal current ≤ 0.5 s, counted from the start of the dip through the 2 s after recovery, so re-acceleration inrush is included. |
| 2.15(3)(e) | With `--transfer-scheme`: begins returning within **0.25 s**, reaches 90% within **0.5 s**. |
| 2.15(3), remain connected | WARN if the load recovers above 90% but settles below 98% of its pre-disturbance level — a likely permanent partial trip. |
| 2.15(3)(e) [alt] | With `--report-both`: for each deep dip, whether it *would* meet the 0.25 s / 0.5 s transfer timing. Reported as INFO and never counted in the verdict. |
| 2.15(7) | If the record has six or more required-ride-through events within 90 s, all must recover. Otherwise reported as not tested. |

## Interpretations to confirm with ERCOT

These match the readings in `../TRIAGE_OFFER_AND_METHOD.md`, section 8. If ERCOT
answers any of them, change the code and that table together.

| Tool behaviour | Method reading |
|---|---|
| Table A durations applied **inclusively**: time below 0.8 pu also counts as time below 0.9 pu. Follows ERCOT's stated convention for its generator tables in the same Section 2; §2.15 doesn't restate it. | R11 |
| "Proportional to the voltage drop" read as P(t) ≥ P_pre × V(t)/V_pre, 2% tolerance (`--tol`). | R1 |
| Pre-disturbance level = mean of the 0.5 s before the first excursion (`--pre-window`, `--per-event-pre`). The method suggests 1 s; pick one and keep it. | R3 |
| Recovery must be **sustained**: reaching 90% then falling back while voltage is normal is a failure. | R4 |
| Cooling is subtracted from the target only if it tripped **below 0.35 pu**, judged by staying under half its pre-disturbance value for the 2 s after the dip. Cooling lost above 0.35 pu counts as load loss. | R5 |
| UPS-to-battery is graded under the 2 s rule by default. `--transfer-scheme` applies the 0.25 s / 0.5 s timing instead; `--report-both` shows both. **Biggest open timing question.** | R6 |
| A UPS going to battery between 0.8 and 0.9 pu fails if grid draw falls faster than proportional. | R7 |
| Overcurrent window runs from the start of the dip through the 2 s after recovery. | R8 |
| Settling below 98% of pre-disturbance after a ≥ 90% recovery is a WARN. | R12 |
| "Begins returning" for a transfer scheme = rising 2% of P_pre above its post-dip minimum. | — |

Not implemented, because aggregate power at the delivery point can't show them:
one control action per device per disturbance (R19), and the before-2028
overvoltage trip allowance in 2.15(3)(f) (R10). The six-sag test shape is our
own design, as is every test condition (R13, R14).

## Examples

`examples/` has CSVs for each synthetic case: a shallow pass, the load-loss
failure, slow recovery, a dip outside the envelope, a fast transfer scheme,
overcurrent, the mid-band case for both tiers, a cooling trip and a six-sag train.
