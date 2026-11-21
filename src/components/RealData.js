import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { money, pct } from '../lib/format';

// Lot-level short-term-rental status, as the listing or area reporting stated
// it — not a verified zoning determination.
export const STR_LABELS = {
  allowed: 'Rentals allowed',
  unrestricted: 'Unrestricted',
  area: 'Rental-friendly area',
  permit: 'Permit required',
  unconfirmed: 'STR status unconfirmed',
};

export const FRESHNESS_LABELS = {
  recent: 'Recently listed',
  unknown: 'Listing date unknown',
  'stale-risk': 'May be sold — page is months old',
};

const WARN_STR = new Set(['unconfirmed', 'permit']);

/** Small neutral pill; meaning is always carried by the text, never color. */
export function Pill({ children, warn }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-1.5 py-px text-[10px] leading-4 whitespace-nowrap"
      style={{ border: '1px solid var(--baseline)', color: 'var(--text-secondary)' }}
    >
      {warn && <AlertTriangle size={9} aria-hidden="true" />}
      {children}
    </span>
  );
}

export function StatusPills({ real }) {
  if (!real) return null;
  return (
    <span className="inline-flex flex-wrap gap-1">
      <Pill warn={WARN_STR.has(real.strStatus)}>{STR_LABELS[real.strStatus] || real.strStatus}</Pill>
      {real.freshness !== 'unknown' && (
        <Pill warn={real.freshness === 'stale-risk'}>{FRESHNESS_LABELS[real.freshness]}</Pill>
      )}
    </span>
  );
}

export function SourceLink({ href, children, className = '' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center gap-1 underline decoration-dotted underline-offset-2 hover:opacity-70 ${className}`}
      style={{ color: 'var(--text-secondary)' }}
    >
      {children}
      <ExternalLink size={10} aria-hidden="true" />
    </a>
  );
}

/** Listing provenance block for the deal detail view. */
export function ListingProvenance({ real }) {
  if (!real) return null;
  return (
    <div
      className="mt-3 rounded-lg px-3 py-2 text-xs flex flex-col gap-1.5"
      style={{ background: 'var(--accent-wash)', color: 'var(--text-secondary)' }}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <SourceLink href={real.sourceUrl}>Listing: {real.source}</SourceLink>
        <span>Found {real.observed}</span>
        <StatusPills real={real} />
      </div>
      {real.notes && <div style={{ color: 'var(--text-primary)' }}>{real.notes}</div>}
      <div>
        Verify before offering: the listing is still active, short-term rentals are permitted on
        this specific lot (zoning, HOA and deed covenants), and septic or sewer capacity supports
        4 bedrooms. Location shown is approximate.
      </div>
    </div>
  );
}

/** Replaces the comp scatter for deals underwritten against a market benchmark. */
export function BenchmarkPanel({ deal }) {
  const b = deal.benchmark;
  return (
    <div className="text-xs flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-2">
        {[
          ['4BR revenue', money(b.revenue)],
          ['Nightly rate', money(b.adr)],
          ['Occupancy', pct(b.occupancy, 0)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg px-2 py-1.5" style={{ border: '1px solid var(--grid)' }}>
            <div style={{ color: 'var(--text-muted)' }}>{label}</div>
            <div className="font-semibold num" style={{ color: 'var(--text-primary)' }}>{value}</div>
          </div>
        ))}
      </div>
      <p style={{ color: 'var(--text-secondary)' }}>{b.basis}</p>
      <p style={{ color: 'var(--text-muted)' }}>
        {b.assumed} Confidence: {b.confidence}. Revenue includes guest-paid cleaning fees, which are
        paid back out as cleaning cost.
      </p>
      <div className="flex flex-col gap-1">
        {b.sources.map((s) => (
          <SourceLink key={s.url} href={s.url}>{s.label}</SourceLink>
        ))}
      </div>
    </div>
  );
}

/**
 * Every market researched, including the ones screened out before any lots
 * were gathered, with the published figures and their sources.
 */
export function BenchmarkTable({ benchmarks, lotsByMarket }) {
  if (!benchmarks?.length) return null;
  return (
    <div className="card overflow-x-auto">
      <div className="px-4 pt-3 pb-2">
        <h2 className="text-sm font-semibold">Market benchmarks behind these numbers</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Published 4-bedroom short-term-rental performance, researched November 2026. Each uses the
          most conservative credible figure available. Markets marked screened out can't reach
          break-even at a $350K build, so no lots were gathered there.
        </p>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--grid)' }}>
            <th className="px-4 py-2 font-medium">Market</th>
            <th className="px-3 py-2 font-medium">4BR revenue</th>
            <th className="px-3 py-2 font-medium">Nightly</th>
            <th className="px-3 py-2 font-medium">Occupancy</th>
            <th className="px-3 py-2 font-medium">Confidence</th>
            <th className="px-3 py-2 font-medium">Lots</th>
            <th className="px-3 py-2 font-medium">Sources</th>
          </tr>
        </thead>
        <tbody>
          {benchmarks.map((b) => (
            <tr key={b.market} style={{ borderBottom: '1px solid var(--grid)' }}>
              <td className="px-4 py-2 font-medium whitespace-nowrap">{b.market}</td>
              <td className="px-3 py-2 num">{money(b.revenue)}</td>
              <td className="px-3 py-2 num">{money(b.adr)}</td>
              <td className="px-3 py-2 num">{pct(b.occupancy, 0)}</td>
              <td className="px-3 py-2">{b.confidence}</td>
              <td className="px-3 py-2 num whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                {b.screenedOut ? 'Screened out' : lotsByMarket[b.market] || 0}
              </td>
              <td className="px-3 py-2">
                <span className="flex flex-col gap-0.5">
                  {b.sources.map((s) => (
                    <SourceLink key={s.url} href={s.url} className="whitespace-nowrap">{s.label}</SourceLink>
                  ))}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
