// Long-horizon runner: mega-trends from 10-year history + the weekly
// rules-based model allocation.
//
// Outputs: MEGATRENDS.md, ALLOCATION.md, src/data/longterm.json
//
// Honesty contract: no point forecasts anywhere. The 5-10 year view is the
// DISTRIBUTION of realized rolling windows plus measured-vol uncertainty
// cones; the allocation is an auditable rule set, each line citing the
// measurement that justifies it.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { parseCsvBars, inferPeriodsPerYear } from '../src/engine/loader';
import { megaTrendSummary } from '../src/engine/megatrends';
import { buildAllocation, ALLOCATION_RULES } from '../src/engine/allocation';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const HIST_DIR = path.join(DATA_DIR, 'history');
const pct = (x, d = 1) => (x == null ? 'n/a' : `${x >= 0 ? '+' : ''}${(x * 100).toFixed(d)}%`);
const money = (x) =>
  x >= 1000 ? `$${(x / 1000).toFixed(1)}k` : x >= 10 ? `$${x.toFixed(0)}` : `$${x.toFixed(2)}`;

async function loadDir(dir) {
  const manifest = JSON.parse(await readFile(path.join(dir, 'MANIFEST.json'), 'utf8'));
  const out = {};
  for (const f of (await readdir(dir)).filter((f) => f.endsWith('.csv'))) {
    const symbol = f.replace('.csv', '');
    const meta = manifest.assets.find((a) => a.symbol === symbol);
    if (!meta || meta.error) continue;
    const bars = parseCsvBars(await readFile(path.join(dir, f), 'utf8'), symbol);
    out[symbol] = { symbol, assetClass: meta.class, bars, ppy: inferPeriodsPerYear(bars) };
  }
  return out;
}

async function main() {
  const deep = await loadDir(HIST_DIR);
  const daily = await loadDir(DATA_DIR);
  const screen = JSON.parse(await readFile(path.resolve(process.cwd(), 'src/data/realAnalysis.json'), 'utf8'));

  // ---- Mega-trends ----
  const spy = deep.SPY?.bars ?? null;
  const trends = Object.values(deep)
    .map((a) =>
      megaTrendSummary(a.bars, {
        symbol: a.symbol,
        benchBars: a.symbol === 'SPY' ? null : spy,
        ppy: a.ppy,
      })
    )
    .sort((x, y) => (y.cagr5y ?? -99) - (x.cagr5y ?? -99));

  const M = [];
  M.push('# Mega-Trends & The Honest Long Horizon');
  M.push('');
  M.push(`*Measured on up to ${Math.max(...trends.map((t) => t.yearsOfData)).toFixed(1)} years of real daily history (${trends.length} assets). There is no such thing as an accurate 5–10 year prediction — anyone selling one is selling the word "accurate". What history DOES give you: multi-year trend states, the full distribution of 5-year outcomes that actually occurred, and how wide measured volatility says the future is.*`);
  M.push('');
  M.push('## Multi-year trend state (descriptive, not destiny)');
  M.push('');
  M.push('| Asset | 10y CAGR | 5y CAGR | 3y CAGR | 5y rel. strength vs SPY |');
  M.push('|---|---|---|---|---|');
  for (const t of trends) {
    M.push(`| ${t.symbol} | ${pct(t.cagr10y)} | ${pct(t.cagr5y)} | ${pct(t.cagr3y)} | ${t.relStrength5yVsBench == null ? '—' : pct(t.relStrength5yVsBench)} |`);
  }
  M.push('');
  M.push('**Reading:** a "mega-trend" here is a measured multi-year growth differential (e.g. tech vs broad market), not a story. Trends this long are real but famously mean-revert without notice — the 2021-22 crypto columns in this table are the cautionary exhibit.');
  M.push('');
  M.push('## What 5 years has ACTUALLY delivered — every rolling window');
  M.push('');
  M.push('| Asset | Windows | Worst 5y (ann.) | Median 5y | Best 5y | % windows negative |');
  M.push('|---|---|---|---|---|---|');
  for (const t of trends.filter((t) => !t.rolling5y.insufficientData)) {
    const r = t.rolling5y;
    M.push(`| ${t.symbol} | ${r.windows} | ${pct(r.worst)} | ${pct(r.median)} | ${pct(r.best)} | ${(r.pctNegative * 100).toFixed(0)}% |`);
  }
  M.push('');
  M.push('**This table IS the honest 5-year forecast:** a range, not a number. If the worst realized window is unacceptable to you, the position size is too big — that is the entire actionable content of long-horizon investing.');
  M.push('');
  M.push('## 10-year uncertainty cones (measured vol, zero drift)');
  M.push('');
  M.push('| Asset | Today | 10y ±1σ range | 10y ±2σ range |');
  M.push('|---|---|---|---|');
  for (const t of trends.filter((t) => ['SPY', 'QQQ', 'GLD', 'TLT', 'BTC-USD', 'ETH-USD', 'NVDA', 'GOOGL'].includes(t.symbol))) {
    M.push(`| ${t.symbol} | ${money(t.lastClose)} | ${money(t.cone10y.low1)} – ${money(t.cone10y.high1)} | ${money(t.cone10y.low2)} – ${money(t.cone10y.high2)} |`);
  }
  M.push('');
  M.push('**Reading:** these bands are what a decade of measured volatility implies with no directional opinion. Their absurd width for crypto is not a flaw of the method — it is the honest size of a decade of uncertainty.');
  M.push('');
  M.push('*Regenerate: `./scripts/longterm.sh`. Sources: Coinbase / Nasdaq deep history, consistency-checked against the cross-validated daily set. Equity prices exclude dividends, so equity CAGRs are understated (especially TLT/GLD-adjacent comparisons).*');
  M.push('');

  // ---- Weekly allocation ----
  const volsBySymbol = {};
  for (const a of screen.ranking.assets) volsBySymbol[a.symbol] = a.annVol;
  const screenTop = screen.ranking.assets
    .filter((a) => a.assetClass !== 'crypto')
    .map((a) => a.symbol);
  const btc = screen.ranking.assets.find((a) => a.symbol === 'BTC-USD');
  const barsBySymbol = {};
  for (const [sym, a] of Object.entries(daily)) barsBySymbol[sym] = a.bars;

  const allocation = buildAllocation({
    volsBySymbol,
    screenTop,
    cryptoAbove200d: btc?.above200d ?? false,
    barsBySymbol,
    asOf: screen.summary.dataThrough,
  });

  const A = [];
  A.push('# Weekly Model Allocation (rules-based)');
  A.push('');
  A.push(`*As of equities ${allocation.asOf?.equities} / crypto ${allocation.asOf?.crypto}. ${allocation.disclaimer}*`);
  A.push('');
  A.push('| Weight | Asset | Sleeve | Rule (auditable) |');
  A.push('|---|---|---|---|');
  for (const l of allocation.allocations) {
    A.push(`| ${(l.weight * 100).toFixed(1)}% | **${l.symbol}** | ${l.sleeve} | ${l.rule} |`);
  }
  A.push(`| ${(allocation.cash * 100).toFixed(1)}% | **CASH** | reserve | cash floor${allocation.overlay.scale < 1 ? ' + vol-target overlay overflow' : ''}${!btc?.above200d ? ' + closed crypto gate' : ''} |`);
  A.push('');
  A.push(`Portfolio vol overlay: realized ${allocation.overlay.realizedVol ? (allocation.overlay.realizedVol * 100).toFixed(1) + '%' : 'n/a'} vs target ${(allocation.overlay.target * 100).toFixed(0)}% → scale ${allocation.overlay.scale.toFixed(2)}.`);
  A.push('');
  A.push('## Why these rules and not "better" ones');
  A.push('');
  A.push('- **Inverse-vol core** — volatility is the one demonstrably predictable input (INSIGHTS study 3); weighting by its inverse equalizes risk contributions instead of dollar amounts.');
  A.push('- **TLT/GLD sleeve** — the only pairs whose correlation to equities stayed low on measured STRESS days (study 4). Diversification chosen from crash behavior, not brochure behavior.');
  A.push('- **Momentum tilt kept small** — the factor is documented across a century of data, but it FAILED in our own 3-year window (study 5). A rule that can fail for years gets 10%, not 55%.');
  A.push('- **Crypto trend-gated and capped at 5%** — fattest tails in the dataset (study 1) and zero luck-adjusted evidence of timing edge (STRATEGY-LAB: DSR 0/38).');
  A.push('- **Vol-target overlay** — when the portfolio\'s realized vol exceeds target, risk scales into cash. Sizing responds to the measurable thing.');
  A.push('');
  A.push('**What this does not do:** predict returns, promise outperformance, or react to news. It rebalances weekly by rule. Any week the rules produce the same weights, the correct action is nothing.');
  A.push('');
  A.push('*Regenerated weekly. History: `./scripts/longterm.sh`.*');
  A.push('');

  await writeFile(path.resolve(process.cwd(), 'MEGATRENDS.md'), M.join('\n'));
  await writeFile(path.resolve(process.cwd(), 'ALLOCATION.md'), A.join('\n'));
  await writeFile(
    path.resolve(process.cwd(), 'src/data/longterm.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        trends: trends.map(({ ...t }) => t),
        allocation,
      },
      null,
      1
    )
  );
  console.log(`Wrote MEGATRENDS.md, ALLOCATION.md, src/data/longterm.json`);
  console.log(
    `Allocation: ${allocation.allocations.length} lines + ${(allocation.cash * 100).toFixed(1)}% cash; overlay scale ${allocation.overlay.scale.toFixed(2)}`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
