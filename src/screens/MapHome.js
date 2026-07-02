import React from 'react';
import { useGame } from '../game/GameState';
import { REACH } from '../game/data';
import { cx, Pill, BigBtn } from '../ui/bits';
import { Trophy, Flame, Zap, Footprints, ShieldCheck, X, Leaf } from 'lucide-react';

// The Pokémon-Go-style overworld: a bright park map, litter spawns bobbing on
// it, your avatar with a reach ring, and chunky HUD corners.
const MapHome = ({ onEncounter, onLeaderboard, onProfile, onFairPlay }) => {
  const { player, spawns, pos, myRank, walkTo, toast } = useGame();
  const [selected, setSelected] = React.useState(null);
  const [walking, setWalking] = React.useState(false);

  const sel = spawns.find((s) => s.id === selected);
  const dist = sel ? Math.hypot(sel.x - pos.x, sel.y - pos.y) : 0;
  const inReach = sel && dist <= REACH;
  const meters = Math.round(dist * 7); // playful scale: 1% ≈ 7 m

  const startWalk = () => {
    if (!sel) return;
    setWalking(true);
    walkTo(sel.x, sel.y, () => setWalking(false));
  };

  const activeCount = spawns.filter((s) => s.status === 'active').length;

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      {/* ---- the day-lit park map ---- */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg,#7ec97e 0%,#69bd77 40%,#57b287 100%)' }}>
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          {/* darker tree blobs */}
          <g fill="#4ea862" opacity="0.8">
            <ellipse cx="14" cy="12" rx="14" ry="9" />
            <ellipse cx="88" cy="40" rx="12" ry="14" />
            <ellipse cx="30" cy="90" rx="18" ry="10" />
            <ellipse cx="70" cy="8" rx="10" ry="6" />
          </g>
          <g fill="#3f9d58" opacity="0.6">
            <ellipse cx="10" cy="10" rx="7" ry="5" />
            <ellipse cx="90" cy="36" rx="6" ry="7" />
            <ellipse cx="26" cy="92" rx="9" ry="5" />
          </g>
          {/* river */}
          <path d="M-4,34 C 18,30 30,44 48,40 S 80,26 106,32 L 106,44 C 82,38 66,52 48,52 S 16,42 -4,46 Z" fill="#5ec8e8" opacity="0.9" />
          <path d="M-4,38 C 18,34 32,47 50,44 S 82,31 106,37" fill="none" stroke="#bdeaf7" strokeWidth="0.7" opacity="0.7" />
          {/* paths */}
          <path d="M8,100 C 22,74 40,70 46,52 C 52,36 44,22 54,0" fill="none" stroke="#e8d9ae" strokeWidth="3.4" strokeLinecap="round" opacity="0.95" />
          <path d="M0,66 C 24,62 52,68 74,60 S 96,50 104,54" fill="none" stroke="#e8d9ae" strokeWidth="2.6" strokeLinecap="round" opacity="0.9" />
          {/* plaza */}
          <circle cx="30" cy="30" r="6" fill="#dfd2a8" opacity="0.95" />
          <circle cx="30" cy="30" r="2" fill="#5ec8e8" />
        </svg>

        {/* soft vignette so HUD reads */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(6,25,18,0.42) 100%)' }} />

        {/* ---- reach ring around the player ---- */}
        <div
          className="absolute rounded-full border-2 border-white/50 bg-white/10 pointer-events-none transition-all duration-100"
          style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: `${REACH * 2}%`, aspectRatio: '1', transform: 'translate(-50%,-50%)' }}
        />

        {/* ---- litter spawns ---- */}
        {spawns.map((s) => {
          const d = Math.hypot(s.x - pos.x, s.y - pos.y);
          const near = d <= REACH;
          const cleaned = s.status === 'cleaned';
          return (
            <button
              key={s.id}
              onClick={() => !cleaned && setSelected(s.id)}
              className="absolute -translate-x-1/2 -translate-y-full"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
            >
              {cleaned ? (
                <span className="block text-2xl animate-pop drop-shadow">✨</span>
              ) : (
                <span className="relative block animate-floaty" style={{ animationDelay: `${(s.x + s.y) % 4 * 0.35}s` }}>
                  {near && <span className="absolute inset-0 -m-2 rounded-full bg-quest-300/40 animate-ripple" />}
                  <span className={cx(
                    'relative grid place-items-center h-11 w-11 rounded-full text-xl ring-[3px] shadow-card transition',
                    near ? 'bg-white ring-quest-400' : 'bg-white/70 ring-white/50 grayscale-[45%]',
                    selected === s.id && 'scale-110 ring-sun-400'
                  )}>
                    {s.emoji}
                  </span>
                  {/* density pips */}
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {Array.from({ length: s.density }).map((_, i) => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full bg-sun-500 ring-1 ring-white" />
                    ))}
                  </span>
                  {/* ground shadow */}
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 h-1.5 w-7 rounded-full bg-black/25 blur-[1px]" />
                </span>
              )}
            </button>
          );
        })}

        {/* ---- player avatar ---- */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-100" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
          <span className="absolute inset-0 -m-3 rounded-full bg-ocean-400/30 animate-ripple" />
          <span className="relative grid place-items-center h-12 w-12 rounded-full bg-ocean-500 ring-4 ring-white text-2xl shadow-card">
            {player.avatar}
          </span>
          {walking && (
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 whitespace-nowrap flex items-center gap-1">
              <Footprints className="h-3 w-3" /> walking…
            </span>
          )}
        </div>
      </div>

      {/* ================= HUD ================= */}
      {/* top bar */}
      <div className="absolute top-0 inset-x-0 p-3 flex items-center gap-2">
        <Pill className="bg-grime-900/85 text-white backdrop-blur">
          <Leaf className="h-3.5 w-3.5 text-quest-300" /> CleanQuest
        </Pill>
        <div className="flex-1" />
        <Pill className="bg-grime-900/85 text-sun-400 backdrop-blur">
          <Flame className="h-3.5 w-3.5" /> {player.streak}
        </Pill>
        <Pill className="bg-grime-900/85 text-quest-300 backdrop-blur">
          <Zap className="h-3.5 w-3.5" /> {player.points.toLocaleString()} pts
        </Pill>
      </div>

      {/* radar line */}
      <div className="absolute top-14 inset-x-0 flex justify-center pointer-events-none">
        <span className="rounded-full bg-black/45 text-white/90 text-[11px] font-bold px-3 py-1 backdrop-blur">
          {activeCount} litter spawns nearby — walk into your ring to clean
        </span>
      </div>

      {/* toast */}
      {toast && (
        <div className="absolute top-24 inset-x-0 flex justify-center pointer-events-none z-30">
          <span className="rounded-full bg-white text-grime-900 text-[12px] font-extrabold px-4 py-2 shadow-card animate-slideUp">
            {toast.emoji} {toast.msg}
          </span>
        </div>
      )}

      {/* bottom-left: avatar + level (profile) */}
      <button onClick={onProfile} className="absolute bottom-4 left-3 flex items-center gap-2.5 rounded-full bg-grime-900/85 backdrop-blur pl-1.5 pr-4 py-1.5 shadow-card active:scale-95 transition">
        <span className="grid place-items-center h-11 w-11 rounded-full bg-ocean-500 ring-2 ring-white/70 text-xl">{player.avatar}</span>
        <span className="text-left">
          <span className="block text-white font-black text-sm leading-none">Lv {player.level}</span>
          <span className="block text-white/50 text-[10px] font-bold mt-0.5">{player.xp} XP</span>
        </span>
      </button>

      {/* bottom-right: leaderboard */}
      <button onClick={onLeaderboard} className="absolute bottom-4 right-3 flex items-center gap-2 rounded-full bg-gradient-to-b from-sun-400 to-sun-600 px-4 py-3 shadow-card active:scale-95 transition">
        <Trophy className="h-5 w-5 text-grime-900" />
        <span className="text-grime-900 font-black text-sm">#{myRank}</span>
      </button>

      {/* fair-play shield */}
      <button onClick={onFairPlay} className="absolute bottom-20 right-3 grid place-items-center h-10 w-10 rounded-full bg-grime-900/85 backdrop-blur shadow-card active:scale-95">
        <ShieldCheck className="h-5 w-5 text-quest-300" />
      </button>

      {/* ---- selected spawn card ---- */}
      {sel && (
        <div className="absolute bottom-20 inset-x-3 z-20 animate-slideUp">
          <div className="rounded-3xl bg-grime-900/95 backdrop-blur ring-1 ring-white/12 p-4 shadow-card">
            <div className="flex items-center gap-3">
              <span className="grid place-items-center h-12 w-12 rounded-2xl bg-white text-2xl">{sel.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-black text-base leading-tight">{sel.name}</p>
                <p className="text-white/50 text-[11px]">{sel.hint}</p>
              </div>
              <button onClick={() => setSelected(null)} className="grid place-items-center h-8 w-8 rounded-full bg-white/10 text-white/60">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-3 mb-3">
              <Pill className="bg-white/10 text-white/85">{meters} m away</Pill>
              <Pill className="bg-sun-500/20 text-sun-400">{'⭐'.repeat(sel.density)} density</Pill>
              <Pill className="bg-quest-500/20 text-quest-300">2× bonus zone</Pill>
            </div>
            {inReach ? (
              <BigBtn onClick={() => { setSelected(null); onEncounter(sel); }}>
                📷 Start AR cleanup
              </BigBtn>
            ) : (
              <BigBtn tone="sun" onClick={startWalk} disabled={walking}>
                {walking ? 'Walking…' : `🚶 Walk there (${meters} m)`}
              </BigBtn>
            )}
            {!inReach && <p className="text-center text-white/35 text-[10px] mt-2">Prototype simulates GPS walking — the real app uses your location.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapHome;
