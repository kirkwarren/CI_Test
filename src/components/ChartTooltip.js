import React from 'react';

/** Shared recharts tooltip shell so every chart's hover layer matches. */
export default function ChartTooltip({ title, rows }) {
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs shadow-lg"
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
      }}
    >
      {title && <div className="font-semibold mb-1">{title}</div>}
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4">
          <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
          <span className="num">{v}</span>
        </div>
      ))}
    </div>
  );
}
