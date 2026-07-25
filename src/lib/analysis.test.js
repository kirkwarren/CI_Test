import {
  DEFAULT_ASSUMPTIONS,
  distanceKm,
  findComps,
  monthlyMortgagePayment,
  rankOpportunities,
  underwrite,
} from './analysis';
import listingsRaw from '../data/sampleListings.json';
import airbnb from '../data/airbnbComps.json';

const listings = listingsRaw.map((r) => ({
  id: String(r.mlsId),
  price: r.listPrice,
  address: r.address.full,
  city: r.address.city,
  state: r.address.state,
  zip: r.address.postalCode,
  neighborhood: r.property.subdivision,
  beds: r.property.bedrooms,
  baths: r.property.bathsFull,
  sqft: r.property.area,
  yearBuilt: r.property.yearBuilt,
  propertyType: r.property.type,
  hoaMonthly: r.association?.fee || 0,
  lat: r.geo.lat,
  lng: r.geo.lng,
}));

test('distanceKm is ~0 for identical points and sane for known pairs', () => {
  expect(distanceKm(29.76, -95.36, 29.76, -95.36)).toBeCloseTo(0);
  // Houston downtown to Heights is roughly 5-7 km.
  const d = distanceKm(29.757, -95.362, 29.7905, -95.3979);
  expect(d).toBeGreaterThan(3);
  expect(d).toBeLessThan(9);
});

test('monthlyMortgagePayment matches a known amortization', () => {
  // $320k at 6.5% over 30 years ≈ $2,022.62/mo.
  expect(monthlyMortgagePayment(320000, 0.065, 30)).toBeCloseTo(2022.62, 0);
});

test('findComps returns nearby entire-home comps with similar bedrooms', () => {
  const listing = listings[0];
  const comps = findComps(listing, airbnb);
  expect(comps.length).toBeGreaterThan(0);
  for (const c of comps) {
    expect(c.room_type).toBe('Entire home/apt');
    expect(Math.abs(c.bedrooms - listing.beds)).toBeLessThanOrEqual(1);
    expect(c.distanceKm).toBeLessThanOrEqual(6);
  }
});

test('underwrite produces internally consistent economics', () => {
  const deal = underwrite(listings[0], airbnb, DEFAULT_ASSUMPTIONS);
  expect(deal).not.toBeNull();
  expect(deal.adr).toBeGreaterThan(0);
  expect(deal.occupancy).toBeGreaterThan(0.2);
  expect(deal.occupancy).toBeLessThan(0.95);
  expect(deal.grossRevenue).toBeCloseTo(deal.adr * deal.nightsBooked, 0);
  expect(deal.noi).toBeCloseTo(deal.effectiveRevenue - deal.operatingExpenses, 4);
  expect(deal.cashFlow).toBeCloseTo(deal.noi - deal.annualDebtService, 4);
  expect(deal.capRate).toBeCloseTo(deal.noi / deal.listing.price, 6);
  expect(deal.cashOnCash).toBeCloseTo(deal.cashFlow / deal.cashInvested, 6);
});

test('rankOpportunities covers the sample set and sorts best-first', () => {
  const deals = rankOpportunities(listings, airbnb, DEFAULT_ASSUMPTIONS);
  expect(deals.length).toBe(listings.length);
  for (let i = 1; i < deals.length; i++) {
    expect(deals[i - 1].score).toBeGreaterThanOrEqual(deals[i].score);
  }
});
