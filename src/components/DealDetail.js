import React from 'react';
import { X, Hammer } from 'lucide-react';
import { money, pct, num } from '../lib/format';
import { occupancySensitivity } from '../lib/analysis';
import ChartTooltip from './ChartTooltip';
import HBarChart from './charts/HBarChart';
import LineChart from './charts/LineChart';
import ScatterPlot from './charts/ScatterPlot';

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-xs font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}

// Market names already carry their state ("Gatlinburg, TN"), so only append
// the state when it isn't there already.
function locationLine(l) {
  const base = l.market || l.city || '';
  const hasState = l.state && new RegExp(`,\\s*${l.state}$`).test(base);
  const head = hasState ? base : [base, l.state].filter(Boolean).join(', ');
  return [head, l.zip].filter(Boolean).join(' ');
}

function Row({ label, value, strong, color }) {
  return (
    <div
      className={`flex justify-between gap-4 py-1 text-xs ${strong ? 'font-semibold' : ''}`}
      style={{ borderBottom: '1px solid var(--grid)' }}
    >
      <span style={{ color: strong ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
        {label}
      </span>
      <span className="num" style={color ? { color } : undefined}>
        {value}
      </span>
    </div>
  );
}

/** Full underwriting view for one selected deal. */
export default function DealDetail({ deal, assumptions, onClose }) {
  const { listing } = deal;
  const isBuild = deal.dealType === 'build';

  const costRows = [
    ...Object.entries(deal.expenses)
      .filter(([, v]) => v > 0)
      .map(([name, v]) => ({ name, value: Math.round(v) })),
    { name: 'Mortgage (P&I)', value: Math.round(deal.annualDebtService) },
  ].sort((a, b) => b.value - a.value);

  const sensitivity = occupancySensitivity(deal, assumptions).map((p) => ({
    x: p.occupancy,
    y: p.cashFlow,
  }));

  const compPoints = deal.comps.map((c) => ({
    id: c.id,
    x: +c.distanceKm.toFixed(2),
    y: c.price,
    fill: c.bedrooms === deal.beds ? 'var(--series-1)' : 'var(--de-emphasis)',
    r: 4.5,
    data: c,
  }));

  return (
    <div className="card p-4 md:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold flex items-center gap-2">
            {isBuild && <Hammer size={15} style={{ color: 'var(--series-2)' }} />}
            {listing.address}
          </h2>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {locationLine(listing)} ·{' '}
            {isBuild ? (
              <>
                {listing.lotAcres ?? '—'} acre lot · planned build {deal.beds} bd /{' '}
                {deal.baths} ba
              </>
            ) : (
              <>
                {listing.beds} bd / {listing.baths ?? '—'} ba ·{' '}
                {listing.sqft ? `${num(listing.sqft)} sqft · ` : ''}
                {listing.propertyType}
                {listing.yearBuilt ? ` · built ${listing.yearBuilt}` : ''}
              </>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close detail"
          className="p-1 rounded hover:opacity-70"
          style={{ color: 'var(--text-muted)' }}
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-4">
        <Section title="The deal, in numbers">
          {isBuild ? (
            <>
              <Row label="Land price" value={money(deal.landPrice)} />
              <Row label={`Build cost (${deal.beds} bd / ${deal.baths} ba)`} value={money(deal.buildCost)} />
              <Row label="All-in cost basis" value={money(deal.basis)} strong />
            </>
          ) : (
            <Row label="List price" value={money(listing.price)} />
          )}
          <Row label={`Down payment (${pct(assumptions.downPaymentPct, 0)})`} value={money(deal.downPayment)} />
          <Row label="Furnishing & setup" value={money(deal.setupCost)} />
          <Row label="Total cash invested" value={money(deal.cashInvested)} strong />
          <Row label="Est. nightly rate" value={money(deal.adr)} />
          <Row label="Est. occupancy" value={`${pct(deal.occupancy, 0)} (${deal.nightsBooked} nights)`} />
          <Row label="Gross revenue / yr" value={money(deal.grossRevenue)} strong />
          <Row label="Operating expenses / yr" value={money(deal.operatingExpenses)} />
          <Row label="Net operating income" value={money(deal.noi)} />
          <Row label="Debt service / yr" value={money(deal.annualDebtService)} />
          <Row
            label="Cash flow / yr"
            value={money(deal.cashFlow)}
            strong
            color={deal.cashFlow >= 0 ? 'var(--good)' : 'var(--bad)'}
          />
          <Row label="Cap rate" value={pct(deal.capRate)} />
          <Row label="Cash-on-cash return" value={pct(deal.cashOnCash)} strong />
          <Row label="Breakeven occupancy" value={pct(deal.breakevenOccupancy, 0)} />
          <Row label="Property tax rate" value={pct(deal.taxRate, 2)} />
          <Row label="Comp confidence" value={`${deal.confidence} (${deal.comps.length} comps)`} />
        </Section>

        <Section title="Where the money goes (annual)">
          <HBarChart rows={costRows} format={(v) => money(v, { compact: true })} />
        </Section>

        <Section title="Cash flow vs. occupancy">
          <LineChart
            height={220}
            data={sensitivity}
            xFormat={(v) => `${v}%`}
            yFormat={(v) => money(v, { compact: true })}
            refX={Math.round(deal.occupancy * 100)}
            refXLabel="est."
            renderTooltip={(p) => (
              <ChartTooltip
                title={`${p.x}% occupancy`}
                rows={[['Annual cash flow', money(p.y)]]}
              />
            )}
          />
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Breaks even at {pct(deal.breakevenOccupancy, 0)} occupancy, holding
            the {money(deal.adr)} nightly rate constant.
          </p>
        </Section>

        <Section title={`Airbnb comps (${deal.comps.length})`}>
          <ScatterPlot
            height={220}
            points={compPoints}
            xFormat={(v) => `${v} km`}
            yFormat={(v) => money(v)}
            xLabel="Distance from property"
            refY={deal.adr}
            refYLabel={`est. ${money(deal.adr)}/night`}
            renderTooltip={(p) => (
              <ChartTooltip
                title={p.data.name}
                rows={[
                  ['Nightly rate', money(p.data.price)],
                  ['Bedrooms', p.data.bedrooms],
                  ['Occupancy', pct(1 - p.data.availability_365 / 365, 0)],
                  ['Reviews', num(p.data.number_of_reviews)],
                ]}
              />
            )}
          />
          <div className="flex gap-4 text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: 'var(--series-1)' }} />
              Same bedrooms ({deal.beds})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: 'var(--de-emphasis)' }} />
              ±1 bedroom
            </span>
          </div>
        </Section>
      </div>
    </div>
  );
}
