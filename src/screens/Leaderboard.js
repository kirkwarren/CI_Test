import React, { useRef, useState, useEffect } from 'react';
import { useGame } from '../game/GameState';
import { cx, Sheet } from '../ui/bits';
import { Trophy, Clock, ShieldCheck, ChevronUp, ChevronDown, BadgeCheck } from 'lucide-react';

// live countdown to the weekly reset (Sunday midnight local)
const untilReset = () => {
  const now = new Date();
  const reset = new Date(now);
  reset.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
  reset.setHours(0, 0, 0, 0);
  const ms = reset - now;
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${d}d ${h}h ${String(m).padStart(2, '0')}m`;
};

// Podium art: glossy medal-toned blocks + gradient avatar rings.
const PODIUM = [
  { h: 'h-24', block: 'from-slate-100 via-slate-300 to-slate-500', ring: 'from-slate-200 to-slate-500', medal: '🥈' },
  { h: 'h-32', block: 'from-yellow-100 via-sun-400 to-amber-600', ring: 'from-yellow-200 to-sun-500', medal: '🥇' },
  { h: 'h-20', block: 'from-orange-200 via-amber-500 to-amber-800', ring: 'from-orange-200 to-amber-700', medal: '🥉' },
];

const Leaderboard = ({ onClose }) => {
  const { leaderboard } = useGame();
  const podium = [leaderboard[1], leaderboard[0], leaderboard[2]]; // 2nd, 1st, 3rd
  const rest = leaderboard.slice(3);

  // snapshot ranks at open → live ▲/▼ movement while the sheet is up
  const snapRef = useRef(null);
  if (!snapRef.current) snapRef.current = Object.fromEntries(leaderboard.map((r) => [r.id, r.rank]));
  const moveOf = (r) => {
    const was = snapRef.current[r.id];
    return was === undefined ? 0 : was - r.rank; // + = climbed
  };

  const [reset, setReset] = useState(untilReset());
  useEffect(() => {
    const t = setInterval(() => setReset(untilReset()), 30000);
    return () => clearInterval(t);
  }, []);

  // the chase: how far to the player directly above you
  const me = leaderboard.find((r) => r.you);
  const ahead = leaderboard.find((r) => r.rank === me.rank - 1);
  const gap = ahead ? ahead.points - me.points + 1 : 0;
  const bottles = Math.max(1, Math.ceil(gap / 12));

  const Move = ({ r }) => {
    const m = moveOf(r);
    if (m > 0) return <span className="flex items-center text-quest-300 text-[10px] font-black"><ChevronUp className="h-3.5 w-3.5" />{m}</span>;
    if (m < 0) return <span className="flex items-center text-rose-400 text-[10px] font-black"><ChevronDown className="h-3.5 w-3.5" />{-m}</span>;
    return <span className="w-3.5 text-white/20 text-[10px] text-center font-black">·</span>;
  };

  return (
    <Sheet onClose={onClose} tall>
      <div className="px-5 pb-8">
        <div className="text-center mt-1 mb-5">
          <p className="text-sun-400 font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-1.5">
            <Trophy className="h-4 w-4" /> Weekly Cleanup Cup
          </p>
          <h2 className="font-black text-2xl tracking-tight mt-1 bg-gradient-to-r from-quest-300 via-white to-ocean-400 bg-clip-text text-transparent">
            Riverton Commons
          </h2>
          <p className="text-white/45 text-[11px] font-bold mt-1 flex items-center justify-center gap-1">
            <Clock className="h-3 w-3" /> Resets in <span className="text-sun-400">{reset}</span> · verified cleanups only
          </p>
        </div>

        {/* the chase — your next target, in bottles */}
        {ahead && (
          <div className="mb-5 rounded-3xl p-[2px] bg-gradient-to-r from-quest-400 to-ocean-500 shadow-card">
            <div className="rounded-[22px] bg-grime-900 px-4 py-3 flex items-center gap-3">
              <span className="grid place-items-center h-10 w-10 rounded-full bg-white/10 text-xl shrink-0">{ahead.avatar}</span>
              <p className="flex-1 text-white/80 text-[12.5px] font-bold leading-snug">
                <b className="text-white">{gap} pts</b> to pass <b className="text-white">{ahead.name}</b> for
                <b className="text-sun-400"> #{ahead.rank}</b> — that's about <b className="text-quest-300">{bottles} bottle{bottles > 1 ? 's' : ''} 🍾</b>
              </p>
            </div>
          </div>
        )}

        {/* podium */}
        <div className="flex items-end justify-center gap-3 mb-6">
          {podium.map((p, i) => p && (
            <div key={p.id} className="flex-1 max-w-[110px] text-center">
              <div className="relative inline-block">
                {i === 1 && <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xl drop-shadow animate-floaty">👑</span>}
                <span className={cx('inline-block rounded-full p-[3px] bg-gradient-to-b shadow-card', PODIUM[i].ring)}>
                  <span className={cx('grid place-items-center h-14 w-14 rounded-full text-2xl', p.you ? 'bg-ocean-500' : 'bg-grime-800')}>
                    {p.avatar}
                  </span>
                </span>
                <span className="absolute -bottom-1 -right-1.5 text-xl drop-shadow">{PODIUM[i].medal}</span>
              </div>
              <p className={cx('font-black text-[12px] mt-2 truncate', p.you ? 'text-quest-300' : 'text-white')}>{p.name}</p>
              <p className="text-white/55 text-[11px] font-bold">{p.points.toLocaleString()}</p>
              <div className={cx('relative mt-2 rounded-t-2xl bg-gradient-to-b overflow-hidden', PODIUM[i].h, PODIUM[i].block)}>
                {/* gloss + edge */}
                <span className="absolute inset-x-0 top-0 h-1/3 bg-white/40" style={{ borderRadius: '16px 16px 50% 50%/16px 16px 12px 12px' }} />
                <span className="absolute inset-0 grid place-items-start justify-center pt-3 font-black text-2xl text-black/30">{p.rank}</span>
              </div>
            </div>
          ))}
        </div>

        {/* the rest */}
        <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 divide-y divide-white/6 overflow-hidden">
          {rest.map((p) => (
            <div key={p.id} className={cx('flex items-center gap-2.5 px-3.5 py-3', p.you && 'bg-quest-500/12')}>
              <span className={cx('w-5 text-center font-black text-sm', p.you ? 'text-quest-300' : 'text-white/45')}>{p.rank}</span>
              <Move r={p} />
              <span className={cx('rounded-full p-[2.5px] bg-gradient-to-b shadow-card', p.you ? 'from-quest-300 to-ocean-500' : 'from-white/25 to-white/5')}>
                <span className={cx('grid place-items-center h-9 w-9 rounded-full text-lg', p.you ? 'bg-ocean-500' : 'bg-grime-800')}>{p.avatar}</span>
              </span>
              <p className={cx('flex-1 font-black text-sm truncate', p.you ? 'text-quest-300' : 'text-white')}>
                {p.name}{p.you && <span className="ml-1.5 rounded-full bg-quest-400 text-quest-900 text-[9px] px-1.5 py-0.5 align-middle">YOU</span>}
              </p>
              <BadgeCheck className="h-4 w-4 text-quest-300/80 shrink-0" aria-label="camera-verified & bin-scanned" />
              <p className="text-white font-black text-sm">{p.points.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-white/35 text-[11px] font-semibold mt-4 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-quest-300" />
          Only camera-verified, bin-scanned cleanups score. Suspicious accounts never reach this board.
        </p>
      </div>
    </Sheet>
  );
};

export default Leaderboard;
