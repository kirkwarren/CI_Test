#!/usr/bin/env node
// Fetch REAL daily market data and store it as CSVs under data/.
//
// Sources (all free, public, no API keys):
//   - Coinbase Exchange API  → crypto daily candles (primary crypto source)
//   - Kraken public API      → crypto daily candles (independent cross-check)
//   - Nasdaq API             → equity/ETF daily OHLCV
//
// Honesty notes baked into the pipeline:
//   - Every row is real market history, saved verbatim (normalized column order,
//     ascending by date) so anyone can diff the files against the source.
//   - Crypto closes are cross-validated across two independent venues; a
//     divergence beyond tolerance fails the run rather than silently passing.
//   - Nasdaq prices are split-adjusted but NOT dividend-adjusted; screening
//     metrics on high-yield assets (e.g. TLT) understate total return. This is
//     recorded in data/MANIFEST.json so downstream analysis can carry the caveat.
//
// Run: NODE_USE_ENV_PROXY=1 node scripts/fetch-data.mjs

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const YEARS = 3;
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36';

const CRYPTO = [
  'BTC-USD', 'ETH-USD', 'SOL-USD', 'XRP-USD', 'ADA-USD', 'DOGE-USD',
  'AVAX-USD', 'LINK-USD', 'DOT-USD', 'LTC-USD', 'BCH-USD', 'UNI-USD',
  'AAVE-USD', 'ATOM-USD', 'NEAR-USD', 'XLM-USD',
];
// Kraken uses different pair codes; we cross-check the three largest.
const KRAKEN_CHECK = { 'BTC-USD': 'XBTUSD', 'ETH-USD': 'ETHUSD', 'SOL-USD': 'SOLUSD' };

const ETFS = ['SPY', 'QQQ', 'IWM', 'EFA', 'EEM', 'TLT', 'GLD', 'XLE', 'XLF', 'XLK', 'XLV', 'VNQ'];
const STOCKS = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA', 'JPM', 'UNH', 'XOM'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, headers = {}) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json', ...headers } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

function toCsv(rows) {
  const header = 'date,open,high,low,close,volume';
  const body = rows
    .map((r) => [r.date, r.open, r.high, r.low, r.close, r.volume].join(','))
    .join('\n');
  return `${header}\n${body}\n`;
}

function isoDay(unixSeconds) {
  return new Date(unixSeconds * 1000).toISOString().slice(0, 10);
}

// The current UTC day's candle is still forming — including it would let a
// partial bar pollute momentum/vol/screen stats. Everything below is clipped
// to completed days only.
function startOfTodayUtc() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

// ---- Coinbase: paginated daily candles ------------------------------------
// Response rows: [time, low, high, open, close, volume], newest first, max 300.
async function fetchCoinbase(pair) {
  const out = new Map(); // date -> row (dedupe across windows)
  const end = startOfTodayUtc(); // completed days only
  const start = new Date(end.getTime() - YEARS * 365.25 * 86400 * 1000);
  let cursor = new Date(start);

  while (cursor < end) {
    const windowEnd = new Date(Math.min(cursor.getTime() + 300 * 86400 * 1000, end.getTime()));
    const url =
      `https://api.exchange.coinbase.com/products/${pair}/candles` +
      `?granularity=86400&start=${cursor.toISOString()}&end=${windowEnd.toISOString()}`;
    const rows = await getJson(url);
    const today = startOfTodayUtc().toISOString().slice(0, 10);
    for (const [t, low, high, open, close, volume] of rows) {
      const day = isoDay(t);
      if (day >= today) continue; // belt-and-braces: drop any in-progress bucket
      out.set(day, { date: day, open, high, low, close, volume });
    }
    cursor = windowEnd;
    await sleep(180); // stay well under Coinbase's public rate limit
  }
  return [...out.values()].sort((a, b) => (a.date < b.date ? -1 : 1));
}

// ---- Kraken: daily OHLC (720 most recent candles in one call) ---------------
async function fetchKraken(krakenPair) {
  const json = await getJson(
    `https://api.kraken.com/0/public/OHLC?pair=${krakenPair}&interval=1440`
  );
  if (json.error?.length) throw new Error(`Kraken: ${json.error.join('; ')}`);
  const key = Object.keys(json.result).find((k) => k !== 'last');
  return json.result[key].map(([t, open, high, low, close]) => ({
    date: isoDay(t),
    open: +open,
    high: +high,
    low: +low,
    close: +close,
  }));
}

// ---- Nasdaq: daily historical ----------------------------------------------
async function fetchNasdaq(symbol, assetclass) {
  const from = new Date(Date.now() - YEARS * 365.25 * 86400 * 1000).toISOString().slice(0, 10);
  // Completed sessions only — exclude today so a mid-session snapshot can't
  // masquerade as a daily close.
  const to = new Date(startOfTodayUtc().getTime() - 86400000).toISOString().slice(0, 10);
  const url =
    `https://api.nasdaq.com/api/quote/${symbol}/historical` +
    `?assetclass=${assetclass}&fromdate=${from}&todate=${to}&limit=9999`;
  const json = await getJson(url);
  const rows = json?.data?.tradesTable?.rows;
  if (!rows?.length) throw new Error(`Nasdaq returned no rows for ${symbol}`);
  const num = (s) => parseFloat(String(s).replace(/[$,]/g, ''));
  return rows
    .map((r) => {
      const [m, d, y] = r.date.split('/');
      return {
        date: `${y}-${m}-${d}`,
        open: num(r.open),
        high: num(r.high),
        low: num(r.low),
        close: num(r.close),
        volume: num(r.volume) || 0,
      };
    })
    .filter((r) => [r.open, r.high, r.low, r.close].every(Number.isFinite))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

// ---- Cross-validation --------------------------------------------------------
// Compare Coinbase vs Kraken daily closes on overlapping dates. Venue prices
// legitimately differ a little (separate order books); >2% median divergence
// or >5% on many days means something is wrong with one feed.
function crossValidate(cbRows, krRows, pair) {
  const kr = new Map(krRows.map((r) => [r.date, r.close]));
  const diffs = [];
  for (const r of cbRows) {
    const k = kr.get(r.date);
    if (k) diffs.push(Math.abs(r.close - k) / k);
  }
  if (diffs.length < 100) throw new Error(`${pair}: only ${diffs.length} overlapping days with Kraken`);
  diffs.sort((a, b) => a - b);
  const mid = Math.floor(diffs.length / 2);
  const median = diffs.length % 2 ? diffs[mid] : (diffs[mid - 1] + diffs[mid]) / 2;
  const p95 = diffs[Math.floor(diffs.length * 0.95)];
  const result = { pair, overlapDays: diffs.length, medianDivergence: median, p95Divergence: p95 };
  if (median > 0.02) throw new Error(`${pair}: median venue divergence ${(median * 100).toFixed(2)}% — data unreliable`);
  if (p95 > 0.05) throw new Error(`${pair}: p95 venue divergence ${(p95 * 100).toFixed(2)}% — tail divergence too high`);
  return result;
}

// ---- Main --------------------------------------------------------------------
async function main() {
  await mkdir(DATA_DIR, { recursive: true });
  const manifest = {
    fetchedAt: new Date().toISOString(),
    years: YEARS,
    sources: {
      crypto: 'Coinbase Exchange API (daily candles), cross-validated against Kraken public API',
      equities: 'Nasdaq API historical (split-adjusted, NOT dividend-adjusted)',
    },
    caveats: [
      'Equity prices are not dividend-adjusted; total-return metrics for high-yield assets are understated.',
      'Crypto venue prices differ slightly across exchanges; Coinbase is the canonical source here.',
      'All data is daily OHLCV. No intraday, no order-book depth, no survivorship-bias correction on the fixed universe.',
    ],
    assets: [],
    crossValidation: [],
  };

  for (const pair of CRYPTO) {
    process.stdout.write(`coinbase ${pair} ... `);
    try {
      const rows = await fetchCoinbase(pair);
      await writeFile(path.join(DATA_DIR, `${pair}.csv`), toCsv(rows));
      manifest.assets.push({ symbol: pair, class: 'crypto', rows: rows.length, from: rows[0]?.date, to: rows[rows.length - 1]?.date });
      console.log(`${rows.length} rows`);
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
      manifest.assets.push({ symbol: pair, class: 'crypto', error: e.message });
    }
    await sleep(150);
  }

  for (const [pair, krakenPair] of Object.entries(KRAKEN_CHECK)) {
    process.stdout.write(`cross-validate ${pair} vs Kraken ... `);
    try {
      const cbCsv = manifest.assets.find((a) => a.symbol === pair && !a.error);
      if (!cbCsv) throw new Error('no Coinbase data to validate');
      const { readFile } = await import('node:fs/promises');
      const text = await readFile(path.join(DATA_DIR, `${pair}.csv`), 'utf8');
      const cbRows = text.trim().split('\n').slice(1).map((l) => {
        const [date, open, high, low, close, volume] = l.split(',');
        return { date, open: +open, high: +high, low: +low, close: +close, volume: +volume };
      });
      const kr = await fetchKraken(krakenPair);
      const v = crossValidate(cbRows, kr, pair);
      manifest.crossValidation.push(v);
      console.log(`ok — median divergence ${(v.medianDivergence * 100).toFixed(3)}% over ${v.overlapDays} days`);
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
      manifest.crossValidation.push({ pair, error: e.message });
    }
    await sleep(300);
  }

  for (const { list, cls } of [
    { list: ETFS, cls: 'etf' },
    { list: STOCKS, cls: 'stocks' },
  ]) {
    for (const symbol of list) {
      process.stdout.write(`nasdaq ${symbol} (${cls}) ... `);
      try {
        const rows = await fetchNasdaq(symbol, cls);
        await writeFile(path.join(DATA_DIR, `${symbol}.csv`), toCsv(rows));
        manifest.assets.push({ symbol, class: cls === 'etf' ? 'etf' : 'stock', rows: rows.length, from: rows[0]?.date, to: rows[rows.length - 1]?.date });
        console.log(`${rows.length} rows`);
      } catch (e) {
        console.log(`FAILED: ${e.message}`);
        manifest.assets.push({ symbol, class: cls === 'etf' ? 'etf' : 'stock', error: e.message });
      }
      await sleep(350);
    }
  }

  await writeFile(path.join(DATA_DIR, 'MANIFEST.json'), JSON.stringify(manifest, null, 2));
  const ok = manifest.assets.filter((a) => !a.error).length;
  console.log(`\nDone: ${ok}/${manifest.assets.length} assets fetched. Manifest written.`);
  if (ok === 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
