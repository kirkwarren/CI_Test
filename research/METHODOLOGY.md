# Methodology & Provenance

How the opportunity list in this directory was produced, what it is based on, and — importantly — where its coverage is weak. Read this before acting on any individual finding.

Research conducted 2 August 2026.

## Pipeline

The study ran as a multi-stage agent pipeline, not a single pass. Each stage was designed to destroy weak candidates rather than accumulate them.

```
15 parallel scouts (different search modalities)
        │  172 raw candidates
        ▼
grouper ──► 66 cut as consensus, 64 groups formed
        │
        ▼
9 sharded mergers ──► 77 distinct opportunity records
        │
        ▼
screening analysts (live competitor searches, one batch per 6)
        │  cut anything with 3+ funded incumbents
        ▼
adversarial verifiers (2 independent lenses per leader,
   instructed to REFUTE, defaulting to refuted on thin evidence)
        │  disqualified if refuted by both lenses
        ▼
diversity-constrained final selection ──► top 25
```

### The 15 scout lenses

Each scout searched a deliberately different way, so that no single blind spot could hide an entire class of opportunity.

| Lens | Hunting ground |
| --- | --- |
| `x-discourse` | X/Twitter operator and builder threads, unrolls, quoted threads |
| `reddit-pain` | 30+ unglamorous practitioner subreddits |
| `hn-technical` | Ask HN / Show HN, dissenting top comments, lobste.rs |
| `regulatory-pipeline` | Dated compliance clocks landing 2027–2031, globally |
| `cost-curves` | Price/performance thresholds crossed in the last ~24 months |
| `demographics-labor` | Mathematically certain population and labour-supply shifts |
| `physical-industrial` | Grid, water, logistics, materials, reshoring, defence-adjacent |
| `enterprise-procurement` | Public tenders, job posts that substitute for missing software, 10-K risk factors |
| `research-to-market` | 2024–26 findings and patents sitting uncommercialised |
| `graveyard-revival` | Dead startups whose specific killer no longer applies |
| `boring-cashflow` | AS400-era verticals, PE-gouged incumbents, EOL migrations, micro-verticals |
| `ai-second-order` | What becomes scarce, broken, or newly necessary *because* AI is everywhere |
| `consumer-culture` | Behaviour and status shifts with commercial consequences |
| `global-leapfrog` | Public digital rails abroad with no application layer yet |
| `infra-standards-gaps` | Published specs with a ticking clock and an empty tooling market |

### Anti-consensus rules

Scouts operated under disqualifying constraints, applied before scoring:

- Generic "AI agents", "vertical AI SaaS", "AI SDR", "digital health", "creator economy tools" and "carbon accounting" were **banned as categories** unless attached to a specific, demonstrably uncrowded wedge.
- Anything appearing in a "top startup ideas 2026" listicle was disqualified by definition — if it is written up, it is not overlooked.
- Every candidate required real evidence: URLs, dated primary sources, filings, standards documents, procurement notices, or price curves.
- Specificity was scored over grandeur. "Compliance for the EU Battery Passport's Feb 2027 deadline" beats "sustainability software".

### Scoring

Screening analysts scored each opportunity 1–10 on five dimensions and were required to run live competitor searches for every candidate before scoring:

```
composite = overlooked        × 0.28
          + inflection_3_5yr  × 0.24
          + buildable_today   × 0.20
          + market_size       × 0.16
          + defensibility     × 0.12
```

`overlooked` carries the most weight because it is the scarcest property — the other four are comparatively easy to find together.

Analysts were instructed that a screener who advances everything is useless. The first screening round advanced only 10 of 24.

### Adversarial verification

Leaders were then attacked by two independent verifier lenses, each told to refute rather than appreciate, and to default to "refuted" when evidence was thin:

- **Crowding lens** — try to prove the space is already served, searching practitioner jargon rather than the candidate's marketing name. An incumbent who could ship this as a feature next quarter counts against it.
- **Demand lens** — try to prove the `why_now` is fiction. Verify the trigger exists, has not slipped or been repealed, and actually binds the named party. Check that the sufferer is also the payer.

Refuted by both lenses = disqualified.

## Coverage limitations — read this

These are real constraints on the study, not disclaimers.

### 1. WebFetch was hard-blocked for the entire study

The environment's egress proxy returned `HTTP 403` to `CONNECT` for **every** external host attempted — including `news.ycombinator.com`, `eur-lex.europa.eu`, `csrc.nist.gov`, `federalregister.gov`, `peppol.org` and `gs1.org`. The proxy documentation directs that policy denials be reported rather than circumvented, so no attempt was made to route around it.

**Consequence: no primary source page was ever opened.** All evidence is *search-level* — titles, URLs, and search-engine-extracted content. Dates, figures, and regulatory effective dates cited in these findings have **not been verified against the primary document**.

> Before committing capital or engineering time to any finding here, open its cited sources and re-verify every date and number. Treat the specific figures as leads, not facts.

### 2. Reddit was inaccessible

The search tool refuses `reddit.com` by name. The `reddit-pain` lens — designed to capture unfiltered practitioner voice — could not retrieve a single verbatim Reddit quote. It compensated by pursuing the same substance through trade press, regulatory notices, and vendor-consolidation events, but the raw practitioner voice this study was meant to sample is largely absent. No quotes were fabricated to fill the gap.

### 3. Four lenses initially returned nothing and were re-run

`physical-industrial`, `research-to-market`, `graveyard-revival` and `consumer-culture` returned zero candidates on the first pass, having abandoned their assignments when WebFetch failed. They were re-run under explicit WebSearch-only instructions and delivered 12, 13, 12 and 14 candidates respectively. Because they ran a full stage later than the others, they received somewhat less cross-referencing than the first-pass lenses.

### 4. `boring-cashflow` lost its first-pass results

A caching artifact during the re-run caused this lens to return zero on its second execution. Its original 12 candidates were recovered from the run journal and re-injected into the pool rather than discarded.

### 5. Session limits truncated the first screening round

Seven of eleven screening batches failed against a usage limit. Those 53 opportunities were re-screened in a later stage. No opportunity reached the final selection without being screened.

### 6. Structural skew toward regulatory triggers

The candidate pool leans heavily toward compliance and regulatory-clock opportunities. This is **partly genuine signal** — a published effective date is the most legible form of "why now" available, and most founders do not read regulations — and **partly an artifact**, because the lenses that survived the tool blockage best were the ones that mine dated documents.

A hard diversity constraint was therefore imposed on the final selection: no more than 8 regulatory-clock entries, and at least 5 categories with 2+ entries each. See `diversity_note` in the findings for how well the surviving pool actually supported that.

## What "overlooked" means here

It does not mean nobody has ever thought of it. It means that at the time of research, live searches did not surface a set of well-funded companies executing the specific wedge described. That is a statement about search results in August 2026, not a guarantee of an empty market. Competitors that are quiet, pre-launch, non-English, or operating as consulting practices are systematically under-detected by this method.

## Reproduction

The workflow scripts that produced this study are retained in the session's workflow directory. The run journals contain every agent's full return value, including the 66 candidates cut as consensus and the reasons for each — often as informative as the survivors.
