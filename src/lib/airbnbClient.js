/**
 * Airbnb comparable-listing loader.
 *
 * Comps are served as a static JSON file in the Inside Airbnb schema rather
 * than imported, so the dataset (tens of thousands of records) never lands in
 * the JS bundle. Replace public/data/airbnb-comps.json with a real Inside
 * Airbnb export via `npm run import-airbnb -- listings.csv`.
 */

export const COMPS_URL = `${process.env.PUBLIC_URL || ''}/data/airbnb-comps.json`;

export async function fetchComps() {
  try {
    const res = await fetch(COMPS_URL);
    if (!res.ok) throw new Error(`Comps responded ${res.status}`);
    const comps = await res.json();
    if (!Array.isArray(comps) || !comps.length) throw new Error('Comp dataset is empty');
    return { comps, error: null };
  } catch (err) {
    return { comps: [], error: err.message };
  }
}
