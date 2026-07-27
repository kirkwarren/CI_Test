import React from 'react';
import { pct } from '../lib/format';

/**
 * Per-market rollup. Market selection is the single biggest driver of whether
 * an STR pencils, so this is a table rather than a chart: every column carries
 * meaning and the reader needs to compare exact values across ten rows.
 */
export default function MarketTable({ markets, selectedMarket, onSelect }) {
  if (!markets.length) return null;
  return (
    <div className="card overflow-x-auto">
      <div className="px-4 pt-3 pb-2">
        <h2 className="text-sm font-semibold">Where the deals actually are</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Median by market, ranked by cash-on-cash return. Property tax and the
          nightly-rate-to-price ratio drive most of the spread. Click a row to
          filter to that market.
        </p>
      </div>
      <table className="w-full text-xs whitespace-nowrap">
        <thead>
          <tr
            className="text-left"
            style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--grid)' }}
          >
            <th className="px-4 py-2 font-medium">Market</th>
            <th className="px-3 py-2 font-medium">Property tax</th>
            <th className="px-3 py-2 font-medium">Gross yield</th>
            <th className="px-3 py-2 font-medium">Cap rate</th>
            <th className="px-3 py-2 font-medium">Cash-on-cash</th>
            <th className="px-3 py-2 font-medium">Cash-flow positive</th>
          </tr>
        </thead>
        <tbody>
          {markets.map((m) => {
            const selected = m.market === selectedMarket;
            const good = m.medianCashOnCash > 0;
            return (
              <tr
                key={m.market}
                tabIndex={0}
                onClick={() => onSelect(selected ? '' : m.market)}
                onKeyDown={(e) => e.key === 'Enter' && onSelect(selected ? '' : m.market)}
                className="cursor-pointer"
                style={{
                  borderBottom: '1px solid var(--grid)',
                  background: selected ? 'var(--accent-wash)' : 'transparent',
                }}
              >
                <td className="px-4 py-2 font-medium">{m.market}</td>
                <td className="px-3 py-2 num">{pct(m.taxRate, 2)}</td>
                <td className="px-3 py-2 num">{pct(m.medianGrossYield)}</td>
                <td className="px-3 py-2 num">{pct(m.medianCapRate)}</td>
                <td
                  className="px-3 py-2 num font-semibold"
                  style={{ color: good ? 'var(--good)' : 'var(--bad)' }}
                >
                  {pct(m.medianCashOnCash)}
                </td>
                <td className="px-3 py-2 num" style={{ color: 'var(--text-secondary)' }}>
                  {m.positive} / {m.count}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
