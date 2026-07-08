import React from 'react';
import { useGame } from '../game/GameState';
import { REACH, buddyStage, BUDDY_STAGES } from '../game/data';
import { Pin, PlayerOrb, BuddySprite } from './art';
import { cx } from './bits';

// A stylized tree cluster: shadow blob, cel-shaded canopy, highlight.
const Trees = ({ cx: x, cy: y, r }) => (
  <g>
    <ellipse cx={x + r * 0.18} cy={y + r * 0.5} rx={r * 1.05} ry={r * 0.5} fill="#2f7c46" opacity="0.5" />
    <circle cx={x} cy={y} r={r} fill="#3f9d58" />
    <circle cx={x - r * 0.35} cy={y - r * 0.3} r={r * 0.62} fill="#4fb269" />
    <circle cx={x - r * 0.5} cy={y - r * 0.45} r={r * 0.3} fill="#7ed194" opacity="0.9" />
  </g>
);

// The Riverton Commons map — Pokémon-Go-style cel-shaded terrain reused by
// the corner PiP (compact) and the expanded navigator.
const ParkMap = ({ compact = false, onSelectSpawn, selectedId }) => {
  const { spawns, pos, goldenId, buddyXp, adoptedId } = useGame();
  const stageIdx = BUDDY_STAGES.indexOf(buddyStage(buddyXp));

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: 'linear-gradient(160deg,#8fd792 0%,#6cc17e 45%,#58b489 100%)' }}>
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        {/* grass mottling */}
        <g opacity="0.5">
          <ellipse cx="20" cy="55" rx="16" ry="9" fill="#7ccc84" />
          <ellipse cx="72" cy="80" rx="20" ry="11" fill="#7ccc84" />
          <ellipse cx="55" cy="14" rx="14" ry="8" fill="#7ccc84" />
        </g>

        {/* river: bank, water, highlight */}
        <path d="M-4,33 C 18,29 30,45 48,41 S 80,25 106,31 L 106,45 C 82,39 66,53 48,53 S 16,43 -4,47 Z" fill="#3f9dc4" />
        <path d="M-4,34.5 C 18,30.5 30,44 48,40.5 S 80,26.5 106,32.5 L 106,43.5 C 82,37.5 66,51.5 48,51.5 S 16,41.5 -4,45.5 Z" fill="#5ec8e8" />
        <path className="cq-flow" d="M-4,40 C 18,36 32,47 50,44 S 82,31 106,37" fill="none" stroke="#d9f4fc" strokeWidth="0.5" opacity="0.6" strokeLinecap="round" />

        {/* roads: casing + fill (PoGo style) */}
        <g strokeLinecap="round" fill="none">
          <path d="M8,100 C 22,74 40,70 46,52 C 52,36 44,22 54,0" stroke="#c9b985" strokeWidth="4.6" />
          <path d="M8,100 C 22,74 40,70 46,52 C 52,36 44,22 54,0" stroke="#f0e5c0" strokeWidth="3" />
          <path d="M0,66 C 24,62 52,68 74,60 S 96,50 104,54" stroke="#c9b985" strokeWidth="3.8" />
          <path d="M0,66 C 24,62 52,68 74,60 S 96,50 104,54" stroke="#f0e5c0" strokeWidth="2.4" />
        </g>

        {/* plaza + fountain */}
        <circle cx="30" cy="30" r="6.5" fill="#cbbd8e" />
        <circle cx="30" cy="30" r="5.6" fill="#e8dcb2" />
        <circle cx="30" cy="30" r="2.2" fill="#5ec8e8" stroke="#ffffff" strokeWidth="0.5" />

        {/* tree clusters */}
        <Trees cx={13} cy={11} r={7} />
        <Trees cx={24} cy={14} r={5} />
        <Trees cx={88} cy={38} r={6.5} />
        <Trees cx={80} cy={46} r={4.5} />
        <Trees cx={28} cy={90} r={8} />
        <Trees cx={42} cy={94} r={5} />
        <Trees cx={70} cy={7} r={5.5} />
        <Trees cx={92} cy={78} r={5} />

        {/* wildflowers */}
        {[[16, 46], [62, 22], [84, 60], [40, 78], [8, 72], [56, 90]].map(([fx, fy], i) => (
          <g key={i}>
            <circle cx={fx} cy={fy} r="0.9" fill={i % 2 ? '#fbbf24' : '#f9a8d4'} />
            <circle cx={fx + 2.2} cy={fy + 1.2} r="0.7" fill="#ffffff" opacity="0.9" />
          </g>
        ))}
      </svg>

      {/* reach ring */}
      <div
        className="absolute rounded-full border-2 border-white/60 bg-white/10 pointer-events-none transition-all duration-100"
        style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: `${REACH * 2}%`, aspectRatio: '1', transform: 'translate(-50%,-50%)', boxShadow: 'inset 0 0 24px rgba(255,255,255,0.25)' }}
      />

      {/* spawns */}
      {spawns.map((s) => {
        const cleaned = s.status === 'cleaned';
        const golden = s.id === goldenId;
        const near = Math.hypot(s.x - pos.x, s.y - pos.y) <= REACH;
        const tone = golden ? 'golden' : s.reported ? 'report' : near ? 'active' : 'far';
        return (
          <button
            key={s.id}
            disabled={cleaned || !onSelectSpawn}
            onClick={() => onSelectSpawn && onSelectSpawn(s)}
            className={cx('absolute -translate-x-1/2', compact ? '-translate-y-1/2' : '-translate-y-[85%]')}
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          >
            {cleaned ? (
              <span className={cx('block drop-shadow animate-floaty', compact ? 'text-[10px]' : 'text-xl')}>🌸</span>
            ) : compact ? (
              <span className={cx('block h-3 w-3 rounded-full ring-2 ring-white shadow-card', golden ? 'bg-sun-400 animate-pulseGlow' : s.reported ? 'bg-ocean-400' : near ? 'bg-quest-400' : 'bg-slate-400')} />
            ) : (
              <span className={cx('relative block transition', selectedId === s.id && 'scale-110')}>
                {golden && <span className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-sun-400/40 animate-ripple" />}
                {near && !golden && <span className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-quest-300/40 animate-ripple" />}
                <Pin tone={tone} size={46} emoji={s.emoji} wobble={golden} />
                {golden && <span className="absolute -top-1 -right-1 rounded-full bg-sun-400 text-grime-900 text-[9px] font-black px-1.5 py-0.5 ring-2 ring-white shadow-card">×3</span>}
                {s.reported && <span className="absolute -top-1 -left-1 grid place-items-center h-4 w-4 rounded-full bg-ocean-500 ring-2 ring-white text-[8px]">📣</span>}
                {s.id === adoptedId && <span className="absolute -bottom-0.5 -right-1 grid place-items-center h-5 w-5 rounded-full bg-quest-400 ring-2 ring-white text-[10px] shadow-card">🏡</span>}
                {/* density pips */}
                <span className="absolute left-1/2 -translate-x-1/2 top-[58%] flex gap-0.5">
                  {Array.from({ length: s.density }).map((_, i) => (
                    <span key={i} className="h-1.5 w-1.5 rounded-full bg-sun-500 ring-1 ring-white" />
                  ))}
                </span>
              </span>
            )}
          </button>
        );
      })}

      {/* player + buddy */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-100" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
        {!compact && <span className="absolute inset-0 -m-2 rounded-full bg-ocean-400/30 animate-ripple" />}
        {compact ? (
          <span className="block h-4 w-4 rounded-full bg-ocean-500 ring-2 ring-white shadow-card" />
        ) : (
          <>
            <PlayerOrb size={44} />
            <BuddySprite stage={stageIdx} size={30} className="absolute -right-7 top-4 animate-floaty drop-shadow" />
          </>
        )}
      </div>
    </div>
  );
};

export default ParkMap;
