# INTERCONNECTION EQUIPMENT EVIDENCE PACKAGE

### Working template and preparer's instructions

**Template version:** 1.0 | **Template as-of date:** 17 November 2026
**Deliverable type:** Fixed-scope evidence assembly and reconciliation package
**Prepared for submission through:** the Transmission/Distribution Service Provider (TDSP) connecting the Project — **not** directly to ERCOT

---

> ## VERIFICATION STATUS BANNER — READ BEFORE USE OR SUBMISSION
>
> **THE REGULATORY REQUIREMENTS THIS TEMPLATE IS BUILT AGAINST ARE SEARCH-LEVEL SOURCED. NO PRIMARY DOCUMENT HAS BEEN OPENED.**
>
> Every requirement, deadline, document category and threshold reproduced in this template was collected from secondary reporting and search summaries, re-sourced **16 November 2026**. **No ERCOT filing, no PUCT docket document in Project No. 59142, no Nodal Protocol section, no TDSP submission instruction and no OEM contract was retrieved, opened or read.** Attempts to retrieve primary documents were blocked, first by a network proxy and then by a permission policy. Nothing in this template is a substitute for the authoritative text.
>
> **Before this package is submitted, the preparer must verify the requirement set against:**
> 1. **PUCT Project No. 59142** — the open docket under which the Batch Zero framework and its eligibility verification process are being administered. Read the filings themselves.
> 2. **ERCOT's own current published documentation** — the ERCOT presentation to the PUCT reported as dated **20 August 2026** (the source of the supporting-document list in Section 4), plus any superseding ERCOT notice, market notice, guide revision or verification instruction issued after that date.
> 3. **The connecting TDSP's own written submission instructions** for this Project, which govern format, routing, deadline and completeness. Where the TDSP's instruction differs from this template, **the TDSP instruction controls and this template must be conformed to it before use.**
>
> **Two further standing cautions:**
> - **The attestation deadline is reported inconsistently as 15 July 2026 and as 24 July 2026.** These have not been reconciled and **neither is stated as fact anywhere in this template.** See Section 1.6.
> - **All Batch Zero classifications issued are reported to be CONDITIONAL.** Loads that fail verification, or that fail to respond to verification enquiries, are reported to be subject to disqualification. A conditional classification is not an entitlement.
>
> **Do not delete, relocate, shrink or soften this banner.** It must appear on page 1 of every issued version of the completed package. If a reviewer, client or counterparty asks for it to be removed, that request is escalated to the engagement principal and recorded in Appendix H.

---

## SECTION 0 — HOW TO USE THIS TEMPLATE

### 0.1 Who this is for

The preparer is expected to be a competent procurement or interconnection engineer with access to the Owner's purchase records. The reader is expected to be the Owner's project team, the Owner's counsel, and — through the TDSP — a regulatory reviewer. The package must survive being read by all three.

### 0.2 Filling-in conventions — use these literally

| Convention | Meaning | Rule |
|---|---|---|
| `[OWNER TO SUPPLY: ...]` | A fact only the Owner holds | Must be replaced before issue. Never guessed. |
| `[PREPARER TO COMPLETE: ...]` | Preparer's own work product | Must be replaced before issue. |
| `[VERIFY: ...]` | A figure, date or requirement that is not established in the evidence base and must be checked against a primary source | **May be issued still in place**, but must then also appear as a row in the Gap Memo (Section 6) and in Appendix E. |
| `[ILLUSTRATIVE]` | A worked example row showing the required format | **Must be deleted from the issued package.** See 0.5. |
| `n/a` | Genuinely not applicable | Must carry a one-line reason. |
| *(blank cell)* | **Never acceptable in an issued package** | A blank is either `n/a` + reason, or a `GAP`. |

**Do not invent a number to fill a cell.** An honest `[VERIFY: ...]` plus a Gap Memo row is a defensible deliverable. A fabricated figure is not, and it is the single fastest way to lose the Owner their conditional classification and to put this firm's professional liability in issue.

### 0.3 Units, dates, and arithmetic conventions

- **Dates:** `DD Mmm YYYY` (e.g. `04 Mar 2028`). Never `03/04/2028`.
- **Durations:** **weeks** as the primary unit, with calendar days in parentheses on every float calculation, e.g. `+11 weeks (+79 days)`.
- **A week is 7 calendar days.** No working-day calendar, no holiday calendar, no OEM shutdown calendar is applied unless a specific line says so and names the calendar used.
- **Rounding:** compute in days, report weeks to the nearest whole week, and show the day figure so the reader can re-derive it. Never round a negative float toward zero.
- **The 18-month long-lead threshold is used in this template as 78 weeks (547 days).** This conversion (18 × 4.333 weeks) is a **preparer assumption**, not a sourced definition. See Appendix D, assumption `A-02`, and the `[VERIFY]` in Section 3.1.

### 0.4 The three-state verification marker — definitions are binding

Every evidentiary assertion in this package carries exactly one of three states. These definitions are not adjustable by the Owner.

| State | Means | Does **not** mean |
|---|---|---|
| **VERIFIED** | The named preparer has personally examined a **complete and legible primary document** (executed purchase order, countersigned order acknowledgement, executed contract or amendment, OEM-issued delivery schedule, invoice, or bank/treasury confirmation of payment), has logged it in the Document Register (Appendix A) with custodian and date, and the document **on its face** supports the specific assertion made. | That the document is authentic; that the counterparty is solvent; that the counterparty will perform; that the date will hold; that the equipment exists. |
| **ASSERTED** | The assertion originates from the Owner, the Owner's agent, an OEM representative, a broker, or a secondary source, and **no primary document supporting it has been examined by the preparer.** Covers: verbal statements, email summaries of a document, spreadsheet extracts, screenshots, and "the document exists but has not been produced to us." | Anything about the assertion's truth. ASSERTED is a statement about **our evidence**, not about the Owner's honesty. |
| **GAP** | No document exists, or none can be produced within the submission window. **Also used** where a document exists but on its face contradicts the assertion. | That the fact is false — only that it is unproven and unprovable on the current record. |

**Qualifiers** (append in the Qualifier column, never substitute for the state): `REDACTED` (only a redacted copy seen — say what was redacted), `PARTIAL` (document incomplete — say what is missing), `CONTRADICTORY` (document conflicts with the assertion — explain in the Gap Memo), `PENDING` (production promised — give the promised date and the promisor).

**Marker discipline — mandatory:**
1. Only the individual named in the `Verified by` column may set a line to **VERIFIED**, and only after making an Appendix A entry.
2. A marker may **never** be upgraded on the strength of a verbal assurance, a client instruction, or schedule pressure.
3. Every marker change after first issue is logged in Appendix H with who requested it, who approved it, and the document that justified it.
4. If the Owner instructs the preparer to upgrade a marker without a document, the preparer **declines, records the instruction in Appendix H, and notifies the engagement principal.** This is not negotiable and is the clause that protects both parties.

### 0.5 Worked example rows

Every table in this template contains at least one row marked `[ILLUSTRATIVE]` and shaded in italics. These exist so the required format and the required arithmetic are unambiguous. **They are fictitious. OEM names in example rows are written as `OEM-A`, `OEM-B` — never substitute a real manufacturer's name into an example.** Delete every `[ILLUSTRATIVE]` row before issue; Checklist item `C-58` confirms this.

### 0.6 What this package is and is not

**It is:** a reconciled, indexed, source-marked evidence file showing what the Owner has actually bought, what proves it, when it is contractually due, and whether that date supports the energization date — with gaps stated rather than concealed.

**It is not:** a guarantee of delivery, a guarantee of eligibility, a guarantee of classification, an engineering certification, a legal opinion, a valuation, or a forecast. Section 2 says this in the language that governs.

---

## SECTION 1 — COVER SHEET AND SCOPE

### 1.1 Project identity

| Field | Entry |
|---|---|
| Project name (as used in the interconnection request) | `[OWNER TO SUPPLY]` |
| Project legal owner — exact registered entity name | `[OWNER TO SUPPLY]` |
| Jurisdiction of formation / registration number | `[OWNER TO SUPPLY]` |
| Parent / sponsor, if different | `[OWNER TO SUPPLY]` |
| **Entity that holds the equipment purchase orders** (if different from the project owner, go immediately to Gap `G-05`) | `[OWNER TO SUPPLY]` |
| End-use customer, if known and different from the Owner | `[OWNER TO SUPPLY]` |
| Is the developer also the end-use customer? (Y/N) — drives the retail service agreement requirement, Section 4.2 item 6 | `[OWNER TO SUPPLY]` |
| Site address / county | `[OWNER TO SUPPLY]` |
| Load type as declared in the interconnection request | `[OWNER TO SUPPLY]` |

### 1.2 Point of interconnection and electrical scope

| Field | Entry | Evidence ref |
|---|---|---|
| Point of interconnection (POI) — substation / line name | `[OWNER TO SUPPLY]` | `[EV-xxx]` |
| POI voltage (kV) | `[OWNER TO SUPPLY]` | `[EV-xxx]` |
| Requested capacity (MW) — total | `[OWNER TO SUPPLY]` | `[EV-xxx]` |
| Requested capacity split: base load (MW) / studied load (MW) | `[OWNER TO SUPPLY]` | `[EV-xxx]` |
| Ramp / phasing profile (MW by date), if phased | `[OWNER TO SUPPLY]` | `[EV-xxx]` |
| Target energization date (`ED`) — **the single date all of Section 5 is reconciled against** | `[OWNER TO SUPPLY]` | `[EV-xxx]` |
| Source of `ED` (contract milestone / Owner plan / TDSP study / lender covenant) | `[OWNER TO SUPPLY]` | `[EV-xxx]` |
| Has `ED` changed since the interconnection request? If yes, give both dates and the date of change | `[OWNER TO SUPPLY]` | `[EV-xxx]` |

> **Preparer note on `ED`:** the energization date is the denominator of every float calculation in this package. If the Owner revises `ED` during preparation, **do not silently re-baseline.** Log it in Appendix H, re-run Section 5, and show both the old and new float in the issued package. Moving `ED` to the right is a legitimate project decision; using it to make a negative float disappear without saying so is not.

### 1.3 TDSP and routing

| Field | Entry |
|---|---|
| Connecting TDSP (exact entity name) | `[OWNER TO SUPPLY]` |
| TDSP interconnection contact — name, role, email, phone | `[OWNER TO SUPPLY]` |
| TDSP's own reference / project number for this Project | `[OWNER TO SUPPLY]` |
| TDSP submission channel (portal / email / sFTP / physical) | `[VERIFY: obtain the TDSP's written submission instruction. Do not assume.]` |
| TDSP-stated submission deadline for this Project | `[VERIFY: obtain in writing from the TDSP]` |
| TDSP format requirements (file naming, page limits, index format, native vs PDF) | `[VERIFY: obtain in writing from the TDSP]` |
| Has the TDSP confirmed receipt? Date and reference | `[PREPARER TO COMPLETE after submission]` |

> **Routing rule.** The reported process is that **proof of eligibility travels through the connecting utility (TDSP), not directly to ERCOT.** `[VERIFY against PUCT Project No. 59142 and the TDSP's instruction.]` Accordingly: **do not transmit this package to ERCOT directly** unless the TDSP or ERCOT instructs it in writing, and log any such instruction in Appendix H. Sending regulatory evidence down the wrong channel can be treated as a failure to respond.

### 1.4 ERCOT project and queue identifiers

| Field | Entry | State |
|---|---|---|
| ERCOT interconnection request / queue number | `[OWNER TO SUPPLY]` | `[VERIFIED / ASSERTED / GAP]` |
| ERCOT project name of record | `[OWNER TO SUPPLY]` | |
| Large load interconnection request date | `[OWNER TO SUPPLY]` | |
| ERCOT study stage reached (screening / study / agreement) | `[OWNER TO SUPPLY]` | |
| Any ERCOT-assigned Batch Zero reference or tracking number | `[OWNER TO SUPPLY]` | |
| Related registration identifiers (if any) | `[OWNER TO SUPPLY]` | |

### 1.5 Batch Zero classification status

| Field | Entry |
|---|---|
| Has the Project received a Batch Zero classification notice? (Y/N) | `[OWNER TO SUPPLY]` |
| Date of notice | `[OWNER TO SUPPLY]` |
| Classification as stated in the notice | `[OWNER TO SUPPLY]` |
| **Is the classification conditional?** | **Reported: all Batch Zero classifications issued are CONDITIONAL.** Confirm against the Project's own notice and record the notice's exact wording here: `[OWNER TO SUPPLY — quote verbatim]` |
| Conditions stated in the notice, itemised | `[OWNER TO SUPPLY — list each, verbatim]` |
| Has the Project received verification enquiries / questions? (Y/N, count, date received, response due) | `[OWNER TO SUPPLY]` |
| Response status for each enquiry | `[PREPARER TO COMPLETE — cross-reference to Section 6]` |
| Was the Project among those **excluded** from Batch Zero? (Y/N) — if yes, this package's purpose changes; escalate before proceeding | `[OWNER TO SUPPLY]` |

**Reported programme context** (search-level, all items `[VERIFY]` against PUCT Project No. 59142):

- PUCT approved Batch Zero **18 June 2026**.
- Governor's letter reported **3 August 2026**; classification notices reported **suspended 7 August 2026**; conditional classifications reported issued **from 3 September 2026**.
- **373 projects / 302.2 GW** reported excluded from Batch Zero. Conditional classifications reported at **191.8–194.3 GW**, comprising **66 GW base load (204 projects)** and **125.4–127.9 GW studied load (158 projects)**. The ranges are as reported and are **not** reconciled here.
- **257 developers / approximately 5,140 questions** reported **5 November 2026** — **this figure is reported and unverified**, and is included only as context for expected reviewer scrutiny.
- **Audit reports reported due 10 December 2026. PUCT open meeting reported 17 December 2026.** These are the nearest reported programme dates after this template's as-of date and should drive the preparation calendar.
- **Community Impact Audit threshold reported at 25 MW.** What the threshold triggers, who performs the audit, and what must be filed are **not** established in the evidence base: `[VERIFY: scope, owner and filing requirement of the 25 MW Community Impact Audit threshold — PUCT Project No. 59142]`. If the Project exceeds 25 MW — which almost every project using this template will — raise Gap `G-13`.

### 1.6 THE ATTESTATION DEADLINE — CONFLICTING AS REPORTED

> **This template does not state the attestation deadline, because the evidence base does not establish it.**
>
> The deadline for long-lead equipment attestations is reported in secondary sources **both as 15 July 2026 and as 24 July 2026**. The two reports have not been reconciled. **No primary document was opened.** Nine days separate them, and a nine-day error on a regulatory attestation deadline is a disqualification risk.
>
> **Both dates precede this template's as-of date of 17 November 2026.** Whichever is correct, the date has passed. That has three consequences the preparer must resolve on the record and must not paper over:
>
> 1. **If the Project filed an attestation**, record the actual filing date, the channel, the recipient, and the acknowledgement — and state which of the two reported deadlines it met (or both, or neither). Fill in the table below.
> 2. **If the Project did not file**, this is a live and serious Gap (`G-06`), not a formatting issue. Raise it, and obtain counsel's position before submission.
> 3. **If a later, superseding or re-opened deadline applies** — for example a deadline tied to the conditional-classification verification round, to the reported **10 December 2026** audit reports, or to a TDSP-specific response window — then the July 2026 dates may not be the operative deadline for this package at all. `[VERIFY: identify the deadline that actually governs this submission, in writing, from the TDSP or from PUCT Project No. 59142.]`

| Field | Entry |
|---|---|
| Reported deadline, variant 1 | **15 July 2026** — secondary reporting, unreconciled, no primary document opened |
| Reported deadline, variant 2 | **24 July 2026** — secondary reporting, unreconciled, no primary document opened |
| **Deadline the TDSP or PUCT states in writing** | `[VERIFY: obtain and quote the authoritative date. Until obtained, leave this row as a live VERIFY and carry Gap G-06.]` |
| Did the Project file a long-lead equipment attestation? (Y/N) | `[OWNER TO SUPPLY]` |
| Actual filing date | `[OWNER TO SUPPLY]` |
| Filed with / through whom | `[OWNER TO SUPPLY]` |
| Acknowledgement received? Reference and date | `[OWNER TO SUPPLY]` |
| Signatory name and title | `[OWNER TO SUPPLY]` |
| Evidence state of the filing | `[VERIFIED / ASSERTED / GAP]` |
| Which reported deadline did the actual filing date satisfy? | `[PREPARER TO COMPLETE: state plainly — "both", "the later only", or "neither". Do not characterise it as compliant without the authoritative date.]` |

### 1.7 Scope of this package

**In scope.** Assembly, indexing, source-marking and schedule reconciliation of equipment-procurement evidence for the Project; identification of gaps against the reported ERCOT supporting-document list reproduced at Section 4.2; a remediation memo with owners and dates.

**Out of scope** — stated here and repeated in Section 2:

- Any guarantee, warranty or assurance that equipment will be delivered, on any date.
- Any guarantee that the Project will pass eligibility verification, retain a conditional classification, or be energized.
- Independent audit of OEM manufacturing capacity, factory loading, order books or slot integrity.
- Authentication or forensic examination of documents produced to the preparer.
- Legal advice, legal opinion, or representation before the PUCT, ERCOT or the TDSP.
- Engineering design, design certification, or any sealed professional engineering work product. `[VERIFY with counsel whether any element of the issued package requires a Texas-licensed professional engineer's seal; if so, that element is excluded from this scope until separately engaged.]`
- Valuation, price opinion, or fairness opinion on any purchase price or deposit.

### 1.8 Document control

| Field | Entry |
|---|---|
| Package version | `[PREPARER TO COMPLETE]` |
| **Data date** — the date to which all evidence is current; **no fact in this package is current beyond it** | `[PREPARER TO COMPLETE]` |
| Issue date | `[PREPARER TO COMPLETE]` |
| Prepared by (name, role) | `[PREPARER TO COMPLETE]` |
| Reviewed by (name, role) | `[PREPARER TO COMPLETE]` |
| Engagement principal | `[PREPARER TO COMPLETE]` |
| Engagement basis | Interconnection Equipment Evidence Package — **$45,000 fixed per project**. `[PREPARER TO COMPLETE: conform to the executed engagement letter; the engagement letter controls.]` |
| Distribution list (named recipients only) | `[PREPARER TO COMPLETE]` |
| Confidentiality legend | Confidential and commercially sensitive. Contains OEM pricing and contract terms. Distribution limited to the named recipients and to the TDSP and regulatory reviewers for the purpose of eligibility verification. |

### 1.9 Executive summary — complete this LAST

| Measure | Value | Where derived |
|---|---|---|
| Equipment lines meeting the 18-month long-lead test | `[PREPARER TO COMPLETE]` of `[ ]` | §3 |
| Lines **VERIFIED** / **ASSERTED** / **GAP** | `[ ]` / `[ ]` / `[ ]` | §4 |
| **Minimum float across all lines (program float)** | `[PREPARER TO COMPLETE — state the sign explicitly]` | §5.6 |
| Critical line (the one setting program float) | `[PREPARER TO COMPLETE]` | §5.6 |
| **Number of lines with negative float** | `[PREPARER TO COMPLETE]` | §5.5 |
| Open gaps: total / critical | `[ ]` / `[ ]` | §6 |
| Reported ERCOT supporting-document categories fully evidenced | `[ ]` of 8 | §4.2 |
| Lead-time benchmarks relied on that are **STALE** | `[ ]` | Appendix C |
| Live `[VERIFY]` items at issue | `[ ]` | Appendix E |

> **Summary drafting rule.** The executive summary states the program float **with its sign**, and states the number of negative-float lines, **on page 1**. If program float is negative, the summary says so in its first sentence. The summary is not a sales document and is not written to reassure.

---

## SECTION 2 — PREPARER'S STATEMENT

> **This is the operative language. It is drafted to be issued as written.**
>
> **Do not edit, abridge, reorder, reposition or re-tone any paragraph of Section 2.** Insert only the bracketed identifying details. Any requested change — from the Owner, the Owner's counsel, a lender, the TDSP, or anyone else — is referred to the engagement principal and this firm's counsel, is **never** accepted by the preparer directly, and is logged in Appendix H. A deletion here is the firm's professional-liability exposure, not a wording preference.

---

### STATEMENT OF THE PREPARER

**2.1 Identification.** This Interconnection Equipment Evidence Package (the "Package") was prepared by `[PREPARER FIRM]` (the "Preparer") for `[OWNER LEGAL ENTITY]` (the "Owner") in respect of `[PROJECT NAME]` (the "Project"), and is current only to the data date of **`[DATA DATE]`** (the "Data Date").

**2.2 What the Preparer did.** The Preparer **assembled, indexed, source-marked and reconciled** evidence of equipment procurement for the Project. Specifically, the Preparer (a) collected documents and statements produced by the Owner, the Owner's agents and, where the Owner authorised direct contact, equipment manufacturers; (b) recorded each document in a Document Register; (c) assigned to each evidentiary assertion a verification state of VERIFIED, ASSERTED or GAP according to the definitions set out in this Package; (d) compared contractual delivery dates to the Owner-supplied target energization date and calculated float; and (e) identified gaps in the evidentiary record and set out remediation steps.

**2.3 What the Preparer did not do.** The Preparer did **not**: audit, inspect or verify any manufacturer's production capacity, factory loading, order book, slot allocation or ability to perform; authenticate any document or verify any signature; inspect any equipment; examine the creditworthiness or solvency of any party; perform any engineering design, analysis or certification; provide legal advice or any legal opinion; value any asset, purchase price or deposit; or prepare, audit or opine on any financial statement or projection.

**2.4 THE PREPARER DOES NOT GUARANTEE DELIVERY.** The Preparer makes **no representation, warranty, guarantee, assurance or undertaking of any kind** that any item of equipment identified in this Package will be manufactured, released, shipped, delivered, accepted, installed, energized, or made available on any date or at all; that any delivery window, schedule, forecast or commitment stated by any manufacturer, supplier, vendor, broker or agent will be met; or that any contractual remedy for late delivery will be available, collectible, or adequate. **All delivery dates, delivery windows, lead times and schedules reproduced in this Package are the statements of the parties who made them and are not the Preparer's forecasts, predictions, estimates or opinions.** The Preparer has no means of compelling performance by any manufacturer and does not purport to have any.

**2.5 No guarantee of regulatory outcome.** The Preparer makes **no representation, warranty, guarantee or assurance** that this Package, or any part of it, will satisfy any requirement of the Electric Reliability Council of Texas, the Public Utility Commission of Texas, the connecting Transmission/Distribution Service Provider, or any other authority; that the Project will be found eligible under the Batch Zero framework; that any classification issued to the Project will be confirmed, retained, made unconditional or not withdrawn; or that the Project will be studied, approved, interconnected or energized. **Eligibility determinations are made by others on records and criteria the Preparer does not control and has not seen in full.** The Preparer notes that all Batch Zero classifications are reported to be conditional and that loads failing verification, or failing to respond to verification enquiries, are reported to be subject to disqualification.

**2.6 Sources of information, and reliance on the Owner.** Except where a line is expressly marked VERIFIED, the factual content of this Package derives from information furnished by the Owner and by third parties. **The Preparer has relied on that information without independent verification, and has assumed it to be complete, accurate and not misleading.** The Owner is responsible for the completeness of what it produced. Where the Owner has withheld, not located, or not produced a document, the affected line is marked ASSERTED or GAP and **the Preparer expresses no view on the underlying fact.** The Preparer has not assumed, and does not accept, any responsibility for information the Owner did not disclose.

**2.7 Meaning and limits of the verification markers.** The markers used in this Package describe **the state of the Preparer's evidence and nothing else.**
- **VERIFIED** means only that a named individual at the Preparer examined a complete and legible primary document which, on its face, supports the specific assertion made, and logged that document in the Document Register. **VERIFIED does not mean** that the document is genuine, that it remains in force, that it has not been amended or superseded, that the counterparty is willing or able to perform, or that any date stated in it will be met.
- **ASSERTED** means that the assertion was made to the Preparer but that **no supporting primary document has been examined by the Preparer.** It is a statement about the Preparer's evidence, not a challenge to anyone's honesty, and it must not be read as either confirmation or denial.
- **GAP** means that no supporting document exists or none could be produced within the preparation window, or that a document produced contradicts the assertion. **A GAP is a disclosure, not an allegation.**

**2.8 The regulatory basis of this Package is secondary-sourced.** The requirement set against which this Package is structured — including the categories of supporting document, the applicable thresholds, and the attestation deadline — was compiled **from secondary reporting and search-level sources, re-sourced 16 November 2026. No ERCOT filing, no document in PUCT Project No. 59142, no ERCOT protocol or guide section, and no TDSP submission instruction was retrieved or read by the Preparer.** The Preparer's attempts to retrieve primary documents were blocked by technical and policy controls. **The Owner and its counsel must verify the requirement set against the authoritative sources before submission.** The Preparer specifically records that the attestation deadline is reported inconsistently as 15 July 2026 and as 24 July 2026, that these reports have not been reconciled, and that **the Preparer does not state either date as fact.** Items requiring verification are flagged throughout and listed in Appendix E.

**2.9 Forward-looking content.** Statements in this Package about future delivery, future float, future remediation or future schedule are **forward-looking and inherently uncertain.** They rest on third-party commitments, on published lead-time benchmarks of differing age and reliability (certain of which are expressly flagged in this Package as stale), and on assumptions recorded in Appendix D. **Actual outcomes will differ.** No forward-looking statement is a commitment by the Preparer.

**2.10 Lead-time benchmarks.** Lead-time and price benchmarks are reproduced from third-party sources and each carries its source and as-of date. **The Preparer did not conduct the underlying surveys, cannot confirm their methodology, scope or sample, and does not adopt them.** Benchmarks the Preparer considers stale are marked STALE, and benchmarks for which no as-of date could be established are marked UNDATED. **A benchmark is a sanity check on a contractual date. It is not a substitute for one, and it must never be presented to a reviewer as a delivery commitment.**

**2.11 No legal, engineering or financial advice.** This Package is not legal advice and no attorney-client relationship arises from it. It is not a professional engineering work product and is not sealed by a licensed professional engineer. It is not investment, accounting, tax or financial advice. **The Owner must obtain its own legal, engineering and financial advice before relying on or submitting this Package.** In particular, the Owner's counsel should review every attestation, certification or statement the Owner is asked to sign.

**2.12 Attestations are the Owner's.** Where this Package supports an attestation, certification or representation to be made to a regulator or utility, **that attestation is made by the Owner in the Owner's own name, on the Owner's own knowledge, and at the Owner's own risk.** The Preparer does not attest to the matters attested, does not sign the Owner's attestation, and does not adopt it. **The Preparer will not prepare, assist with or review any statement to a regulator that the Preparer's own evidence record does not support,** and the Preparer's refusal to do so is not a deficiency in this engagement.

**2.13 Reliance and addressees.** This Package is prepared solely for the Owner, and may be provided by the Owner to the connecting Transmission/Distribution Service Provider, to the Public Utility Commission of Texas, to the Electric Reliability Council of Texas, and to the Owner's professional advisers, **for the sole purpose of eligibility verification for the Project.** **No other person may rely on this Package for any purpose.** Provision of a copy to any person does not create a duty of care, a client relationship, or any liability of the Preparer to that person. Reliance by a lender, investor, acquirer, insurer or counterparty requires the Preparer's **prior written consent**, which may be given or withheld at the Preparer's discretion and on such terms as the Preparer specifies.

**2.14 No duty to update.** This Package speaks **only** as at the Data Date. Equipment markets, lead times, contract positions and regulatory requirements change, in some cases within days. **The Preparer has no obligation — and undertakes none — to update, revise, reissue or supplement this Package, or to advise any person of any matter arising after the Data Date,** including any change in the requirement set, any OEM notice, any schedule change, or any correction to a benchmark relied on. Use of this Package after the Data Date is at the user's risk.

**2.15 Integrity of the Package.** This Package is a single integrated document and must be read and distributed **as a whole.** **No part may be extracted, excerpted, quoted, summarised, re-formatted or submitted separately from this Statement, from the Verification Status Banner, and from the Gap Memo at Section 6.** Any extract so used is unauthorised and the Preparer accepts no responsibility for it. Where a recipient requires a summary, the Preparer will prepare one on request; the Owner must not prepare one from this Package without the Preparer's written agreement.

**2.16 Confidentiality.** This Package contains commercially sensitive manufacturer pricing and contract terms. It is confidential, and is to be handled in accordance with the confidentiality obligations in the engagement letter and in the Owner's agreements with its suppliers. **The Owner is responsible for confirming that it is contractually permitted to disclose each supplier document reproduced or summarised here to the TDSP and to regulators**, and for obtaining any supplier consent or applying for any confidential treatment required. `[VERIFY: supplier confidentiality and any regulatory confidential-treatment procedure — Owner's counsel.]`

**2.17 Order-position transfers.** Where this Package records that equipment was ordered by an entity other than the Project owner, the Preparer records that transfer of an order position typically requires the **manufacturer's prior written consent, which is discretionary**, and that such a transfer is in substance a **novation rather than an assignment.** **The Preparer does not represent that any consent will be obtained, on any terms, or at all**, and nothing in this Package is advice on the availability, mechanics or consequences of such a transfer. See Section 6, Gap `G-05`.

**2.18 Limitation of liability.** The Preparer's liability in connection with this Package is governed exclusively by the engagement letter between the Preparer and the Owner, including its limitation and exclusion of liability, its exclusion of indirect and consequential loss, and its cap. **Nothing in this Package extends, varies or waives those terms, and nothing in this Package creates any liability to any person other than the Owner.** `[PREPARER TO COMPLETE: insert the engagement letter's date and reference. If the engagement letter contains no liability cap, escalate to the engagement principal before issue — do not issue.]`

**2.19 Signature.**

| | |
|---|---|
| Prepared by | `[NAME]`, `[TITLE]` |
| Signature / date | `________________________`  `[DATE]` |
| Reviewed by | `[NAME]`, `[TITLE]` |
| Signature / date | `________________________`  `[DATE]` |
| For and on behalf of | `[PREPARER FIRM]` |
| Data Date | `[DATA DATE]` |
| Package version | `[VERSION]` |

---

## SECTION 3 — EQUIPMENT SCHEDULE

### 3.1 What goes in this section

List **every** item that meets, or arguably meets, the **18-month (78-week) long-lead definition**, by class: **generator step-up transformers (GSU), large power transformers (LPT), high-voltage circuit breakers, switchgear, bushings**, and any other item whose nominal lead time reaches the threshold.

> **Inclusion rule — err toward inclusion.** If an item's benchmark range **straddles** 78 weeks, include it and say so. Medium-voltage switchgear in the 38 kV class is reported at **78–104 weeks**, which begins exactly at the threshold; distribution equipment at **40–78 weeks** reaches it only at the top of range. An item wrongly excluded looks like concealment to a reviewer; an item included with a clear note that it straddles the threshold looks like care.
>
> **`[VERIFY: how the 18-month long-lead period is measured — from order placement, from the attestation date, from the data date, or to delivery versus to energization. The evidence base establishes only that "long-lead equipment" is defined as 18 months or more. The measurement convention is a preparer assumption (Appendix D, A-02) and materially changes which items qualify. Resolve against PUCT Project No. 59142 or the TDSP.]`**

**Presumptive qualification by class**, using the benchmarks in Appendix C against a 78-week threshold:

| Class | Benchmark (see Appendix C) | ≈ months | Presumptively long-lead? |
|---|---|---|---|
| GSU | `LT-01`: >160 weeks | ~37 | **Yes** |
| Large power transformer | `LT-02`: ~128 weeks | ~29 | **Yes** |
| Largest LPTs | `LT-03`: up to 48 months | up to 48 | **Yes** |
| HV circuit breaker | `LT-04`: ~125 weeks | ~29 | **Yes** — benchmark **STALE** |
| Bushings | `LT-05`: up to 130 weeks | up to 30 | **At top of range** — justify per item |
| MV switchgear, 38 kV class | `LT-06`: 78–104 weeks | ~18–24 | **Straddles the threshold** — include and flag |
| Distribution equipment | `LT-07`: 40–78 weeks | ~9–18 | **Only at top of range** — justify if included |

Assign each item an **Equipment Line ID** `EQ-001`, `EQ-002`, … These IDs key Sections 4, 5 and 6 together, and must not be reused or renumbered between versions.

### 3.2 Table 3.A — Identification and commercial position

| Line ID | Class | Description and rating | Qty | OEM | Ordering entity | Order status | PO number | PO date | Contract price | Deposit paid | Deposit % | **Refundable?** | Refundability evidence state | Slot reservation held? | LD rate / cap |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| *`EQ-001` `[ILLUSTRATIVE]`* | *GSU* | *100 MVA, 345/34.5 kV, ONAN/ONAF, outdoor* | *1* | *`OEM-A` (illustrative placeholder)* | *Project owner* | *PO issued and acknowledged* | *`PO-2027-0041`* | *12 Jan 2027* | *$3.2M (illustrative; within the $30,000–$35,000/MVA band reported for recent European 50–100 MVA awards — see Appendix C.3, **not a US price benchmark**)* | *$640,000* | *20%* | ***Non-refundable*** | *VERIFIED — PO cl. 4.2 examined* | *Yes — slot reservation confirmed in order acknowledgement* | *0.5%/week, capped 10% of contract price* |
| *`EQ-002` `[ILLUSTRATIVE]`* | *HV breaker* | *345 kV SF6-free dead-tank, 3000 A, 63 kA* | *2* | *`OEM-B` (illustrative placeholder)* | *Project owner* | ***Not ordered — budgetary quotation only*** | *`n/a — no PO`* | *`n/a`* | *`[VERIFY: no priced order exists]`* | *$0* | *0%* | *`n/a`* | *GAP — no order document exists* | ***No*** | *`n/a`* |
| `EQ-003` | | | | | | | | | | | | | | | |
| `EQ-004` | | | | | | | | | | | | | | | |

**Completion notes for Table 3.A**

- **Class:** use only `GSU`, `LPT`, `HV BREAKER`, `SWITCHGEAR`, `BUSHINGS`, or `OTHER` + description. Consistent class labels let the benchmark test in Table 3.C be checked by a reviewer.
- **Description and rating:** enough for a reviewer to confirm the item is the one the Project needs — MVA or current rating, voltage class, cooling/insulation, impedance where specified, and any special feature affecting lead time. "Transformer" is not a description.
- **OEM:** the contracting manufacturer as named on the order document, not a brand, a regional affiliate, or a reseller. If the counterparty is a distributor, broker or exchange rather than the manufacturer, say so — it changes the consent analysis in Gap `G-05` and may change the lead time.
- **Ordering entity:** the exact legal entity on the PO. **If this is not the Project owner named in §1.1, raise Gap `G-05` immediately and do not describe the equipment as the Project's without qualification.**
- **Order status:** one of `Not ordered`, `Quotation only`, `LOI / reservation only`, `PO issued, not acknowledged`, `PO issued and acknowledged`, `In production`, `Produced, awaiting release`, `Shipped`, `Delivered to site`. These feed Section 5.
- **Deposit and refundability:** state the **amount** and the **percentage of contract price**, then answer refundability from the **contract text**, with its clause reference. Context for reasonableness, from Appendix C.4: slot reservation deposits are reported at **10–30% of equipment cost and typically non-refundable**; observed payment splits include **30/70, 10/80/10, 20/70/10**; EPC practice is reported at **15–30% advance with 5–10% retention through commissioning**. A deposit far outside these bands is not wrong, but it should be explained in a footnote.
- **"Refundable" is a contract question, not a commercial impression.** If the answer rests on anything other than examined contract text, mark the state `ASSERTED` and raise a gap. "The vendor said they'd work with us" is `ASSERTED`.
- **Slot reservation:** material to the schedule. Reported: **without a reservation, nominal lead time extends a further 8–16 weeks** (Appendix C, `LT-08`). If no reservation is evidenced, Table 3.C must apply that penalty and Gap `G-04` is raised.
- **LD rate / cap:** reported practice caps delay liquidated damages at **5–15% of contract price**. Record the rate, the cap and the clause. **State in the footnote that LDs are a compensation mechanism and not a schedule cure** — a reviewer assessing energization risk is not comforted by an LD clause.

### 3.3 Table 3.B — Delivery terms

| Line ID | Contractual delivery window (start) | Contractual delivery window (end) — **used as `CDW_late` in §5** | Date provenance: `CONTRACTUAL` / `FORECAST` / `ASSUMED` | Document and clause fixing the window | Delivery basis: **ex-works / delivered** | Incoterm and named place | Who arranges and pays transport | Who bears customs / duties | Post-delivery Owner obligations affecting date | Evidence state |
|---|---|---|---|---|---|---|---|---|---|---|
| *`EQ-001` `[ILLUSTRATIVE]`* | *01 Feb 2028* | ***15 Mar 2028*** | ***CONTRACTUAL*** | *`PO-2027-0041` cl. 6.1 + order acknowledgement 19 Jan 2027* | ***Ex-works*** | *`EXW` `[OEM-A]` works, `[country]`* | *Owner* | *Owner* | *Owner must approve outline drawings within 20 days of issue — slippage shifts the window* | *VERIFIED* |
| *`EQ-002` `[ILLUSTRATIVE]`* | *`n/a — not ordered`* | *`[VERIFY: no contractual date exists. §5 tests this line against the benchmark only.]`* | ***ASSUMED*** | *None — budgetary quotation, no binding date* | *`[VERIFY]`* | *`[VERIFY]`* | *`[VERIFY]`* | *`[VERIFY]`* | *`[VERIFY]`* | ***GAP*** |
| `EQ-003` | | | | | | | | | | |

**Completion notes for Table 3.B**

- **`CDW_late` is the contractual latest date, not the OEM's best case.** Where the contract gives a window, use the **end** of it. Where it gives a date plus a permitted grace or tolerance, use the date **plus** the tolerance. Where force-majeure or excusable-delay provisions can extend it, say so in a footnote; do **not** extend the date on that basis, but do not let the reader believe the date is hard either.
- **Date provenance is as important as the date.** A `FORECAST` date in an OEM email and a `CONTRACTUAL` date in an executed order acknowledgement look identical in a spreadsheet and are not remotely equivalent to a reviewer. Marking provenance is the single highest-value column in this table.
  - `CONTRACTUAL` — fixed by executed contract, PO or countersigned acknowledgement, with a clause reference. Only this provenance may be paired with a `VERIFIED` state.
  - `FORECAST` — OEM's stated expectation in writing, not contractually binding.
  - `ASSUMED` — the preparer's input where no date exists. Must be derived in Table 3.C from a named benchmark, never chosen.
- **Ex-works is the most common reconciliation trap in this package.** Under `EXW` (and `FCA`, `FOB`), the contractual delivery window is **readiness for collection at the works**, not arrival on site. Arrival on site is later by the full transport, customs, inland-haul and heavy-lift sequence, which for a large transformer is not a rounding error. **Section 5 therefore adds transport time explicitly in the site-duration build-up, and the preparer must not treat an ex-works date as an on-site date.** Where the basis is delivered (`DAP`/`DDP`), say whether "delivered" means to the site, to a named yard, or to a port, and whether offloading is included.
- **Post-delivery Owner obligations** — drawing approvals, foundation readiness, access-road completion, site-acceptance windows, OEM supervision availability — frequently gate the real date. Capture them; they reappear as Section 5 site durations and as Section 6 owners.

### 3.4 Table 3.C — The long-lead benchmark test

Each line is tested against a **named benchmark from Appendix C**, cited by ID so a reviewer can check the source and its age.

| Line ID | Benchmark ID | Benchmark value | Benchmark source (short) | Benchmark as-of | Benchmark age at data date | **Staleness** | Reservation penalty applied (`LT-08`) | Benchmark-derived lead time | Order date used | Benchmark-derived delivery date | Meets 18-month (78-week) test? | Contract vs benchmark: contract is… |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| *`EQ-001` `[ILLUSTRATIVE]`* | *`LT-01`* | *>160 weeks* | *GSU market lead time, Q1 2026 reporting* | *Q1 2026* | *~9 months* | ***AGING*** | *None — reservation evidenced* | *160 weeks* | *12 Jan 2027 (actual PO date)* | *~04 Feb 2030* | ***Yes** (160 wks > 78 wks)* | ***Far better than benchmark** — contractual 15 Mar 2028 is ~98 weeks earlier than the benchmark implies. **Flag as an outlier to be re-confirmed with the OEM in writing** (OEM contact log, Appendix B) before relying on it.* |
| *`EQ-002` `[ILLUSTRATIVE]`* | *`LT-04`* | *~125 weeks* | *HV circuit breaker market lead time, H2 2025 reporting* | *H2 2025* | *~12 months* | ***STALE — about 12 months old; the most out-of-date benchmark in this package*** | *+12 weeks applied (midpoint of the reported 8–16 week range; see Appendix D, `A-05`)* | *137 weeks* | *01 Feb 2027 (earliest assumed order date — `ASSUMED`)* | *~17 Sep 2029* | ***Yes** (137 wks > 78 wks)* | *No contract exists. **This line is tested against a stale benchmark only** and the resulting date carries that uncertainty.* |
| `EQ-003` | | | | | | | | | | | | |

**Completion notes for Table 3.C**

- **Every benchmark cited must carry its source and as-of date in the row, not only in the appendix.** A reviewer should never have to turn a page to learn how old a number is.
- **Staleness classification** (preparer's rule, Appendix D `A-04`), measured from the benchmark's as-of date to the data date: **CURRENT** ≤6 months; **AGING** >6 and ≤12 months; **STALE** >12 months; **UNDATED** where no as-of date could be established. **The HV circuit breaker benchmark (`LT-04`, ~125 weeks, H2 2025) is about 12 months old and is to be reported as STALE wherever it appears.** It is not the only aged benchmark — `LT-02` (large power transformer, ~128 weeks, Q2 2025 survey) is older still, and `LT-03`, `LT-05`, `LT-06`, `LT-07` and `LT-08` are **UNDATED** in the evidence base. Mark them all honestly; do not single out one and let the rest pass.
- **Where the contract date is markedly better than the benchmark, say so and flag it.** A contractual delivery much earlier than the market benchmark may reflect an early slot, a cancelled-order pickup, a non-standard unit, a resale position, or an OEM date that will not hold. It is a question for the OEM contact log, not a result to bank quietly. Reviewers notice favourable outliers.
- **Where the contract date is worse than the benchmark**, note it and check whether re-sourcing is realistic. Supply-side context in Appendix C.5 (reported narrowing of the transformer shortfall from 30% in 2025 to 15% in 2026, and new US capacity coming on line from early 2027 through 2029) is **context for a re-sourcing conversation, not a basis for assuming an earlier date.** Do not substitute a hoped-for re-sourced date for a contractual one.
- **Never let a benchmark-derived date silently displace a contractual date.** Benchmark dates are for lines with no contract, and for sanity-checking lines that have one. Section 5 keeps the two tests in separate columns for exactly this reason.

---

## SECTION 4 — EVIDENCE INDEX

### 4.1 Table 4.A — Evidence index by equipment line

One row per **assertion**, not one per document. A single PO typically proves several assertions (that an order exists; its price; its delivery window; its deposit terms), and each is verified to a different standard.

| Evidence ID | Equipment line | Assertion being proved | Document that proves it | Document ref / date / version | Holder (custodian) | Register ref (App. A) | **State** | Qualifier | Verified by | Verified on | Limits of what this document proves |
|---|---|---|---|---|---|---|---|---|---|---|---|
| *`EV-001` `[ILLUSTRATIVE]`* | *`EQ-001`* | *A binding purchase order for one 100 MVA GSU exists and was accepted by the OEM* | *Executed PO and countersigned order acknowledgement* | *`PO-2027-0041`, 12 Jan 2027; acknowledgement 19 Jan 2027* | *Owner — procurement (`[name]`)* | *`DR-014`, `DR-015`* | ***VERIFIED*** | *—* | *`[preparer name]`* | *`[date]`* | *Proves an order was placed and accepted. **Does not prove** production has started, a slot is held, or the unit will ship.* |
| *`EV-002` `[ILLUSTRATIVE]`* | *`EQ-001`* | *The 20% deposit of $640,000 was paid and is non-refundable* | *Treasury payment confirmation + PO cl. 4.2* | *Payment conf. 20 Jan 2027; `PO-2027-0041` cl. 4.2* | *Owner — treasury (`[name]`)* | *`DR-016`* | ***VERIFIED*** | *`REDACTED` — bank account numbers masked* | *`[preparer name]`* | *`[date]`* | *Proves payment left the Owner and that the contract designates it non-refundable. **Does not prove** the OEM received or applied it.* |
| *`EV-003` `[ILLUSTRATIVE]`* | *`EQ-001`* | *Production slot for Q4 2027 is held for this order* | *OEM production schedule extract referenced in acknowledgement* | *Referenced but not produced* | *OEM `OEM-A`* | *—* | ***ASSERTED*** | *`PENDING` — OEM to produce by `[date]`, promised by `[OEM contact]`* | *—* | *—* | *Slot integrity rests on an OEM statement. **No OEM production document has been examined.*** |
| *`EV-004` `[ILLUSTRATIVE]`* | *`EQ-002`* | *HV breakers are on order* | *None — budgetary quotation only, no PO* | *Quotation `[ref]`, `[date]`* | *Owner — procurement* | *`DR-022`* | ***GAP*** | *—* | *—* | *—* | *A quotation proves a price was offered. **It proves no order, no slot, no date and no commitment.** See Gap `G-01`.* |
| `EV-005` | | | | | | | | | | | |

**Completion notes for Table 4.A**

- **Write the assertion as a sentence that could be true or false.** "PO" is not an assertion. "A binding purchase order for one 100 MVA GSU exists and was accepted by the OEM" is.
- **The "Limits" column is not optional and is not filler.** It is where this package earns its credibility with a reviewer and with the Owner's counsel: it states, for each document, what the document does *not* establish. Preparers under time pressure cut this column. Do not.
- **Custodian means a named person and organisation**, not "Owner" alone. A reviewer's follow-up question has to have somewhere to go.
- **Document versions matter.** An unsigned draft PO, a signed PO, and a PO as amended by change order are three different documents. Record the version and whether later amendments were sought and examined. "We were given the PO" without asking for amendments is a common and avoidable verification failure.

### 4.2 Table 4.B — Mandatory evidence matrix against the reported ERCOT supporting-document list

**Source note:** the eight categories below are reproduced from secondary reporting of **ERCOT's presentation to the PUCT reported as dated 20 August 2026**, listing Batch Zero Eligibility Verification Supporting Documents. **No primary document was opened.** The list must be re-checked against ERCOT's own current documentation and against PUCT Project No. 59142 before submission, and against the TDSP's own instruction, which may require more.

| # | Reported supporting-document category | Applies to this Project? | Evidence IDs | **State** | Gap ref |
|---|---|---|---|---|---|
| 1 | **Long-lead equipment attestations** | Yes | `[ ]` | `[ ]` | `G-06` if absent |
| 2 | **Purchase orders** — including POs for customer-owned electrical equipment | Yes | `[ ]` | `[ ]` | `G-01` |
| 3 | **Delivery schedules** | Yes | `[ ]` | `[ ]` | `G-02`, `G-03` |
| 4 | **Land / real-estate agreements** | `[OWNER TO SUPPLY]` | `[ ]` | `[ ]` | `G-07` |
| 5 | **End-user agreements** | `[OWNER TO SUPPLY]` | `[ ]` | `[ ]` | `G-08` |
| 6 | **Retail service agreement** — **required if the developer is also the end-use customer** (see §1.1) | `[OWNER TO SUPPLY]` | `[ ]` | `[ ]` | `G-08` |
| 7 | **Evidence that the transmission provider (TDSP) has purchased equipment** such as transformers and breakers | Yes — reported that ERCOT **may require** this | `[ ]` | `[ ]` | `G-09` |
| 8 | **Proof that site preparation / construction has begun** | Yes — reported that ERCOT **may require** this | `[ ]` | `[ ]` | `G-10` |
| 9 | Anything further required by the TDSP's own written instruction | `[VERIFY — obtain the instruction]` | `[ ]` | `[ ]` | `[ ]` |

> **Category 7 is the one preparers routinely under-work.** Items 1–6 and 8 are within the Owner's own records. **Item 7 concerns equipment purchased by the TDSP, which the Owner does not control and may not be entitled to see.** Start this request early, in writing, through the TDSP contact in §1.3, and if the TDSP declines or cannot produce it, record that refusal verbatim in Appendix B and raise Gap `G-09`. **A reviewer treats "we did not ask" and "the TDSP declined in writing on [date]" very differently.**

### 4.3 Evidence-state roll-up

| Category | VERIFIED | ASSERTED | GAP | Total |
|---|---|---|---|---|
| Equipment lines (§3) | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Reported ERCOT categories (§4.2, items 1–8) | `[ ]` | `[ ]` | `[ ]` | 8 |
| Delivery dates by provenance — `CONTRACTUAL` / `FORECAST` / `ASSUMED` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |

> **Do not report a percentage-verified figure as a headline.** A package that is 90% verified on immaterial lines and GAP on the GSU is worse than one that is 60% verified with the GSU nailed down. Report **which** lines are unproven, and report the critical line first.

---

## SECTION 5 — SCHEDULE RECONCILIATION

### 5.1 Purpose, and the one rule that governs this section

This section tests, line by line, whether contractual delivery supports the target energization date `ED`, and reports the answer **with its sign**.

> **THE NEGATIVE-FLOAT RULE.** Where float is negative, it is reported as a negative number, in the table, in the Section 6 Gap Memo, and in the §1.9 executive summary on page 1. **Negative float is never floored at zero. It is never netted or averaged across lines. It is never absorbed by moving `ED` without a logged change. It is never softened to "schedule risk" or "challenging but achievable." It is never removed by substituting an OEM's verbal best case for the contractual date.** If any person asks the preparer to do any of these things, the preparer declines, records the request in Appendix H, and notifies the engagement principal. A reviewer who finds concealed negative float will reasonably doubt everything else in the package — and concealing it is the fastest route to disqualifying the Owner.

### 5.2 Definitions and the arithmetic — stated explicitly so a reviewer can re-derive every number

| Symbol | Name | Definition |
|---|---|---|
| `ED` | Target energization date | From §1.2. One date for the whole package. If the Project is phased, run Section 5 **separately per phase** against that phase's `ED`. |
| `CDW_late` | Contractual latest delivery date | From Table 3.B, end of the contractual window plus any permitted tolerance. Only for lines with `CONTRACTUAL` provenance. |
| `S` | Site duration | Total weeks required **after** the equipment becomes available under its delivery basis **until** energization, built up from named components (§5.3). |
| `R` | Required-available date | `R = ED − S`. The latest date the equipment can become available and still support `ED`. |
| `F_contract` | **Contractual float** | `F_contract = R − CDW_late`. Positive = slack. **Negative = the contractual date does not support `ED`.** |
| `D_bench` | Benchmark-derived delivery date | From Table 3.C: order date + benchmark lead time + reservation penalty where applicable. |
| `F_bench` | **Benchmark float** | `F_bench = R − D_bench`. The sanity check. For unordered lines it is the **only** available float. |
| `F_program` | **Program float** | `F_program = min(F_contract, F_bench)` across **all** lines. The minimum, never the mean. |

**Computation procedure:**
1. Compute in **calendar days**, then convert: `weeks = days ÷ 7`, reported to the nearest whole week with the day figure shown in parentheses.
2. **Never round a negative float toward zero.** `−6.4 weeks` reports as `−6 weeks (−45 days)`, and the day figure prevents the rounding from flattering the result.
3. For a line with `CONTRACTUAL` provenance, report **both** `F_contract` and `F_bench`. Divergence between them is itself a finding.
4. For a line with no contract, `F_contract` is `n/a — no contractual date exists`. **Do not leave it blank, and do not fill it with the benchmark figure.**
5. Show the site-duration build-up (§5.3) for every line. A float figure whose `S` is unexplained is not auditable and a reviewer will discount it.

### 5.3 Table 5.A — Site-duration build-up (`S`), per line

For an **ex-works** line, `S` **must** include outbound transport. For a **delivered** line, `S` starts at the contractual delivery place and must include any onward haul to the installed position.

| Line ID | Delivery basis | Transport to site (wks) | Receipt and inspection (wks) | Foundation / access readiness lead (wks, if gating) | Installation and field assembly (wks) | Oil processing / field testing (wks) | Pre-energization commissioning (wks) | TDSP energization sequence (wks) | Owner-obligation contingency (wks) | **`S` total (wks)** | Source of each duration |
|---|---|---|---|---|---|---|---|---|---|---|---|
| *`EQ-001` `[ILLUSTRATIVE]`* | *Ex-works* | *6* | *2* | *0 — not gating; foundation complete before arrival* | *8* | *4* | *—* | *6* | *0* | ***26*** | *Transport: Owner's logistics quote `[ref]`. Install/oil: `[OEM-A]` erection manual `[ref]`. Energization sequence: `[VERIFY: confirm with TDSP in writing]`* |
| *`EQ-002` `[ILLUSTRATIVE]`* | *`[VERIFY]` — assumed ex-works* | *4* | *1* | *0* | *4* | *—* | *3* | *6* | *0* | ***18*** | *All durations `ASSUMED` by preparer — see Appendix D, `A-06`. **No OEM or TDSP document supports these.*** |
| `EQ-003` | | | | | | | | | | | |

> **Do not use a single blanket `S` for every line.** A 345 kV GSU and a 38 kV switchgear lineup have materially different transport, assembly and commissioning profiles, and a reviewer who sees the same `S` on every row will conclude it was not computed. Equally, **the TDSP energization sequence is usually common to all lines** — obtain it once, in writing, and cite it on every row. Until obtained it is a live `[VERIFY]`.

### 5.4 Table 5.B — Float calculation, with the arithmetic shown

| Line ID | `ED` | `S` (wks) | `R = ED − S` | `CDW_late` | Provenance | **`F_contract = R − CDW_late`** | `D_bench` | **`F_bench = R − D_bench`** | Governing float for this line | Sign |
|---|---|---|---|---|---|---|---|---|---|---|
| *`EQ-001` `[ILLUSTRATIVE]`* | *01 Dec 2028* | *26* | *02 Jun 2028* `(336 − 182 = day 154 of 2028)` | *15 Mar 2028* | *`CONTRACTUAL`* | ***+11 weeks (+79 days)*** `(154 − 75 = 79)` | *~04 Feb 2030* | ***−87 weeks (−612 days)*** | ***+11 weeks*** — contractual date governs; the benchmark gap is a flag, not the result | ***POSITIVE*** |
| *`EQ-002` `[ILLUSTRATIVE]`* | *01 Dec 2028* | *18* | *28 Jul 2028* `(336 − 126 = day 210 of 2028)` | *`n/a — no contractual date exists`* | *`ASSUMED`* | *`n/a`* | *17 Sep 2029* `(01 Feb 2027 + 137 wks = +959 days)` | ***−59 weeks (−416 days)*** | ***−59 weeks (−416 days)*** — benchmark float is the only float available | ***NEGATIVE*** |
| `EQ-003` | | | | | | | | | | |

**Worked arithmetic for the illustrative rows — reproduce this level of transparency for every line:**

*`EQ-001` (illustrative):*
- `S` = 6 transport + 2 receipt + 8 install + 4 oil/test + 6 TDSP energization = **26 weeks = 182 days**
- `R` = `ED` 01 Dec 2028 (day 336 of a leap year) − 182 days = day 154 of 2028 = **02 Jun 2028**
- `CDW_late` = 15 Mar 2028 = day 75 of 2028
- `F_contract` = day 154 − day 75 = **+79 days = +11.3 weeks → report +11 weeks (+79 days)**
- `F_bench`: benchmark `LT-01` >160 weeks from the actual PO date of 12 Jan 2027 → `D_bench` ≈ 04 Feb 2030; `F_bench` = 02 Jun 2028 − 04 Feb 2030 = **−612 days = −87.4 weeks → report −87 weeks (−612 days)**
- **Reported conclusion:** governing float **+11 weeks** on the contractual date — *but* the contractual date beats the market benchmark by roughly 87 weeks. **That divergence is reported, not suppressed**, and carries a mandatory action: obtain written OEM re-confirmation of the delivery window and the slot, logged in Appendix B, before the Owner relies on this line.

*`EQ-002` (illustrative):*
- Benchmark `LT-04` = **~125 weeks, as-of H2 2025, STALE (~12 months old)**
- Reservation penalty `LT-08` = **+12 weeks** (midpoint of the reported 8–16 week range; no reservation evidenced) → total **137 weeks = 959 days**
- Order date `ASSUMED` at the earliest practicable 01 Feb 2027 → `D_bench` = 01 Feb 2027 + 959 days = **17 Sep 2029**
- `S` = 4 + 1 + 4 + 3 + 6 = **18 weeks = 126 days**; `R` = 01 Dec 2028 (day 336) − 126 = day 210 of 2028 = **28 Jul 2028**
- `F_bench` = 28 Jul 2028 − 17 Sep 2029 = **−416 days = −59.4 weeks → report −59 weeks (−416 days)**
- **Reported conclusion:** **negative float of about 59 weeks on an unordered, stale-benchmarked line.** This is the critical line. It goes to the executive summary on page 1 and to Gap `G-01` with an owner and a date. **It is not described as "schedule risk."**

### 5.5 Negative-float register — every negative line, restated

| Line ID | Governing float | Shortfall (wks / days) | Cause | Is the cause an **evidence** gap or a **physical schedule** gap? | Earliest achievable date if remediated immediately | Residual shortfall after remediation | Gap ref |
|---|---|---|---|---|---|---|---|
| *`EQ-002` `[ILLUSTRATIVE]`* | *−59 wks* | *−59 wks / −416 days* | *Not ordered; no slot; stale benchmark* | ***Physical** — no amount of documentation shortens a 137-week lead time* | *`[PREPARER TO COMPLETE]`* | *`[PREPARER TO COMPLETE]`* | *`G-01`* |
| `[ ]` | | | | | | | |

> **Distinguish the two kinds of negative float, because the remedies are entirely different and a reviewer will.**
> - An **evidence** gap means the equipment may well arrive in time but we cannot prove it. Remedy: obtain the document.
> - A **physical schedule** gap means the equipment cannot arrive in time on any current evidence. **Remedy: re-source, re-phase, re-baseline `ED`, or substitute scope — a decision for the Owner, not a documentation exercise.** Presenting a physical gap as though better paperwork will cure it is the most damaging error available in this section.

### 5.6 Program float summary

| Measure | Value |
|---|---|
| **`F_program` = min float across all lines** | `[PREPARER TO COMPLETE — state the sign]` |
| Critical line | `[PREPARER TO COMPLETE]` |
| Second and third most critical lines | `[PREPARER TO COMPLETE]` |
| Lines with negative float | `[ ]` of `[ ]` |
| Lines whose governing float is benchmark-derived (no contract) | `[ ]` of `[ ]` |
| Lines whose governing float relies on a **STALE** or **UNDATED** benchmark | `[ ]` of `[ ]` |
| Plain-language statement of the schedule position | `[PREPARER TO COMPLETE: one or two sentences, no hedging. If `F_program` is negative, the first sentence says so and names the line.]` |

### 5.7 Reconciliation against reported programme dates

| Reported programme date | Date | Bearing on this package | Preparer action |
|---|---|---|---|
| Audit reports reported due | **10 Dec 2026** | Nearest reported deadline after the data date | `[PREPARER TO COMPLETE — confirm applicability to this Project; `[VERIFY]`]` |
| PUCT open meeting reported | **17 Dec 2026** | Potential decision point on the programme | `[PREPARER TO COMPLETE]` |
| Attestation deadline | **Reported 15 Jul 2026 OR 24 Jul 2026 — conflicting, unreconciled, both already past.** See §1.6 | Determines whether an attestation was timely, and whether a later operative deadline applies | `[VERIFY and complete §1.6 table]` |
| TDSP-stated deadline for this submission | `[VERIFY — obtain in writing]` | **This is the date that actually governs the package** | `[PREPARER TO COMPLETE]` |

---

## SECTION 6 — GAP MEMO

### 6.1 How to write this section

For each gap: state what is missing, state **why a reviewer would likely reject on it and on what basis**, state the specific remediation, and name an **owner** (a person, not a department) and a **date**.

> **Every rejection rationale must carry a basis marker.** We have not read the governing documents (see the banner), so we must be precise about the difference between a reported requirement and our own inference:
> - **`BASIS: REPORTED REQUIREMENT`** — the category or threshold appears in the secondary-sourced requirement list at §4.2. **Still `[VERIFY]`, because no primary document was opened.**
> - **`BASIS: PREPARER INFERENCE`** — our professional judgement about how a reviewer would read the record. **Not a sourced requirement, and must never be presented as one.**
>
> **Never write "ERCOT requires X" unless X is in the §4.2 list, and even then write "reported to require" and carry the `[VERIFY]`.** Over-stating a requirement to a client is as damaging to this firm as under-stating one.

### 6.2 Table 6.A — Gap register

| Gap ID | Relates to | Gap description | Why a reviewer would likely reject | Basis | Remediation — specific action | Owner (named) | Target date | Status | Residual risk if unremediated |
|---|---|---|---|---|---|---|---|---|---|
| *`G-01` `[ILLUSTRATIVE]`* | *`EQ-002`, `EV-004`* | *HV breakers (2 × 345 kV) are not ordered. Only a budgetary quotation exists.* | *Purchase orders are a reported supporting-document category. A quotation evidences no order, no slot, no date and no commitment. The line also carries **−59 weeks** of float.* | ***REPORTED REQUIREMENT** (§4.2 item 2) `[VERIFY]`* | *(1) Issue PO and secure a production slot — note reported slot deposits of **10–30% of equipment cost, typically non-refundable**. (2) Obtain countersigned order acknowledgement with a contractual delivery window. (3) **Separately**, instruct the Owner that ordering does not cure the −59 week shortfall: re-sourcing, re-phasing or re-baselining `ED` is an Owner decision requiring a written instruction.* | *`[name, role]`* | *`[date]`* | *Open* | *Line remains GAP; **−59 weeks of unremediated negative float on the critical line**; eligibility exposure on a reported mandatory category.* |
| `G-02` | | Purchase order exists but no OEM-issued delivery schedule document | Delivery schedules are a reported supporting-document category. A PO date without an OEM schedule may be read as unsupported. | **REPORTED REQUIREMENT** (§4.2 item 3) `[VERIFY]` | Request the OEM's issued production/delivery schedule in writing; log the request and response in Appendix B. | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| `G-03` | | Delivery window is an OEM verbal or email forecast, not contractual (provenance `FORECAST`) | A non-binding date cannot support an attestation about delivery. | **PREPARER INFERENCE** | Obtain a contract amendment or countersigned acknowledgement fixing the window; failing that, mark provenance `FORECAST` on the face of the package and disclose it. | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| `G-04` | | Deposit paid but no slot reservation evidenced | Without a reservation, reported nominal lead time extends a further **8–16 weeks** (`LT-08`), which changes the float. | **PREPARER INFERENCE** on the schedule consequence; `LT-08` is sourced but **UNDATED** | Obtain written confirmation of slot reservation and the reserved production window; if none, apply the penalty in Table 3.C and re-run Section 5. | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| `G-05` | | **Equipment ordered by an entity other than the Batch Zero applicant** | Evidence of equipment purchase that names a different legal entity may not be read as the Project's equipment, and **transfer of an order position is not automatic.** | **PREPARER INFERENCE**; the contractual constraints below are sourced but search-level | See §6.3 — this gap has its own treatment. | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| `G-06` | | Long-lead equipment attestation not filed, or filing date / operative deadline uncertain | Attestations are a reported supporting-document category, and **the deadline is reported inconsistently as 15 July 2026 and 24 July 2026 — both already past.** Loads failing to respond are reported to be subject to disqualification. | **REPORTED REQUIREMENT** (§4.2 item 1) `[VERIFY]`; deadline **unresolved** (§1.6) | (1) Establish the operative deadline in writing from the TDSP or PUCT Project No. 59142. (2) Establish whether an attestation was filed, when, and with what acknowledgement. (3) **Refer to the Owner's counsel before any submission** — this is a legal question, not a documentation question. | `[ ]` | `[ ]` | `[ ]` | **Potential disqualification. Highest-severity gap class in this template.** |
| `G-07` | | Land / real-estate agreement not produced | Reported supporting-document category. | **REPORTED REQUIREMENT** (§4.2 item 4) `[VERIFY]` | Obtain executed site control documents; confirm the contracting entity matches §1.1. | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| `G-08` | | End-user agreement not produced; or developer is the end-use customer and **no retail service agreement** is produced | Reported supporting-document categories. The retail service agreement is reported as **required** where the developer is also the end-use customer. | **REPORTED REQUIREMENT** (§4.2 items 5–6) `[VERIFY]` | Confirm the end-user structure against §1.1; obtain the executed agreement(s); where the developer is the end-use customer, obtain the retail service agreement. | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| `G-09` | | **TDSP-side equipment purchase evidence** (transformers, breakers purchased by the transmission provider) not obtained | Reported that ERCOT **may require** evidence that transmission providers have purchased such equipment. | **REPORTED REQUIREMENT** (§4.2 item 7) `[VERIFY]` | Request in writing from the TDSP contact in §1.3. **If the TDSP declines or cannot produce it, record the refusal verbatim in Appendix B** and disclose it — "we asked and were declined on `[date]`" is a defensible record; silence is not. | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| `G-10` | | No proof that site preparation / construction has begun | Reported that ERCOT **may require** such proof. | **REPORTED REQUIREMENT** (§4.2 item 8) `[VERIFY]` | Obtain dated site photographs with metadata, notice to proceed, contractor mobilisation records, permits, and survey or earthworks records. | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| `G-11` | | **One or more lines carry negative float** | A record showing equipment cannot arrive before the stated energization date undercuts the energization date itself. | **PREPARER INFERENCE** | Per §5.5: fix the **evidence** gaps; escalate the **physical** gaps to the Owner for a re-sourcing, re-phasing or re-baselining decision, taken in writing. | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| `G-12` | | **Benchmark staleness** — the HV breaker benchmark (`LT-04`, ~125 weeks, H2 2025) is about **12 months old**; `LT-02` is older; `LT-03`, `LT-05`–`LT-08` are **UNDATED** | Reliance on aged market data to support a forward schedule is challengeable, in either direction. | **PREPARER INFERENCE** | Replace benchmark-derived dates with contractual dates wherever a contract exists; obtain current OEM-specific lead times in writing for the rest; until then, disclose staleness on the face of every row that relies on them. | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| `G-13` | | **Community Impact Audit** — threshold reported at **25 MW**; the Project exceeds it; scope, owner and filing requirement unknown | If an audit or filing is required and absent, the record is incomplete. | **REPORTED REQUIREMENT** (threshold only) `[VERIFY: what the threshold triggers — PUCT Project No. 59142]` | Determine applicability from the primary docket; if applicable, identify the deliverable, owner and date. | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| `G-14` | | **Outstanding verification enquiries** under the conditional classification | Loads that **fail to respond** to verification are reported to be subject to disqualification. Reported context: **257 developers / ~5,140 questions (5 Nov 2026, unverified)**. | **REPORTED REQUIREMENT** `[VERIFY]` | Log every enquiry received, its due date and its response; map each to the evidence IDs that answer it; confirm delivery and acknowledgement through the TDSP. | `[ ]` | `[ ]` | `[ ]` | **Potential disqualification.** |
| `G-15` | | `[ ]` | | | | | | | |

### 6.3 Gap `G-05` in detail — order placed by a different entity

This gap recurs often enough, and is misunderstood often enough, to warrant its own treatment. **All of the following is search-level sourced; no OEM contract was opened. Do not present any of it to the Owner as legal advice — refer it to counsel.**

**What the sourced record shows:**

- Transfer of an order position requires the **manufacturer's prior written consent, which is discretionary.**
- **The transfer is in substance a novation, not an assignment.** The distinction matters: a novation substitutes a new counterparty with the manufacturer's agreement; an assignment purports to transfer rights without it.
- **Virginia Transformer:** assignment without prior written approval is **VOID**. An older Virginia Transformer sales form required a **$10,000 assignment fee** before assignment would be granted, and **reserved the right to deny outright.**
- **WC Magnetics purchase-order terms:** no assignment of rights (**including rights to money due**) and no delegation of duties binds until written consent.
- **GE Vernova Terms of Purchase, Section 13 (October 2025 US revision):** consent is **"contingent upon Buyer's qualifications review."** The European Revision A adds a **further-assurances duty** to execute documents giving effect to "such assignment or novation."
- **Coverage of the sourced record: 2 of 2 purchase-order forms examined require written consent. 0 of 5 major HV OEM assignment regimes are established.** Our evidence on this point is thin and must be described as thin.
- **Warranty** is commonly **original-purchaser-only**; where transfer is allowed at all, it is commonly **limited to the unused remainder.**
- **No slot or order-position resale has ever been observed** — **0 instances after targeted search.** For scale, in MISO: **2,325 withdrawn interconnection requests against 17 pending transfers.**

**What the preparer therefore does:**

1. **Do not describe the equipment as the Project's** without stating the ordering entity and the consent position.
2. Obtain the **actual governing terms** for each affected order — the specific OEM's current form, not a generic one. **`[VERIFY: the assignment/novation clause of each affected order, by OEM and revision.]`**
3. Record whether consent has been **requested**, **granted in writing**, or **refused**, with dates, in Appendix B. Verbal encouragement from a sales contact is `ASSERTED`, nothing more.
4. Note any **fee or qualification-review condition** disclosed in the terms.
5. Note the **warranty consequence** of transfer.
6. **State plainly in the Gap Memo that the preparer does not represent that any consent will be obtained**, consistent with §2.17.
7. **Do not model a benchmark lead-time saving from an unconsented transfer.** On the sourced record, no resale has ever been observed; treating a transfer as a schedule solution would put an unevidenced assumption on the critical path.

### 6.4 Gap severity and the submission gate

| Severity | Definition | Effect on submission |
|---|---|---|
| **CRITICAL** | A reported mandatory category is GAP; or a reported deadline may have been missed; or negative float on the critical line | **Do not submit without the Owner's written, informed instruction and counsel's sign-off.** Record the instruction in Appendix H. |
| **MAJOR** | Evidence is ASSERTED where a primary document should exist and could be obtained | Submit with the gap disclosed on the face of the package, plus a remediation date. |
| **MINOR** | Documentation quality, completeness, or format | Submit with disclosure. |

| Severity | Count | Gap IDs |
|---|---|---|
| CRITICAL | `[ ]` | `[ ]` |
| MAJOR | `[ ]` | `[ ]` |
| MINOR | `[ ]` | `[ ]` |

---

## SECTION 7 — APPENDICES

### Appendix A — Document register

Every document examined, produced, requested or refused. **A document that is not in this register cannot support a VERIFIED marker.**

| Doc ID | Title | Type | Document date | Version / revision | Executed? | Pages | Format | Received from | Received on | Custodian | Storage location / hash | Evidence IDs it supports | Redactions | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| *`DR-014` `[ILLUSTRATIVE]`* | *Purchase order — 100 MVA GSU* | *PO* | *12 Jan 2027* | *Rev 0, as issued* | *Yes — Owner signature* | *14* | *PDF, searchable* | *Owner procurement (`[name]`)* | *`[date]`* | *Owner procurement* | *`[secure repository path]` / SHA-256 `[hash]`* | *`EV-001`, `EV-002`* | *None* | *Amendments requested; **none existed per Owner — ASSERTED, not VERIFIED*** |
| *`DR-022` `[ILLUSTRATIVE]`* | *Budgetary quotation — 345 kV breakers* | *Quotation* | *`[date]`* | *—* | *No* | *3* | *PDF* | *Owner procurement* | *`[date]`* | *Owner procurement* | *`[path]`* | *`EV-004`* | *None* | ***Not an order document.** Supports Gap `G-01`.* |
| `DR-001` | | | | | | | | | | | | | | |

**Register discipline:** log a hash or equivalent integrity reference for every document; record **requested-but-not-produced** and **requested-and-refused** items as register entries with the request date and the response verbatim; and record for every contract whether amendments were sought — "we asked for amendments and were told there are none" is `ASSERTED`, while "we examined the amendment register" is `VERIFIED`.

### Appendix B — OEM and counterparty contact log

| Entry | Date | Organisation | Person and role | Channel | Subject | What was asked | What was said | **Written confirmation obtained?** | Doc ID | Follow-up owner / date |
|---|---|---|---|---|---|---|---|---|---|---|
| *`CL-001` `[ILLUSTRATIVE]`* | *`[date]`* | *`OEM-A` (illustrative)* | *`[name]`, order management* | *Email* | *Slot confirmation for `PO-2027-0041`* | *Written confirmation of the reserved production window* | *Slot confirmed verbally for Q4 2027; production schedule extract to follow* | ***No — pending*** | *—* | *`[name]` / `[date]`* |
| `CL-002` | | | | | | | | | | |

**Log discipline:** log the **refusals and the silences**, not only the answers — an unanswered written request on the record is itself evidence of diligence, and its absence is the thing a reviewer will ask about. Record who authorised each direct OEM contact (many Owners reserve OEM communication to themselves). Never record a verbal assurance as anything other than `ASSERTED`.

### Appendix C — Benchmark library

**All benchmarks are reproduced from secondary and search-level sources, re-sourced 16 November 2026. No primary survey, index or report was opened.** The preparer did not conduct these surveys and does not adopt them (§2.10). Ages are stated against a data date of **17 November 2026**; **recompute staleness against the actual data date of the issued package.**

#### C.1 Equipment lead-time benchmarks

| ID | Class | Benchmark | Source (as reported) | As-of | Age at 17 Nov 2026 | **Staleness** | Notes |
|---|---|---|---|---|---|---|---|
| `LT-01` | GSU | **>160 weeks** | GSU market lead-time reporting | **Q1 2026** | ~9 months | **AGING** | Reported up from **~143 weeks average in 2024** — a ~12% deterioration in roughly two years. The direction of travel matters as much as the level. |
| `LT-02` | Large power transformer | **~128 weeks** | WoodMac transformer survey | **Q2 2025** | ~17 months | **STALE** | **Older than the HV breaker figure.** Do not treat as current. |
| `LT-03` | Largest LPTs | **up to 48 months** | PwC | **Not established** | — | **UNDATED** | `[VERIFY: as-of date was not captured.]` Top-of-range figure; do not apply to a standard unit. |
| `LT-04` | HV circuit breakers | **~125 weeks** | HV breaker market lead-time reporting | **H2 2025** | **~12 months** | **STALE — expressly flagged** | **The benchmark this template calls out as out of date.** Flag it on every row that relies on it (Table 3.C, §5.4, Gap `G-12`). |
| `LT-05` | Bushings | **up to 130 weeks** | Component lead-time reporting | **Not established** | — | **UNDATED** | `[VERIFY: as-of date.]` "Up to" — justify per item before applying. |
| `LT-06` | MV switchgear, 38 kV class | **78–104 weeks** | Switchgear lead-time reporting | **Not established** | — | **UNDATED** | Reported against **~24 weeks pre-pandemic** — a 3–4× extension. **Straddles the 78-week threshold**; see §3.1. |
| `LT-07` | Distribution equipment | **40–78 weeks** | Distribution lead-time reporting | **Not established** | — | **UNDATED** | Reaches the threshold only at top of range. |
| `LT-08` | Slot reservation effect | Deposit **10–30% of equipment cost, typically non-refundable**; **without a reservation, nominal lead time extends a further 8–16 weeks** | Procurement practice reporting | **Not established** | — | **UNDATED** | Drives the Table 3.C penalty and Gap `G-04`. Midpoint use is an assumption — Appendix D `A-05`. |

#### C.2 Staleness classification rule (preparer's own)

Measured from the benchmark's as-of date to the data date: **CURRENT** ≤6 months · **AGING** >6–12 months · **STALE** >12 months · **UNDATED** no as-of date established. This is the preparer's convention, not a sourced standard (Appendix D, `A-04`).

#### C.3 Price context — **not a valuation**

| Item | Figure | Source | As-of | Caution |
|---|---|---|---|---|
| Recent 50–100 MVA transformer awards | **$30,000–$35,000 per MVA** (so a 100 MVA unit ≈ **$3.0–3.5M**) | Recent award reporting, **Europe** | Not established — **UNDATED** | **European awards. Not a US price benchmark.** Use only as a very rough order-of-magnitude sanity check, and say so wherever cited. |
| Transformer manufacturing PPI | **~+86% vs Jan 2020**; **+7.8% YoY to Sept 2026** | Producer price reporting | Sept 2026 | Index, not a transaction price. |
| Power transformers | **+77% vs 2019** | Price reporting | Not established | — |
| GSU | **+45%** | Price reporting | Not established | — |

#### C.4 Commercial-terms context

| Item | Reported range | Use |
|---|---|---|
| Payment splits observed | **30/70, 10/80/10, 20/70/10** | Reasonableness check on Table 3.A deposits |
| EPC practice | **15–30% advance; 5–10% retention through commissioning** | Reasonableness check |
| Delay liquidated damages | **capped at 5–15% of contract price** | Record in Table 3.A; **LDs are not a schedule cure** |

#### C.5 Supply-side context — **context only, never a basis for an earlier date**

Reported: WoodMac's power-transformer supply shortfall narrowed from **30% (2025)** to **15% (2026)**. New US capacity reported: **Siemens, Charlotte NC — production early 2027**; **Hitachi, South Boston VA — ~2028**; **Hitachi, Gallman MS — production 2029**; **Prolec GE, Goldsboro NC — ~420 units/yr**.

> Useful when advising an Owner whether re-sourcing is worth exploring. **Not a basis for assuming any line will arrive earlier than its contractual date.** Do not put capacity-expansion optimism on the critical path.

#### C.6 Queue context — why verification is being applied strictly

Reported, search-level: ERCOT large-load queue **~474 GW (Sept 2026)**; **420,812 MW = 90.2% data centres (Jun 2026, possibly stale)**; **~735 projects**; **198 GW of large load applied in Q1 2026 alone**; BNEF reports **49.8 GW delayed**. Nationally, **1,066 GW of US data centre interconnection requests**, with WoodMac expecting **~28% committed** and another analysis putting **23% high-confidence**; **one utility went from 18 GW to 11 GW after binding commitments**.

> Include a short version of this in the covering note if it helps the Owner understand why evidence is being tested hard — a queue in which only roughly a quarter of requests are expected to be real is a queue whose administrator will demand documents. **Do not present these figures as anything other than reported.**

### Appendix D — Assumptions register

| ID | Assumption | Why needed | Effect if wrong | Verification route | State |
|---|---|---|---|---|---|
| `A-01` | Proof is submitted through the TDSP, not directly to ERCOT | Determines routing (§1.3) | Misrouted submission could be treated as a failure to respond | TDSP written instruction; PUCT Project No. 59142 | `[VERIFY]` |
| `A-02` | The 18-month long-lead threshold equals **78 weeks / 547 days**, measured from order placement to contractual delivery | Determines which items qualify (§3.1) | Items wrongly included or excluded; a reviewer may read exclusion as concealment | PUCT Project No. 59142; TDSP | `[VERIFY]` |
| `A-03` | The eight supporting-document categories at §4.2 are the applicable set | Determines package completeness | Missing a required category | ERCOT's own current documentation; TDSP instruction | `[VERIFY]` |
| `A-04` | The staleness rule at C.2 (6 / 12 months) is a reasonable convention | Classifies benchmark age | Mis-stated confidence in benchmarks | Preparer's own convention — **not sourced** | Preparer judgement |
| `A-05` | Where no slot reservation is evidenced, the **12-week midpoint** of the reported 8–16 week penalty is applied | Produces a single benchmark date | Float over- or understated by up to ±4 weeks | OEM-specific written lead time | Preparer judgement |
| `A-06` | Site durations (`S`) for unordered lines are preparer estimates | Float cannot be computed without `S` | Float wrong by the error in `S` | OEM erection manuals; TDSP energization sequence; Owner's EPC | `[VERIFY]` |
| `A-07` | `ED` as supplied by the Owner is the operative energization date | Denominator of every float | All floats wrong | Owner; TDSP study documents | `[VERIFY]` |
| `A-08` | The ordering entity on each PO is the Batch Zero applicant | Determines whether Gap `G-05` applies | Evidence may not be attributable to the Project | PO face; Owner corporate records | `[VERIFY]` |
| `A-09` | `[PREPARER TO COMPLETE]` | | | | |

### Appendix E — Regulatory basis register and `[VERIFY]` schedule

**Every requirement this package is built on, with its source quality. This is the appendix a reviewer or opposing counsel will turn to first.**

| ID | Requirement / fact as used | Source quality | As reported | Verification route | State at issue |
|---|---|---|---|---|---|
| `RB-01` | Batch Zero eligibility verification supporting-document categories (eight items, §4.2) | **Search-level secondary. No primary document opened.** | ERCOT presentation to PUCT reported **20 Aug 2026** | PUCT **Project No. 59142**; ERCOT's own current documentation | `[VERIFY]` |
| `RB-02` | "Long-lead equipment" means **18 months or more** | Search-level secondary | As reported | PUCT Project No. 59142 | `[VERIFY]` |
| `RB-03` | **Attestation deadline reported as 15 July 2026 OR 24 July 2026 — CONFLICTING, unreconciled; neither stated as fact; both already past** | Search-level secondary, **internally inconsistent** | As reported | PUCT Project No. 59142; TDSP | **UNRESOLVED — see §1.6 and Gap `G-06`** |
| `RB-04` | All Batch Zero classifications issued are **CONDITIONAL**; loads that fail verification or fail to respond are subject to **disqualification** | Search-level secondary | As reported | The Project's own classification notice; PUCT Project No. 59142 | `[VERIFY]` |
| `RB-05` | Proof travels through the connecting utility (TDSP) | Search-level secondary | As reported | TDSP instruction | `[VERIFY]` |
| `RB-06` | ERCOT **may require** evidence that transmission providers purchased transformers and breakers; proof that site preparation/construction began; POs for customer-owned electrical equipment | Search-level secondary | As reported | PUCT Project No. 59142 | `[VERIFY]` |
| `RB-07` | PUCT approved Batch Zero **18 Jun 2026** | Search-level secondary | As reported | PUCT Project No. 59142 | `[VERIFY]` |
| `RB-08` | Abbott letter **3 Aug 2026**; classification notices suspended **7 Aug 2026**; conditional classifications issued from **3 Sep 2026** | Search-level secondary | As reported | PUCT Project No. 59142 | `[VERIFY]` |
| `RB-09` | Audit reports due **10 Dec 2026**; PUCT open meeting **17 Dec 2026** | Search-level secondary | As reported | PUCT Project No. 59142 | `[VERIFY]` |
| `RB-10` | **Community Impact Audit threshold 25 MW** — trigger, scope, owner and filing requirement **not established** | Search-level secondary, **incomplete** | As reported | PUCT Project No. 59142 | `[VERIFY]` — Gap `G-13` |
| `RB-11` | **257 developers / ~5,140 questions** | Search-level secondary, **expressly reported as unverified** | Reported **5 Nov 2026** | PUCT Project No. 59142 | **UNVERIFIED — context only; do not cite to a regulator** |
| `RB-12` | **373 projects / 302.2 GW excluded**; conditional **191.8–194.3 GW** = **66 GW base load (204 projects)** + **125.4–127.9 GW studied load (158 projects)** | Search-level secondary; ranges **unreconciled** | As reported | PUCT Project No. 59142 | `[VERIFY]` — context only |
| `RB-13` | Order-position transfer requires manufacturer's prior written consent; transfer is a **novation, not an assignment** | Search-level secondary; **2 of 2 PO forms examined require consent; 0 of 5 major HV OEM regimes established** | As reported | The actual governing OEM terms, by revision | `[VERIFY]` — Gap `G-05`; **refer to counsel** |
| `RB-14` | `[PREPARER TO COMPLETE: add every further `[VERIFY]` raised in this package]` | | | | |

**`[VERIFY]` closure summary at issue:** total raised `[ ]` · closed against a primary source `[ ]` · **open at issue `[ ]`**. Every open item must also appear in the Gap Memo.

### Appendix F — Adjacent regulatory matters — CONTEXT ONLY, NOT BATCH ZERO EVIDENCE

> **Do not submit any of this as Batch Zero eligibility evidence.** It is recorded so that the Owner's team does not confuse these proceedings with Batch Zero, and does not cite the wrong docket. All search-level sourced; `[VERIFY]` each before relying on it for anything.

**FERC section 206 show-cause proceedings.** Dockets **EL26-67 through EL26-72**, orders reported **18 Jun 2026**. Large load defined there as **peak load >50 MW interconnecting above 69 kV**. Abeyance of up to **90 days** reportedly granted **14 Aug 2026**; responses reportedly due **16 Nov 2026** (**SPP 20 Nov**); answers **16 Dec 2026**. **Note carefully: `RM26-4` is the PARALLEL GENERIC RULEMAKING, NOT the show-cause docket.** Citing `RM26-4` for a show-cause matter is a visible error — do not do it.

**NERC Computational Load Entity.** Board approval reported **8 Oct 2026**; FERC petition **21 Oct 2026**, **Docket RR27-1-000**. Thresholds reported raised from **20 MW / 60 kV to 50 MW / 100 kV**. New entity types **CLO** and **CLOP**. **CLO-001-003** reported to have passed final ballot **Oct 2026**. Reported **ROP deadline 31 Dec 2026**; **workplan due 1 Mar 2027**.

**Why a procurement engineer should care:** these proceedings carry their own thresholds and their own registration and compliance consequences on their own timetables. A project satisfying Batch Zero may still have obligations here. **Refer to the Owner's counsel — this package neither addresses nor discharges them.**

### Appendix G — Competitive and market context (optional; delete before regulatory submission)

Retained for the Owner's internal use where re-sourcing or secondary-market options are being explored. **All search-level; names and figures as reported; nothing here is a recommendation, a verification, or a representation about any company.** Delete this appendix from any regulatory submission.

- **Equipment marketplaces / exchanges:** Anza Exchange (founded 2021, ~86 employees; new power transformers, HV breakers, solar modules; $0 listing fee at launch; investors Angeleno Group and Energy Capital Partners); Surplus Record (4,469 transformer listings; >5,000 inquiries in a trailing year); Transformer Exchange Inc (dealer since 2008; example **$850,000 for a 336 MVA 230/15.5 kV GSU including a 230 kV breaker**); CTG Power Systems (1–350 MVA including GSU); Maddox Transformer; J&J Transformers (69–500 kV).
- **Advisory / procurement:** Burns & McDonnell / 1898 & Co (long-lead equipment procurement positioning); VAWN and Terrapin Consulting (lead-time indices).
- **Adjacent venture-funded entrants:** GridCARE ($64M Series A, May 2026); Critical Loop ($26M Series A, Apr 2026); Heron Power ($140M Series B, Feb 2026).

> **Standing caution on the secondary market:** on the sourced record, **no slot or order-position resale has ever been observed (0 instances after targeted search)**, and in MISO there were **2,325 withdrawn interconnection requests against 17 pending transfers.** A listing is not a transferable position. **Do not place a secondary-market acquisition on the critical path in Section 5.**

### Appendix H — Change log and instruction log

| Entry | Date | Version | What changed | Who requested | Who approved | Justifying document | Effect on markers / float |
|---|---|---|---|---|---|---|---|
| *`CH-001` `[ILLUSTRATIVE]`* | *`[date]`* | *1.1* | *`EV-003` upgraded ASSERTED → VERIFIED* | *`[preparer]`* | *`[reviewer]`* | *`DR-031` — OEM production schedule extract received* | *`EQ-001` evidence state improves; float unchanged* |
| `CH-002` | | | | | | | |

**This log must also record, verbatim and without editorialising:**
- Any request to **remove or soften the Verification Status Banner** (§0, banner).
- Any request to **alter the Preparer's Statement** (§2).
- Any request to **upgrade a verification marker without a document** (§0.4).
- Any request to **floor, net, hide or re-characterise negative float** (§5.1).
- Any **change to `ED`** and the resulting re-baseline (§1.2).
- Any instruction to **submit with CRITICAL gaps open** (§6.4), with the Owner's written instruction attached.

> These entries exist to protect both the Owner and this firm. A clean log is evidence of a properly run process. **A missing log entry for a request that was in fact made is the worst outcome available in this engagement** — worse than the request itself.

---

## PREPARER CHECKLIST

Work top to bottom. Do not issue with any item in `[ ]` unanswered. `N/A` requires a one-line reason recorded beside it.

### A. Before starting

- [ ] `C-01` Executed engagement letter in place; liability terms confirmed present (§2.18) — **if no cap, do not issue**
- [ ] `C-02` Scope confirmed against §1.7; exclusions understood
- [ ] `C-03` Owner's document-production obligations confirmed in writing
- [ ] `C-04` Authority to contact OEMs directly confirmed in writing, or confirmed withheld
- [ ] `C-05` Secure repository established; hashing procedure in place
- [ ] `C-06` Data date fixed and agreed with the Owner

### B. Regulatory basis — do this before building the package, not after

- [ ] `C-07` **PUCT Project No. 59142 read directly** — not from summaries
- [ ] `C-08` ERCOT's own current documentation checked for anything superseding the reported 20 Aug 2026 presentation
- [ ] `C-09` **TDSP's written submission instruction obtained** (channel, format, deadline, completeness)
- [ ] `C-10` §4.2 category list reconciled to primary sources; discrepancies logged in Appendix E
- [ ] `C-11` **Operative attestation deadline established in writing** — §1.6 table completed; if unresolved, Gap `G-06` carried
- [ ] `C-12` 18-month measurement convention resolved (`A-02`) or carried as a live `[VERIFY]`
- [ ] `C-13` Community Impact Audit (25 MW) applicability determined or carried as Gap `G-13`
- [ ] `C-14` Project's own classification notice obtained and its conditions transcribed verbatim (§1.5)
- [ ] `C-15` All outstanding verification enquiries logged with due dates (Gap `G-14`)

### C. Cover sheet and scope

- [ ] `C-16` §1.1–1.8 complete; **no blank cells anywhere**
- [ ] `C-17` **Ordering entity compared to the Project owner on every line**; `G-05` raised where they differ
- [ ] `C-18` `ED` fixed, sourced, and its provenance recorded
- [ ] `C-19` Phased projects: `ED` and Section 5 run separately per phase
- [ ] `C-20` TDSP routing confirmed; **not addressed to ERCOT directly**

### D. Preparer's statement

- [ ] `C-21` §2 reproduced **verbatim**; only bracketed identifiers filled
- [ ] `C-22` **No paragraph deleted, abridged, reordered or softened**
- [ ] `C-23` Any requested change escalated to the engagement principal and logged in Appendix H
- [ ] `C-24` Signed by preparer **and** reviewer; data date and version stated

### E. Equipment schedule

- [ ] `C-25` Every long-lead item captured; threshold-straddling items included and flagged (§3.1)
- [ ] `C-26` Tables 3.A / 3.B / 3.C complete for every line, keyed by a stable Line ID
- [ ] `C-27` Deposit **amount, percentage and refundability** answered from examined contract text with clause references
- [ ] `C-28` Slot reservation status evidenced or `G-04` raised
- [ ] `C-29` **Ex-works vs delivered** recorded with Incoterm and named place for every line
- [ ] `C-30` **Date provenance** (`CONTRACTUAL` / `FORECAST` / `ASSUMED`) marked on every line
- [ ] `C-31` LD rate and cap recorded, with the footnote that LDs are not a schedule cure
- [ ] `C-32` **Every benchmark citation carries its ID, value, source and as-of date in the row itself**
- [ ] `C-33` **Staleness recomputed against the actual data date** — `LT-04` flagged STALE; `LT-02` flagged STALE; `LT-03`, `LT-05`–`LT-08` flagged UNDATED
- [ ] `C-34` Contract dates materially better than benchmark flagged as outliers with a written OEM re-confirmation action
- [ ] `C-35` No benchmark-derived date substituted for an existing contractual date

### F. Evidence index

- [ ] `C-36` One row per **assertion**, written as a testable sentence
- [ ] `C-37` Every assertion carries exactly one state; qualifiers used where applicable
- [ ] `C-38` **"Limits of what this document proves" completed for every row** — no blanks
- [ ] `C-39` Every VERIFIED row names the verifier, the date, and an Appendix A register ref
- [ ] `C-40` Contract amendments sought for every contract; result recorded with the correct marker
- [ ] `C-41` §4.2 matrix complete across all 8 reported categories plus any TDSP additions
- [ ] `C-42` **TDSP-side equipment evidence requested in writing** (`G-09`); any refusal recorded verbatim
- [ ] `C-43` Site preparation / construction proof obtained, dated, with metadata (`G-10`)
- [ ] `C-44` Retail service agreement position resolved where the developer is the end-use customer

### G. Schedule reconciliation

- [ ] `C-45` Site duration (`S`) built up per line from named components with sources — **no blanket `S`**
- [ ] `C-46` **Ex-works lines include outbound transport in `S`**
- [ ] `C-47` TDSP energization sequence obtained in writing, or carried as a live `[VERIFY]`
- [ ] `C-48` `R`, `F_contract`, `F_bench` computed in days and reported in weeks with days shown
- [ ] `C-49` **Arithmetic shown so a reviewer can re-derive every float**
- [ ] `C-50` **No negative float floored, netted, averaged, re-characterised or hidden** (§5.1)
- [ ] `C-51` Negative-float register (§5.5) complete; each entry classified **evidence** vs **physical**
- [ ] `C-52` `F_program` = **minimum**, not mean; critical line named
- [ ] `C-53` Any change to `ED` logged in Appendix H with both floats shown

### H. Gap memo

- [ ] `C-54` Every GAP and every ASSERTED material line has a gap row
- [ ] `C-55` **Every rejection rationale carries `REPORTED REQUIREMENT` or `PREPARER INFERENCE`**, and no requirement is over-stated
- [ ] `C-56` Every gap has a **named individual** owner and a **specific date** — not a department, not "TBD"
- [ ] `C-57` Severity assigned; CRITICAL gaps gated per §6.4

### I. Before issue

- [ ] `C-58` **Every `[ILLUSTRATIVE]` row deleted** from every table
- [ ] `C-59` Every `[OWNER TO SUPPLY]` and `[PREPARER TO COMPLETE]` replaced
- [ ] `C-60` Every remaining `[VERIFY]` also appears in Appendix E **and** in the Gap Memo
- [ ] `C-61` **Verification Status Banner present on page 1, unaltered, naming PUCT Project No. 59142**
- [ ] `C-62` §1.6 states **both** reported attestation dates and asserts neither as fact
- [ ] `C-63` Executive summary (§1.9) completed **last**, stating program float **with its sign** and the negative-line count in its first sentence if negative
- [ ] `C-64` Appendices A–E complete; Appendix G deleted if the package is going to a regulator
- [ ] `C-65` Appendix H records every instruction of the kind listed at §7/H
- [ ] `C-66` Independent reviewer has re-performed **at least** the critical line's float arithmetic from source
- [ ] `C-67` Reviewer has re-tested a sample of VERIFIED markers back to the Appendix A documents
- [ ] `C-68` Owner's counsel has reviewed any attestation the Owner will sign (§2.12)
- [ ] `C-69` Owner's confidentiality and supplier-consent position confirmed (§2.16)
- [ ] `C-70` Package issued **whole** — banner, Preparer's Statement and Gap Memo together (§2.15)
- [ ] `C-71` Submitted through the **TDSP**; receipt and reference recorded in §1.3
- [ ] `C-72` Data date, version and distribution list recorded; **no commitment made to update** (§2.14)

---

**END OF TEMPLATE**

*Template version 1.0 · 17 November 2026 · Interconnection Equipment Evidence Package · $45,000 fixed per project (conform to the executed engagement letter)*

*The regulatory requirement set in this template is search-level sourced. No primary ERCOT filing, PUCT docket document or OEM contract was opened in its preparation. Verify against PUCT Project No. 59142 and ERCOT's own current documentation before use.*
