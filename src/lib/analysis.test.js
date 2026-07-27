import {
  DEFAULT_ASSUMPTIONS,
  buildCompIndex,
  dealBasis,
  distanceKm,
  findComps,
  isLand,
  marketSummary,
  monthlyMortgagePayment,
  rankOpportunities,
  taxRateFor,
  underwrite,
} from './analysis';
import fs from 'fs';
import path from 'path';

// The datasets live in public/data (served as static JSON, never bundled), so
// read them from disk rather than importing them as modules.
const readData = (name) =>
  JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'public', 'data', name), 'utf8'));

const listingsRaw = readData('listings.json');
const airbnb = readData('airbnb-comps.json');

const TYPES = { CND: 'Condo', LND: 'Land', RES: 'Single family' };

const listings = listingsRaw.map((r) => ({
  id: String(r.mlsId),
  price: r.listPrice,
  address: r.address.full,
  city: r.address.city,
  state: r.address.state,
  zip: r.address.postalCode,
  market: r.mls.area,
  neighborhood: r.property.subdivision,
  beds: r.property.bedrooms,
  baths: r.property.bathsFull,
  sqft: r.property.area,
  lotAcres: r.property.lotSizeAcres ?? null,
  yearBuilt: r.property.yearBuilt,
  propertyType: TYPES[r.property.type],
  hoaMonthly: r.association?.fee || 0,
  taxRate: r.taxRate,
  lat: r.geo.lat,
  lng: r.geo.lng,
}));

const homes = listings.filter((l) => l.propertyType !== 'Land');
const lots = listings.filter((l) => l.propertyType === 'Land');

test('distanceKm is ~0 for identical points and sane for known pairs', () => {
  expect(distanceKm(29.76, -95.36, 29.76, -95.36)).toBeCloseTo(0);
  // Gatlinburg to Sevierville is roughly 15-25 km.
  const d = distanceKm(35.714, -83.511, 35.868, -83.562);
  expect(d).toBeGreaterThan(10);
  expect(d).toBeLessThan(30);
});

test('monthlyMortgagePayment matches a known amortization', () => {
  // $320k at 6.5% over 30 years ~ $2,022.62/mo.
  expect(monthlyMortgagePayment(320000, 0.065, 30)).toBeCloseTo(2022.62, 0);
});

test('the sample set spans many markets and both deal types', () => {
  expect(new Set(listings.map((l) => l.market)).size).toBeGreaterThanOrEqual(30);
  expect(homes.length).toBeGreaterThan(3000);
  expect(lots.length).toBeGreaterThan(500);
});

test('the comp index buckets only eligible comps and finds the same set as a scan', () => {
  const index = buildCompIndex(airbnb);
  const indexed = [...index.cells.values()].reduce((n, b) => n + b.length, 0);
  const eligible = airbnb.filter(
    (c) => c.room_type === 'Entire home/apt' && c.minimum_nights <= 7 && c.price > 0
  );
  expect(indexed).toBe(eligible.length);
  expect(indexed).toBeLessThan(airbnb.length); // private rooms etc. excluded

  // The index must not change results — only how fast they're reached.
  for (const l of [homes[0], homes[1500], homes[3000], lots[0], lots[400]]) {
    const target = { lat: l.lat, lng: l.lng, beds: l.beds ?? DEFAULT_ASSUMPTIONS.buildBeds };
    const viaIndex = findComps(target, index).map((c) => c.id);
    const viaScan = findComps(target, airbnb).map((c) => c.id);
    expect(viaIndex).toEqual(viaScan);
  }
});

test('every listing gets comps at this dataset size', () => {
  const deals = rankOpportunities(listings, airbnb, DEFAULT_ASSUMPTIONS);
  expect(deals.length).toBe(listings.length);
});

test('findComps returns nearby entire-home comps with similar bedrooms', () => {
  const l = homes[0];
  const comps = findComps({ lat: l.lat, lng: l.lng, beds: l.beds }, airbnb);
  expect(comps.length).toBeGreaterThan(0);
  for (const c of comps) {
    expect(c.room_type).toBe('Entire home/apt');
    expect(Math.abs(c.bedrooms - l.beds)).toBeLessThanOrEqual(1);
    expect(c.distanceKm).toBeLessThanOrEqual(6);
  }
});

test('taxRateFor prefers the market rate but honors a flat override', () => {
  const l = homes[0];
  expect(taxRateFor(l, DEFAULT_ASSUMPTIONS)).toBe(l.taxRate);
  const flat = { ...DEFAULT_ASSUMPTIONS, useMarketTaxRate: false, propertyTaxPct: 0.03 };
  expect(taxRateFor(l, flat)).toBe(0.03);
  // A listing with no market rate falls back to the assumption.
  expect(taxRateFor({ taxRate: null }, DEFAULT_ASSUMPTIONS)).toBe(
    DEFAULT_ASSUMPTIONS.propertyTaxPct
  );
});

test('underwrite produces internally consistent economics', () => {
  const deal = underwrite(homes[0], airbnb, DEFAULT_ASSUMPTIONS);
  expect(deal).not.toBeNull();
  expect(deal.dealType).toBe('existing');
  expect(deal.adr).toBeGreaterThan(0);
  expect(deal.occupancy).toBeGreaterThan(0.2);
  expect(deal.occupancy).toBeLessThan(0.95);
  expect(deal.grossRevenue).toBeCloseTo(deal.adr * deal.nightsBooked, 0);
  expect(deal.noi).toBeCloseTo(deal.effectiveRevenue - deal.operatingExpenses, 4);
  expect(deal.cashFlow).toBeCloseTo(deal.noi - deal.annualDebtService, 4);
  expect(deal.capRate).toBeCloseTo(deal.noi / deal.basis, 6);
  expect(deal.cashOnCash).toBeCloseTo(deal.cashFlow / deal.cashInvested, 6);
  expect(deal.basis).toBe(deal.listing.price);
});

test('land is underwritten as land price + build cost against build-spec comps', () => {
  const lot = lots[0];
  expect(isLand(lot)).toBe(true);

  const a = DEFAULT_ASSUMPTIONS;
  const basis = dealBasis(lot, a);
  expect(basis.dealType).toBe('build');
  expect(basis.beds).toBe(a.buildBeds);
  expect(basis.basis).toBe(lot.price + a.buildCost);

  const deal = underwrite(lot, airbnb, a);
  expect(deal).not.toBeNull();
  expect(deal.dealType).toBe('build');
  expect(deal.basis).toBe(lot.price + a.buildCost);
  expect(deal.landPrice).toBe(lot.price);
  expect(deal.buildCost).toBe(a.buildCost);
  // Comps must match the planned build, not the (bedroom-less) lot.
  expect(deal.beds).toBe(a.buildBeds);
  for (const c of deal.comps) {
    expect(Math.abs(c.bedrooms - a.buildBeds)).toBeLessThanOrEqual(1);
  }
  // Tax and insurance accrue on the completed value, not just the dirt.
  expect(deal.expenses['Property tax']).toBeCloseTo(deal.basis * deal.taxRate, 4);
  expect(deal.capRate).toBeCloseTo(deal.noi / deal.basis, 6);
});

test('raising the build cost worsens a build deal', () => {
  const lot = lots[0];
  const cheap = underwrite(lot, airbnb, { ...DEFAULT_ASSUMPTIONS, buildCost: 350000 });
  const dear = underwrite(lot, airbnb, { ...DEFAULT_ASSUMPTIONS, buildCost: 600000 });
  expect(dear.basis).toBeGreaterThan(cheap.basis);
  expect(dear.capRate).toBeLessThan(cheap.capRate);
  expect(dear.cashFlow).toBeLessThan(cheap.cashFlow);
});

test('rankOpportunities covers every listing and sorts best-first', () => {
  const deals = rankOpportunities(listings, airbnb, DEFAULT_ASSUMPTIONS);
  expect(deals.length).toBe(listings.length);
  for (let i = 1; i < deals.length; i++) {
    expect(deals[i - 1].score).toBeGreaterThanOrEqual(deals[i].score);
  }
  // Scores must not saturate at the cap, or the top of the ranking flattens.
  expect(deals.filter((d) => d.score >= 100).length).toBe(0);
});

test('high-tax urban markets underperform low-tax vacation markets', () => {
  const rows = marketSummary(rankOpportunities(listings, airbnb, DEFAULT_ASSUMPTIONS));
  const byName = Object.fromEntries(rows.map((r) => [r.market, r]));
  expect(byName['Houston, TX'].medianCashOnCash).toBeLessThan(
    byName['Gatlinburg, TN'].medianCashOnCash
  );
  expect(rows.length).toBeGreaterThanOrEqual(30);
  // Rollup is sorted by cash-on-cash, best first.
  for (let i = 1; i < rows.length; i++) {
    expect(rows[i - 1].medianCashOnCash).toBeGreaterThanOrEqual(rows[i].medianCashOnCash);
  }
});
