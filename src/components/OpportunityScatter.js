import React from 'react';
import { money, pct } from '../lib/format';
import ChartTooltip from './ChartTooltip';
import ScatterPlot from './charts/ScatterPlot';

/**
 * All-in cost vs projected annual Airbnb revenue for every deal that passed
 * the filters, colored by whether it's an existing home or a land + build.
 * Two categorical series (palette slots 1 and 2); clicking a dot selects
 * the deal.
 */
export default function OpportunityScatter({ deals, selectedId, onSelect }) {
  const points = deals.map((d) => ({
    id: d.listing.id,
    x: Math.round(d.basis),
    y: Math.round(d.grossRevenue),
    fill: d.dealType === 'build' ? 'var(--series-2)' : 'var(--series-1)',
    data: d,
  }));

  const builds = deals.filter((d) => d.dealType === 'build').length;

  return (
    <div className="card p-4">
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-1">
        <h2 className="text-sm font-semibold">All-in cost vs. projected Airbnb revenue</h2>
        <div className="flex gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ background: 'var(--series-1)' }}
            />
            Existing home ({deals.length - builds})
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ background: 'var(--series-2)' }}
            />
            Land + build ({builds})
          </span>
        </div>
      </div>
      <ScatterPlot
        height={340}
        points={points}
        xFormat={(v) => money(v, { compact: true })}
        yFormat={(v) => money(v, { compact: true })}
        xLabel="All-in cost (purchase, or land + build)"
        selectedId={selectedId}
        onPointClick={(p) => onSelect(p.data)}
        renderTooltip={(p) => (
          <ChartTooltip
            title={p.data.listing.address}
            rows={[
              [p.data.dealType === 'build' ? 'Land + build' : 'Purchase price', money(p.data.basis)],
              ['Market', p.data.listing.market],
              ['Projected revenue', money(p.data.grossRevenue)],
              ['Cap rate', pct(p.data.capRate)],
              ['Cash-on-cash', pct(p.data.cashOnCash)],
            ]}
          />
        )}
      />
      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
        Points above the pack for their cost are the opportunities. Every value
        here is also in the table below — click a dot for full underwriting.
      </p>
    </div>
  );
}
