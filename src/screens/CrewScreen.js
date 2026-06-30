import React from 'react';
import { useGame } from '../context/GameContext';
import { Card, Chip, ProgressBar, cx } from '../components/ui';
import { CREW, CREW_LEADERBOARD, NEIGHBORHOOD_LEADERBOARD } from '../data/gameData';
import { Users, Crown, Swords, MessageCircle, UserPlus, MapPinned, Trophy } from 'lucide-react';

const medal = (rank) => (rank === 1 ? 'text-sun-400' : rank === 2 ? 'text-slate-300' : rank === 3 ? 'text-amber-600' : 'text-white/40');

const CrewScreen = () => {
  const { player, showToast } = useGame();
  // Reflect the player's live impact in the crew roster.
  const members = CREW.members
    .map((m) => (m.you ? { ...m, impact: player.impactScore } : m))
    .sort((a, b) => b.impact - a.impact);
  const crewTotal = members.reduce((s, m) => s + m.impact, 0);

  return (
    <div className="px-4 pb-28 pt-2">
      {/* Crew banner */}
      <div className="rounded-[28px] overflow-hidden ring-1 ring-white/10">
        <div className="relative h-28 bg-gradient-to-br from-quest-500 to-ocean-600">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
          <div className="absolute left-4 bottom-3 flex items-end gap-3">
            <span className="grid place-items-center h-16 w-16 rounded-2xl bg-grime-900/40 backdrop-blur ring-2 ring-white/40 text-4xl">{CREW.icon}</span>
            <div className="pb-1">
              <p className="text-white font-black text-xl tracking-tight drop-shadow">{CREW.name}</p>
              <p className="text-white/80 text-xs flex items-center gap-1"><MapPinned className="h-3 w-3" /> {CREW.territory}</p>
            </div>
          </div>
          <div className="absolute right-4 top-3">
            <Chip className="bg-grime-900/40 backdrop-blur text-white"><Crown className="h-3 w-3 text-sun-400" /> Rank #{CREW.rank}</Chip>
          </div>
        </div>
        <div className="bg-grime-900 px-4 py-3">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-white/60 font-semibold">Weekly goal · {crewTotal.toLocaleString()} / {CREW.weeklyGoal.toLocaleString()} impact</span>
            <span className="text-quest-300 font-bold">{Math.round((crewTotal / CREW.weeklyGoal) * 100)}%</span>
          </div>
          <ProgressBar value={crewTotal} max={CREW.weeklyGoal} />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={() => showToast('Invite link copied — share with a friend!', '🔗')} className="rounded-xl bg-white/8 text-white font-bold text-xs py-2.5 flex items-center justify-center gap-1.5 active:scale-95">
              <UserPlus className="h-4 w-4 text-quest-300" /> Invite friends
            </button>
            <button onClick={() => showToast('Challenge sent to Trailblazers ⚔️', '⚔️')} className="rounded-xl bg-white/8 text-white font-bold text-xs py-2.5 flex items-center justify-center gap-1.5 active:scale-95">
              <Swords className="h-4 w-4 text-rose-400" /> Challenge crew
            </button>
          </div>
        </div>
      </div>

      {/* Crew roster */}
      <div className="mt-6">
        <h2 className="text-white font-extrabold text-lg tracking-tight mb-3 flex items-center gap-2">
          <Users className="h-5 w-5 text-quest-300" /> Crew roster
        </h2>
        <Card className="divide-y divide-white/6 p-0 overflow-hidden">
          {members.map((m, i) => (
            <div key={m.name} className={cx('flex items-center gap-3 px-4 py-3', m.you && 'bg-quest-500/8')}>
              <span className={cx('font-black text-sm w-5 text-center', medal(i + 1))}>{i + 1}</span>
              <span className="grid place-items-center h-9 w-9 rounded-full bg-white/8 text-sm font-bold text-white">
                {m.name === 'You' ? player.avatar : m.name[0]}
              </span>
              <div className="flex-1 min-w-0">
                <p className={cx('font-bold text-sm truncate', m.you ? 'text-quest-300' : 'text-white')}>{m.name}{m.you && ' (you)'}</p>
              </div>
              <p className="text-white font-bold text-sm">{m.impact.toLocaleString()}</p>
            </div>
          ))}
        </Card>
      </div>

      {/* Crew chat preview */}
      <Card className="mt-4">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="h-4 w-4 text-ocean-400" />
          <p className="text-white font-bold text-sm">Crew chat</p>
          <Chip className="bg-quest-500/15 text-quest-300 ml-auto">Moderated</Chip>
        </div>
        <div className="space-y-2.5">
          <div className="flex gap-2">
            <span className="grid place-items-center h-7 w-7 rounded-full bg-white/8 text-xs font-bold text-white shrink-0">M</span>
            <div className="rounded-2xl rounded-tl-sm bg-white/6 px-3 py-2 text-[12px] text-white/80">Riverwalk meetup Sat 9am — bring gloves! 🧤</div>
          </div>
          <div className="flex gap-2">
            <span className="grid place-items-center h-7 w-7 rounded-full bg-white/8 text-xs font-bold text-white shrink-0">D</span>
            <div className="rounded-2xl rounded-tl-sm bg-white/6 px-3 py-2 text-[12px] text-white/80">We're only 3,360 from beating Trailblazers 👀</div>
          </div>
        </div>
      </Card>

      {/* Crew leaderboard */}
      <div className="mt-6">
        <h2 className="text-white font-extrabold text-lg tracking-tight mb-3 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-sun-400" /> Crew leaderboard
        </h2>
        <Card className="divide-y divide-white/6 p-0 overflow-hidden">
          {CREW_LEADERBOARD.map((c) => (
            <div key={c.name} className={cx('flex items-center gap-3 px-4 py-3', c.you && 'bg-quest-500/8')}>
              <span className={cx('font-black text-sm w-5 text-center', medal(c.rank))}>{c.rank}</span>
              <span className="text-xl">{c.icon}</span>
              <p className={cx('flex-1 font-bold text-sm truncate', c.you ? 'text-quest-300' : 'text-white')}>{c.name}</p>
              <p className="text-white/70 font-bold text-sm">{c.impact.toLocaleString()}</p>
            </div>
          ))}
        </Card>
      </div>

      {/* Neighborhood cup */}
      <div className="mt-6">
        <h2 className="text-white font-extrabold text-lg tracking-tight mb-3">Neighborhood cup</h2>
        <Card className="space-y-3">
          {NEIGHBORHOOD_LEADERBOARD.map((n) => (
            <div key={n.name} className="flex items-center gap-3">
              <span className={cx('font-black text-sm w-5 text-center', medal(n.rank))}>{n.rank}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className={cx('text-[12px] font-bold', n.you ? 'text-quest-300' : 'text-white/80')}>{n.name}{n.you && ' (yours)'}</span>
                  <span className="text-white/60 text-[12px] font-bold">{n.score}</span>
                </div>
                <ProgressBar value={n.score} gradient={n.you ? 'from-quest-400 to-ocean-400' : 'from-grime-400 to-grime-500'} height="h-2" glow={n.you} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default CrewScreen;
