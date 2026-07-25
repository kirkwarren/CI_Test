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
export default function Filters({ filters, onChange, neighborhoods }) {
  const set = (k, v) => onChange({ ...filters, [k]: v });
  return (
    <div className="card px-4 py-3 grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
      <Field label="Max price">
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
        <select
          value={filters.minBeds}
          onChange={(e) => set('minBeds', +e.target.value)}
        >
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n === 0 ? 'Any' : `${n}+`}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Neighborhood">
        <select
          value={filters.neighborhood}
          onChange={(e) => set('neighborhood', e.target.value)}
        >
          <option value="">All</option>
          {neighborhoods.map((n) => (
            <option key={n} value={n}>
              {n}
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
