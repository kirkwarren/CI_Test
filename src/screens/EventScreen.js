// GlowUp — Live group event (the Mayor's Cleanup Cup). Check in, join a team,
// watch a real-time leaderboard, and trigger shared AR transformations as the
// whole city's impact counter crosses sponsor-funded milestones.

import React from 'react';
import {
  X, Radio, Trophy, Gift, Sparkles, CheckCircle2, MapPin, Flag, ArrowRight,
} from 'lucide-react';
import { EVENT } from '../game/data';
import { useGame } from '../game/state';
import { Card, Chip, Button, ProgressBar, glow } from '../components/ui';

export default function EventScreen({ onClose, onStartMission }) {
  const { state, dispatch } = useGame();
  const ev = state.event;
  const g = glow(EVENT.glow);

  // Live team scores: fold the player's personal pounds into their team.
  const teams = EVENT.teams.map((t) =>
    ev.team === t.id ? { ...t, score: t.score + Math.round(ev.personalLbs * 10) } : t,
  );
  const leadingTeam = [...teams].sort((a, b) => b.score - a.score)[0];

  const cityPct = Math.min(100, (ev.cityLbs / EVENT.cityGoalLbs) * 100);

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Hero */}
      <div className="relative px-4 pt-3 pb-5 bg-gradient-to-br from-fuchsia-600/30 via-slate-900 to-cyan-600/20 border-b border-white/10">
        <button onClick={onClose} className="absolute right-3 top-3 text-slate-300 hover:text-white" aria-label="Close event">
          <X size={22} />
        </button>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-fuchsia-400" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wide text-fuchsia-200 flex items-center gap-1">
            <Radio size={13} /> Live now
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white mt-2">{EVENT.name}</h1>
        <div className="text-sm text-slate-300 flex items-center gap-1 mt-0.5">
          <MapPin size={13} /> {EVENT.location} · {EVENT.date}
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
          <span className="text-2xl">{EVENT.celebrity.emoji}</span>
          <div className="text-xs">
            <div className="font-semibold text-white">{EVENT.celebrity.name} is here</div>
            <div className="text-slate-300">{EVENT.celebrity.tag}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-5">
        <p className="text-sm text-slate-400">{EVENT.blurb}</p>

        {/* Check-in / team select */}
        {!ev.joined ? (
          <Card glowToken={EVENT.glow} className="p-4">
            <div className="flex items-center gap-2 font-semibold text-white">
              <Flag size={16} className={g.text} /> Check in & pick a team
            </div>
            <p className="text-xs text-slate-400 mt-1">Geofenced check-in confirms you're at the event zone.</p>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {EVENT.teams.map((t) => {
                const tg = glow(t.glow);
                return (
                  <button
                    key={t.id}
                    onClick={() => dispatch({ type: 'JOIN_EVENT', payload: { team: t.id, teamName: t.name } })}
                    className={`rounded-xl border ${tg.border} ${tg.bg} p-3 text-center hover:brightness-110 active:scale-[0.98] transition`}
                  >
                    <div className={`font-bold ${tg.text}`}>{t.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{t.score.toLocaleString()} lbs</div>
                  </button>
                );
              })}
            </div>
          </Card>
        ) : (
          <Card glowToken="emerald" className="p-4">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold">
              <CheckCircle2 size={16} /> Checked in · {teams.find((t) => t.id === ev.team)?.name}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              You've contributed <b className="text-white">{ev.personalLbs} lb</b> to your team and the city counter.
            </p>
            <Button glowToken={EVENT.glow} className="w-full mt-3" onClick={() => onStartMission('z-willow-corner')}>
              Start an event mission <ArrowRight size={16} />
            </Button>
            <p className="text-[11px] text-slate-500 mt-2">
              Event missions are coordinator-validated — they reach <b>Official Event Verified</b>, the highest tier.
            </p>
          </Card>
        )}

        {/* Live team leaderboard */}
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <Trophy size={16} className="text-amber-300" /> Live Restoration Race
          </div>
          <Card className="p-4 space-y-3">
            {teams
              .sort((a, b) => b.score - a.score)
              .map((t) => {
                const tg = glow(t.glow);
                const pct = (t.score / (leadingTeam.score || 1)) * 100;
                return (
                  <div key={t.id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-white flex items-center gap-1">
                        {t.name}
                        {ev.team === t.id && <span className="text-[10px] text-emerald-300">· your team</span>}
                        {t.id === leadingTeam.id && <Trophy size={11} className="text-amber-300" />}
                      </span>
                      <span className={tg.text}>{t.score.toLocaleString()} lbs</span>
                    </div>
                    <ProgressBar value={pct} glowToken={t.glow} />
                  </div>
                );
              })}
          </Card>
        </div>

        {/* City shared counter + milestones */}
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <Sparkles size={16} className="text-fuchsia-300" /> City impact counter
          </div>
          <Card glowToken="fuchsia" className="p-4">
            <div className="flex items-end justify-between mb-1">
              <span className="text-3xl font-bold text-white">{Math.round(ev.cityLbs).toLocaleString()}</span>
              <span className="text-xs text-slate-400">/ {EVENT.cityGoalLbs.toLocaleString()} lb goal</span>
            </div>
            <ProgressBar value={cityPct} glowToken="fuchsia" height="h-2.5" />
            <div className="mt-4 space-y-2">
              {EVENT.milestones.map((m) => {
                const reached = ev.cityLbs >= m.atLbs;
                return (
                  <div
                    key={m.atLbs}
                    className={`rounded-xl border p-3 ${reached ? 'border-fuchsia-400/40 bg-fuchsia-500/10' : 'border-white/10 bg-white/[0.03]'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                        {reached ? <CheckCircle2 size={15} className="text-fuchsia-300" /> : <Gift size={15} className="text-slate-400" />}
                        {m.atLbs.toLocaleString()} lb
                      </span>
                      <Chip glowToken={reached ? 'fuchsia' : 'amber'}>{reached ? 'Unlocked' : 'Locked'}</Chip>
                    </div>
                    <div className="text-xs text-slate-300 mt-1">🎁 {m.reward}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">✨ Shared AR reveal: {m.reveal}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <Card className="p-4 text-center">
          <p className="text-xs text-slate-400">
            Beat {EVENT.celebrity.name}'s verified score and every milestone unlocks a sponsor-funded donation. The
            winning crew picks a local school, park, or nonprofit to receive the grant. Celebrity participation is
            real play, not promotion.
          </p>
        </Card>
      </div>
    </div>
  );
}
