// Full honest quantitative analysis over the REAL market data in data/.
//
// For every asset:
//   1. Screen  — momentum / risk-adjusted / trend metrics + "on sale" stats
//   2. Backtest the trend strategy with fees & slippage vs BUY-AND-HOLD
//   3. Walk-forward — optimize in-sample, test out-of-sample (overfitting tax)
//   4. Paper-trade the full history bar-by-bar
//   5. Monte Carlo the strategy's realized trades
//
// Outputs:
//   - src/data/realAnalysis.json  (snapshot consumed by the dashboard)
//   - REPORT.md                   (full written analysis)
//
// This file is bundled with esbuild (see scripts/analyze.sh) so it can reuse
// the exact engine code the app and tests use — one implementation, no drift.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { parseCsvBars, inferPeriodsPerYear, qualityReport } from '../src/engine/loader';
import { screenAsset, rankAssets } from '../src/engine/screener';
import { computeContext, signalVotes, detect, DEFAULT_PARAMS } from '../src/engine/strategy';
import { runBacktest } from '../src/engine/backtest';
import { walkForward } from '../src/engine/walkforward';
import { monteCarlo } from '../src/engine/montecarlo';
import { runPaperSession } from '../src/engine/paper';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const pct = (x, d = 1) => (x == null ? 'n/a' : `${x >= 0 ? '+' : ''}${(x * 100).toFixed(d)}%`);
const num = (x, d = 2) => (x == null ? 'n/a' : x.toFixed(d));

async function loadUniverse() {
  const manifest = JSON.parse(await readFile(path.join(DATA_DIR, 'MANIFEST.json'), 'utf8'));
  const files = (await readdir(DATA_DIR)).filter((f) => f.endsWith('.csv'));
  const universe = [];
  for (const file of files) {
    const symbol = file.replace('.csv', '');
    const meta = manifest.assets.find((a) => a.symbol === symbol);
    if (!meta) {
      console.warn(`skipping ${file}: not in MANIFEST.json (orphan file)`);
      continue;
    }
    if (meta.error) continue;
    const text = await readFile(path.join(DATA_DIR, file), 'utf8');
    const bars = parseCsvBars(text, symbol);
    universe.push({
      symbol,
      assetClass: meta?.class ?? '?',
      bars,
      periodsPerYear: inferPeriodsPerYear(bars),
      quality: qualityReport(bars, symbol),
    });
  }
  return { manifest, universe };
}

function analyzeStrategy(asset) {
  const cfg = { barsPerYear: asset.periodsPerYear };
  const bt = runBacktest(asset.bars, {}, cfg);
  const wf = walkForward(asset.bars, { folds: 4, config: cfg });
  const paper = runPaperSession(asset.bars, { config: cfg });
  const mc = monteCarlo(bt.trades, { paths: 2000 });

  const first = asset.bars[0].close;
  const last = asset.bars[asset.bars.length - 1].close;
  const buyHoldReturn = last / first - 1;

  return {
    symbol: asset.symbol,
    strategy: {
      totalReturn: bt.metrics.totalReturn,
      sharpe: bt.metrics.sharpe,
      maxDrawdown: bt.metrics.maxDrawdown,
      trades: bt.metrics.trades,
      winRate: bt.metrics.winRate,
    },
    buyHold: { totalReturn: buyHoldReturn },
    strategyBeatsBuyHold: bt.metrics.totalReturn > buyHoldReturn,
    walkForward: wf.insufficientData
      ? null
      : {
          avgIsReturn: wf.aggregate.avgIsReturn,
          avgOosReturn: wf.aggregate.avgOosReturn,
          oosGap: wf.aggregate.oosGap,
          degradation: wf.aggregate.degradation, // null when IS edge is too small
          oosProfitableFolds: wf.aggregate.oosProfitableFolds,
          totalFolds: wf.aggregate.totalFolds,
        },
    paper: {
      totalReturn: paper.snapshot.totalReturn,
      closedTrades: paper.snapshot.closedTrades,
    },
    monteCarlo: mc.insufficientData
      ? null
      : { probLoss: mc.probLoss, medianMaxDrawdown: mc.medianMaxDrawdown },
  };
}

function median(xs) {
  const s = [...xs].sort((a, b) => a - b);
  if (!s.length) return null;
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

async function main() {
  const { manifest, universe } = await loadUniverse();
  console.log(`Loaded ${universe.length} real assets`);

  // ---- 1. Cross-sectional screen ----
  const screens = universe.map((a) =>
    screenAsset(a.bars, { symbol: a.symbol, assetClass: a.assetClass, periodsPerYear: a.periodsPerYear })
  );
  const ranking = rankAssets(screens);

  // ---- 1b. Current signal tilts + volatility-based uncertainty ranges ----
  // "Tilt" = what each signal says at the LAST completed bar. It describes the
  // present state of the rules, not the future. The range is a zero-drift
  // ±1σ/±2σ 3-month band from MEASURED volatility — an honest quantification
  // of uncertainty, deliberately symmetric because direction is not
  // predictable (see INSIGHTS.md study 3).
  const tiltBySymbol = new Map();
  for (const a of universe) {
    const ctx = computeContext(a.bars, DEFAULT_PARAMS);
    const i = a.bars.length - 1;
    const votes = signalVotes(ctx, i, DEFAULT_PARAMS);
    const ensemble = detect(ctx, i, { ...DEFAULT_PARAMS, signalMode: 'ensemble' });
    const s = screens.find((x) => x.symbol === a.symbol);
    const sigma3m = s.annVol / 2; // 3 months = 1/4 year; σ scales with √t
    const last = s.lastClose;
    tiltBySymbol.set(a.symbol, {
      votes,
      ensemble,
      range3m: {
        low1: last * Math.exp(-sigma3m),
        high1: last * Math.exp(sigma3m),
        low2: last * Math.exp(-2 * sigma3m),
        high2: last * Math.exp(2 * sigma3m),
      },
    });
  }

  // ---- 2-5. Strategy suite on every asset ----
  const strategyResults = [];
  for (const asset of universe) {
    process.stdout.write(`analyzing ${asset.symbol} ... `);
    const r = analyzeStrategy(asset);
    strategyResults.push(r);
    console.log(
      `strat ${pct(r.strategy.totalReturn)} vs hold ${pct(r.buyHold.totalReturn)}; WF OOS ${r.walkForward ? pct(r.walkForward.avgOosReturn) : 'n/a'}`
    );
  }

  const beatCount = strategyResults.filter((r) => r.strategyBeatsBuyHold).length;
  // How many of the "wins" vs buy-and-hold happened on assets that LOST money
  // to hold — i.e. the strategy dodged a crash rather than out-earning a rally.
  const beatsOnLosers = strategyResults.filter(
    (r) => r.strategyBeatsBuyHold && r.buyHold.totalReturn < 0
  ).length;
  const wfs = strategyResults.filter((r) => r.walkForward);
  // Degradation ratio is null when the in-sample edge was too small to divide
  // by — only aggregate over the assets where the ratio is meaningful.
  const degradations = wfs
    .map((r) => r.walkForward.degradation)
    .filter((d) => d != null);
  const perClassThrough = {};
  for (const u of universe) {
    const cls = u.assetClass === 'crypto' ? 'crypto' : 'equities';
    const last = u.bars[u.bars.length - 1].date;
    if (!perClassThrough[cls] || last > perClassThrough[cls]) perClassThrough[cls] = last;
  }
  const summary = {
    assets: universe.length,
    strategyBeatsBuyHold: beatCount,
    beatsOnLosers,
    medianStrategyReturn: median(strategyResults.map((r) => r.strategy.totalReturn)),
    medianBuyHoldReturn: median(strategyResults.map((r) => r.buyHold.totalReturn)),
    medianWfDegradation: median(degradations),
    degradationAssets: degradations.length,
    medianOosGap: median(wfs.map((r) => r.walkForward.oosGap)),
    medianOosReturn: median(wfs.map((r) => r.walkForward.avgOosReturn)),
    dataThrough: perClassThrough,
  };

  // ---- Snapshot for the dashboard ----
  const snapshot = {
    generatedAt: new Date().toISOString(),
    dataProvenance: {
      fetchedAt: manifest.fetchedAt,
      sources: manifest.sources,
      caveats: manifest.caveats,
      crossValidation: manifest.crossValidation,
    },
    ranking: {
      weights: ranking.weights,
      note: ranking.note,
      assets: ranking.assets.map((a) => ({
        symbol: a.symbol,
        assetClass: a.assetClass,
        lastDate: a.lastDate,
        lastClose: a.lastClose,
        composite: a.composite,
        ranks: a.ranks,
        tilt: tiltBySymbol.get(a.symbol) ?? null,
        mom12_1: a.mom12_1,
        ret6m: a.ret6m,
        ret3m: a.ret3m,
        sharpe: a.sharpe,
        sortino: a.sortino,
        annVol: a.annVol,
        maxDrawdown: a.maxDrawdown,
        above200d: a.above200d,
        dist200d: a.dist200d,
        pctBelow52wHigh: a.pctBelow52wHigh,
        rsi14: a.rsi14,
        cagr: a.cagr,
      })),
    },
    strategyResults,
    summary,
  };
  await writeFile(
    path.resolve(process.cwd(), 'src/data/realAnalysis.json'),
    JSON.stringify(snapshot, null, 1)
  );

  // ---- Written report ----
  const top = ranking.assets.slice(0, 10);
  const bottom = ranking.assets.slice(-5);
  const onSale = [...ranking.assets].sort((a, b) => b.pctBelow52wHigh - a.pctBelow52wHigh).slice(0, 8);

  const stratBySymbol = new Map(strategyResults.map((r) => [r.symbol, r]));

  const lines = [];
  lines.push(`# Real-Data Quant Screen & Strategy Analysis`);
  lines.push('');
  lines.push(`*Generated ${new Date().toISOString().slice(0, 10)} · crypto through ${summary.dataThrough.crypto} (completed UTC days), equities through ${summary.dataThrough.equities} (last close) · ${universe.length} assets (${universe.filter((u) => u.assetClass === 'crypto').length} crypto via Coinbase, ${universe.filter((u) => u.assetClass !== 'crypto').length} equities/ETFs via Nasdaq)*`);
  lines.push('');
  lines.push(`> **This report describes the past.** Every number below is a historical`);
  lines.push(`> measurement on real market data — none of it is a prediction, and`);
  lines.push(`> none of it is financial advice. The walk-forward section exists precisely`);
  lines.push(`> to show how much apparent edge evaporates on unseen data.`);
  lines.push('');
  lines.push(`## Data integrity`);
  lines.push('');
  lines.push(`Crypto closes were cross-validated across two independent venues (Coinbase vs Kraken):`);
  lines.push('');
  for (const v of manifest.crossValidation.filter((v) => !v.error)) {
    lines.push(`- ${v.pair}: median divergence ${(v.medianDivergence * 100).toFixed(3)}% over ${v.overlapDays} overlapping days`);
  }
  lines.push('');
  lines.push(`Caveats: ${manifest.caveats.join(' ')}`);
  lines.push('');
  lines.push(`## Composite screen — top 10 of ${universe.length}`);
  lines.push('');
  lines.push(`Ranked on three transparent, equally-weighted pillars: 12-1 & 6-month momentum, risk-adjusted return (Sharpe + Sortino), and trend vs the 200-day average. ${ranking.note}`);
  lines.push('');
  lines.push(`| # | Asset | Class | Composite | 12-1 Mom | 6M | Sharpe | Ann.Vol | MaxDD | vs 200d |`);
  lines.push(`|---|-------|-------|-----------|----------|----|--------|---------|-------|---------|`);
  top.forEach((a, i) => {
    lines.push(
      `| ${i + 1} | **${a.symbol}** | ${a.assetClass} | ${num(a.composite)} | ${pct(a.mom12_1)} | ${pct(a.ret6m)} | ${num(a.sharpe)} | ${pct(a.annVol, 0)} | ${pct(-a.maxDrawdown, 0)} | ${pct(a.dist200d)} |`
    );
  });
  lines.push('');
  lines.push(`Bottom of the screen: ${bottom.map((a) => `${a.symbol} (${num(a.composite)})`).join(', ')}.`);
  lines.push('');
  lines.push(`## "On sale" — furthest below 52-week high (informational only)`);
  lines.push('');
  lines.push(`A big drawdown is **not** evidence of undervaluation — falling knives dominate this list as often as bargains. Price data alone cannot establish intrinsic value.`);
  lines.push('');
  lines.push(`| Asset | Below 52w high | 12-1 Mom | Trend |`);
  lines.push(`|-------|----------------|----------|-------|`);
  for (const a of onSale) {
    lines.push(`| ${a.symbol} | ${pct(-a.pctBelow52wHigh)} | ${pct(a.mom12_1)} | ${a.above200d ? 'above 200d' : 'below 200d'} |`);
  }
  lines.push('');
  lines.push(`## Strategy vs buy-and-hold (the honest test)`);
  lines.push('');
  lines.push(`The trend strategy (EMA cross + RSI/vol filter, ATR stops, fractional-Kelly sizing, 10bps round-trip cost) was run on all ${universe.length} real series and compared to simply holding the asset:`);
  lines.push('');
  lines.push(`- Strategy beat buy-and-hold on **${beatCount} of ${universe.length}** assets — and ${summary.beatsOnLosers} of those ${beatCount} "wins" were on assets that lost money to hold (crash-dodging, not out-earning)`);
  lines.push(`- Median strategy return: **${pct(summary.medianStrategyReturn)}** vs median buy-and-hold: **${pct(summary.medianBuyHoldReturn)}**`);
  lines.push(`- Median walk-forward degradation: **${pct(summary.medianWfDegradation, 0)}** of the in-sample edge lost out-of-sample (over the ${summary.degradationAssets} assets with a meaningful in-sample edge; the ratio is undefined near zero)`);
  lines.push(`- Median in-sample→out-of-sample gap across all ${wfs.length} assets: **${pct(summary.medianOosGap)}** in absolute return`);
  lines.push(`- Median per-asset average out-of-sample fold return (cross-asset median): **${pct(summary.medianOosReturn)}**`);
  lines.push('');
  lines.push(`*Note: equity buy-and-hold returns exclude dividends (prices are split- but not dividend-adjusted), which biases this comparison IN THE STRATEGY'S FAVOR on dividend payers — the honest count is, if anything, worse than ${beatCount}/${universe.length}.*`);
  lines.push('');
  lines.push(`Selected rows (top-3 screened assets + benchmarks):`);
  lines.push('');
  lines.push(`| Asset | Strategy | Buy & Hold | WF out-of-sample | WF degradation | Paper trades |`);
  lines.push(`|-------|----------|------------|------------------|----------------|--------------|`);
  const selected = [...top.slice(0, 3).map((a) => a.symbol), 'BTC-USD', 'ETH-USD', 'SPY', 'QQQ'];
  for (const sym of [...new Set(selected)]) {
    const r = stratBySymbol.get(sym);
    if (!r) continue;
    lines.push(
      `| ${sym} | ${pct(r.strategy.totalReturn)} | ${pct(r.buyHold.totalReturn)} | ${r.walkForward ? pct(r.walkForward.avgOosReturn) : 'n/a'} | ${r.walkForward?.degradation != null ? pct(r.walkForward.degradation, 0) : 'n/a'} | ${r.paper.closedTrades} |`
    );
  }
  lines.push('');
  lines.push(`## What this actually says`);
  lines.push('');
  lines.push(`1. **The screen is a ranking of past behavior.** The top-ranked assets had the strongest recent momentum, risk-adjusted returns and trend — factors with real academic support, but factor premia are noisy, episodic, and can invert for years.`);
  lines.push(`2. **The active strategy mostly fails to beat holding.** That is the normal, honest result for a simple technical system after costs — and exactly what the hype dashboards never show you.`);
  lines.push(`3. **Walk-forward degradation is the key number.** In-sample results overstate what you would actually have earned; the out-of-sample column is the realistic one.`);
  lines.push(`4. **Paper trading is the correct next step** for anything here — not real capital.`);
  lines.push('');
  lines.push(`*Data: Coinbase Exchange & Nasdaq public APIs, fetched ${manifest.fetchedAt.slice(0, 10)}. Full per-asset numbers in src/data/realAnalysis.json. Engine + tests in src/engine/.*`);
  lines.push('');

  await writeFile(path.resolve(process.cwd(), 'REPORT.md'), lines.join('\n'));
  console.log(`\nWrote REPORT.md and src/data/realAnalysis.json`);
  console.log(`Summary: strategy beat hold on ${beatCount}/${universe.length}; median WF degradation ${pct(summary.medianWfDegradation, 0)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
