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
 * sample dataset is fetched instead, flagged with `source: 'sample'`. That
 * dataset lives in public/data rather than src/ so it is never inlined into
 * the JS bundle.
 */

const API_URL =
  process.env.REACT_APP_MLS_API_URL || 'https://api.simplyrets.com/properties';
const API_USER = process.env.REACT_APP_MLS_API_USER || 'simplyrets';
const API_PASS = process.env.REACT_APP_MLS_API_PASS || 'simplyrets';

export const SAMPLE_LISTINGS_URL = `${process.env.PUBLIC_URL || ''}/data/listings.json`;

const TYPE_LABELS = { CND: 'Condo', LND: 'Land', RES: 'Single family' };

// Real RESO feeds tend to shout field values in all-caps; sample data doesn't.
function tidyName(s) {
  const str = String(s || '');
  if (!str) return '';
  return str === str.toUpperCase()
    ? str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
    : str;
}

// Normalize a SimplyRETS/RESO property record into the shape the app uses.
export function normalize(raw) {
  const p = raw.property || {};
  const addr = raw.address || {};
  const geo = raw.geo || {};
  const baths =
    p.bathsFull != null ? (p.bathsFull || 0) + 0.5 * (p.bathsHalf || 0) : null;
  return {
    id: String(raw.mlsId ?? raw.listingId ?? addr.full ?? Math.random()),
    price: raw.listPrice || 0,
    address: addr.full || 'Unknown address',
    city: addr.city || '',
    state: addr.state || '',
    zip: addr.postalCode || '',
    market: tidyName(raw.mls?.area || p.subdivision || addr.city || ''),
    neighborhood: tidyName(p.subdivision || raw.mls?.area || ''),
    beds: p.bedrooms ?? null,
    baths: baths || null,
    sqft: p.area || null,
    lotAcres: p.lotSizeAcres ?? null,
    yearBuilt: p.yearBuilt || null,
    propertyType: TYPE_LABELS[p.type] || 'Single family',
    hoaMonthly: raw.association?.fee || 0,
    // Per-market effective property tax rate when the feed supplies one;
    // the analysis engine falls back to its own assumption otherwise.
    taxRate: raw.taxRate ?? null,
    daysOnMarket: raw.mls?.daysOnMarket ?? null,
    lat: geo.lat ?? null,
    lng: geo.lng ?? null,
    remarks: raw.remarks || '',
  };
}

export function usable(l) {
  if (!(l.price > 0) || l.lat == null || l.lng == null) return false;
  // Land has no bedroom count — the build spec supplies one downstream.
  return l.propertyType === 'Land' || l.beds != null;
}

async function fetchSample() {
  const res = await fetch(SAMPLE_LISTINGS_URL);
  if (!res.ok) throw new Error(`Sample listings responded ${res.status}`);
  return res.json();
}

export async function fetchListings({ limit = 500 } = {}) {
  let liveError;
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
    liveError = err.message;
  }

  try {
    const raw = await fetchSample();
    return { listings: raw.map(normalize).filter(usable), source: 'sample', error: liveError };
  } catch (err) {
    return { listings: [], source: 'none', error: `${liveError}; ${err.message}` };
  }
}
