// Registered probabilistic forecasts + calibration scoring.
//
// "Accurately predicts" has exactly one honest meaning in forecasting science:
// make EXPLICIT probability statements ("68% chance the price is between A and
// B in 3 months"), REGISTER them before the outcome, then SCORE them when the
// horizon arrives. A forecaster is accurate if realized outcomes fall inside
// the 68% intervals ~68% of the time and the 95% intervals ~95% of the time
// (calibration). Point predictions of direction are astrology; this is the
// scientific replacement.
//
// Forecast construction (transparent, no black box):
//   - dispersion: measured daily vol scaled by √horizon (the predictable part)
//   - drift: 0 for horizons < 1y (direction is unpredictable short-term —
//     INSIGHTS study 3); for horizons ≥ 1y, the MEDIAN rolling same-length
//     CAGR from deep history, i.e. an explicit historical base rate, labeled
//     as such. If history can't supply a base rate, drift stays 0.
//
// Every forecast is stored in an append-only ledger and scored when matured.
// The calibration report is the platform's public accuracy record — including
// every miss.

export const HORIZONS = [
  { key: '1m', years: 1 / 12 },
  { key: '3m', years: 0.25 },
  { key: '1y', years: 1 },
  { key: '5y', years: 5 },
];

function addYears(dateStr, years) {
  const d = new Date(dateStr + 'T00:00:00Z');
  const ms = years * 365.25 * 86400 * 1000;
  return new Date(d.getTime() + ms).toISOString().slice(0, 10);
}

// Build one interval forecast.
export function makeIntervalForecast({
  symbol,
  lastDate,
  lastClose,
  dailyVol,
  ppy,
  horizonYears,
  horizonKey,
  driftAnnual = 0, // explicit base rate (0 unless supplied from history)
  driftSource = 'none',
}) {
  const sigma = dailyVol * Math.sqrt(horizonYears * ppy);
  const mu = Math.log(1 + driftAnnual) * horizonYears;
  const center = lastClose * Math.exp(mu);
  return {
    id: `${symbol}|${horizonKey}|${lastDate}`,
    symbol,
    horizon: horizonKey,
    horizonYears,
    madeAt: lastDate,
    maturesAt: addYears(lastDate, horizonYears),
    baseline: lastClose,
    driftAnnual,
    driftSource,
    center,
    low68: center * Math.exp(-sigma),
    high68: center * Math.exp(sigma),
    low95: center * Math.exp(-2 * sigma),
    high95: center * Math.exp(2 * sigma),
  };
}

// Generate this run's forecasts for a set of assets. `history` may supply a
// per-symbol median rolling CAGR by horizon for the >=1y drift base rate.
export function generateForecasts(assets, { baseRates = {} } = {}) {
  const out = [];
  for (const a of assets) {
    for (const h of HORIZONS) {
      const br = h.years >= 1 ? baseRates[a.symbol]?.[h.key] ?? null : null;
      out.push(
        makeIntervalForecast({
          symbol: a.symbol,
          lastDate: a.lastDate,
          lastClose: a.lastClose,
          dailyVol: a.dailyVol,
          ppy: a.ppy,
          horizonYears: h.years,
          horizonKey: h.key,
          driftAnnual: br ?? 0,
          driftSource: br != null ? 'median-rolling-cagr' : 'zero (direction unpredictable)',
        })
      );
    }
  }
  return out;
}

// Merge new forecasts into the ledger without duplicating registrations: one
// live forecast per (symbol, horizon) per made-at week.
export function mergeIntoLedger(ledger, forecasts) {
  const weekOf = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00Z');
    const day = d.getUTCDay();
    d.setUTCDate(d.getUTCDate() - day); // start of week (Sunday)
    return d.toISOString().slice(0, 10);
  };
  const seen = new Set(ledger.map((f) => `${f.symbol}|${f.horizon}|${weekOf(f.madeAt)}`));
  const added = [];
  for (const f of forecasts) {
    const k = `${f.symbol}|${f.horizon}|${weekOf(f.madeAt)}`;
    if (!seen.has(k)) {
      seen.add(k);
      added.push(f);
    }
  }
  return { ledger: [...ledger, ...added], added: added.length };
}

// Score matured forecasts against realized prices. `priceAt(symbol, date)`
// must return a close within ±5 calendar days of `date`, or null.
export function scoreLedger(ledger, priceAt, today) {
  const scored = [];
  let updated = 0;
  for (const f of ledger) {
    if (f.outcome) {
      scored.push(f);
      continue;
    }
    if (f.maturesAt > today) {
      scored.push(f);
      continue;
    }
    const realized = priceAt(f.symbol, f.maturesAt);
    if (realized == null) {
      scored.push(f); // matured but no price available yet — try next run
      continue;
    }
    updated++;
    scored.push({
      ...f,
      outcome: {
        realized,
        scoredAt: today,
        inside68: realized >= f.low68 && realized <= f.high68,
        inside95: realized >= f.low95 && realized <= f.high95,
        realizedReturn: realized / f.baseline - 1,
      },
    });
  }
  return { ledger: scored, newlyScored: updated };
}

// The public accuracy record: coverage of nominal intervals, by horizon.
// A calibrated (i.e. genuinely "accurate") forecaster shows coverage ≈ nominal.
export function calibrationReport(ledger) {
  const matured = ledger.filter((f) => f.outcome);
  const byHorizon = {};
  for (const h of HORIZONS) {
    const rows = matured.filter((f) => f.horizon === h.key);
    if (!rows.length) {
      byHorizon[h.key] = { matured: 0 };
      continue;
    }
    byHorizon[h.key] = {
      matured: rows.length,
      coverage68: rows.filter((f) => f.outcome.inside68).length / rows.length,
      coverage95: rows.filter((f) => f.outcome.inside95).length / rows.length,
    };
  }
  return {
    totalRegistered: ledger.length,
    totalMatured: matured.length,
    pending: ledger.length - matured.length,
    byHorizon,
    note:
      'Accuracy = calibration: 68% intervals should contain the outcome ~68% of the time, 95% intervals ~95%. Deviations in either direction are misses — intervals too wide are as dishonest as intervals too narrow.',
  };
}
