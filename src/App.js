import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Home, Database, AlertTriangle } from 'lucide-react';
import { fetchListings } from './lib/mlsClient';
import { fetchComps } from './lib/airbnbClient';
import {
  buildCompIndex,
  rankOpportunities,
  marketSummary,
  DEFAULT_ASSUMPTIONS,
} from './lib/analysis';
import { money, pct, num } from './lib/format';
import StatTile from './components/StatTile';
import Filters from './components/Filters';
import AssumptionsPanel from './components/AssumptionsPanel';
import MarketTable from './components/MarketTable';
import OpportunityScatter from './components/OpportunityScatter';
import OpportunityTable from './components/OpportunityTable';
import DealDetail from './components/DealDetail';

function median(nums) {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export default function App() {
  const [feed, setFeed] = useState(null); // {listings, comps, source, error?}
  const [assumptions, setAssumptions] = useState({ ...DEFAULT_ASSUMPTIONS });
  const [filters, setFilters] = useState({
    market: '',
    dealType: '',
    maxPrice: null,
    minBeds: 0,
    minCapRate: null,
    positiveOnly: false,
  });
  const [selected, setSelected] = useState(null);
  const detailRef = useRef(null);

  useEffect(() => {
    let alive = true;
    // Listings and comps are independent fetches; load them together.
    Promise.all([fetchListings(), fetchComps()]).then(([l, c]) => {
      if (!alive) return;
      setFeed({ ...l, comps: c.comps, compsError: c.error });
    });
    return () => {
      alive = false;
    };
  }, []);

  // Index the comps once per dataset, not once per underwriting pass — comp
  // lookup is otherwise O(listings x comps) and dominates every re-run.
  const compIndex = useMemo(
    () => (feed?.comps?.length ? buildCompIndex(feed.comps) : null),
    [feed]
  );

  // Underwrite everything once per (feed, assumptions); filter afterwards so
  // filter changes are instant.
  const allDeals = useMemo(
    () => (feed && compIndex ? rankOpportunities(feed.listings, compIndex, assumptions) : []),
    [feed, compIndex, assumptions]
  );

  const deals = useMemo(
    () =>
      allDeals.filter((d) => {
        const f = filters;
        if (f.market && d.listing.market !== f.market) return false;
        if (f.dealType && d.dealType !== f.dealType) return false;
        if (f.maxPrice && d.basis > f.maxPrice) return false;
        if (f.minBeds && d.beds < f.minBeds) return false;
        if (f.minCapRate !== null && d.capRate * 100 < f.minCapRate) return false;
        if (f.positiveOnly && d.cashFlow < 0) return false;
        return true;
      }),
    [allDeals, filters]
  );

  const markets = useMemo(
    () => [...new Set(allDeals.map((d) => d.listing.market).filter(Boolean))].sort(),
    [allDeals]
  );

  // Market rollup always reflects the full dataset, not the market filter —
  // it's the thing you use to pick a market in the first place.
  const marketRows = useMemo(
    () =>
      marketSummary(
        allDeals.filter((d) => !filters.dealType || d.dealType === filters.dealType)
      ),
    [allDeals, filters.dealType]
  );

  // Keep the detail panel pointed at a deal that still exists under the
  // current filters/assumptions.
  const selectedDeal =
    (selected && deals.find((d) => d.listing.id === selected)) || null;

  const openDeal = (deal) => {
    if (!deal) return;
    setSelected(deal.listing.id);
    setTimeout(
      () => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }),
      50
    );
  };

  const positive = deals.filter((d) => d.cashFlow > 0).length;
  const bestCoC = deals.length ? Math.max(...deals.map((d) => d.cashOnCash)) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Home size={20} style={{ color: 'var(--series-1)' }} />
            STR Deal Finder
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            MLS listings and vacant land{markets.length ? ` across ${markets.length} markets` : ''},
            underwritten as short-term rentals against nearby Airbnb comps and
            ranked by projected return.
          </p>
        </div>
        {feed && (
          <div
            className="card px-3 py-2 text-xs flex items-center gap-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Database size={13} />
            {feed.source === 'live' ? (
              <span>
                Live MLS feed · {num(feed.listings.length)} listings ·{' '}
                {num(feed.comps.length)} Airbnb comps
              </span>
            ) : (
              <span>
                Bundled sample data · {num(feed.listings.length)} listings ·{' '}
                {num(feed.comps.length)} comps across {num(markets.length)} markets
              </span>
            )}
          </div>
        )}
      </header>

      {!feed ? (
        <div className="card p-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Loading listings and comps…
        </div>
      ) : !feed.listings.length || !feed.comps.length ? (
        <div className="card p-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            Couldn't load the dataset.
          </p>
          <p>{feed.error || feed.compsError}</p>
        </div>
      ) : (
        <>
          <Filters filters={filters} onChange={setFilters} markets={markets} />
          <AssumptionsPanel assumptions={assumptions} onChange={setAssumptions} />

          <div className="flex gap-3 flex-wrap">
            <StatTile
              label="Deals analyzed"
              value={num(deals.length)}
              sub={`${num(positive)} cash-flow positive`}
            />
            <StatTile
              label="Median cap rate"
              value={pct(median(deals.map((d) => d.capRate)))}
              sub="NOI ÷ all-in cost"
            />
            <StatTile
              label="Median cash-on-cash"
              value={pct(median(deals.map((d) => d.cashOnCash)))}
              sub="annual cash flow ÷ cash in"
            />
            <StatTile
              label="Best cash-on-cash"
              value={pct(bestCoC)}
              sub="top deal in this slice"
            />
            <StatTile
              label="Median projected revenue"
              value={money(median(deals.map((d) => d.grossRevenue)), { compact: true })}
              sub="gross, per year"
            />
          </div>

          <MarketTable
            markets={marketRows}
            selectedMarket={filters.market}
            onSelect={(m) => setFilters((f) => ({ ...f, market: m }))}
          />

          <OpportunityScatter
            deals={deals}
            selectedId={selectedDeal?.listing.id}
            onSelect={openDeal}
          />

          <OpportunityTable
            deals={deals}
            selectedId={selectedDeal?.listing.id}
            onSelect={openDeal}
          />

          <div ref={detailRef}>
            {selectedDeal && (
              <DealDetail
                deal={selectedDeal}
                assumptions={assumptions}
                onClose={() => setSelected(null)}
              />
            )}
          </div>

          <footer
            className="text-xs flex items-start gap-2 pb-4"
            style={{ color: 'var(--text-muted)' }}
          >
            <AlertTriangle size={13} className="shrink-0 mt-0.5" />
            <span>
              Projections are estimates from comparable-listing data and the
              assumptions above — not financial advice. Listings and Airbnb comps
              shown here are{' '}
              {feed.source === 'sample'
                ? `synthetic samples across ${markets.length} markets, calibrated to realistic price, nightly-rate, occupancy and property-tax relationships`
                : 'a live MLS feed against a static comp snapshot'}
              . Build deals apply one flat construction cost to every market,
              which flatters low-cost-to-build markets. Verify local
              short-term-rental regulations, permitting, taxes, and actual market
              performance before investing.
            </span>
          </footer>
        </>
      )}
    </div>
  );
}
