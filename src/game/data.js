// CleanQuest — game data. One pilot map ("Riverton Commons"), litter spawns,
// rival players for the leaderboard, and the real-detector class mapping.

// COCO-SSD classes the on-device detector reports, mapped to litter + points.
export const LITTER_CLASS_MAP = {
  bottle: { type: 'Plastic bottle', emoji: '🍾', points: 12, recyclable: true, rarity: 'common' },
  cup: { type: 'Cup', emoji: '🥤', points: 8, recyclable: false, rarity: 'common' },
  'wine glass': { type: 'Glass bottle', emoji: '🍶', points: 13, recyclable: true, rarity: 'rare' },
  bowl: { type: 'Container', emoji: '🥡', points: 7, recyclable: true, rarity: 'uncommon' },
  book: { type: 'Paper / carton', emoji: '🗞️', points: 7, recyclable: true, rarity: 'uncommon' },
  'sports ball': { type: 'Debris', emoji: '🥫', points: 6, recyclable: false, rarity: 'uncommon' },
  banana: { type: 'Food waste', emoji: '🍌', points: 5, recyclable: false, rarity: 'common' },
  apple: { type: 'Food waste', emoji: '🍎', points: 5, recyclable: false, rarity: 'common' },
  donut: { type: 'Food waste', emoji: '🍩', points: 5, recyclable: false, rarity: 'rare' },
};

// ---- Trashdex: the collection log (the Pokédex analog) ----
export const TRASHDEX = Object.values(
  Object.values(LITTER_CLASS_MAP).reduce((acc, m) => { acc[m.type] = m; return acc; }, {})
);
export const RARITY_STYLE = {
  common: 'bg-white/10 text-white/60',
  uncommon: 'bg-ocean-500/20 text-ocean-400',
  rare: 'bg-fuchsia-500/20 text-fuchsia-300',
};

// ---- The daily loop: quests that reset each day ----
export const DAILY_QUESTS = [
  { id: 'q-items', label: 'Clean 5 pieces of litter', emoji: '🧤', target: 5, type: 'items', reward: 40 },
  { id: 'q-large', label: 'Bag a Large or XL item', emoji: '📦', target: 1, type: 'large', reward: 30 },
  { id: 'q-combo', label: 'Hit a ×3 grab combo', emoji: '⚡', target: 3, type: 'combo', reward: 35 },
  { id: 'q-banks', label: 'Bank at 2 different bins', emoji: '🗑️', target: 2, type: 'banks', reward: 25 },
];

// ---- Buddy Eco-Spirit: grows with every cleanup ----
export const BUDDY_STAGES = [
  { min: 0, emoji: '🌱', name: 'Sprout' },
  { min: 120, emoji: '🌿', name: 'Sapling' },
  { min: 350, emoji: '🌳', name: 'Grove Guardian' },
];
export const buddyStage = (xp) => [...BUDDY_STAGES].reverse().find((s) => xp >= s.min);
export const buddyNext = (xp) => BUDDY_STAGES.find((s) => s.min > xp) || null;

// ---- Events ----
export const GOLDEN_MULT = 3; // golden spawns pay 3×
export const GOLDEN_CHANCE = 0.35; // chance a respawn comes back golden
export const RUSH_MULT = 2; // Litter Rush: everything 2×
export const RUSH_MINUTES = 30;

// Neighborhood cleanliness — the civic payoff meter. Community goal unlocks
// a real-world sponsor action.
export const CLEAN_GOAL = { at: 80, reward: 'City sponsor plants 50 trees in Riverton Commons' };

// ---- Reporting: players are the city's sensing network ----
// Hazards and dumping are forwarded to city crews (311-style); hotspots
// become new spawns for OTHER players — the community authors the game board.
export const REPORT_TYPES = [
  { id: 'hazard', emoji: '⚠️', label: 'Hazard — don\'t touch', desc: 'Needles, chemicals, broken glass. Forwarded straight to city crews.', pts: 15, forwards: true, makesSpawn: false },
  { id: 'dump', emoji: '🛋️', label: 'Illegal dumping', desc: 'Too big to bag. City pickup requested + spawn marked for the crew.', pts: 20, forwards: true, makesSpawn: true },
  { id: 'hotspot', emoji: '📣', label: 'Litter hotspot', desc: 'Creates a live spawn on the map so nearby players can clear it.', pts: 10, forwards: false, makesSpawn: true },
];

// Adopt-a-Block: steward one zone for a +25% bonus there — your name on it.
export const ADOPT_BONUS = 0.25;

// Rough environmental equivalents for the Impact Receipt (grams CO2e saved).
export const CO2_G_PER_ITEM = { recyclable: 60, other: 20 };

// Community-wide stats (city feed; seeded for the pilot).
export const COMMUNITY_START = { itemsThisWeek: 12480, hotspots: 214, hazards: 37, blooms: 3 };

// Classes the detector may see that are definitely NOT litter. They render
// as grey "not litter" boxes so players watch the AI discriminate in real time.
export const NON_LITTER_CLASSES = [
  'person', 'dog', 'cat', 'bird', 'car', 'truck', 'bicycle', 'motorcycle',
  'chair', 'bench', 'potted plant', 'tv', 'laptop', 'cell phone',
  'backpack', 'handbag', 'umbrella', 'skateboard', 'fire hydrant',
];

// Size-weighted scoring: bigger litter = more points. Fraction is the share
// of the camera frame the detection box covers.
export const SIZE_TIERS = [
  { max: 0.02, label: 'S', mult: 1, ring: 'border-quest-300' },
  { max: 0.06, label: 'M', mult: 1.5, ring: 'border-quest-300' },
  { max: 0.16, label: 'L', mult: 2, ring: 'border-ocean-400' },
  { max: 0.5, label: 'XL', mult: 3, ring: 'border-sun-400' },
];
// Boxes covering more than this are implausible ground litter (likely held
// against the lens) and are rejected — anti-cheat, not a bonus.
export const TOO_CLOSE_FRAC = 0.5;

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
  { emoji: '📏', title: 'Size-aware, size-checked', body: 'Bigger litter scores more (S→XL), but box size is sanity-checked: items shoved against the lens are rejected and sessions with implausible size mixes get re-scored.' },
  { emoji: '🛡️', title: 'Trust gates the leaderboard', body: 'Low-trust accounts earn provisional points that are re-scored server-side and can be revoked before they ever touch the public board.' },
];
