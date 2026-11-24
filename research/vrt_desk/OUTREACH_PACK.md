# OUTREACH PACK: NOG 2.15 ride-through desk, validation round

Prepared Tuesday 24 November 2026. Internal to the team. Every message below is ready once its brackets are filled. Send dates are in 0.3; everything except the developer email (2d) goes out today.

**Fix order used throughout.** (1) Correct the model if it is wrong. (2) Change UPS/PSU settings and firmware. (3) Tune controls and transfer schemes. (4) Add hardware (STATCOM, synchronous condenser, BESS) only if needed.

**Placeholder key.** `[YOUR: ...]` means the team supplies it. `[FIND: ...]` means look it up from the public source named and never guess. `[TEST PRICE: ...]` marks a price we are testing, not one we know the market accepts. Every price quoted goes in the tracker (section 6). Delete the bracket labels before sending, but keep the record of which price went to whom.

---

## 0. How to run the round

### 0.1 What each message tests

| Kill criterion (pre-registered) | Who decides it | Messages |
|---|---|---|
| **K1.** ERCOT will not accept family-level model validation (once per converter family) | ERCOT Dynamic Studies / Batch Zero team | 2a, 2e (ERCOT version), 4a at the 17 Dec LLWG. Second-hand checks: OEM call Q5, boutique calls (and the Keentel line in 2f) |
| **K2.** The OEMs will not share models | Schneider Electric, Eaton, Vertiv, ABB | 2b, 3A, 4b |
| **K3.** Fewer than 3 developers sign a paid triage within 10 business days of receiving ERCOT results | Developers, reached directly and through TSP referrals | 2c, 2d, 3B, 4c, 4d |

### 0.2 Write these definitions down today, before any reply arrives

These are suggestions. The team picks the wording once and does not change it after replies start.

- **K1, "will not accept":** ERCOT says each project must submit its own converter validation, for example project-specific hardware benchmarking. "Family validation accepted, plus project-specific settings or parameter confirmation" counts as acceptance. If there is no answer by the 17 Dec LLWG, ask in the meeting (4a). If there is still no answer by `[YOUR: date]`, then `[YOUR: kill / extend once by N business days]`. Silence does not count as a yes.
- **K2, "will not share":** none of the four OEMs agrees in writing (email is enough) to a way of releasing a validated model under NDA in time for the 1 Feb 2027 submissions. In practice that means released by about Mon 4 Jan 2027, which leaves four weeks of study work `[YOUR: adjust]`. To continue, require `[YOUR: at least 1]` OEM.
- **K3 clock:** Day 0 is the first business day a developer or TSP confirms that results were delivered. "Signed" means `[YOUR: signed SOW plus PO / deposit paid. Pick one]`. Business days exclude `[YOUR: 24-25 Dec, 31 Dec-1 Jan]`. Worked dates:

| Results delivered | Day 10 |
|---|---|
| Tue 1 Dec | Tue 15 Dec |
| Fri 4 Dec | Fri 18 Dec |
| Mon 7 Dec | Mon 21 Dec |
| Fri 11 Dec | Tue 29 Dec (holidays excluded) |

### 0.3 Send schedule

US Thanksgiving falls on Thursday 26 November. Send today's messages this morning and expect little back before Monday 30 November.

| Date | Action |
|---|---|
| **Tue 24 Nov (today)** | 2a to ERCOT, first, because 2b says we have asked ERCOT. 2b to Schneider Electric and Eaton, then to Vertiv and ABB. 2c to Oncor, then to CenterPoint and AEP Texas. 2f to the boutiques (path B only). LinkedIn notes 4b, 4c and (path B) 4e to the same people. Start building the developer list (1d). |
| Wed 2 Dec | 2e to OEM, TSP and boutique non-responders. |
| **Results day** (ERCOT says early December) | 2d to every developer on the list, the same day, one email at a time. 4d on LinkedIn. Start the K3 clock. |
| Results day + 3 business days | 2e to developers who haven't replied. Phone everyone who did reply. |
| Mon 7 Dec | ERCOT version of 2e, if 2a has had no reply. |
| Thu 10 Dec | ERCOT's Batch Zero eligibility verification report to PUCT is due (secondary: Gibson Dunn, Utility Dive). Read it for anything on VRT. |
| Thu 17 Dec | LLWG meeting. Ask 4a if K1 is still open. The PUCT open meeting is the same day (secondary). |
| Fri 18 Dec | K1 and K2 decision. The K3 decision falls on Day 10. |

### 0.4 Before anything goes out

- We have no clients, no ERCOT submissions and no OEM agreements, and nothing we send may suggest otherwise. Name the engineer who will do the work and state only experience that person actually has.
- Don't describe the firm as offering engineering services in Texas until `[YOUR: confirm firm registration with the Texas Board of Professional Engineers and Land Surveyors. On path B, confirm the partner's registration and PE seal cover the work]`.
- Don't send 2d until someone can deliver a triage within `[YOUR: X]` business days of signature. On path A, the engineer is hired and has PSS/E and PSCAD licences `[FIND: software versions ERCOT requires, which should be in the results package]`. On path B, a partner has agreed in writing.
- First-hour triage tool: `research/vrt_desk/tool/vrt_check.py`. It grades an exported PSCAD/PSS/E run against each NOG 2.15 clause, and its 32 tests pass. It is a triage aid, not a compliance determination, and its `[INTERPRETATION]` items still need ERCOT confirmation (see 1a).
- Have a mutual NDA ready `[YOUR: template reviewed by counsel]`. OEMs and developers will ask for one.
- Send each email one-to-one. No BCC lists, and no leftover mail-merge fields.

### 0.5 Facts the messages use

| Fact | Source | How to use it |
|---|---|---|
| ~260 Batch Zero large-load projects VRT-tested Sept-Nov 2026, using their submitted dynamic models, against NOG 2.15 | ERCOT LLWG deck, 19 Nov 2026 | Verified. ERCOT calls the results preliminary |
| 31% rode through and 69% failed (~180 projects) | same | Verified, preliminary |
| 68% of deficiencies were full or partial load loss and 24% slow recovery; some projects failed for more than one reason | same | Verified, preliminary |
| Results go to developers in early December; process and materials details come with the results | same | ERCOT's stated plan |
| One update window, with updated models due 1 Feb 2027 | same | Verified |
| Models that don't show ride-through mean no QSA, and no QSA means no Initial Energization (PG 9.6) | same | Verified |
| QSA window 1 Feb-30 Apr 2027 for Q4 2027 energization; prerequisites due 31 Jul 2027 for Q1 2028 | same | Verified |
| NOG 2.15 requirements (Table A, 90% within 2 s, current at most 150% for at most 0.5 s, etc.) | NOG Section 2, version dated 1 Nov 2026 | Verified |
| ~362 Batch Zero loads, ~194 GW; security of $50,000/MW; flat $100,000 PUCT study fee | Secondary | Say "reported" |
| Oncor 795 large-load requests (30 Sep 2026); CenterPoint >17 GW; AEP Texas 36 GW (Feb 2026) | Secondary | Say "reported" |
| Schneider, Eaton and Vertiv public material on UPS ride-through | Secondary | Check the original deck before quoting it back to the OEM |
| Keentel: 3-5 weeks or 4-8 weeks per package; OEM model release under NDA can take months | Secondary | Say "reported" |
| ERCOT accepts converter model validation once per converter family | One consultant's claim | **Unverified. This is K1. Never state it as fact.** |
| NERC draft CLO-001-1 ride-through modelling requirement, 50 MW and up, from mid-2027 | Secondary, weak | OEM call only, with the label. Never use it with ERCOT |
| Governor-elect's data-centre pledge; 90th Legislature; SB 338 | Secondary | Developer call only |
| Batch One expected to open summer 2027 under the same rule; ERCOT reportedly will miss the 9 Apr 2027 study-results deadline | Secondary | OEM call (Batch One) and developer objections (3C) only |

---

## 1. Who to contact, in priority order

### 1a. ERCOT Dynamic Studies / Batch Zero team (priority 1, decides K1)

**Why they matter.** K1 is ERCOT's decision and no one else's. Our asset, a reusable library of validated models and settings for each UPS/converter family, is only worth more than per-project consulting if ERCOT accepts validation done once per family. ERCOT also decides what the 1 Feb submission must contain, which is what we deliver. And it decides whether failing projects learn which provision they failed, which sets how fast triage can be.

**Where to write.**
- `BatchZero@ercot.com`: send 2a here and nowhere else.
- `LargeLoadInterconnection@ercot.com`: fallback if BatchZero@ercot.com hasn't acknowledged within 5 business days.
- `LargeLoadVerification@ercot.com`: don't use it. It handles PG 9.1(8) site-readiness verification.

**Finding the right person (public sources only).**
- Sun Wook Kang (Dynamic Studies) presented the 19 Nov 2026 deck "ERCOT's Update - Overview of Voltage Ride-Through Test Results". Cite the deck's title and date so the inbox routes the email to Dynamic Studies. Don't guess personal email addresses.
- LLWG meeting pages have the agendas and presenter lists for the 19 Nov and 17 Dec 2026 meetings.
- The NOGRR282 revision-request page lists an ERCOT staff contact `[FIND: staff contact on the NOGRR282 page]` and the filed comments.
- Role titles, if you need them: Dynamic Studies; Large Load Integration; Interconnection Planning.

**Rules.** Don't send LinkedIn messages to ERCOT staff or call their desk lines. Ask no project-specific questions and don't argue for a policy. ERCOT may answer at the LLWG rather than by email. That is fine, because developers will trust a public answer.

**Held back for the 17 Dec LLWG, if there's time** (these come from the `[INTERPRETATION]` list in `vrt_check.py`): Are Table A durations cumulative, so that time below 0.8 pu also counts as time below 0.9 pu? How is "pre-disturbance level" measured for a train of sags? Is "proportional to the voltage drop" read as P(t) >= P_pre x V(t)/V_pre?

### 1b. UPS / converter OEMs (priority 2, decide K2 and give a second read on K1)

**Why they matter.** They decide K2 directly. They also own the settings and firmware (fix step 2) and possibly the UPS controls (step 3), and they will know whether ERCOT, or anyone else, has accepted family-level validation.

**Order.** Schneider Electric and Eaton first, because both have public material on grid-friendly UPS behaviour. Then Vertiv, then ABB.

| OEM | What we know (secondary; check the original before quoting it) | Where to find the person |
|---|---|---|
| Schneider Electric | Showed NERC "firmware-updated" UPS behaviour that protects both the critical load and the grid (NERC LMWG deck, 27 Jan 2026) | `[FIND: presenter name and title on the 27 Jan 2026 NERC LMWG deck]`, then LinkedIn |
| Eaton | Told ERCOT (July 2025 deck "Data center - A Good Grid Citizen") that its UPS carries full load without battery to about -15% voltage, and proposed keeping the rectifier online through ride-through | `[FIND: presenter on the July 2025 ERCOT deck, from ERCOT meeting materials]`, then LinkedIn |
| Vertiv | Appears in NERC material only as a simulated 0.5 pu / 500 ms sag test | `[FIND: Vertiv grid-compliance or power-systems contact on LinkedIn]` |
| ABB | Nothing in our sources | `[FIND: whether ABB presented at LLWG or NERC, or filed NOGRR282 comments]`, then LinkedIn |

**LinkedIn searches.** Company name plus one of: grid compliance; grid code; power systems modelling; PSCAD; PSS/E; grid-interactive UPS; utility-interactive; data centre applications engineer; UPS product manager; principal engineer, power electronics; standards and regulatory.

**Other routes.** OEMs that filed NOGRR282 comments `[FIND]`. Presenter lists for the NERC LMWG and other NERC large-load groups `[FIND]`. The OEM account manager of any developer you speak to: ask the developer to introduce you to that OEM's grid-compliance team.

**Get two people at each OEM:** the engineer who owns the dynamic models, for the technical answer, and the person who can sign an NDA, for the K2 answer.

### 1c. Interconnecting TSP large-load teams (priority 3, the channel to K3)

**Why they matter.** TSPs submit Batch Zero materials on the developer's behalf (PG 9). So they know which of their customers are in Batch Zero, and they may learn who failed `[FIND: whether TSPs receive copies of ERCOT's VRT results]`. They can also tell us how the 1 Feb resubmissions will flow. They may not be allowed to recommend vendors. What we ask for is a place on the list they hand customers, not an endorsement.

**Order.**
1. Oncor: reported 795 active transmission large-load requests at 30 Sep 2026, ~293 GW of them data centres (secondary).
2. CenterPoint: reported to have submitted >17 GW to Batch Zero (secondary).
3. AEP Texas: reported 36 GW of SB6-compliant large loads in Feb 2026 (secondary).
4. Others: `[FIND: other TSPs with Batch Zero loads, from LLWG presenter lists and PUCT filings]`.

**Finding the right person.**
- `[FIND: Oncor large-load interconnection lead, via Oncor large load page / LinkedIn]`. Do the same for each TSP's large-load page.
- LLWG presenter and attendee lists `[FIND]`.
- LinkedIn titles: large load interconnection; transmission planning (large load); customer interconnection; key accounts (data centres); dynamic studies; system protection.

**Get two people at each TSP:** the large-load account or interconnection lead, for referrals, and the planning engineer who handles Batch Zero dynamic models, for the process.

### 1d. Developers likely to be in the failing cohort (priority 4 in send order, but they decide K3)

**Why they matter.** They decide K3. On ERCOT's preliminary numbers about 180 projects failed. Almost every Batch Zero LCL is subject to NOG 2.15. To be exempt, a load had to be operating, or have ERCOT approval to energize, by 14 Nov 2025, or be fully committed by that date (executed interconnection agreements, notice to proceed and funded facilities, with further conditions). ERCOT doesn't publish who failed, so we contact the likely cohort and let developers tell us.

**Priority among developers.**
1. Developers with several Batch Zero projects. With a 69% failure rate and independent results, a developer with three tested projects would have about a 97% chance of at least one failure. Results aren't fully independent, since the same design fails the same way.
2. Projects aiming for Q4 2027 energization. They need a QSA in the 1 Feb-30 Apr 2027 window, so the 1 Feb date binds them hardest.
3. Projects behind a TSP that has agreed to refer.
4. Projects using a UPS family whose OEM has agreed to share models.

Deprioritise LCLs whose ride-through equipment isn't a UPS/converter family we can cover.

**Where to find them.**
- Developers and associations that filed NOGRR282 comments `[FIND]`.
- LLWG attendee lists `[FIND: whether ERCOT posts LLWG attendance]`.
- PUCT filings for transmission built to serve large loads, which often name the customer `[FIND: PUCT Interchange search]`.
- Referrals from TSPs (1c), and from OEMs and boutiques with their permission.
- Local announcements of data-centre sites in ERCOT counties `[FIND]`.

**Role titles.** VP Energy / Power; Head of Interconnection; Director, Grid Integration; Director, Power and Interconnection; Electrical Engineering Lead; Development Director (Texas); Owner's Engineer. Also find out who built each submitted model. That firm is either a buyer or a competitor.

### 1e. Boutique engineering firms (path B only; priority 5, but start today)

**Why they matter.** On path B the partner is our delivery capacity. If ~180 projects need updated models by 1 Feb and a data-centre package takes 4-8 weeks (Keentel, secondary), engineering capacity will run out, so book it before results land. Partners also give a second read on K1: what ERCOT has accepted in their own submissions.

**Firms.** Keentel Engineering; Zero Emission Grid; EPE Consulting; Power Systems Consultants (PSC); INS Engineering; Quanta Technology.

**Handle these separately.**
- **Electranix** works with ERCOT on investigations. Check for a conflict before asking them to partner.
- **Inertiafy** (twin PSCAD/PSS/E data-centre models) could be a partner or a competitor. Ask what they have validated and whether ERCOT accepted it.
- **perc-studio** (open source; PSS/E PERC1/PERC2 with a NOGRR282 preset) can help with first-pass screening on either path. Check its preset against the 1 Nov 2026 NOG 2.15 text before relying on it.

**Finding the right person.** Firm team pages. LinkedIn titles: founder; principal engineer; power systems engineer (EMT / PSCAD); transmission planning; business development (power systems). LLWG and NERC presenter lists `[FIND]`.

**Screen for:** engineers free from mid-December to February; Batch Zero submissions already made; experience with the PERC1 large-load model and with UPS converters; Texas PE licence and firm registration; conflicts (ERCOT, TSP or OEM work); rates (none are published, so ask).

---

## 2. The emails

Each email is under 170 words, counted including the To and Subject lines and the placeholders. Keep what replaces a placeholder short. The engineer line in 2d should be one clause.

### 2a. ERCOT (send today)

```text
To: BatchZero@ercot.com
Subject: Questions on 19 Nov 2026 LLWG "Overview of Voltage Ride-Through Test Results"

Hello,

I am [YOUR: name], [YOUR: title] at [YOUR: firm], a new firm working on NOG 2.15 ride-through remediation for Large Computational Loads. We do not represent any Batch Zero ILLE. Three process questions on that update:

1. For the updated models due 1 February 2027, will ERCOT accept converter model validation done once per converter family, in the OEM's test environment, for all projects using that family? If so, what project-specific evidence is still required?

2. What format and materials will that submission require (model types, software versions, validation report, attestations)?

3. Will each failing project be told which NOG 2.15 provision it did not meet, and receive the simulated test waveforms?

If these will be covered with the results or at the 17 December LLWG, a pointer is enough.

Thank you,
[YOUR: name] | [YOUR: firm] | [YOUR: phone]
```

### 2b. OEM partnership (one per OEM; put that OEM's line in place of [OEM LINE])

```text
To: [FIND: OEM grid-compliance / modelling lead]
Subject: ERCOT NOG 2.15 ride-through: family-level models for [OEM] UPS

Hello [FIND: name],

I'm [YOUR: name] at [YOUR: firm], a new firm working on ERCOT NOG 2.15 ride-through for Large Computational Loads.

ERCOT's 19 November update: about 69% of ~260 Batch Zero projects tested failed, mostly on load loss or slow recovery. Updated models are due 1 February.

[OEM LINE]

We'd like to build with you a validated PSS/E and PSCAD model and ride-through settings per UPS family, reusable across projects. We've asked ERCOT whether it accepts per-family validation.

30 minutes with your model owner before 11 December? Questions:
1. Which families have hardware-validated models?
2. On what NDA terms can they be used in ERCOT submissions?
3. Which settings or firmware control sag response?

[YOUR: name, phone]
```

**OEM lines.** Check each one against the original deck before sending.

- Schneider Electric:
```text
Your 27 January 2026 NERC LMWG presentation showed firmware-updated UPS behaviour that protects both the critical load and the grid. Which families and firmware releases does that cover?
```
- Eaton:
```text
Your July 2025 ERCOT deck said your UPS carries full load without battery to about -15% voltage, and proposed keeping the rectifier online through ride-through. Which families, and is it shipping?
```
- Vertiv:
```text
The only Vertiv item we found in NERC material is a simulated 0.5 pu, 500 ms sag, the corner of NOG 2.15 Table A. What models and test data exist for your UPS families?
```
- ABB:
```text
We haven't found public ABB material on NOG 2.15 or large-load ride-through, so we'd like to start by asking what exists.
```

### 2c. TSP introduction (Oncor first, then CenterPoint, AEP Texas, others)

```text
To: [FIND: Oncor large-load interconnection lead — via Oncor large load page / LinkedIn]
Subject: Batch Zero ride-through failures: a referral option, no cost to [TSP]

Hello [FIND: name],

I'm [YOUR: name] at [YOUR: firm], a new firm set up to fix NOG 2.15 ride-through failures for Large Computational Loads.

ERCOT's 19 November LLWG update: about 69% of ~260 Batch Zero projects tested failed. Results reach developers in early December; updated models are due 1 February 2027.

The ask: when a customer asks who can help, include us on the list you give them. No cost to [TSP], no exclusivity, and we won't use your name without permission. If you can't name vendors, a pointer to whoever can is enough.

In return: aggregate, anonymised notes on the failure causes and fixes we see.

Two questions:
1. Will updated models go through [TSP], as the original submissions did?
2. Who on your team handles that?

Fifteen minutes this week or next?

[YOUR: name, phone]
```

### 2d. Developer triage offer (send the day ERCOT results land)

```text
To: [FIND: developer's VP Energy / Head of Interconnection]
Subject: ERCOT ride-through results: fixed-fee triage before 1 February

Hello [FIND: name],

ERCOT has started sending Batch Zero ride-through results. If a project failed NOG 2.15, there is one update window: models due 1 February 2027. No demonstrated ride-through means no QSA, and no QSA means no Initial Energization (PG 9.6).

ERCOT's preliminary numbers: 68% of deficiencies load loss, 24% slow recovery. Both can come from the model or UPS settings, which we check before hardware.

We're a new firm working only on this. Triage for one project:
- run your submitted model through the NOG 2.15 tests; name the provision it fails
- find the cause: model, UPS/PSU settings or firmware, controls, or hardware
- a fix plan against 1 February

Fixed fee [TEST PRICE: $25,000]. Report [YOUR: X] business days after we receive the model and results. Engineer: [YOUR: name, actual experience].

20 minutes this week?

[YOUR: name, phone]
```

Path B: name the partner firm in the engineer line only once it has agreed in writing. Send this email one-to-one and only once the delivery check in 0.4 is met.

### 2e. Follow-up for silence

**General version** (OEM, TSP, developer, boutique). Keep the one question for that audience and delete the other three.

```text
Subject: Re: [original subject]

Hello [name],

Following up on my note of [date] about NOG 2.15 ride-through. Since then: [pick one: ERCOT has started sending results / the 17 December LLWG is next week / ERCOT's results package asks for X].

The one question that matters most to us:
[OEM] Can hardware-validated models for your data-centre UPS families be used, under NDA, in ERCOT submissions due 1 February?
[TSP] Who on your team handles Batch Zero model resubmissions?
[Developer] Did any of your projects fail, and who is doing the update?
[Boutique] Do you have engineering capacity from mid-December to 1 February?

A one-line answer is fine, or the name of the right person. If this isn't relevant to you, say so and I won't write again.

[YOUR: name, phone]
```

**ERCOT version.** Send once, on Mon 7 Dec, if 2a has had no reply. After that, use the 17 Dec LLWG.

```text
To: BatchZero@ercot.com
Subject: Re: Questions on 19 Nov 2026 LLWG "Overview of Voltage Ride-Through Test Results"

Hello,

A short follow-up to my note of 24 November. The question we most need answered is the first: for the updated models due 1 February 2027, will ERCOT accept converter model validation performed once per converter family, or must each project submit its own validation?

If ERCOT prefers to answer at the 17 December LLWG, we will ask there.

Thank you,
[YOUR: name] | [YOUR: firm] | [YOUR: phone]
```

### 2f. Boutique partnership (path B only; send today)

```text
To: [FIND: founder or principal power-systems engineer]
Subject: Engineering partner for NOG 2.15 ride-through work, Dec-Feb

Hello [FIND: name],

I'm [YOUR: name] at [YOUR: firm], a new firm set up to fix NOG 2.15 ride-through failures for ERCOT Large Computational Loads. ERCOT's 19 November update suggests about 180 Batch Zero projects failed; updated models are due 1 February 2027.

We're looking for an engineering partner. We'd bring the OEM model work, developer sales and project management. You'd do the PSCAD/PSS/E and PERC1 work and submission packages, under your seal where required.

Four questions:
1. How many PSCAD/PSS/E engineers with UPS converter experience could you commit, mid-December to 1 February?
2. Have you made Batch Zero LCL submissions?
3. Any ERCOT, TSP or OEM work that would conflict?
4. Subcontract, referral, or something else?

30 minutes this week?

[YOUR: name, phone]
```

On the call, name only OEM conversations that actually exist at that point.

**Keentel only.** Add this line after question 2, but only once `[FIND: confirm that the per-family CMV claim is Keentel's own]`:

```text
We've seen it reported that ERCOT accepts converter model validation once per converter family in an OEM environment. Is that from your own submissions?
```

---

## 3. Call scripts

### 3A. OEM call (30 minutes, with the model owner and, ideally, the NDA signer)

**Opening (30 seconds):** "We're a new firm working on one problem: ERCOT's NOG 2.15 ride-through test. On ERCOT's preliminary numbers, 69% of the Batch Zero projects tested failed, mostly on load loss or slow recovery. They have one update window, with models due 1 February. We want a validated model and settings for each of your UPS families that many projects can reuse. We don't have OEM agreements yet. This call is to find out whether one is possible with you."

| # | Question | Confirms the thesis | Kills or weakens it |
|---|---|---|---|
| 1 | Since August, have customers asked you for NOG 2.15 models or settings? | Requests are already coming in and they want someone to handle the project work | No requests. That's neutral, but ask how customers are getting models |
| 2 | Which data-centre UPS families do you have PSS/E and PSCAD models for that show sag behaviour: transfer to battery, return to rectifier, walk-in ramp, input current limit, protection? | Both tools, maintained, with control and protection logic | No grid-side dynamic model, or only a generic or steady-state one. **K2-red for that OEM** |
| 3 | Have those models been benchmarked against hardware? At which sag depths and durations? | Test data across the Table A bands: 0.80-0.90 pu for 2.0 s, 0.50-0.80 for 0.5 s, 0.35-0.50 for 0.25 s, below 0.35 for 0.15 s | No hardware benchmark, so every project needs one. That is the "months" path (Keentel, secondary) |
| 4 | Will you release them under NDA for ERCOT submissions to (a) the developer, (b) a consultant working for the developer, (c) us as a standing partner? How long does a release take? | Release to a third-party consultant under a standard NDA, by about 4 Jan 2027 | Release only to the end customer, or only after per-customer commercial negotiation that can't finish before 1 Feb. **K2-red for that OEM.** If all four say this, K2 is killed |
| 5 | Has ERCOT, or any ISO or utility, accepted your validation at family level, so that projects reuse it? | Yes, and they can show us where (ask permission to cite it) | "ERCOT told us each project needs its own validation." **Strong K1 signal.** Write down the exact words, who said them and when |
| 6 | Which settings control sag response, and can they be changed in the field on installed units? (Transfer threshold and delay, return-to-rectifier delay, walk-in ramp, input current limit.) | Field-settable, and some combination gets back to 90% within 2 s without exceeding 150% current | Needs firmware that won't be released before 1 Feb, or a hardware change |
| 7 | NOG 2.15 pulls two ways: return to 90% within 2 s (within 0.5 s for a transfer scheme), but current no more than 150% of maximum normal, transient only, for at most 0.5 s. How does your rectifier handle both? | They know the trade-off and have settings for it | They have never looked at it |
| 8 | What does the UPS input do between 0.80 and 0.90 pu for 2 s? NOG 2.15 says keep consuming there, with any reduction no more than proportional to the voltage drop. | Stays on rectifier through that band | Transfers to battery while voltage is still above 0.80 pu. That shows up as load loss and is a likely failure cause (hypothesis) |
| 9 | Repeated sags: NOG 2.15 bans trips triggered only by a sag count. Where equipment limits force one, the load must stay connected through at least six sags or swells in 90 s, and each device gets one transfer or control action per disturbance. How does the UPS behave? | Known and configurable | Hard-coded counters or battery-cycle lockouts |
| 10 | Overvoltage: Table A requires 1.0 s at 1.10-1.20 pu. Until 1 Jan 2028, a load may trip or transfer above 1.08 pu lasting 5 s or more. What are your OV settings, and is AC instantaneous OV measured over at least one cycle? | Settings comply or can be changed | Unfiltered instantaneous OV trips that can't be changed |
| 11 | **OEM-specific.** Schneider: which families and firmware does the "firmware-updated" behaviour cover, and is it shipping? Eaton: is "rectifier online through ride-through" in shipping firmware, and what happens below about 0.85 pu? Vertiv: what exists beyond the simulated 0.5 pu / 500 ms test? ABB: what exists at all? | Shipping and documented | Roadmap only |
| 12 | Do you plan to offer NOG 2.15 model and settings support to customers yourselves, free or paid? | No, or they want a partner to do the project work | Yes, bundled free. Then our library adds nothing for that OEM's families, and at most we have a project-delivery role |
| 13 | What would you need from a partner: terms, exclusivity, branding, liability? | Workable terms | Exclusivity we can't give, or licence fees that break the triage price |
| 14 | Reported, not confirmed: NERC's draft CLO-001-1 may require ride-through parameters in planning models, updated at least every 13 months and verified against installed equipment, for loads of 50 MW and up from about mid-2027. ERCOT's Batch One is also reported to open in summer 2027 under the same rule. Would that change your plans? | They see demand beyond ERCOT and will invest | Neutral |

**Close.** "Can you send your NDA today? Who owns the commercial decision? Can we have a technical session with the model owner before 11 December?"
- Confirms: an NDA, a named model owner and a date.
- Weakens: "We'll get back to you," with no name.

**After each call, rate the OEM.** Green: will release under NDA by about 4 Jan 2027. Amber: will release, but later or with conditions. Red: won't release. Record the rating in the tracker against K2.

### 3B. Developer call (20 minutes)

**Opening (30 seconds):** "We're a new firm working only on NOG 2.15 ride-through failures. I won't claim a track record we don't have. I'd like to understand what ERCOT told you, then tell you what a triage would cover and what it costs."

| # | Question | Confirms the thesis | Kills or weakens it (for this developer) |
|---|---|---|---|
| 1 | Have you received ERCOT's results? How many of your projects were tested, and how many failed? | At least one failed | All passed. Ask who else they know |
| 2 | What did the results say: which tests failed, load loss or slow recovery, any waveforms? Can you share the process and required-materials section? | Clause and waveforms given, so triage is fast. The process section answers ERCOT questions 2 and 3, and possibly K1 | Pass/fail only, so we must reproduce the tests. Quote a longer delivery time |
| 3 | Who built the model you submitted, and who is doing the update? | Nobody yet, or their consultant can't meet 1 Feb | Their existing consultant has capacity and a plan, or the OEM is doing it for free |
| 4 | Which UPS/converter families and IT power supplies are in the design? Is the equipment ordered or installed? | A family whose OEM has agreed to share models, with field-settable settings | A family with no OEM access, or settings locked |
| 5 | Which quarter are you targeting for energization? | Q4 2027. They need a QSA between 1 Feb and 30 Apr 2027, so 1 Feb binds | Q1 2028 or later, so less urgency `[FIND: whether later-quarter projects can update models after 1 Feb 2027; ask ERCOT or the TSP]` |
| 6 | Is a hardware fix (STATCOM, synchronous condenser, BESS) on the table? | They would rather check model and settings first to avoid the capex and the space | Hardware already chosen and bought |
| 7 | Would you pay [TEST PRICE: $25,000] for a fixed-fee triage that names the failing provision, the cause and a fix plan within [YOUR: X] business days? | Yes, or yes at another number (record it) | Will only pay for a guaranteed pass, or only for the full fix |
| 8 | Who signs, and how long does a PO take? Could it be signed by [Day 10 date]? | The signer is on the call, and signature within 10 business days is possible | "Procurement takes six weeks." That counts as a **no for K3**, because we don't move the goalposts. Note it separately as a sign that K3 measured procurement rather than need |
| 9 | Does January change your spending this quarter? (Reported: the governor-elect, to be inaugurated 19 Jan 2027, has pledged to pause new data-centre permits and approvals until new protections exist, and has said she can't stop projects already under construction. The 90th Legislature convenes 12 Jan 2027. SB 338 targets data centres new after 1 Sep 2027.) | "No. We're under construction or committed." | Spending frozen until the session ends |
| 10 | If triage shows the project needs remediation, our working range is $75k-$300k, depending on whether a validated family model exists [TEST PRICE: internal estimate; give it as a range, never as a quote]. Is that within reach? | Within budget and below the cost of hardware | No budget |

**Close.** "I'll send a one-page SOW today. Can [signer] sign by [date]?" Send the SOW the same day.

**What the triage checks** (so the caller can explain it). These come from the NOG 2.15 text. The listed causes are hypotheses until we see a model.
- Measurement point: is ride-through measured at the Service Delivery Point, or at the POIB if the load is co-located with generation or storage?
- 0.80-0.90 pu: does the load keep consuming, with any reduction no more than proportional to the voltage drop? (Likely failure: UPS transfers to battery above 0.80 pu.)
- Below 0.80 pu: is it back to at least 90% of pre-disturbance within 2 s of voltage returning above 0.90 pu? (Likely failure: return-to-rectifier delay or walk-in ramp too slow.)
- Transfer scheme, if used: does return begin within 0.25 s and reach 90% within 0.5 s? Is there only one action per disturbance per device?
- Current no more than 150% of maximum normal, transient only, for at most 0.5 s.
- Protection: instantaneous OC/OV on filtered quantities or with time delays; AC instantaneous OV window of at least one cycle; no sag-count trips (or six sags in 90 s if equipment forces one).
- Cooling and mechanical load tripping below 0.35 pu is allowed and comes out of the pre-disturbance figure. Check whether a "failure" is only permitted cooling trips. Our reading: cooling trips above 0.35 pu are not allowed.
- Which tier applies: PG 9.5 satisfied after 14 Nov 2025 and on or before 1 Jan 2028, or after 1 Jan 2028 (stricter between 0.8 and 0.5 pu).
- Tool: `research/vrt_desk/tool/vrt_check.py`, run with `--tier` and `--transfer-scheme` set to match the project.

### 3C. Questions you'll be asked, and straight answers

- **"What have you done before?"** "We're new. [YOUR: engineer] has [YOUR: real experience]. We haven't completed an ERCOT submission as a firm."
- **"Can you guarantee a pass?"** "No. Triage tells you what fails, why, and what the fix is likely to be."
- **"Why not just go to the OEM?"** "Ask them for the model in any case. We do the study and the submission package around it. If the OEM does all of that for free, you don't need us."
- **"Why not our existing consultant?"** "If they can meet 1 February, use them. Triage also works as a second opinion."
- **"ERCOT will extend everything anyway."** "ERCOT is reported to be likely to miss its 9 April 2027 study-results deadline. But its ride-through deck sets 1 February for updated models and describes one update window. Plan to the date ERCOT has published."
- **Never:** claim past projects or clients; share another developer's results; say ERCOT accepts family validation before ERCOT has said so in writing; criticise their consultant.

---

## 4. Short messages (LinkedIn notes, under 300 characters)

**4a. ERCOT.** Use this at the 17 Dec LLWG (spoken Q&A or meeting chat), not as a LinkedIn message to staff.
```text
For the 1 Feb 2027 updated models: will ERCOT accept converter model validation done once per converter family, or is project-specific validation required? And will failing projects be told which NOG 2.15 provision they failed, with the test waveforms?
```

**4b. OEM**
```text
Hi [name], I'm with a new firm working on ERCOT NOG 2.15 ride-through. ERCOT's 19 Nov update: ~69% of Batch Zero loads tested failed, mostly load loss; updated models due 1 Feb. Who at [OEM] owns the PSS/E/PSCAD models for your data-centre UPS families?
```

**4c. TSP**
```text
Hi [name], new firm fixing NOG 2.15 ride-through failures. ERCOT says ~69% of Batch Zero loads tested failed; updated models due 1 Feb. Could we be on the list you give customers who ask for help? No cost to [TSP]. Who handles model resubmissions?
```

**4d. Developer** (send on results day)
```text
Hi [name], ERCOT's ride-through results are going out. If a project failed NOG 2.15, updated models are due 1 Feb 2027, and no QSA means no Initial Energization. We offer a fixed-fee triage: failing provision, cause, fix plan. 20 minutes this week?
```

**4e. Boutique** (path B)
```text
Hi [name], we're setting up NOG 2.15 remediation for ERCOT Batch Zero loads (~180 failed; models due 1 Feb). We bring sales, PM and OEM model work; looking for a PSCAD/PSS/E engineering partner. Any capacity mid-Dec to Feb? 20 minutes?
```

**4f. Follow-up for silence** (any audience except ERCOT)
```text
Hi [name], following up on my note about NOG 2.15 ride-through. A one-line answer is fine: [the one question from 2e]. If I've got the wrong person, who should I ask?
```

---

## 5. What we do and why now (say it out loud)

> ERCOT has just run its new ride-through test, NOG 2.15, on about 260 of the large data-centre and computing loads in Texas's Batch Zero queue, using the models the developers submitted. On preliminary numbers, 69% failed. Mostly that's because, in the model, the load drops off the grid during a voltage dip or comes back too slowly afterwards. Developers get their results in early December and have one chance to send fixed models, due 1 February. If the model still fails, the project can't get its stability assessment, and without that ERCOT won't let it energize. Our method goes in order of cost. First correct the model if it's wrong, then change UPS and power-supply settings and firmware, then tune controls, and only then add hardware like a STATCOM or a battery. We're asking the UPS makers to build with us one validated model and settings set per equipment family, so the work can be reused across projects instead of redone for each one, and this month we're checking whether ERCOT will accept that. Why now: about 180 projects have roughly eight weeks, over the holidays, to fix the same kinds of problem.

---

## 6. Tracker (copy into the team sheet)

| Contact (role, organisation) | Audience | Found via | Sent (date, channel) | Follow-up due | Reply (exact words) | K1 / K2 / K3 effect | Price quoted | Next step |
|---|---|---|---|---|---|---|---|---|
| BatchZero@ercot.com | ERCOT | ERCOT documents | | Mon 7 Dec | | K1 | none | |
| [FIND] | Schneider Electric | | | Wed 2 Dec | | K2 (and K1) | none | |
| [FIND] | Eaton | | | Wed 2 Dec | | K2 (and K1) | none | |
| [FIND] | Vertiv | | | Wed 2 Dec | | K2 | none | |
| [FIND] | ABB | | | Wed 2 Dec | | K2 | none | |
| [FIND] | Oncor | | | Wed 2 Dec | | K3 channel | none | |
| [FIND] | CenterPoint | | | Wed 2 Dec | | K3 channel | none | |
| [FIND] | AEP Texas | | | Wed 2 Dec | | K3 channel | none | |
| [FIND] | Developer | | Results day | Results + 3 | | K3 | [TEST PRICE] | |
| [FIND] | Boutique (path B) | | | Wed 2 Dec | | Capacity, K1 | none | |

**Decision record.** On Fri 18 Dec (K1, K2) and on Day 10 (K3), write one line per criterion: met or not met, the evidence (quote and source), and the decision, continue or stop. Keep the definitions from 0.2 as written.
