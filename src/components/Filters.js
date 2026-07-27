import React from 'react';

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
      {label}
      {children}
    </label>
  );
}

/** One filter row; everything below it (charts + table) renders the same slice. */
export default function Filters({ filters, onChange, markets }) {
  const set = (k, v) => onChange({ ...filters, [k]: v });
  return (
    <div className="card px-4 py-3 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 items-end">
      <Field label="Market">
        <select value={filters.market} onChange={(e) => set('market', e.target.value)}>
          <option value="">All markets</option>
          {markets.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Deal type">
        <select value={filters.dealType} onChange={(e) => set('dealType', e.target.value)}>
          <option value="">Buy or build</option>
          <option value="existing">Existing homes</option>
          <option value="build">Land + build</option>
        </select>
      </Field>
      <Field label="Max all-in cost">
        <input
          type="number"
          step={50000}
          min={0}
          value={filters.maxPrice ?? ''}
          placeholder="Any"
          onChange={(e) => set('maxPrice', e.target.value ? +e.target.value : null)}
        />
      </Field>
      <Field label="Min bedrooms">
        <select value={filters.minBeds} onChange={(e) => set('minBeds', +e.target.value)}>
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n === 0 ? 'Any' : `${n}+`}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Min cap rate %">
        <input
          type="number"
          step={0.5}
          min={0}
          value={filters.minCapRate ?? ''}
          placeholder="Any"
          onChange={(e) => set('minCapRate', e.target.value ? +e.target.value : null)}
        />
      </Field>
      <Field label="Cash flow">
        <select
          value={filters.positiveOnly ? 'positive' : 'all'}
          onChange={(e) => set('positiveOnly', e.target.value === 'positive')}
        >
          <option value="all">All deals</option>
          <option value="positive">Positive only</option>
        </select>
      </Field>
    </div>
  );
}
