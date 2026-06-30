# GlowUp — *Restore your world.*

> **Clean it. Claim it. Glow up.** A highly social, location-based **augmented-reality game** that turns real-world cleanup into a competitive, cooperative, visually magical adventure.

GlowUp reveals a hidden second layer of the city. Litter and neglect create **Fade Zones** — places that appear dim, fractured, and drained of color. When players clean a real-world area, they restore it in *both* worlds: the physical space gets cleaner, the map blooms from gray to vivid, AR life returns, collectibles and stories unlock, and the restorers become permanently linked to that place.

> *"I was just going for a walk, but now I found a Fade Zone, restored part of my city, helped my crew climb the leaderboard, unlocked something rare, and made the real world better."*

This repository is an **interactive product prototype**: a self-contained, mobile-first React app that demonstrates the full core loop end to end. It is intentionally **front-end only** — no backend or specific cloud stack is prescribed — so the focus stays on product behavior, verification standards, gameplay systems, safety, and measurable impact.

---

## Run it

```bash
npm install
npm start        # http://localhost:3000
npm test         # smoke tests
npm run build    # production build
```

Best viewed in a narrow / mobile viewport (the app renders inside a phone frame). Progress persists to `localStorage`; reset it any time from **You → Reset demo progress**.

---

## The core loop (try this)

1. **Map** — open to a living map of the pilot city, *Riverbend*. Faded zones glow gray; restored ones pulse with color and a Glow Level.
2. **Start a mission** — tap a Fade Zone (or a solo *quick-run*) → safety brief → geofenced check-in → **before** capture.
3. **AR cleanup** — tap glowing litter fragments to collect them; sorted recyclables score higher. Tap a **hazard** (💉 / ☣️) and the game stops you — report it for points instead of touching it.
4. **Verify** — confirm the bag and (optionally) scan a disposal checkpoint, then watch **multi-signal verification** resolve to a confidence tier.
5. **Restoration reveal** — a screen-wide bloom of color, a rising AR beacon, points + impact breakdown, and any **place-tied guardian** you just earned.
6. **Come back** — climb your crew's leaderboard, join the **live event**, grow your collection, and track real civic impact.

> Toggle **"Demo: simulate spoofed location"** in the mission brief to see the quiet, fair anti-fraud **review** path in action.

---

## What's modeled

### Verified cleanup (anti-fraud by design) — `src/game/verification.js`
Never one signal. Each cleanup blends independent evidence — location/geofence, time on site, movement plausibility, in-app before/during/after capture, image-improvement analysis, bag & disposal confirmation, checkpoint scans, plus fraud signals (duplicate images, impossible travel, multi-account, repeat-location) and a private device **trust score** — into a single confidence value that maps to a tier:

| Tier | Meaning |
| --- | --- |
| **Glow Verified** | Present, plausible time, before/after captured, likely improvement |
| **High-Impact Verified** | + bag evidence + confirmed disposal / checkpoint |
| **Official Event Verified** | + geofenced event check-in + coordinator validation (counts fully for city reporting) |
| **Needs Review** | Suspicious signals → rewards held quietly, appealable, no public shaming |

### Impact Score (not weight-gaming) — `computeImpact()`
Raw bag weight is tracked as an *environmental metric only*. Rankings use a weighted, capped score: **35%** cleanup quality · **20%** location priority/condition · **15%** disposal & recycling · **15%** consistency & return · **10%** team & event · **5%** community leadership. Anomalous claims are capped and flagged.

### Gameplay systems
- **Living map & Fade Zones** with per-zone restoration progress and 10 Glow Levels (`MapScreen`).
- **Place-tied AR collectibles** — guardians earned only through meaningful action, never bought (`CollectionScreen`, `game/data.js`).
- **Crews & seasonal leaderboard** — your personal points feed your crew's weekly score; friendly school/neighborhood rivalries (`CrewScreen`).
- **Live group event** — the *Mayor's Cleanup Cup*: check in, join a team, a real-time Restoration Race, and a shared city counter whose milestones unlock sponsor donations and collective AR reveals (`EventScreen`).
- **Impact dashboards** — personal lifetime card plus living city numbers, donations unlocked, and neighborhood/school standings (`ImpactScreen`).
- **Safety, privacy & inclusion** — hazard reporting routed to the right authority, daylight/youth & family mode, hidden precise location, no required live location sharing (`ProfileScreen`).

---

## Project structure

```
src/
  App.js                  Phone-frame shell, player bar, screen routing, overlays
  index.css               Tailwind + the AR animation library (glow, reveal, beacon…)
  game/
    data.js               Seed world: Riverbend zones, guardians, crews, event, rewards
    verification.js       Confidence engine, tiers, weighted Impact Score (pure, testable)
    state.js              Reducer + context + localStorage; levels, badges, unlocks
  components/
    ui.js                 Design system (Card, Button, Chip, ProgressBar, GlowOrb…)
    BottomNav.js          Tab navigation
  screens/
    MapScreen.js          Living map, Fade Zones, quick-runs, AR Discovery
    MissionFlow.js        The immersive cleanup: brief → capture → cleanup → verify → reveal
    CollectionScreen.js   Glow Codex of place-tied guardians
    CrewScreen.js         Crews, weekly challenge, seasonal leaderboard
    ImpactScreen.js       Personal + city dashboards and shareable card
    EventScreen.js        Live event with shared AR progression
    ProfileScreen.js      Reputation, trust score, reward store, safety center
```

**Stack:** React (Create React App) · Tailwind CSS · lucide-react. No backend is assumed — verification, scoring, and persistence are modeled client-side so the product behavior can be explored directly.

---

## What an MVP would prove

1. People genuinely **enjoy** the game.
2. The verification system produces **credible** cleanup data.
3. Cities and sponsors see enough **measurable value** to fund expansion.

*Go outside. Make it brighter.* 🌱
