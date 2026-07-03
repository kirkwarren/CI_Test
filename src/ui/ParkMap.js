import React from 'react';
import { useGame } from '../game/GameState';
import { REACH, buddyStage } from '../game/data';
import { cx } from './bits';

// The Riverton Commons map, reused at two scales: the corner PiP (compact)
// and the expanded navigator. Renders terrain, spawns, golden highlight,
// the player + buddy, and the reach ring.
const ParkMap = ({ compact = false, onSelectSpawn, selectedId }) => {
  const { spawns, pos, goldenId, buddyXp } = useGame();
  const buddy = buddyStage(buddyXp);

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: 'linear-gradient(160deg,#7ec97e 0%,#69bd77 40%,#57b287 100%)' }}>
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <g fill="#4ea862" opacity="0.8">
          <ellipse cx="14" cy="12" rx="14" ry="9" />
          <ellipse cx="88" cy="40" rx="12" ry="14" />
          <ellipse cx="30" cy="90" rx="18" ry="10" />
          <ellipse cx="70" cy="8" rx="10" ry="6" />
        </g>
        <path d="M-4,34 C 18,30 30,44 48,40 S 80,26 106,32 L 106,44 C 82,38 66,52 48,52 S 16,42 -4,46 Z" fill="#5ec8e8" opacity="0.9" />
        <path d="M8,100 C 22,74 40,70 46,52 C 52,36 44,22 54,0" fill="none" stroke="#e8d9ae" strokeWidth="3.4" strokeLinecap="round" opacity="0.95" />
        <path d="M0,66 C 24,62 52,68 74,60 S 96,50 104,54" fill="none" stroke="#e8d9ae" strokeWidth="2.6" strokeLinecap="round" opacity="0.9" />
        <circle cx="30" cy="30" r="6" fill="#dfd2a8" opacity="0.95" />
        <circle cx="30" cy="30" r="2" fill="#5ec8e8" />
      </svg>

      {/* reach ring */}
      <div
        className="absolute rounded-full border-2 border-white/50 bg-white/10 pointer-events-none transition-all duration-100"
        style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: `${REACH * 2}%`, aspectRatio: '1', transform: 'translate(-50%,-50%)' }}
      />

      {/* spawns */}
      {spawns.map((s) => {
        const cleaned = s.status === 'cleaned';
        const golden = s.id === goldenId;
        const near = Math.hypot(s.x - pos.x, s.y - pos.y) <= REACH;
        return (
          <button
            key={s.id}
            disabled={cleaned || !onSelectSpawn}
            onClick={() => onSelectSpawn && onSelectSpawn(s)}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          >
            {cleaned ? (
              <span className={cx('block drop-shadow', compact ? 'text-[10px]' : 'text-xl')}>✨</span>
            ) : (
              <span className="relative block">
                {golden && !compact && <span className="absolute inset-0 -m-1.5 rounded-full bg-sun-400/50 animate-ripple" />}
                <span className={cx(
                  'relative grid place-items-center rounded-full shadow-card ring-2 transition',
                  compact ? 'h-5 w-5 text-[10px]' : 'h-10 w-10 text-lg ring-[3px]',
                  golden ? 'bg-gradient-to-b from-yellow-100 to-sun-400 ring-sun-500 animate-pulseGlow'
                    : near ? 'bg-white ring-quest-400' : 'bg-white/75 ring-white/50 grayscale-[40%]',
                  selectedId === s.id && 'scale-125 ring-ocean-400'
                )}>
                  {s.emoji}
                </span>
                {golden && !compact && (
                  <span className="absolute -top-1.5 -right-1.5 rounded-full bg-sun-400 text-grime-900 text-[8px] font-black px-1 ring-1 ring-white">×3</span>
                )}
              </span>
            )}
          </button>
        );
      })}

      {/* player + buddy */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-100" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
        {!compact && <span className="absolute inset-0 -m-2 rounded-full bg-ocean-400/30 animate-ripple" />}
        <span className={cx('relative grid place-items-center rounded-full bg-ocean-500 ring-2 ring-white shadow-card', compact ? 'h-4 w-4 text-[8px]' : 'h-9 w-9 text-lg ring-[3px]')}>
          {compact ? '' : '🧑‍🚀'}
        </span>
        {!compact && <span className="absolute -right-5 top-4 text-sm animate-floaty drop-shadow">{buddy.emoji}</span>}
      </div>
    </div>
  );
};

export default ParkMap;
