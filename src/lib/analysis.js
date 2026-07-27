/**
 * Investment analysis engine.
 *
 * For each for-sale listing, finds comparable Airbnb rentals nearby, estimates
 * achievable nightly rate + occupancy from them, then underwrites the deal
 * (revenue, operating expenses, financing) and scores it so the best
 * opportunities rank first.
 *
 * Two deal types are supported:
 *   'existing' - buy a standing home and rent it out
 *   'build'    - buy a vacant lot and build a spec house on it, then rent it.
 *                Cost basis is land price + build cost, and comps are matched
 *                against the planned bedroom count rather than the lot.
 */

export const DEFAULT_ASSUMPTIONS = {
  downPaymentPct: 0.20,      // of cost basis
  interestRate: 0.065,       // 30-year fixed APR
  loanYears: 30,
  closingCostPct: 0.03,      // of cost basis
  furnishingPerBedroom: 5000, // one-time setup cost per bedroom (plus base)
  furnishingBase: 6000,
  managementPct: 0.20,       // of gross revenue (full-service STR management)
  platformFeePct: 0.03,      // host-side booking platform fee
  maintenancePct: 0.05,      // of gross revenue
  suppliesPct: 0.03,         // of gross revenue (consumables, restocking)
  utilitiesMonthlyBase: 220, // scaled up with bedrooms
  utilitiesPerBedroom: 60,
  insurancePctOfPrice: 0.008, // STR policy, annual
  propertyTaxPct: 0.022,     // fallback when a listing carries no market rate
  useMarketTaxRate: true,    // prefer the listing's own market tax rate
  occupancyHaircut: 0.05,    // shave comp-implied occupancy for conservatism
  // Build-to-rent spec, used for vacant-land deals.
  buildCost: 350000,         // all-in construction cost
  buildBeds: 4,
  buildBaths: 2,
};

const EARTH_KM = 6371;
export function distanceKm(lat1, lng1, lat2, lng2) {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.sqrt(a));
}

function median(nums) {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function isLand(listing) {
  return listing.propertyType === 'Land';
}

/** Effective property tax rate for a listing under the given assumptions. */
export function taxRateFor(listing, a) {
  if (a.useMarketTaxRate && listing.taxRate != null) return listing.taxRate;
  return a.propertyTaxPct;
}

/**
 * Resolves what is actually being underwritten: an existing home, or a lot
 * plus a planned build. Returns the bedroom count to comp against and the
 * total cost basis.
 */
export function dealBasis(listing, a = DEFAULT_ASSUMPTIONS) {
  if (isLand(listing)) {
    return {
      dealType: 'build',
      beds: a.buildBeds,
      baths: a.buildBaths,
      landPrice: listing.price,
      buildCost: a.buildCost,
      basis: listing.price + a.buildCost,
    };
  }
  return {
    dealType: 'existing',
    beds: listing.beds,
    baths: listing.baths,
    landPrice: null,
    buildCost: 0,
    basis: listing.price,
  };
}

/**
 * Comps for a target: entire-home Airbnbs within `radiusKm` whose bedroom
 * count is within 1 of the target's (long-term-stay listings excluded).
 * The radius widens once if too few matches are found.
 *
 * `target` needs { lat, lng, beds } - for a build deal that's the lot's
 * coordinates and the planned bedroom count.
 */
export function findComps(target, airbnb, { radiusKm = 3, minComps = 5 } = {}) {
  const beds = target.beds;
  const eligible = airbnb.filter(
    (c) =>
      c.room_type === 'Entire home/apt' &&
      c.minimum_nights <= 7 &&
      c.price > 0 &&
      Math.abs((c.bedrooms ?? 1) - beds) <= 1
  );
  const withDist = eligible
    .map((c) => ({
      ...c,
      distanceKm: distanceKm(target.lat, target.lng, c.latitude, c.longitude),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  let comps = withDist.filter((c) => c.distanceKm <= radiusKm);
  if (comps.length < minComps) comps = withDist.filter((c) => c.distanceKm <= radiusKm * 2);
  return comps.slice(0, 25);
}

/**
 * Estimate nightly rate + occupancy from comps. Exact-bedroom comps carry
 * double weight; occupancy is inferred from calendar availability
 * (occupied share = 1 - availability_365/365), which for Inside Airbnb data
 * is an upper-ish bound - hence the configurable haircut.
 */
export function estimateRevenue(beds, comps, assumptions) {
  if (comps.length === 0) return null;
  const weighted = [];
  for (const c of comps) {
    const weight = c.bedrooms === beds ? 2 : 1;
    for (let i = 0; i < weight; i++) weighted.push(c);
  }
  const adr = median(weighted.map((c) => c.price));
  const rawOcc = median(weighted.map((c) => 1 - c.availability_365 / 365));
  const occupancy = Math.max(0.2, Math.min(0.95, rawOcc - assumptions.occupancyHaircut));
  const nightsBooked = Math.round(occupancy * 365);
  return { adr, occupancy, nightsBooked, grossRevenue: adr * nightsBooked };
}

export function monthlyMortgagePayment(principal, annualRate, years) {
  const r = annualRate / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

/** Full underwriting for one listing. Returns null when no comps exist. */
export function underwrite(listing, airbnb, assumptions = DEFAULT_ASSUMPTIONS) {
  const a = assumptions;
  const basisInfo = dealBasis(listing, a);
  const { beds, basis } = basisInfo;
  if (!beds || !basis) return null;

  const comps = findComps({ lat: listing.lat, lng: listing.lng, beds }, airbnb);
  const rev = estimateRevenue(beds, comps, a);
  if (!rev) return null;

  const taxRate = taxRateFor(listing, a);
  const effectiveRevenue = rev.grossRevenue * (1 - a.platformFeePct);
  const expenses = {
    'Property tax': basis * taxRate,
    Insurance: basis * a.insurancePctOfPrice,
    Management: rev.grossRevenue * a.managementPct,
    Utilities: (a.utilitiesMonthlyBase + a.utilitiesPerBedroom * beds) * 12,
    Maintenance: rev.grossRevenue * a.maintenancePct,
    Supplies: rev.grossRevenue * a.suppliesPct,
    HOA: (listing.hoaMonthly || 0) * 12,
  };
  const operatingExpenses = Object.values(expenses).reduce((s, v) => s + v, 0);
  const noi = effectiveRevenue - operatingExpenses;

  const downPayment = basis * a.downPaymentPct;
  const loanAmount = basis - downPayment;
  const annualDebtService =
    monthlyMortgagePayment(loanAmount, a.interestRate, a.loanYears) * 12;
  const setupCost = a.furnishingBase + a.furnishingPerBedroom * beds;
  const cashInvested = downPayment + basis * a.closingCostPct + setupCost;

  const cashFlow = noi - annualDebtService;
  const capRate = noi / basis;
  const cashOnCash = cashFlow / cashInvested;
  const grossYield = rev.grossRevenue / basis;

  // Occupancy at which cash flow is exactly zero, holding ADR constant.
  const fixedCosts =
    expenses['Property tax'] + expenses.Insurance + expenses.Utilities +
    expenses.HOA + annualDebtService;
  const variablePctOfGross =
    a.platformFeePct + a.managementPct + a.maintenancePct + a.suppliesPct;
  const breakevenOccupancy = Math.min(
    1.5,
    fixedCosts / (rev.adr * 365 * (1 - variablePctOfGross))
  );

  const confidence =
    comps.length >= 12 ? 'High' : comps.length >= 6 ? 'Medium' : 'Low';

  // Composite 0-100 score: cash-on-cash return does most of the work, cap
  // rate and comp confidence temper it. Scaled so strong real-world deals
  // (~35% CoC, ~14% cap) land in the low 90s rather than pinning at 100 —
  // a cap that's easy to hit would flatten the ranking across the top deals.
  const confFactor = { High: 1, Medium: 0.9, Low: 0.75 }[confidence];
  const score = Math.max(
    0,
    Math.min(100, (cashOnCash * 180 + capRate * 200) * confFactor)
  );

  return {
    listing,
    comps,
    ...basisInfo,
    ...rev,
    taxRate,
    effectiveRevenue,
    expenses,
    operatingExpenses,
    noi,
    downPayment,
    setupCost,
    cashInvested,
    annualDebtService,
    cashFlow,
    capRate,
    cashOnCash,
    grossYield,
    breakevenOccupancy,
    confidence,
    score,
  };
}

/** Underwrite every listing and rank best-first. */
export function rankOpportunities(listings, airbnb, assumptions = DEFAULT_ASSUMPTIONS) {
  return listings
    .map((l) => underwrite(l, airbnb, assumptions))
    .filter(Boolean)
    .sort((x, y) => y.score - x.score);
}

/** Cash flow across an occupancy sweep, for the sensitivity chart. */
export function occupancySensitivity(deal, assumptions = DEFAULT_ASSUMPTIONS) {
  const a = assumptions;
  const points = [];
  for (let occ = 0.3; occ <= 0.901; occ += 0.05) {
    const gross = deal.adr * 365 * occ;
    const variable =
      gross * (a.platformFeePct + a.managementPct + a.maintenancePct + a.suppliesPct);
    const fixed =
      deal.expenses['Property tax'] + deal.expenses.Insurance +
      deal.expenses.Utilities + deal.expenses.HOA;
    points.push({
      occupancy: Math.round(occ * 100),
      cashFlow: Math.round(gross - variable - fixed - deal.annualDebtService),
    });
  }
  return points;
}

/** Per-market rollup, so the weakest and strongest markets are obvious. */
export function marketSummary(deals) {
  const byMarket = new Map();
  for (const d of deals) {
    const key = d.listing.market || d.listing.city || 'Unknown';
    if (!byMarket.has(key)) byMarket.set(key, []);
    byMarket.get(key).push(d);
  }
  return [...byMarket.entries()]
    .map(([market, ds]) => ({
      market,
      count: ds.length,
      positive: ds.filter((d) => d.cashFlow > 0).length,
      medianCapRate: median(ds.map((d) => d.capRate)),
      medianCashOnCash: median(ds.map((d) => d.cashOnCash)),
      medianGrossYield: median(ds.map((d) => d.grossYield)),
      taxRate: ds[0].taxRate,
    }))
    .sort((a, b) => b.medianCashOnCash - a.medianCashOnCash);
}
