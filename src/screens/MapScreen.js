import React from 'react';
import { useGame } from '../context/GameContext';
import { Card, Chip, priorityChip, ProgressBar, cx } from '../components/ui';
import { CITY, CITY_CHALLENGES } from '../data/gameData';
import { MapPin, Clock, Flame, Crosshair, Layers } from 'lucide-react';

const ZoneNode = ({ zone, onSelect }) => {
  const restored = zone.status === 'restored';
  return (
    <button
      onClick={() => onSelect(zone)}
      className="absolute -translate-x-1/2 -translate-y-1/2 group"
      style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
      aria-label={zone.name}
    >
      {/* ripple / glow halo */}
      <span
        className={cx(
          'absolute inset-0 m-auto h-10 w-10 rounded-full',
          restored ? 'bg-quest-400/30 animate-pulseGlow' : 'bg-grime-400/20'
        )}
      />
      {!restored && (
        <span className="absolute inset-0 m-auto h-10 w-10 rounded-full bg-sun-400/30 animate-ripple" />
      )}
      <span
        className={cx(
          'relative grid place-items-center h-11 w-11 rounded-full text-lg shadow-lg ring-2 transition-transform group-active:scale-90',
          restored
            ? 'bg-gradient-to-br from-quest-400 to-quest-600 ring-quest-200/70 shadow-glow'
            : 'bg-gradient-to-br from-grime-600 to-grime-800 ring-white/20 grayscale-[35%]'
        )}
      >
        {zone.icon}
      </span>
      {zone.cityPriority && !restored && (
        <span className="absolute -top-1 -right-1 h-4 w-4 grid place-items-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-2 ring-grime-900">
          ★
        </span>
      )}
      <span className="absolute left-1/2 -translate-x-1/2 top-12 whitespace-nowrap text-[10px] font-semibold text-white/70 group-hover:text-white">
        {zone.name}
      </span>
    </button>
  );
};

const MapScreen = ({ onSelectZone }) => {
  const { zones, restoredCount, player } = useGame();
  const total = zones.length;
  const restoration = Math.round((restoredCount / total) * 100);

  return (
    <div className="px-4 pb-28 pt-2">
      {/* Map board */}
      <div className="relative rounded-[28px] overflow-hidden ring-1 ring-white/10 shadow-soft">
        {/* base terrain */}
        <div className="relative h-[360px] w-full bg-[radial-gradient(120%_120%_at_30%_10%,#0e3b2f_0%,#0a2536_45%,#081826_100%)]">
          {/* grid + roads */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.35]" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="34" height="34" patternUnits="userSpaceOnUse">
                <path d="M34 0H0V34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <path d="M0,250 C120,210 220,300 360,240 S620,250 800,200" stroke="rgba(56,189,248,0.35)" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M120,0 C150,120 90,220 160,360" stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M40,120 H360 M40,300 H380" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" strokeLinecap="round" />
          </svg>

          {/* restoration bloom overlay grows with progress */}
          <div
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: restoration / 130,
              background:
                'radial-gradient(60% 60% at 80% 80%, rgba(16,185,129,0.35), transparent 70%), radial-gradient(50% 50% at 18% 75%, rgba(52,211,153,0.3), transparent 70%)',
            }}
          />

          {/* AR HUD chips */}
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <Chip className="glass text-white/90">
              <MapPin className="h-3 w-3 text-quest-300" /> {CITY.name}
            </Chip>
            <Chip className="glass text-white/90">
              <Layers className="h-3 w-3 text-ocean-400" /> AR Live
            </Chip>
          </div>
          <div className="absolute right-3 top-3">
            <Chip className="glass text-white/90">
              <Flame className="h-3 w-3 text-sun-400" /> {player.streak}-day streak
            </Chip>
          </div>

          {/* zones */}
          {zones.map((z) => (
            <ZoneNode key={z.id} zone={z} onSelect={onSelectZone} />
          ))}

          {/* player locator */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-ocean-400/20 animate-ripple" />
            <span className="relative grid place-items-center h-9 w-9 rounded-full bg-ocean-500 ring-2 ring-white/60 shadow-lg text-base animate-floaty">
              {player.avatar}
            </span>
          </div>
        </div>

        {/* restoration bar footer */}
        <div className="glass px-4 py-3 flex items-center gap-3 border-t border-white/10">
          <Crosshair className="h-4 w-4 text-quest-300 shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-white/70 font-semibold">District restoration</span>
              <span className="text-quest-300 font-bold">{restoration}%</span>
            </div>
            <ProgressBar value={restoration} />
          </div>
        </div>
      </div>

      {/* Active city challenge banner */}
      <div className="mt-5">
        <div className={cx('rounded-3xl p-[1.5px] bg-gradient-to-r', CITY_CHALLENGES[0].accent)}>
          <div className="rounded-[22px] bg-grime-900/80 backdrop-blur px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{CITY_CHALLENGES[0].icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">{CITY_CHALLENGES[0].title}</p>
                <p className="text-white/50 text-[11px] truncate">{CITY_CHALLENGES[0].goal}</p>
              </div>
              <Chip className="bg-white/10 text-white/80">
                <Clock className="h-3 w-3" /> {CITY_CHALLENGES[0].daysLeft}d
              </Chip>
            </div>
            <div className="mt-2.5">
              <ProgressBar value={CITY_CHALLENGES[0].progress} gradient="from-ocean-400 to-quest-400" height="h-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Nearby quests list */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-extrabold text-lg tracking-tight">Nearby quests</h2>
          <span className="text-white/40 text-xs">{zones.filter((z) => z.status === 'polluted').length} open</span>
        </div>
        <div className="space-y-3">
          {zones
            .filter((z) => z.status === 'polluted')
            .map((zone) => (
              <Card key={zone.id} onClick={() => onSelectZone(zone)} className="flex items-center gap-3 py-3">
                <span className="grid place-items-center h-12 w-12 rounded-2xl bg-grime-700/70 text-2xl shrink-0">
                  {zone.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-bold text-sm truncate">{zone.name}</p>
                    {zone.cityPriority && <span className="text-rose-400 text-xs">★</span>}
                  </div>
                  <p className="text-white/45 text-[11px] truncate">{zone.type} · {zone.litterDensity} litter</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Chip className={priorityChip(zone.priority)}>{zone.priority}</Chip>
                    <Chip className="bg-white/8 text-white/70">
                      <Clock className="h-3 w-3" /> {zone.durationMin}m
                    </Chip>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-quest-300 font-extrabold text-base leading-none">+{zone.basePoints}</p>
                  <p className="text-white/40 text-[10px] mt-1">impact</p>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MapScreen;
