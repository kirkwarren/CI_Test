import React, { useEffect, useState } from 'react';
import { useGame } from '../game/GameState';
import { play, buzz } from '../game/sound';
import { BigBtn } from './bits';
import { TrendingUp, Trophy } from 'lucide-react';

const CONFETTI = ['#34d399', '#38bdf8', '#fbbf24', '#f472b6', '#a78bfa'];

// Post-encounter celebration: count-up, breakdown, and — the payoff —
// your leaderboard rank change.
const BankedOverlay = () => {
  const { banked, dismissBanked, myRank } = useGame();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!banked) return undefined;
    if (banked.leveled) { setTimeout(() => { play('level'); buzz([40, 60, 40, 60, 120]); }, 600); }
    else if (banked.rankAfter < banked.rankBefore) { setTimeout(() => { play('combo', 4); buzz([30, 50, 80]); }, 600); }
    setShown(0);
    const step = Math.max(1, Math.round(banked.total / 30));
    const t = setInterval(() => setShown((s) => {
      if (s + step >= banked.total) { clearInterval(t); return banked.total; }
      return s + step;
    }), 30);
    return () => clearInterval(t);
  }, [banked]);

  if (!banked) return null;
  const climbed = banked.rankAfter < banked.rankBefore;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-5">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
      {/* confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="absolute top-10 h-2.5 w-2.5 rounded-sm animate-rise"
            style={{ left: `${(i * 41) % 100}%`, backgroundColor: CONFETTI[i % CONFETTI.length], animationDelay: `${(i % 6) * 0.2}s`, transform: `rotate(${i * 31}deg)` }} />
        ))}
      </div>

      <div className="relative w-full max-w-[380px] rounded-[30px] bg-gradient-to-b from-grime-800 to-grime-900 ring-1 ring-quest-400/30 shadow-glow-lg animate-pop p-6 text-center max-h-[90%] overflow-y-auto no-scrollbar">
        <span className="text-5xl block animate-floaty">🎉</span>
        <p className="text-quest-300 font-black text-[11px] uppercase tracking-[0.2em] mt-2">{banked.title} cleaned</p>
        <p className="text-white font-black text-5xl tracking-tight mt-2">+{shown}</p>
        <p className="text-white/50 text-[12px] font-bold">points banked · verified</p>

        {/* rank change — the leaderboard moment */}
        <div className="mt-4 rounded-2xl bg-gradient-to-r from-sun-500/20 to-quest-500/20 ring-1 ring-sun-400/30 p-3.5 flex items-center gap-3">
          <span className="grid place-items-center h-11 w-11 rounded-2xl bg-sun-500/25 shrink-0">
            <Trophy className="h-6 w-6 text-sun-400" />
          </span>
          <div className="text-left flex-1">
            {climbed ? (
              <>
                <p className="text-white font-black text-base leading-tight">#{banked.rankBefore} → #{banked.rankAfter} 🚀</p>
                <p className="text-white/55 text-[11px] font-bold">You climbed the Weekly Cleanup Cup!</p>
              </>
            ) : (
              <>
                <p className="text-white font-black text-base leading-tight">Rank #{myRank}</p>
                <p className="text-white/55 text-[11px] font-bold">Every verified item counts toward the Cup</p>
              </>
            )}
          </div>
        </div>

        {banked.leveled && (
          <div className="mt-2.5 rounded-2xl bg-quest-500/15 ring-1 ring-quest-400/30 p-3.5 flex items-center gap-3 animate-slideUp">
            <TrendingUp className="h-6 w-6 text-quest-300 shrink-0" />
            <p className="text-white font-black text-sm text-left">Level up! You're now <span className="text-quest-300">Level {banked.level}</span></p>
          </div>
        )}

        {/* Trashdex discoveries */}
        {banked.newSpecies && banked.newSpecies.length > 0 && (
          <div className="mt-2.5 rounded-2xl bg-ocean-500/15 ring-1 ring-ocean-400/30 p-3.5 flex items-center gap-3 animate-slideUp">
            <span className="text-2xl shrink-0">📖</span>
            <p className="text-white font-black text-sm text-left">
              New Trashdex entry{banked.newSpecies.length > 1 ? 'ies' : ''}: <span className="text-ocean-400">{banked.newSpecies.join(', ')}</span>
            </p>
          </div>
        )}

        {/* buddy evolution */}
        {banked.buddyUp && (
          <div className="mt-2.5 rounded-2xl bg-fuchsia-500/15 ring-1 ring-fuchsia-400/30 p-3.5 flex items-center gap-3 animate-slideUp">
            <span className="text-2xl shrink-0 animate-floaty">{banked.buddyUp.to.emoji}</span>
            <p className="text-white font-black text-sm text-left">
              Your buddy evolved! {banked.buddyUp.from.emoji} {banked.buddyUp.from.name} → <span className="text-fuchsia-300">{banked.buddyUp.to.name}</span>
            </p>
          </div>
        )}

        {/* breakdown */}
        <div className="mt-4 rounded-2xl bg-white/5 ring-1 ring-white/10 p-3.5 text-left space-y-1.5">
          {banked.breakdown.map((b) => (
            <div key={b.label} className="flex justify-between text-[12px]">
              <span className="text-white/65 font-bold">{b.label}</span>
              <span className="text-white font-black">+{b.pts}</span>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <BigBtn onClick={dismissBanked}>Back to the map</BigBtn>
        </div>
      </div>
    </div>
  );
};

export default BankedOverlay;
