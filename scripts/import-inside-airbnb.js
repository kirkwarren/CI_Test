#!/usr/bin/env node
/**
 * Converts a real Inside Airbnb "listings.csv" export into the comp dataset
 * the app consumes (src/data/airbnbComps.json), replacing the bundled sample.
 *
 * Inside Airbnb (https://insideairbnb.com/get-the-data/) publishes quarterly
 * scrapes of Airbnb listings for many cities. Download listings.csv (either
 * the summary file or the detailed one, gunzipped) for your target market,
 * then run:
 *
 *   node scripts/import-inside-airbnb.js path/to/listings.csv
 *
 * Only rows with usable coordinates and a nightly price are kept.
 */

const fs = require('fs');
const path = require('path');

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field); field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/import-inside-airbnb.js <listings.csv>');
  process.exit(1);
}

const rows = parseCSV(fs.readFileSync(file, 'utf8'));
const header = rows.shift().map((h) => h.trim());
const col = (name) => header.indexOf(name);
const idx = {
  id: col('id'),
  name: col('name'),
  neighbourhood: col('neighbourhood_cleansed') !== -1 ? col('neighbourhood_cleansed') : col('neighbourhood'),
  latitude: col('latitude'),
  longitude: col('longitude'),
  room_type: col('room_type'),
  bedrooms: col('bedrooms'),
  accommodates: col('accommodates'),
  price: col('price'),
  minimum_nights: col('minimum_nights'),
  availability_365: col('availability_365'),
  number_of_reviews: col('number_of_reviews'),
  reviews_per_month: col('reviews_per_month'),
  review_scores_rating: col('review_scores_rating'),
};

const num = (v) => {
  if (v === undefined || v === '') return null;
  const n = parseFloat(String(v).replace(/[$,]/g, ''));
  return Number.isFinite(n) ? n : null;
};

const comps = [];
for (const r of rows) {
  const get = (k) => (idx[k] === -1 ? '' : r[idx[k]]);
  const lat = num(get('latitude'));
  const lng = num(get('longitude'));
  const price = num(get('price'));
  if (lat === null || lng === null || price === null || price <= 0) continue;
  comps.push({
    id: num(get('id')) ?? comps.length,
    name: get('name') || 'Airbnb listing',
    neighbourhood: get('neighbourhood') || '',
    latitude: lat,
    longitude: lng,
    room_type: get('room_type') || 'Entire home/apt',
    bedrooms: num(get('bedrooms')) ?? 1,
    accommodates: num(get('accommodates')) ?? 2,
    price,
    minimum_nights: num(get('minimum_nights')) ?? 1,
    availability_365: num(get('availability_365')) ?? 180,
    number_of_reviews: num(get('number_of_reviews')) ?? 0,
    reviews_per_month: num(get('reviews_per_month')) ?? 0,
    review_scores_rating: num(get('review_scores_rating')) ?? null,
  });
}

const out = path.join(__dirname, '..', 'src', 'data', 'airbnbComps.json');
fs.writeFileSync(out, JSON.stringify(comps, null, 2) + '\n');
console.log(`Imported ${comps.length} comps from ${file} -> ${out}`);
