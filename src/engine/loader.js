// Load real market data (CSV text) into the engine's bar format.
//
// The CSVs under data/ are produced by scripts/fetch-data.mjs from live public
// APIs (Coinbase, Nasdaq) and stored verbatim so they can be audited. This
// module only parses and sanity-checks — it never fabricates or fills values.

// Parse "date,open,high,low,close,volume" CSV text into bars.
// Throws on structural problems instead of silently repairing them: analysis
// on corrupt data is worse than no analysis.
export function parseCsvBars(text, symbol = '?') {
  const lines = text.trim().split('\n');
  if (lines.length < 2) throw new Error(`${symbol}: empty CSV`);
  const header = lines[0].trim().toLowerCase();
  if (header !== 'date,open,high,low,close,volume') {
    throw new Error(`${symbol}: unexpected header "${header}"`);
  }

  const bars = [];
  let prevDate = '';
  for (let li = 1; li < lines.length; li++) {
    const parts = lines[li].split(',');
    if (parts.length !== 6) throw new Error(`${symbol}: bad row ${li}`);
    const [date, open, high, low, close, volume] = parts;
    const bar = {
      i: bars.length,
      date,
      open: +open,
      high: +high,
      low: +low,
      close: +close,
      volume: +volume,
    };
    if (![bar.open, bar.high, bar.low, bar.close].every((v) => Number.isFinite(v) && v > 0)) {
      throw new Error(`${symbol}: non-positive/NaN price on ${date}`);
    }
    if (!Number.isFinite(bar.volume) || bar.volume < 0) {
      throw new Error(`${symbol}: invalid volume on ${date}`);
    }
    if (bar.high < bar.low) throw new Error(`${symbol}: high < low on ${date}`);
    if (date <= prevDate) throw new Error(`${symbol}: dates not strictly ascending at ${date}`);
    prevDate = date;
    bars.push(bar);
  }
  return bars;
}

// Infer how many bars make up a year for this series (needed to annualize
// Sharpe/CAGR correctly): crypto trades every day (~365), equities ~252.
export function inferPeriodsPerYear(bars) {
  if (bars.length < 30) return 252;
  const first = new Date(bars[0].date).getTime();
  const last = new Date(bars[bars.length - 1].date).getTime();
  const years = (last - first) / (365.25 * 86400 * 1000);
  if (years <= 0) return 252;
  const perYear = (bars.length - 1) / years;
  // Snap to the two real-world calendars rather than trusting noise.
  return Math.abs(perYear - 365) < Math.abs(perYear - 252) ? 365 : 252;
}

// Basic quality report used by the analysis runner: gaps, zero-volume days,
// extreme single-bar moves worth eyeballing. Informational, not a gate.
export function qualityReport(bars, symbol = '?') {
  let maxGapDays = 0;
  let zeroVolume = 0;
  let extremeMoves = 0;
  for (let i = 1; i < bars.length; i++) {
    const gap =
      (new Date(bars[i].date) - new Date(bars[i - 1].date)) / 86400000;
    if (gap > maxGapDays) maxGapDays = gap;
    if (bars[i].volume === 0) zeroVolume++;
    const ret = Math.abs(bars[i].close / bars[i - 1].close - 1);
    if (ret > 0.25) extremeMoves++;
  }
  return { symbol, bars: bars.length, from: bars[0]?.date, to: bars[bars.length - 1]?.date, maxGapDays, zeroVolume, extremeMoves };
}
