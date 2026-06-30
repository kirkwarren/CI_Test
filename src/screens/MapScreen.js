// GlowUp — Map screen. The living world: a stylized map of Riverbend where
// Fade Zones glow back to life as they're restored. Tapping a zone opens its
// mission. Also surfaces the live event, AR Discovery finds, and solo quick-runs.

import React, { useMemo, useState } from 'react';
import {
  MapPin, Clock, Trash2, Sparkles, Radio, Compass, ChevronRight, Footprints, Trees, Waves,
} from 'lucide-react';
import { ZONES, ZONE_TYPES, MAP_GEOMETRY, EVENT, DISCOVERIES } from '../game/data';
import { useGame } from '../game/state';
import { Card, Chip, Button, ProgressBar, GlowOrb, ScreenHeader, SectionTitle, glow, Hint } from '../components/ui';

function priorityLabel(p) {
  return ['', 'Low', 'Low', 'Medium', 'High', 'Urgent'][p] || 'Medium';
}

// The map canvas with river, roads, and zone nodes.
function MapCanvas({ zonesLive, onPick, selectedId }) {
  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.4) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden
      />
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden>
        {MAP_GEOMETRY.roads.map((d, i) => (
          <path key={i} d={d} stroke="rgba(148,163,184,0.25)" strokeWidth="1.4" fill="none" />
        ))}
        <path d={MAP_GEOMETRY.river} stroke="rgba(56,189,248,0.35)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </svg>

      {/* "You are here" */}
      <div className="absolute" style={{ left: '46%', top: '50%', transform: 'translate(-50%,-50%)' }}>
        <span className="relative flex">
          <span className="absolute inline-flex h-5 w-5 rounded-full bg-sky-400 opacity-50 animate-ping-slow" />
          <span className="relative inline-flex h-5 w-5 rounded-full bg-sky-400 ring-4 ring-sky-400/20" />
        </span>
      </div>

      {ZONES.map((z) => {
        const live = zonesLive[z.id];
        const t = ZONE_TYPES[z.type];
        const restored = live.status === 'restored';
        const restoring = live.status === 'restoring';
        const g = glow(t.glow);
        const selected = selectedId === z.id;
        return (
          <button
            key={z.id}
            onClick={() => onPick(z.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${z.x}%`, top: `${z.y}%` }}
            aria-label={z.name}
          >
            <span className={`flex flex-col items-center ${selected ? 'scale-110' : ''} transition-transform`}>
              <GlowOrb glowToken={t.glow} faded={live.status === 'faded'} size="h-4 w-4" pulse={!restored} />
              {(restored || restoring) && (
                <span className={`mt-1 text-[8px] font-bold ${g.text} drop-shadow`}>
                  {restored ? `Lv${live.glowLevel}` : '◔'}
                </span>
              )}
              {selected && (
                <span className={`mt-0.5 whitespace-nowrap text-[9px] px-1.5 py-0.5 rounded ${g.bg} ${g.text} border ${g.border}`}>
                  {z.name.split('—')[0].trim()}
                </span>
              )}
            </span>
          </button>
        );
      })}

      {/* faded vignette to sell the "second layer" look */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_20px_rgba(2,6,23,0.7)]" aria-hidden />
      <div className="absolute top-2 left-3 text-[10px] uppercase tracking-widest text-slate-500 flex items-center gap-1">
        <Compass size={12} /> Riverbend · live layer
      </div>
    </div>
  );
}

function ZoneCard({ zone, live, onStart }) {
  const t = ZONE_TYPES[zone.type];
  const g = glow(t.glow);
  const restored = live.status === 'restored';
  return (
    <Card glowToken={t.glow} className="p-4 animate-fadeInUp">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-white">{zone.name}</h3>
            <Chip glowToken={t.glow}>{t.label}</Chip>
            {restored ? (
              <Chip glowToken="emerald">Glow Lv{live.glowLevel}</Chip>
            ) : (
              <Chip glowToken={zone.priority >= 4 ? 'fuchsia' : 'amber'}>{priorityLabel(zone.priority)} priority</Chip>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1.5">{restored ? zone.story : zone.blurb}</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-white/5 py-1.5">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400"><MapPin size={11} /> Distance</div>
          <div className="text-sm font-semibold text-white">{zone.distanceM} m</div>
        </div>
        <div className="rounded-lg bg-white/5 py-1.5">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400"><Clock size={11} /> Est. time</div>
          <div className="text-sm font-semibold text-white">{zone.est.minutes} min</div>
        </div>
        <div className="rounded-lg bg-white/5 py-1.5">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400"><Trash2 size={11} /> ~Items</div>
          <div className="text-sm font-semibold text-white">{zone.est.pieces}</div>
        </div>
      </div>

      {restored && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Restoration to next glow level</span>
            <span>{live.restoredPct % 100}%</span>
          </div>
          <ProgressBar value={live.restoredPct % 100} glowToken={t.glow} />
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          <Sparkles size={12} className={g.text} /> Guardian: {zone.guardian.charAt(0).toUpperCase() + zone.guardian.slice(1)}
        </span>
        <Button glowToken={t.glow} onClick={() => onStart(zone.id)}>
          {restored ? 'Boost glow' : 'Start mission'} <ChevronRight size={16} />
        </Button>
      </div>
    </Card>
  );
}

function QuickRuns({ onStart, zonesLive }) {
  // Surface the nearest faded + a fast restored "boost" as solo quick-runs.
  const nearest = useMemo(() => {
    const sorted = [...ZONES].sort((a, b) => a.distanceM - b.distanceM);
    const faded = sorted.find((z) => zonesLive[z.id].status !== 'restored');
    const quick = sorted.find((z) => z.est.minutes <= 10);
    return [
      faded && { ...faded, tag: '5–15 min', icon: Footprints, label: 'Glow Run' },
      quick && quick !== faded && { ...quick, tag: `${quick.est.minutes} min`, icon: Trees, label: 'Ten-piece sprint' },
    ].filter(Boolean);
  }, [zonesLive]);

  return (
    <div className="grid grid-cols-2 gap-3">
      {nearest.map((z) => {
        const Icon = z.icon;
        const t = ZONE_TYPES[z.type];
        return (
          <button
            key={z.id}
            onClick={() => onStart(z.id)}
            className="text-left rounded-2xl border border-white/10 bg-white/[0.04] p-3 hover:bg-white/[0.07] transition-colors active:scale-[0.99]"
          >
            <div className="flex items-center gap-2">
              <Icon size={16} className={glow(t.glow).text} />
              <span className="text-xs font-semibold text-white">{z.label}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 truncate">{z.name.split('—')[0].trim()}</div>
            <div className="text-[10px] text-slate-500 mt-1">{z.tag} · ~{z.est.pieces} items</div>
          </button>
        );
      })}
    </div>
  );
}

export default function MapScreen({ onStartMission, onOpenEvent }) {
  const { state } = useGame();
  const [selectedId, setSelectedId] = useState(ZONES[0].id);
  const [discovery, setDiscovery] = useState(null);

  const zonesLive = state.zones;
  const selected = ZONES.find((z) => z.id === selectedId);
  const restoredCount = ZONES.filter((z) => zonesLive[z.id].status === 'restored').length;

  return (
    <div className="space-y-5 py-2">
      <ScreenHeader
        title="Your city is waiting"
        subtitle={`${ZONES.length - restoredCount} Fade Zones nearby · ${restoredCount} restored`}
      />

      {/* Live event banner */}
      <button
        onClick={onOpenEvent}
        className="w-full text-left rounded-2xl p-4 bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 border border-fuchsia-400/30 hover:brightness-110 transition active:scale-[0.99]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-fuchsia-400" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wide text-fuchsia-200 flex items-center gap-1">
              <Radio size={13} /> Live now
            </span>
          </div>
          <ChevronRight size={16} className="text-fuchsia-200" />
        </div>
        <div className="mt-1.5 font-bold text-white">{EVENT.name}</div>
        <div className="text-xs text-slate-300">{EVENT.date} · {EVENT.location}</div>
      </button>

      <MapCanvas zonesLive={zonesLive} onPick={setSelectedId} selectedId={selectedId} />

      {selected && <ZoneCard zone={selected} live={zonesLive[selected.id]} onStart={onStartMission} />}

      <div>
        <SectionTitle right={<span className="text-[11px] text-slate-500">tap to begin</span>}>Solo quick-runs</SectionTitle>
        <QuickRuns onStart={onStartMission} zonesLive={zonesLive} />
      </div>

      <div>
        <SectionTitle>AR Discovery</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          {DISCOVERIES.map((d) => (
            <button
              key={d.id}
              onClick={() => setDiscovery(discovery === d.id ? null : d.id)}
              className="text-left rounded-2xl border border-white/10 bg-white/[0.04] p-3 hover:bg-white/[0.07] transition active:scale-[0.99]"
            >
              <div className="text-xl">{d.emoji}</div>
              <div className="text-xs font-semibold text-white mt-1">{d.label}</div>
              {discovery === d.id ? (
                <div className="text-[11px] text-slate-400 mt-1 animate-fadeIn">{d.hint}</div>
              ) : (
                <div className="text-[11px] text-slate-500 mt-1">Tap to reveal</div>
              )}
            </button>
          ))}
        </div>
      </div>

      <Hint icon={<Waves size={14} className="mt-0.5 shrink-0 text-cyan-300" />}>
        Restored zones can slowly fade again if litter returns — a reason to come back, never a penalty. Defend
        your crew's territory to keep it glowing.
      </Hint>
    </div>
  );
}
