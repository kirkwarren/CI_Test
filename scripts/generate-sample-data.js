#!/usr/bin/env node
/**
 * Generates the bundled sample datasets used when live data sources are
 * unavailable:
 *
 *   src/data/sampleListings.json  - for-sale listings in SimplyRETS (RESO) shape
 *   src/data/airbnbComps.json     - short-term-rental comps in Inside Airbnb shape
 *
 * Covers ten US markets chosen to span the range that actually matters for
 * short-term-rental underwriting: low-tax vacation/cabin markets where nightly
 * rates run high relative to purchase price, through high-tax urban markets
 * where they don't. Property tax rates are per-market and roughly reflect real
 * effective rates, because tax is one of the largest single drivers of whether
 * an STR cash-flows at all.
 *
 * Both for-sale homes and vacant land parcels are generated; land is
 * underwritten in the app as a build-to-rent deal.
 *
 * Data is synthetic but calibrated to realistic price/ADR/occupancy
 * relationships, and generated from a fixed seed so re-running is a no-op
 * unless the generator changes.
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

const rand = mulberry32(20260727);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const between = (lo, hi) => lo + rand() * (hi - lo);
const jitter = (deg) => (rand() - 0.5) * deg;
const round = (n, to) => Math.round(n / to) * to;

// Nightly-rate profiles by bedroom count. Cabin/beach markets command far
// higher rates per bedroom than urban ones, which is the whole reason
// vacation markets pencil for STR and dense urban markets often don't.
const ADR_PROFILE = {
  cabin: { 1: 145, 2: 215, 3: 305, 4: 415, 5: 545, 6: 690 },
  beach: { 1: 135, 2: 205, 3: 290, 4: 390, 5: 510, 6: 640 },
  urban: { 1: 95, 2: 132, 3: 178, 4: 235, 5: 300, 6: 360 },
};

/**
 * Markets. taxRate is the effective annual property tax rate; ppsf is a
 * baseline price per square foot; occ is a baseline annual occupancy;
 * landPerAcre / acres describe typical vacant parcels; urbanLot marks markets
 * where land sells by the lot rather than by acreage.
 */
const MARKETS = [
  {
    name: 'Sevierville, TN', city: 'Sevierville', state: 'TN', zips: ['37862', '37876'],
    lat: 35.868, lng: -83.562, taxRate: 0.0056, ppsf: 285, adrMult: 1.00, profile: 'cabin', occ: 0.62,
    landPerAcre: 78000, acres: [0.4, 2.5], streets: ['Wears Valley Rd', 'Pittman Center Rd', 'Boyds Creek Hwy', 'Douglas Dam Rd'],
  },
  {
    name: 'Gatlinburg, TN', city: 'Gatlinburg', state: 'TN', zips: ['37738'],
    lat: 35.714, lng: -83.511, taxRate: 0.0056, ppsf: 320, adrMult: 1.08, profile: 'cabin', occ: 0.64,
    landPerAcre: 105000, acres: [0.3, 1.6], streets: ['Ski Mountain Rd', 'Glades Rd', 'Baskins Creek Rd', 'Roaring Fork Rd'],
  },
  {
    name: 'Pigeon Forge, TN', city: 'Pigeon Forge', state: 'TN', zips: ['37863'],
    lat: 35.788, lng: -83.554, taxRate: 0.0056, ppsf: 300, adrMult: 1.03, profile: 'cabin', occ: 0.63,
    landPerAcre: 92000, acres: [0.3, 1.8], streets: ['Waldens Creek Rd', 'Bluff Mountain Rd', 'Dollywood Ln', 'Henderson Chapel Rd'],
  },
  {
    name: 'Broken Bow, OK', city: 'Broken Bow', state: 'OK', zips: ['74728'],
    lat: 34.163, lng: -94.690, taxRate: 0.0090, ppsf: 245, adrMult: 0.95, profile: 'cabin', occ: 0.58,
    landPerAcre: 21000, acres: [1.0, 6.0], streets: ['Stevens Gap Rd', 'Hochatown Rd', 'Lukfata Trail', 'Cedar Creek Rd'],
  },
  {
    name: 'Blue Ridge, GA', city: 'Blue Ridge', state: 'GA', zips: ['30513'],
    lat: 34.864, lng: -84.324, taxRate: 0.0092, ppsf: 300, adrMult: 0.92, profile: 'cabin', occ: 0.57,
    landPerAcre: 32000, acres: [0.8, 5.0], streets: ['Aska Rd', 'Old Toccoa Rd', 'Windy Ridge Rd', 'Deep Gap Rd'],
  },
  {
    name: 'Branson, MO', city: 'Branson', state: 'MO', zips: ['65616'],
    lat: 36.644, lng: -93.219, taxRate: 0.0091, ppsf: 205, adrMult: 0.72, profile: 'cabin', occ: 0.55,
    landPerAcre: 24000, acres: [0.5, 4.0], streets: ['Fall Creek Rd', 'Gretna Rd', 'Bee Creek Rd', 'Roark Valley Rd'],
  },
  {
    name: 'Lake Ariel, PA', city: 'Lake Ariel', state: 'PA', zips: ['18436'],
    lat: 41.463, lng: -75.353, taxRate: 0.0155, ppsf: 205, adrMult: 0.74, profile: 'cabin', occ: 0.54,
    landPerAcre: 19000, acres: [0.5, 3.5], streets: ['Hamlin Hwy', 'Easton Turnpike', 'Ledgedale Rd', 'Goose Pond Rd'],
  },
  {
    name: 'Panama City Beach, FL', city: 'Panama City Beach', state: 'FL', zips: ['32413', '32407'],
    lat: 30.176, lng: -85.805, taxRate: 0.0105, ppsf: 340, adrMult: 0.98, profile: 'beach', occ: 0.60,
    landPerAcre: 240000, acres: [0.15, 0.8], streets: ['Front Beach Rd', 'Thomas Dr', 'Hutchison Blvd', 'Beckrich Rd'],
  },
  {
    name: 'Houston, TX', city: 'Houston', state: 'TX', zips: ['77008', '77006', '77004', '77007'],
    lat: 29.760, lng: -95.369, taxRate: 0.0220, ppsf: 196, adrMult: 1.00, profile: 'urban', occ: 0.62,
    landPerAcre: 900000, acres: [0.1, 0.3], urbanLot: true,
    streets: ['Yale St', 'Heights Blvd', 'Westheimer Rd', 'Dunlavy St', 'Washington Ave'],
  },
  {
    name: 'Austin, TX', city: 'Austin', state: 'TX', zips: ['78702', '78704', '78745'],
    lat: 30.267, lng: -97.743, taxRate: 0.0190, ppsf: 312, adrMult: 1.05, profile: 'urban', occ: 0.65,
    landPerAcre: 1400000, acres: [0.1, 0.28], urbanLot: true,
    streets: ['E 6th St', 'S Congress Ave', 'Manor Rd', 'S 1st St', 'Airport Blvd'],
  },
];

// ---------------------------------------------------------------- listings --
const listings = [];
let mlsId = 1000000;

for (const m of MARKETS) {
  const homeCount = m.profile === 'urban' ? 46 : 52;
  const landCount = m.profile === 'urban' ? 8 : 16;

  for (let i = 0; i < homeCount; i++) {
    const isCabinMkt = m.profile !== 'urban';
    const beds = isCabinMkt
      ? pick([1, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 6])
      : pick([1, 2, 2, 3, 3, 3, 4, 4, 5]);
    const bathsFull = Math.max(1, Math.min(beds, Math.round(beds * between(0.6, 1.0))));
    const bathsHalf = pick([0, 0, 1]);
    // Cabins run smaller per bedroom than suburban homes.
    const area = round(
      (isCabinMkt ? 560 + beds * between(300, 430) : 660 + beds * between(380, 600)),
      10
    );
    const type = !isCabinMkt && beds <= 2 && rand() < 0.35 ? 'CND' : 'RES';
    const yearBuilt = Math.round(between(1972, 2025));
    const ppsf = m.ppsf * between(0.82, 1.2) * (yearBuilt > 2010 ? 1.07 : 1);
    const listPrice = round(area * ppsf, 1000);
    const daysOnMarket = Math.round(between(2, 165));
    const zip = pick(m.zips);

    listings.push({
      mlsId: mlsId++,
      listPrice,
      listDate: new Date(Date.UTC(2026, 6, 27) - daysOnMarket * 86400000).toISOString(),
      remarks:
        `${beds} bed / ${bathsFull} bath ${isCabinMkt ? 'cabin' : type === 'CND' ? 'condo' : 'home'} ` +
        `in ${m.city}, ${m.state}. Sample listing generated for demo purposes.`,
      property: {
        type,
        bedrooms: beds,
        bathsFull,
        bathsHalf,
        area,
        yearBuilt,
        subdivision: m.name,
      },
      address: {
        full: `${Math.round(between(100, 9800))} ${pick(m.streets)}`,
        city: m.city,
        state: m.state,
        postalCode: zip,
        country: 'United States',
      },
      geo: {
        lat: +(m.lat + jitter(m.profile === 'urban' ? 0.05 : 0.09)).toFixed(6),
        lng: +(m.lng + jitter(m.profile === 'urban' ? 0.05 : 0.09)).toFixed(6),
      },
      association: { fee: type === 'CND' ? Math.round(between(180, 520)) : 0 },
      taxRate: m.taxRate,
      mls: { status: 'Active', daysOnMarket, area: m.name },
      sampleData: true,
    });
  }

  // Vacant land parcels - underwritten in the app as build-to-rent deals.
  for (let i = 0; i < landCount; i++) {
    const acres = +between(m.acres[0], m.acres[1]).toFixed(2);
    const listPrice = round(
      m.landPerAcre * acres * between(0.72, 1.35) * (m.urbanLot ? 1 : 1),
      1000
    );
    const daysOnMarket = Math.round(between(5, 300));
    listings.push({
      mlsId: mlsId++,
      listPrice,
      listDate: new Date(Date.UTC(2026, 6, 27) - daysOnMarket * 86400000).toISOString(),
      remarks:
        `${acres} acre buildable lot in ${m.city}, ${m.state}. ` +
        `Sample listing generated for demo purposes.`,
      property: {
        type: 'LND',
        bedrooms: null,
        bathsFull: null,
        bathsHalf: null,
        area: null,
        lotSizeAcres: acres,
        yearBuilt: null,
        subdivision: m.name,
      },
      address: {
        full: `${Math.round(between(100, 9800))} ${pick(m.streets)}`,
        city: m.city,
        state: m.state,
        postalCode: pick(m.zips),
        country: 'United States',
      },
      geo: {
        lat: +(m.lat + jitter(m.profile === 'urban' ? 0.05 : 0.11)).toFixed(6),
        lng: +(m.lng + jitter(m.profile === 'urban' ? 0.05 : 0.11)).toFixed(6),
      },
      association: { fee: 0 },
      taxRate: m.taxRate,
      mls: { status: 'Active', daysOnMarket, area: m.name },
      sampleData: true,
    });
  }
}

// ------------------------------------------------------------------- comps --
const ROOM_TYPES = ['Entire home/apt', 'Entire home/apt', 'Entire home/apt', 'Entire home/apt', 'Private room'];
const comps = [];
let compId = 50000000;

for (const m of MARKETS) {
  const base = ADR_PROFILE[m.profile];
  for (let i = 0; i < 190; i++) {
    const roomType = pick(ROOM_TYPES);
    const isCabinMkt = m.profile !== 'urban';
    const beds =
      roomType === 'Private room'
        ? 1
        : isCabinMkt
          ? pick([1, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 6])
          : pick([1, 2, 2, 3, 3, 4, 5]);
    const adrBase = base[beds] * m.adrMult * (roomType === 'Private room' ? 0.5 : 1);
    const price = Math.round(adrBase * between(0.82, 1.24));
    const occupancy = Math.min(0.93, Math.max(0.22, m.occ + between(-0.13, 0.13)));
    // Inside Airbnb publishes availability, not occupancy; encode consistently.
    const availability365 = Math.round(365 * (1 - occupancy));
    const reviewsPerMonth = +(occupancy * between(1.1, 3.6)).toFixed(2);

    comps.push({
      id: compId++,
      name: `${roomType === 'Private room' ? 'Room' : `${beds}BR`} in ${m.city}`,
      neighbourhood: m.name,
      latitude: +(m.lat + jitter(m.profile === 'urban' ? 0.06 : 0.13)).toFixed(6),
      longitude: +(m.lng + jitter(m.profile === 'urban' ? 0.06 : 0.13)).toFixed(6),
      room_type: roomType,
      bedrooms: beds,
      accommodates: beds * 2 + pick([0, 1, 2]),
      price,
      minimum_nights: pick([1, 2, 2, 2, 3, 30]),
      availability_365: availability365,
      number_of_reviews: Math.round(reviewsPerMonth * between(6, 62)),
      reviews_per_month: reviewsPerMonth,
      review_scores_rating: +between(4.2, 5.0).toFixed(2),
    });
  }
}

const outDir = path.join(__dirname, '..', 'src', 'data');
fs.mkdirSync(outDir, { recursive: true });
// Compact JSON - these are generated artifacts and the files are large.
fs.writeFileSync(path.join(outDir, 'sampleListings.json'), JSON.stringify(listings) + '\n');
fs.writeFileSync(path.join(outDir, 'airbnbComps.json'), JSON.stringify(comps) + '\n');

const landCount = listings.filter((l) => l.property.type === 'LND').length;
console.log(
  `Wrote ${listings.length} listings (${listings.length - landCount} homes, ${landCount} land) ` +
  `and ${comps.length} Airbnb comps across ${MARKETS.length} markets`
);
