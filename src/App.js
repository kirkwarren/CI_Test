import React, { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip as ChartTooltip,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import {
  ShieldAlert,
  TriangleAlert,
  Activity,
  TrendingDown,
  Dice5,
  Layers,
  FlaskConical,
} from 'lucide-react';
import { runFullAnalysis } from './engine';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ChartTooltip,
  Filler
);

const fmtPct = (x) => `${x >= 0 ? '+' : ''}${(x * 100).toFixed(1)}%`;
const fmtMoney = (x) =>
  x.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const PIPELINE = [
  { id: 'scan', label: 'Scan', note: 'read indicators' },
  { id: 'detect', label: 'Detect', note: 'EMA cross + trend' },
  { id: 'validate', label: 'Validate', note: 'RSI + vol filter' },
  { id: 'size', label: 'Size', note: 'fractional Kelly' },
  { id: 'fill', label: 'Fill', note: 'fees + slippage' },
  { id: 'settle', label: 'Settle', note: 'realize P&L' },
];

function StatCard({ label, value, tone = 'neutral', sub }) {
  const toneClass =
    tone === 'good'
      ? 'text-emerald-400'
      : tone === 'bad'
      ? 'text-rose-400'
      : 'text-zinc-100';
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="text-[11px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className={`mt-1 text-2xl font-semibold tabular-nums ${toneClass}`}>{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-zinc-500">{sub}</div>}
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange, format }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="flex justify-between text-[11px] uppercase tracking-wider text-zinc-500">
        <span>{label}</span>
        <span className="tabular-nums text-zinc-300">{format(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="accent-emerald-500"
      />
    </label>
  );
}

export default function App() {
  const [riskPerTrade, setRiskPerTrade] = useState(0.02);
  const [kellyMult, setKellyMult] = useState(0.25);
  const [takeProfitR, setTakeProfitR] = useState(2.0);
  const [feeBps, setFeeBps] = useState(5);

  const analysis = useMemo(
    () =>
      runFullAnalysis({
        bars: 1500,
        mcPaths: 3000,
        params: { takeProfitR },
        config: {
          maxRiskPerTrade: riskPerTrade,
          kellyMultiplier: kellyMult,
          feeBps,
          slippageBps: feeBps,
        },
      }),
    [riskPerTrade, kellyMult, takeProfitR, feeBps]
  );

  const m = analysis.primary.metrics;
  const mc = analysis.monteCarlo;

  const up = m.totalReturn >= 0;

  // Downsample equity curve for a light chart.
  const equityChart = useMemo(() => {
    const eq = analysis.primary.equityCurve;
    const stride = Math.max(1, Math.floor(eq.length / 240));
    const labels = [];
    const values = [];
    for (let i = 0; i < eq.length; i += stride) {
      labels.push(i);
      values.push(eq[i]);
    }
    return {
      labels,
      datasets: [
        {
          data: values,
          borderColor: up ? '#34d399' : '#fb7185',
          backgroundColor: up ? 'rgba(52,211,153,0.12)' : 'rgba(251,113,133,0.12)',
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
          tension: 0.25,
        },
      ],
    };
  }, [analysis, up]);

  // Monte Carlo ending-equity histogram.
  const mcChart = useMemo(() => {
    if (mc.insufficientData) return null;
    const endings = mc.endings;
    const min = endings[0];
    const max = endings[endings.length - 1];
    const buckets = 24;
    const width = (max - min) / buckets || 1;
    const start = analysis.config.startingEquity;
    const labels = [];
    const counts = [];
    const colors = [];
    for (let b = 0; b < buckets; b++) {
      const center = min + b * width + width / 2;
      labels.push(`$${(center / 1000).toFixed(0)}k`);
      counts.push(0);
      colors.push(center < start ? '#fb7185' : '#34d399');
    }
    for (const e of endings) {
      const b = Math.min(buckets - 1, Math.floor((e - min) / width));
      counts[b]++;
    }
    return {
      labels,
      datasets: [{ data: counts, backgroundColor: colors, borderWidth: 0 }],
    };
  }, [mc, analysis]);

  const profitable = analysis.grid.filter((g) => g.totalReturn > 0);

  const axisColor = '#71717a';
  const equityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (c) => fmtMoney(c.parsed.y) },
      },
    },
    scales: {
      x: { display: false },
      y: {
        ticks: { color: axisColor, callback: (v) => `$${(v / 1000).toFixed(1)}k` },
        grid: { color: 'rgba(63,63,70,0.4)' },
      },
    },
  };
  const mcOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (c) => `${c.parsed.y} paths` } },
    },
    scales: {
      x: { ticks: { color: axisColor, maxTicksLimit: 6 }, grid: { display: false } },
      y: { display: false },
    },
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-100">
              HONEST QUANT · Backtest &amp; Risk Lab
            </h1>
            <p className="text-xs text-zinc-500">
              The real machinery behind the hype — Scan → Detect → Validate → Size → Fill → Settle
            </p>
          </div>
          <span className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
            SIMULATED DATA · NOT FINANCIAL ADVICE
          </span>
        </div>

        {/* Reality-check banner */}
        <div className="mt-4 flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div className="space-y-1 text-amber-100/90">
            <p className="font-semibold text-amber-200">
              Why this looks like that viral screenshot — but tells the truth.
            </p>
            <p className="text-amber-100/70">
              The "+2,140% in 42 days" wallet is marketing theater. This tool runs the same kind of
              strategy pipeline on <strong>simulated</strong> market data with realistic fees and
              slippage, then shows you the numbers those posts hide: drawdowns, and the{' '}
              <strong>probability of losing money</strong>. Tune the knobs and watch how fragile the
              "edge" really is.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Slider
            label="Risk / trade (hard cap)"
            value={riskPerTrade}
            min={0.005}
            max={0.05}
            step={0.005}
            onChange={setRiskPerTrade}
            format={(v) => `${(v * 100).toFixed(1)}%`}
          />
          <Slider
            label="Kelly fraction"
            value={kellyMult}
            min={0.1}
            max={1}
            step={0.05}
            onChange={setKellyMult}
            format={(v) => `${v.toFixed(2)}×`}
          />
          <Slider
            label="Take-profit (R)"
            value={takeProfitR}
            min={1}
            max={4}
            step={0.25}
            onChange={setTakeProfitR}
            format={(v) => `${v.toFixed(2)}R`}
          />
          <Slider
            label="Fee + slippage / side"
            value={feeBps}
            min={0}
            max={20}
            step={1}
            onChange={setFeeBps}
            format={(v) => `${v} bps`}
          />
        </div>

        {/* Headline stats — honest */}
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <StatCard
            label="Total Return"
            value={fmtPct(m.totalReturn)}
            tone={m.totalReturn >= 0 ? 'good' : 'bad'}
            sub={`${fmtMoney(m.startingEquity)} → ${fmtMoney(m.endingEquity)}`}
          />
          <StatCard label="Sharpe" value={m.sharpe.toFixed(2)} tone={m.sharpe >= 1 ? 'good' : 'bad'} />
          <StatCard
            label="Max Drawdown"
            value={fmtPct(-m.maxDrawdown)}
            tone="bad"
            sub="worst peak-to-trough"
          />
          <StatCard label="Win Rate" value={`${(m.winRate * 100).toFixed(0)}%`} sub={`${m.trades} trades`} />
          <StatCard
            label="Profit Factor"
            value={Number.isFinite(m.profitFactor) ? m.profitFactor.toFixed(2) : '∞'}
            tone={m.profitFactor >= 1 ? 'good' : 'bad'}
          />
          <StatCard
            label="Expectancy"
            value={`${m.expectancyR.toFixed(2)}R`}
            tone={m.expectancyR >= 0 ? 'good' : 'bad'}
            sub="avg per trade"
          />
        </div>

        {/* Pipeline */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {PIPELINE.map((s, idx) => (
            <React.Fragment key={s.id}>
              <div className="rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2">
                <div className="text-xs font-semibold text-zinc-200">{s.label}</div>
                <div className="text-[10px] text-zinc-500">{s.note}</div>
              </div>
              {idx < PIPELINE.length - 1 && <span className="text-zinc-600">→</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Equity + Monte Carlo */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <Activity className="h-4 w-4 text-emerald-400" /> Equity Curve · {analysis.primary.symbol} (simulated)
            </div>
            <div style={{ height: 220 }}>
              <Line data={equityChart} options={equityOptions} />
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <Dice5 className="h-4 w-4 text-sky-400" /> Monte Carlo · {mc.paths.toLocaleString()} resampled paths
            </div>
            {mc.insufficientData ? (
              <div className="flex h-[220px] items-center justify-center text-sm text-zinc-500">
                Not enough trades to resample.
              </div>
            ) : (
              <>
                <div style={{ height: 180 }}>
                  <Bar data={mcChart} options={mcOptions} />
                </div>
                <div className="mt-2 flex items-center gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  <TrendingDown className="h-4 w-4" />
                  <span>
                    <strong>{(mc.probLoss * 100).toFixed(0)}%</strong> of paths ended{' '}
                    <strong>below</strong> the starting balance. Median worst drawdown{' '}
                    <strong>{fmtPct(-mc.medianMaxDrawdown)}</strong>.
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Robustness grid */}
        <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-200">
            <Layers className="h-4 w-4 text-violet-400" /> Robustness Grid · same strategy, different markets
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-zinc-500">
                  <th className="pb-2 pr-4">Asset</th>
                  <th className="pb-2 pr-4">Return</th>
                  <th className="pb-2 pr-4">Sharpe</th>
                  <th className="pb-2 pr-4">Max DD</th>
                  <th className="pb-2 pr-4">Win %</th>
                  <th className="pb-2 pr-4">Trades</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {analysis.grid.map((g) => (
                  <tr key={g.symbol} className="border-t border-zinc-800/70">
                    <td className="py-1.5 pr-4 font-medium text-zinc-200">{g.symbol}</td>
                    <td className={`py-1.5 pr-4 ${g.totalReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {fmtPct(g.totalReturn)}
                    </td>
                    <td className="py-1.5 pr-4 text-zinc-400">{g.sharpe.toFixed(2)}</td>
                    <td className="py-1.5 pr-4 text-rose-300/80">{fmtPct(-g.maxDrawdown)}</td>
                    <td className="py-1.5 pr-4 text-zinc-400">{(g.winRate * 100).toFixed(0)}%</td>
                    <td className="py-1.5 pr-4 text-zinc-500">{g.trades}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            {profitable.length} of {analysis.grid.length} assets were profitable in this run. An
            influencer would screenshot only the green one and call it a "system." Judging a strategy
            by its single best market is exactly the trap.
          </p>
        </div>

        {/* Walk-forward reality check */}
        {!analysis.walkForward.insufficientData && (
          <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <FlaskConical className="h-4 w-4 text-sky-400" /> Walk-Forward Reality Check ·
              in-sample vs. out-of-sample
            </div>
            <p className="mb-3 text-xs text-zinc-500">
              Parameters are tuned on each in-sample window, then tested on the next
              window the optimizer never saw. This is the test that exposes overfit bots —
              the gap between the two bars is the "overfitting tax."
            </p>
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_1.4fr]">
              <div className="rounded-md border border-zinc-800 bg-zinc-900/60 p-3">
                <div className="text-[11px] uppercase tracking-wider text-zinc-500">
                  Avg In-Sample
                </div>
                <div className="mt-1 text-xl font-semibold text-emerald-400 tabular-nums">
                  {fmtPct(analysis.walkForward.aggregate.avgIsReturn)}
                </div>
                <div className="text-[11px] text-zinc-500">tuned on the past</div>
              </div>
              <div className="rounded-md border border-zinc-800 bg-zinc-900/60 p-3">
                <div className="text-[11px] uppercase tracking-wider text-zinc-500">
                  Avg Out-of-Sample
                </div>
                <div
                  className={`mt-1 text-xl font-semibold tabular-nums ${
                    analysis.walkForward.aggregate.avgOosReturn >= 0
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                  }`}
                >
                  {fmtPct(analysis.walkForward.aggregate.avgOosReturn)}
                </div>
                <div className="text-[11px] text-zinc-500">on unseen data</div>
              </div>
              <div className="flex flex-col justify-center rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
                <div className="text-[11px] uppercase tracking-wider text-amber-300">
                  Overfitting Tax
                </div>
                <div className="mt-1 text-xl font-semibold text-amber-200 tabular-nums">
                  {(analysis.walkForward.aggregate.degradation * 100).toFixed(0)}% of the
                  edge lost
                </div>
                <div className="text-[11px] text-amber-100/70">
                  {analysis.walkForward.aggregate.oosProfitableFolds}/
                  {analysis.walkForward.aggregate.totalFolds} out-of-sample windows were
                  profitable
                </div>
              </div>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-zinc-500">
                    <th className="pb-2 pr-4">Fold</th>
                    <th className="pb-2 pr-4">In-Sample</th>
                    <th className="pb-2 pr-4">Out-of-Sample</th>
                    <th className="pb-2 pr-4">Chosen params</th>
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  {analysis.walkForward.folds.map((f) => (
                    <tr key={f.fold} className="border-t border-zinc-800/70">
                      <td className="py-1.5 pr-4 text-zinc-400">#{f.fold + 1}</td>
                      <td className="py-1.5 pr-4 text-emerald-400/90">
                        {fmtPct(f.inSample.totalReturn)}
                      </td>
                      <td
                        className={`py-1.5 pr-4 ${
                          f.outOfSample.totalReturn >= 0
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {fmtPct(f.outOfSample.totalReturn)}
                      </td>
                      <td className="py-1.5 pr-4 text-[11px] text-zinc-500">
                        stop {f.params.atrStopMult}× · TP {f.params.takeProfitR}R · EMA
                        {f.params.emaFast}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Hype vs reality */}
        <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-200">
            <TriangleAlert className="h-4 w-4 text-amber-400" /> Hype vs. Reality
          </div>
          <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
            <div className="rounded-md border border-rose-500/30 bg-rose-500/5 p-3">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-rose-300">
                The screenshot claims
              </div>
              <ul className="space-y-1 text-zinc-300">
                <li>+2,140% in 42 days · $250,363 all-time</li>
                <li>"95.7% edge confidence" · smooth equity curve</li>
                <li>Only wins shown ("Biggest Win X121")</li>
                <li>Drawdowns &amp; losing paths: never mentioned</li>
              </ul>
            </div>
            <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                What an honest backtest shows
              </div>
              <ul className="space-y-1 text-zinc-300">
                <li>This run: {fmtPct(m.totalReturn)} with a {fmtPct(-m.maxDrawdown)} drawdown</li>
                <li>Confidence is a feature score, not a win probability</li>
                <li>Win rate {(m.winRate * 100).toFixed(0)}% — losses are the norm, not hidden</li>
                <li>Monte Carlo: {(mc.probLoss * 100).toFixed(0)}% chance of ending down</li>
              </ul>
            </div>
          </div>
        </div>

        <footer className="mt-6 border-t border-zinc-800 pt-4 text-xs text-zinc-600">
          Educational tool. Data is synthetically generated in-browser; no live feeds, no real orders,
          no real money. Real markets have costs, latency, and adverse selection this simplified model
          understates. Nothing here is financial advice. See{' '}
          <code className="text-zinc-400">src/engine/</code> for the fully-tested logic.
        </footer>
      </div>
    </div>
  );
}
