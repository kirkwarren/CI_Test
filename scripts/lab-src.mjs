// Strategy lab: run every strategy variant through the full honest gauntlet on
// the real data, and let the DEFLATED Sharpe ratio judge the winner.
//
// Variants (identical exits/costs/risk caps; only signal & sizing differ):
//   trend            - baseline EMA-cross trend follower (the original)
//   trend+vt         - same, with 15% annualized volatility targeting
//   meanrev          - fade RSI extremes
//   breakout         - 55-bar Donchian channel breakouts
//   ensemble         - majority vote of trend/meanrev/breakout
//   ensemble+vt      - ensemble with volatility targeting
//
// Honesty contract, stated before the results existed: the expected win from
// vol targeting and ensembling is SMOOTHER equity (smaller drawdowns, lower
// equity-curve vol), not beating buy-and-hold. Six variants is already
// multiple testing — which is exactly why the deflated Sharpe ratio, which
// penalizes for the number of trials, is the final judge. Whatever the tables
// say below is what happened; nothing was rerun to look better.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { parseCsvBars, inferPeriodsPerYear } from '../src/engine/loader';
import { runBacktest } from '../src/engine/backtest';
import { walkForward } from '../src/engine/walkforward';
import { luckBenchmark } from '../src/engine/studies';
import { deflatedSharpe, returnMoments } from '../src/engine/validation';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const pct = (x, d = 1) => (x == null ? 'n/a' : `${x >= 0 ? '+' : ''}${(x * 100).toFixed(d)}%`);

const VARIANTS = [
  { key: 'trend', params: { signalMode: 'trend' }, config: {} },
  { key: 'trend+vt', params: { signalMode: 'trend' }, config: { volTargetAnnual: 0.15 } },
  { key: 'meanrev', params: { signalMode: 'meanrev' }, config: {} },
  { key: 'breakout', params: { signalMode: 'breakout' }, config: {} },
  { key: 'ensemble', params: { signalMode: 'ensemble' }, config: {} },
  { key: 'ensemble+vt', params: { signalMode: 'ensemble' }, config: { volTargetAnnual: 0.15 } },
];

async function loadUniverse() {
  const manifest = JSON.parse(await readFile(path.join(DATA_DIR, 'MANIFEST.json'), 'utf8'));
  const files = (await readdir(DATA_DIR)).filter((f) => f.endsWith('.csv'));
  const universe = [];
  for (const file of files) {
    const symbol = file.replace('.csv', '');
    const meta = manifest.assets.find((a) => a.symbol === symbol);
    if (!meta || meta.error) continue;
    const bars = parseCsvBars(await readFile(path.join(DATA_DIR, file), 'utf8'), symbol);
    universe.push({ symbol, assetClass: meta.class, bars, periodsPerYear: inferPeriodsPerYear(bars) });
  }
  return universe;
}

const median = (xs) => {
  const s = xs.filter((x) => x != null).sort((a, b) => a - b);
  if (!s.length) return null;
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};

function curveReturns(equityCurve) {
  const rets = [];
  for (let i = 1; i < equityCurve.length; i++) rets.push(equityCurve[i] / equityCurve[i - 1] - 1);
  return rets;
}

async function main() {
  const universe = await loadUniverse();
  console.log(`Gauntlet: ${VARIANTS.length} variants x ${universe.length} real assets`);

  // perAsset[symbol] = { buyHold, variants: { key: {...} } }
  const perAsset = {};

  for (const asset of universe) {
    const cfgBase = { barsPerYear: asset.periodsPerYear };
    const buyHold = asset.bars[asset.bars.length - 1].close / asset.bars[0].close - 1;
    const entry = { symbol: asset.symbol, assetClass: asset.assetClass, buyHold, variants: {} };

    for (const v of VARIANTS) {
      const cfg = { ...cfgBase, ...v.config };
      const bt = runBacktest(asset.bars, v.params, cfg);
      const wf = walkForward(asset.bars, { folds: 4, config: cfg, baseParams: v.params });
      const luck = luckBenchmark(asset.bars, bt.trades, { n: 400 });
      const rets = curveReturns(bt.equityCurve);
      const moments = returnMoments(rets);
      entry.variants[v.key] = {
        totalReturn: bt.metrics.totalReturn,
        maxDrawdown: bt.metrics.maxDrawdown,
        trades: bt.metrics.trades,
        curveVol: moments.std,
        perPeriodSharpe: moments.std > 0 ? moments.mean / moments.std : 0,
        returns: rets, // kept transiently for DSR; stripped before writing JSON
        beatsHold: bt.metrics.totalReturn > buyHold,
        wfOos: wf.insufficientData ? null : wf.aggregate.avgOosReturn,
        wfGap: wf.insufficientData ? null : wf.aggregate.oosGap,
        luckPercentile: luck.insufficientData ? null : luck.percentile,
      };
    }

    // Deflated Sharpe for this asset's BEST variant, penalized for 6 trials.
    const sharpes = VARIANTS.map((v) => entry.variants[v.key].perPeriodSharpe);
    const bestKey = VARIANTS[sharpes.indexOf(Math.max(...sharpes))].key;
    const d = deflatedSharpe(sharpes, entry.variants[bestKey].returns);
    entry.bestVariant = bestKey;
    entry.deflatedSharpe = d.dsr;
    for (const v of VARIANTS) delete entry.variants[v.key].returns;

    perAsset[asset.symbol] = entry;
    console.log(
      `${asset.symbol.padEnd(9)} best=${bestKey.padEnd(11)} DSR=${d.dsr == null ? 'n/a' : d.dsr.toFixed(3)} hold=${pct(buyHold)}`
    );
  }

  // ---- Variant-level aggregates ----
  const assets = Object.values(perAsset);
  const agg = {};
  for (const v of VARIANTS) {
    const rows = assets.map((a) => a.variants[v.key]);
    agg[v.key] = {
      beatsHold: rows.filter((r) => r.beatsHold).length,
      medianReturn: median(rows.map((r) => r.totalReturn)),
      medianMaxDrawdown: median(rows.map((r) => r.maxDrawdown)),
      medianCurveVol: median(rows.map((r) => r.curveVol)),
      medianWfOos: median(rows.map((r) => r.wfOos)),
      medianLuckPercentile: median(rows.map((r) => r.luckPercentile)),
      medianTrades: median(rows.map((r) => r.trades)),
    };
  }
  const medianBuyHold = median(assets.map((a) => a.buyHold));
  const dsrSurvivors = assets.filter((a) => a.deflatedSharpe != null && a.deflatedSharpe > 0.95);
  const bestCounts = {};
  for (const a of assets) bestCounts[a.bestVariant] = (bestCounts[a.bestVariant] ?? 0) + 1;

  const out = {
    generatedAt: new Date().toISOString(),
    variants: VARIANTS.map((v) => v.key),
    aggregates: agg,
    medianBuyHold,
    dsrSurvivors: dsrSurvivors.map((a) => ({ symbol: a.symbol, best: a.bestVariant, dsr: a.deflatedSharpe })),
    bestVariantCounts: bestCounts,
    perAsset,
  };
  await writeFile(path.resolve(process.cwd(), 'src/data/lab.json'), JSON.stringify(out, null, 1));

  // ---- Report ----
  const L = [];
  L.push('# Strategy Lab — six variants through the honest gauntlet');
  L.push('');
  L.push(`*${VARIANTS.length} strategy variants × ${assets.length} real assets. Identical costs (10bps round-trip), risk caps, and exit machinery — only the signal and sizing differ. Multiple testing is penalized by the deflated Sharpe ratio (Bailey & López de Prado): trying ${VARIANTS.length} variants and picking the best inflates its backtest, and the DSR quantifies by how much.*`);
  L.push('');
  L.push('**Pre-registered expectation** (written before results): vol targeting and ensembling should smooth equity curves (lower drawdown/vol), not beat buy-and-hold. Judge the table against that claim.');
  L.push('');
  L.push('## Variant aggregates (medians across all assets)');
  L.push('');
  L.push(`| Variant | Beats hold | Median return | Median max DD | Median curve vol | Median WF out-of-sample | Median luck percentile | Median trades |`);
  L.push('|---|---|---|---|---|---|---|---|');
  for (const v of VARIANTS) {
    const a = agg[v.key];
    L.push(
      `| ${v.key} | ${a.beatsHold}/${assets.length} | ${pct(a.medianReturn)} | ${pct(-a.medianMaxDrawdown)} | ${(a.medianCurveVol * 100).toFixed(2)}% | ${pct(a.medianWfOos)} | ${a.medianLuckPercentile == null ? 'n/a' : Math.round(a.medianLuckPercentile * 100)} | ${a.medianTrades} |`
    );
  }
  L.push('');
  L.push(`Median buy-and-hold across the same assets: **${pct(medianBuyHold)}**.`);
  L.push('');
  L.push('## Deflated Sharpe verdict');
  L.push('');
  L.push(`For each asset, the best of the ${VARIANTS.length} variants was tested against the Sharpe that the best of ${VARIANTS.length} junk variants would show by luck alone:`);
  L.push('');
  if (dsrSurvivors.length === 0) {
    L.push(`**0 of ${assets.length} assets** produced a best-variant that survives deflation (DSR > 0.95). After correcting for selection across variants, no variant on any asset shows statistically credible positive true Sharpe. This is the normal, honest result — and the one the hype dashboards never compute.`);
  } else {
    L.push(`**${dsrSurvivors.length} of ${assets.length} assets** produced a best-variant with DSR > 0.95: ${dsrSurvivors.map((s) => `${s.symbol} (${s.bestVariant}, ${s.deflatedSharpe.toFixed(3)})`).join(', ')}. Treat survivors with suspicion, not excitement: 3 years of daily data is a short sample, and this correction covers only OUR ${VARIANTS.length} trials — not the millions of variants the industry has collectively tried on the same public signals.`);
  }
  L.push('');
  L.push('Which variant most often had the best raw Sharpe per asset (before deflation): ' + Object.entries(bestCounts).sort((a, b) => b[1] - a[1]).map(([k, c]) => `${k} (${c})`).join(', ') + '.');
  L.push('');
  L.push('## Reading');
  L.push('');
  L.push('1. **Compare drawdown and curve-vol columns first** — that is where vol targeting and ensembling are supposed to help, and the honest measure of whether they did.');
  L.push('2. **The beats-hold column is the alpha reality check.** Expect it to stay low; costs and the concentration of returns in a few days (INSIGHTS.md study 2) work against all timing variants.');
  L.push('3. **The luck percentile** (vs 400 duration-matched random traders) below ~95 means the variant is indistinguishable from luck on that asset class.');
  L.push('4. **Nothing here is a recommendation.** It is a controlled comparison on one 3-year window of history, with every anti-fooling device we have turned on.');
  L.push('');
  L.push(`*Regenerate: \`./scripts/lab.sh\`. Full per-asset numbers: \`src/data/lab.json\`. Engine: \`src/engine/\` (91+ tests).*`);
  L.push('');

  await writeFile(path.resolve(process.cwd(), 'STRATEGY-LAB.md'), L.join('\n'));
  console.log(`\nWrote STRATEGY-LAB.md and src/data/lab.json`);
  console.log(`DSR survivors: ${dsrSurvivors.length}/${assets.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
