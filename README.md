# CleanQuest 🌱

**Pokémon Go, but for picking up litter.** Explore a live map, walk to litter
spawns, open a real AR camera encounter, grab trash the detector actually sees,
bin it, and bank points onto the Weekly Cleanup Cup leaderboard.

Built with Create React App + Tailwind + TensorFlow.js.

## The loop

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
- Litter classes and per-item points live in `src/game/data.js`
  (`LITTER_CLASS_MAP`); a fine-tuned litter model can drop into the same slot.
- QA on a desktop with no litter handy: append `?debugClasses=person,frisbee`
  to add extra detector classes (labeled `QA:`).

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
