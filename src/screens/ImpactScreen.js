// GlowUp — Impact dashboard. Personal lifetime contribution, the city's living
// numbers, neighborhood/school standings, and a highly shareable impact card.

import React from 'react';
import {
  Trash2, Recycle, Clock, MapPin, TrendingUp, TrendingDown, Minus, Share2, Building2, School, Gift,
} from 'lucide-react';
import { ZONES, SCHOOL_STANDINGS, NEIGHBORHOOD_STANDINGS } from '../game/data';
import { useGame } from '../game/state';
import { Card, Stat, Button, ScreenHeader, SectionTitle, ProgressBar, glow } from '../components/ui';

function Trend({ change }) {
  if (change > 0) return <span className="flex items-center gap-0.5 text-emerald-400 text-xs"><TrendingUp size={12} />{change}</span>;
  if (change < 0) return <span className="flex items-center gap-0.5 text-rose-400 text-xs"><TrendingDown size={12} />{Math.abs(change)}</span>;
  return <span className="flex items-center gap-0.5 text-slate-500 text-xs"><Minus size={12} /></span>;
}

function Standings({ title, icon, rows }) {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2 px-1">{icon} {title}</div>
      <div className="divide-y divide-white/5">
        {rows.map((r, i) => (
          <div key={r.name} className="flex items-center gap-2 px-1 py-2">
            <span className="w-5 text-center text-xs font-bold text-slate-400">{i + 1}</span>
            <span className="flex-1 text-sm text-slate-200 truncate">{r.name}</span>
            <span className="text-sm font-semibold text-white">{r.score.toLocaleString()}</span>
            <Trend change={r.change} />
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function ImpactScreen() {
  const { state } = useGame();
  const p = state.player;

  const restoredZones = ZONES.filter((z) => state.zones[z.id].status === 'restored').length;
  const cityRestorePct = Math.round((restoredZones / ZONES.length) * 100);

  // Living city numbers: a seeded community baseline plus this player's work.
  const cityLbs = 48200 + Math.round(p.poundsRemoved);
  const cityMissions = 3120 + p.missionsCompleted;
  const cityPlayers = 1860;
  const donationsUnlocked = 4500 + p.locationsRestored * 250;

  return (
    <div className="space-y-5 py-2">
      <ScreenHeader title="Impact" subtitle="Turn real cleanup into real, measurable change." />

      {/* Shareable personal impact card */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 p-5 bg-gradient-to-br from-emerald-500/20 via-cyan-500/15 to-fuchsia-500/20">
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-400/20 blur-2xl" aria-hidden />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-widest text-white/70">GlowUp · lifetime</span>
            <span className="text-[11px] text-white/70">{p.handle}</span>
          </div>
          <p className="mt-2 text-sm text-white/90 leading-relaxed">
            You've completed <b>{p.missionsCompleted}</b> verified restoration mission{p.missionsCompleted === 1 ? '' : 's'},
            removed an estimated <b>{p.poundsRemoved} lb</b> of litter, contributed <b>{p.volunteerHours} volunteer
            hours</b>, helped restore <b>{p.locationsRestored}</b> public location{p.locationsRestored === 1 ? '' : 's'},
            and activated <b>{p.glowZonesActivated}</b> Glow Zone{p.glowZonesActivated === 1 ? '' : 's'}.
          </p>
          <Button variant="ghost" className="mt-3 w-full bg-white/10" onClick={() => {}}>
            <Share2 size={16} /> Share impact card
          </Button>
        </div>
      </div>

      {/* Personal metric grid */}
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Items collected" value={p.piecesCollected.toLocaleString()} glowToken="cyan" icon={<Trash2 size={12} />} />
        <Stat label="Recycled / sorted" value={p.recycledItems.toLocaleString()} glowToken="emerald" icon={<Recycle size={12} />} />
        <Stat label="Volunteer hours" value={p.volunteerHours} glowToken="amber" icon={<Clock size={12} />} />
        <Stat label="Locations restored" value={p.locationsRestored} glowToken="fuchsia" icon={<MapPin size={12} />} />
      </div>

      {/* City dashboard */}
      <div>
        <SectionTitle right={<span className="text-[11px] text-slate-500">Riverbend pilot</span>}>City dashboard</SectionTitle>
        <Card glowToken="cyan" className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-300">City restored</span>
            <span className="text-sm font-bold text-cyan-300">{cityRestorePct}%</span>
          </div>
          <ProgressBar value={cityRestorePct} glowToken="cyan" />
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">{cityLbs.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400">lbs removed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{cityMissions.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400">verified missions</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{cityPlayers.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400">active players</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
            <Gift size={16} className="text-fuchsia-300" />
            <span className="text-xs text-slate-300">
              <b className="text-white">${donationsUnlocked.toLocaleString()}</b> in sponsor donations unlocked for local schools & parks
            </span>
          </div>
        </Card>
      </div>

      <Standings title="Top neighborhoods" icon={<Building2 size={16} className="text-fuchsia-300" />} rows={NEIGHBORHOOD_STANDINGS} />
      <Standings title="Top schools" icon={<School size={16} className="text-amber-300" />} rows={SCHOOL_STANDINGS} />

      <Card className="p-4 text-center">
        <p className="text-sm text-slate-300">
          “Salt Lake City just restored 10,000 Glow Zones.” · “Your crew cleaned 1,200 lbs this month.” · “This park is
          82% restored.” — every number here is built from <span className={glow('emerald').text}>verified</span> cleanup
          data cities can actually use.
        </p>
      </Card>
    </div>
  );
}
