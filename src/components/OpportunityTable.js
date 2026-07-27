import React, { useState } from 'react';
import { ArrowUpDown, Hammer } from 'lucide-react';
import { money, pct } from '../lib/format';

const COLUMNS = [
  { key: 'rank', label: '#', sortable: false },
  { key: 'address', label: 'Property', sortable: false },
  { key: 'basis', label: 'All-in', get: (d) => d.basis, fmt: (d) => money(d.basis) },
  {
    key: 'beds',
    label: 'Bd/Ba',
    get: (d) => d.beds,
    fmt: (d) => `${d.beds}/${d.baths ?? '—'}`,
  },
  { key: 'adr', label: 'Est. nightly', get: (d) => d.adr, fmt: (d) => money(d.adr) },
  { key: 'occupancy', label: 'Occupancy', get: (d) => d.occupancy, fmt: (d) => pct(d.occupancy, 0) },
  { key: 'grossYield', label: 'Gross yield', get: (d) => d.grossYield, fmt: (d) => pct(d.grossYield) },
  { key: 'capRate', label: 'Cap rate', get: (d) => d.capRate, fmt: (d) => pct(d.capRate) },
  { key: 'cashOnCash', label: 'Cash-on-cash', get: (d) => d.cashOnCash, fmt: (d) => pct(d.cashOnCash) },
  { key: 'cashFlow', label: 'Cash flow /yr', get: (d) => d.cashFlow, fmt: (d) => money(d.cashFlow) },
  { key: 'score', label: 'Score', get: (d) => d.score, fmt: (d) => d.score.toFixed(0) },
];

/** Ranked deals. This table is also the accessible twin of the charts. */
export default function OpportunityTable({ deals, selectedId, onSelect }) {
  const [sort, setSort] = useState({ key: 'score', dir: -1 });
  const [limit, setLimit] = useState(50);

  const sorted = [...deals];
  const col = COLUMNS.find((c) => c.key === sort.key);
  if (col?.get) sorted.sort((a, b) => (col.get(a) - col.get(b)) * sort.dir);
  const shown = sorted.slice(0, limit);

  const toggleSort = (key) =>
    setSort((s) => ({ key, dir: s.key === key ? -s.dir : -1 }));

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-xs whitespace-nowrap">
        <thead>
          <tr
            className="text-left"
            style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--grid)' }}
          >
            {COLUMNS.map((c) => (
              <th key={c.key} className="px-3 py-2.5 font-medium">
                {c.sortable === false ? (
                  c.label
                ) : (
                  <button
                    className="flex items-center gap-1 hover:opacity-70"
                    onClick={() => toggleSort(c.key)}
                    title={`Sort by ${c.label}`}
                  >
                    {c.label}
                    <ArrowUpDown size={11} style={{ opacity: sort.key === c.key ? 1 : 0.35 }} />
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shown.map((d) => {
            const rank = sorted.indexOf(d) + 1;
            const selected = d.listing.id === selectedId;
            const isBuild = d.dealType === 'build';
            return (
              <tr
                key={d.listing.id}
                tabIndex={0}
                onClick={() => onSelect(d)}
                onKeyDown={(e) => e.key === 'Enter' && onSelect(d)}
                className="cursor-pointer"
                style={{
                  borderBottom: '1px solid var(--grid)',
                  background: selected ? 'var(--accent-wash)' : 'transparent',
                }}
              >
                <td className="px-3 py-2 num" style={{ color: 'var(--text-muted)' }}>
                  {rank}
                </td>
                <td className="px-3 py-2">
                  <div className="font-medium flex items-center gap-1.5">
                    {isBuild && (
                      <Hammer size={11} style={{ color: 'var(--series-2)' }} aria-label="Land + build" />
                    )}
                    {d.listing.address}
                  </div>
                  <div style={{ color: 'var(--text-muted)' }}>
                    {d.listing.market} ·{' '}
                    {isBuild
                      ? `${d.listing.lotAcres ?? '—'} ac land ${money(d.landPrice, { compact: true })} + build ${money(d.buildCost, { compact: true })}`
                      : d.listing.propertyType}
                  </div>
                </td>
                {COLUMNS.slice(2).map((c) => (
                  <td
                    key={c.key}
                    className="px-3 py-2 num"
                    style={
                      c.key === 'cashFlow'
                        ? { color: d.cashFlow >= 0 ? 'var(--good)' : 'var(--bad)' }
                        : undefined
                    }
                  >
                    {c.fmt(d)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {deals.length === 0 && (
        <div className="p-6 text-sm text-center" style={{ color: 'var(--text-muted)' }}>
          No listings match the current filters.
        </div>
      )}
      {deals.length > limit && (
        <div className="p-3 text-center">
          <button
            className="text-xs px-3 py-1.5 rounded-lg hover:opacity-70"
            style={{ border: '1px solid var(--baseline)', color: 'var(--text-secondary)' }}
            onClick={() => setLimit((l) => l + 100)}
          >
            Show more — {deals.length - limit} of {deals.length} not shown
          </button>
        </div>
      )}
    </div>
  );
}
