import React from 'react';
import { useGame } from '../context/GameContext';
import { PrimaryButton, cx } from './ui';
import { rankForLevel } from '../data/gameData';
import { Sparkles, TrendingUp, Share2, X } from 'lucide-react';

const Confetti = () => {
  const pieces = Array.from({ length: 22 });
  const colors = ['#34d399', '#0ea5e9', '#fbbf24', '#f472b6', '#a78bfa'];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => {
        const left = (i * 37) % 100;
        const delay = (i % 7) * 0.18;
        const color = colors[i % colors.length];
        return (
          <span
            key={i}
            className="absolute top-8 h-2.5 w-2.5 rounded-sm animate-rise"
            style={{
              left: `${left}%`,
              backgroundColor: color,
              animationDelay: `${delay}s`,
              transform: `rotate(${i * 33}deg)`,
            }}
          />
        );
      })}
    </div>
  );
};

const RewardOverlay = () => {
  const { reward, dismissReward, showToast } = useGame();
  if (!reward) return null;

  const { zone, totalPoints, breakdown, leveledUp, newLevel, earnedBadges, spirit, sorted } = reward;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <Confetti />
      <div className="relative w-full max-w-[420px] max-h-[92vh] overflow-y-auto no-scrollbar rounded-[32px] bg-gradient-to-b from-grime-800 to-grime-900 ring-1 ring-quest-400/30 shadow-glow-lg animate-pop">
        <button onClick={dismissReward} className="absolute right-4 top-4 grid place-items-center h-9 w-9 rounded-full bg-white/8 text-white/60 active:scale-90 z-10">
          <X className="h-4.5 w-4.5" />
        </button>

        <div className="px-6 pt-8 pb-6 text-center">
          {/* zone transform visual */}
          <div className="relative mx-auto h-24 w-24">
            <span className="absolute inset-0 rounded-full bg-quest-400/30 animate-pulseGlow" />
            <div className="relative grid place-items-center h-24 w-24 rounded-full bg-gradient-to-br from-quest-400 to-quest-600 ring-4 ring-quest-200/40 shadow-glow text-4xl">
              {zone.icon}
            </div>
            <Sparkles className="absolute -right-1 -top-1 h-7 w-7 text-sun-400 animate-floaty" />
          </div>

          <p className="text-quest-300 font-bold text-xs uppercase tracking-widest mt-4">Zone restored</p>
          <h2 className="text-white font-black text-2xl tracking-tight mt-1">{zone.name}</h2>
          <p className="text-white/50 text-sm mt-1">is now vibrant, green & alive again 🌱</p>

          {/* points */}
          <div className="mt-5 inline-flex flex-col items-center">
            <span className="text-white/45 text-xs font-semibold uppercase tracking-wide">Impact earned</span>
            <span className="text-white font-black text-5xl tracking-tight mt-1">+{totalPoints}</span>
          </div>

          {/* breakdown */}
          <div className="mt-5 rounded-3xl bg-white/5 ring-1 ring-white/10 p-4 text-left">
            <p className="text-white/60 text-[11px] font-bold uppercase tracking-wide mb-2.5">Impact Score breakdown</p>
            <div className="space-y-2">
              {breakdown.map((b) => (
                <div key={b.key} className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                  <span className="text-white/70 text-[12px] flex-1 truncate">{b.label}</span>
                  <span className="text-white font-bold text-[12px]">+{b.points}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-white/8 flex items-center gap-2 text-[11px] text-quest-300">
              {sorted ? '♻️ Recycling bonus applied' : 'Tip: sort recyclables next time for +20%'}
            </div>
          </div>

          {/* level up */}
          {leveledUp && (
            <div className="mt-4 rounded-3xl bg-gradient-to-r from-sun-500/20 to-quest-500/20 ring-1 ring-sun-400/30 p-4 flex items-center gap-3 animate-slideUp">
              <div className="grid place-items-center h-12 w-12 rounded-2xl bg-sun-500/25 shrink-0">
                <TrendingUp className="h-6 w-6 text-sun-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-black text-base">Level {newLevel}!</p>
                <p className="text-white/55 text-[12px]">New rank: {rankForLevel(newLevel)}</p>
              </div>
            </div>
          )}

          {/* eco spirit */}
          {spirit && (
            <div className="mt-4 rounded-3xl bg-gradient-to-r from-ocean-500/20 to-quest-500/20 ring-1 ring-ocean-400/30 p-4 flex items-center gap-3 animate-slideUp">
              <div className="grid place-items-center h-12 w-12 rounded-2xl bg-ocean-500/20 text-3xl shrink-0 animate-floaty">
                {spirit.emoji}
              </div>
              <div className="text-left">
                <p className="text-ocean-400 font-bold text-[11px] uppercase tracking-wide">{spirit.rarity} Eco Spirit unlocked</p>
                <p className="text-white font-black text-base">{spirit.name}</p>
                <p className="text-white/45 text-[11px]">Native to {zone.type.toLowerCase()} habitats</p>
              </div>
            </div>
          )}

          {/* badges */}
          {earnedBadges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {earnedBadges.map((b) => (
                <div key={b.id} className="rounded-2xl bg-white/5 ring-1 ring-white/10 px-3 py-2 flex items-center gap-2 animate-slideUp">
                  <span className="text-xl">{b.icon}</span>
                  <div className="text-left">
                    <p className="text-white font-bold text-[12px] leading-none">{b.name}</p>
                    <p className="text-white/40 text-[10px]">{b.tier} badge</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 space-y-2.5">
            <PrimaryButton onClick={dismissReward}>Keep questing</PrimaryButton>
            <button
              onClick={() => { showToast('Impact card shared to your story', '📲'); dismissReward(); }}
              className={cx('w-full rounded-2xl py-3 font-bold text-sm text-white/80 bg-white/8 active:scale-[0.98] transition flex items-center justify-center gap-2')}
            >
              <Share2 className="h-4 w-4" /> Share before / after
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardOverlay;
