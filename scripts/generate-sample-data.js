#!/usr/bin/env node
/**
 * Generates the bundled sample datasets used when live data sources are
 * unavailable:
 *
 *   src/data/sampleListings.json  - for-sale listings in SimplyRETS (RESO) shape
 *   src/data/airbnbComps.json     - short-term-rental comps in Inside Airbnb shape
 *
 * The data is synthetic but realistic for the Houston, TX market (the same
 * market the SimplyRETS demo MLS feed covers), and is generated with a fixed
 * seed so re-running the script is a no-op unless the generator changes.
 *
 * Usage: node scripts/generate-sample-data.js
 */

const fs = require('fs');
const path = require('path');

// mulberry32 - tiny seeded PRNG so output is reproducible.
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260725);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const between = (lo, hi) => lo + rand() * (hi - lo);
const jitter = (deg) => (rand() - 0.5) * deg;

// Houston neighborhoods: [name, lat, lng, zip, salePriceMult, adrMult, occBase]
const HOODS = [
  ['The Heights', 29.7905, -95.3979, '77008', 1.35, 1.30, 0.66],
  ['Montrose', 29.7425, -95.3905, '77006', 1.30, 1.35, 0.70],
  ['Midtown', 29.7373, -95.3770, '77004', 1.10, 1.20, 0.68],
  ['EaDo', 29.7488, -95.3466, '77003', 1.00, 1.15, 0.64],
  ['Museum District', 29.7250, -95.3880, '77005', 1.40, 1.25, 0.65],
  ['Rice Military', 29.7690, -95.4090, '77007', 1.25, 1.20, 0.62],
  ['Downtown', 29.7570, -95.3620, '77002', 1.05, 1.10, 0.60],
  ['East End', 29.7350, -95.3250, '77011', 0.75, 0.95, 0.55],
  ['Third Ward', 29.7230, -95.3600, '77004', 0.70, 0.90, 0.52],
  ['Oak Forest', 29.8250, -95.4330, '77018', 1.00, 1.00, 0.55],
  ['Garden Oaks', 29.8180, -95.4160, '77018', 1.05, 1.00, 0.54],
  ['Spring Branch', 29.8030, -95.5030, '77055', 0.85, 0.90, 0.50],
  ['Meyerland', 29.6870, -95.4640, '77096', 0.85, 0.85, 0.48],
  ['Medical Center', 29.7070, -95.4010, '77030', 0.95, 1.15, 0.72],
];

const STREETS = [
  'Yale St', 'Heights Blvd', 'Studewood St', 'Westheimer Rd', 'Fairview St',
  'Emancipation Ave', 'Polk St', 'Dunlavy St', 'Binz St', 'Bagby St',
  'Washington Ave', 'Harrisburg Blvd', 'Lawndale St', 'Ella Blvd',
  'W 34th St', 'Wirt Rd', 'Chimney Rock Rd', 'Almeda Rd', 'Leeland St',
  'Sabine St', 'Oxford St', 'Cortlandt St', 'Rutland St', 'Columbia St',
];

// Base ADR (nightly rate) by bedroom count for an average Houston neighborhood.
const BASE_ADR = { 1: 92, 2: 128, 3: 172, 4: 228, 5: 295 };

// ---------------------------------------------------------------- listings --
const PROPERTY_TYPES = ['RES', 'RES', 'RES', 'CND', 'RES'];
const listings = [];
for (let i = 0; i < 64; i++) {
  const hood = pick(HOODS);
  const [name, lat, lng, zip, priceMult] = hood;
  const beds = pick([1, 2, 2, 3, 3, 3, 4, 4, 5]);
  const bathsFull = Math.max(1, beds - pick([0, 1, 1, 2]));
  const bathsHalf = pick([0, 0, 1]);
  const area = Math.round((650 + beds * between(380, 620)) / 10) * 10;
  const type = beds <= 2 && rand() < 0.4 ? 'CND' : pick(PROPERTY_TYPES);
  const yearBuilt = Math.round(between(1948, 2024));
  const pricePerSqft = between(155, 235) * priceMult * (yearBuilt > 2005 ? 1.08 : 1);
  const listPrice = Math.round((area * pricePerSqft) / 1000) * 1000;
  const streetNum = Math.round(between(100, 9800));
  const street = pick(STREETS);
  const daysOnMarket = Math.round(between(3, 120));
  const listDate = new Date(Date.UTC(2026, 6, 25) - daysOnMarket * 86400000)
    .toISOString();

  listings.push({
    mlsId: 1000000 + i,
    listPrice,
    listDate,
    remarks:
      `${beds} bed ${type === 'CND' ? 'condo' : 'single-family home'} in ` +
      `${name}. Sample listing generated for demo purposes.`,
    property: {
      type,
      bedrooms: beds,
      bathsFull,
      bathsHalf,
      area,
      yearBuilt,
      subdivision: name.toUpperCase(),
    },
    address: {
      full: `${streetNum} ${street}`,
      city: 'Houston',
      state: 'TX',
      postalCode: zip,
      country: 'United States',
    },
    geo: { lat: +(lat + jitter(0.012)).toFixed(6), lng: +(lng + jitter(0.012)).toFixed(6) },
    association: { fee: type === 'CND' ? Math.round(between(180, 520)) : 0 },
    mls: { status: 'Active', daysOnMarket, area: 'Houston' },
    sampleData: true,
  });
}

// ------------------------------------------------------------------- comps --
const ROOM_TYPES = ['Entire home/apt', 'Entire home/apt', 'Entire home/apt', 'Private room'];
const comps = [];
for (let i = 0; i < 360; i++) {
  const hood = pick(HOODS);
  const [name, lat, lng, , , adrMult, occBase] = hood;
  const roomType = pick(ROOM_TYPES);
  const beds = roomType === 'Private room' ? 1 : pick([1, 2, 2, 3, 3, 4, 5]);
  const adrBase = BASE_ADR[beds] * (roomType === 'Private room' ? 0.55 : 1);
  const price = Math.round(adrBase * adrMult * between(0.78, 1.28));
  const occupancy = Math.min(0.92, Math.max(0.25, occBase + between(-0.14, 0.14)));
  // Inside Airbnb publishes availability, not occupancy; encode consistently.
  const availability365 = Math.round(365 * (1 - occupancy));
  const reviewsPerMonth = +(occupancy * between(1.2, 3.4)).toFixed(2);
  const monthsActive = between(6, 60);
  const numberOfReviews = Math.round(reviewsPerMonth * monthsActive);

  comps.push({
    id: 50000000 + i,
    name: `${roomType === 'Private room' ? 'Room' : `${beds}BR`} in ${name}`,
    neighbourhood: name,
    latitude: +(lat + jitter(0.014)).toFixed(6),
    longitude: +(lng + jitter(0.014)).toFixed(6),
    room_type: roomType,
    bedrooms: beds,
    accommodates: beds * 2 + pick([0, 1, 2]),
    price,
    minimum_nights: pick([1, 2, 2, 3, 30]),
    availability_365: availability365,
    number_of_reviews: numberOfReviews,
    reviews_per_month: reviewsPerMonth,
    review_scores_rating: +between(4.2, 5.0).toFixed(2),
  });
}

const outDir = path.join(__dirname, '..', 'src', 'data');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, 'sampleListings.json'),
  JSON.stringify(listings, null, 2) + '\n'
);
fs.writeFileSync(
  path.join(outDir, 'airbnbComps.json'),
  JSON.stringify(comps, null, 2) + '\n'
);
console.log(`Wrote ${listings.length} listings and ${comps.length} Airbnb comps to src/data/`);
