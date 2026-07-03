import React, { useState, useEffect } from 'react';
import { useGame } from '../game/GameState';
import { CLEAN_GOAL, RUSH_MULT } from '../game/data';
import { play, buzz } from '../game/sound';
import { cx, Sheet } from '../ui/bits';
import { Flame, Zap, Gift, Check } from 'lucide-react';

const mmss = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

// The daily loop hub: quests to claim, the rush timer, the streak, and the
// neighborhood cleanliness goal — the "why come back today" screen.
const Today = ({ onClose }) => {
  const { quests, claimQuest, player, cleanliness, rushEndsAt, community } = useGame();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const rushLeft = rushEndsAt - now;

  const claim = (q) => { play('bank'); buzz([25, 40, 50]); claimQuest(q.id); };

  return (
    <Sheet onClose={onClose}>
      <div className="px-5 pb-8">
        <h2 className="text-white font-black text-xl tracking-tight mt-1">Today in Riverton</h2>
        <p className="text-white/45 text-[12px] font-semibold mt-0.5 mb-4">Fresh quests every day — keep the streak alive.</p>

        {/* streak + rush */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className="rounded-2xl bg-sun-500/12 ring-1 ring-sun-400/25 p-3.5">
            <Flame className="h-5 w-5 text-sun-400" />
            <p className="text-white font-black text-xl mt-1">{player.streak} days</p>
            <p className="text-white/50 text-[11px] font-bold">Cleanup streak — one bank a day keeps it</p>
          </div>
          <div className={cx('rounded-2xl p-3.5 ring-1', rushLeft > 0 ? 'bg-fuchsia-500/12 ring-fuchsia-400/25' : 'bg-white/5 ring-white/10')}>
            <Zap className={cx('h-5 w-5', rushLeft > 0 ? 'text-fuchsia-300' : 'text-white/30')} />
            {rushLeft > 0 ? (
              <>
                <p className="text-white font-black text-xl mt-1">×{RUSH_MULT} · {mmss(rushLeft)}</p>
                <p className="text-white/50 text-[11px] font-bold">LITTER RUSH — everything pays double</p>
              </>
            ) : (
              <>
                <p className="text-white/60 font-black text-xl mt-1">Rush over</p>
                <p className="text-white/40 text-[11px] font-bold">Next rush tomorrow 5pm</p>
              </>
            )}
          </div>
        </div>

        {/* daily quests */}
        <p className="text-white font-black text-sm mb-2">Daily quests</p>
        <div className="space-y-2.5 mb-5">
          {quests.map((q) => {
            const done = q.progress >= q.target;
            return (
              <div key={q.id} className={cx('rounded-2xl p-3.5 ring-1 flex items-center gap-3', q.claimed ? 'bg-white/[0.03] ring-white/5' : done ? 'bg-quest-500/12 ring-quest-400/30' : 'bg-white/5 ring-white/10')}>
                <span className={cx('text-2xl shrink-0', q.claimed && 'grayscale opacity-40')}>{q.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={cx('font-black text-[13px]', q.claimed ? 'text-white/35 line-through' : 'text-white')}>{q.label}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden">
                      <div className={cx('h-full rounded-full transition-all duration-500', q.claimed ? 'bg-white/20' : 'bg-gradient-to-r from-quest-400 to-ocean-400')} style={{ width: `${(q.progress / q.target) * 100}%` }} />
                    </div>
                    <span className="text-white/45 text-[10px] font-black shrink-0">{q.progress}/{q.target}</span>
                  </div>
                </div>
                {q.claimed ? (
                  <Check className="h-5 w-5 text-white/25 shrink-0" />
                ) : done ? (
                  <button onClick={() => claim(q)} className="shrink-0 rounded-xl bg-gradient-to-b from-quest-300 to-quest-500 text-quest-900 font-black text-[12px] px-3.5 py-2 active:scale-95 shadow-glow">
                    Claim +{q.reward}
                  </button>
                ) : (
                  <span className="shrink-0 rounded-xl bg-white/8 text-white/50 font-black text-[12px] px-3 py-2">+{q.reward}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* the civic payoff */}
        <div className="rounded-3xl bg-gradient-to-br from-quest-500/15 to-ocean-500/10 ring-1 ring-quest-400/25 p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-white font-black text-sm">🏙️ Neighborhood cleanliness</p>
            <p className="text-quest-300 font-black text-sm">{Math.round(cleanliness)}%</p>
          </div>
          <div className="h-3 rounded-full bg-white/10 overflow-hidden relative">
            <div className="h-full rounded-full bg-gradient-to-r from-quest-400 to-quest-300 shadow-glow transition-all duration-700" style={{ width: `${cleanliness}%` }} />
            <span className="absolute top-0 bottom-0 w-0.5 bg-sun-400" style={{ left: `${CLEAN_GOAL.at}%` }} />
          </div>
          <div className="flex items-start gap-2 mt-2.5">
            <Gift className="h-4 w-4 text-sun-400 mt-0.5 shrink-0" />
            <p className="text-white/65 text-[12px] leading-snug">
              At <b className="text-sun-400">{CLEAN_GOAL.at}%</b>: {CLEAN_GOAL.reward}. Every player's verified cleanup moves this bar.
            </p>
          </div>
        </div>

        {/* community impact — the data the city actually gets */}
        <div className="mt-4 rounded-3xl bg-white/5 ring-1 ring-white/10 p-4">
          <p className="text-white font-black text-sm mb-3">📊 Riverton this week — everyone together</p>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              ['🧤', community.itemsThisWeek.toLocaleString(), 'items cleaned'],
              ['📣', community.hotspots, 'hotspots reported'],
              ['⚠️', community.hazards, 'hazards → city crews'],
              ['🌸', community.blooms, 'zones restored & blooming'],
            ].map(([e, v, l]) => (
              <div key={l} className="rounded-2xl bg-white/5 p-3 flex items-center gap-2.5">
                <span className="text-xl">{e}</span>
                <div>
                  <p className="text-white font-black text-base leading-tight">{v}</p>
                  <p className="text-white/45 text-[10px] font-bold">{l}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-white/35 text-[10px] font-semibold mt-3">
            Verified cleanup data flows to the parks department as an open civic dataset.
          </p>
        </div>
      </div>
    </Sheet>
  );
};

export default Today;
