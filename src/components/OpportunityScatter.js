import React from 'react';
import { money, pct } from '../lib/format';
import ChartTooltip from './ChartTooltip';
import ScatterPlot from './charts/ScatterPlot';

const TOP_N = 10;

/**
 * Purchase price vs projected annual Airbnb revenue for every deal that
 * passed the filters. Emphasis form: the top-scored deals wear the accent
 * hue, the rest recede to gray. Clicking a dot selects the deal.
 */
export default function OpportunityScatter({ deals, selectedId, onSelect }) {
  const points = deals.map((d, i) => ({
    id: d.listing.id,
    x: d.listing.price,
    y: Math.round(d.grossRevenue),
    fill: i < TOP_N ? 'var(--series-1)' : 'var(--de-emphasis)',
    data: d,
  }));

  return (
    <div className="card p-4">
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-1">
        <h2 className="text-sm font-semibold">
          Price vs. projected Airbnb revenue
        </h2>
        <div className="flex gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ background: 'var(--series-1)' }}
            />
            Top {Math.min(TOP_N, points.length)} by score
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ background: 'var(--de-emphasis)' }}
            />
            Other listings
          </span>
        </div>
      </div>
      <ScatterPlot
        height={340}
        points={points}
        xFormat={(v) => money(v, { compact: true })}
        yFormat={(v) => money(v, { compact: true })}
        xLabel="List price"
        selectedId={selectedId}
        onPointClick={(p) => onSelect(p.data)}
        renderTooltip={(p) => (
          <ChartTooltip
            title={p.data.listing.address}
            rows={[
              ['List price', money(p.data.listing.price)],
              ['Projected revenue', money(p.data.grossRevenue)],
              ['Cap rate', pct(p.data.capRate)],
              ['Cash-on-cash', pct(p.data.cashOnCash)],
            ]}
          />
        )}
      />
      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
        Every value shown here is also in the table below. Click a dot to open
        the full underwriting for that property.
      </p>
    </div>
  );
}
