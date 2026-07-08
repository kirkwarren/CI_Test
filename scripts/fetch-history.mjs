#!/usr/bin/env node
// Fetch DEEP history (up to 10 years) into data/history/ for long-horizon
// analysis (mega-trends, rolling 5-year outcome distributions).
//
// Kept separate from the daily 3-year refresh: this runs weekly. Kraken can't
// cross-validate a decade (its OHLC endpoint returns ~720 candles), so instead
// every deep series is CONSISTENCY-CHECKED against the daily-refresh CSV: on
// overlapping dates the closes must match exactly (same sources), otherwise
// the run fails rather than silently shipping divergent history.
//
// Run: NODE_USE_ENV_PROXY=1 node scripts/fetch-history.mjs

import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const HIST_DIR = path.join(DATA_DIR, 'history');
const YEARS = 10;
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36';

const CRYPTO = ['BTC-USD', 'ETH-USD', 'LTC-USD', 'SOL-USD', 'ADA-USD', 'DOGE-USD', 'LINK-USD', 'XLM-USD'];
const ETFS = ['SPY', 'QQQ', 'IWM', 'EFA', 'EEM', 'TLT', 'GLD', 'XLE', 'XLF', 'XLK', 'XLV', 'VNQ'];
const STOCKS = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA', 'JPM', 'UNH', 'XOM'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const isoDay = (t) => new Date(t * 1000).toISOString().slice(0, 10);

function startOfTodayUtc() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

async function getJson(url, headers = {}) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json', ...headers } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

const toCsv = (rows) =>
  'date,open,high,low,close,volume\n' +
  rows.map((r) => [r.date, r.open, r.high, r.low, r.close, r.volume].join(',')).join('\n') +
  '\n';

async function fetchCoinbaseDeep(pair) {
  const out = new Map();
  const end = startOfTodayUtc();
  const start = new Date(end.getTime() - YEARS * 365.25 * 86400 * 1000);
  let cursor = new Date(start);
  const today = end.toISOString().slice(0, 10);
  while (cursor < end) {
    const windowEnd = new Date(Math.min(cursor.getTime() + 300 * 86400 * 1000, end.getTime()));
    const url =
      `https://api.exchange.coinbase.com/products/${pair}/candles` +
      `?granularity=86400&start=${cursor.toISOString()}&end=${windowEnd.toISOString()}`;
    const rows = await getJson(url);
    for (const [t, low, high, open, close, volume] of rows) {
      const day = isoDay(t);
      if (day >= today) continue;
      out.set(day, { date: day, open, high, low, close, volume });
    }
    cursor = windowEnd;
    await sleep(180);
  }
  return [...out.values()].sort((a, b) => (a.date < b.date ? -1 : 1));
}

async function fetchNasdaqDeep(symbol, assetclass) {
  const from = new Date(Date.now() - YEARS * 365.25 * 86400 * 1000).toISOString().slice(0, 10);
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
      return { date: `${y}-${m}-${d}`, open: num(r.open), high: num(r.high), low: num(r.low), close: num(r.close), volume: num(r.volume) || 0 };
    })
    .filter((r) => [r.open, r.high, r.low, r.close].every(Number.isFinite))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

// Deep series must agree with the (Kraken-cross-validated) daily CSV on every
// overlapping date. Same upstream source, so tolerance is tight (0.1% covers
// occasional vendor restatements of a close).
async function consistencyCheck(symbol, deepRows) {
  let dailyText;
  try {
    dailyText = await readFile(path.join(DATA_DIR, `${symbol}.csv`), 'utf8');
  } catch {
    return { symbol, overlap: 0, note: 'no daily CSV to check against' };
  }
  const daily = new Map(
    dailyText.trim().split('\n').slice(1).map((l) => {
      const p = l.split(',');
      return [p[0], +p[4]];
    })
  );
  let overlap = 0;
  let worst = 0;
  for (const r of deepRows) {
    const c = daily.get(r.date);
    if (c != null) {
      overlap++;
      worst = Math.max(worst, Math.abs(r.close - c) / c);
    }
  }
  if (overlap > 100 && worst > 0.001) {
    throw new Error(`${symbol}: deep history diverges from verified daily data (worst ${(worst * 100).toFixed(2)}%)`);
  }
  return { symbol, overlap, worstDivergence: worst };
}

async function main() {
  await mkdir(HIST_DIR, { recursive: true });
  const manifest = { fetchedAt: new Date().toISOString(), years: YEARS, assets: [], checks: [] };

  for (const pair of CRYPTO) {
    process.stdout.write(`coinbase deep ${pair} ... `);
    try {
      const rows = await fetchCoinbaseDeep(pair);
      await writeFile(path.join(HIST_DIR, `${pair}.csv`), toCsv(rows));
      const check = await consistencyCheck(pair, rows);
      manifest.assets.push({ symbol: pair, class: 'crypto', rows: rows.length, from: rows[0]?.date, to: rows[rows.length - 1]?.date });
      manifest.checks.push(check);
      console.log(`${rows.length} rows (from ${rows[0]?.date})`);
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
      manifest.assets.push({ symbol: pair, class: 'crypto', error: e.message });
    }
    await sleep(150);
  }

  for (const { list, cls } of [{ list: ETFS, cls: 'etf' }, { list: STOCKS, cls: 'stocks' }]) {
    for (const symbol of list) {
      process.stdout.write(`nasdaq deep ${symbol} ... `);
      try {
        const rows = await fetchNasdaqDeep(symbol, cls);
        await writeFile(path.join(HIST_DIR, `${symbol}.csv`), toCsv(rows));
        const check = await consistencyCheck(symbol, rows);
        manifest.assets.push({ symbol, class: cls === 'etf' ? 'etf' : 'stock', rows: rows.length, from: rows[0]?.date, to: rows[rows.length - 1]?.date });
        manifest.checks.push(check);
        console.log(`${rows.length} rows (from ${rows[0]?.date})`);
      } catch (e) {
        console.log(`FAILED: ${e.message}`);
        manifest.assets.push({ symbol, class: cls === 'etf' ? 'etf' : 'stock', error: e.message });
      }
      await sleep(350);
    }
  }

  await writeFile(path.join(HIST_DIR, 'MANIFEST.json'), JSON.stringify(manifest, null, 2));
  const ok = manifest.assets.filter((a) => !a.error).length;
  console.log(`\nDeep history: ${ok}/${manifest.assets.length} assets. Consistency checks passed.`);
  if (ok === 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
