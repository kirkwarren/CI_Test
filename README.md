# CleanQuest 🌱

**Clean the world. Level up.** A location-based augmented-reality game that turns
picking up litter into something people want to play every day. Players explore an
AR map of their city, run **live AR cleanup sessions**, earn verified Impact Score,
level up, collect Eco Spirits, join crews, and push a city-wide environmental dashboard.

This repo is an interactive **prototype** (Create React App + Tailwind) built around a
single pilot city, *Riverton*.

---

## The core loop: a live AR cleanup session

The heart of the game is one **continuous, camera-on session** that witnesses the entire
journey of every piece of litter — so points reflect real, verified cleanup, not photos.

1. **Arm the session.** Layered integrity checks must pass first (geofence, device
   attestation, continuous-stream, motion plausibility, per-item de-dupe).
2. **Detect & collect.** On-device vision boxes each item, classifies it
   (PET bottle, aluminum can, wrapper…) and assigns **per-item points**. You must be
   seen moving each item **ground → hand → bag** in one unbroken sequence.
3. **Dispose to earn.** Every item stays **pending** until the full bag is deposited at
   an approved disposal QR / staffed station. No station scan, no credit.
4. **Transform.** The zone flips from grey/polluted to green/restored, and you earn
   Impact Score, XP, badges, and rare Eco Spirits.

### Why it's hard to cheat (and skew leaderboards)

No single signal decides a cleanup — layers stack (see the in-app **Fair Play** sheet):

- **One unbroken session** — continuous signed camera stream; break it and pending items void.
- **See the full pickup** — motion/optical-flow check; still photos & screen-of-a-screen fail.
- **Points only after disposal** — approved station scan required.
- **Per-item perceptual hashing** — reusing the same bottle across items/sessions/accounts is rejected.
- **Location can't be faked** — GPS + geofence + IMU fused with attestation & mock-location detection.
- **Not household dumping** — CV distinguishes weathered field litter; items/minute capped.
- **Trust gates the board** — low-trust accounts earn provisional points; async server re-scoring can revoke; suspicious accounts are quarantined off public leaderboards.

### Real augmented reality

The AR session is **live camera + real on-device object detection**:

- The device camera fills the screen (`getUserMedia`, `object-cover`).
- A **TensorFlow.js COCO-SSD** detector runs continuously on the video and returns
  bounding boxes for litter-relevant classes (bottle, cup, glass, container, paper…),
  mapped to CleanQuest litter types & points in `LITTER_CLASS_MAP`.
- Boxes are composited over the live feed; tap one to run the ground → hand → bag transfer.
- The model is **self-hosted** in `public/models/coco-ssd/` (no runtime CDN dependency),
  and detection runs entirely on-device.

> Point the camera at real litter and it gets boxed and classified live. Detection is fast
> on a phone (WebGL/WebGPU); it also runs on CPU as a fallback.

### Impact Score (balanced, not raw weight)

40% verified activity · 20% area priority & density · 15% disposal/recycling · 15% consistency &
streaks · 10% crew & event contribution. Weight is tracked as an environmental metric but capped
in competitive scoring.

---

## App structure

- `src/App.js` — phone-frame shell, top bar, tab navigation, overlays
- `src/context/GameContext.js` — game state & actions (mission completion, rewards, toasts)
- `src/data/gameData.js` — pilot-city content: zones, litter types, crews, events, dashboard, anti-cheat copy
- `src/components/ARCleanupSession.js` — the live AR capture flow (arming → live detection → disposal)
- `src/components/RewardOverlay.js` — celebration + Impact Score breakdown
- `src/components/Charts.js` — lightweight dependency-free SVG charts
- `src/screens/` — Map, Quests, Crew, Events, Dashboard, Profile

## Run it

```bash
npm install
npm start      # dev server at http://localhost:3000
npm test       # test suite
npm run build  # production build
```

Allow camera access to see the live feed behind the AR detection layer (optional — the
session works fully without it).
