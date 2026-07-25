import sampleListings from '../data/sampleListings.json';

/**
 * MLS listing feed client.
 *
 * By default this talks to the SimplyRETS demo API — a public, RESO-standard
 * MLS test feed (Houston, TX data; credentials "simplyrets"/"simplyrets").
 * Point it at a real feed by setting, in .env.local:
 *
 *   REACT_APP_MLS_API_URL   (default https://api.simplyrets.com/properties)
 *   REACT_APP_MLS_API_USER  (your SimplyRETS / RESO vendor key)
 *   REACT_APP_MLS_API_PASS
 *
 * If the feed can't be reached (offline, CORS, bad credentials) the bundled
 * sample dataset is returned instead, flagged with `source: 'sample'`.
 */

const API_URL =
  process.env.REACT_APP_MLS_API_URL || 'https://api.simplyrets.com/properties';
const API_USER = process.env.REACT_APP_MLS_API_USER || 'simplyrets';
const API_PASS = process.env.REACT_APP_MLS_API_PASS || 'simplyrets';

// Normalize a SimplyRETS/RESO property record into the shape the app uses.
function normalize(raw) {
  const p = raw.property || {};
  const addr = raw.address || {};
  const geo = raw.geo || {};
  const baths = (p.bathsFull || 0) + 0.5 * (p.bathsHalf || 0);
  return {
    id: String(raw.mlsId ?? raw.listingId ?? addr.full ?? Math.random()),
    price: raw.listPrice || 0,
    address: addr.full || 'Unknown address',
    city: addr.city || '',
    state: addr.state || '',
    zip: addr.postalCode || '',
    neighborhood: toTitleCase(p.subdivision || raw.mls?.area || ''),
    beds: p.bedrooms ?? null,
    baths: baths || null,
    sqft: p.area || null,
    yearBuilt: p.yearBuilt || null,
    propertyType: p.type === 'CND' ? 'Condo' : 'Single family',
    hoaMonthly: raw.association?.fee || 0,
    daysOnMarket: raw.mls?.daysOnMarket ?? null,
    lat: geo.lat ?? null,
    lng: geo.lng ?? null,
    remarks: raw.remarks || '',
  };
}

function toTitleCase(s) {
  return String(s)
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function usable(l) {
  return l.price > 0 && l.lat !== null && l.lng !== null && l.beds !== null;
}

export async function fetchListings({ limit = 100 } = {}) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${API_URL}?limit=${limit}&status=Active`, {
      headers: { Authorization: 'Basic ' + btoa(`${API_USER}:${API_PASS}`) },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`MLS feed responded ${res.status}`);
    const data = await res.json();
    const listings = data.map(normalize).filter(usable);
    if (!listings.length) throw new Error('MLS feed returned no usable listings');
    return { listings, source: 'live' };
  } catch (err) {
    return {
      listings: sampleListings.map(normalize).filter(usable),
      source: 'sample',
      error: err.message,
    };
  }
}
