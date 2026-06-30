// GlowUp — Profile. Reputation & badges, the private trust score, the civic
// reward store, the safety center (with hazard reporting), and account controls.

import React, { useState } from 'react';
import {
  Shield, Award, Gift, AlertTriangle, ShieldCheck, Baby, RotateCcw, Lock, CheckCircle2, Activity,
} from 'lucide-react';
import { REWARDS, HAZARD_TYPES } from '../game/data';
import { useGame, selectLevel } from '../game/state';
import { Card, Chip, Button, ProgressBar, ScreenHeader, SectionTitle, glow, Hint } from '../components/ui';

function TrustMeter({ trust }) {
  const pct = Math.round(trust * 100);
  const tone = trust >= 0.8 ? 'emerald' : trust >= 0.5 ? 'cyan' : 'amber';
  const label = trust >= 0.8 ? 'Trusted' : trust >= 0.5 ? 'Building' : 'New / cautious';
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="flex items-center gap-2 text-sm font-semibold text-white">
          <Shield size={16} className={glow(tone).text} /> Trust score
        </span>
        <Chip glowToken={tone}>{label}</Chip>
      </div>
      <ProgressBar value={pct} glowToken={tone} />
      <p className="text-[11px] text-slate-400 mt-2">
        Private and never shown publicly. It rises with reliable cleanups and recovers quickly after any review.
        High trust means faster reward confirmation.
      </p>
    </Card>
  );
}

export default function ProfileScreen() {
  const { state, dispatch } = useGame();
  const p = state.player;
  const { level } = selectLevel(state);
  const [hazardKind, setHazardKind] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="space-y-5 py-2">
      <ScreenHeader title="You" subtitle="Reputation, rewards, and safety." />

      {/* Identity */}
      <Card glowToken="emerald" className="p-4 flex items-center gap-3">
        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${glow('emerald').from} ${glow('emerald').to} grid place-items-center text-2xl font-bold text-slate-950`}>
          {level}
        </div>
        <div className="flex-1">
          <div className="font-bold text-white text-lg">{p.name}</div>
          <div className="text-xs text-slate-400">{p.handle} · {p.glowPoints.toLocaleString()} Glow Points</div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
            <Activity size={12} className="text-emerald-300" /> {p.missionsCompleted} missions · {p.streakDays}-day streak
          </div>
        </div>
      </Card>

      <TrustMeter trust={p.trustScore} />

      {/* Badges */}
      <div>
        <SectionTitle right={<span className="text-[11px] text-slate-500">{state.badges.length} earned</span>}>Badges</SectionTitle>
        {state.badges.length === 0 ? (
          <Hint icon={<Award size={14} className="mt-0.5 text-amber-300 shrink-0" />}>
            Complete your first mission to start earning badges and reputation.
          </Hint>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {state.badges.map((b) => (
              <Card key={b.id} className="p-3 text-center">
                <div className="text-2xl">{b.emoji}</div>
                <div className="text-[11px] font-medium text-white mt-1">{b.label}</div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Reward store */}
      <div>
        <SectionTitle right={<span className="flex items-center gap-1 text-[11px] text-emerald-300"><Gift size={12} /> {p.glowPoints.toLocaleString()} pts</span>}>
          Civic rewards
        </SectionTitle>
        <div className="space-y-2">
          {REWARDS.map((r) => {
            const owned = state.redeemed.includes(r.id);
            const affordable = p.glowPoints >= r.cost;
            return (
              <Card key={r.id} className="p-3 flex items-center gap-3">
                <div className="text-2xl">{r.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">{r.name}</div>
                  <div className="text-[11px] text-slate-400">{r.desc} · {r.kind}</div>
                </div>
                {owned ? (
                  <Chip glowToken="emerald"><CheckCircle2 size={12} /> Redeemed</Chip>
                ) : (
                  <Button
                    variant={affordable ? 'subtle' : 'ghost'}
                    glowToken="emerald"
                    disabled={!affordable}
                    onClick={() => dispatch({ type: 'REDEEM_REWARD', payload: r })}
                    className="text-xs"
                  >
                    {affordable ? `${r.cost} pts` : <><Lock size={12} /> {r.cost}</>}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
        <Hint icon={<Gift size={14} className="mt-0.5 text-fuchsia-300 shrink-0" />}>
          Rewards reinforce civic pride and local participation — discounts, passes, donations, recognition — never
          cash for raw weight.
        </Hint>
      </div>

      {/* Safety center */}
      <div>
        <SectionTitle>Safety center</SectionTitle>
        <Card glowToken="amber" className="p-4">
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
            <ShieldCheck size={16} /> Never handle hazardous waste
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            Report it instead — it's safer and worth points. Reports route to the right city department, event
            organizer, or land manager.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {HAZARD_TYPES.map((h) => (
              <button
                key={h}
                onClick={() => setHazardKind(h)}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-2 text-[11px] text-slate-300 text-left hover:bg-white/[0.07] transition flex items-center gap-1.5"
              >
                <AlertTriangle size={12} className="text-amber-300 shrink-0" /> {h}
              </button>
            ))}
          </div>
          {p.hazardsReported > 0 && (
            <p className="mt-2 text-[11px] text-emerald-300">{p.hazardsReported} hazard report{p.hazardsReported === 1 ? '' : 's'} filed. Thank you.</p>
          )}
        </Card>
      </div>

      {/* Settings */}
      <div>
        <SectionTitle>Account & family controls</SectionTitle>
        <Card className="p-2 divide-y divide-white/5">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_YOUTH_MODE' })}
            className="w-full flex items-center gap-3 p-3 text-left"
          >
            <Baby size={18} className="text-cyan-300" />
            <span className="flex-1">
              <span className="block text-sm font-medium text-white">Youth / family mode</span>
              <span className="block text-[11px] text-slate-400">Daylight-only missions, hidden precise location, parent controls</span>
            </span>
            <span className={`h-5 w-9 rounded-full p-0.5 transition ${state.settings.youthMode ? 'bg-emerald-400' : 'bg-white/15'}`}>
              <span className={`block h-4 w-4 rounded-full bg-slate-950 transition-transform ${state.settings.youthMode ? 'translate-x-4' : ''}`} />
            </span>
          </button>
          <button
            onClick={() => (confirmReset ? dispatch({ type: 'RESET' }) : setConfirmReset(true))}
            className="w-full flex items-center gap-3 p-3 text-left"
          >
            <RotateCcw size={18} className="text-rose-300" />
            <span className="flex-1">
              <span className="block text-sm font-medium text-white">{confirmReset ? 'Tap again to confirm reset' : 'Reset demo progress'}</span>
              <span className="block text-[11px] text-slate-400">Clears local save and starts Riverbend fresh</span>
            </span>
            {confirmReset && <Chip glowToken="fuchsia">Confirm?</Chip>}
          </button>
        </Card>
      </div>

      <Hint icon={<Shield size={14} className="mt-0.5 text-slate-400 shrink-0" />}>
        Precise locations are hidden by default and live location sharing is never required. Missions avoid highways,
        rail, dangerous water, construction, and private property.
      </Hint>

      {/* Hazard confirmation toast */}
      {hazardKind && (
        <div className="fixed inset-0 z-30 grid place-items-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn" onClick={() => setHazardKind(null)}>
          <Card glowToken="amber" className="w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <AlertTriangle size={18} /> Report: {hazardKind}
            </div>
            <p className="text-sm text-slate-300 mt-2">
              We'll route this to the right authority with the (approximate) location. Leave it untouched. You'll earn
              +75 points for keeping the area safe.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="ghost" onClick={() => setHazardKind(null)}>Cancel</Button>
              <Button
                glowToken="amber"
                onClick={() => {
                  dispatch({ type: 'REPORT_HAZARD', payload: { kind: hazardKind } });
                  setHazardKind(null);
                }}
              >
                Submit report
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
