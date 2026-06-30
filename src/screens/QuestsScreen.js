import React from 'react';
import { useGame } from '../context/GameContext';
import { Card, Chip, priorityChip, cx } from '../components/ui';
import { Flame, Clock, Gift, Zap, Star, ChevronRight, Sparkles } from 'lucide-react';

const DAILY = [
  { id: 'd1', title: '15-Minute Power Clean', sub: 'Any nearby zone', mins: 15, points: 180, icon: '⚡' },
  { id: 'd2', title: 'Collect 10 pieces', sub: 'Neighborhood streets', mins: 10, points: 120, icon: '🧤' },
  { id: 'd3', title: 'Bag 5 recyclable bottles', sub: 'Sort & dispose', mins: 10, points: 140, icon: '♻️' },
];

const QuestsScreen = ({ onSelectZone }) => {
  const { zones, player } = useGame();
  const open = zones.filter((z) => z.status === 'polluted');
  const quick = [...open].sort((a, b) => a.durationMin - b.durationMin);

  return (
    <div className="px-4 pb-28 pt-2">
      {/* Streak hero */}
      <div className="rounded-[28px] p-[1.5px] bg-gradient-to-r from-sun-500 to-quest-400">
        <div className="rounded-[26px] bg-grime-900 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wide">Daily streak</p>
              <div className="flex items-center gap-2 mt-1">
                <Flame className="h-7 w-7 text-sun-400" />
                <span className="text-white font-black text-3xl tracking-tight">{player.streak}</span>
                <span className="text-white/50 text-sm font-semibold">days</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-[11px]">Next reward in</p>
              <p className="text-quest-300 font-bold text-sm">1 cleanup</p>
            </div>
          </div>
          <div className="mt-3 flex gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className={cx('h-8 flex-1 rounded-xl grid place-items-center text-xs font-bold',
                i < player.streak % 7 || (player.streak >= 7 && i < 6)
                  ? 'bg-sun-500/25 text-sun-400 ring-1 ring-sun-400/40'
                  : 'bg-white/5 text-white/30')}>
                {i < (player.streak % 7 || 6) ? '🔥' : i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Surprise bonus */}
      <Card className="mt-4 flex items-center gap-3 bg-gradient-to-r from-ocean-500/12 to-quest-500/12 ring-ocean-400/20">
        <div className="grid place-items-center h-11 w-11 rounded-2xl bg-ocean-500/20 shrink-0">
          <Zap className="h-6 w-6 text-ocean-400" />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">Double Points Saturday</p>
          <p className="text-white/50 text-[11px]">Every verified cleanup counts 2× until midnight</p>
        </div>
        <Chip className="bg-ocean-500/20 text-ocean-400">2×</Chip>
      </Card>

      {/* Daily rotating quests */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-extrabold text-lg tracking-tight">Daily quests</h2>
          <span className="text-white/40 text-xs">Resets in 8h</span>
        </div>
        <div className="space-y-3">
          {DAILY.map((q) => (
            <Card key={q.id} onClick={() => quick[0] && onSelectZone(quick[0])} className="flex items-center gap-3 py-3">
              <span className="grid place-items-center h-11 w-11 rounded-2xl bg-white/6 text-2xl shrink-0">{q.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm">{q.title}</p>
                <p className="text-white/45 text-[11px]">{q.sub}</p>
                <Chip className="bg-white/8 text-white/60 mt-1.5"><Clock className="h-3 w-3" /> {q.mins}m</Chip>
              </div>
              <div className="text-right shrink-0">
                <p className="text-quest-300 font-extrabold">+{q.points}</p>
                <ChevronRight className="h-4 w-4 text-white/30 ml-auto mt-1" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Rare find */}
      <div className="mt-6">
        <h2 className="text-white font-extrabold text-lg tracking-tight mb-3">Rare find nearby</h2>
        <div className="rounded-3xl p-[1.5px] bg-gradient-to-r from-fuchsia-500 to-ocean-400">
          <div className="rounded-[22px] bg-grime-900 p-4 flex items-center gap-3">
            <div className="relative shrink-0">
              <span className="absolute inset-0 rounded-2xl bg-fuchsia-500/30 animate-pulseGlow" />
              <span className="relative grid place-items-center h-14 w-14 rounded-2xl bg-grime-800 text-3xl animate-floaty">🦦</span>
            </div>
            <div className="flex-1">
              <Chip className="bg-fuchsia-500/15 text-fuchsia-300 ring-1 ring-fuchsia-400/30"><Star className="h-3 w-3" /> Rare</Chip>
              <p className="text-white font-bold text-sm mt-1.5">Rivven the Otter</p>
              <p className="text-white/45 text-[11px]">Appears only after restoring Riverwalk Bend</p>
            </div>
            <Sparkles className="h-6 w-6 text-fuchsia-300" />
          </div>
        </div>
      </div>

      {/* All open missions */}
      <div className="mt-6">
        <h2 className="text-white font-extrabold text-lg tracking-tight mb-3">All open missions</h2>
        <div className="space-y-3">
          {quick.map((zone) => (
            <Card key={zone.id} onClick={() => onSelectZone(zone)} className="flex items-center gap-3 py-3">
              <span className="grid place-items-center h-12 w-12 rounded-2xl bg-grime-700/70 text-2xl shrink-0">{zone.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">{zone.name}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Chip className={priorityChip(zone.priority)}>{zone.priority}</Chip>
                  <Chip className="bg-white/8 text-white/60"><Clock className="h-3 w-3" /> {zone.durationMin}m</Chip>
                </div>
              </div>
              <p className="text-quest-300 font-extrabold shrink-0">+{zone.basePoints}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Accessibility / non-cleanup contributions */}
      <Card className="mt-6 flex items-center gap-3">
        <div className="grid place-items-center h-11 w-11 rounded-2xl bg-quest-500/15 shrink-0">
          <Gift className="h-6 w-6 text-quest-300" />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">Can't walk far today?</p>
          <p className="text-white/50 text-[11px]">Report a litter hotspot, log a disposal station, or organize your crew for points.</p>
        </div>
      </Card>
    </div>
  );
};

export default QuestsScreen;
