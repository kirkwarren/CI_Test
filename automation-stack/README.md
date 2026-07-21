# Mindful Movement PT — Small Business Automation Stack

A self-contained Node.js automation stack for small clinics (built around Mindful Movement PT, but fully config-driven via `config/clinic.json`). It covers the front-desk and back-office work that eats a small practice's day:

| Automation | What it does |
|---|---|
| **AI receptionist** | Answers SMS and phone calls when the front desk isn't available. Powered by the Claude API, grounded in clinic facts, and pitches packages **only** according to the rules Emily wrote in `config/clinic.json` (`pitchGuidelines` + per-package `pitchWhen`). Anything it can't resolve lands in a human follow-up queue for the morning. |
| **Automated booking** | Slot generation from business hours, double-booking prevention, booking API, and instant SMS confirmations. |
| **Automated texting** | Central outbox with quiet-hours deferral (TCPA-friendly), STOP/START opt-out handling, and appointment reminders 24h before each visit. |
| **Patient nudges** | Rules engine that texts: no-shows without a rebooking, plan-of-care drop-offs, patients with expiring packages and unused visits, and dormant patients (60+ days). Every rule has a cooldown so nobody gets spammed. |
| **Google review requests** | 2 hours after a completed visit, patients get a text with the clinic's Google review link — at most once per 90 days per patient, never to opted-out patients. |
| **Patient note taking** | `POST /api/notes/draft` turns the clinician's rough dictation into a structured SOAP note draft (plus CPT code *suggestions* and red-flag callouts) via Claude. Notes are stored as `draft_pending_review` — a licensed clinician must review and sign. |
| **Bookkeeping** | Simple ledger (charges, payments, package sales), per-patient balances, daily revenue summary, A/R aging report, and a QuickBooks-importable CSV export. |
| **Owner digest** | Emily gets a daily 5:30pm text: visits completed, no-shows, tomorrow's schedule, cash collected, texts sent, open follow-ups. |

## Quick start

```bash
cd automation-stack
npm install
cp .env.example .env      # fill in keys, or leave empty and use DRY_RUN
npm run seed              # demo patients/appointments
npm run demo              # end-to-end dry run: receptionist + nudges + digest
npm test                  # unit tests (no network, no API keys needed)
npm start                 # webhook server + scheduler
```

`DRY_RUN=1` makes every outbound SMS and Claude call log locally instead of hitting the network — safe to explore with zero credentials.

## Wiring it up

1. **Twilio number** → point *Messaging* webhook at `POST /webhooks/sms` and *Voice* webhook at `POST /webhooks/voice`. Configure your desk phone to forward to the Twilio number on no-answer/after-hours, so the AI receptionist only picks up when the front desk doesn't.
2. **Set `PUBLIC_URL`** so Twilio webhook signatures are validated (requests are rejected otherwise once `TWILIO_AUTH_TOKEN` is set).
3. **`ANTHROPIC_API_KEY`** powers the receptionist and note drafting (model defaults to `claude-opus-4-8`).
4. **Practice management**: bookings/completions flow through `/api/appointments*`; wire your PM system or use these endpoints directly.

## API surface

```
POST /webhooks/sms                      Twilio inbound SMS → AI receptionist (TwiML reply)
POST /webhooks/voice                    Twilio inbound call → greeting + speech gather
POST /webhooks/voice/handle             Speech result → AI receptionist (spoken reply, texts booking link)
GET  /api/slots?days=7&durationMin=60   Open slots from business hours minus booked time
POST /api/patients                      Create patient
POST /api/appointments                  Book { patientId, startIso, serviceId }
POST /api/appointments/:id/complete     Mark complete (+ optional { amount } payment) → triggers review request
POST /api/appointments/:id/no-show      Mark no-show → picked up by the nudge engine
POST /api/notes/draft                   { patientId, visitType, transcript } → SOAP draft
POST /api/packages/sell                 { patientId, packageId } → ledger + package on patient
GET  /api/reports/daily                 Money summary + owner digest numbers
GET  /api/reports/aging                 Outstanding balances
GET  /api/reports/quickbooks.csv        Ledger export for QuickBooks import
GET  /api/patients/:id/balance          Per-patient balance
```

## How Emily controls the package pitching

Everything the receptionist is allowed to say about money lives in `config/clinic.json`:

- `services[].cashPrice` — the only prices it may quote.
- `packages[].pitch` — the exact pitch script per package.
- `packages[].pitchWhen` — the situations where that pitch is allowed (e.g. `pricing_question`, `post_eval`, `graduation`).
- `pitchGuidelines` — Emily's free-text rules, injected into the system prompt verbatim ("give the single-session price first", "if they hesitate, drop it", ...).

The model is also hard-ruled to never invent discounts, never give medical advice, and to route emergencies to 911.

## Architecture

```
Twilio SMS/Voice ──► server.js ──► receptionist (Claude) ──► TwiML reply
                                   │                          └► followups queue (human callback)
Booking API ───────► booking.js ──► outbox (confirmations)
                     scheduler.js (every minute/hour)
                       ├► outbox.processOutbox      — quiet hours + opt-outs, then Twilio REST
                       ├► booking.runReminderJob    — 24h reminders
                       ├► followups.runFollowups    — daily nudge rules
                       └► owner digest at 17:30
Notes API ─────────► soap.js (Claude, structured output) ──► draft_pending_review
Checkout ──────────► ledger.js ──► daily summary / aging / QuickBooks CSV
                     reviews.js ──► review request 2h post-visit
Storage: single JSON file datastore (data/store.json) — swap for a real DB in production.
```

## Other suggested automations (natural next steps)

- **Waitlist backfill** — when a cancellation opens a slot inside 48h, text the waitlist in order until someone claims it.
- **Digital intake** — text new patients an intake form link at booking; nudge if incomplete 24h before the eval.
- **Insurance/superbill automation** — monthly superbill PDFs emailed automatically for out-of-network reimbursement.
- **Birthday & milestone texts** — small-touch retention messages.
- **Referral thank-yous** — detect "how did you hear about us", auto-thank referring patients/providers.
- **Home exercise program check-ins** — mid-week "how did the exercises go?" text whose reply is summarized for Emily.
- **Payroll/CPA export** — monthly ledger roll-up emailed to the accountant.
- **Reactivation campaigns** — seasonal (e.g. "new year tune-up") batches to dormant patients, still respecting opt-outs.

## Compliance notes (read before production)

- **HIPAA**: patient names, phone numbers, and notes are PHI. Before going live you need BAAs with every vendor touching PHI (Twilio, Anthropic, hosting). Keep SMS content low-detail (appointment logistics, not diagnoses), encrypt data at rest, and replace the JSON datastore with a proper database with access controls and audit logging.
- **TCPA/texting**: patients must consent to texts at intake; STOP/START is handled automatically and quiet hours (default 8pm–8am clinic time) are enforced on every outbound message.
- **Reviews**: review requests go to *all* patients after visits (rate-limited), with no sentiment gating — selectively soliciting only happy patients violates FTC guidance and Google's policies.
- **Clinical documentation**: SOAP drafts and CPT suggestions are drafts only; a licensed clinician must review, correct, and sign every note. The receptionist is hard-ruled to never give medical advice.
