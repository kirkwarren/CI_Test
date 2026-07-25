import React, { useState } from 'react';
import { ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';
import { DEFAULT_ASSUMPTIONS } from '../lib/analysis';

// [key, label, toInput, fromInput, step]
const PCT = [(v) => +(v * 100).toFixed(2), (v) => v / 100];
const RAW = [(v) => v, (v) => v];
const FIELDS = [
  ['downPaymentPct', 'Down payment %', ...PCT, 5],
  ['interestRate', 'Interest rate %', ...PCT, 0.25],
  ['loanYears', 'Loan term (years)', ...RAW, 5],
  ['closingCostPct', 'Closing costs %', ...PCT, 0.5],
  ['propertyTaxPct', 'Property tax %', ...PCT, 0.1],
  ['insurancePctOfPrice', 'Insurance % of price', ...PCT, 0.1],
  ['managementPct', 'Management % of revenue', ...PCT, 5],
  ['maintenancePct', 'Maintenance % of revenue', ...PCT, 1],
  ['occupancyHaircut', 'Occupancy haircut %', ...PCT, 1],
  ['furnishingPerBedroom', 'Furnishing $ / bedroom', ...RAW, 500],
];

/** Underwriting assumptions; every edit re-runs the whole analysis. */
export default function AssumptionsPanel({ assumptions, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card px-4 py-3">
      <div className="flex items-center justify-between">
        <button
          className="flex items-center gap-1.5 text-sm font-semibold"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          Underwriting assumptions
        </button>
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
      {open && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
          {FIELDS.map(([key, label, toInput, fromInput, step]) => (
            <label
              key={key}
              className="flex flex-col gap-1 text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              {label}
              <input
                type="number"
                step={step}
                value={toInput(assumptions[key])}
                onChange={(e) =>
                  e.target.value !== '' &&
                  onChange({ ...assumptions, [key]: fromInput(+e.target.value) })
                }
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
