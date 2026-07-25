import React from 'react';

/** label + value (+ optional secondary line). Values use proportional figures. */
export default function StatTile({ label, value, sub }) {
  return (
    <div className="card px-4 py-3 flex-1 min-w-[150px]">
      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </div>
      <div className="text-2xl font-semibold mt-0.5">{value}</div>
      {sub && (
        <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {sub}
        </div>
      )}
    </div>
  );
}
