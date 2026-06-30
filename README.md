# GlowUp — *Clean it. Claim it. Glow up.*

> A **native iPhone** augmented-reality game in the spirit of Pokémon Go — but the
> creatures are **litter gremlins** overlaid on real trash. Point your camera at
> litter on the ground, a gremlin appears, and you **banish it by picking the
> litter up and disposing of it** for points. Climb neighborhood → city → state →
> global leaderboards, and winning regions earn **grants that fund real community
> improvement**.

This repository is a **native iOS app** (SwiftUI + ARKit/RealityKit + MapKit +
Core Location + Vision/Core ML), plus the **machine-learning pipeline** for the
on-device litter detector and a thorough **unit-test suite** for the game core.

---

## ⚠️ What runs where (honest status)

This codebase was authored in a Linux container with **no Xcode and no GPU**, so:

- The **Swift app cannot be compiled here** — it requires Xcode on macOS. The
  sources are complete and reviewed, but treat "builds on first try" as
  unverified until opened in Xcode.
- The **litter detector is not a trained binary.** The full, runnable training
  + evaluation + Core ML export pipeline is in [`ml/`](ml/), with documented
  **acceptance targets** (mAP\@0.5 ≥ 0.85, etc.) the eval harness enforces.
  Until a model is trained and dropped in, the app uses a `MockLitterDetector`
  so the AR hunt is fully demoable.
- What **is** verified here: the geohash algorithm (checked against the
  canonical reference vector) and the Python pipeline's syntax. Everything else
  is covered by the XCTest suite, to be run in Xcode.

---

## Build & run

```bash
brew install xcodegen          # one-time
xcodegen generate              # creates GlowUp.xcodeproj from project.yml
open GlowUp.xcodeproj          # build & run on an AR-capable iPhone (iOS 16+)
```

- The **simulator** has no camera/AR, so the encounter runs on a scripted
  detection stream (still demoable end-to-end).
- For live detection on device, train a model (`ml/README.md`) and add
  `LitterDetector.mlpackage` to the `GlowUp` target — `CoreMLLitterDetector`
  loads it by name automatically.

Run tests in Xcode (`⌘U`) or:

```bash
xcodebuild test -scheme GlowUp -destination 'platform=iOS Simulator,name=iPhone 15'
```

---

## How it plays

1. **Map** (`MapScreen`) — a real MapKit map with your live location and nearby
   gremlin sightings scattered around you, Pokémon-Go style.
2. **Hunt** (`EncounterView`) — tap *Hunt gremlins (AR)* to open the camera.
   ARKit world-tracks the scene; the **on-device detector** runs ~6 Hz on each
   frame; confirmed litter becomes a glowing gremlin anchored to the ground.
3. **Banish** (`BanishSheet`) — tap a gremlin, pick the litter up, **sort it into
   the correct recycling stream** (bonus points), and capture the "after". The
   scoring engine verifies the evidence and awards points (or quietly holds them
   for review if something looks off).
4. **Compete** (`LeaderboardsScreen`) — your points fan out to **neighborhood,
   city, state, and global** boards for the season.
5. **Give back** (`AwardsScreen`) — top regions and cleanup milestones unlock
   sponsor grants; residents vote which local project (trees, benches, mural,
   garden) the grant funds. Awards fund **community improvement, never cash to a
   player**.

## The litter detector (camera accuracy)

On-device **YOLO → Core ML** object detector run through Vision. Privacy-first
(frames never leave the phone), offline, low-latency. The hard problem is
*false positives* (leaves/gum/shadows becoming phantom gremlins), so accuracy is
defended on two fronts:

- **Model** (`ml/`): trained on TACO + TrashNet + Roboflow + a first-party
  ground-angle field set, with heavy **hard-negative mining**. A
  location-disjoint test split and an `evaluate.py` CI gate enforce mAP,
  per-class precision/recall, a phantom-box ceiling on negatives, calibration,
  and slice metrics. See the [model card](ml/README.md).
- **On-device gating** (`DetectionGate`): per-frame NMS, **temporal track
  confirmation** (an object must persist several frames), and **ground-plane +
  reachable-distance** raycasts before anything spawns. This decision logic is
  unit-tested independently of the model — it's as important to felt accuracy as
  raw mAP.

## Anti-cheat & scoring

`ScoringEngine` is pure and unit-tested. Points require verified evidence
(pickup + after-capture + sufficient detector confidence + plausible dwell);
weak or suspicious activity is **held for a quiet, appealable review** and a
private `trustScore` adjusts. Crucially, **litter weight is tracked but never
drives the score** — points come from verified clearing, correct sorting, area
priority, combos, and events, so there's no incentive to haul junk from home.

---

## Project layout

```
project.yml                 XcodeGen spec (generates GlowUp.xcodeproj)
GlowUp/
  App/                      App entry, RootView tabs, AppEnvironment (DI + game actions)
  Core/
    Models/                 Geometry, LitterCategory↔Gremlin, Region, ScoreEvent, Player, Award
    Detection/              LitterDetecting protocol, CoreML + Mock detectors, NMS, DetectionGate
    Gameplay/               GremlinSpawner, ScoringEngine
    Services/               Leaderboard (hierarchical), Award, RegionResolver, Location, Persistence
    Util/                   Geohash
  Features/
    Map/                    MapKit live map + gremlin sightings
    AR/                     ARKit camera, encounter view model, banish/score UI
    Leaderboards/           Neighborhood→City→State→Global standings
    Awards/                 Community-improvement grants + resident voting
    Profile/                Reputation, trust score, safety center
    Support/                Theme / design system
GlowUpTests/                XCTest: geometry, geohash, detection gate, NMS, spawner,
                            scoring, leaderboards, awards, region scopes, integration
ml/                         Litter-detector pipeline + model card (train/eval/export)
```

**Architecture:** the app talks to services through protocols
(`LitterDetecting`, `LeaderboardService`, `RegionResolving`, `PlayerStore`), each
with an in-memory/mock implementation today and a real backend (CloudKit/REST,
a trained Core ML model) droppable in later without touching the UI.

## Safety, privacy, inclusion

The detector only knows everyday litter — it never directs anyone to touch
hazardous waste. Hazards are **reported** (routed to the city) for points, not
collected. Precise location is hidden publicly by default; live location sharing
is never required; youth/family mode keeps hunts daylight-only.

*Go outside. Make it brighter.* 🌱
