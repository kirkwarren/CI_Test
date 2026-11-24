# Ride-Through Failure Triage — Offer and Method

**Status:** draft, 24 November 2026. **Part 1** is the client-facing scope and can be sent once the [YOUR: ...] fields are filled. **Part 2** is internal. Do not send it to clients.

**Primary sources:** ERCOT Large Load Working Group deck, 19 Nov 2026, *"ERCOT's Update – Overview of Voltage Ride-Through Test Results"* (Dynamic Studies); Nodal Operating Guide (NOG) §2.15 (Section 2, version dated 1 Nov 2026); Planning Guide (PG) Section 9. Text copies are in `research/slot_desk/primary_sources/`. Anything taken from secondary reporting is labelled *(secondary)*.

---

# PART 1 — THE OFFER

## Ride-Through Failure Triage

[YOUR: firm name] · [YOUR: contact name, email, phone] · Scope valid until [YOUR: date]

### Who it is for

An Interconnecting Large Load Entity (ILLE) with a Batch Zero Large Computational Load (LCL) whose ERCOT voltage ride-through (VRT) result is a fail, or that expects a fail.

**Why now** (ERCOT, LLWG, 19 Nov 2026): 69% of about 260 tested Batch Zero models failed NOG §2.15 on preliminary results. Results reach developers in early December 2026. There is **one update window**: updated models are due **1 February 2027**. A project whose model does not show the required ride-through is not eligible for the Quarterly Stability Assessment (QSA), and without a QSA ERCOT will not grant Initial Energization.

### What we do in 5 business days

1. **Map ERCOT's result to the clause.** For each failed test case, we name the NOG §2.15 requirement that was failed and set the measured value against the required one. Examples: staying connected for the Table A durations, returning to 90% of pre-disturbance consumption within 2 s, the 150% overcurrent limit, and load-transfer timing.
2. **Classify each failure.**
   - **Model problem:** the submitted model misrepresents equipment that would comply as specified and configured.
   - **Settings problem:** the equipment can comply, but its configured thresholds, timers or protection settings cause the failure.
   - **Equipment problem:** no available setting lets the equipment as specified meet the requirement.
   - **Undetermined:** we list the evidence that would settle it.
3. **Rank the fixes:**
   1. Correct the model.
   2. Change UPS or power-supply settings or firmware.
   3. Change the transfer or control scheme.
   4. Add hardware (STATCOM, synchronous condenser or BESS), only if needed.

   For each fix we give the effort, the dependencies (especially OEM model release) and the evidence ERCOT is likely to ask for.
4. **Give a plain view of 1 February 2027:** achievable, at risk, or not achievable, with the critical-path items and the dates they must close by. If the answer is "not achievable", we say so.

### Deliverables

- **Triage report** (PDF), containing:
  - the map from each failure to its clause
  - the classification of each failure, with its evidence and how confident we are
  - the ranked fix path
  - our assessment of the 1 February 2027 date
  - open questions for ERCOT, your interconnecting TSP and your UPS/converter OEM.
- **Reproduction runs** of ERCOT's failing cases on your submitted model, graded against NOG §2.15. These need ERCOT's waveforms or test definitions. Where those are not available, we use our own screening cases and label them as ours.
- **A 60-minute readout call** with your engineering team.

### What you provide

Items 1–3 start the 5-day clock. Items 4–7 are needed by the end of day 1.

1. ERCOT's VRT result for the project, with any waveforms, plots or test definitions ERCOT supplied. Also any 7 August 2026 deficiency notice and the related correspondence.
2. The dynamic models as submitted (PSS/E, PSCAD and/or PERC1), with their parameter sets, software versions, supporting technical documentation and the Large Load Data Survey that went with them.
3. UPS and IT power-supply make, model and firmware version, with the configured settings: input voltage window, transfer-to-battery threshold and delay, rectifier undervoltage trip, and the delay and ramp for returning to mains.
4. A one-line diagram from the Service Delivery Point down to the UPS/IT load, with transformer ratings, impedances and tap settings.
5. Protection settings: under- and overvoltage, overcurrent, and all transfer logic. This includes automatic transfer to backup generation and any lockout or sag-counting logic.
6. A breakdown of load at peak Demand into IT, cooling/mechanical and auxiliary MW, with VFD and contactor details for the cooling.
7. The date the project met, or expects to meet, Planning Guide §9.5. This date sets which §2.15 performance tier applies: on or before 1 January 2028, or after it.

**Helpful:** OEM type-test or sag-test reports. Whether the load is co-located with generation or storage. A contact at your UPS OEM, and permission for us to speak to them about this project.

### Fee

**$25,000 fixed fee per project. This is a TEST PRICE.** [YOUR: payment terms] [YOUR: whether the fee is credited against a remediation engagement]

### What happens next

If you want us to carry out the fix, we quote a remediation engagement separately: model correction, settings work with your OEM, re-testing against Table A, and assembling the 1 February 2027 submission package. Indicative range **$75,000–$300,000 per project — a TEST RANGE, not a quote**. Where a project falls depends mainly on whether a validated model of its UPS/converter family already exists. You are free to take the triage report to another firm.

### Exclusions

- We assemble and analyse. **We do not certify compliance** with NOG §2.15.
- **We do not guarantee** that ERCOT accepts any model or submission, that the project is eligible for the QSA, or any energization date.
- We do not submit to ERCOT. Submission goes through the route ERCOT specifies.
- We do not change a model parameter to a value your equipment will not actually have. Every change we propose traces to a document: OEM data, a settings export or a test report.
- This scope excludes legal advice, site work, field testing and changes to relay settings.
- [YOUR: PE stamp. Offer one only if the engineer holds a Texas PE licence and you choose to. Otherwise write "No PE stamp is included."]

### Who does the work, and confidentiality

We are a new firm, set up for this rule. The work is done by [YOUR: Path A — the named engineer and their actual background / Path B — the partner firm's name, with its consent]; we tell you who before you sign. We sign your NDA [YOUR: or offer our mutual NDA] and use your models and data only for your project. We keep a library of how converter families behave, and we ask you (and the OEM where relevant) before recording any non-identifying, family-level finding from your project.

We read NOG §2.15 from the version dated 1 November 2026. Where the rule can be read more than one way, the report says so and gives you the question to put to ERCOT.

---

# PART 2 — THE METHOD (internal)

For the engineer doing the triage. Not for clients.

## Conventions

- **V:** RMS voltage in p.u. of nominal, measured at the Service Delivery Point (SDP). If the LCL is co-located with a Generation Resource or an Energy Storage Resource (ESR), measure at the Point of Interconnection Bus (POIB) instead.
- **P0:** active power at the SDP before the disturbance [R3].
- **P0adj:** P0 minus the pre-disturbance cooling load that tripped while V < 0.35 p.u. This adjusted value is used for every later requirement in §2.15(3)(c) onward.
- **I_max:** the maximum current the LCL draws in normal operation [R8].
- **[R#]:** our own reading of the rule. Confirm it with ERCOT before relying on it in a submission. The full list is in §8.
- **`vrt_check.py`:** the repo script that grades a voltage/power time series against NOG §2.15. We use it in Steps 2, 3 and 6.
  - It encodes our readings. Before first use, check which [R#] it implements and how [YOUR: confirm against the script header].
  - If ERCOT clarifies any [R#], update the script before the next run.
  - Where it does not cover a clause, check that clause by hand and say so in the report.

## 0. Intake and the 5-day plan

**Day 0 (before the clock starts)**
- Check that the inputs are complete. The clock starts only when inputs 1–3 are in.
- If items 4–7 are not in by the end of day 1, mark every failure that depends on them as Undetermined and say why.
- Sign the NDA.
- Log every file received with its date and SHA-256 hash.
- Confirm our software can open the model as submitted: PSS/E version, PSCAD version, and the compiler for any PSCAD user models. [YOUR: our licensed versions]

| Day | Work |
|---|---|
| 1 | Step 1 (applicability and tier). Step 2 (map the failures to clauses from ERCOT's result). |
| 2 | Reproduce ERCOT's failing cases. Instrument the model. |
| 3 | Step 3 (model vs equipment). Send the OEM questions the same day. |
| 4 | Step 4 (fix path and the 1 Feb 2027 assessment). |
| 5 | Write the report. A second engineer reviews it [YOUR: who — on Path B, the partner's QA]. Readout call. |

## 1. Applicability and tier

**1.1 Is §2.15 applicable?** The LCL is exempt only if one of these holds (§2.15(1)):

- **(a)** By 14 Nov 2025, it was operating and consuming power, or it had written ERCOT approval to energize.
- **(b)/(c)** By 14 Nov 2025, all required interconnection or service-extension agreements were executed, **and all of (d)** also holds:
  - by 14 Nov 2025, the TSP had received notice to proceed and the funding or security; **and**
  - **either** ERCOT had completed and approved the Large Load Interconnection Study (LLIS) by 14 Nov 2025,
  - **or** a TDSP attestation reached ERCOT before 31 Dec 2026, ERCOT approved the exemption in writing, and the LCL achieves Initial Energization by 31 Dec 2026.

The exemption is lost if the LCL is modified after 14 Nov 2025 in a way that meets PG §9.2.1(1)(b) (§2.15(2)).

**Practical rule:** ERCOT tested the project against §2.15, so ERCOT treats it as subject to the rule. If the client believes it is exempt, put that to ERCOT and the TSP as a question. Do not base the triage on the exemption.

**1.2 Which tier?** Record the date the LCL met, or expects to meet, PG §9.5.

| PG §9.5 met | Rule between 0.8 and 0.5 p.u. |
|---|---|
| After 14 Nov 2025 and on or before 1 Jan 2028: §2.15(3)(c)(i) | If capable, any reduction is proportional to the voltage drop. If not capable, the LCL may reduce as much as needed to stay connected. Below 0.5 p.u. it may reduce as needed. Recovery must still meet (c). |
| After 1 Jan 2028: §2.15(3)(c)(ii) (stricter) | The LCL must keep consuming active power and may reduce only in proportion to the voltage drop, or it uses a load-transfer scheme under (e). Below 0.5 p.u. it may reduce as needed. |

The documents we have do not say which date counts as an individual LCL "satisfying" PG §9.5, which is ERCOT's refinement study [R9]. Secondary reporting says ERCOT will miss the 9 Apr 2027 study-results deadline. If the date could fall after 1 Jan 2028:
- assess against both tiers
- say which fixes still pass under the stricter tier.

**1.3 Allowance with an end date.** Until 1 Jan 2028, an LCL may trip or transfer load when V stays above 1.08 p.u. for 5 s or more, if that is needed to protect voltage-sensitive equipment (§2.15(3)(f)). Our reading is that this allowance ends on that calendar date for every LCL, whatever its tier [R10]. A design that relies on it needs a plan for 2028. Flag it in the report.

**1.4 Measurement point.** Measure at the SDP, or at the POIB if the LCL is co-located with generation or storage [R17].

**1.5 Record:**
- the SDP bus and its nominal kV
- P0 at the test condition
- peak Demand from the Load Commissioning Plan
- cooling MW
- I_max.

## 2. Map each failure to the clause

**2.1 Start from ERCOT's label.** ERCOT's preliminary causes:
- **Full or partial load loss (68%):** usually fails "remain connected" under Table A, the 90% recovery tests, or both.
- **Slow recovery (24%):** usually fails the 2 s limit in (b)/(c) or the 0.25 s / 0.5 s limits in (e).

Do not stop at the label. Grade the waveform.

**2.2 Grade.** Run `vrt_check.py` on ERCOT's waveforms if they were supplied. Otherwise run it on our reproduction (2.3). For each case, record:
- each band reached and the time spent in it
- the lowest P/P0 within each band
- the time from V returning above 0.9 p.u. to P reaching 0.9 × P0adj
- peak I/I_max, and how long I stays above I_max
- the number of transfer actions per device
- any trip or mode-change flags.

| Clause | Requirement | Pass test we apply | Typical failure signature |
|---|---|---|---|
| §2.15(3) and Table A | Remain connected for: 1.10 < V ≤ 1.20 for 1.0 s; 0.90–1.10 continuous; 0.80 ≤ V < 0.90 for 2.0 s; 0.50 ≤ V < 0.80 for 0.5 s; 0.35 ≤ V < 0.50 for 0.25 s; V < 0.35 for 0.15 s | No load trips or disconnects while V is within those limits. Cooling/mechanical load is the only exception, and only below 0.35 p.u. Where a trajectory crosses bands, we test the cumulative time below each threshold [R11]. A permanent partial loss counts as a fail even if P recovers to ≥ 90% [R12]. | SDP P steps down and never comes back. Trip flags in the UPS rectifier, PSU or motor blocks. |
| (3)(a) | In the continuous range, and at 1.1–1.2 p.u. for < 1.0 s: keep consuming at the pre-disturbance level | P stays at P0 within tolerance [R2] | Overvoltage protection or a mode change on a swell. The UPS goes to battery on high voltage. |
| (3)(b) | Between 0.8 and 0.9 p.u., with V back above 0.9 within 2 s: keep consuming; any reduction proportional to the voltage drop; 90% of P0 within 2 s of V returning above 0.9 | P > 0 throughout. P/P0 ≥ V/V_pre [R1]. P ≥ 0.9 P0 within 2 s, and it stays there [R4]. | The UPS goes to battery above 0.8 p.u. at the SDP, so grid draw falls to near zero [R7]. |
| (3)(c) | Below 0.8 p.u.: may reduce; must reach ≥ 90% of P0adj within 2 s of V returning above 0.90 | As stated. Only cooling that tripped below 0.35 p.u. is subtracted [R5]. | Long delays before returning to mains, rectifier walk-in ramps, VFD restart delays. |
| (3)(c)(i) / (ii) | Tier rules between 0.8 and 0.5 p.u. (Step 1.2) | (i): P/P0 ≥ V/V_pre where the equipment is capable [R1]. (ii): P > 0 and P/P0 ≥ V/V_pre, or an (e) scheme. | Full transfer to battery at 0.75 p.u. Passes (i) if "not capable" holds. Fails (ii) unless it is an (e) scheme. |
| (3)(d) | When V is below the continuous range: I ≤ 150% of I_max, and only during the transient, for no more than 0.5 s | Peak I/I_max ≤ 1.5. I > I_max for no more than 0.5 s, timed from the start of the disturbance [R8]. | Inrush when V recovers: the rectifier DC bus or the battery recharges, or motors re-accelerate. |
| (3)(e) | Load-transfer or control-stabilisation scheme below 0.8 p.u.: start returning within 0.25 s of V returning above 0.9; reach ≥ 90% of P0adj within 0.5 s; one action per device per disturbance | As stated [R6, R19] | The UPS takes longer than 0.25 s to return to mains. Staged return takes longer than 0.5 s. Transfer–return–transfer chatter. |
| (3)(f) | Before 1 Jan 2028, may trip or transfer if V > 1.08 p.u. persists ≥ 5 s | Applies only if the design relies on it (Step 1.3) | — |
| (5) | Protection lets the LCL ride through to the most the equipment allows | **Manual review.** Compare relay setpoints with the equipment's withstand. A setting tighter than the equipment needs is a finding even outside Table A. | An undervoltage relay set at 0.85 p.u. with a short delay. |
| (6) | Instantaneous overcurrent or overvoltage protection uses filtered quantities or time delays. AC instantaneous overvoltage uses a measurement window of at least one cycle. | **Manual review** of the protection model and the setting files | PSCAD protection blocks acting on raw samples. A trip on the overshoot when V recovers. |
| (7) | No trip or transfer based only on a count of sags or swells. If the equipment forces one, the LCL stays connected through at least 6 sags or swells within 90 s. | **Manual review** of the settings, plus a six-event run (Step 6) [R13] | UPS battery-transfer counters, lockouts after repeated events. ERCOT's single-event test does not show these. |
| (8) | After a real failure: root-cause report within 90 days of ERCOT's request, a plan within the next 90 days, implementation within 180 days of approval. ERCOT may order disconnection. | Not a triage test | Tell the client this obligation lasts for the life of the facility. |

`vrt_check.py` covers the time-series rows. Clauses (5), (6) and the settings part of (7) are manual reviews.

**2.3 Reproduce.**
- Load the submitted model in the software version it was submitted in.
- Drive the SDP with ERCOT's voltage if a waveform was given. Otherwise apply ERCOT's test definition. If there is neither, run the Step 6 screening set and label it ours.
- If we cannot reproduce ERCOT's failure, check the software version, initial conditions, time step, P0 and the source representation.
- If it is still unexplained, classify it as Undetermined. Send ERCOT the specific question: the test definition, the source model and the short-circuit strength used [R14].

## 3. The model-vs-equipment decision tree

Classify each failure, not each project. One project can have a model error in its UPS block and a real settings problem in its cooling.

**Classes**
- **M (model):** the model misrepresents equipment that would comply as specified and configured.
- **S (settings):** the equipment can comply, but a configured threshold, timer, mode or protection setting causes the failure. A firmware upgrade on the same hardware counts as S.
- **E (equipment):** no available setting or firmware on that product meets the clause.
- **U (undetermined):** we name the evidence that would decide it.

**Evidence grades.** State one for every classification.
- **A:** hardware test (type test, sag test or HIL) on the same product family and firmware version.
- **B:** an OEM-supplied, OEM-validated model, or the OEM's written confirmation of the parameter values for that firmware.
- **C:** data-sheet or manual values.
- **D:** engineering judgement.

A classification that rests only on C or D is provisional, and the report says so.

```
Q0 Is the model numerically sound? ───── no ──► M (numerical); fix this first
   │ yes
Q1 Does our run reproduce ERCOT's fail? ── no ──► U (ask ERCOT for the test definition)
   │ yes
Q2 Which element causes it?  (split SDP P into components; read the trip and mode flags)
   │
Q3 Where did that element's model come from? (generic / OEM-validated / unknown)
   │
Q4 Compare its parameters with the as-configured equipment
   ├─ model ≠ configured, and the configured value complies ──────► M
   ├─ model = configured, and a compliant setting/firmware exists ─► S
   ├─ no compliant setting/firmware on that product ───────────────► E
   └─ configured value not known ──────────────────────────────────► U (OEM question goes out day 3)
   │
Q5 Is there hardware test data? It can confirm or overturn Q4. Raise the evidence grade if so.
```

**Q0 — Is the model numerically sound?**
- Run at least 20 s with no disturbance (our choice). P and V must hold at their initial values, and nothing may trip.
- The model must initialise at the intended P0 and SDP voltage. Check that no start-up transient has been read as the disturbance.
- PSCAD: check the time step and interpolation suit the converter controls. PSS/E: check the integration step suits the model's time constants. Read the log for warnings.
- If both PSS/E and PSCAD were submitted, they should fail the same case in the same way.

Failing any of these means class M. Fix it before going further.

**Q1 — Does our run reproduce ERCOT's failure?** If not, classify it U (see 2.3).

**Q2 — Which element causes it?** Split SDP P into its components:
- IT load behind the UPS
- IT load not behind a UPS
- cooling
- auxiliary load
- any on-site resource.

Monitor each block's trip and mode flags. Name the element and the moment it acts, relative to V crossing each threshold at the SDP and at the device terminals.

**Q3 — Where did that element's model come from?**
- **A generic library block or template with default or estimated parameters** suggests a model error (for example a generic PERC1 parameter set, a generic motor, or hand-written UPS logic). The model has to prove itself in Q4.
- **An OEM-supplied model:** check that its version matches the firmware and configuration that will be installed. A mismatch is M (wrong version) or S.
- **Unknown:** ask the client who built the model and from what data.

**Q4 — Compare parameters with the equipment as configured.** Sources, in order of trust:
1. A settings export from a configured unit, or the factory-test configuration.
2. The OEM's written confirmation for that firmware.
3. The commissioning settings sheet in the design.
4. Data-sheet defaults.

Check each of the following.

- **a. Translate the voltage first.** Work out the device-terminal voltage from the SDP voltage through the transformers, taps and cable drop at the test loading. A threshold that looks compliant at the UPS terminals may act at a different SDP voltage. Do this before judging any threshold.
- **b. UPS operating mode.** Is it double-conversion or a high-efficiency (eco/bypass) mode? Compare the model with how the site will run. The two behave differently in a sag.
- **c. UPS input window, and the threshold and delay for going to battery.** Compare the model value with the configured value. Check the result against (b): grid draw must not be lost while SDP V is 0.8–0.9 p.u. [R7]. Check it against the (e) timing too.
- **d. Rectifier undervoltage trip or blocking.** Check the threshold and delay. Does the rectifier stay online and keep drawing (reduced) power through the sag? *(Secondary:* Eaton told ERCOT in July 2025 that its UPS carries full load without battery down to about −15% voltage, and proposed keeping the rectifier online through ride-through. Treat this as a lead to check with the OEM for the specific product. It is not evidence about the client's unit.)
- **e. Returning to mains.** Check the delay before the UPS returns to mains once V recovers, and the rectifier's walk-in (soft-start) ramp rate. This is the first place to look for "slow recovery". Compare against 2 s for (c), and 0.25 s / 0.5 s for (e).
- **f. Battery recharge current limit on return.** An unlimited recharge can push the current over 150%, failing (d). A tight limit can slow the recovery of P.
- **g. IT power supplies not behind a double-conversion UPS,** for example designs with batteries in the rack. Check the PSU hold-up time and the brownout or undervoltage thresholds.
- **h. Cooling and mechanical load.** Check the VFD undervoltage trip level and delay, the auto-restart and flying-start settings, contactor dropout and restart staging. Then confirm:
  - the model trips cooling only below 0.35 p.u. at the SDP
  - cooling that trips above 0.35 p.u. is counted as load loss, not exempted
  - the cooling MW in the model matches the design
  - ERCOT's grading subtracted only cooling that tripped below 0.35 p.u.

  If ERCOT appears to have counted exempt cooling trips as a failure, raise it with ERCOT and include the waveform [R5].
- **i. Protection.** Review the under- and overvoltage relays at the SDP and on the MV feeders, the overcurrent elements, automatic transfer to backup generation, and transfer-trip. Compare the setpoints and delays in the model with the relay setting files. Check them against Table A and against (5), (6) and (7).
- **j. Load composition and aggregation.** Check the IT, cooling and auxiliary fractions and the number of units aggregated. In a composite model, check that the partial-trip fractions reflect the real spread of device thresholds.

**Q5 — Is there independent evidence?** Look for grade A hardware test data for this family and firmware under a comparable sag.
- Grade the test data with `vrt_check.py` using the same thresholds, so the comparison is like for like.
- If the test data rides through and the model does not, the class is M with strong evidence.
- If the test data shows the same failure, the class is S or E.

**Q6 — Check against ERCOT's numbers.** ERCOT's 68% and 24% figures are preliminary and anonymous. They tell us where to look first, not what the answer is:
- load loss: checks c, d, g, h, i
- slow recovery: checks e, f, h.

**Integrity rule.** The model must represent the equipment as it will be installed and configured.
- Change no parameter without a source document.
- Never tune a model so that it passes.

Under PG §9.1(8), ERCOT may request supporting materials and verify site readiness until 9 Apr 2027. A materially false attestation gets a load removed from Batch Zero. We assume, as our own reading, that model changes could be examined the same way. Treat every parameter change as something the client may have to substantiate.

## 4. The fix hierarchy

Take the cheapest credible fix first. Move to the next level only when the one above cannot clear the failure.

**Level 1 — Correct the model (class M)**
- **What changes:**
  - replace a generic block with an OEM-validated model, or
  - correct parameters to the configured values, or
  - fix the numerical problems.
- **Evidence needed:**
  - the OEM model (under NDA if needed), or the OEM's written confirmation of the parameters for that firmware
  - the settings export
  - a test report, if one exists
  - a parameter change log giving, for each change, the old value, the new value, and the source document and page.
- **Feasibility for 1 Feb:**
  - Achievable if the validated model or written parameters are in hand, or a library entry exists.
  - At risk, or not achievable, if a new OEM model must be released under NDA. *(Secondary:* Keentel reports OEM model release under NDA as the most common cause of delay, with months of commercial negotiation for a hardware-benchmarked UPS model.)
- **Family-level validation:** if ERCOT accepts converter model validation once per converter family, a library entry reduces this to parameterisation. **This is the key assumption, and it is unverified** [R15]. Until ERCOT confirms it, assume each project needs its own evidence.

**Level 2 — Change settings or firmware (class S)**
- **What changes:** any of the following:
  - the UPS threshold and delay for going to battery
  - the delay and ramp for returning to mains
  - rectifier undervoltage behaviour
  - the battery recharge limit
  - VFD undervoltage trip and auto-restart
  - relay setpoints
  - moving to a firmware version with ride-through behaviour. *(Secondary:* Schneider Electric showed NERC "firmware-updated" UPS behaviour that protects both the critical load and the grid, Jan 2026.)
- **Evidence needed:**
  - the OEM's written confirmation that the setting or firmware is supported on that product, and what it does to critical-load protection and the warranty
  - sign-off from the client's facility engineering, because the trade-off against uptime is theirs to make
  - a commitment document (design specification, procurement specification or commissioning settings sheet) showing the setting will be applied
  - the updated model
  - the Step 6 re-test.
- **Feasibility for 1 Feb:** usually achievable if the OEM confirms in writing by [YOUR: internal date — suggest Fri 8 Jan 2027]. The holidays are the risk.

**Level 3 — Change the transfer or control scheme (S or E)**
- **What changes:**
  - re-time a load-transfer scheme to start returning within 0.25 s and reach 90% within 0.5 s
  - stage the return to mains so the current stays ≤ 150% while still reaching 90% within 0.5 s
  - remove sag-count trip logic, or make it survive six events in 90 s
  - make sure each device takes only one action per disturbance.
- **Evidence needed:**
  - a description of the control logic and its timing
  - the OEM's confirmation
  - simulation across Table A, including the six-event case and the (d) overcurrent check.
- **Feasibility for 1 Feb:** at risk. It depends on whether the logic is configurable or needs development work from the OEM.

**Level 4 — Hardware (class E)**
- **What changes:**
  - a different UPS or converter family, or a different configuration
  - a STATCOM or synchronous condenser to support voltage at the device terminals
  - a BESS.
- **Evidence needed:**
  - a sizing study across Table A
  - a validated model of the added device from its vendor
  - a procurement commitment or a documented design decision
  - checks of how the new device interacts with the rest of the facility.
- **Our readings** [R17]:
  - The rule measures grid consumption at the SDP. A device that holds up terminal voltage helps the load stay connected.
  - A BESS that carries the load during a sag reduces grid draw. That is allowed below 0.8 p.u. if the return meets (c) or (e). Between 0.8 and 0.9 p.u., however, the LCL must keep consuming, so the BESS dispatch must not cut grid draw there [R7].
  - Adding storage may make the facility co-located with an ESR, which moves the measurement point to the POIB.
  - New power electronics may affect any required subsynchronous oscillation (SSO) studies (PG §9.6(1)(d)).
  - Confirm all of these with ERCOT and the TSP.
- **Feasibility for 1 Feb:**
  - ERCOT's deck says updated models are to "demonstrate their plan to improve" ride-through. That suggests a model of a committed planned change can be submitted [R16].
  - Even so, hardware is realistic for 1 Feb only if the design decision is made in December and a validated model of the added device is available.
  - Otherwise report "not achievable". Do not tell the client there is a later window. ERCOT calls this "one update window", and we do not know of another route.

**1 Feb 2027 assessment (the wording for the report)**
- **Achievable:** every failure is M or S; the grade A or B evidence is in hand or the OEM has committed to it in writing; the re-test can be finished by the freeze date.
- **At risk:** any item depends on an OEM model release, OEM development work, or a client design decision not yet made.
- **Not achievable:** an E failure needs hardware and no validated device model exists, or the OEM cannot release or confirm before January.

**Calendar (our count).** Suppose ERCOT's result arrives on Friday 4 Dec 2026 and the inputs are complete by Monday 7 Dec. Triage then ends on Friday 11 Dec. From Monday 14 Dec to Monday 1 Feb 2027 there are about 30 business days, treating 24–25 Dec, 31 Dec–1 Jan and 18 Jan as non-working.

Plan back from 1 Feb:
- **OEM written confirmations:** by [YOUR: suggest Fri 8 Jan 2027].
- **Re-test:** complete before the freeze.
- **Submission package frozen:** by [YOUR: suggest Fri 22 Jan 2027], leaving time for client and TSP routing.
- **Format and route:** [FIND: ERCOT's required format and submission route for updated models — ERCOT says these will come with the results in early December].

## 5. Adding to the converter-family library

The aim: the second project on the same family and firmware should go from triage to a passed re-test in days, not weeks.

Make one entry per **OEM + product family + firmware version + operating mode**:

```
family_id:            [OEM]-[family]-[firmware]-[mode]
identity:             OEM; family; model/frame; rating; firmware (exact string); operating mode; topology notes
ride_through_settings:  # one row per setting
  - name | OEM default | allowed range | value that passed our suite | confirmed by | doc ref | date
model_artefacts:      PSS/E model name, version, parameter set; PSCAD component version, compiler, time step;
                      PERC1 parameters; software versions tested
validation_evidence:  test reports (with grade A–D); HIL; OEM validation statement; what may be disclosed to other clients
ercot_status:         anonymised project ID; ERCOT result; ERCOT comments verbatim;
                      did ERCOT accept family-level validation? (yes / no / not asked)  [R15]
vrt_check_margins:    for the standard suite, per clause: lowest P/P0 in each band; time to 0.9·P0adj;
                      peak I/I_max and time above I_max; actions per device; pass/fail
failure_modes:        what failed, why, and the fix that worked; settings that did NOT work
interactions:         assumptions for translating SDP to terminal voltage; cooling equipment it was paired with
permissions:          NDA ref; what the OEM lets us reuse; client permission for family-level findings
open_questions:       ...; date last confirmed with the OEM
status:               provisional | validated
```

Rules:

- **Validated vs provisional.** An entry is **validated** only when it has grade A or B evidence **and** at least one recorded ERCOT acceptance. Until then it is **provisional**.
- **No client data.** Nothing that identifies a client goes in the library. Only record family-level findings the OEM allows and the client has agreed to.
- **ERCOT's test set.** In a separate log, record every test definition and waveform ERCOT sends. Over time this tells us ERCOT's actual test set, which we do not know today [R14].

## 6. Re-test protocol before submission

ERCOT offers one update window. Do not submit until the frozen model passes the full suite.

**6.1 Freeze.** Record the model files, parameter set, software versions and file hashes. The change log must be complete, with a source for every change.

**6.2 Numerical checks.** Repeat the flat run and the initialisation checks from Q0. Check that PSS/E and PSCAD agree, where both exist.

**6.3 Source representation** (our choice [R14]). Run each case two ways:
1. Play back ERCOT's waveforms as voltage at the SDP.
2. Use a Thevenin source at the minimum short-circuit level from the TSP [FIND: the TSP's short-circuit data for the SDP].

**6.4 Test suite** (our design, not ERCOT's [R14]):

- **Table A cases.** For each band, apply the worst-case magnitude for that band and hold it for the band's minimum ride-through time:
  - 1.20 p.u. for 1.0 s
  - 0.80 p.u. for 2.0 s
  - 0.50 p.u. for 0.5 s
  - 0.35 p.u. for 0.25 s
  - [YOUR: residual voltage, e.g. 0.0–0.1 p.u.] for 0.15 s.

  Run each one twice: once recovering to 1.0 p.u., and once recovering to just above 0.9 p.u. (0.92 p.u.), which is the worst case for slow recovery.
- **Proportional-reduction checks:** mid-band cases at 0.85 p.u. and 0.65 p.u.
- **Compound trajectory:** drop below 0.35 p.u. for 0.15 s, then recover in steps through the 0.5, 0.8 and 0.9 bands, each at its cumulative time limit [R11].
- **Overvoltage:** 1.10–1.20 p.u. for 1.0 s. If the design relies on (f), also run 1.08 p.u. for 5 s (relevant before 2028 only).
- **Repeated events:** six sags within 90 s [R13]. The depth, duration and spacing are our choice: [YOUR: e.g. 0.5 p.u. for 0.2 s, every 15 s].
- **PSCAD only, as screening:** unbalanced faults (single-phase and phase-to-phase) and a phase-angle jump. Table A itself is RMS-based.
- **Load levels:** run at peak Demand and at [YOUR: low consumption level], with cooling at its design-day level.
- **Tiers:** if Step 1.2 left the tier uncertain, run both.

**6.5 Grade.** Grade every run with `vrt_check.py`. Check (5), (6) and the settings part of (7) by hand. **To pass,** every clause must pass on every case, with margin: [YOUR: margin policy — suggest reaching 0.9·P0adj within 75% of the allowed time].

**6.6 Review.**
- A second engineer reviews the classifications, the change log and the results.
- The client's facility engineer signs off the settings.
- The OEM's letter is attached.

**6.7 Package.**
- the updated model files
- the change log with its source documents
- a test report with the `vrt_check.py` output and plots
- the OEM confirmations
- the client's commitment to apply the settings at commissioning
- a list of the [R#] readings we relied on, with any answers from ERCOT.

Use the format ERCOT specifies [FIND].

**6.8 After submission.** Log ERCOT's response in the library entry (Step 5).

## 7. Report outline (day 5)

1. A one-page summary table. For each failure: the clause, the class (M/S/E/U), the evidence grade, the fix level and the 1 Feb view.
2. Applicability and tier (Step 1).
3. Details of each failure: the `vrt_check.py` output, the decision-tree path and the evidence.
4. The ranked fix path, with dependencies and dates.
5. Open questions, grouped by who should answer them: ERCOT, the TSP, the OEM or the client.
6. The [R#] readings this report relies on.

## 8. Our readings to confirm with ERCOT

These are the team's own readings of NOG §2.15 and the ERCOT process. None has been confirmed by ERCOT. Before any submission relies on one, ask ERCOT (BatchZero@ercot.com or LargeLoadInterconnection@ercot.com), or ask the TSP where noted. Keep `vrt_check.py` in line with whatever answers come back.

| R# | Topic | Our working reading | Why it matters |
|---|---|---|---|
| R1 | "Proportional to the voltage drop" | P/P0 ≥ V/V_pre: the fractional reduction is no larger than the fractional voltage drop. Alternatives would be P ∝ V², or a qualitative shape only. | Sets the pass line from 0.5 to 0.9 p.u. |
| R2 | "At the pre-disturbance level" in the continuous range | The rule states no tolerance. Use ERCOT's tolerance if its results state one; otherwise flag deviations above [YOUR: screening tolerance]. | Small dips on swells |
| R3 | Pre-disturbance level | Mean P over [YOUR: e.g. 1 s] before the disturbance | Base for every 90% test |
| R4 | "Return to 90% within 2 s" | P must reach ≥ 90% and stay there, with no later dip below 90% in the same event | Ramps that overshoot and sag |
| R5 | Cooling subtraction | Only cooling that tripped while V < 0.35 p.u. is subtracted, and it need not return. Cooling that trips above 0.35 p.u. counts as load loss. | Common model error; ERCOT may also have misgraded |
| R6 | Does a UPS going to battery count as an (e) "load-transfer scheme"? | We grade against both (c) (2 s) and (e) (0.25 s / 0.5 s), and treat (e) as governing when the reduction comes from a transfer action | **Largest single timing question** |
| R7 | Going to battery between 0.8 and 0.9 p.u. | Fails (b) ("shall continue consuming") if grid draw falls more than in proportion | Sets the minimum UPS threshold once voltage is translated to the SDP |
| R8 | Overcurrent base and window | I_max is the maximum steady-state SDP current at peak Demand. The 0.5 s is timed from the start of the disturbance. Inrush after recovery counts. | Recharge and re-acceleration inrush |
| R9 | Tier date | Which date counts as an individual LCL "satisfying" PG §9.5 (ask the TSP and ERCOT) | Decides (c)(i) or (c)(ii) |
| R10 | Allowance in (f) | Ends on 1 Jan 2028 by calendar for every LCL, not by tier | Designs that rely on tripping on overvoltage |
| R11 | Trajectories that cross bands | Test the cumulative time below each threshold (0.9, 0.8, 0.5, 0.35) against the Table A durations | Fault-like, delayed recoveries |
| R12 | Partial load loss | A permanent partial trip is a fail even if P recovers to ≥ 90%. ERCOT's deck counts "partial load loss" as a deficiency. | Composite models with small trip fractions |
| R13 | Shape of the six-events-in-90-s test | Not defined in the rule. Our case is in 6.4. | Sag-count logic |
| R14 | ERCOT's test conditions | Not public: playback or Thevenin source, short-circuit strength, which events. Our suite is our own design. | Whether our re-test predicts ERCOT's result |
| R15 | **Family-level converter model validation** | *(Secondary, consultant claim only:* ERCOT accepts it once per converter family in an OEM environment.) **Unverified.** | **Kill criterion.** The library's value depends on it. |
| R16 | Planned changes in the 1 Feb model | The deck says "demonstrate their plan to improve", so a model of a committed but not yet installed change appears acceptable. We need to know what proof of commitment ERCOT wants. | Level 3 and 4 fixes |
| R17 | Co-located loads and added BESS | At the POIB, is consumption assessed net of the co-located resource? Does adding a BESS move the measurement point? | Level 4 design |
| R18 | ~~Table A V < 0.35 row~~ **Resolved 24 Nov 2026** | The archived extract was truncated and has been fixed. It now shows `V < 0.35 | 0.15` as in the NOG Section 2 source (version 1 Nov 2026), and `vrt_check.py` encodes 0.15 s. | Deepest-band test |
| R19 | "One action per device per disturbance" | Going to battery and back is one action. A second transfer in the same event (for example on the recovery overshoot) is not allowed. Each sag in a six-sag series is a separate disturbance. | Chatter and staged return to mains |
| R20 | How ERCOT detects "remain connected" | Unclear whether ERCOT reads device trip flags inside the model or only SDP P | How to present M-class corrections |

R6, R14 and R15 matter most. Ask about them first, alongside the questions in the ERCOT email in the outreach pack.
