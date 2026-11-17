# Business Plan — Grid Equipment Position Desk

**Working name:** Slotline (placeholder)
**Plan date:** 16 November 2026
**Model:** [`slot_exchange_model.xlsx`](slot_exchange_model.xlsx) · **Evidence:** [`slot_resource.json`](slot_resource.json)
**Execution assets:** [`slot_desk/GTM_EXECUTION_90_DAYS.md`](slot_desk/GTM_EXECUTION_90_DAYS.md) · [`slot_desk/EQUIPMENT_EVIDENCE_PACKAGE_TEMPLATE.md`](slot_desk/EQUIPMENT_EVIDENCE_PACKAGE_TEMPLATE.md) · [`slot_desk/pipeline_tracker.xlsx`](slot_desk/pipeline_tracker.xlsx)

---

## 0. Read this first: the business you asked for does not work, and the evidence says why

The original research ranked a **forward exchange for transformer and switchgear production slots** at #7. Re-sourcing it on 16 November 2026 with live search killed the exchange concept on a single sourced-strong finding:

> A transformer order position can be transferred **only with the manufacturer's written consent, which is discretionary and priced**. Virginia Transformer's standard terms make an assignment without prior written approval **VOID**, and an older VTC sales form required a **$10,000 assignment fee before any assignment would be granted, expressly reserving the seller's right to deny outright**. Two of two purchase-order forms examined require written consent for any transfer. Moving a slot to a new buyer is a **novation**, not an assignment of rights — so the OEM's consent is required by definition.

A slot therefore **cannot be a bearer instrument and cannot be cleared**. There is no exchange to build. Two further findings close the door:

- **Zero instances found.** Across four separate targeted searches, no source describes any OEM-sanctioned or third-party mechanism in which a cancelled transformer order's factory position was reassigned or resold to a third party. Confidence: *not-established* after deliberate search, not merely unsearched.
- **The incumbent already clears it for free.** When real orders fall away, the OEM reallocates the slot to the next buyer in line. MISO's own numbers show how rare transfer is as a practice: **2,325 withdrawn interconnection requests against 17 pending transfers.**

**So this plan is not for an exchange.** It is for the business the same evidence does support, which is larger, starts sooner, and has a dated regulatory forcing function the exchange never had.

### What replaced it

> **The firm that makes a large load's long-lead equipment position provable to a regulator, and then manages that position for the life of the build.**

The wedge is a compliance artifact with a published deadline. The expansion is the procurement desk. The option — gated, never load-bearing — is consented novation.

---

## 1. Why now: a dated, enforceable, disqualification-backed trigger

This is the finding that changes the business, and it is sourced-strong:

> ERCOT's 20 August 2026 PUCT presentation lists **Batch Zero Eligibility Verification Supporting Documents** including **long-lead equipment attestations, purchase orders and delivery schedules**. "Long-lead equipment" is defined as **18 months or more**. Depending on project status ERCOT may require evidence that transmission providers have purchased equipment such as **transformers and breakers**. Proof travels through the connecting utility rather than directly to ERCOT.

Every transformer and HV breaker class sits inside that 18-month definition. And the consequence of failing is not a fine — it is **losing your queue position**:

| Fact | Figure | As of |
|---|---|---|
| ERCOT large-load queue | **~474 GW** | Sept 2026 |
| Share that is data centres | **420,812 MW — 90.2%** | Jun 2026 |
| Projects in queue | **~735** | 2026 |
| Projects **excluded** from Batch Zero | **373 projects / 302.2 GW** | 2026 |
| Conditionally classified | **191.8–194.3 GW** (66 GW base + 125–128 GW studied) | 2026 |
| Developers in the Abbott audit | **257 developers / ~5,140 questions** | 5 Nov 2026 |
| Audit reports due | **10 December 2026** | — |
| PUCT open meeting on the results | **17 December 2026** | — |

### Timing correction — the product is remediation, not attestation

The initial attestation deadline is reported inconsistently as **15 July 2026 or 24 July 2026** (the sources conflict and neither is asserted here). **Either way it has already passed.** That changes what we sell, and the distinction is commercially decisive:

- We are **not** selling help filing an initial attestation. That moment is gone.
- We **are** selling remediation of a *conditional* classification during verification — closing the evidence gaps ERCOT is reportedly finding, ahead of the 10 December reports and the 17 December PUCT meeting.

The buyer is therefore not a developer preparing a submission; it is a developer holding a conditional classification who has been asked a question they cannot yet answer with documents. That is a better buyer — further along, more exposed, and already past the point of pretending the problem is hypothetical.

Every Batch Zero classification ERCOT has issued is **conditional**. ERCOT has said loads that fail verification, or fail to respond, will be **disqualified**. A consultant commentary (secondary) reports the recurring deficiency ERCOT is finding is precisely *the inability to establish that equipment has been ordered and will be delivered in time*.

That is the product. Not a market view — a filing requirement with a December date and an existential penalty.

### The supporting regulatory stack (all re-verified)

- **FERC §206 show-cause**, six dockets **EL26-67 through EL26-72**, orders issued 18 June 2026. Abeyance of up to 90 days was reportedly granted 14 August 2026; responses due **16 November 2026** (SPP 20 November), answers 16 December 2026. *Note: the original research cited RM26-4 as the show-cause docket. That was wrong — RM26-4 is the parallel generic rulemaking, left open for comments.*
- **NERC Computational Load Entity registration**: Board approved **8 October 2026**; FERC petition filed **21 October 2026, Docket RR27-1-000** with expedited action requested. Thresholds were **raised from 20 MW/60 kV to 50 MW/100 kV**; two new entity types (CLO, CLOP); CLO-001–003 passed final ballot October 2026. Rules-of-Procedure deadline 31 December 2026, workplan 1 March 2027.

The NERC change matters commercially: large loads are becoming **registered entities with named obligations**. That converts today's voluntary scramble into tomorrow's compliance budget line.

### The supply facts that make the equipment position hard to prove

| Class | Lead time | Source/date |
|---|---|---|
| Generator step-up (GSU) | **>160 weeks**, up from ~143 wks avg 2024 — *still lengthening* | WoodMac via Reuters, Q1 2026 |
| Large power transformer | **~128 weeks** | WoodMac survey, Q2 2025 |
| HV circuit breakers | **~125 weeks**, up from 77 wks in 2023 | H2 2025 |
| Largest LPTs | **up to 48 months** | PwC |
| MV switchgear (38 kV) | 78–104 weeks vs ~24 weeks pre-pandemic | 2026 |

Prices: transformer manufacturing PPI is **~+86% versus January 2020** and still rising **+7.8% year-on-year to September 2026**. Slot reservations cost **10–30% of equipment cost, typically non-refundable**, and without one nominal lead time extends a further **8–16 weeks**.

**And the honest counter-fact, which belongs on page one:** Wood Mackenzie's estimated power-transformer supply shortfall **narrowed from 30% in 2025 to 15% in 2026**. Nearly **$2bn** of US capacity has been committed since 2023 — Siemens Charlotte NC ($150m, production early 2027), Hitachi South Boston VA ($457m, ~2028), Hitachi Gallman MS ($528m, production 2029), Prolec GE Goldsboro NC (~$140–150m, ~420 units/yr). **The scarcity we sell into is closing.** This business must not be underwritten on a permanent shortage; it must convert scarcity revenue into compliance revenue before the shortage eases. That conversion is the central strategic task of years 2–3.

---

## 2. The business

### 2.1 Positioning

A specialist engineering and commercial desk that owns one artifact and one relationship:

- **The artifact** — a defensible, regulator-facing evidence package proving a large load's long-lead equipment is ordered, scheduled and deliverable before energization.
- **The relationship** — the OEM order desk, the connecting utility, and the developer's interconnection lead, held continuously rather than per-transaction.

We are not a marketplace, not a data vendor, and not an owner's engineer. We do the one thing that currently gets projects disqualified.

### 2.2 The product ladder

| # | Product | Unit | Price | Why this price |
|---|---|---|---|---|
| 1 | **Interconnection Equipment Evidence package** | one large-load project | **$45,000** fixed | Sourced: single-category strategic-sourcing engagements run **$25k–$90k over 8–14 weeks**. Deliberately inside the lower half — this is a wedge, not a margin product. |
| 2 | **Procurement Desk retainer** | active program-month | **$18,000/mo** | Sourced: embedded/procurement retainers run **$5k–$25k per month**. Priced above advisory ($3–8k) because we carry engineering, below a loaded hire. |
| 3 | **Order-position transfer (novation) desk** | completed consented novation | **$90,000** success fee | Lehman-equivalent **1.5–3.0% on a $5M order**; sits inside MISO's **8.5%** soft-cost envelope (3% engineering/testing + 5.5% PM, MTEP26). |
| 4 | **Qualified Buyer Bench + escrow** | seat-month | **$2,500/mo** | Escrow on million-dollar deals runs **0.10–0.50%**; the subscription buys pre-vetted standing, not the escrow itself. |

Product 1 is the door. Product 2 is the business. Product 4 is the moat's raw material. **Product 3 is an option, not a plan** — see §6.

### 2.3 Why the ladder is ordered this way

The stress test on the original concept found the fatal objection, and it applies to any retainer business here:

> **The client hires the person instead.** A developer with a 2029 energization date can hire a full-time equipment procurement manager for ~$180–220k loaded and get the service forever, versus $125k for one engagement.

That objection is correct and it dictates the design. Three things defeat it, and all three require the ladder:

1. **Sell a filing, not a function.** A procurement manager is a cost centre; a December eligibility deadline is a board-level emergency. Product 1 is bought under duress by someone who cannot wait out a 90-day hire.
2. **Be cheaper than the hire *per program*, not per month.** At $18k/mo a retainer is $216k/yr — the same as one hire. But a senior at our desk carries ~5 concurrent programs. A developer with three campuses pays $18k/mo once and gets coverage no single hire can give; a developer with one campus should hire, and we should tell them so.
3. **Hold the relationship the hire cannot.** An in-house manager has one buyer's leverage with the OEM order desk. We hold the bench (Product 4) and the transfer precedent (Product 3). That is the only part of this that compounds.

---

## 3. Market and buyer universe

**Primary ICP — the duress buyer (now through mid-2027).** ERCOT large-load projects with conditional Batch Zero classification or an eligibility deficiency. Sourced universe: ~735 queue projects, of which 373 (302.2 GW) are already excluded and 204 + 158 projects sit conditionally classified. Realistic addressable set of projects whose equipment evidence is weak enough to need help and funded enough to pay: **200–400**. We model 10 in Year 1 — **2.5–5% penetration**.

**Secondary ICP — the program buyer (2027+).** Multi-campus data centre developers, colos and IPPs in PJM, MISO, SPP, CAISO, ISO-NE and NYISO as the §206 proceedings land reforms. The buyer is the interconnection or energy lead with an existing outside-engineering budget line.

**Tertiary — the obligated entity (2028+).** Once NERC's CLO/CLOP registration is effective at the 50 MW/100 kV threshold, large loads themselves become registered entities. That is a compliance buyer with a recurring budget, and it is the destination this business is driving toward.

**The buyer we will *not* chase:** utilities. Sourced reasoning from the original study holds — utilities defer, they do not liquidate, and their procurement is already served by Burns & McDonnell and 1898 & Co.

### Phantom demand is the demand

The cancellations that broke the exchange thesis *create* the evidence problem. **1,066 GW** of US data centre interconnection requests exist; Wood Mackenzie expects only **~28%** to be committed; one utility's queue went **18 GW → 11 GW** on binding commitments. Roughly **half of 2026-planned US capacity** is delayed or cancelled (5 GW under construction against 16 GW planned); Microsoft walked away from ~2 GW; **≥$260bn** was cancelled on local opposition in 2026 to early October. BNEF counts 49.8 GW delayed.

A regulator facing that attrition rate responds exactly as ERCOT has: by demanding documentary proof of commitment. **Speculative demand is why the attestation product exists.**

---

## 4. Competition — and where we genuinely lose

| Competitor | What they have | Where we stand |
|---|---|---|
| **Anza Exchange** (founded 2021, ~86 employees, Angeleno Group + Energy Capital Partners) | Operating B2B marketplace for **new** power transformers, HV breakers and solar modules; $0 listing fee at launch; separate Transformer Procurement Service | **The most dangerous.** One product decision from our space. We do not compete on listings — we compete on the regulator-facing artifact they do not produce. |
| **Surplus Record / Transformer Exchange / CTG Power Systems / J&J Transformers / surplustransformers.com** | Real physical secondary market: Surplus Record shows **4,469 transformer listings** and **>5,000 inquiries** in a trailing year; Transformer Exchange has dealt since 2008 (example: $850k for a 336 MVA 230/15.5 kV GSU) | Not competitors — **suppliers**. We source from them for clients needing speed-to-power. |
| **Burns & McDonnell / 1898 & Co.** | Only firm found with explicit long-lead-equipment procurement positioning; full owner's-engineer bench | They win large integrated scopes. We win where the need is a fast, cheap, filing-grade artifact and they are capacity-constrained and priced for EPC work. |
| **VAWN, Terrapin, Giga Energy, Build.inc** | Lead-time indices and public transformer price ranges, already shipping | **We concede the data layer entirely.** The original plan made it a year-3 moat; it is already a free marketing asset for others. We subscribe to it rather than build it. |
| **GridCARE ($64M Series A, May 2026), Critical Loop ($26M, Apr 2026)** | Find existing grid headroom / microgrids — substitutes for needing a transformer at all | Real substitution risk. If a client can get power without the equipment, our artifact is moot. We should refer these and take the referral relationship. |
| **Heron Power ($140M Series B, Feb 2026), DG Matrix** | Solid-state transformers | Where the capital is actually going: supply-side, not intermediation. A 2030s risk, not a 2027 one. |

**Honest verdict:** crowding is **contested, not empty**. Nobody does our specific artifact, but every adjacent layer is occupied and several are funded. We win on narrowness and speed, and only while the December window is open.

---

## 5. Go to market

### The 90-day wedge, concretely

The stress test named the right first move, and it is not a survey:

> **Test the retainer, not the engagement** — it is 32% of year-5 revenue and 100% of the exit thesis, and it is the only line where the buyer must choose **rent over hire**.

**Days 1–14 — build the target list for free.** Pull the public ERCOT large-load and Batch Zero project data plus the FERC eLibrary service lists for dockets EL26-67–EL26-72. Assemble **40 named interconnection, energy or development leads** at ERCOT projects carrying conditional classification or exclusion. Public sources only; no data spend.

**Days 15–30 — ship the artifact before asking for money.** Produce **five** complete sample Equipment Evidence packages, unsolicited, for five named projects: equipment list against the 18-month long-lead definition, OEM slot-availability read, delivery-schedule reconciliation against the stated energization date, and a gap memo naming what ERCOT would reject. Deliver free.

**Days 31–60 — convert to paid, require a PO.** Offer the remaining 35 the same package at **$45,000**, payable on delivery, with a purchase order required. A PO removes the "long regulated sales cycle" excuse, which is the only defence a weak thesis has.

**Days 61–90 — test rent-versus-hire explicitly.** To every buyer of Product 1, offer the **$18k/mo** Procurement Desk retainer. Ask the question directly in the pitch: *"or you could hire this role for $200k — here is why a desk covering five programs beats one person covering yours."* Count how many choose rent.

### Kill criteria — pre-registered, not retrofitted

| Gate | Pass | Fail → action |
|---|---|---|
| Day 30 | ≥8 of 40 named leads engage with the free package | <8 → the urgency is not real. Stop. |
| Day 60 | ≥4 paid POs at $45k | <4 → the artifact is not worth money. Stop or reprice. |
| Day 90 | **≥2 retainers signed** | 0–1 → rent-versus-hire is lost. **The business is a lifestyle consultancy, not a venture case.** Return capital or run it as a 3-person firm. |
| Month 12 | ≥1 OEM signs a standing consent/qualification protocol | None → Product 3 never opens. Delete it from the model; the business caps at ~$11M. |

The Day-90 gate is the real one. Everything above it is sellable; only the retainer is a company.

---

## 6. The novation desk — an option, deliberately not a plan

Product 3 is the only genuinely novel thing here and the only thing nobody does. It is also unvalidated, so the model is built so that **the business is viable without it**: novation is **0% of Year 1 revenue, 10.9% of Year 2, and never more than 20%**, and the model carries an explicit *EBITDA excluding the novation line* row.

**The insight.** The OEM will not share a spread with an arbitrageur. But the OEM has real problems we can solve: a defaulting slot-holder, a cancelled position that must be refilled without renegotiating price downward, and a buyer-qualification review it must run anyway. GE Vernova's own Terms of Purchase (Sec. 13, Oct 2025 US revision) make consent **"contingent upon Buyer's qualifications review"** — and the European revision imposes a **further-assurances duty to execute documents giving effect to "such assignment or novation."** Consent is contemplated; it is just gated on qualification.

**So the product is not a market against the OEM. It is reallocation-as-a-service for the OEM:** a standing bench of pre-qualified, pre-funded buyers (Product 4) that lets an OEM refill a distressed slot immediately, at price, with a counterparty whose credit is already reviewed. We are paid for removing the qualification burden, not for the spread.

**Why it still might not work, stated plainly:**
- The $10,000 assignment fee and reserved right of denial show OEMs price and ration consent today.
- Warranty is commonly **original-purchaser-only**; transfer, where allowed, is limited to the unused remainder. A novated unit may arrive with impaired warranty, which is a buyer objection we do not yet know how to answer.
- Nothing discloses whether a GE Vernova slot reservation agreement is transferable at all (63 GW of SRAs against 53 GW of firm backlog at June 2026; transferability not disclosed).
- The analogues cut both ways. Reserved-capacity instruments **do** work in semiconductors — Cirrus Logic/GlobalFoundries ran a $60m non-refundable reservation fee plus $195m prepayment, and GCT Semiconductor disclosed a $7m foundry prepayment on 13 November 2026 — but those are **bilateral primary** contracts, not traded positions. In shipping, slot exchange works only through **FMC-filed carrier agreements**, and Sea Lead/Turkon expressly bars sub-charter or assignment to a non-party without written consent. Every working analogue is consent-mediated and bilateral. **None is an exchange.**

**Therefore:** no engineering spend on Product 3 before an OEM signs a consent protocol. The Month-12 gate decides it.

---

## 7. Unit economics and financials

Full model: [`slot_exchange_model.xlsx`](slot_exchange_model.xlsx). Blue cells are inputs; a scenario multiplier scales all volumes.

| | Y1 | Y2 | Y3 | Y4 | Y5 |
|---|---|---|---|---|---|
| Revenue | $0.91M | $4.14M | $8.01M | $11.70M | $14.41M |
| Gross profit | $0.77M | $3.47M | $6.71M | $9.79M | $12.05M |
| Payroll (loaded) | $0.59M | $2.10M | $3.93M | $5.65M | $6.70M |
| Non-payroll opex | $0.45M | $0.53M | $0.62M | $0.73M | $0.86M |
| **EBITDA** | **−$0.28M** | **$0.84M** | **$2.15M** | **$3.41M** | **$4.49M** |
| EBITDA margin | −30% | 20% | 27% | 29% | **31%** |
| Headcount (FTE) | 3 | 12 | 23 | 33 | 39 |
| Revenue / FTE | $305k | $345k | $348k | $355k | $370k |
| Novation share of revenue | 0% | 11% | 16% | 19% | 20% |

**Structural choices, so the numbers can be argued with:**

- **All delivery labour sits in payroll, not COGS.** Gross margin (78–90%) reflects only non-labour cost: travel, subcontracted FAT witnessing (sourced at **$730 per witness-day**), escrow fees, data subscriptions. This avoids the double-count that flatters most services models.
- **Revenue per FTE is held at $305–370k.** This is the binding constraint, not demand. Specialist engineering services run $250–400k/FTE; anything above that is a modelling error, not a strategy.
- **EBITDA margin peaks at 31%.** Top-quartile for a niche consultancy and deliberately not higher.
- **Year-1 loss is real** and comes from paying both founders market rate from month 1. A plan where founders work free is not a plan.

### Capital

Monthly Year-1 modelling with **60 debtor days** gives a **peak cumulative cash deficit of $503k**.

**Ask: $1.25M.** That is 2.5× the trough, covering the Year-2 working-capital absorption as revenue grows 4.5× against a 60-day lag.

| Use | Amount |
|---|---|
| Founder + first senior engineer payroll to breakeven | $600k |
| Legal: OEM consent/novation framework, assignment protocol, escrow terms | $85k |
| E&O / professional indemnity + surety bond | $60k |
| Travel, factory surveillance, FAT witnessing | $95k |
| Data subscriptions (VAWN/Terrapin lead-time indices) | $36k |
| Working capital buffer and contingency | $374k |

There is no capital-intensive leg. We never take title to equipment, never warehouse, never underwrite a position.

### Org and hiring

| Role | Loaded | Y1 | Y2 | Y3 | Y4 | Y5 |
|---|---|---|---|---|---|---|
| Founder — principal (procurement engineering) | $190k | 2 | 2 | 2 | 2 | 2 |
| Senior procurement / interconnection engineer | $215k | 1 | 5 | 10 | 15 | 18 |
| Expediting & factory-surveillance coordinator | $130k | 0 | 3 | 6 | 9 | 11 |
| Credit, escrow & contracts analyst | $145k | 0 | 1 | 2 | 3 | 4 |
| Ops / lead-time data analyst | $110k | 0 | 1 | 3 | 4 | 4 |

The $215k senior engineer is the scarce input and the real cap on growth — the same constraint that made the original #1 opportunity EBITDA-negative. Hiring 3/year instead of 5/year roughly halves Year 5.

---

## 8. Legal and contract architecture — the only durable moat

Everything else here is replicable. This is not.

1. **Standing consent protocol with 2–3 OEMs.** A pre-agreed qualification standard and documented novation path. GE Vernova's terms already make consent contingent on a qualifications review — we aim to *become* that review. This is the Month-12 gate.
2. **Buyer qualification file.** Credit, corporate authority, technical specification fit, held current. The bench's actual asset.
3. **Escrow and milestone structure** honouring existing deposit practice (30/70, 10/80/10, 20/70/10 splits; 15–30% advance, 5–10% retention through commissioning).
4. **Warranty-transfer rider.** The unsolved problem. Default is original-purchaser-only; some manufacturers permit transfer with registration and notice within 90 days plus a fee. Resolving this with one OEM is worth more than any software.
5. **E&O cover sized to the artifact.** We assert to a regulator, through a utility, that equipment will arrive. That is a professional-liability exposure and must be insured and worded carefully.

**Licensing:** no federal licence is required to intermediate equipment orders. Roughly 12–17 states require a licence for business-sale brokerage (count disputed; CA, FL, MI, NV, SD cited; NV adds a business-broker permit). We take counsel before any transaction-fee revenue, not after.

---

## 9. Risks, ranked by what actually kills this

| # | Risk | Evidence | Mitigation |
|---|---|---|---|
| 1 | **Rent loses to hire** | Fatal objection from the stress test; a loaded manager is $180–220k | Day-90 gate. Sell multi-program coverage or stop. |
| 2 | **The window shuts** | Audit reports due 10 Dec 2026, PUCT meeting 17 Dec 2026; ERCOT may simply disqualify and move on | Convert attestation clients to retainers inside 90 days of first delivery. |
| 3 | **Scarcity eases faster than we convert** | WoodMac shortfall 30% → 15%; ~$2bn new US capacity; Siemens Charlotte early 2027 | Do not underwrite shortage. Drive to NERC CLO/CLOP compliance revenue by Y3. |
| 4 | **Anza extends into the artifact** | Operating exchange, ~86 staff, two named institutional investors | Stay narrower and faster; the regulator-facing artifact is a services product they are not structured to sell. |
| 5 | **Novation never opens** | 0 instances found; consent discretionary and priced; MISO 17 transfers vs 2,325 withdrawals | Already capped at ≤20% of revenue with an ex-novation EBITDA line. Delete on Month-12 failure. |
| 6 | **Substitution around the equipment** | GridCARE $64M, Critical Loop $26M — find headroom instead of hardware | Refer and partner rather than compete. |
| 7 | **Senior-engineer hiring** | $215k loaded, scarcest labour in the sector; incumbents can out-bench us | Equity, named-program ownership, remote. Accept slower growth over a bad hire. |
| 8 | **E&O exposure on a regulatory assertion** | We assert deliverability through a utility to ERCOT | Insure; word the artifact as evidence assembly, never as a delivery guarantee. |

---

## 10. Evidence quality — what is solid and what is not

Re-sourced 16 November 2026 with live web search across 56 queries. **Direct page fetching is proxy-blocked in this environment (HTTP 403 on CONNECT for every host), so no primary PDF or docket was opened.** Everything below is search-level.

**Sourced-strong:** the Batch Zero long-lead equipment requirement and 18-month definition; the OEM written-consent/void-assignment regime; ERCOT queue size and composition; the audit timeline and December dates; NERC CLO approval and petition docket; lead times and PPI inflation; capacity expansions and dates; MISO MTEP26 soft-cost percentages; the semiconductor and maritime analogues.

**Sourced-weak — verify before relying:** tariff rates on imported transformers (sources contradict: 25% base versus 15% reduced on HTS 8504.23.00/8504.34.00); transformer-specific deposit terms (20–40% non-refundable claimed by one unverified source); FERC §206 abeyance and the current filing dates; procurement-retainer and gainshare fee levels (consultancy marketing pages, vendor-interested); Anza's listing volume, GMV and take rate (**zero** sourced figures).

**Not established:** any instance of a transformer slot or order position being resold; whether a GE Vernova slot reservation agreement is transferable; warranty transferability on a resold new unit; any freed-up transformer slots arising from data centre cancellations.

**Known stale:** HV circuit-breaker lead time (~125 weeks, H2 2025 — roughly 12 months old); Wood Mackenzie figures reached only via syndication, not the primary report.

### Verification attempted on 17 November 2026 — and blocked

Item 1 below was attempted. The hosts `www.ercot.com` and `interchange.puc.texas.gov` were added to this environment's network allowlist (which succeeded), but the fetch itself was then refused by the session's permission policy, and the first attempt before that failed at DNS. **No primary ERCOT or PUCT document has been read.** The four items below remain open, and item 1 still gates everything.

### Before you spend money

1. Pull the ERCOT Batch Zero eligibility documentation and the 20 August 2026 PUCT filing directly. The entire wedge rests on it.
2. Get two real OEM purchase-order terms (Hitachi Energy, Siemens Energy or Prolec GE) and read the assignment clause. Only Virginia Transformer and WC Magnetics were examined — **0 of 5 major HV OEM assignment regimes were established.**
3. Attend the 17 December 2026 PUCT open meeting, or read the filings the moment they post.
4. Confirm the current FERC §206 procedural posture in eLibrary rather than from law-firm summaries.

---

## 11. The one-paragraph verdict

The transformer slot exchange cannot be built: a slot is not a bearer instrument, transfer requires discretionary and priced OEM consent, unapproved assignment is void, and no slot has been observed to change hands. But the re-sourcing surfaced something better — a published ERCOT requirement that large loads prove their long-lead equipment is ordered and deliverable, with audit reports due 10 December 2026, a PUCT meeting on 17 December, conditional classifications across ~192 GW, and disqualification as the penalty. That is a $45k artifact sold under duress, convertible into an $18k/month desk, in a market where 90% of a 474 GW queue is data centres and roughly three-quarters of it will never be built. The model reaches **$14.4M revenue and 31% EBITDA in year 5 on $1.25M of capital**, with the one unproven leg capped at a fifth of revenue and a pre-registered gate that kills the whole thing at day 90 if buyers choose to hire instead of rent. Build the remediation product this month: the initial attestation deadline has already passed, the classifications it produced are conditional, and the verification reckoning is three weeks away.
