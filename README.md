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
  the empty lot.

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
build time). Without them the site uses the public SimplyRETS demo feed and
falls back to the bundled sample data if that's unreachable.

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

Comps ship as `src/data/airbnbComps.json` in the
[Inside Airbnb](https://insideairbnb.com/get-the-data/) schema. The bundled
file is **synthetic sample data** (1,900 comps across the same ten markets),
calibrated to realistic nightly-rate, occupancy and price relationships rather
than copied from any real scrape. To use real market data, download
`listings.csv` for your city from Inside Airbnb and run:

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

Two caveats worth stressing on the build path: a single flat build cost is
applied to every market, which flatters cheap-to-build ones (a 4 bd cabin in
Gatlinburg realistically runs well above $350k), and the model ignores
construction timeline, carrying cost during the build, and permitting risk
entirely. Raise the build cost per market to test it honestly.

Verify local short-term-rental regulations, permitting, taxes, HOA rules, and
real market performance before investing.
