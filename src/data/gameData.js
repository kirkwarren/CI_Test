// CleanQuest — mock game data for the pilot city: "Riverton"
// All content is illustrative for the prototype.

export const CITY = {
  name: 'Riverton',
  tagline: 'Your city is the game board.',
};

// XP required to reach the *next* level grows each level.
export const xpForLevel = (level) => 250 + (level - 1) * 150;

export const RANKS = [
  'Litter Rookie',
  'Street Scout',
  'Park Ranger',
  'Trail Guardian',
  'Neighborhood Hero',
  'City Legend',
];

export const rankForLevel = (level) =>
  RANKS[Math.min(RANKS.length - 1, Math.floor((level - 1) / 2))];

// --- The map. Coordinates are % positions inside the stylized map board. ---
// status: 'polluted' | 'restored'
export const INITIAL_ZONES = [
  {
    id: 'z-riverwalk',
    name: 'Riverwalk Bend',
    type: 'Waterway',
    icon: '🌊',
    x: 22,
    y: 30,
    status: 'polluted',
    priority: 'High',
    litterDensity: 'Heavy',
    durationMin: 15,
    basePoints: 240,
    blurb: 'Bottles and wrappers collect where the current slows. A priority zone for the river campaign.',
    cityPriority: true,
  },
  {
    id: 'z-maple-park',
    name: 'Maple Street Park',
    type: 'Park',
    icon: '🌳',
    x: 52,
    y: 22,
    status: 'polluted',
    priority: 'Medium',
    litterDensity: 'Moderate',
    durationMin: 10,
    basePoints: 160,
    blurb: 'A neighborhood favorite. Clear the picnic lawn and the play area edges.',
    cityPriority: false,
  },
  {
    id: 'z-oak-trail',
    name: 'Oak Ridge Trailhead',
    type: 'Trail',
    icon: '🥾',
    x: 78,
    y: 34,
    status: 'polluted',
    priority: 'Medium',
    litterDensity: 'Light',
    durationMin: 15,
    basePoints: 180,
    blurb: 'A 15-minute power clean along the first trail segment past the kiosk.',
    cityPriority: false,
  },
  {
    id: 'z-lincoln-school',
    name: 'Lincoln Elementary',
    type: 'School',
    icon: '🏫',
    x: 35,
    y: 58,
    status: 'polluted',
    priority: 'High',
    litterDensity: 'Moderate',
    durationMin: 10,
    basePoints: 200,
    blurb: 'Back-to-school campus cleanup. Daylight-only, family friendly.',
    cityPriority: true,
  },
  {
    id: 'z-downtown',
    name: 'Downtown Plaza',
    type: 'Downtown',
    icon: '🏙️',
    x: 64,
    y: 62,
    status: 'polluted',
    priority: 'Medium',
    litterDensity: 'Heavy',
    durationMin: 30,
    basePoints: 320,
    blurb: 'Festival aftermath near the fountain. A longer 30-minute mission.',
    cityPriority: false,
  },
  {
    id: 'z-bayshore',
    name: 'Bayshore Beach',
    type: 'Beach',
    icon: '🏖️',
    x: 18,
    y: 78,
    status: 'polluted',
    priority: 'High',
    litterDensity: 'Heavy',
    durationMin: 30,
    basePoints: 360,
    blurb: 'Shoreline micro-plastics and cans below the tide line.',
    cityPriority: true,
  },
  {
    id: 'z-creek',
    name: 'Willow Creek',
    type: 'Creek',
    icon: '💧',
    x: 86,
    y: 70,
    status: 'restored',
    priority: 'Low',
    litterDensity: 'Light',
    durationMin: 10,
    basePoints: 140,
    blurb: 'Recently restored by the Green Otters crew. Keep it sparkling!',
    cityPriority: false,
  },
  {
    id: 'z-playground',
    name: 'Sunnyside Playground',
    type: 'Playground',
    icon: '🛝',
    x: 47,
    y: 84,
    status: 'restored',
    priority: 'Low',
    litterDensity: 'Light',
    durationMin: 5,
    basePoints: 90,
    blurb: 'A quick 5-minute tidy keeps this family spot glowing.',
    cityPriority: false,
  },
];

// Eco Spirits — AR collectibles tied to local habitats, unlocked by restoring zones.
export const ECO_SPIRITS = [
  { id: 'otter', name: 'Rivven the Otter', habitat: 'Waterway', emoji: '🦦', unlockZone: 'z-riverwalk', rarity: 'Rare' },
  { id: 'heron', name: 'Marsh Heron', habitat: 'Creek', emoji: '🐦', unlockZone: 'z-creek', rarity: 'Uncommon' },
  { id: 'fox', name: 'Trail Fox', habitat: 'Trail', emoji: '🦊', unlockZone: 'z-oak-trail', rarity: 'Uncommon' },
  { id: 'crab', name: 'Tide Crab', habitat: 'Beach', emoji: '🦀', unlockZone: 'z-bayshore', rarity: 'Rare' },
  { id: 'sprout', name: 'Park Sprout', habitat: 'Park', emoji: '🌱', unlockZone: 'z-maple-park', rarity: 'Common' },
];

export const BADGES = [
  { id: 'first-clean', name: 'First Steps', icon: '👟', desc: 'Complete your first verified cleanup.', tier: 'Bronze' },
  { id: 'streak-7', name: 'Week Warrior', icon: '🔥', desc: 'Keep a 7-day cleanup streak.', tier: 'Silver' },
  { id: 'river-hero', name: 'River Hero', icon: '🌊', desc: 'Restore a priority waterway zone.', tier: 'Gold' },
  { id: 'recycler', name: 'Sorting Star', icon: '♻️', desc: 'Sort recyclables on 5 cleanups.', tier: 'Silver' },
  { id: 'crew-mvp', name: 'Crew MVP', icon: '🏅', desc: 'Top your crew leaderboard for a week.', tier: 'Gold' },
  { id: 'event-legend', name: 'Event Legend', icon: '🎪', desc: 'Join a live community cleanup event.', tier: 'Platinum' },
  { id: 'restorer-10', name: 'Master Restorer', icon: '✨', desc: 'Restore 10 public spaces.', tier: 'Platinum' },
  { id: 'dawn-patrol', name: 'Dawn Patrol', icon: '🌅', desc: 'Complete a cleanup before 8am.', tier: 'Bronze' },
];

export const CREW = {
  id: 'green-otters',
  name: 'Green Otters',
  icon: '🦦',
  color: '#10b981',
  territory: 'Riverside District',
  rank: 2,
  weeklyGoal: 12000,
  weeklyProgress: 8640,
  members: [
    { name: 'You', impact: 0, you: true },
    { name: 'Maya P.', impact: 3120 },
    { name: 'Devon R.', impact: 2890 },
    { name: 'Aisha K.', impact: 1640 },
    { name: 'Coach Lee', impact: 990 },
  ],
};

export const CREW_LEADERBOARD = [
  { rank: 1, name: 'Trailblazers', icon: '🥾', impact: 14820, you: false },
  { rank: 2, name: 'Green Otters', icon: '🦦', impact: 12640, you: true },
  { rank: 3, name: 'Bay Guardians', icon: '🌊', impact: 11230, you: false },
  { rank: 4, name: 'Maple Crew', icon: '🌳', impact: 9410, you: false },
  { rank: 5, name: 'Downtown Sweepers', icon: '🏙️', impact: 8050, you: false },
];

export const NEIGHBORHOOD_LEADERBOARD = [
  { rank: 1, name: 'Riverside District', score: 92, you: true },
  { rank: 2, name: 'Oak Ridge', score: 88, you: false },
  { rank: 3, name: 'Bayshore', score: 81, you: false },
  { rank: 4, name: 'Downtown Core', score: 74, you: false },
];

export const CITY_CHALLENGES = [
  {
    id: 'river-week',
    title: 'Clean the River Week',
    sponsor: 'Riverton Parks Dept.',
    icon: '🌊',
    accent: 'from-ocean-500 to-quest-500',
    daysLeft: 4,
    goal: 'Remove 5,000 lbs from the Riverwalk corridor',
    progress: 68,
    reward: 'Top crew unlocks a $5,000 donation to a local school',
    zones: ['z-riverwalk', 'z-creek'],
  },
  {
    id: 'campus-cup',
    title: 'Back-to-School Campus Cup',
    sponsor: 'Riverton Unified Schools',
    icon: '🏫',
    accent: 'from-sun-500 to-quest-500',
    daysLeft: 11,
    goal: 'School vs. school — most verified cleanup points',
    progress: 41,
    reward: 'Winning school earns a field-trip fund + mayor recognition',
    zones: ['z-lincoln-school'],
  },
  {
    id: 'beach-weekend',
    title: 'Bayshore Beach Weekend',
    sponsor: 'Coast Alliance + Tidewater Co.',
    icon: '🏖️',
    accent: 'from-ocean-400 to-quest-400',
    daysLeft: 2,
    goal: 'Most litter removed below the tide line',
    progress: 55,
    reward: 'Aquarium passes + transit passes for the top 50 players',
    zones: ['z-bayshore'],
  },
];

export const LIVE_EVENT = {
  id: 'liberty-park-restore',
  title: 'Battle for Liberty Park',
  host: 'Local Legends',
  celebrity: 'Coach Jordan Reyes',
  icon: '🎪',
  date: 'Sat 10:00 AM',
  location: 'Liberty Park, Riverside District',
  checkedIn: 142,
  goalBags: 300,
  bagsCollected: 187,
  poundsCollected: 1240,
  volunteerHours: 96,
  meter: 62, // restoration meter %
  teams: [
    { name: 'Reyes Crew', score: 4820, celeb: true },
    { name: 'Riverside Rally', score: 4410, celeb: false },
    { name: 'Otter Squad', score: 3990, celeb: false },
  ],
  perk: 'Every 50 verified bags triggers a sponsor donation to Lincoln Elementary.',
};

// City-wide impact dashboard figures (cumulative, pilot to date).
export const CITY_IMPACT = {
  pounds: 38420,
  bags: 2870,
  pieces: 412000,
  hours: 6240,
  cleanups: 9180,
  milesRestored: 47,
  recyclingDiverted: 14110, // lbs diverted to recycling
  activePlayers: 3120,
  sponsoredMissions: 64,
  donationsUnlocked: 21500, // $
  trend: [
    { week: 'W1', pounds: 1200 },
    { week: 'W2', pounds: 2100 },
    { week: 'W3', pounds: 3400 },
    { week: 'W4', pounds: 4200 },
    { week: 'W5', pounds: 5800 },
    { week: 'W6', pounds: 7600 },
    { week: 'W7', pounds: 9200 },
    { week: 'W8', pounds: 11800 },
  ],
  byCategory: [
    { name: 'Plastic', value: 38 },
    { name: 'Paper', value: 22 },
    { name: 'Glass', value: 14 },
    { name: 'Metal', value: 16 },
    { name: 'Other', value: 10 },
  ],
};

// Impact Score weighting — surfaced in the mission results breakdown.
export const SCORE_WEIGHTS = [
  { key: 'activity', label: 'Verified cleanup activity', weight: 40, color: '#10b981' },
  { key: 'priority', label: 'Area priority & litter density', weight: 20, color: '#0ea5e9' },
  { key: 'disposal', label: 'Disposal / recycling', weight: 15, color: '#f59e0b' },
  { key: 'consistency', label: 'Consistency & streaks', weight: 15, color: '#a78bfa' },
  { key: 'crew', label: 'Crew & event contribution', weight: 10, color: '#f472b6' },
];

export const INITIAL_PLAYER = {
  name: 'River',
  handle: '@river',
  avatar: '🧑‍🚀',
  level: 4,
  xp: 180,
  impactScore: 6240,
  streak: 6,
  trustScore: 92,
  crewId: 'green-otters',
  lifetime: {
    pounds: 182,
    missions: 47,
    spacesRestored: 12,
    hours: 31,
    recycled: 64,
  },
  badges: ['first-clean', 'streak-7', 'recycler', 'dawn-patrol'],
  spirits: ['heron', 'sprout'],
};

// The verification pipeline steps shown during a mission.
export const VERIFY_STEPS = [
  {
    key: 'checkin',
    title: 'Check in',
    sub: 'Confirming you are inside the zone',
    icon: 'MapPin',
    proof: 'GPS · geofence · motion · device integrity',
  },
  {
    key: 'before',
    title: 'Before',
    sub: 'Capture the area before you start',
    icon: 'Camera',
    proof: 'In-app capture · timestamped · location-tagged',
  },
  {
    key: 'during',
    title: 'Cleanup',
    sub: 'Collect litter — we track active time & motion',
    icon: 'Trash2',
    proof: 'Motion · route progress · active duration',
  },
  {
    key: 'after',
    title: 'After',
    sub: 'Show the restored area',
    icon: 'Sparkles',
    proof: 'In-app capture · before/after comparison',
  },
  {
    key: 'bag',
    title: 'Bag',
    sub: 'Photograph your filled bag of litter',
    icon: 'ShoppingBag',
    proof: 'CV plausibility · perceptual-hash dedupe',
  },
  {
    key: 'disposal',
    title: 'Dispose',
    sub: 'Scan the QR at an approved disposal point',
    icon: 'QrCode',
    proof: 'City-approved station · high-confidence tier',
  },
];

// ---------------------------------------------------------------------------
// AR Cleanup Session — the live, continuous capture experience.
// Each litter type carries per-item points. Recyclables earn a disposal bonus.
// ---------------------------------------------------------------------------
export const LITTER_TYPES = [
  { type: 'Plastic bottle', klass: 'PET #1 plastic', emoji: '🍾', points: 12, recyclable: true },
  { type: 'Aluminum can', klass: 'Aluminum', emoji: '🥫', points: 11, recyclable: true },
  { type: 'Coffee cup', klass: 'Mixed / lined', emoji: '🥤', points: 8, recyclable: false },
  { type: 'Snack wrapper', klass: 'Film plastic', emoji: '🍬', points: 6, recyclable: false },
  { type: 'Newspaper', klass: 'Paper', emoji: '🗞️', points: 7, recyclable: true },
  { type: 'Plastic bag', klass: 'Film plastic', emoji: '🛍️', points: 9, recyclable: false },
  { type: 'Glass bottle', klass: 'Glass', emoji: '🍶', points: 13, recyclable: true },
];

export const densityToCount = (density) =>
  density === 'Heavy' ? 8 : density === 'Moderate' ? 5 : 3;

// Map real COCO-SSD detection classes -> CleanQuest litter types & points.
// These are the litter-relevant objects an on-device detector reliably finds.
export const LITTER_CLASS_MAP = {
  bottle: { type: 'Plastic bottle', klass: 'PET #1 plastic', emoji: '🍾', points: 12, recyclable: true },
  cup: { type: 'Cup', klass: 'Mixed / lined', emoji: '🥤', points: 8, recyclable: false },
  'wine glass': { type: 'Glass bottle', klass: 'Glass', emoji: '🍶', points: 13, recyclable: true },
  bowl: { type: 'Container', klass: 'Rigid plastic', emoji: '🥡', points: 7, recyclable: true },
  book: { type: 'Paper / carton', klass: 'Paper', emoji: '🗞️', points: 7, recyclable: true },
  'sports ball': { type: 'Debris', klass: 'Mixed', emoji: '🥫', points: 6, recyclable: false },
  banana: { type: 'Food waste', klass: 'Organic', emoji: '🍌', points: 5, recyclable: false },
  apple: { type: 'Food waste', klass: 'Organic', emoji: '🍎', points: 5, recyclable: false },
  donut: { type: 'Food waste', klass: 'Organic', emoji: '🍩', points: 5, recyclable: false },
};

// Classes we surface as litter (everything else the detector sees is ignored).
export const LITTER_CLASSES = Object.keys(LITTER_CLASS_MAP);

// Build a deterministic-ish spread of litter items across the "ground" plane
// (lower portion of the viewport) for a given zone.
export const generateLitter = (zone) => {
  const n = densityToCount(zone.litterDensity);
  const items = [];
  for (let i = 0; i < n; i++) {
    const t = LITTER_TYPES[(i * 3 + zone.name.length) % LITTER_TYPES.length];
    // spread across the mid "ground" band, clear of the top HUD and bottom dock
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 16 + col * 30 + ((i * 37) % 11);
    const y = 40 + row * 11 + ((i * 53) % 7);
    items.push({
      id: `${zone.id}-it-${i}`,
      ...t,
      x: Math.min(82, x),
      y: Math.min(66, y),
      confidence: 0.86 + ((i * 7) % 12) / 100, // 0.86–0.97
      status: 'ground', // 'ground' | 'locked' | 'collecting' | 'bagged'
    });
  }
  return items;
};

// Live integrity signals shown during the session (the anti-cheat layer).
export const INTEGRITY_SIGNALS = [
  { key: 'geofence', label: 'Inside zone geofence', detail: 'GPS · accuracy 4m', icon: 'MapPin' },
  { key: 'attest', label: 'Device attestation passed', detail: 'No mock-location · genuine sensor', icon: 'ShieldCheck' },
  { key: 'continuous', label: 'Continuous session', detail: 'Unbroken signed camera stream', icon: 'Video' },
  { key: 'motion', label: 'Motion & route plausible', detail: 'IMU walking · normal speed', icon: 'Footprints' },
  { key: 'dedupe', label: 'No duplicate items', detail: 'Per-item perceptual hashing', icon: 'Fingerprint' },
];

// Plain-language explanation of how cheating is prevented (Fair Play sheet).
export const FAIR_PLAY = [
  {
    title: 'One unbroken session',
    body: 'The camera records a continuous, cryptographically signed stream from start to disposal. Cut the feed or leave the zone and pending items are voided — you can’t stitch separate moments together.',
    icon: 'Video',
  },
  {
    title: 'See the full pickup',
    body: 'Each item must be observed moving ground → hand → bag across consecutive frames. A still photo, a screen-of-a-screen, or trash that never gets bagged won’t count.',
    icon: 'Hand',
  },
  {
    title: 'Points only after disposal',
    body: 'Every item stays “pending” until the full bag is deposited at an approved disposal QR or staffed station. No station scan, no credit.',
    icon: 'QrCode',
  },
  {
    title: 'Per-item fingerprinting',
    body: 'Keyframes of every piece are perceptual-hashed. Re-submitting the same bottle across items, sessions, or accounts is automatically rejected.',
    icon: 'Fingerprint',
  },
  {
    title: 'Location can’t be faked',
    body: 'GPS, geofence, and motion sensors are fused with device attestation and mock-location detection. Impossible travel and spoofing are flagged instantly.',
    icon: 'MapPin',
  },
  {
    title: 'Not household dumping',
    body: 'Vision distinguishes weathered outdoor litter from bagged household garbage, and caps items-per-minute to a human-plausible rate.',
    icon: 'Trash2',
  },
  {
    title: 'Trust gates the leaderboard',
    body: 'New or low-trust accounts earn provisional points that a server re-scores asynchronously and can revoke. Suspicious accounts are quarantined off public leaderboards before they can skew them.',
    icon: 'ShieldCheck',
  },
];
