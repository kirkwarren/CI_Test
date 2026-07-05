// Deep empirical studies on the REAL market data in data/ → INSIGHTS.md.
//
// Six studies, each testing a well-documented empirical regularity of markets
// on our own verified data — measurement, not prediction. See
// src/engine/studies.js for the definitions and unit tests.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { parseCsvBars, inferPeriodsPerYear } from '../src/engine/loader';
import {
  tailStats,
  returnConcentration,
  volClustering,
  stressCorrelation,
  crossSectionalMomentum,
  luckBenchmark,
  simpleReturns,
} from '../src/engine/studies';
import { runBacktest } from '../src/engine/backtest';

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
    if (!meta || meta.error) continue;
    const bars = parseCsvBars(await readFile(path.join(DATA_DIR, file), 'utf8'), symbol);
    universe.push({ symbol, assetClass: meta.class, bars, periodsPerYear: inferPeriodsPerYear(bars) });
  }
  return universe;
}

async function main() {
  const universe = await loadUniverse();
  const get = (sym) => universe.find((u) => u.symbol === sym);
  const out = { generatedAt: new Date().toISOString(), studies: {} };
  const L = [];

  L.push('# Market Truths — measured on our own verified data');
  L.push('');
  L.push('*Six empirical studies on 3 years of real daily history (38 assets, Coinbase + Nasdaq, integrity-gated). These are measurements of well-documented market regularities — the things that are actually true about markets, as opposed to the "secret edge" fantasy. Nothing here predicts; everything here is reproducible: `./scripts/insights.sh`.*');
  L.push('');

  // ---- 1. Fat tails ----
  const tails = {};
  for (const sym of ['BTC-USD', 'SPY', 'NVDA']) {
    const u = get(sym);
    if (u) tails[sym] = tailStats(simpleReturns(u.bars.map((b) => b.close)));
  }
  out.studies.fatTails = tails;
  L.push('## 1 · Returns are fat-tailed — Gaussian risk math understates reality');
  L.push('');
  L.push('| Asset | Excess kurtosis (0 = normal) | Worst day | 3σ days observed | 3σ days a normal distribution predicts |');
  L.push('|---|---|---|---|---|');
  for (const [sym, t] of Object.entries(tails)) {
    L.push(`| ${sym} | ${num(t.excessKurtosis)} | ${pct(t.worstDay)} | ${t.beyond3Sigma} | ${num(t.gaussianExpected3Sigma, 1)} |`);
  }
  L.push('');
  L.push('**What it means:** every asset shows positive excess kurtosis — extreme days happen far more often than bell-curve math allows. Any risk model (or position size) calibrated to "normal" volatility will be blindsided by the tails. This is why the engine sizes positions off a hard risk cap, not off average volatility.');
  L.push('');

  // ---- 2. Return concentration ----
  const conc = {};
  for (const sym of ['BTC-USD', 'ETH-USD', 'SPY', 'QQQ', 'NVDA']) {
    const u = get(sym);
    if (u) conc[sym] = returnConcentration(u.bars.map((b) => b.close), 10);
  }
  out.studies.concentration = conc;
  L.push('## 2 · A handful of days carry the returns — and they cluster with the crashes');
  L.push('');
  L.push('| Asset | Full-period return | Missing the 10 BEST days | Missing the 10 WORST days | Best days within ±5d of a worst day |');
  L.push('|---|---|---|---|---|');
  for (const [sym, c] of Object.entries(conc)) {
    L.push(`| ${sym} | ${pct(c.totalReturn)} | ${pct(c.missingBest)} | ${pct(c.missingWorst)} | ${c.bestNearWorstPct != null ? `${(c.bestNearWorstPct * 100).toFixed(0)}%` : 'n/a'} |`);
  }
  L.push('');
  L.push('**What it means:** missing just the 10 best days destroys most (sometimes all) of the return. Missing the 10 worst days would of course be even better — but the last column is why you can\'t have one without the other: it MEASURES how often the best days land within a week of the worst ones. Where that clustering is high, "getting out until things calm down" mechanically forfeits the rebound days too. Perfect foresight of bad days is not on the menu; being absent for the good ones is the realistic cost of trying.');
  L.push('');

  // ---- 3. Volatility clusters, direction does not ----
  const vol = {};
  for (const sym of ['BTC-USD', 'SPY']) {
    const u = get(sym);
    if (u) vol[sym] = volClustering(simpleReturns(u.bars.map((b) => b.close)), 10);
  }
  out.studies.volClustering = vol;
  L.push('## 3 · Volatility is predictable; direction is not');
  L.push('');
  L.push('| Asset | Direction: lag-1 autocorr | Direction: avg lags 1–10 | Volatility (\\|r\\|): lag-1 autocorr | Volatility: avg lags 1–10 |');
  L.push('|---|---|---|---|---|');
  for (const [sym, v] of Object.entries(vol)) {
    L.push(`| ${sym} | ${num(v.rawByLag[0], 3)} | ${num(v.avgRawAutocorr, 3)} | ${num(v.absByLag[0], 3)} | ${num(v.avgAbsAutocorr, 3)} |`);
  }
  L.push('');
  L.push('**What it means:** yesterday\'s return says little about which WAY today goes (direction autocorrelation small, slightly negative here — mild mean reversion at best), but yesterday\'s SIZE of move says a lot about today\'s size (volatility autocorrelation several times larger, and it persists across lags). This asymmetry is the closest thing to a free, robust "truth" in market data — and note what it implies: the predictable quantity (risk) is the one honest systems manage, while the unpredictable one (direction) is the one hype systems claim to know.');
  L.push('');

  // ---- 4. Correlations rise under stress ----
  const pairs = [
    ['BTC-USD', 'ETH-USD'],
    ['BTC-USD', 'SPY'],
    ['SPY', 'QQQ'],
    ['SPY', 'TLT'],
    ['SPY', 'GLD'],
  ];
  const corr = {};
  for (const [a, b] of pairs) {
    const ua = get(a);
    const ub = get(b);
    if (ua && ub) corr[`${a}/${b}`] = stressCorrelation(ua.bars, ub.bars);
  }
  out.studies.stressCorrelation = corr;
  L.push('## 4 · Diversification weakens exactly when you need it');
  L.push('');
  L.push('| Pair | Calm-day correlation | Stress-day correlation (top-quartile moves) |');
  L.push('|---|---|---|');
  for (const [k, s] of Object.entries(corr)) {
    L.push(`| ${k} | ${num(s.calmCorr)} | ${num(s.stressCorr)} |`);
  }
  L.push('');
  L.push('**What it means:** where correlations rise on stress days (they usually do for risk assets), the portfolio "diversification" you measured in calm markets partially evaporates in crashes. Pairs that hold near-zero stress correlation (see SPY/TLT and SPY/GLD in the table — check the table, not the folklore) are the scarce, valuable kind.');
  L.push('');
  L.push('*Methodology caveat, stated because honesty applies to our own tables too: conditioning on large joint moves mechanically inflates a conditional correlation even when the true dependence is constant (Boyer–Gibson–Loretan). Part of each calm→stress gap is that selection artifact rather than a regime change — the cross-pair COMPARISON (risk pairs jumping vs. hedge pairs staying flat) is the robust reading, not the absolute gap sizes. Mixed-calendar pairs (BTC/SPY) are computed over identical shared-date intervals so weekends don\'t bias the estimate.*');
  L.push('');

  // ---- 5. Cross-sectional momentum on OUR universe ----
  const crypto = universe.filter((u) => u.assetClass === 'crypto');
  const equities = universe.filter((u) => u.assetClass !== 'crypto');
  const momCrypto = crossSectionalMomentum(crypto, { periodsPerYear: 365 });
  const momEquity = crossSectionalMomentum(equities, { periodsPerYear: 252 });
  out.studies.momentum = { crypto: momCrypto, equities: momEquity };
  L.push('## 5 · Did past winners keep winning here? (the screen\'s premise, tested)');
  L.push('');
  L.push('Classic 12-1 momentum (the 11-month return ending one month before entry), monthly rebalance, top vs bottom quartile, no fitted parameters:');
  L.push('');
  L.push('| Universe | Top-quartile (past winners) | Bottom-quartile (past losers) | Equal-weight all | Months top beat bottom |');
  L.push('|---|---|---|---|---|');
  for (const [name, m] of [['16 crypto', momCrypto], ['22 equities/ETFs', momEquity]]) {
    if (!m.insufficientData) {
      L.push(`| ${name} | ${pct(m.topQuartileReturn)} | ${pct(m.bottomQuartileReturn)} | ${pct(m.equalWeightReturn)} | ${(m.topBeatBottomPct * 100).toFixed(0)}% |`);
    }
  }
  L.push('');
  const momVerdict = [];
  for (const [name, m] of [['crypto', momCrypto], ['equities', momEquity]]) {
    if (!m.insufficientData) {
      momVerdict.push(
        m.topQuartileReturn > m.bottomQuartileReturn
          ? `in ${name}, past winners beat past losers (${pct(m.topQuartileReturn)} vs ${pct(m.bottomQuartileReturn)})`
          : `in ${name}, past winners LAGGED past losers (${pct(m.topQuartileReturn)} vs ${pct(m.bottomQuartileReturn)})`
      );
    }
  }
  L.push(`**What it means:** this is the honest test of the dashboard screen's core premise on our own data, and the result cuts however it cuts: ${momVerdict.join('; ')}. Factor premia are noisy and episodic, and three years is a short sample — which is precisely why a screen built on momentum must be treated as a tilt, not a truth. The equal-weight column shows how much of everything is just market beta. Where our own screen's premise fails on our own data, we say so.`);
  L.push('');

  // ---- 6. Luck vs skill ----
  const luck = {};
  for (const sym of ['BTC-USD', 'SPY']) {
    const u = get(sym);
    if (u) {
      const bt = runBacktest(u.bars, {}, { barsPerYear: u.periodsPerYear });
      luck[sym] = {
        ...luckBenchmark(u.bars, bt.trades, { n: 2000 }),
        sizedBacktestReturn: bt.metrics.totalReturn,
      };
    }
  }
  out.studies.luck = luck;
  L.push('## 6 · Is the strategy distinguishable from luck? (usually: no)');
  L.push('');
  L.push('2,000 random traders per asset — same number of trades, same durations, random timing and direction, same costs. To make the comparison like-for-like, the real strategy\'s trades are replayed at unit notional on the same basis as the random traders (its actual risk-sized backtest return, shown in parentheses, is smaller):');
  L.push('');
  L.push('| Asset | Trend strategy, unit-notional replay (actual sized backtest) | Random-trader median | Random 95th percentile | Strategy\'s percentile among random |');
  L.push('|---|---|---|---|---|');
  for (const [sym, l] of Object.entries(luck)) {
    if (!l.insufficientData) {
      const p = Math.round(l.percentile * 100);
      const suffix = p % 10 === 1 && p !== 11 ? 'st' : p % 10 === 2 && p !== 12 ? 'nd' : p % 10 === 3 && p !== 13 ? 'rd' : 'th';
      L.push(`| ${sym} | ${pct(l.realReturn)} (${pct(l.sizedBacktestReturn)}) | ${pct(l.randomMedian)} | ${pct(l.randomP95)} | ${p}${suffix} |`);
    }
  }
  L.push('');
  L.push('**What it means:** a strategy below the ~95th percentile of random traders is statistically indistinguishable from luck. This is the test every "look at my bot\'s returns" screenshot silently fails — with enough random traders, some always look brilliant. Survivors post; the rest delete their accounts.');
  L.push('');
  L.push('---');
  L.push('');
  L.push('## The system these truths actually support');
  L.push('');
  L.push('Put together, the measurements point to an investment approach that is boring, robust, and honest:');
  L.push('');
  L.push('1. **Size for the tails you measured, not the average day** (Study 1) — hard risk caps, not vol-calibrated leverage.');
  L.push('2. **Stay invested; do not time** (Study 2) — the measured clustering of best days around worst days means exiting after pain forfeits the rebounds that carry the whole return.');
  L.push('3. **Manage risk, not direction** (Study 3) — the predictable thing is how wild markets are, not where they go.');
  L.push('4. **Diversify with stress correlations, not calm ones** (Study 4).');
  L.push('5. **Treat factor tilts as tilts, not truths** (Study 5) — small, patient, and allowed to fail for years.');
  L.push('6. **Demand luck-adjusted evidence from any active claim** (Study 6) — including your own.');
  L.push('');
  L.push('*None of this promises returns. It is the empirical case for why nobody can honestly promise them — and what a sane system does instead.*');
  L.push('');

  await writeFile(path.resolve(process.cwd(), 'INSIGHTS.md'), L.join('\n'));
  await writeFile(
    path.resolve(process.cwd(), 'src/data/insights.json'),
    JSON.stringify(out, null, 1)
  );
  console.log('Wrote INSIGHTS.md and src/data/insights.json');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
