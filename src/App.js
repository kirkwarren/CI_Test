import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Home, Database, AlertTriangle } from 'lucide-react';
import { fetchListings } from './lib/mlsClient';
import { rankOpportunities, DEFAULT_ASSUMPTIONS } from './lib/analysis';
import { money, pct, num } from './lib/format';
import airbnbComps from './data/airbnbComps.json';
import StatTile from './components/StatTile';
import Filters from './components/Filters';
import AssumptionsPanel from './components/AssumptionsPanel';
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
  const [feed, setFeed] = useState(null); // {listings, source, error?}
  const [assumptions, setAssumptions] = useState({ ...DEFAULT_ASSUMPTIONS });
  const [filters, setFilters] = useState({
    maxPrice: null,
    minBeds: 0,
    neighborhood: '',
    minCapRate: null,
    positiveOnly: false,
  });
  const [selected, setSelected] = useState(null);
  const detailRef = useRef(null);

  useEffect(() => {
    let alive = true;
    fetchListings().then((f) => alive && setFeed(f));
    return () => {
      alive = false;
    };
  }, []);

  // Underwrite everything once per (feed, assumptions); filter afterwards so
  // filter changes are instant.
  const allDeals = useMemo(
    () => (feed ? rankOpportunities(feed.listings, airbnbComps, assumptions) : []),
    [feed, assumptions]
  );

  const deals = useMemo(
    () =>
      allDeals.filter((d) => {
        const f = filters;
        if (f.maxPrice && d.listing.price > f.maxPrice) return false;
        if (f.minBeds && d.listing.beds < f.minBeds) return false;
        if (f.neighborhood && d.listing.neighborhood !== f.neighborhood) return false;
        if (f.minCapRate !== null && d.capRate * 100 < f.minCapRate) return false;
        if (f.positiveOnly && d.cashFlow < 0) return false;
        return true;
      }),
    [allDeals, filters]
  );

  const neighborhoods = useMemo(
    () =>
      [...new Set(allDeals.map((d) => d.listing.neighborhood).filter(Boolean))].sort(),
    [allDeals]
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Home size={20} style={{ color: 'var(--series-1)' }} />
            STR Deal Finder
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            For-sale MLS listings, underwritten as short-term rentals against
            nearby Airbnb comps and ranked by projected return.
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
                {num(airbnbComps.length)} Airbnb comps
              </span>
            ) : (
              <span>
                Bundled sample data · {num(feed.listings.length)} listings ·{' '}
                {num(airbnbComps.length)} comps (MLS feed unreachable)
              </span>
            )}
          </div>
        )}
      </header>

      {!feed ? (
        <div className="card p-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Loading listings…
        </div>
      ) : (
        <>
          <Filters filters={filters} onChange={setFilters} neighborhoods={neighborhoods} />
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
              sub="NOI ÷ purchase price"
            />
            <StatTile
              label="Median cash-on-cash"
              value={pct(median(deals.map((d) => d.cashOnCash)))}
              sub="annual cash flow ÷ cash in"
            />
            <StatTile
              label="Median projected revenue"
              value={money(median(deals.map((d) => d.grossRevenue)), { compact: true })}
              sub="gross, per year"
            />
          </div>

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
              assumptions above — not financial advice. Airbnb comp data
              {feed.source === 'sample'
                ? ' and listings shown are illustrative samples; '
                : ' is a static snapshot; '}
              verify local short-term-rental regulations, taxes, and actual
              market performance before investing.
            </span>
          </footer>
        </>
      )}
    </div>
  );
}
