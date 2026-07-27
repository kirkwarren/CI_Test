import React, { useState } from 'react';
import { ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';
import { DEFAULT_ASSUMPTIONS } from '../lib/analysis';

// [key, label, toInput, fromInput, step]
const PCT = [(v) => +(v * 100).toFixed(2), (v) => v / 100];
const RAW = [(v) => v, (v) => v];

const FINANCE_FIELDS = [
  ['downPaymentPct', 'Down payment %', ...PCT, 5],
  ['interestRate', 'Interest rate %', ...PCT, 0.25],
  ['loanYears', 'Loan term (years)', ...RAW, 5],
  ['closingCostPct', 'Closing costs %', ...PCT, 0.5],
];

const OPERATING_FIELDS = [
  ['insurancePctOfPrice', 'Insurance % of cost', ...PCT, 0.1],
  ['managementPct', 'Management % of revenue', ...PCT, 5],
  ['maintenancePct', 'Maintenance % of revenue', ...PCT, 1],
  ['occupancyHaircut', 'Occupancy haircut %', ...PCT, 1],
  ['furnishingPerBedroom', 'Furnishing $ / bedroom', ...RAW, 500],
];

const BUILD_FIELDS = [
  ['buildCost', 'Build cost $ (all-in)', ...RAW, 25000],
  ['buildBeds', 'Build bedrooms', ...RAW, 1],
  ['buildBaths', 'Build bathrooms', ...RAW, 1],
];

function NumField({ assumptions, onChange, field }) {
  const [key, label, toInput, fromInput, step] = field;
  return (
    <label className="flex flex-col gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
      {label}
      <input
        type="number"
        step={step}
        value={toInput(assumptions[key])}
        onChange={(e) =>
          e.target.value !== '' && onChange({ ...assumptions, [key]: fromInput(+e.target.value) })
        }
      />
    </label>
  );
}

function Group({ title, children }) {
  return (
    <div>
      <div
        className="text-xs font-semibold mb-2 pb-1"
        style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--grid)' }}
      >
        {title}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">{children}</div>
    </div>
  );
}

/** Underwriting assumptions; every edit re-runs the whole analysis. */
export default function AssumptionsPanel({ assumptions, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card px-4 py-3">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          className="flex items-center gap-1.5 text-sm font-semibold"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          Underwriting assumptions
        </button>
        <div className="flex items-center gap-4">
          {!open && (
            <span className="text-xs num" style={{ color: 'var(--text-muted)' }}>
              {(assumptions.downPaymentPct * 100).toFixed(0)}% down ·{' '}
              {(assumptions.interestRate * 100).toFixed(2)}% ·{' '}
              {(assumptions.managementPct * 100).toFixed(0)}% mgmt · build $
              {(assumptions.buildCost / 1000).toFixed(0)}k
            </span>
          )}
          {open && (
            <button
              className="flex items-center gap-1 text-xs hover:opacity-70"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => onChange({ ...DEFAULT_ASSUMPTIONS })}
            >
              <RotateCcw size={12} /> Reset to defaults
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="grid md:grid-cols-3 gap-6 mt-4">
          <Group title="Financing">
            {FINANCE_FIELDS.map((f) => (
              <NumField key={f[0]} field={f} assumptions={assumptions} onChange={onChange} />
            ))}
          </Group>

          <Group title="Operating">
            {OPERATING_FIELDS.map((f) => (
              <NumField key={f[0]} field={f} assumptions={assumptions} onChange={onChange} />
            ))}
            <label className="flex flex-col gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              Property tax
              <select
                value={assumptions.useMarketTaxRate ? 'market' : 'flat'}
                onChange={(e) =>
                  onChange({ ...assumptions, useMarketTaxRate: e.target.value === 'market' })
                }
              >
                <option value="market">Use market rate</option>
                <option value="flat">Flat rate below</option>
              </select>
            </label>
            <NumField
              field={['propertyTaxPct', 'Flat tax rate %', ...PCT, 0.1]}
              assumptions={assumptions}
              onChange={onChange}
            />
          </Group>

          <Group title="Build-to-rent spec">
            {BUILD_FIELDS.map((f) => (
              <NumField key={f[0]} field={f} assumptions={assumptions} onChange={onChange} />
            ))}
            <p
              className="col-span-2 lg:col-span-3 text-xs leading-snug"
              style={{ color: 'var(--text-muted)' }}
            >
              Applied to vacant-land listings: cost basis becomes land price +
              build cost, and comps are matched to the planned bedroom count.
              A single flat build cost across every market is optimistic in
              high-cost ones — raise it to test a market individually.
            </p>
          </Group>
        </div>
      )}
    </div>
  );
}
