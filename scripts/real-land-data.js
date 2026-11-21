#!/usr/bin/env node
/**
 * Real land listings and real short-term-rental market benchmarks, gathered by
 * web search on 2026-11-21 (second pass the same day added Sky Harbor, Fort
 * Morgan and Joshua Tree, and screened out Cosby and Townsend). Writes:
 *
 *   public/data/real-land.json        - vacant lots for sale (SimplyRETS shape)
 *   public/data/real-benchmarks.json  - 4-bedroom STR revenue per market
 *
 * WHAT IS REAL HERE
 *   Every lot's address, asking price, acreage and source link came from a
 *   public listing page or aggregator. Every benchmark figure came from a
 *   published market-data source (AirDNA, BnBCalc, AirROI, The Short Term
 *   Shop, the STR Investing podcast's market breakdowns), cited below.
 *
 * WHAT IS NOT
 *   - Coordinates are approximate (town / subdivision centers). Lots are
 *     underwritten against market benchmarks, not nearby comps, so location
 *     within a market doesn't change the revenue estimate.
 *   - Where a source gives revenue but not both ADR and occupancy, the missing
 *     one is an assumption noted on the benchmark. Revenue drives the results;
 *     ADR/occupancy only shape the breakeven and sensitivity views.
 *   - Listings are snapshots. Several pages were months old when found and may
 *     have sold or changed price; each lot carries a freshness flag.
 *   - Short-term-rental legality is lot-specific. strStatus records what the
 *     listing or area reporting said, not a verified zoning determination.
 *
 * Usage: node scripts/real-land-data.js
 */

const fs = require('fs');
const path = require('path');

const OBSERVED = '2026-11-21';

// ------------------------------------------------------------- benchmarks --
// Rule: use the most conservative credible 4-bedroom revenue figure available
// for the market (a median, or the low end of a published range). Where no
// 4-bedroom figure exists, the market-wide figure is used, which understates a
// 4-bedroom. All figures are treated as including guest-paid cleaning fees, so
// the engine charges turnover cleaning against them.
const BENCHMARKS = [
  {
    market: 'Gatlinburg, TN', revenue: 75000, occupancy: 0.52, confidence: 'Medium',
    basis: 'Low end of the $75K–$100K range published for 4-bedroom homes. AirDNA\'s all-sizes average is $67.2K at 57% occupancy; individual 4BR comp sets run near $100K.',
    assumed: 'Occupancy (52%) assumed within the 48–58% band reported for 4BR Smokies cabins; ADR derived.',
    sources: [
      ['The Short Term Shop — Smoky Mountain STR income', 'https://theshorttermshop.com/smoky-mountain-short-term-rental-income/'],
      ['AirDNA — Gatlinburg revenue', 'https://www.airdna.co/vacation-rental-data/app/us/tennessee/gatlinburg/revenue'],
      ['STR Investing — Gatlinburg market breakdown', 'https://www.buzzsprout.com/2327631/episodes/18532355-monday-market-data-breakdown-of-gatlinburg-tn-market'],
    ],
  },
  {
    market: 'Pigeon Forge, TN', revenue: 69320, occupancy: 0.53, confidence: 'Medium',
    basis: 'BnBCalc average for 4+ bedroom listings (745 listings, data as of Nov 3, 2026). The Short Term Shop puts 4BR at $75K–$100K; AirROI\'s all-sizes average is $51K.',
    assumed: 'Occupancy (53%) assumed at the midpoint of the 48–58% 4BR band; ADR derived.',
    sources: [
      ['BnBCalc — Pigeon Forge', 'https://www.bnbcalc.com/markets/us/sevierville-tn/neighborhoods/pigeon-forge'],
      ['The Short Term Shop — Smoky Mountain STR income', 'https://theshorttermshop.com/smoky-mountain-short-term-rental-income/'],
      ['AirROI — Pigeon Forge', 'https://airroi.com/airbnb-data/united-states/tennessee/pigeon-forge'],
    ],
  },
  {
    market: 'Sevierville, TN', revenue: 65000, occupancy: 0.56, confidence: 'Medium',
    basis: 'Low end of The Short Term Shop\'s $65K–$90K 4-bedroom range. AirDNA\'s all-sizes average is $51.5K (down 5.6% year over year).',
    assumed: 'Occupancy (56%) assumed at the midpoint of the published 52–60% 4BR band; ADR derived.',
    sources: [
      ['The Short Term Shop — Smoky Mountain STR income', 'https://theshorttermshop.com/smoky-mountain-short-term-rental-income/'],
      ['AirDNA — Sevierville overview', 'https://www.airdna.co/vacation-rental-data/app/us/tennessee/sevierville/overview'],
      ['BnBCalc — Sevierville', 'https://www.bnbcalc.com/markets/us/sevierville-tn'],
    ],
  },
  {
    market: 'Broken Bow, OK', revenue: 67788, adr: 474, confidence: 'Medium',
    basis: '4-bedroom median: $67,788 revenue, $474 ADR, 37% occupancy (STR Investing market breakdown; undated). AirDNA all-sizes, Oct 2026: $52.5K at 41% occupancy, $380 ADR.',
    assumed: 'Occupancy derived from revenue ÷ ADR; the breakdown is undated and may predate 2026.',
    sources: [
      ['STR Investing — Broken Bow market breakdown', 'https://www.buzzsprout.com/2327631/episodes/17808436-monday-market-data-breakdown-of-broken-bow-ok-market'],
      ['AirDNA — Broken Bow overview', 'https://www.airdna.co/vacation-rental-data/app/us/oklahoma/broken-bow/overview'],
    ],
  },
  {
    market: 'Bryson City, NC', revenue: 62000, occupancy: 0.45, confidence: 'Low',
    basis: 'BnBCalc average for 4+ bedroom listings, Fontana Lake area, Sept 2026. An average overstates a typical listing, and it is the only 4BR figure found.',
    assumed: 'Occupancy (45%) assumed; no published 4BR occupancy found. ADR derived.',
    sources: [['BnBCalc — Bryson City', 'https://www.bnbcalc.com/markets/us/bryson-city-nc']],
  },
  {
    market: 'Logan, OH', revenue: 54438, occupancy: 0.416, confidence: 'Low',
    basis: 'AirROI market-wide average across all listing sizes (no 4-bedroom figure found), which understates a 4BR. AirDNA reports $54.8K (down 7.6% YoY); AirROI\'s Hocking Hills cabin figure is $55.6K.',
    assumed: 'Uses the all-sizes figure as a conservative stand-in for a 4BR.',
    sources: [
      ['AirROI — Logan', 'https://airroi.com/airbnb-data/united-states/ohio/logan'],
      ['AirDNA — Logan revenue', 'https://www.airdna.co/vacation-rental-data/app/us/ohio/logan/revenue'],
    ],
  },
  {
    market: 'Fort Morgan, AL', revenue: 80000, occupancy: 0.50, confidence: 'Low',
    insuranceAnnual: 11000,
    basis: 'Low end of the $80K–$130K range published for 4-bedroom homes with a pool in Gulf Shores / Fort Morgan; The Short Term Shop\'s 4BR average is $96,190 at 65% occupancy (undated). AirDNA\'s Gulf Shores all-sizes figures: 58% occupancy, $380 ADR.',
    assumed: 'Occupancy (50%) assumed between the 4BR and market figures; ADR derived. Insurance set to a fixed $11,000/yr: Gulf Shores homeowners + wind runs $6K–$8K+ before flood, and one Fort Morgan STR example paid ~$4.8K for flood alone. Get address-specific quotes.',
    sources: [
      ['The Short Term Shop — Gulf Shores income by bedroom', 'https://theshorttermshop.com/gulf-shores-short-term-rental-income-by-bedroom/'],
      ['AirDNA — Gulf Shores revenue', 'https://www.airdna.co/vacation-rental-data/app/us/alabama/gulf-shores/revenue'],
      ['Gulf Shores home insurance guide', 'https://www.1800insurance.com/guides/gulf-shores-home-insurance'],
    ],
  },
  {
    market: 'Joshua Tree, CA', revenue: 63000, adr: 338, confidence: 'Low',
    basis: 'Rabbu average for 4-bedroom homes (~$5,238/month, April 2026 data) — an average, which overstates a typical listing. The market is softening: AirDNA reports revenue down 8.1% and ADR down 12.5% year over year. AirROI\'s all-sizes average is $50,859 at 45.6% occupancy.',
    assumed: 'ADR uses Rabbu\'s 4BR nightly rate for adjacent Yucca Valley ($338); occupancy derived (~51%, near AirDNA\'s 53%).',
    sources: [
      ['Rabbu — Joshua Tree', 'https://rabbu.com/airbnb-data/joshua-tree-ca'],
      ['AirDNA — Joshua Tree revenue', 'https://www.airdna.co/vacation-rental-data/app/us/california/joshua-tree/revenue'],
      ['AirROI — Joshua Tree', 'https://airroi.com/airbnb-data/united-states/california/joshua-tree'],
    ],
  },
  // Screened out before gathering listings: at these revenues a $350K build
  // can't reach break-even yield, so no lots were collected.
  {
    market: 'Blue Ridge, GA', revenue: 48000, occupancy: 0.40, confidence: 'Low', screenedOut: true,
    basis: '4-bedroom median from a market guide of unclear date and authorship.',
    assumed: 'Occupancy assumed; ADR derived.',
    sources: [['STR Investing — Blue Ridge market breakdown', 'https://www.buzzsprout.com/2327631/episodes/18609282-monday-market-data-breakdown-of-blue-ridge-ga-market']],
  },
  {
    market: 'Helen, GA', revenue: 42591, occupancy: 0.40, confidence: 'Medium', screenedOut: true,
    basis: '4-bedroom median $42,591 (75th percentile $58,551) from the STR Investing market breakdown.',
    assumed: 'Occupancy assumed; ADR derived.',
    sources: [['STR Investing — Helen market breakdown', 'https://www.buzzsprout.com/2327631/episodes/18001994-monday-market-data-breakdown-of-helen-ga-market']],
  },
  {
    market: 'Cosby, TN', revenue: 27600, occupancy: 0.47, confidence: 'Low', screenedOut: true,
    basis: 'AirDNA all-sizes average ~$27.6K at 47% occupancy; Rabbu puts 4-bedroom occupancy at only 28%. No 4BR revenue figure found; 5-bedroom cabins average ~$69K.',
    assumed: 'All-sizes figure used; ADR derived.',
    sources: [
      ['AirDNA — Cosby overview', 'https://www.airdna.co/vacation-rental-data/app/us/tennessee/cosby/overview'],
      ['Rabbu — Cosby', 'https://rabbu.com/airbnb-data/cosby-tn'],
    ],
  },
  {
    market: 'Townsend, TN', revenue: 34776, adr: 199, confidence: 'Low', screenedOut: true,
    basis: 'Rabbu all-sizes average $34,776 at a $199 ADR and ~24% current occupancy. No 4BR figure found.',
    assumed: 'All-sizes figure used; occupancy derived.',
    sources: [['Rabbu — Townsend', 'https://rabbu.com/airbnb-data/townsend-tn']],
  },
  {
    market: 'Hot Springs, AR', revenue: 35184, adr: 292, confidence: 'Medium', screenedOut: true,
    basis: '4-bedroom median: $35,184 revenue, $292 ADR, 34% occupancy (STR Investing market breakdown).',
    assumed: 'Occupancy derived from revenue ÷ ADR.',
    sources: [['STR Investing — Hot Springs market breakdown', 'https://www.buzzsprout.com/2327631/episodes/17728202-monday-market-data-breakdown-of-hot-springs-ar-market']],
  },
];

// Approximate effective property tax rates (annual tax ÷ market value).
const TAX = {
  'Gatlinburg, TN': 0.0056, 'Pigeon Forge, TN': 0.0056, 'Sevierville, TN': 0.0056,
  'Broken Bow, OK': 0.0090, 'Bryson City, NC': 0.0072, 'Logan, OH': 0.0148,
  'Blue Ridge, GA': 0.0092, 'Helen, GA': 0.0092, 'Hot Springs, AR': 0.0065,
  // Alabama assesses non-owner-occupied property (rentals) at 20% of value vs
  // 10% for a homestead, so an STR pays roughly double the headline ~0.35%.
  'Fort Morgan, AL': 0.0066,
  // Prop 13 base 1% plus local voter-approved levies.
  'Joshua Tree, CA': 0.0115,
  'Cosby, TN': 0.0056, 'Townsend, TN': 0.0060,
};

// ---------------------------------------------------------------- listings --
// [id, market, address, city, state, zip, price, acres, lat, lng,
//  sourceLabel, sourceUrl, strStatus, freshness, notes]
//
// strStatus: allowed      - listing says rentals/overnight rentals allowed
//            unrestricted - listing says unrestricted (rental use not barred)
//            area         - area/subdivision reported rental-friendly; not lot-specific
//            permit       - allowed only with a permit/zoning approval
//            unconfirmed  - listing doesn't say
// freshness: recent | unknown | stale-risk (page months old; may be sold)
const HOMES_COM_HOCHATOWN = 'https://www.homes.com/hochatown-ok/land-for-sale/';
const ZILLOW_CHALET = 'https://www.zillow.com/chalet-village-gatlinburg-tn/land/';
const TNREA_CHALET = 'https://www.tnrealestate.auction/chalet-village-lots-and-land-for-sale/';
const SHAGBARK_SET = 'https://www.bestsmokymountainrealestate.com/sevierville-homes-for-sale/land/';
const SHAGBARK_NOTE = 'From a Shagbark / English Mountain listing set reported as rental-friendly; exact listing page not confirmed. ';

const L = [
  // ---- Broken Bow / Hochatown, OK ----------------------------------------
  ['RL-BB-01', 'Broken Bow, OK', '401 Hochapine Trail (Lost Creek North, Lot 125)', 'Broken Bow', 'OK', '74728', 159999, 1.69, 34.172, -94.751,
    'Coldwell Banker (MLS# 1247138)', 'https://www.coldwellbanker.com/ok/broken-bow/401-hochapine-trl/lid-P00800000HGcf8KAvp4cnsukOqZZ1FUuiw32Sd5z',
    'allowed', 'unknown', 'Wooded; listing pitches it as a site for an STR cabin.'],
  ['RL-BB-02', 'Broken Bow, OK', '268 Stone Pine Lane', 'Broken Bow', 'OK', '74728', 139000, 1.97, 34.168, -94.748,
    'MyStateMLS #11978819', 'https://www.mystatemls.com/property/268-stone-pine-lane-broken-bow-ok-74728/11978819/',
    'unconfirmed', 'unknown', 'Pond view.'],
  ['RL-BB-03', 'Broken Bow, OK', '26 Mangrove Rd', 'Hochatown', 'OK', '74728', 144000, 1.45, 34.176, -94.756,
    'Homes.com', HOMES_COM_HOCHATOWN, 'unconfirmed', 'recent', 'Recent $6K price drop.'],
  ['RL-BB-04', 'Broken Bow, OK', 'Lot 674, Timber Creek Trails South Ph. XI', 'Broken Bow', 'OK', '74728', 127160, 1.5, 34.160, -94.740,
    'Homes.com', HOMES_COM_HOCHATOWN, 'area', 'recent', 'Recent $60K price drop. Timber Creek Trails lots are marketed for rental cabins.'],
  ['RL-BB-05', 'Broken Bow, OK', 'Lot 719, Timber Creek Trails', 'Broken Bow', 'OK', '74728', 102595, 1.2, 34.161, -94.741,
    'Homes.com', HOMES_COM_HOCHATOWN, 'area', 'unknown', 'Timber Creek Trails lots are marketed for rental cabins.'],
  ['RL-BB-06', 'Broken Bow, OK', 'Eagle Mountain, Lot 13 / 12b', 'Hochatown', 'OK', '74728', 98000, 1.01, 34.180, -94.760,
    'Mossy Oak Properties', 'https://www.mossyoakproperties.com/property/eagle-mountain-hochatown-building-lot-for-sale-mccurtain-county-ok-mccurtain-oklahoma/35726/',
    'unconfirmed', 'stale-risk', 'Listing about a year old, marked as a price drop.'],
  ['RL-BB-07', 'Broken Bow, OK', 'Forested lot (address not published)', 'Hochatown', 'OK', '74728', 59000, 1.01, 34.170, -94.750,
    'Real Estate Broken Bow', 'https://realestatebrokenbow.com/property/broken-bow-land/',
    'allowed', 'unknown', 'Listing describes it as a site for a rental cabin. No address or listing date shown.'],

  // ---- Gatlinburg, TN ---------------------------------------------------
  ['RL-GT-01', 'Gatlinburg, TN', 'Zurich Rd, Chalet Village', 'Gatlinburg', 'TN', '37738', 59990, 0.33, 35.698, -83.540,
    'Zillow — Chalet Village land', ZILLOW_CHALET, 'area', 'stale-risk',
    'Small lot — confirm septic or sewer capacity supports 4 bedrooms.'],
  ['RL-GT-02', 'Gatlinburg, TN', 'Arbon Dr, Chalet Village', 'Gatlinburg', 'TN', '37738', 92000, 1.13, 35.699, -83.542,
    'Zillow — Chalet Village land', ZILLOW_CHALET, 'area', 'stale-risk', ''],
  ['RL-GT-03', 'Gatlinburg, TN', 'Watercress Way, Chalet Village', 'Gatlinburg', 'TN', '37738', 139900, 1.61, 35.700, -83.538,
    'Zillow — Chalet Village land', ZILLOW_CHALET, 'area', 'stale-risk', ''],
  ['RL-GT-04', 'Gatlinburg, TN', 'Cumberland Way, Chalet Village', 'Gatlinburg', 'TN', '37738', 159000, 2.75, 35.697, -83.544,
    'Zillow — Chalet Village land', ZILLOW_CHALET, 'area', 'stale-risk', ''],
  ['RL-GT-05', 'Gatlinburg, TN', 'Crooked Ridge Rd, Chalet Village', 'Gatlinburg', 'TN', '37738', 75000, 0.59, 35.701, -83.541,
    'TNRealEstate.Auction', TNREA_CHALET, 'area', 'stale-risk', 'Described as buildable.'],
  ['RL-GT-06', 'Gatlinburg, TN', 'Lot 19 Laurel Top Way, Chalet Village', 'Gatlinburg', 'TN', '37738', 215000, null, 35.702, -83.539,
    'TNRealEstate.Auction', TNREA_CHALET, 'allowed', 'stale-risk',
    'A separate listing offers lots 19, 43 and 44 together and states overnight rentals are allowed. Acreage not shown.'],
  ['RL-GT-07', 'Gatlinburg, TN', 'Chalet Village lot, 4-bedroom septic approved', 'Gatlinburg', 'TN', '37738', 289000, 0.5, 35.699, -83.537,
    'Homes.com', 'https://www.homes.com/gatlinburg-tn/land-for-sale/p2/', 'area', 'unknown',
    'Price derived from the listed $578K/acre × 0.5 acre. New septic already approved for 4 bedrooms.'],
  ['RL-GT-08', 'Gatlinburg, TN', 'Autumn Lane', 'Gatlinburg', 'TN', '37738', 65000, 1.0, 35.720, -83.500,
    'Smoky Mountain Cabin Sales', 'https://www.smokymountaincabinsales.com/gatlinburg-homes-for-sale/land/',
    'allowed', 'unknown', 'Pitched for an overnight rental.'],
  ['RL-GT-09', 'Gatlinburg, TN', '315 Hilltop Rd', 'Gatlinburg', 'TN', '37738', 159900, 0.23, 35.715, -83.515,
    'LandSearch', 'https://www.landsearch.com/properties/315-hilltop-rd-gatlinburg-tn-37738/5472025',
    'permit', 'recent', 'Zoned R-1; the city says overnight rental may be permitted with the appropriate permits. Public water and sewer.'],
  ['RL-GT-10', 'Gatlinburg, TN', 'Thissa Way, Cobbly Nob', 'Gatlinburg', 'TN', '37738', 63000, 1.28, 35.780, -83.355,
    'TNRealEstate.Auction', 'https://www.tnrealestate.auction/cobbly-nob-real-estate/', 'area', 'stale-risk',
    'Cobbly Nob is ~20 minutes east of Gatlinburg toward Cosby — expect revenue below the Gatlinburg benchmark. Utility water available.'],

  // ---- Pigeon Forge / Wears Valley, TN ----------------------------------
  ['RL-PF-01', 'Pigeon Forge, TN', 'The Homestead in Wears Valley, 0.88-acre lot', 'Sevierville', 'TN', '37862', 137000, 0.88, 35.705, -83.660,
    'Jeremy Sells East Tennessee', 'https://www.jeremysellseasttennessee.com/listings/subdivision/Homestead-In-Wears-Valley/land-for-sale/',
    'allowed', 'recent', 'Repriced from $145,000 to ~$137,000 ($155,682/acre), which suggests it is still active. Overnight rentals permitted in the Homestead. Active septic permit for 5 bedrooms; well and septic still to be installed.'],
  ['RL-PF-03', 'Pigeon Forge, TN', 'Serenity Cove North, 2.74-acre lot', 'Pigeon Forge', 'TN', '37863', 610000, 2.74, 35.770, -83.580,
    'Homes.com — Pigeon Forge land', 'https://www.homes.com/pigeon-forge-tn/land-for-sale/',
    'unconfirmed', 'unknown', 'This listing says overnight rentals are OK and notes past approval for a 6-bedroom septic, but another 2.74-acre listing in the same subdivision says overnight rentals are not allowed. Resolve before relying on it.'],
  ['RL-PF-02', 'Pigeon Forge, TN', '1170 Wears Valley Rd', 'Pigeon Forge', 'TN', '37863', 550000, 1.04, 35.795, -83.570,
    'Zillow (MLS #310468)', 'https://www.zillow.com/homedetails/1170-Wears-Valley-Rd-Pigeon-Forge-TN-37863/460849139_zpid/',
    'unconfirmed', 'unknown', 'Highway frontage with remains of a burned dwelling — priced as a commercial site, not a cabin lot.'],

  // ---- Sevierville, TN (incl. English Mountain, Shagbark) ----------------
  ['RL-SV-01', 'Sevierville, TN', 'Lot 2 Sunset Dr, English Mountain', 'Sevierville', 'TN', '37876', 68966, 2.0, 35.865, -83.290,
    'Homes.com', 'https://www.homes.com/sevierville-tn/land-for-sale/p5/', 'allowed', 'unknown',
    'Price derived from the listed $34,483/acre × ~2 acres. English Mountain is remote from Pigeon Forge; revenue may trail the benchmark.'],
  ['RL-SV-02', 'Sevierville, TN', 'Mary Alice Way (gated community)', 'Sevierville', 'TN', '37876', 69000, 1.0, 35.850, -83.500,
    'Homes.com', 'https://www.homes.com/sevierville-tn/land-for-sale/', 'allowed', 'unknown',
    'Lots of roughly 0.8–1.5 acres at $69K each; described as good for overnight rentals. Owner financing offered.'],
  ['RL-SV-03', 'Sevierville, TN', 'Lot 15 S Boogertown South Rd', 'Sevierville', 'TN', '37876', 60000, 1.5, 35.735, -83.405,
    'Homes.com', 'https://www.homes.com/sevierville-tn/land-for-sale/', 'unrestricted', 'unknown',
    'Unrestricted; pitched for a cabin or vacation rental.'],
  ['RL-SV-04', 'Sevierville, TN', 'Lot 0006 Wildcat Ridge Rd', 'Sevierville', 'TN', '37876', 26000, null, 35.786, -83.640,
    'Smoky Mountain listing set', SHAGBARK_SET, 'area', 'stale-risk', SHAGBARK_NOTE + 'Acreage not shown.'],
  ['RL-SV-05', 'Sevierville, TN', 'Lot 3 Overholt Trail', 'Sevierville', 'TN', '37876', 39000, null, 35.787, -83.641,
    'Smoky Mountain listing set', SHAGBARK_SET, 'area', 'stale-risk', SHAGBARK_NOTE + 'Acreage not shown.'],
  ['RL-SV-06', 'Sevierville, TN', 'Lot 1 Hatcher Mtn Road', 'Sevierville', 'TN', '37876', 40000, null, 35.788, -83.642,
    'Smoky Mountain listing set', SHAGBARK_SET, 'area', 'stale-risk', SHAGBARK_NOTE + 'Acreage not shown.'],
  ['RL-SV-07', 'Sevierville, TN', 'Lot 15 Headrick Lead', 'Sevierville', 'TN', '37876', 45000, 0.74, 35.789, -83.643,
    'Smoky Mountain listing set', SHAGBARK_SET, 'area', 'stale-risk', SHAGBARK_NOTE],
  ['RL-SV-08', 'Sevierville, TN', 'Lot 1 Hatcher Top Rd', 'Sevierville', 'TN', '37876', 60000, 1.07, 35.790, -83.644,
    'Smoky Mountain listing set', SHAGBARK_SET, 'area', 'stale-risk', SHAGBARK_NOTE],
  ['RL-SV-09', 'Sevierville, TN', 'Lot 0013 High Top Loop', 'Sevierville', 'TN', '37876', 79000, null, 35.791, -83.645,
    'Smoky Mountain listing set', SHAGBARK_SET, 'area', 'stale-risk', SHAGBARK_NOTE + 'Described as a ready-to-build approved lot. Acreage not shown.'],
  ['RL-SV-10', 'Sevierville, TN', 'Lot 25R New Center Drive (gated)', 'Sevierville', 'TN', '37876', 129900, 1.38, 35.792, -83.646,
    'Smoky Mountain listing set', SHAGBARK_SET, 'area', 'stale-risk', SHAGBARK_NOTE],
  ['RL-SV-11', 'Sevierville, TN', 'Lot 15 Sunset Road', 'Sevierville', 'TN', '37876', 199900, 5.3, 35.866, -83.291,
    'Smoky Mountain listing set', SHAGBARK_SET, 'area', 'stale-risk', SHAGBARK_NOTE],

  // ---- Sky Harbor (between Pigeon Forge and Gatlinburg) -------------------
  // Sevierville mailing address, so the (lowest) Sevierville benchmark is used;
  // the location may support more.
  ['RL-SH-01', 'Sevierville, TN', 'Lot 483 School House Gap Road, Sky Harbor', 'Sevierville', 'TN', '37862', 45000, 0.37, 35.745, -83.540,
    'Sky Harbor land listings', 'https://www.bestsmokymountainrealestate.com/sky-harbor-homes-for-sale/land/', 'area', 'unknown',
    'Sky Harbor is described as suited to overnight rentals, between Pigeon Forge and Gatlinburg. Another source lists a Sky Harbor lot at ~0.42 ac for the same price. Small lot — confirm septic capacity for 4 bedrooms.'],
  ['RL-SH-02', 'Sevierville, TN', '2404 Bobs Pass, Sky Harbor', 'Sevierville', 'TN', '37862', 49000, null, 35.746, -83.541,
    'Sky Harbor land listings', 'https://www.bestsmokymountainrealestate.com/sky-harbor-homes-for-sale/land/', 'area', 'unknown', 'Acreage not shown.'],
  ['RL-SH-03', 'Sevierville, TN', '1921 Battle Top Rd, Sky Harbor', 'Sevierville', 'TN', '37862', 125000, null, 35.747, -83.542,
    'Sky Harbor land listings', 'https://www.bestsmokymountainrealestate.com/sky-harbor-homes-for-sale/land/', 'area', 'unknown', '4-bedroom septic permit has expired; will need a well. Acreage not shown.'],
  ['RL-SH-04', 'Sevierville, TN', '199 Tsali Way, Sky Harbor', 'Sevierville', 'TN', '37862', 16900, null, 35.748, -83.543,
    'Sky Harbor land listings', 'https://www.bestsmokymountainrealestate.com/sky-harbor-homes-for-sale/land/', 'area', 'unknown', 'Sloping lot "in a growing overnight rental area" — expect real site work. Acreage not shown.'],
  ['RL-SH-05', 'Sevierville, TN', '0 Ridgefield Dr, Sky Harbor', 'Sevierville', 'TN', '37862', 34900, null, 35.749, -83.544,
    'Sky Harbor land listings', 'https://www.bestsmokymountainrealestate.com/sky-harbor-homes-for-sale/land/', 'area', 'unknown', 'Buildable wooded lot. Acreage not shown.'],

  // ---- Fort Morgan / Gulf Shores, AL --------------------------------------
  ['RL-FM-01', 'Fort Morgan, AL', 'W Fort Morgan Rd (MLS 392965), lagoon front', 'Gulf Shores', 'AL', '36542', 400000, 1.79, 30.240, -87.780,
    'Trulia (Baldwin Realtors)', 'https://www.trulia.com/home/0-w-fort-morgan-rd-gulf-shores-al-36542-2100024273', 'unconfirmed', 'unknown',
    'Listed March 6, 2026. 85 feet of frontage on Little Lagoon. Coastal construction (elevation, wind code) likely costs well above $350K.'],
  ['RL-FM-02', 'Fort Morgan, AL', 'Surfside Shores lot, two blocks from the Gulf', 'Gulf Shores', 'AL', '36542', 240000, null, 30.232, -87.760,
    'Engel & Völkers', 'https://www.engelvoelkers.com/us/en/exposes/29ea7663-90cc-5ecb-aad2-2e5d32db6d31', 'allowed', 'unknown',
    'Pitched for a future vacation rental. Acreage not shown.'],
  ['RL-FM-03', 'Fort Morgan, AL', '3488 State Highway 180 (Gulf Beach Subdivision)', 'Gulf Shores', 'AL', '36542', 199900, null, 30.236, -87.770,
    'Homes.com — Fort Morgan land', 'https://www.homes.com/gulf-shores-al/fort-morgan-neighborhood/land-for-sale/', 'unconfirmed', 'unknown', 'Level third-tier lot. Acreage not shown.'],
  ['RL-FM-04', 'Fort Morgan, AL', 'Fort Morgan lot, 6,229 sq ft', 'Gulf Shores', 'AL', '36542', 44100, 0.14, 30.238, -87.790,
    'Zillow — Fort Morgan land', 'https://www.zillow.com/fort-morgan-gulf-shores-al/land/', 'unconfirmed', 'unknown',
    'Unusually cheap for Fort Morgan — check buildability, flood zone and access before anything else.'],
  ['RL-FM-05', 'Fort Morgan, AL', '15640 Fort Morgan Hwy', 'Gulf Shores', 'AL', '36542', 875000, 2.8, 30.230, -87.820,
    'Homes.com — Fort Morgan land', 'https://www.homes.com/gulf-shores-al/fort-morgan-neighborhood/land-for-sale/', 'unconfirmed', 'unknown', ''],

  // ---- Joshua Tree area, CA -----------------------------------------------
  // San Bernardino County (unincorporated) and Yucca Valley both require a
  // short-term rental permit. Desert builds also need well/water, septic and
  // often solar or a utility extension, none of which is in the $350K.
  ['RL-JT-01', 'Joshua Tree, CA', '2.5-acre off-grid lot', 'Joshua Tree', 'CA', '92252', 15995, 2.5, 34.135, -116.310,
    'Landflip', 'https://www.landflip.com/land-fsbo/california/joshua-tree-city', 'permit', 'unknown',
    'Off-grid: no utilities. Budget for solar, water and septic on top of the build.'],
  ['RL-JT-02', 'Joshua Tree, CA', 'Campanula, 2.5 acres', 'Joshua Tree', 'CA', '92252', 29000, 2.5, 34.140, -116.300,
    'Movoto', 'https://www.movoto.com/joshua-tree-ca/land/', 'permit', 'unknown', ''],
  ['RL-JT-03', 'Joshua Tree, CA', '2.5-acre lot, Landers', 'Landers', 'CA', '92285', 15000, 2.5, 34.265, -116.400,
    'LandSearch', 'https://www.landsearch.com/vacant/joshua-tree-ca', 'permit', 'unknown',
    'Landers is ~30 minutes from the park entrance — expect revenue below the Joshua Tree benchmark.'],
  ['RL-JT-04', 'Joshua Tree, CA', '5-acre "Wide-Open Desert Lot"', 'Joshua Tree', 'CA', '92252', 34000, 5.0, 34.150, -116.290,
    'Landflip', 'https://www.landflip.com/land-fsbo/california/joshua-tree-city', 'permit', 'unknown', ''],
  ['RL-JT-05', 'Joshua Tree, CA', 'Cascade Rd, 5 acres', 'Joshua Tree', 'CA', '92252', 35000, 5.0, 34.145, -116.280,
    'Movoto', 'https://www.movoto.com/joshua-tree-ca/land/', 'permit', 'unknown', ''],
  ['RL-JT-06', 'Joshua Tree, CA', 'Sunny Vista Rd, 5 acres', 'Joshua Tree', 'CA', '92252', 57900, 5.0, 34.130, -116.320,
    'Land.com', 'https://www.land.com/Joshua-Tree-CA/all-land/50000-99999/', 'permit', 'recent', 'Recent price drop.'],

  // ---- Bryson City, NC ---------------------------------------------------
  ['RL-BC-01', 'Bryson City, NC', '104 Robin Ln', 'Bryson City', 'NC', '28713', 279000, 11.5, 35.430, -83.450,
    'LandWatch', 'https://www.landwatch.com/north-carolina-land-for-sale/bryson-city/for-sale', 'unrestricted', 'unknown',
    'Unrestricted; marketed for tiny homes, RVs and glamping. Room for more than one rental unit, which a single-build model doesn\'t credit.'],
  ['RL-BC-02', 'Bryson City, NC', '0 Chestnut Cove Rd (Conleys Creek)', 'Bryson City', 'NC', '28713', 372500, 139, 35.450, -83.380,
    'LandWatch', 'https://www.landwatch.com/north-carolina-land-for-sale/bryson-city/for-sale', 'unrestricted', 'unknown',
    'Development-scale tract (139 acres). A single 4BR build badly underuses it; modeled for completeness only.'],

  // ---- Hocking Hills (Logan), OH -----------------------------------------
  ['RL-HH-01', 'Logan, OH', '0 Berry Rd', 'Logan', 'OH', '43138', 449000, 19.99, 39.470, -82.550,
    'Zillow', 'https://www.zillow.com/homedetails/0-Berry-Rd-Logan-OH-43138/443727575_zpid/', 'allowed', 'unknown',
    'Borders an established Airbnb; marketed for one or several STR cabins. A single build underuses it.'],
  ['RL-HH-02', 'Logan, OH', '0 Lilac Ln, Lot 73', 'Logan', 'OH', '43138', 55900, 0.49, 39.540, -82.410,
    'Redfin — Hocking County land', 'https://www.redfin.com/county/2196/OH/Hocking-County/land', 'unconfirmed', 'unknown', ''],
];

const listings = L.map(([id, market, full, city, state, zip, price, acres, lat, lng,
  sourceLabel, sourceUrl, strStatus, freshness, notes]) => ({
  mlsId: id,
  listPrice: price,
  remarks: notes,
  property: { type: 'LND', bedrooms: null, lotSizeAcres: acres, subdivision: market },
  address: { full, city, state, postalCode: zip, country: 'United States' },
  geo: { lat, lng },
  taxRate: TAX[market],
  mls: { status: 'Active', area: market },
  real: { source: sourceLabel, sourceUrl, observed: OBSERVED, strStatus, freshness, notes, geoApprox: true },
}));

const benchmarks = BENCHMARKS.map((b) => {
  const occupancy = b.occupancy ?? b.revenue / (b.adr * 365);
  const adr = b.adr ?? Math.round(b.revenue / (occupancy * 365));
  return {
    market: b.market,
    bedrooms: 4,
    revenue: b.revenue,
    adr,
    occupancy: +occupancy.toFixed(3),
    includesCleaningFees: true,
    confidence: b.confidence,
    screenedOut: !!b.screenedOut,
    basis: b.basis,
    assumed: b.assumed,
    asOf: '2026-11',
    taxRate: TAX[b.market],
    insuranceAnnual: b.insuranceAnnual ?? null,
    sources: b.sources.map(([label, url]) => ({ label, url })),
  };
});

const missing = listings.filter((l) => !benchmarks.some((b) => b.market === l.mls.area));
if (missing.length) throw new Error(`No benchmark for: ${missing.map((l) => l.mlsId).join(', ')}`);

const out = path.join(__dirname, '..', 'public', 'data');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'real-land.json'), JSON.stringify(listings, null, 1) + '\n');
fs.writeFileSync(path.join(out, 'real-benchmarks.json'), JSON.stringify(benchmarks, null, 1) + '\n');

const markets = new Set(listings.map((l) => l.mls.area));
console.log(`Wrote ${listings.length} real land listings across ${markets.size} markets, ` +
  `and ${benchmarks.length} market benchmarks (${benchmarks.filter((b) => b.screenedOut).length} screened out).`);
