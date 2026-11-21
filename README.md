# STR Deal Finder

A site that ties into MLS listing data and Airbnb market data to surface the
most valuable short-term-rental investment opportunities.

For every for-sale listing — and every vacant lot — it:

1. finds comparable Airbnb rentals nearby (entire-home, ±1 bedroom, closest
   first, radius widening automatically when comps are thin),
2. estimates achievable **nightly rate** and **occupancy** from those comps,
3. underwrites the deal — revenue, operating expenses, financing — and
4. ranks everything by **cap rate, cash-on-cash return, and a composite
   score**, with an interactive dashboard to explore the results.

Two deal types are underwritten:

- **Existing home** — buy it and rent it out.
- **Land + build** — buy the lot, build a spec house on it (default 4 bd / 2 ba
  at $350,000 all-in, editable), then rent it. Cost basis becomes land price +
  build cost, and comps are matched to the *planned* bedroom count rather than
  the empty lot. The base cost is scaled by a **regional construction cost
  index** (0.88x in Hot Springs, AR to 1.48x in Big Bear Lake, CA), because
  steep mountain and coastal lots cost far more to build on than flat inland
  ones. Switch to a flat cost in the assumptions panel to compare markets on
  land price alone.

### Market selection dominates everything

The single largest driver of whether a short-term rental cash-flows is which
market it's in — mostly property tax rate and the nightly-rate-to-price ratio.
Under the default assumptions a deal needs roughly a **13% gross yield**
(revenue ÷ cost) to break even at Texas property tax rates, but only about
**11%** in Tennessee. The dashboard leads with a per-market rollup for exactly
this reason: dense high-tax urban markets (Houston at 2.2%, Austin at 1.9%)
essentially never pencil as STRs, while low-tax vacation markets routinely do.

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

## Live site

Deployed to GitHub Pages: **https://kirkwarren.github.io/CI_Test/**

The `homepage` field in `package.json` makes Create React App emit assets under
the `/CI_Test/` subpath that Pages serves from. To publish an update:

```bash
npm run build
git worktree add /tmp/ghp gh-pages
cd /tmp/ghp && git rm -rq . && cp -r <repo>/build/. . && touch .nojekyll
git add -A && git commit -m "Deploy" && git push origin gh-pages
git worktree remove /tmp/ghp
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
build time). Without them the site uses the bundled dataset and makes no MLS
request at all.

## Real land listings (default view)

The site opens on **51 real vacant lots for sale** across eight markets
(Gatlinburg, Pigeon Forge/Wears Valley, Sevierville incl. Sky Harbor, Broken
Bow/Hochatown, Bryson City, Hocking Hills, Fort Morgan AL, Joshua Tree CA),
gathered by web search on 2026-11-21. Each is underwritten as a 4 bd / 2 ba
build-to-rent at a flat $350K build cost.

**Revenue comes from published market benchmarks**, not individual comps —
the typical 4-bedroom's annual revenue in that market (AirDNA, BnBCalc,
AirROI, The Short Term Shop, the STR Investing market breakdowns). Each market
uses the most conservative credible 4-bedroom figure available; every figure
and its sources are in `scripts/real-land-data.js` and shown in the app.
Five markets (Blue Ridge, Helen, Hot Springs, Cosby, Townsend) were screened
out before gathering lots because their revenue can't reach break-even at a
$350K build. Coastal markets carry a fixed annual insurance figure (wind and
flood) instead of a percentage of cost, and Alabama rentals are taxed at the
non-homestead rate.

Published revenue (AirDNA's documented definition) **includes guest-paid
cleaning fees and is already net of the platform's host fee**. So for
benchmark-based deals the engine deducts no platform fee, charges management
and maintenance on rental revenue only, and pays turnover cleaning back out.
Comp-based deals are unaffected.

**The finding:** with a full-service manager (typically 20–30% in these
markets), none of the 51 lots reaches 8% cash-on-cash. Self-managed, 19 do,
and the best Gatlinburg lots clear ~15% with breakeven near 35% occupancy
against a ~52% market. Sky Harbor (between Pigeon Forge and Gatlinburg) is
the cheapest cluster that works. Fort Morgan is sunk by land prices and
coastal insurance; Joshua Tree by California tax and softening revenue. Use
the management switch in the app to see both cases.

Caveats: listings are snapshots and several pages were months old (flagged
"may be sold"); short-term-rental status is what the listing or area
reporting said, not a verified zoning determination; locations are
approximate; and benchmark sources disagree widely. Regenerate with
`npm run real-land-data`.

## Data sources

### MLS listings

By default the app uses the **bundled dataset** and does not call any MLS API.
A live feed is opt-in: set real credentials in `.env.local` and the app will
prefer the feed, falling back to the bundled data if it errors or returns
fewer than 10 usable listings.

> The SimplyRETS *demo* feed (`simplyrets`/`simplyrets`) returns only a
> handful of records. It used to be tried first whenever it was reachable,
> which silently replaced the full dataset with ~3 listings for anyone on an
> unrestricted network. It is now behind `REACT_APP_USE_DEMO_MLS=true`.

To point it at a real MLS feed, create `.env.local`:

```bash
REACT_APP_MLS_API_URL=https://api.simplyrets.com/properties
REACT_APP_MLS_API_USER=your_vendor_key
REACT_APP_MLS_API_PASS=your_vendor_secret
```

Any RESO Web API–compatible provider that returns SimplyRETS-shaped JSON works
out of the box; other providers only need a tweak to `normalize()` in
`src/lib/mlsClient.js`. If the feed is unreachable (offline, CORS, bad
credentials) the app falls back to the bundled dataset and says so in the
header badge, which always names the source actually in use.

### Airbnb comps

Comps ship as `public/data/airbnb-comps.json` in the
[Inside Airbnb](https://insideairbnb.com/get-the-data/) schema. The bundled
file is **synthetic sample data** (14,060 comps across the same 37 markets),
calibrated to realistic nightly-rate, occupancy and price relationships rather
than copied from any real scrape. Both datasets live in `public/` and are
fetched at runtime rather than bundled — at ~7 MB raw (0.55 MB gzipped) they
would otherwise dominate the JS bundle. To use real market data, download
`listings.csv` for your city from Inside Airbnb and run:

```bash
npm run import-airbnb -- path/to/listings.csv
```

which regenerates `public/data/airbnb-comps.json` from the real scrape. AirDNA or other
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
- **Expenses** — property tax (at the listing's own market rate when the feed
  supplies one, otherwise a flat fallback), STR insurance, full-service
  management, utilities, maintenance, supplies, and HOA dues.
- **Financing** — standard amortized loan; cash invested = down payment +
  closing costs + furnishing budget. For a build, the loan and all percentage
  costs are taken against land + build cost.
- **Outputs** — gross yield, cap rate, annual cash flow, cash-on-cash return,
  breakeven occupancy, comp-count confidence, and a 0–100 composite score
  used for the default ranking.

Every default lives in `DEFAULT_ASSUMPTIONS` and is editable in the UI.

## Disclaimer

Projections are estimates built from comparable-listing data and user-set
assumptions — not appraisals, not financial advice. The bundled listings and
comps are synthetic samples, not real inventory.

On the build path the regional cost index is a coarse approximation of real
construction costs — it captures the broad spread between markets, not any
individual lot, where slope, access, soil and utility runs dominate. The model
also ignores construction timeline, carrying cost during the build, and
permitting risk entirely, all of which favor buying over building. Treat a
build's returns as the optimistic end of a range.

Verify local short-term-rental regulations, permitting, taxes, HOA rules, and
real market performance before investing.
