import React from 'react';

/**
 * Horizontal bar list rendered in plain HTML: one hue for every bar (the
 * categories are nominal), 4px rounded data-end square at the baseline,
 * value labeled at each bar tip.
 */
export default function HBarChart({ rows, format }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className="flex flex-col gap-1.5">
      {rows.map((r) => (
        <div key={r.name} className="flex items-center gap-2 text-xs">
          <div
            className="w-28 shrink-0 truncate text-right"
            style={{ color: 'var(--text-secondary)' }}
            title={r.name}
          >
            {r.name}
          </div>
          <div className="flex-1 flex items-center gap-1.5 min-w-0">
            <div
              style={{
                width: `${Math.max(0.5, (r.value / max) * 100)}%`,
                height: 14,
                background: 'var(--series-1)',
                borderRadius: '0 4px 4px 0',
              }}
            />
            <span
              className="num shrink-0"
              style={{ color: 'var(--text-secondary)', fontSize: 11 }}
            >
              {format(r.value)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
