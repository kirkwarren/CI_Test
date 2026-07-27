#!/usr/bin/env node
/**
 * Generates the bundled sample datasets used when live data sources are
 * unavailable:
 *
 *   public/data/listings.json     - for-sale listings in SimplyRETS (RESO) shape
 *   public/data/airbnb-comps.json - short-term-rental comps in Inside Airbnb shape
 *
 * These live in public/ rather than src/ so they are fetched at runtime as
 * static JSON instead of being inlined into the JS bundle — at this size
 * bundling them would add megabytes to the main chunk.
 *
 * Covers 30 US markets chosen to span the range that actually matters for
 * short-term-rental underwriting: low-tax vacation markets where nightly rates
 * run high relative to purchase price, through high-tax urban markets where
 * they don't. Property tax rates are per-market and roughly reflect real
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
const coord = (n) => +n.toFixed(5); // ~1m precision; keeps the files smaller

const HOMES_PER_MARKET = 112;
const LAND_PER_MARKET = 26;
const COMPS_PER_MARKET = 380;

// Nightly-rate profiles by bedroom count. Vacation markets command far higher
// rates per bedroom than urban ones, which is the whole reason they pencil for
// STR and dense urban markets often don't.
const ADR_PROFILE = {
  cabin: { 1: 145, 2: 215, 3: 305, 4: 415, 5: 545, 6: 690, 7: 830, 8: 980 },
  beach: { 1: 135, 2: 205, 3: 290, 4: 390, 5: 510, 6: 640, 7: 780, 8: 920 },
  urban: { 1: 95, 2: 132, 3: 178, 4: 235, 5: 300, 6: 360, 7: 425, 8: 490 },
};

/**
 * Markets: [name, state, lat, lng, taxRate, ppsf, adrMult, profile, occ,
 *           landPerAcre, minAcres, maxAcres, zips, streets]
 *
 * taxRate is the effective annual property tax rate, ppsf a baseline price per
 * square foot, adrMult scales the profile's nightly rates for this market, and
 * occ is a baseline annual occupancy.
 */
const M = (
  name, state, lat, lng, taxRate, ppsf, adrMult, profile, occ,
  landPerAcre, minAcres, maxAcres, zips, streets, urbanLot = false
) => ({
  name: `${name}, ${state}`, city: name, state, lat, lng, taxRate, ppsf, adrMult,
  profile, occ, landPerAcre, acres: [minAcres, maxAcres], zips, streets, urbanLot,
});

const MARKETS = [
  // ---- Smoky Mountains / Appalachia -------------------------------------
  M('Sevierville', 'TN', 35.868, -83.562, 0.0056, 285, 1.00, 'cabin', 0.62, 78000, 0.4, 2.5,
    ['37862', '37876'], ['Wears Valley Rd', 'Pittman Center Rd', 'Boyds Creek Hwy', 'Douglas Dam Rd']),
  M('Gatlinburg', 'TN', 35.714, -83.511, 0.0056, 320, 1.08, 'cabin', 0.64, 105000, 0.3, 1.6,
    ['37738'], ['Ski Mountain Rd', 'Glades Rd', 'Baskins Creek Rd', 'Roaring Fork Rd']),
  M('Pigeon Forge', 'TN', 35.788, -83.554, 0.0056, 300, 1.03, 'cabin', 0.63, 92000, 0.3, 1.8,
    ['37863'], ['Waldens Creek Rd', 'Bluff Mountain Rd', 'Dollywood Ln', 'Henderson Chapel Rd']),
  M('Bryson City', 'NC', 35.430, -83.447, 0.0072, 235, 0.86, 'cabin', 0.55, 34000, 0.7, 4.5,
    ['28713'], ['Deep Creek Rd', 'Everett St', 'Galbraith Creek Rd', 'Buckner Branch Rd']),
  M('Maggie Valley', 'NC', 35.518, -83.098, 0.0072, 250, 0.88, 'cabin', 0.56, 41000, 0.5, 3.5,
    ['28751'], ['Soco Rd', 'Fie Top Rd', 'Setzer Cove Rd', 'Rich Cove Rd']),
  M('Boone', 'NC', 36.217, -81.674, 0.0072, 300, 0.90, 'cabin', 0.57, 62000, 0.5, 3.0,
    ['28607'], ['Blowing Rock Rd', 'Poplar Grove Rd', 'Meadowview Dr', 'Deerfield Rd']),
  M('Blue Ridge', 'GA', 34.864, -84.324, 0.0092, 300, 0.92, 'cabin', 0.57, 32000, 0.8, 5.0,
    ['30513'], ['Aska Rd', 'Old Toccoa Rd', 'Windy Ridge Rd', 'Deep Gap Rd']),
  M('Ellijay', 'GA', 34.695, -84.482, 0.0092, 258, 0.84, 'cabin', 0.55, 27000, 0.9, 6.0,
    ['30540'], ['Yukon Rd', 'Clear Creek Rd', 'Whitepath Rd', 'Old Highway 5']),
  M('Helen', 'GA', 34.702, -83.726, 0.0092, 272, 0.88, 'cabin', 0.56, 36000, 0.5, 3.2,
    ['30545'], ['Edelweiss Strasse', 'Chattahoochee Strasse', 'Alpine Way', 'Ridge Rd']),
  M('Luray', 'VA', 38.665, -78.459, 0.0072, 218, 0.78, 'cabin', 0.53, 22000, 1.0, 6.0,
    ['22835'], ['Skyline Dr', 'Bixler Ferry Rd', 'Kimball Rd', 'Hawksbill St']),

  // ---- Lakes, plains & midwest ------------------------------------------
  M('Broken Bow', 'OK', 34.163, -94.690, 0.0090, 245, 0.95, 'cabin', 0.58, 21000, 1.0, 6.0,
    ['74728'], ['Stevens Gap Rd', 'Hochatown Rd', 'Lukfata Trail', 'Cedar Creek Rd']),
  M('Branson', 'MO', 36.644, -93.219, 0.0091, 205, 0.72, 'cabin', 0.55, 24000, 0.5, 4.0,
    ['65616'], ['Fall Creek Rd', 'Gretna Rd', 'Bee Creek Rd', 'Roark Valley Rd']),
  M('Hot Springs', 'AR', 34.504, -93.055, 0.0065, 190, 0.70, 'cabin', 0.53, 19000, 0.6, 4.0,
    ['71913'], ['Central Ave', 'Malvern Ave', 'Shady Grove Rd', 'Airport Rd']),
  M('Eureka Springs', 'AR', 36.402, -93.738, 0.0065, 205, 0.76, 'cabin', 0.54, 17000, 0.8, 5.0,
    ['72632'], ['Spring St', 'Mundell Rd', 'Rock House Rd', 'Passion Play Rd']),
  M('Wisconsin Dells', 'WI', 43.627, -89.771, 0.0165, 215, 0.82, 'cabin', 0.54, 26000, 0.5, 4.0,
    ['53965'], ['Wisconsin Dells Pkwy', 'River Rd', 'Stand Rock Rd', 'Hillman Rd']),
  M('Traverse City', 'MI', 44.763, -85.620, 0.0135, 285, 0.88, 'cabin', 0.55, 58000, 0.4, 3.0,
    ['49684', '49686'], ['Front St', 'Peninsula Dr', 'Bay Shore Dr', 'Cherry Bend Rd']),
  M('Logan', 'OH', 39.540, -82.407, 0.0148, 195, 0.80, 'cabin', 0.55, 16000, 1.0, 7.0,
    ['43138'], ['Big Pine Rd', 'Hocking Dr', 'State Route 664', 'Cantwell Cliffs Rd']),
  M('Lake Ariel', 'PA', 41.463, -75.353, 0.0155, 205, 0.74, 'cabin', 0.54, 19000, 0.5, 3.5,
    ['18436'], ['Hamlin Hwy', 'Easton Turnpike', 'Ledgedale Rd', 'Goose Pond Rd']),
  M('Lake Placid', 'NY', 44.280, -73.980, 0.0165, 310, 0.92, 'cabin', 0.55, 54000, 0.4, 3.0,
    ['12946'], ['Mirror Lake Dr', 'Saranac Ave', 'Cascade Rd', 'Whiteface Inn Ln']),
  M('Stowe', 'VT', 44.465, -72.687, 0.0175, 375, 1.00, 'cabin', 0.56, 78000, 0.5, 4.0,
    ['05672'], ['Mountain Rd', 'Moscow Rd', 'Luce Hill Rd', 'Cottage Club Rd']),

  // ---- West & southwest --------------------------------------------------
  M('Big Bear Lake', 'CA', 34.244, -116.911, 0.0075, 385, 1.02, 'cabin', 0.58, 98000, 0.2, 1.2,
    ['92315'], ['Big Bear Blvd', 'Moonridge Rd', 'Knickerbocker Rd', 'Fox Farm Rd']),
  M('Idyllwild', 'CA', 33.740, -116.719, 0.0075, 340, 0.90, 'cabin', 0.54, 72000, 0.3, 2.0,
    ['92549'], ['North Circle Dr', 'Pine Crest Ave', 'Delano Dr', 'Fern Valley Rd']),
  M('Ruidoso', 'NM', 33.331, -105.673, 0.0068, 245, 0.84, 'cabin', 0.55, 31000, 0.4, 3.0,
    ['88345'], ['Sudderth Dr', 'Mechem Dr', 'Paradise Canyon Rd', 'Gavilan Canyon Rd']),
  M('Pagosa Springs', 'CO', 37.269, -107.010, 0.0052, 300, 0.90, 'cabin', 0.55, 34000, 0.6, 5.0,
    ['81147'], ['Pagosa St', 'Piedra Rd', 'Lake Forest Cir', 'Vista Blvd']),
  M('Sedona', 'AZ', 34.870, -111.761, 0.0058, 480, 1.05, 'cabin', 0.60, 165000, 0.2, 1.5,
    ['86336'], ['Airport Rd', 'Chapel Rd', 'Dry Creek Rd', 'Soldier Pass Rd']),

  // ---- Beach -------------------------------------------------------------
  M('Panama City Beach', 'FL', 30.176, -85.805, 0.0105, 340, 0.98, 'beach', 0.60, 240000, 0.15, 0.8,
    ['32413', '32407'], ['Front Beach Rd', 'Thomas Dr', 'Hutchison Blvd', 'Beckrich Rd']),
  M('Destin', 'FL', 30.394, -86.496, 0.0085, 425, 1.10, 'beach', 0.62, 330000, 0.12, 0.6,
    ['32541'], ['Scenic Hwy 98', 'Airport Rd', 'Gulf Shore Dr', 'Indian Trail']),
  M('Gulf Shores', 'AL', 30.246, -87.701, 0.0035, 330, 0.96, 'beach', 0.58, 210000, 0.15, 0.9,
    ['36542'], ['E Beach Blvd', 'W 2nd St', 'Fort Morgan Rd', 'Clubhouse Dr']),
  M('Myrtle Beach', 'SC', 33.689, -78.887, 0.0055, 275, 0.84, 'beach', 0.57, 190000, 0.12, 0.7,
    ['29572', '29577'], ['Ocean Blvd', 'Kings Hwy', 'Grissom Pkwy', 'Shore Dr']),
  M('Galveston', 'TX', 29.301, -94.798, 0.0205, 295, 0.90, 'beach', 0.56, 175000, 0.12, 0.7,
    ['77550', '77554'], ['Seawall Blvd', 'Stewart Rd', 'Broadway Ave', 'Jamaica Beach Rd']),

  // ---- Urban (the high-tax control group) --------------------------------
  M('Houston', 'TX', 29.760, -95.369, 0.0220, 196, 1.00, 'urban', 0.62, 900000, 0.1, 0.3,
    ['77008', '77006', '77004', '77007'],
    ['Yale St', 'Heights Blvd', 'Westheimer Rd', 'Dunlavy St', 'Washington Ave'], true),
  M('Austin', 'TX', 30.267, -97.743, 0.0190, 312, 1.05, 'urban', 0.65, 1400000, 0.1, 0.28,
    ['78702', '78704', '78745'],
    ['E 6th St', 'S Congress Ave', 'Manor Rd', 'S 1st St', 'Airport Blvd'], true),
  M('San Antonio', 'TX', 29.424, -98.494, 0.0205, 185, 0.88, 'urban', 0.60, 620000, 0.1, 0.3,
    ['78205', '78209', '78212'],
    ['Broadway St', 'S Alamo St', 'Fredericksburg Rd', 'Blanco Rd'], true),
  M('Nashville', 'TN', 36.163, -86.781, 0.0074, 355, 1.15, 'urban', 0.66, 1100000, 0.1, 0.3,
    ['37206', '37203', '37208'],
    ['Gallatin Ave', 'Charlotte Ave', 'Woodland St', '12th Ave S'], true),
  M('Memphis', 'TN', 35.150, -90.049, 0.0135, 145, 0.80, 'urban', 0.55, 240000, 0.1, 0.4,
    ['38104', '38111'], ['Union Ave', 'Poplar Ave', 'Cooper St', 'Central Ave'], true),
  M('Phoenix', 'AZ', 33.448, -112.074, 0.0062, 290, 0.95, 'urban', 0.61, 700000, 0.1, 0.4,
    ['85004', '85018', '85008'],
    ['Camelback Rd', 'Central Ave', 'Indian School Rd', 'McDowell Rd'], true),
  M('Kissimmee', 'FL', 28.292, -81.408, 0.0095, 265, 1.02, 'urban', 0.63, 420000, 0.1, 0.5,
    ['34747', '34746'], ['W Irlo Bronson Hwy', 'Formosa Gardens Blvd', 'Celebration Ave', 'Poinciana Blvd'], true),
];

// ---------------------------------------------------------------- listings --
const listings = [];
let mlsId = 1000000;

for (const m of MARKETS) {
  const isVacation = m.profile !== 'urban';
  const spread = isVacation ? 0.09 : 0.05;

  for (let i = 0; i < HOMES_PER_MARKET; i++) {
    const beds = isVacation
      ? pick([1, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 8])
      : pick([1, 2, 2, 3, 3, 3, 4, 4, 5]);
    const bathsFull = Math.max(1, Math.min(beds, Math.round(beds * between(0.6, 1.0))));
    const bathsHalf = pick([0, 0, 1]);
    // Vacation properties run smaller per bedroom than suburban homes.
    const area = round(
      isVacation ? 560 + beds * between(300, 430) : 660 + beds * between(380, 600),
      10
    );
    const type = !isVacation && beds <= 2 && rand() < 0.35 ? 'CND' : 'RES';
    const yearBuilt = Math.round(between(1972, 2025));
    const ppsf = m.ppsf * between(0.82, 1.2) * (yearBuilt > 2010 ? 1.07 : 1);
    const daysOnMarket = Math.round(between(2, 165));

    listings.push({
      mlsId: mlsId++,
      listPrice: round(area * ppsf, 1000),
      listDate: new Date(Date.UTC(2026, 6, 27) - daysOnMarket * 86400000).toISOString(),
      remarks:
        `${beds} bed / ${bathsFull} bath ${isVacation ? 'vacation home' : type === 'CND' ? 'condo' : 'home'} ` +
        `in ${m.city}, ${m.state}. Sample listing generated for demo purposes.`,
      property: {
        type, bedrooms: beds, bathsFull, bathsHalf, area, yearBuilt, subdivision: m.name,
      },
      address: {
        full: `${Math.round(between(100, 9800))} ${pick(m.streets)}`,
        city: m.city, state: m.state, postalCode: pick(m.zips), country: 'United States',
      },
      geo: { lat: coord(m.lat + jitter(spread)), lng: coord(m.lng + jitter(spread)) },
      association: { fee: type === 'CND' ? Math.round(between(180, 520)) : 0 },
      taxRate: m.taxRate,
      mls: { status: 'Active', daysOnMarket, area: m.name },
      sampleData: true,
    });
  }

  // Vacant land parcels - underwritten in the app as build-to-rent deals.
  for (let i = 0; i < LAND_PER_MARKET; i++) {
    const acres = +between(m.acres[0], m.acres[1]).toFixed(2);
    const daysOnMarket = Math.round(between(5, 300));
    listings.push({
      mlsId: mlsId++,
      listPrice: round(m.landPerAcre * acres * between(0.72, 1.35), 1000),
      listDate: new Date(Date.UTC(2026, 6, 27) - daysOnMarket * 86400000).toISOString(),
      remarks:
        `${acres} acre buildable lot in ${m.city}, ${m.state}. ` +
        `Sample listing generated for demo purposes.`,
      property: {
        type: 'LND', bedrooms: null, bathsFull: null, bathsHalf: null,
        area: null, lotSizeAcres: acres, yearBuilt: null, subdivision: m.name,
      },
      address: {
        full: `${Math.round(between(100, 9800))} ${pick(m.streets)}`,
        city: m.city, state: m.state, postalCode: pick(m.zips), country: 'United States',
      },
      geo: { lat: coord(m.lat + jitter(spread * 1.2)), lng: coord(m.lng + jitter(spread * 1.2)) },
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
  const isVacation = m.profile !== 'urban';
  const spread = isVacation ? 0.13 : 0.06;

  for (let i = 0; i < COMPS_PER_MARKET; i++) {
    const roomType = pick(ROOM_TYPES);
    const beds =
      roomType === 'Private room'
        ? 1
        : isVacation
          ? pick([1, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 8])
          : pick([1, 2, 2, 3, 3, 4, 5]);
    const adrBase = base[beds] * m.adrMult * (roomType === 'Private room' ? 0.5 : 1);
    const occupancy = Math.min(0.93, Math.max(0.22, m.occ + between(-0.13, 0.13)));
    const reviewsPerMonth = +(occupancy * between(1.1, 3.6)).toFixed(2);

    comps.push({
      id: compId++,
      name: `${roomType === 'Private room' ? 'Room' : `${beds}BR`} in ${m.city}`,
      neighbourhood: m.name,
      latitude: coord(m.lat + jitter(spread)),
      longitude: coord(m.lng + jitter(spread)),
      room_type: roomType,
      bedrooms: beds,
      accommodates: beds * 2 + pick([0, 1, 2]),
      price: Math.round(adrBase * between(0.82, 1.24)),
      minimum_nights: pick([1, 2, 2, 2, 3, 30]),
      // Inside Airbnb publishes availability, not occupancy; encode consistently.
      availability_365: Math.round(365 * (1 - occupancy)),
      number_of_reviews: Math.round(reviewsPerMonth * between(6, 62)),
      reviews_per_month: reviewsPerMonth,
      review_scores_rating: +between(4.2, 5.0).toFixed(2),
    });
  }
}

const outDir = path.join(__dirname, '..', 'public', 'data');
fs.mkdirSync(outDir, { recursive: true });
// Compact JSON - these are generated artifacts fetched over the wire.
fs.writeFileSync(path.join(outDir, 'listings.json'), JSON.stringify(listings));
fs.writeFileSync(path.join(outDir, 'airbnb-comps.json'), JSON.stringify(comps));

const land = listings.filter((l) => l.property.type === 'LND').length;
const mb = (f) => (fs.statSync(path.join(outDir, f)).size / 1048576).toFixed(2);
console.log(
  `Wrote ${listings.length} listings (${listings.length - land} homes, ${land} land, ${mb('listings.json')} MB) ` +
  `and ${comps.length} Airbnb comps (${mb('airbnb-comps.json')} MB) across ${MARKETS.length} markets`
);
