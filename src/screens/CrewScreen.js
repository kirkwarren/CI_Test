// GlowUp — Crews. Form a crew with friends, family, school, or workplace;
// share restoration goals, run weekly challenges, and compete on the seasonal
// leaderboard. Collaboration is rewarded as much as ranking.

import React from 'react';
import { Users, Trophy, Target, Flame, ChevronRight, Crown, Radio, Shield } from 'lucide-react';
import { CREWS, PLAYER_CREW_ID } from '../game/data';
import { useGame } from '../game/state';
import { Card, Chip, ProgressBar, ScreenHeader, SectionTitle, glow } from '../components/ui';

export default function CrewScreen({ onOpenEvent }) {
  const { state } = useGame();

  // Fold the player's personal weekly contribution into the crew's live score.
  const ranked = CREWS.map((c) =>
    c.id === PLAYER_CREW_ID ? { ...c, weeklyScore: c.weeklyScore + state.crewWeeklyBonus } : c,
  ).sort((a, b) => b.weeklyScore - a.weeklyScore);

  const myCrew = ranked.find((c) => c.id === PLAYER_CREW_ID);
  const myRank = ranked.findIndex((c) => c.id === PLAYER_CREW_ID) + 1;
  const leader = ranked[0];
  const g = glow(myCrew.glow);

  // Weekly crew challenge progress (restore 25 zones together).
  const challengeGoal = 25;
  const challengeDone = Math.min(challengeGoal, 11 + state.player.locationsRestored);

  return (
    <div className="space-y-5 py-2">
      <ScreenHeader title="Crews" subtitle="Clean it. Claim it. Glow up — together." />

      {/* My crew */}
      <Card glowToken={myCrew.glow} className="p-4">
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 rounded-2xl ${g.bg} border ${g.border} grid place-items-center text-2xl`}>
            {myCrew.badge}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white">{myCrew.name}</h3>
              <Chip glowToken={myCrew.glow}>#{myRank}</Chip>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Shield size={12} /> {myCrew.territory} · {myCrew.members} members
            </div>
          </div>
          <div className="text-right">
            <div className={`text-xl font-bold ${g.text}`}>{myCrew.weeklyScore.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500">this week</div>
          </div>
        </div>

        {myRank > 1 && (
          <div className="mt-3 text-xs text-slate-400">
            <span className="text-white font-medium">{(leader.weeklyScore - myCrew.weeklyScore).toLocaleString()}</span> points
            behind {leader.name}. Run a mission to close the gap.
          </div>
        )}
        <div className="mt-2 flex items-center gap-2 text-[11px] text-emerald-300">
          <Flame size={13} /> You've added {state.crewWeeklyBonus.toLocaleString()} pts to the crew this week.
        </div>
      </Card>

      {/* Weekly challenge */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-2 text-sm font-semibold text-white">
            <Target size={16} className="text-fuchsia-300" /> Weekly crew challenge
          </span>
          <Chip glowToken="fuchsia">{challengeDone}/{challengeGoal}</Chip>
        </div>
        <p className="text-xs text-slate-400 mb-2">Restore 25 park zones before Sunday. Which neighborhood can do the most?</p>
        <ProgressBar value={(challengeDone / challengeGoal) * 100} glowToken="fuchsia" />
      </Card>

      {/* Event call-to-action */}
      <button
        onClick={onOpenEvent}
        className="w-full text-left rounded-2xl p-4 bg-gradient-to-r from-fuchsia-500/15 to-cyan-500/15 border border-white/10 hover:brightness-110 transition active:scale-[0.99]"
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-bold text-white">
            <Radio size={15} className="text-fuchsia-300" /> Your crew is in the Mayor's Cleanup Cup
          </span>
          <ChevronRight size={16} className="text-slate-400" />
        </div>
        <p className="text-xs text-slate-400 mt-1">Beat the celebrity crew and unlock a sponsor donation.</p>
      </button>

      {/* Seasonal leaderboard */}
      <div>
        <SectionTitle right={<span className="text-[11px] text-slate-500">season · week 6</span>}>Crew leaderboard</SectionTitle>
        <Card className="divide-y divide-white/5">
          {ranked.map((c, i) => {
            const cg = glow(c.glow);
            const isMe = c.id === PLAYER_CREW_ID;
            return (
              <div key={c.id} className={`flex items-center gap-3 px-3 py-3 ${isMe ? 'bg-white/[0.04]' : ''}`}>
                <div className="w-6 text-center font-bold text-slate-400">
                  {i === 0 ? <Crown size={16} className="text-amber-300 mx-auto" /> : i + 1}
                </div>
                <div className={`h-9 w-9 rounded-xl ${cg.bg} border ${cg.border} grid place-items-center text-lg`}>{c.badge}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {c.name} {isMe && <span className="text-[10px] text-emerald-300">· you</span>}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1"><Users size={11} /> {c.members}</div>
                </div>
                <div className={`text-sm font-bold ${cg.text}`}>{c.weeklyScore.toLocaleString()}</div>
              </div>
            );
          })}
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white mb-1">
          <Trophy size={16} className="text-amber-300" /> Friendly rivalries
        </div>
        <p className="text-xs text-slate-400">
          “Can our school beat the neighboring school's impact score?” · “Can our family complete 100 missions this
          summer?” · “Which crew stabilizes the river corridor first?” Crew competition rewards teamwork over any one
          top player.
        </p>
      </Card>
    </div>
  );
}
