// Weekly forecast registration + calibration scoring.
//
// Registers explicit probabilistic interval forecasts (1m/3m/1y/5y) for every
// asset in the daily universe, appends them to an immutable ledger, scores
// every matured forecast against realized prices, and publishes the
// calibration record — the platform's public accuracy score, misses included.

import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

import { parseCsvBars, inferPeriodsPerYear } from '../src/engine/loader';
import { rollingOutcomes } from '../src/engine/megatrends';
import {
  generateForecasts,
  mergeIntoLedger,
  scoreLedger,
  calibrationReport,
  HORIZONS,
} from '../src/engine/forecast';
import { stddev } from '../src/engine/metrics';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const HIST_DIR = path.join(DATA_DIR, 'history');
const FC_DIR = path.join(DATA_DIR, 'forecasts');
const LEDGER = path.join(FC_DIR, 'ledger.json');
const pct = (x, d = 0) => `${(x * 100).toFixed(d)}%`;

async function loadDir(dir) {
  const manifest = JSON.parse(await readFile(path.join(dir, 'MANIFEST.json'), 'utf8'));
  const out = {};
  for (const f of (await readdir(dir)).filter((f) => f.endsWith('.csv'))) {
    const symbol = f.replace('.csv', '');
    const meta = manifest.assets.find((a) => a.symbol === symbol);
    if (!meta || meta.error) continue;
    const bars = parseCsvBars(await readFile(path.join(dir, f), 'utf8'), symbol);
    out[symbol] = { symbol, bars, ppy: inferPeriodsPerYear(bars) };
  }
  return out;
}

async function main() {
  await mkdir(FC_DIR, { recursive: true });
  const daily = await loadDir(DATA_DIR);
  let deep = {};
  try {
    deep = await loadDir(HIST_DIR);
  } catch {
    console.warn('no deep history — 1y/5y drift base rates unavailable, using zero drift');
  }

  // Assets: current daily universe. Vol measured from the daily series;
  // >=1y drift base rates from deep history's median rolling CAGR.
  const assets = [];
  const baseRates = {};
  for (const a of Object.values(daily)) {
    const closes = a.bars.map((b) => b.close);
    const rets = [];
    for (let i = 1; i < closes.length; i++) rets.push(closes[i] / closes[i - 1] - 1);
    assets.push({
      symbol: a.symbol,
      lastDate: a.bars[a.bars.length - 1].date,
      lastClose: closes[closes.length - 1],
      dailyVol: stddev(rets),
      ppy: a.ppy,
    });
    const d = deep[a.symbol];
    if (d) {
      const dCloses = d.bars.map((b) => b.close);
      const r1 = rollingOutcomes(dCloses, 1, d.ppy);
      const r5 = rollingOutcomes(dCloses, 5, d.ppy);
      baseRates[a.symbol] = {
        '1y': r1.insufficientData ? null : r1.median,
        '5y': r5.insufficientData ? null : r5.median,
      };
    }
  }

  // Load ledger, register this week's forecasts, score matured ones.
  let ledger = [];
  try {
    ledger = JSON.parse(await readFile(LEDGER, 'utf8'));
  } catch {}
  const { ledger: merged, added } = mergeIntoLedger(ledger, generateForecasts(assets, { baseRates }));

  const today = new Date().toISOString().slice(0, 10);
  const priceAt = (symbol, date) => {
    const bars = daily[symbol]?.bars;
    if (!bars) return null;
    // closest bar within ±5 calendar days
    let best = null;
    let bestGap = 6;
    for (const b of bars) {
      const gap = Math.abs((new Date(b.date) - new Date(date)) / 86400000);
      if (gap < bestGap) {
        bestGap = gap;
        best = b.close;
      }
    }
    return best;
  };
  const { ledger: scored, newlyScored } = scoreLedger(merged, priceAt, today);
  await writeFile(LEDGER, JSON.stringify(scored, null, 1));

  const report = calibrationReport(scored);
  await writeFile(
    path.resolve(process.cwd(), 'src/data/calibration.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), ...report }, null, 1)
  );

  const L = [];
  L.push('# Forecast Register & Calibration Record');
  L.push('');
  L.push('*The only honest meaning of "accurately predicts": make explicit probability-interval forecasts, register them BEFORE the outcome, then score every one when it matures. Accuracy is calibration — 68% intervals should contain the outcome ~68% of the time, 95% intervals ~95%. This page is the platform\'s complete accuracy record, misses included. Point predictions of direction are deliberately absent; they are not honestly makeable.*');
  L.push('');
  L.push(`Registered forecasts: **${report.totalRegistered}** (${added} added this run) · matured & scored: **${report.totalMatured}** · pending: **${report.pending}**`);
  L.push('');
  L.push('| Horizon | Matured | 68%-interval coverage (target ≈68%) | 95%-interval coverage (target ≈95%) |');
  L.push('|---|---|---|---|');
  for (const h of HORIZONS) {
    const r = report.byHorizon[h.key];
    L.push(
      r.matured
        ? `| ${h.key} | ${r.matured} | ${pct(r.coverage68)} | ${pct(r.coverage95)} |`
        : `| ${h.key} | 0 | awaiting maturity | awaiting maturity |`
    );
  }
  L.push('');
  L.push('**Forecast construction** (fully transparent): dispersion from measured volatility scaled by √horizon; drift zero below 1 year (direction is unpredictable — INSIGHTS study 3) and the historical median rolling CAGR at 1y/5y, labeled as a base rate, not a view. The 5-year forecasts registered today mature in 2031; the 1-month ones start scoring within weeks — the record builds itself and cannot be quietly edited (append-only ledger, in git).');
  L.push('');
  L.push('*Regenerate/score: `./scripts/forecast.sh` (runs weekly). Ledger: `data/forecasts/ledger.json`.*');
  L.push('');
  await writeFile(path.resolve(process.cwd(), 'CALIBRATION.md'), L.join('\n'));

  console.log(`Ledger: ${report.totalRegistered} registered (+${added}), ${newlyScored} newly scored, ${report.pending} pending`);
  console.log('Wrote CALIBRATION.md and src/data/calibration.json');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
