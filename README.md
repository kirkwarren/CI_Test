# STR Deal Finder

A site that ties into MLS listing data and Airbnb market data to surface the
most valuable short-term-rental investment opportunities.

For every active for-sale listing it:

1. finds comparable Airbnb rentals nearby (entire-home, ±1 bedroom, closest
   first, radius widening automatically when comps are thin),
2. estimates achievable **nightly rate** and **occupancy** from those comps,
3. underwrites the deal — revenue, operating expenses, financing — and
4. ranks everything by **cap rate, cash-on-cash return, and a composite
   score**, with an interactive dashboard to explore the results.

Click any dot or table row to open the full underwriting for that property:
where the money goes, cash flow across an occupancy sweep with the breakeven
point, and the actual Airbnb comps behind the estimate. Underwriting
assumptions (down payment, rate, management fee, tax rate, occupancy haircut,
…) are all editable and re-score every deal instantly.

## Running it

```bash
npm install
npm start          # dev server at http://localhost:3000
npm test           # smoke tests
npm run build      # production bundle in build/
```

## Deploying to Vercel

The repo is Vercel-ready (`vercel.json` pins the Create React App build).
Either:

- **Dashboard:** [vercel.com/new](https://vercel.com/new) → import
  `kirkwarren/CI_Test` → under "Git Branch" pick the branch to deploy →
  Deploy. No settings changes needed.
- **CLI:** from a local checkout, `npx vercel --prod`.

To have the deployed site use a real MLS feed, add
`REACT_APP_MLS_API_URL` / `REACT_APP_MLS_API_USER` / `REACT_APP_MLS_API_PASS`
as environment variables in the Vercel project settings (they are inlined at
build time). Without them the site uses the public SimplyRETS demo feed and
falls back to the bundled sample data if that's unreachable.

## Data sources

### MLS listings

On load the app fetches active listings from the **SimplyRETS demo API** — a
public, RESO-standard MLS test feed (Houston, TX). To point it at a real MLS
feed, create `.env.local`:

```bash
REACT_APP_MLS_API_URL=https://api.simplyrets.com/properties
REACT_APP_MLS_API_USER=your_vendor_key
REACT_APP_MLS_API_PASS=your_vendor_secret
```

Any RESO Web API–compatible provider that returns SimplyRETS-shaped JSON works
out of the box; other providers only need a tweak to `normalize()` in
`src/lib/mlsClient.js`. If the feed is unreachable (offline, CORS, bad
credentials) the app falls back to a bundled sample dataset and says so in the
header badge.

### Airbnb comps

Comps ship as `src/data/airbnbComps.json` in the
[Inside Airbnb](https://insideairbnb.com/get-the-data/) schema. The bundled
file is a **synthetic but realistic Houston sample** (Inside Airbnb does not
publish Houston). To use real market data, download `listings.csv` for your
city from Inside Airbnb and run:

```bash
npm run import-airbnb -- path/to/listings.csv
```

which regenerates `airbnbComps.json` from the real scrape. AirDNA or other
exports work too if mapped to the same fields. Occupancy is inferred from
calendar availability (`1 − availability_365/365`), which overstates true
occupancy — that's what the configurable *occupancy haircut* assumption is
for.

To regenerate the bundled sample data (deterministic, seeded):

```bash
npm run generate-sample-data
```

## How the analysis works

`src/lib/analysis.js` is the whole engine, UI-free and unit-testable:

- **Comps** — entire-home listings with short minimum stays, within 3 km
  (doubling once if fewer than 5 match), bedrooms within ±1 of the subject;
  exact-bedroom comps get double weight.
- **Revenue** — weighted-median nightly rate × estimated occupancy × 365,
  less a platform fee.
- **Expenses** — property tax, STR insurance, full-service management,
  utilities, maintenance, supplies, and HOA dues from the listing itself.
- **Financing** — standard amortized loan; cash invested = down payment +
  closing costs + furnishing budget.
- **Outputs** — gross yield, cap rate, annual cash flow, cash-on-cash return,
  breakeven occupancy, comp-count confidence, and a 0–100 composite score
  used for the default ranking.

Every default lives in `DEFAULT_ASSUMPTIONS` and is editable in the UI.

## Disclaimer

Projections are estimates built from comparable-listing data and user-set
assumptions — not appraisals, not financial advice. Verify local short-term-
rental regulations, taxes, HOA rules, and real market performance before
investing.
