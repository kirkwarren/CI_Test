import {
  DEFAULT_ASSUMPTIONS,
  occupancySensitivity,
  revenueFromBenchmark,
  buildCompIndex,
  buildCostFor,
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
  buildCostIndex: r.buildCostIndex ?? null,
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
  // Build cost is scaled by the lot's market, so compare against the
  // effective cost rather than the flat base.
  const effectiveBuild = buildCostFor(lot, a);
  const basis = dealBasis(lot, a);
  expect(basis.dealType).toBe('build');
  expect(basis.beds).toBe(a.buildBeds);
  expect(basis.basis).toBe(lot.price + effectiveBuild);

  const deal = underwrite(lot, airbnb, a);
  expect(deal).not.toBeNull();
  expect(deal.dealType).toBe('build');
  expect(deal.basis).toBe(lot.price + effectiveBuild);
  expect(deal.landPrice).toBe(lot.price);
  expect(deal.buildCost).toBe(effectiveBuild);
  // Comps must match the planned build, not the (bedroom-less) lot.
  expect(deal.beds).toBe(a.buildBeds);
  for (const c of deal.comps) {
    expect(Math.abs(c.bedrooms - a.buildBeds)).toBeLessThanOrEqual(1);
  }
  // Tax and insurance accrue on the completed value, not just the dirt.
  expect(deal.expenses['Property tax']).toBeCloseTo(deal.basis * deal.taxRate, 4);
  expect(deal.capRate).toBeCloseTo(deal.noi / deal.basis, 6);
});

test('build cost scales by market, and the flat override restores the base', () => {
  const a = DEFAULT_ASSUMPTIONS;
  const expensive = lots.find((l) => l.market === 'Gatlinburg, TN');
  const cheap = lots.find((l) => l.market === 'Broken Bow, OK');
  expect(expensive.buildCostIndex).toBeGreaterThan(1);
  expect(cheap.buildCostIndex).toBeLessThan(1);

  // The same spec costs materially more to build on a steep Smokies lot.
  expect(buildCostFor(expensive, a)).toBeGreaterThan(buildCostFor(cheap, a));
  expect(buildCostFor(expensive, a)).toBe(Math.round(a.buildCost * expensive.buildCostIndex));

  // Opting out returns every market to the flat base cost.
  const flat = { ...a, useMarketBuildCost: false };
  expect(buildCostFor(expensive, flat)).toBe(a.buildCost);
  expect(buildCostFor(cheap, flat)).toBe(a.buildCost);

  // A listing with no index (e.g. a real MLS feed) falls back to the base.
  expect(buildCostFor({ buildCostIndex: null }, a)).toBe(a.buildCost);
});

test('the regional index flows into the deal basis', () => {
  const lot = lots.find((l) => l.market === 'Gatlinburg, TN');
  const scaled = underwrite(lot, airbnb, DEFAULT_ASSUMPTIONS);
  const flat = underwrite(lot, airbnb, { ...DEFAULT_ASSUMPTIONS, useMarketBuildCost: false });
  expect(scaled.buildCost).toBeGreaterThan(flat.buildCost);
  expect(scaled.basis).toBe(lot.price + scaled.buildCost);
  // A costlier build on identical revenue must rank worse.
  expect(scaled.capRate).toBeLessThan(flat.capRate);
  expect(scaled.score).toBeLessThan(flat.score);
});

test('raising the build cost worsens a build deal', () => {
  const lot = lots[0];
  const flat = { ...DEFAULT_ASSUMPTIONS, useMarketBuildCost: false };
  const cheap = underwrite(lot, airbnb, { ...flat, buildCost: 350000 });
  const dear = underwrite(lot, airbnb, { ...flat, buildCost: 600000 });
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

// ---- benchmark-based underwriting (real listings) -------------------------
const BENCH = {
  market: 'Test, TN', revenue: 75000, adr: 395, occupancy: 0.52,
  includesCleaningFees: true, confidence: 'Medium', sources: [],
};
const realLot = {
  id: 'T1', price: 60000, address: 'Lot 1', market: 'Test, TN', propertyType: 'Land',
  beds: null, lat: 35.7, lng: -83.5, taxRate: 0.0056, hoaMonthly: 0,
  buildCostIndex: null, benchmark: BENCH,
};

test('a benchmark lot is underwritten from published revenue, not comps', () => {
  const a = DEFAULT_ASSUMPTIONS;
  const d = underwrite(realLot, buildCompIndex([]), a);
  expect(d).not.toBeNull();
  expect(d.revenueSource).toBe('benchmark');
  expect(d.comps).toEqual([]);
  expect(d.grossRevenue).toBe(75000);
  // No availability haircut: published revenue already reflects real occupancy.
  expect(d.occupancy).toBe(0.52);
  expect(d.confidence).toBe('Medium');
  // Flat $350K build when the lot carries no regional index.
  expect(d.basis).toBe(60000 + a.buildCost);
});

test('benchmark revenue is not double-charged the platform fee or management on cleaning', () => {
  const a = DEFAULT_ASSUMPTIONS;
  const d = underwrite(realLot, buildCompIndex([]), a);
  const nights = Math.round(0.52 * 365);
  const cleaning = (a.cleaningCostPerStay / a.avgStayNights) * nights;
  // Published revenue is already net of the platform's host fee.
  expect(d.effectiveRevenue).toBe(75000);
  expect(d.expenses.Cleaning).toBeCloseTo(cleaning, 6);
  // Managers take a cut of rental revenue, not of the cleaning fees inside it.
  expect(d.expenses.Management).toBeCloseTo((75000 - cleaning) * a.managementPct, 6);
  expect(d.expenses.Maintenance).toBeCloseTo((75000 - cleaning) * a.maintenancePct, 6);
  expect(d.noi).toBeCloseTo(d.effectiveRevenue - d.operatingExpenses, 6);
});

test('comp-based deals are unaffected: platform fee applies and cleaning nets to zero', () => {
  const d = underwrite(homes[0], airbnb, DEFAULT_ASSUMPTIONS);
  expect(d.revenueSource).toBe('comps');
  expect(d.expenses.Cleaning).toBe(0);
  expect(d.effectiveRevenue).toBeCloseTo(d.grossRevenue * (1 - DEFAULT_ASSUMPTIONS.platformFeePct), 6);
  expect(d.expenses.Management).toBeCloseTo(d.grossRevenue * DEFAULT_ASSUMPTIONS.managementPct, 6);
});

test('breakeven occupancy agrees with the sensitivity sweep', () => {
  for (const deal of [underwrite(realLot, buildCompIndex([]), DEFAULT_ASSUMPTIONS),
                      underwrite(homes[0], airbnb, DEFAULT_ASSUMPTIONS)]) {
    const pts = occupancySensitivity(deal, DEFAULT_ASSUMPTIONS);
    const be = deal.breakevenOccupancy * 100;
    for (const pt of pts) {
      // Cash flow is negative below breakeven and positive above it.
      if (pt.occupancy < be - 0.5) expect(pt.cashFlow).toBeLessThan(0);
      if (pt.occupancy > be + 0.5) expect(pt.cashFlow).toBeGreaterThan(0);
    }
  }
});

test('self-managing improves a benchmark deal by the management fee it saves', () => {
  const full = underwrite(realLot, buildCompIndex([]), { ...DEFAULT_ASSUMPTIONS, managementPct: 0.25 });
  const self = underwrite(realLot, buildCompIndex([]), { ...DEFAULT_ASSUMPTIONS, managementPct: 0.05 });
  expect(self.cashFlow - full.cashFlow).toBeCloseTo(full.rentalRevenue * 0.2, 6);
});

test('revenueFromBenchmark derives the missing ADR or rejects an empty benchmark', () => {
  expect(revenueFromBenchmark({ revenue: 36500, occupancy: 0.5 }).adr).toBe(200);
  expect(revenueFromBenchmark(null)).toBeNull();
  expect(revenueFromBenchmark({ revenue: 0, occupancy: 0.5 })).toBeNull();
});
