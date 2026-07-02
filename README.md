# CleanQuest 🌱

**Pokémon Go, but for picking up litter.** Explore a live map, walk to litter
spawns, open a real AR camera encounter, grab trash the detector actually sees,
bin it, and bank points onto the Weekly Cleanup Cup leaderboard.

Built with Create React App + Tailwind + TensorFlow.js.

## The engagement loop

Designed so cleaning is the addictive part and the city is the winner:

1. **Daily hook** — fresh daily quests, a streak that needs one banked cleanup a
   day, and a timed **⚡ Litter Rush** (everything ×2) create a reason to open
   the app *today*.
2. **Session loop** — golden spawns (×3), size-weighted grabs, combos, and the
   fly-to-bag juice make each encounter satisfying moment-to-moment.
3. **Meta progression** — the **Trashdex** (collect every litter species), a
   **buddy Eco-Spirit** that evolves as you clean (🌱→🌿→🌳), levels, badges,
   and the Weekly Cleanup Cup keep long arcs running.
4. **Civic payoff** — every verified bank raises the public **Neighborhood
   Cleanliness** meter; hitting the community goal triggers a real sponsor
   action (e.g. 50 trees planted). Your points are your impact.

## The session loop

1. **Map (home screen)** — a bright overworld with bobbing litter spawns. A reach
   ring surrounds your avatar; walk to a spawn to activate it *(prototype
   simulates GPS walking)*.
2. **AR encounter** — the live camera fills the screen. An on-device
   **COCO-SSD** detector boxes litter-relevant objects (bottles, cups, glass,
   containers, paper…) in real time. Tap **GRAB** and the item is tracked
   ground → hand → bag. Chain grabs for a **combo** multiplier.
3. **Bank at the bin** — everything stays *pending* until you scan an approved
   bin's QR. Then points bank, XP flows, and you see your **leaderboard rank
   change** on the spot.
4. **Weekly Cleanup Cup** — podium + ranked list; rivals earn while you play.

## Real AR, real detection

- Full-screen `getUserMedia` camera; detection runs **entirely on-device**
  (no video leaves the phone).
- The model is **self-hosted** at `public/models/coco-ssd/` — no runtime CDN.
- **Trash vs. not-trash, visibly**: litter classes get green GRAB boxes;
  known non-litter (people, pets, cars, benches…) renders as grey
  "✕ not litter" boxes, with a live `🤖 N litter · M not litter` readout.
- **Size-weighted scoring**: the share of frame a detection covers maps to
  S ×1 / M ×1.5 / L ×2 / XL ×3 multipliers — bigger trash scores more. Boxes
  covering >50% of the frame are rejected as "too close" (anti-cheat: items
  held against the lens don't count).
- Litter classes and per-item points live in `src/game/data.js`
  (`LITTER_CLASS_MAP`, `SIZE_TIERS`); a fine-tuned litter model drops into
  the same slot.
- QA on a desktop with no litter handy: append `?debugClasses=frisbee`
  to add extra detector classes (labeled `QA:`).

## Juice: sound, haptics, motion

- All SFX are **synthesized with WebAudio** (`src/game/sound.js`) — grab pop,
  bag thunk, rising combo dings, bank arpeggio, level-up fanfare, reject buzz.
  No audio assets to download. Mute toggle on the map HUD.
- **Haptics** via `navigator.vibrate` (Android/Chrome; iOS ignores it):
  ticks on grab, thunk on bag, celebration patterns on bank/level-up.
- Grabbed items **fly into the bag** with a floating `+pts` popup; the map has
  drifting cloud shadows, a flowing river highlight, swaying flowers, and a
  rippling fountain.

## Anti-cheat (why the leaderboard is trustworthy)

One unbroken camera session · the whole ground→hand→bag transfer is observed ·
per-item perceptual hashing kills duplicates · GPS/geofence/motion fused with
device attestation · points bank **only** at an approved bin scan · low-trust
accounts get provisional, revocable points and never touch the public board.
(See the in-app shield → Fair play sheet.)

## Structure

```
src/App.js               shell: map + encounter + sheets + celebration
src/game/data.js         spawns, rivals, litter classes, levels, fair-play copy
src/game/GameState.js    state: player, spawns, walking, leaderboard, banking
src/screens/MapHome.js   the overworld map + HUD
src/screens/Encounter.js live-camera AR: detect → grab → dispose → bank
src/screens/Leaderboard.js  Weekly Cleanup Cup (podium + list)
src/screens/Profile.js   level ring, stats, badges
src/ui/                  shared bits, banked celebration, fair-play sheet
```

## Run

```bash
npm install
npm start        # http://localhost:3000  (camera needs localhost or HTTPS)
npm test
npm run build
```
