// CleanQuest — game data. One pilot map ("Riverton Commons"), litter spawns,
// rival players for the leaderboard, and the real-detector class mapping.

// COCO-SSD classes the on-device detector reports, mapped to litter + points.
export const LITTER_CLASS_MAP = {
  bottle: { type: 'Plastic bottle', emoji: '🍾', points: 12, recyclable: true },
  cup: { type: 'Cup', emoji: '🥤', points: 8, recyclable: false },
  'wine glass': { type: 'Glass bottle', emoji: '🍶', points: 13, recyclable: true },
  bowl: { type: 'Container', emoji: '🥡', points: 7, recyclable: true },
  book: { type: 'Paper / carton', emoji: '🗞️', points: 7, recyclable: true },
  'sports ball': { type: 'Debris', emoji: '🥫', points: 6, recyclable: false },
  banana: { type: 'Food waste', emoji: '🍌', points: 5, recyclable: false },
  apple: { type: 'Food waste', emoji: '🍎', points: 5, recyclable: false },
  donut: { type: 'Food waste', emoji: '🍩', points: 5, recyclable: false },
};

// Litter spawns on the map (x/y are % positions). density scales the bonus.
export const INITIAL_SPAWNS = [
  { id: 's1', name: 'Fountain Plaza', emoji: '🥤', x: 30, y: 30, density: 2, hint: 'Cups & wrappers around the benches' },
  { id: 's2', name: 'Riverbank Path', emoji: '🍾', x: 72, y: 22, density: 3, hint: 'Bottles collect where the current slows' },
  { id: 's3', name: 'Dog Park Gate', emoji: '🛍️', x: 18, y: 62, density: 1, hint: 'Light litter near the entrance' },
  { id: 's4', name: 'Picnic Lawn', emoji: '🍬', x: 62, y: 58, density: 2, hint: 'Weekend picnic leftovers' },
  { id: 's5', name: 'Bus Stop 12', emoji: '🥫', x: 44, y: 78, density: 2, hint: 'Cans and cups by the shelter' },
  { id: 's6', name: 'Trailhead Kiosk', emoji: '🗞️', x: 84, y: 66, density: 1, hint: 'Paper and flyers in the brush' },
  { id: 's7', name: 'Creek Bridge', emoji: '🍶', x: 12, y: 20, density: 3, hint: 'Glass under the north rail — careful!' },
];

// Rival players seeding the weekly leaderboard. Their scores tick up slowly
// while you play, so the race feels alive.
export const RIVALS = [
  { id: 'r1', name: 'MayaClears', avatar: '🦸‍♀️', points: 1240 },
  { id: 'r2', name: 'TrashPandaTom', avatar: '🦝', points: 1105 },
  { id: 'r3', name: 'DevonSweeps', avatar: '🧹', points: 930 },
  { id: 'r4', name: 'AishaEco', avatar: '🌿', points: 705 },
  { id: 'r5', name: 'CoachLee', avatar: '🏈', points: 540 },
  { id: 'r6', name: 'BinDiesel', avatar: '🗑️', points: 380 },
  { id: 'r7', name: 'LilSprout', avatar: '🌱', points: 215 },
];

export const PLAYER_START = {
  name: 'You',
  avatar: '🧑‍🚀',
  level: 3,
  xp: 140,
  points: 860, // banked, drives the leaderboard
  streak: 4,
  lifetime: { items: 63, bags: 9, missions: 14 },
  badges: [
    { id: 'first', emoji: '👟', name: 'First Cleanup', got: true },
    { id: 'streak3', emoji: '🔥', name: '3-Day Streak', got: true },
    { id: 'river', emoji: '🌊', name: 'River Hero', got: false },
    { id: 'combo5', emoji: '⚡', name: '5x Combo', got: false },
    { id: 'recycler', emoji: '♻️', name: 'Sorting Star', got: true },
    { id: 'night', emoji: '🌅', name: 'Dawn Patrol', got: false },
  ],
};

export const xpForLevel = (level) => 300 + (level - 1) * 200;

// How far (in map %) the player can start an encounter — the PoGo ring.
export const REACH = 20;

export const FAIR_PLAY = [
  { emoji: '🎥', title: 'One unbroken session', body: 'The camera runs continuously from first grab to disposal. Cut the feed and pending points are voided.' },
  { emoji: '✋', title: 'The whole transfer is seen', body: 'Each item is detected on the ground, then tracked into your hand and bag. Photos of trash never count.' },
  { emoji: '🔍', title: 'Every item fingerprinted', body: 'Per-item perceptual hashing rejects the same bottle re-submitted across grabs, sessions, or accounts.' },
  { emoji: '📍', title: 'Location can’t be spoofed', body: 'GPS + geofence + motion sensors are fused with device attestation and mock-location detection.' },
  { emoji: '🗑️', title: 'Points bank only at disposal', body: 'Everything stays pending until you scan an approved bin’s QR code. No bin, no points.' },
  { emoji: '🛡️', title: 'Trust gates the leaderboard', body: 'Low-trust accounts earn provisional points that are re-scored server-side and can be revoked before they ever touch the public board.' },
];
