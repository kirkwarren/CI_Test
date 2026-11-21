# The Opportunity — Verdict

**Date:** 21 November 2026 · **Supersedes:** the "Grid Equipment Position Desk" framing in `../BUSINESS_PLAN_transformer_slots.md`

## In one sentence

**Fix data centres that fail the grid's ride-through test — starting with the ~180 Texas projects that just failed ERCOT's, which cannot energize unless corrected models are in by about 1 February 2027 — and build the validated converter-model library that every large computational load in Texas, and then nationally, will need to stay connected.**

---

## How we got here — three pivots, each forced by evidence

| Stage | Thesis | What killed or changed it |
|---|---|---|
| Original rank 7 | Forward exchange for transformer production slots | A slot transfers only by **novation with discretionary, priced OEM consent**; unconsented assignment is void; zero resales found; MISO shows 17 transfers against 2,325 withdrawals |
| 16–18 Nov | Batch Zero equipment-evidence desk (LLE-1 to LLE-8, 10-business-day RFIs) | Real and verified — but ERCOT issued the RFIs from **9 September 2026** to "a majority" of conditional loads and the rest by end of September. With a 10+5 business-day clock, **the first wave closed in late September to late October.** A residual tail runs to **9 April 2027** under PG §9.1(8). One-off per project, and nine-plus law firms plus free explainer sites already sit next to it |
| **21 Nov** | **Ride-through remediation** | **ERCOT's own 19 November deck: 69% of ~260 Batch Zero projects failed** |

The equipment-evidence work survives as a small attach on the same customers. It is not the business.

---

## The evidence

### 1. A dated, existential demand spike — ERCOT primary source

From *"ERCOT's Update — Overview of Voltage Ride-Through Test Results"*, Large Load Working Group, 19 November 2026 (posted 18 Nov):

- **"VRT Tests for ~260 LL projects were Performed"**, September–November 2026, against NOG 2.15.
- **"Preliminary results indicate that 31% of the tested LCLs rode through the voltage disturbance."** → **69% failed, roughly 180 projects.**
- Causes: **68% full or partial load loss**, **24% slow recovery**.
- **"ERCOT plans to provide the results in early December 2026."**
- **"One update window — ILLEs may provide updated models by January 2027"**; timeline shows **1 February 2027** "updated models due for ride-through improvements".
- **"Batch Zero projects subject to the NOG Section 2.15 VRT requirements will not be eligible for QSA if their dynamic models do not demonstrate the applicable ride-through performance."**
- **"BZ projects without a QSA will not be granted an Initial Energization request."**
- Next windows: stability-study QSA 1 Feb–30 Apr 2027 for Q4 2027 energization; QSA prerequisites by 31 Jul 2027 for Q1 2028 energization.

Public pickup has barely started: one Energy Central post around 20 November; no consultant or law-firm write-ups found as of 21 November.

### 2. A standing rule, not a one-off test — NOG §2.15, primary text

Nodal Operating Guide Section 2 (version 1 November 2026), §2.15 *Voltage Ride-Through Requirements for Large Computational Loads*, created by NOGRR282 (PUCT-approved 9 July 2026, **effective 1 August 2026**):

- **Applies to almost everything in Batch Zero.** Exemption requires energization approval, or executed interconnection agreements plus notice-to-proceed plus funded facilities, **by 14 November 2025**.
- **Table A** (minimum ride-through at the Service Delivery Point): 1.10–1.20 pu **1.0 s** · 0.90–1.10 pu **continuous** · 0.80–0.90 pu **2.0 s** · 0.50–0.80 pu **0.5 s** · 0.35–0.50 pu **0.25 s** · below 0.35 pu **0.15 s**.
- **"An LCL shall remain connected to the Transmission Grid during voltage conditions requiring ride-through."** Must **return to 90% of pre-disturbance consumption within two seconds** of voltage recovering above 0.9 pu.
- Load-transfer schemes must begin returning **within 0.25 s** and reach **90% within 0.5 s**. Overcurrent ≤ 150% for ≤ 0.5 s. **No trip on a count of sags**; must survive **six sags or swells in 90 seconds**.
- **A stricter tier** applies to loads completing PG §9.5 **after 1 January 2028**: they must keep consuming active power between 0.8 and 0.5 pu.
- **Every real-world failure triggers work:** root-cause report **within 90 days** of ERCOT's request → mitigation plan **within 90 days** → implementation **within 180 days** of approval. ERCOT **"may require the LCL to disconnect"** if the failure poses imminent risk.

That last clause turns this from a Batch Zero sprint into a lifetime obligation for every large computational load in ERCOT.

### 3. It recurs, and it goes national

- **Batch One** applications expected to open **Summer 2027** (ERCOT, 18 June 2026); new projects and Batch Zero exclusions enter there, under the same §2.15 rule.
- **NERC:** registration petition for Computational Load Owner/Operator, **FERC Docket RR27-1-000, filed 21 October 2026**; PJM filed supportive comments 20 November. Draft standards CLO-001-1 to CLO-003-1 are due at FERC by **31 December 2026** (RD26-7). Per secondary summaries, CLO-001-1 requires ride-through and disturbance-recovery parameters in planning models, **updated at least every 13 months**, with model verification against installed equipment — **nationally, at 50 MW and up**, likely from mid-2027. *(Sourced-weak; standard text not yet read.)*

### 4. The stakes per buyer dwarf any fee

Batch Zero: ~362 conditionally included loads, ~194 GW — roughly **500 MW per project**. Security under 16 TAC §25.194 is **$50,000 per MW**, so an average project has about **$25M posted** *(arithmetic, not sourced per project)*, before multi-billion-dollar campus capex. Missing 1 February means missing the Feb–Apr 2027 QSA window and Q4 2027 energization.

### 5. Crowding — contested, but thin at the point that matters

The visible specialists are small boutiques with no published headcount: **Keentel Engineering, Zero Emission Grid, EPE Consulting, Power Systems Consultants, INS Engineering, Quanta Technology**, with Electranix working alongside ERCOT on investigations. Productised tools are appearing (Inertiafy; open-source *perc-studio* with a NOGRR282 preset). Siemens PTI, Hitachi Energy, GE Vernova consulting and 1898 & Co showed no ERCOT large-load ride-through offer.

**The bottleneck is not study hours.** Keentel quotes 3–5 weeks for a submission-ready PSS/E plus PSCAD package and 4–8 weeks for a full data-centre package — and says **OEM model release under NDA is the most common cause of delay, often "months of commercial negotiation."** Early-December results, a 1-February deadline and the holidays in between: projects that need a *new* OEM model will miss the window.

### 6. Where the leverage is

- **68% of failures are load loss** — UPS and power-supply trip and transfer behaviour, which points to **settings and firmware**, not grid hardware.
- **Schneider Electric** has shown NERC "firmware-updated" UPS behaviour protecting both the critical load and the grid (NERC LMWG, 27 Jan 2026). **Eaton** told ERCOT its UPS carries full load without battery to about −15% voltage and proposed keeping the rectifier online through ride-through (ERCOT, July 2025).
- ERCOT reportedly accepts **converter model validation once per converter family** in an OEM environment *(Keentel; sourced-weak)*.

**So the fix scales by OEM family, not project by project.** A handful of UPS and converter families probably cover most of the ~180 failures.

---

## What the business is

**A ride-through remediation firm whose asset is a library of ERCOT-accepted, validated converter-family models and ride-through settings.**

1. **Now to 1 Feb 2027 — the Batch Zero sprint.** Diagnose each failure (bad model vs genuinely non-compliant facility), re-parameterise in PSS/E and PSCAD using validated family models and OEM ride-through settings, re-run the §2.15 Table A tests, submit before the window closes. Where the facility truly fails, specify the fix: UPS firmware and settings first; STATCOM, synchronous condenser or BESS only when necessary.
2. **2027 — Batch One and QSA cycles.** Same rule, new cohort, opening Summer 2027.
3. **Ongoing — the §2.15(8) obligation.** Every real ride-through failure means a 90-day root-cause report, 90-day plan and 180-day implementation. A retainer covers it.
4. **Mid-2027 onward — NERC CLO-001.** 13-month model updates and model verification for every computational load ≥ 50 MW in the US. The ERCOT library becomes a national product.

**The moat compounds.** Each validated family model makes the next project faster. Each converter family covered is a reason every developer using that hardware calls you first. Consultants competing project-by-project cannot match that unit cost once the library exists.

**Partner with OEMs, don't race them.** Schneider, Eaton and Vertiv hold the hardware truth and have already engaged NERC and ERCOT. The independent's job is integration: project-specific parameterisation, ERCOT submission, and the 90-day root-cause work OEMs don't want to own.

---

## Sizing — estimates, clearly labelled

No consultant publishes prices. Public anchors: a **$10,000** model-evaluation deposit and **$300,000** EMT-study deposit (SPP, via Zero Emission Grid); full OEM product-level PSCAD packages **"typically run into six figures"** (Keentel); a **$100,000** PUCT large-load study fee.

| | Estimate |
|---|---|
| Price per project remediation | **$75k–$300k**, depending on whether a validated family model already exists *(estimate)* |
| Projects likely to buy in the Batch Zero sprint | **~90–110 of ~180** — some will be excluded at verification, some will wait *(judgement)* |
| Near-term market, Dec 2026–Apr 2027 | **~$10–25M** across all providers *(estimate)* |
| A new entrant winning 10–20 projects | **~$1.5–4M in about five months** *(estimate)* |
| Probability developers pay for remediation in real volume during 2027 | **~80–85%** *(analyst judgement, not sourced)* |

The sprint is the beachhead. The value is in being the default for Batch One, the §2.15(8) events and NERC CLO-001 afterwards.

---

## Risks, ranked

1. **Political freeze.** Governor-elect Gina Hinojosa (inaugurated **19 January 2027**; Legislature convenes **12 January 2027**) has pledged to pause new data-centre permits and approvals until new protections pass. She has said she cannot stop projects already under construction; whether "permitted but not operating" projects are covered is unverified. Chance of a material energization freeze on Batch Zero projects in 2027: **~20–30%** *(judgement)*. The main pre-filed bill, **SB 338** (16 co-authors, largely Republican), covers data centres new after **1 September 2027** and turns on water use, not reliability.
2. **Schedule slip.** ERCOT has reportedly said it will miss the **9 April 2027** study-results deadline and an extension is expected (Gibson Dunn, 18 Nov). If the study slips, the 1 February model deadline may move too — less urgency, longer window.
3. **Verification exclusions.** ERCOT files its Batch Zero eligibility verification report with the PUCT by **10 December 2026**, ahead of the PUCT's **17 December** open meeting (Gibson Dunn, Utility Dive). No exclusion count is public; some of the 180 failures may simply be removed.
4. **OEMs capture the fix.** If UPS vendors ship validated models and firmware straight to developers, the independent is squeezed. Mitigation: partner.
5. **Incumbent boutiques move first.** Keentel and Zero Emission Grid publish LLWG summaries routinely and will market this within days.
6. **The skill barrier.** This needs senior power-systems engineers fluent in PSCAD, PSS/E and UPS converter behaviour. It is a strong moat for whoever has them and a hard entry for anyone who doesn't. **Without that bench, this is a hire-or-partner play, not a build-it-yourself one.**
7. **Preliminary numbers.** The 31/69 split is ERCOT's preliminary figure; ERCOT may correct some models itself.

---

## Corrections to earlier statements in this study

- **The equipment-evidence RFI desk is not the main opportunity.** I framed it on 18 November as a rolling clock ERCOT "can fire at any project on any morning". That remains legally true until 9 April 2027, but ERCOT issued the bulk of RFIs in September, so most first-round demand has already passed.
- **17 December 2026.** On 18 November I "corrected" this to an ERCOT LLWG meeting rather than a PUCT open meeting. Both happen: the LLWG meets that day (ERCOT calendar), and Gibson Dunn and Utility Dive report the PUCT meeting on the verification report. The 10 December filing date is supported by several sources.

---

## What is still unverified

- The text of NERC CLO-001-1 to CLO-003-1 (drafts due at FERC 31 December 2026).
- ERCOT's converter-family validation practice (sourced only to a consultant).
- The OEM mix behind the ~180 failures — the single most valuable number for sizing the library, and not public.
- Queue and project counts beyond secondary reporting (the PUC docket returns HTTP 402).
- Any consultant pricing.

## Sources

ERCOT primary documents read in full are archived as text in `primary_sources/` (see its README). Market, crowding and risk findings, with URLs and confidence ratings: `market_sweep_2026-11-21.json` and `vrt_check_2026-11-21.json`.
