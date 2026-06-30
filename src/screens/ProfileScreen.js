import React from 'react';
import { useGame } from '../context/GameContext';
import { Card, Chip, ProgressBar, StatTile, cx } from '../components/ui';
import { BADGES, ECO_SPIRITS, rankForLevel, xpForLevel, SCORE_WEIGHTS } from '../data/gameData';
import {
  Scale, CheckCircle2, Sparkles, Clock, Share2, ShieldCheck, Settings,
  Flame, Lock, Recycle,
} from 'lucide-react';

const ProfileScreen = () => {
  const { player, restoredCount, showToast } = useGame();
  const need = xpForLevel(player.level);
  const lt = player.lifetime;

  return (
    <div className="px-4 pb-28 pt-2">
      {/* Identity card */}
      <div className="rounded-[28px] overflow-hidden ring-1 ring-white/10">
        <div className="relative bg-gradient-to-br from-quest-600 via-quest-500 to-ocean-600 p-5">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex items-center gap-4">
            <span className="grid place-items-center h-20 w-20 rounded-3xl bg-grime-900/35 backdrop-blur ring-2 ring-white/40 text-5xl animate-floaty">{player.avatar}</span>
            <div className="flex-1">
              <p className="text-white font-black text-2xl tracking-tight drop-shadow">{player.name}</p>
              <p className="text-white/85 text-xs">{player.handle}</p>
              <Chip className="bg-grime-900/30 backdrop-blur text-white mt-2">⭐ {rankForLevel(player.level)}</Chip>
            </div>
            <button onClick={() => showToast('Privacy & parental controls are on 🔒', '🔒')} className="grid place-items-center h-9 w-9 rounded-full bg-white/20 text-white active:scale-90">
              <Settings className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* level progress */}
          <div className="relative mt-4">
            <div className="flex justify-between text-[11px] text-white/90 mb-1.5">
              <span className="font-bold">Level {player.level}</span>
              <span>{player.xp} / {need} XP → Lvl {player.level + 1}</span>
            </div>
            <ProgressBar value={player.xp} max={need} gradient="from-white to-quest-200" />
          </div>
        </div>

        {/* trust score strip */}
        <div className="bg-grime-900 px-4 py-3 flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-quest-300 shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-white/70 font-semibold">Player trust score</span>
              <span className="text-quest-300 font-bold">{player.trustScore}/100 · Trusted</span>
            </div>
            <ProgressBar value={player.trustScore} height="h-2" />
          </div>
        </div>
      </div>

      {/* Lifetime impact */}
      <div className="mt-5">
        <h2 className="text-white font-extrabold text-lg tracking-tight mb-3">Lifetime impact</h2>
        <div className="rounded-3xl bg-gradient-to-br from-grime-800 to-grime-900 ring-1 ring-white/10 p-5">
          <p className="text-white/70 text-[15px] leading-relaxed text-balance">
            You've helped remove <b className="text-quest-300">{lt.pounds} lbs</b> of litter, completed{' '}
            <b className="text-quest-300">{lt.missions} missions</b>, restored{' '}
            <b className="text-quest-300">{lt.spacesRestored} public spaces</b>, and contributed{' '}
            <b className="text-quest-300">{lt.hours} volunteer hours</b>.
          </p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            <StatTile label="Pounds" value={lt.pounds} icon={<Scale className="h-5 w-5" />} />
            <StatTile label="Missions" value={lt.missions} icon={<CheckCircle2 className="h-5 w-5" />} accent="text-ocean-400" />
            <StatTile label="Restored" value={lt.spacesRestored} icon={<Sparkles className="h-5 w-5" />} accent="text-sun-400" />
            <StatTile label="Hours" value={lt.hours} icon={<Clock className="h-5 w-5" />} accent="text-fuchsia-400" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip className="bg-sun-500/15 text-sun-400"><Flame className="h-3 w-3" /> {player.streak}-day streak</Chip>
            <Chip className="bg-quest-500/15 text-quest-300"><Recycle className="h-3 w-3" /> {lt.recycled} lbs recycled</Chip>
            <Chip className="bg-ocean-500/15 text-ocean-400">{restoredCount} zones glowing</Chip>
          </div>
          <button onClick={() => showToast('Impact card saved — ready to share 📲', '📲')} className="mt-4 w-full rounded-2xl py-3 font-bold text-grime-900 bg-gradient-to-r from-quest-300 to-quest-400 shadow-glow active:scale-[0.98] transition flex items-center justify-center gap-2">
            <Share2 className="h-4 w-4" /> Share my impact card
          </button>
        </div>
      </div>

      {/* Score model */}
      <Card className="mt-5">
        <p className="text-white font-bold text-sm mb-1">How Impact Score works</p>
        <p className="text-white/40 text-[11px] mb-3">Balanced so the game rewards safe, verified, consistent action — not raw weight.</p>
        <div className="flex h-3 w-full rounded-full overflow-hidden">
          {SCORE_WEIGHTS.map((w) => (
            <div key={w.key} style={{ width: `${w.weight}%`, backgroundColor: w.color }} />
          ))}
        </div>
        <div className="mt-3 space-y-1.5">
          {SCORE_WEIGHTS.map((w) => (
            <div key={w.key} className="flex items-center gap-2 text-[12px]">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: w.color }} />
              <span className="text-white/70 flex-1">{w.label}</span>
              <span className="text-white/90 font-bold">{w.weight}%</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Badges */}
      <div className="mt-5">
        <h2 className="text-white font-extrabold text-lg tracking-tight mb-3">
          Badges <span className="text-white/40 text-sm font-bold">{player.badges.length}/{BADGES.length}</span>
        </h2>
        <div className="grid grid-cols-4 gap-2.5">
          {BADGES.map((b) => {
            const earned = player.badges.includes(b.id);
            return (
              <div key={b.id} className={cx('rounded-2xl p-2.5 text-center ring-1', earned ? 'bg-white/6 ring-quest-400/25' : 'bg-white/[0.02] ring-white/5')}>
                <span className={cx('text-2xl block', !earned && 'grayscale opacity-30')}>{b.icon}</span>
                <p className={cx('text-[10px] font-bold mt-1 leading-tight', earned ? 'text-white/80' : 'text-white/30')}>{b.name}</p>
                {!earned && <Lock className="h-3 w-3 text-white/25 mx-auto mt-0.5" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Eco spirits */}
      <div className="mt-5">
        <h2 className="text-white font-extrabold text-lg tracking-tight mb-3">
          Eco Spirits <span className="text-white/40 text-sm font-bold">{player.spirits.length}/{ECO_SPIRITS.length}</span>
        </h2>
        <div className="grid grid-cols-5 gap-2">
          {ECO_SPIRITS.map((s) => {
            const owned = player.spirits.includes(s.id);
            return (
              <div key={s.id} className={cx('rounded-2xl p-2 text-center ring-1', owned ? 'bg-ocean-500/10 ring-ocean-400/25' : 'bg-white/[0.02] ring-white/5')}>
                <span className={cx('text-2xl block', owned ? 'animate-floaty' : 'grayscale opacity-25')}>{s.emoji}</span>
                <p className={cx('text-[9px] font-bold mt-1 leading-tight', owned ? 'text-white/75' : 'text-white/30')}>{owned ? s.name.split(' ')[0] : '???'}</p>
              </div>
            );
          })}
        </div>
        <p className="text-white/35 text-[11px] mt-2">Rare spirits appear only after meaningful, verified cleanups.</p>
      </div>
    </div>
  );
};

export default ProfileScreen;
