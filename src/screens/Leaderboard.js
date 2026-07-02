import React from 'react';
import { useGame } from '../game/GameState';
import { cx, Sheet } from '../ui/bits';
import { Trophy, Clock, ShieldCheck } from 'lucide-react';

const PODIUM_STYLES = [
  { h: 'h-24', ring: 'ring-slate-300', medal: '🥈' },
  { h: 'h-32', ring: 'ring-sun-400', medal: '🥇' },
  { h: 'h-20', ring: 'ring-amber-600', medal: '🥉' },
];

const Leaderboard = ({ onClose }) => {
  const { leaderboard } = useGame();
  const podium = [leaderboard[1], leaderboard[0], leaderboard[2]]; // 2nd, 1st, 3rd
  const rest = leaderboard.slice(3);

  return (
    <Sheet onClose={onClose} tall>
      <div className="px-5 pb-8">
        <div className="text-center mt-1 mb-5">
          <p className="text-sun-400 font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-1.5">
            <Trophy className="h-4 w-4" /> Weekly Cleanup Cup
          </p>
          <h2 className="text-white font-black text-2xl tracking-tight mt-1">Riverton Commons</h2>
          <p className="text-white/45 text-[11px] font-bold mt-1 flex items-center justify-center gap-1">
            <Clock className="h-3 w-3" /> Resets Sunday night · verified cleanups only
          </p>
        </div>

        {/* podium */}
        <div className="flex items-end justify-center gap-3 mb-6">
          {podium.map((p, i) => p && (
            <div key={p.id} className="flex-1 max-w-[110px] text-center">
              <div className="relative inline-block">
                <span className={cx('grid place-items-center h-14 w-14 rounded-full bg-grime-800 ring-[3px] text-2xl mx-auto', PODIUM_STYLES[i].ring, p.you && 'bg-ocean-500')}>
                  {p.avatar}
                </span>
                <span className="absolute -top-2 -right-2 text-lg">{PODIUM_STYLES[i].medal}</span>
              </div>
              <p className={cx('font-black text-[12px] mt-1.5 truncate', p.you ? 'text-quest-300' : 'text-white')}>{p.name}</p>
              <p className="text-white/55 text-[11px] font-bold">{p.points.toLocaleString()}</p>
              <div className={cx('mt-2 rounded-t-xl bg-gradient-to-b from-white/15 to-white/5 ring-1 ring-white/10 grid place-items-start justify-center pt-2', PODIUM_STYLES[i].h)}>
                <span className="text-white/30 font-black text-xl">{p.rank}</span>
              </div>
            </div>
          ))}
        </div>

        {/* the rest */}
        <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 divide-y divide-white/6 overflow-hidden">
          {rest.map((p) => (
            <div key={p.id} className={cx('flex items-center gap-3 px-4 py-3', p.you && 'bg-quest-500/12')}>
              <span className={cx('w-6 text-center font-black text-sm', p.you ? 'text-quest-300' : 'text-white/45')}>{p.rank}</span>
              <span className={cx('grid place-items-center h-10 w-10 rounded-full text-xl', p.you ? 'bg-ocean-500 ring-2 ring-quest-300' : 'bg-white/10')}>{p.avatar}</span>
              <p className={cx('flex-1 font-black text-sm truncate', p.you ? 'text-quest-300' : 'text-white')}>
                {p.name}{p.you && <span className="ml-1.5 rounded-full bg-quest-400 text-quest-900 text-[9px] px-1.5 py-0.5 align-middle">YOU</span>}
              </p>
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
