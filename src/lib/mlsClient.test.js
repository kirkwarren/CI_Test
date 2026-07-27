import { LIVE_CONFIGURED, MIN_LIVE_LISTINGS, fetchListings, normalize, usable } from './mlsClient';

const demoRecord = (id) => ({
  mlsId: id,
  listPrice: 450000,
  property: { type: 'RES', bedrooms: 3, bathsFull: 2, area: 1800, subdivision: 'DEMO' },
  address: { full: `${id} Demo St`, city: 'Houston', state: 'TX', postalCode: '77008' },
  geo: { lat: 29.76, lng: -95.37 },
  mls: { area: 'Houston' },
});

const originalFetch = global.fetch;
afterEach(() => {
  global.fetch = originalFetch;
});

test('the live feed is opt-in, so default builds never call it', () => {
  // With no REACT_APP_MLS_* overrides the app must use the bundled dataset.
  // Preferring the reachable SimplyRETS demo feed replaced 5,000+ listings
  // with ~3 for anyone on an unrestricted network.
  expect(LIVE_CONFIGURED).toBe(false);
});

test('an unconfigured build loads the bundled dataset and never hits the MLS host', async () => {
  const calls = [];
  const real = global.fetch;
  global.fetch = (url, opts) => {
    calls.push(String(url));
    return real(url, opts);
  };

  const { listings, source } = await fetchListings();
  expect(source).toBe('sample');
  expect(listings.length).toBeGreaterThan(100);
  expect(calls.some((u) => u.includes('simplyrets.com'))).toBe(false);
  expect(calls.some((u) => u.includes('/data/listings.json'))).toBe(true);
});

test('a thin live response falls back rather than emptying the dashboard', async () => {
  // Simulates a configured-but-misbehaving feed: three records is the exact
  // symptom the demo feed produced.
  const thin = [demoRecord(1), demoRecord(2), demoRecord(3)].map(normalize).filter(usable);
  expect(thin.length).toBeLessThan(MIN_LIVE_LISTINGS);
});

test('normalize/usable keep land but drop records without coordinates', () => {
  const land = normalize({
    mlsId: 9,
    listPrice: 80000,
    property: { type: 'LND', bedrooms: null, lotSizeAcres: 2.5, subdivision: 'Blue Ridge, GA' },
    address: { full: '9 Lot Rd', city: 'Blue Ridge', state: 'GA' },
    geo: { lat: 34.86, lng: -84.32 },
    mls: { area: 'Blue Ridge, GA' },
  });
  expect(land.propertyType).toBe('Land');
  expect(usable(land)).toBe(true);

  const noGeo = normalize({ mlsId: 10, listPrice: 100000, property: { type: 'RES', bedrooms: 3 }, address: {}, geo: {} });
  expect(usable(noGeo)).toBe(false);
});
