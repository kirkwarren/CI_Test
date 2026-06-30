// GlowUp — seed world data for the pilot city of "Riverbend".
//
// Everything here is static "designed world" content: the Fade Zones scattered
// across the city, the place-tied AR collectibles, the crews on the leaderboard,
// the live event, and the civic reward catalog. Live, per-player progress lives
// in game/state.js and is layered on top of these definitions at runtime.

// ---------------------------------------------------------------------------
// Zone types — each real-world category restores into a different AR ecology
// ---------------------------------------------------------------------------
export const ZONE_TYPES = {
  park: { label: 'Park', glow: 'emerald', icon: 'Trees' },
  creek: { label: 'Creek', glow: 'cyan', icon: 'Waves' },
  trail: { label: 'Trail', glow: 'lime', icon: 'Mountain' },
  downtown: { label: 'Downtown', glow: 'fuchsia', icon: 'Building2' },
  school: { label: 'School', glow: 'amber', icon: 'GraduationCap' },
  beach: { label: 'Shoreline', glow: 'sky', icon: 'Sailboat' },
};

// Tailwind-safe color ramps keyed by the "glow" token above. Kept as a static
// map so the JIT compiler can see every class name at build time.
export const GLOW = {
  emerald: {
    text: 'text-emerald-300', ring: 'ring-emerald-400/60', border: 'border-emerald-400/40',
    from: 'from-emerald-400', to: 'to-emerald-600', bg: 'bg-emerald-500/15', dot: 'bg-emerald-400',
    glowShadow: 'shadow-[0_0_24px_-4px_rgba(52,211,153,0.7)]',
  },
  cyan: {
    text: 'text-cyan-300', ring: 'ring-cyan-400/60', border: 'border-cyan-400/40',
    from: 'from-cyan-400', to: 'to-cyan-600', bg: 'bg-cyan-500/15', dot: 'bg-cyan-400',
    glowShadow: 'shadow-[0_0_24px_-4px_rgba(34,211,238,0.7)]',
  },
  lime: {
    text: 'text-lime-300', ring: 'ring-lime-400/60', border: 'border-lime-400/40',
    from: 'from-lime-400', to: 'to-lime-600', bg: 'bg-lime-500/15', dot: 'bg-lime-400',
    glowShadow: 'shadow-[0_0_24px_-4px_rgba(163,230,53,0.7)]',
  },
  fuchsia: {
    text: 'text-fuchsia-300', ring: 'ring-fuchsia-400/60', border: 'border-fuchsia-400/40',
    from: 'from-fuchsia-400', to: 'to-fuchsia-600', bg: 'bg-fuchsia-500/15', dot: 'bg-fuchsia-400',
    glowShadow: 'shadow-[0_0_24px_-4px_rgba(232,121,249,0.7)]',
  },
  amber: {
    text: 'text-amber-300', ring: 'ring-amber-400/60', border: 'border-amber-400/40',
    from: 'from-amber-400', to: 'to-amber-600', bg: 'bg-amber-500/15', dot: 'bg-amber-400',
    glowShadow: 'shadow-[0_0_24px_-4px_rgba(251,191,36,0.7)]',
  },
  sky: {
    text: 'text-sky-300', ring: 'ring-sky-400/60', border: 'border-sky-400/40',
    from: 'from-sky-400', to: 'to-sky-600', bg: 'bg-sky-500/15', dot: 'bg-sky-400',
    glowShadow: 'shadow-[0_0_24px_-4px_rgba(56,189,248,0.7)]',
  },
  violet: {
    text: 'text-violet-300', ring: 'ring-violet-400/60', border: 'border-violet-400/40',
    from: 'from-violet-400', to: 'to-violet-600', bg: 'bg-violet-500/15', dot: 'bg-violet-400',
    glowShadow: 'shadow-[0_0_24px_-4px_rgba(167,139,250,0.7)]',
  },
};

// ---------------------------------------------------------------------------
// AR collectibles / guardians — earned through meaningful real-world action,
// each tied to a place and a kind of impact (never purchasable).
// ---------------------------------------------------------------------------
export const CREATURES = {
  mossling: {
    id: 'mossling', name: 'Mossling', kind: 'Park Sprite', rarity: 'common', glow: 'emerald',
    emoji: '🌿', habitat: 'park',
    unlock: 'Restore any park Fade Zone',
    lore: 'A shy bundle of moss and light that wakes when a green space is cared for.',
  },
  rillo: {
    id: 'rillo', name: 'Rillo', kind: 'River Spirit', rarity: 'rare', glow: 'cyan',
    emoji: '💧', habitat: 'creek',
    unlock: 'Reach Glow Level 2 on a creek or shoreline',
    lore: 'An ancient guardian of moving water. Returns only to streams that run clean.',
  },
  trailfox: {
    id: 'trailfox', name: 'Trailfox', kind: 'Trail Creature', rarity: 'uncommon', glow: 'lime',
    emoji: '🦊', habitat: 'trail',
    unlock: 'Complete a trail restoration mission',
    lore: 'Trots the ridgelines, reopening wildlife corridors one cleaned switchback at a time.',
  },
  lumen: {
    id: 'lumen', name: 'Lumen', kind: 'City-Light', rarity: 'uncommon', glow: 'fuchsia',
    emoji: '✨', habitat: 'downtown',
    unlock: 'Restore a downtown block',
    lore: 'Made of streetlight and neon, it relights blocks the city had given up on.',
  },
  sproutscout: {
    id: 'sproutscout', name: 'Sprout Scout', kind: 'Future Builder', rarity: 'common', glow: 'amber',
    emoji: '🌱', habitat: 'school',
    unlock: 'Clean a Fade Zone near a school',
    lore: 'Cheers on the next generation. Grows a little taller with every campus cleaned.',
  },
  tideling: {
    id: 'tideling', name: 'Tideling', kind: 'Shore Guardian', rarity: 'rare', glow: 'sky',
    emoji: '🐚', habitat: 'beach',
    unlock: 'Restore a shoreline Fade Zone',
    lore: 'Rides the foam line, collecting what the tide leaves behind so the gulls don’t.',
  },
  pollin: {
    id: 'pollin', name: 'Pollin', kind: 'Urban Pollinator', rarity: 'uncommon', glow: 'violet',
    emoji: '🐝', habitat: 'any',
    unlock: 'Recycle or sort 25 items',
    lore: 'Rewards careful sorting. Every diverted bottle becomes another wildflower.',
  },
  verdania: {
    id: 'verdania', name: 'Verdania', kind: 'Regional Guardian', rarity: 'legendary', glow: 'emerald',
    emoji: '🦌', habitat: 'region',
    unlock: 'Help restore 3 different parks across the city',
    lore: 'A legendary guardian woven from every restored grove. Only a community can summon it.',
  },
  solmote: {
    id: 'solmote', name: 'Sol-Mote', kind: 'Seasonal · Sunset', rarity: 'rare', glow: 'amber',
    emoji: '🌅', habitat: 'event',
    unlock: 'Finish a Sunset Cleanup or a live event mission',
    lore: 'A limited-edition ember that only appears during golden-hour restorations.',
  },
};

export const RARITY_ORDER = ['common', 'uncommon', 'rare', 'legendary'];
export const RARITY_STYLE = {
  common: { label: 'Common', glow: 'emerald' },
  uncommon: { label: 'Uncommon', glow: 'cyan' },
  rare: { label: 'Rare', glow: 'fuchsia' },
  legendary: { label: 'Legendary', glow: 'amber' },
};

// ---------------------------------------------------------------------------
// Fade Zones — the real-world locations that need attention. Positions are
// percentages on the stylized Riverbend map canvas (see MapScreen).
// ---------------------------------------------------------------------------
export const ZONES = [
  {
    id: 'z-willow-corner', name: 'Willow Park — North Corner', type: 'park',
    x: 24, y: 30, priority: 3, distanceM: 280,
    blurb: 'A neglected picnic corner choked with windblown litter and tangled AR vines.',
    story: 'Locals remember summer concerts here in the 90s. The bandshell footing is still under the brush.',
    guardian: 'mossling', est: { pieces: 18, minutes: 15, lbs: 6 },
  },
  {
    id: 'z-mill-creek', name: 'Mill Creek Bend', type: 'creek',
    x: 62, y: 22, priority: 5, distanceM: 540,
    blurb: 'Plastic snagged along the bank is dimming the whole waterway in the AR layer.',
    story: 'Mill Creek once ran clear enough for trout. A clean bend is the first step back.',
    guardian: 'rillo', est: { pieces: 24, minutes: 25, lbs: 9 },
  },
  {
    id: 'z-ridge-trail', name: 'Ridgeline Trailhead', type: 'trail',
    x: 80, y: 48, priority: 4, distanceM: 1200,
    blurb: 'The trailhead kiosk is buried in a litter storm. Wildlife corridor is fractured.',
    story: 'This trail links two parks. Reopen the corridor and the whole ridge reconnects.',
    guardian: 'trailfox', est: { pieces: 20, minutes: 40, lbs: 8 },
  },
  {
    id: 'z-main-and-3rd', name: 'Main & 3rd Block', type: 'downtown',
    x: 44, y: 58, priority: 4, distanceM: 150,
    blurb: 'A downtown block drained of color — storefront alcoves full of fast-food waste.',
    story: 'The old marquee still works. Light it back up and the block glows for everyone.',
    guardian: 'lumen', est: { pieces: 22, minutes: 20, lbs: 7 },
  },
  {
    id: 'z-east-elementary', name: 'East Elementary Field', type: 'school',
    x: 30, y: 72, priority: 3, distanceM: 700,
    blurb: 'The edge of the school field needs a sweep before the morning bell.',
    story: 'A clean campus is a daylight-only, youth-friendly Glow Run the whole crew can join.',
    guardian: 'sproutscout', est: { pieces: 14, minutes: 12, lbs: 4 },
  },
  {
    id: 'z-south-shore', name: 'South Shore Strand', type: 'beach',
    x: 68, y: 82, priority: 5, distanceM: 1600,
    blurb: 'The tide line is a ribbon of microplastic and bottle caps.',
    story: 'Every cap pulled here is one a gull never swallows. The Tideling is watching.',
    guardian: 'tideling', est: { pieces: 30, minutes: 35, lbs: 11 },
  },
  {
    id: 'z-veterans-green', name: 'Veterans Green', type: 'park',
    x: 50, y: 40, priority: 2, distanceM: 420,
    blurb: 'A small commons that just needs a quick ten-piece sprint to glow again.',
    story: 'A five-minute Glow Run favorite on lunch breaks.',
    guardian: 'mossling', est: { pieces: 10, minutes: 8, lbs: 3 },
  },
  {
    id: 'z-harbor-walk', name: 'Harbor Walk', type: 'park',
    x: 14, y: 56, priority: 3, distanceM: 950,
    blurb: 'A waterfront promenade in a historically underserved neighborhood.',
    story: 'Priority restoration: this side of town has waited a long time for its glow.',
    guardian: 'mossling', est: { pieces: 16, minutes: 18, lbs: 6 },
  },
];

// Decorative map geometry (drawn as SVG in MapScreen) — river + main streets.
export const MAP_GEOMETRY = {
  river: 'M 70,-5 C 60,20 64,30 58,42 C 52,54 40,60 36,72 C 32,84 40,95 52,105',
  roads: [
    'M -5,58 L 105,52',
    'M 44,-5 L 48,105',
    'M -5,30 L 60,34 L 80,48',
    'M 20,105 L 30,72 L 50,40',
  ],
};

// ---------------------------------------------------------------------------
// Crews — the player's crew plus rivals for the seasonal leaderboard.
// ---------------------------------------------------------------------------
export const PLAYER_CREW_ID = 'reclaimers';

export const CREWS = [
  {
    id: 'reclaimers', name: 'Riverbend Reclaimers', badge: '🛡️', glow: 'emerald',
    territory: 'Willow Park', members: 12, weeklyScore: 4120, isPlayer: true,
  },
  { id: 'tide-turners', name: 'Tide Turners', badge: '🌊', glow: 'cyan', territory: 'South Shore', members: 18, weeklyScore: 5230 },
  { id: 'ridge-runners', name: 'Ridge Runners', badge: '⛰️', glow: 'lime', territory: 'Ridgeline', members: 9, weeklyScore: 3880 },
  { id: 'neon-north', name: 'Neon North', badge: '🌆', glow: 'fuchsia', territory: 'Downtown', members: 15, weeklyScore: 4640 },
  { id: 'east-eagles', name: 'East Eagles (Elementary)', badge: '🦅', glow: 'amber', territory: 'East Elementary', members: 24, weeklyScore: 3110 },
];

// School / neighborhood standings shown on the impact dashboard.
export const SCHOOL_STANDINGS = [
  { name: 'East Elementary', score: 9820, change: +2 },
  { name: 'Riverbend High', score: 8740, change: -1 },
  { name: 'Mill Creek Middle', score: 6310, change: +1 },
  { name: 'Harbor Charter', score: 4180, change: +3 },
];

export const NEIGHBORHOOD_STANDINGS = [
  { name: 'Harbor District', score: 12450, change: +11 },
  { name: 'Old Town', score: 11980, change: -1 },
  { name: 'Mill Creek', score: 10220, change: +2 },
  { name: 'The Ridge', score: 8650, change: 0 },
];

// ---------------------------------------------------------------------------
// Live group event — the Mayor's Cleanup Cup, with shared AR milestones that
// unlock sponsor-funded donations as the whole city's counter climbs.
// ---------------------------------------------------------------------------
export const EVENT = {
  id: 'mayors-cup', name: "Mayor's Cleanup Cup", date: 'Today · 4:00–7:00 PM',
  location: 'Willow Park Main Lawn', glow: 'fuchsia',
  blurb: 'A celebrity-led city restoration day. Join a team, climb the live leaderboard, and trigger shared AR transformations as the city hits milestones.',
  celebrity: { name: 'Maya Okafor', tag: 'Olympic runner · plays for the Reclaimers', emoji: '🏅' },
  teams: [
    { id: 'sunrise', name: 'Team Sunrise', glow: 'amber', score: 8200 },
    { id: 'tidewater', name: 'Team Tidewater', glow: 'cyan', score: 7650 },
  ],
  // City-wide shared counter milestones. Each unlocks a sponsor donation and a
  // collective AR reveal that everyone on the lawn sees at once.
  cityGoalLbs: 5000,
  milestones: [
    { atLbs: 1000, reward: '$500 to East Elementary garden', reveal: 'Willow Park lawn blooms in AR', unlocked: true },
    { atLbs: 2500, reward: '$1,000 to Mill Creek watershed fund', reveal: 'A flock of AR pollinators is released', unlocked: false },
    { atLbs: 5000, reward: '$2,500 grant + legendary Verdania sighting', reveal: 'Verdania, the regional guardian, walks the lawn', unlocked: false },
  ],
  startCityLbs: 1840, // where the live counter begins this session
};

// ---------------------------------------------------------------------------
// Civic reward catalog — pride-and-place rewards, never cash-for-weight.
// ---------------------------------------------------------------------------
export const REWARDS = [
  { id: 'r-coffee', name: 'Riverbend Roasters', desc: 'Free drip coffee', cost: 800, kind: 'Local business', emoji: '☕' },
  { id: 'r-park', name: 'State Park Day Pass', desc: 'One-day vehicle pass', cost: 1500, kind: 'Park pass', emoji: '🎟️' },
  { id: 'r-transit', name: 'Transit Day Pass', desc: 'All-day bus + light rail', cost: 1200, kind: 'Transit', emoji: '🚌' },
  { id: 'r-museum', name: 'Science Museum Ticket', desc: 'General admission', cost: 2000, kind: 'Culture', emoji: '🔬' },
  { id: 'r-donate', name: 'Donate to a Local School', desc: 'Turn 1,000 pts into a $10 sponsor grant', cost: 1000, kind: 'Donation', emoji: '🎁' },
  { id: 'r-trophy', name: 'Crew Trophy (Physical)', desc: 'Engraved trophy mailed to your crew', cost: 6000, kind: 'Recognition', emoji: '🏆' },
];

// Onboarding / discovery flavor — "Echoes" of community impact surfaced in AR.
export const DISCOVERIES = [
  { id: 'd-seed-1', label: 'Glow Seed', hint: 'Hidden near the old bandshell footing in Willow Park.', emoji: '🌟' },
  { id: 'd-echo-1', label: 'Echo', hint: '1,204 lbs removed within 500 ft of here by 86 players.', emoji: '🔊' },
  { id: 'd-memory-1', label: 'Memory Marker', hint: 'See Mill Creek as it looked in 1991, before the fade.', emoji: '🕰️' },
  { id: 'd-portal-1', label: 'Secret Portal', hint: 'Appears only after a 5-day cleanup streak.', emoji: '🌀' },
];

// Safety guidance shown before missions and on the Profile screen.
export const HAZARD_TYPES = [
  'Needles or sharps', 'Chemicals or unknown liquids', 'Weapons',
  'Medical or biohazard waste', 'Broken glass piles', 'Dead animals', 'Anything heavy or anchored',
];
