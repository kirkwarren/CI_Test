// GlowUp — Mission Flow. The immersive heart of the game.
//
// A guided AR cleanup rather than a "log your trash" form: brief & safety check →
// geofenced check-in → before capture → AR litter cleanup (with hazard handling) →
// after capture → disposal confirmation → multi-signal verification → a
// satisfying restoration reveal with rewards and place-tied collectibles.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  X, ShieldCheck, MapPin, Camera, Trash2, Recycle, CheckCircle2, AlertTriangle, QrCode,
  Sparkles, Users, Sun, Loader2, ArrowRight, Share2, Footprints,
} from 'lucide-react';
import { ZONES, ZONE_TYPES, CREATURES, HAZARD_TYPES } from '../game/data';
import { useGame } from '../game/state';
import { computeConfidence, resolveTier, computeImpact, estimatePounds } from '../game/verification';
import { Button, Card, Chip, ProgressBar, glow, Hint } from '../components/ui';

const LITTER = [
  { emoji: '🥤', recyclable: true }, { emoji: '🍾', recyclable: true }, { emoji: '🧴', recyclable: true },
  { emoji: '🥫', recyclable: true }, { emoji: '📰', recyclable: true }, { emoji: '📦', recyclable: true },
  { emoji: '🛍️', recyclable: false }, { emoji: '🚬', recyclable: false }, { emoji: '🧃', recyclable: false },
  { emoji: '🍔', recyclable: false }, { emoji: '🧦', recyclable: false },
];

// Build a stable set of AR litter fragments for this mission.
function spawnFragments(zone) {
  const n = Math.min(13, Math.max(6, Math.round(zone.est.pieces * 0.6)));
  const frags = [];
  for (let i = 0; i < n; i++) {
    const base = LITTER[Math.floor(Math.random() * LITTER.length)];
    frags.push({
      id: `f${i}`,
      emoji: base.emoji,
      recyclable: base.recyclable,
      hazard: false,
      x: 8 + Math.random() * 84,
      y: 14 + Math.random() * 68,
      size: 0.85 + Math.random() * 0.5,
    });
  }
  // ~40% of missions surface one hazard the player must NOT collect.
  if (Math.random() < 0.4) {
    frags.push({
      id: 'hazard',
      emoji: Math.random() < 0.5 ? '💉' : '☣️',
      recyclable: false,
      hazard: true,
      x: 30 + Math.random() * 40,
      y: 30 + Math.random() * 40,
      size: 1.2,
    });
  }
  return frags;
}

// A faux AR camera viewport with a soft scanline overlay.
function ARViewport({ children, glowToken = 'emerald', label }) {
  const g = glow(glowToken);
  return (
    <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-b from-slate-800 to-slate-950">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 2px, transparent 4px)',
        }}
        aria-hidden
      />
      <div className={`absolute inset-0 ${g.bg}`} aria-hidden />
      {/* corner reticles */}
      {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos) => (
        <span key={pos} className={`absolute ${pos} h-5 w-5 border-2 ${g.border} rounded`} aria-hidden />
      ))}
      {label && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-white/70">
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

function StepDots({ step, total }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all ${i <= step ? 'w-5 bg-emerald-400' : 'w-1.5 bg-white/20'}`}
        />
      ))}
    </div>
  );
}

export default function MissionFlow({ zoneId, onClose }) {
  const { state, dispatch } = useGame();
  const zone = ZONES.find((z) => z.id === zoneId);
  const t = ZONE_TYPES[zone.type];
  const g = glow(t.glow);

  const [step, setStep] = useState(0); // 0 brief →1 checkin →2 before →3 clean →4 after →5 dispose →6 verify →7 reveal
  const [fragments] = useState(() => spawnFragments(zone));
  const [collected, setCollected] = useState({}); // id -> {recyclable}
  const [hazardOpen, setHazardOpen] = useState(false);
  const [hazardReported, setHazardReported] = useState(false);

  // Mission options chosen in the brief.
  const [withCrew, setWithCrew] = useState(true);
  const [sunset, setSunset] = useState(false);
  const [spoofDemo, setSpoofDemo] = useState(false); // demonstrates anti-fraud review path

  // Disposal evidence.
  const [bagConfirmed, setBagConfirmed] = useState(false);
  const [scanned, setScanned] = useState(false);

  // Snapshot collection so the reveal can show only newly-earned guardians.
  const preCollection = useRef(Object.keys(state.collection));
  const resultRef = useRef(null);

  const isEventZone = zoneId === 'z-willow-corner' && state.event.joined;
  const nonHazardFrags = fragments.filter((f) => !f.hazard);
  const collectedCount = Object.keys(collected).filter((id) => id !== 'hazard').length;
  const recycledCount = Object.values(collected).filter((c) => c.recyclable).length;
  const allCollected = collectedCount >= nonHazardFrags.length;

  function collect(frag) {
    if (frag.hazard) {
      setHazardOpen(true);
      return;
    }
    setCollected((prev) => (prev[frag.id] ? prev : { ...prev, [frag.id]: { recyclable: frag.recyclable } }));
  }

  function reportHazard(kind) {
    dispatch({ type: 'REPORT_HAZARD', payload: { kind } });
    setHazardReported(true);
    setHazardOpen(false);
  }

  // Build the evidence signals and compute the result when entering verify.
  function buildResult() {
    const live = state.zones[zoneId];
    const isReturnVisit = live.restoredPct > 0;
    const engagement = nonHazardFrags.length ? collectedCount / nonHazardFrags.length : 1;

    const signals = {
      locationConfidence: spoofDemo ? 0.2 : 0.92,
      dwellRatio: Math.min(1, 0.4 + engagement * 0.6),
      movementPlausible: !spoofDemo,
      beforeCapture: true,
      afterCapture: true,
      improvementScore: engagement,
      bagConfirmed,
      disposalConfirmed: bagConfirmed && (scanned || true),
      checkpointScanned: scanned,
      eventCheckIn: isEventZone,
      impossibleTravelRisk: spoofDemo ? 0.85 : 0,
      duplicateImageRisk: 0,
      deviceMultiAccountRisk: 0,
      repeatLocationRisk: isReturnVisit && !spoofDemo ? 0.1 : 0,
      deviceTrust: state.player.trustScore,
    };

    const confidence = computeConfidence(signals);
    const tier = resolveTier(confidence, signals);
    const impact = computeImpact({
      confidence,
      tierKey: tier.key,
      pieces: collectedCount,
      expectedPieces: zone.est.pieces,
      priority: zone.priority,
      underserved: zoneId === 'z-harbor-walk',
      recycledFraction: collectedCount ? recycledCount / collectedCount : 0,
      disposalConfirmed: signals.disposalConfirmed,
      streakDays: state.player.streakDays,
      isReturnVisit,
      inEvent: isEventZone,
      inCrewMission: withCrew,
      organizedOrRecruited: false,
      hazardsReported: hazardReported ? 1 : 0,
    });
    const pounds = estimatePounds(collectedCount);

    return { signals, confidence, tier, impact, pounds };
  }

  // When we reach the "verify" step, compute + commit, then animate to reveal.
  useEffect(() => {
    if (step !== 6) return;
    const res = buildResult();
    resultRef.current = res;
    dispatch({
      type: 'COMPLETE_MISSION',
      payload: {
        zoneId,
        tier: res.tier.key,
        points: res.impact.points,
        pieces: collectedCount,
        pounds: res.pounds,
        minutes: zone.est.minutes,
        recycled: recycledCount,
        inEvent: isEventZone,
      },
    });
    const id = setTimeout(() => setStep(7), 2600);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close mission">
          <X size={22} />
        </button>
        <StepDots step={step} total={8} />
        <Chip glowToken={t.glow}>{t.label}</Chip>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4">
        {/* 0 — Brief & safety */}
        {step === 0 && (
          <div className="space-y-4 animate-fadeInUp">
            <div>
              <h1 className="text-2xl font-bold text-white">{zone.name}</h1>
              <p className="text-sm text-slate-400 mt-1">{zone.blurb}</p>
            </div>
            <ARViewport glowToken={t.glow} label="Fade Zone preview">
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-6xl opacity-60 grayscale">🌫️</div>
              </div>
              <div className="absolute bottom-3 inset-x-3 text-center text-[11px] text-white/70">
                Dimmed · fractured · {zone.est.pieces} pollution fragments detected
              </div>
            </ARViewport>

            <Card glowToken="amber" className="p-3.5">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
                <ShieldCheck size={16} /> Safety first
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                Stay on public ground and out of traffic, water, and construction. Do <span className="text-amber-200 font-medium">not</span> pick
                up: {HAZARD_TYPES.slice(0, 4).join(', ').toLowerCase()}, or anything heavy. Find one? Report it for points instead.
              </p>
            </Card>

            <div className="space-y-2">
              <Toggle on={withCrew} setOn={setWithCrew} icon={<Users size={15} />} label="Run with my crew" sub="Adds to crew weekly score" />
              <Toggle on={sunset} setOn={setSunset} icon={<Sun size={15} />} label="Sunset Cleanup challenge" sub="Chance at the Sol-Mote collectible" />
              <Toggle on={spoofDemo} setOn={setSpoofDemo} icon={<AlertTriangle size={15} />} label="Demo: simulate spoofed location" sub="Shows the quiet anti-fraud review path" tone="rose" />
            </div>

            <Button glowToken={t.glow} className="w-full" onClick={() => setStep(1)}>
              I'm here & ready <ArrowRight size={16} />
            </Button>
          </div>
        )}

        {/* 1 — Check in (geofence) */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeInUp">
            <StepTitle icon={<MapPin size={18} />} title="Check in" sub="Confirming you're inside the mission area." />
            <ARViewport glowToken={spoofDemo ? 'fuchsia' : t.glow} label="Locating">
              <div className="absolute inset-0 grid place-items-center">
                <div className="relative">
                  <span className={`absolute -inset-6 rounded-full ${spoofDemo ? 'bg-rose-400/20' : g.bg} animate-glowPulse`} />
                  <MapPin size={56} className={spoofDemo ? 'text-rose-300' : g.text} />
                </div>
              </div>
            </ARViewport>
            {spoofDemo ? (
              <Hint icon={<AlertTriangle size={14} className="mt-0.5 text-rose-300 shrink-0" />}>
                Location signal looks inconsistent with your recent movement. The mission still runs — but rewards
                will be held for a quick, private review.
              </Hint>
            ) : (
              <Hint icon={<CheckCircle2 size={14} className="mt-0.5 text-emerald-300 shrink-0" />}>
                Inside the geofence. Time on site and movement are tracked to verify a real cleanup.
              </Hint>
            )}
            <Button glowToken={t.glow} className="w-full" onClick={() => setStep(2)}>
              Confirm check-in <ArrowRight size={16} />
            </Button>
          </div>
        )}

        {/* 2 — Before capture */}
        {step === 2 && (
          <CaptureStep
            glowToken={t.glow}
            label="Before"
            title="Capture the 'before'"
            sub="An in-app photo establishes the starting state. (No camera needed in this demo.)"
            emoji="🌫️"
            onCapture={() => setStep(3)}
          />
        )}

        {/* 3 — AR cleanup */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeInUp">
            <StepTitle icon={<Trash2 size={18} />} title="Clean it up" sub="Tap each litter fragment to collect it. Sorted recyclables score higher." />
            <ARViewport glowToken={t.glow} label="AR cleanup · live">
              {fragments.map((f) => {
                const done = !!collected[f.id];
                if (done) return null;
                return (
                  <button
                    key={f.id}
                    onClick={() => collect(f)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 active:scale-90 transition-transform"
                    style={{ left: `${f.x}%`, top: `${f.y}%`, fontSize: `${f.size * 1.6}rem` }}
                    aria-label={f.hazard ? 'hazard' : 'litter'}
                  >
                    <span className="relative inline-block animate-float">
                      <span
                        className={`absolute -inset-2 rounded-full blur-sm ${f.hazard ? 'bg-rose-500/40' : g.bg} animate-glowPulse`}
                        aria-hidden
                      />
                      <span className="relative">{f.emoji}</span>
                    </span>
                  </button>
                );
              })}
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] text-white/80">
                <span className="flex items-center gap-1"><Trash2 size={12} /> {collectedCount}/{nonHazardFrags.length}</span>
                <span className="flex items-center gap-1"><Recycle size={12} className="text-emerald-300" /> {recycledCount} sorted</span>
              </div>
            </ARViewport>

            <ProgressBar value={(collectedCount / Math.max(1, nonHazardFrags.length)) * 100} glowToken={t.glow} />

            <Button
              glowToken={t.glow}
              className="w-full"
              disabled={collectedCount < 1}
              onClick={() => setStep(4)}
            >
              {allCollected ? 'Bag it & capture after' : `Finish (${nonHazardFrags.length - collectedCount} left)`} <ArrowRight size={16} />
            </Button>
          </div>
        )}

        {/* 4 — After capture */}
        {step === 4 && (
          <CaptureStep
            glowToken={t.glow}
            label="After"
            title="Capture the 'after'"
            sub="Image analysis compares before/after to confirm a likely improvement."
            emoji="✨"
            improved
            onCapture={() => setStep(5)}
          />
        )}

        {/* 5 — Disposal */}
        {step === 5 && (
          <div className="space-y-4 animate-fadeInUp">
            <StepTitle icon={<Recycle size={18} />} title="Close the loop" sub="Confirm the litter was bagged and properly disposed." />
            <div className="space-y-2">
              <EvidenceRow
                on={bagConfirmed}
                onToggle={() => setBagConfirmed((v) => !v)}
                icon={<Trash2 size={16} />}
                title="Bag confirmed"
                sub={`~${estimatePounds(collectedCount)} lb collected · ${recycledCount} recyclables sorted`}
              />
              <EvidenceRow
                on={scanned}
                onToggle={() => setScanned((v) => !v)}
                icon={<QrCode size={16} />}
                title="Scan disposal checkpoint"
                sub="Official drop-off / partner bin · unlocks High-Impact tier"
              />
            </div>
            <Hint icon={<Sparkles size={14} className={`mt-0.5 ${g.text} shrink-0`} />}>
              Bag + checkpoint scan raises this cleanup from <b>Glow Verified</b> to <b>High-Impact Verified</b>,
              which counts for more on city dashboards.
            </Hint>
            <Button glowToken={t.glow} className="w-full" disabled={!bagConfirmed} onClick={() => setStep(6)}>
              Verify my cleanup <ArrowRight size={16} />
            </Button>
          </div>
        )}

        {/* 6 — Verifying */}
        {step === 6 && <Verifying zone={zone} glowToken={t.glow} signals={resultRef.current?.signals} spoof={spoofDemo} bag={bagConfirmed} scan={scanned} event={isEventZone} />}

        {/* 7 — Reveal */}
        {step === 7 && resultRef.current && (
          <Reveal
            zone={zone}
            result={resultRef.current}
            collectedCount={collectedCount}
            recycledCount={recycledCount}
            preCollection={preCollection.current}
            sunset={sunset}
            onClose={onClose}
          />
        )}
      </div>

      {/* Hazard modal */}
      {hazardOpen && (
        <HazardModal
          alreadyReported={hazardReported}
          onReport={reportHazard}
          onCancel={() => setHazardOpen(false)}
        />
      )}
    </div>
  );
}

// ---- small building blocks -------------------------------------------------

function StepTitle({ icon, title, sub }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 grid place-items-center text-emerald-300">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <p className="text-xs text-slate-400">{sub}</p>
      </div>
    </div>
  );
}

function Toggle({ on, setOn, icon, label, sub, tone = 'emerald' }) {
  const g = glow(tone === 'rose' ? 'fuchsia' : tone);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition ${
        on ? `${g.bg} ${g.border}` : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
      }`}
    >
      <span className={on ? g.text : 'text-slate-400'}>{icon}</span>
      <span className="flex-1">
        <span className="block text-sm font-medium text-white">{label}</span>
        <span className="block text-[11px] text-slate-400">{sub}</span>
      </span>
      <span className={`h-5 w-9 rounded-full p-0.5 transition ${on ? 'bg-emerald-400' : 'bg-white/15'}`}>
        <span className={`block h-4 w-4 rounded-full bg-slate-950 transition-transform ${on ? 'translate-x-4' : ''}`} />
      </span>
    </button>
  );
}

function CaptureStep({ glowToken, label, title, sub, emoji, improved, onCapture }) {
  const [snapped, setSnapped] = useState(false);
  const g = glow(glowToken);
  return (
    <div className="space-y-4 animate-fadeInUp">
      <StepTitle icon={<Camera size={18} />} title={title} sub={sub} />
      <ARViewport glowToken={glowToken} label={`${label} capture`}>
        <div className="absolute inset-0 grid place-items-center">
          <div className={`text-7xl ${improved && snapped ? '' : 'opacity-70'} ${snapped ? 'animate-fadeIn' : ''}`}>
            {snapped && improved ? '🌳' : emoji}
          </div>
        </div>
        {snapped && (
          <div className="absolute inset-0 bg-white animate-reveal pointer-events-none" aria-hidden />
        )}
      </ARViewport>
      {!snapped ? (
        <Button
          glowToken={glowToken}
          className="w-full"
          onClick={() => {
            setSnapped(true);
            setTimeout(onCapture, 650);
          }}
        >
          <Camera size={16} /> Capture {label.toLowerCase()}
        </Button>
      ) : (
        <div className={`text-center text-sm font-medium ${g.text}`}>Captured ✓</div>
      )}
    </div>
  );
}

function EvidenceRow({ on, onToggle, icon, title, sub }) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition ${
        on ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
      }`}
    >
      <span className={on ? 'text-emerald-300' : 'text-slate-400'}>{icon}</span>
      <span className="flex-1">
        <span className="block text-sm font-medium text-white">{title}</span>
        <span className="block text-[11px] text-slate-400">{sub}</span>
      </span>
      <CheckCircle2 size={20} className={on ? 'text-emerald-400' : 'text-white/15'} />
    </button>
  );
}

function HazardModal({ onReport, onCancel, alreadyReported }) {
  return (
    <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-sm grid place-items-end sm:place-items-center p-4 animate-fadeIn">
      <Card glowToken="fuchsia" className="w-full p-5 border-rose-400/40">
        <div className="flex items-center gap-2 text-rose-300">
          <AlertTriangle size={20} />
          <h3 className="font-bold">Don't touch that</h3>
        </div>
        <p className="text-sm text-slate-300 mt-2">
          That looks hazardous. Leave it where it is — reporting it correctly is worth more than collecting it, and
          keeps you safe. We'll route it to the right city department or land manager.
        </p>
        {alreadyReported ? (
          <p className="mt-3 text-sm text-emerald-300 font-medium">Already reported — thank you. +75 pts awarded.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {HAZARD_TYPES.slice(0, 4).map((h) => (
              <Button key={h} variant="ghost" className="text-xs" onClick={() => onReport(h)}>
                {h}
              </Button>
            ))}
          </div>
        )}
        <button onClick={onCancel} className="mt-4 w-full text-center text-xs text-slate-400 hover:text-white">
          Close
        </button>
      </Card>
    </div>
  );
}

// Animated multi-signal verification.
function Verifying({ zone, glowToken, signals, spoof, bag, scan, event }) {
  const checks = useMemo(
    () => [
      { label: 'Location & geofence', ok: !spoof },
      { label: 'Time on site & movement', ok: !spoof },
      { label: 'Before / after capture', ok: true },
      { label: 'Image improvement analysis', ok: true },
      { label: 'Bag & disposal evidence', ok: bag },
      { label: 'Checkpoint scan', ok: scan },
      { label: 'Duplicate & device checks', ok: !spoof },
      ...(event ? [{ label: 'Event coordinator validation', ok: true }] : []),
    ],
    [spoof, bag, scan, event],
  );
  const [shown, setShown] = useState(0);
  const g = glow(glowToken);

  useEffect(() => {
    if (shown >= checks.length) return;
    const id = setTimeout(() => setShown((s) => s + 1), 280);
    return () => clearTimeout(id);
  }, [shown, checks.length]);

  return (
    <div className="space-y-4 py-6 animate-fadeInUp">
      <div className="flex flex-col items-center text-center">
        <Loader2 size={40} className={`${g.text} animate-spin`} />
        <h2 className="text-lg font-bold text-white mt-3">Verifying your cleanup</h2>
        <p className="text-xs text-slate-400">Combining independent signals into a confidence score…</p>
      </div>
      <Card className="p-2 divide-y divide-white/5">
        {checks.map((c, i) => (
          <div key={c.label} className={`flex items-center justify-between px-2 py-2.5 transition ${i < shown ? 'opacity-100' : 'opacity-30'}`}>
            <span className="text-sm text-slate-200">{c.label}</span>
            {i < shown ? (
              c.ok ? (
                <CheckCircle2 size={18} className="text-emerald-400" />
              ) : (
                <AlertTriangle size={18} className="text-amber-400" />
              )
            ) : (
              <Loader2 size={16} className="text-slate-500 animate-spin" />
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}

// The restoration payoff.
function Reveal({ zone, result, collectedCount, recycledCount, preCollection, sunset, onClose }) {
  const { state } = useGame();
  const t = ZONE_TYPES[zone.type];
  const g = glow(t.glow);
  const { tier, impact, confidence, pounds } = result;
  const held = tier.key === 'REVIEW';
  const live = state.zones[zone.id];

  // Guardians earned by this mission (not present before).
  const newCreatures = Object.keys(state.collection).filter((id) => !preCollection.includes(id));

  return (
    <div className="space-y-4 animate-fadeInUp">
      {/* Big bloom */}
      <div className="relative">
        <ARViewport glowToken={held ? 'amber' : t.glow} label={held ? 'Submitted' : 'Restored'}>
          <div className="absolute inset-0 grid place-items-center">
            {!held && <span className={`absolute h-40 w-40 rounded-full ${g.bg} animate-reveal`} aria-hidden />}
            <div className="text-7xl animate-float">{held ? '🕓' : sunset ? '🌅' : '🌳'}</div>
          </div>
          {!held && (
            <div className="absolute bottom-0 inset-x-0 flex justify-center">
              <div className={`h-16 w-2 rounded-t-full bg-gradient-to-t ${g.from} ${g.to} animate-beacon`} />
            </div>
          )}
        </ARViewport>
      </div>

      <div className="text-center">
        <Chip glowToken={tier.glow}>{tier.label}</Chip>
        <h1 className="text-2xl font-bold text-white mt-2">
          {held ? 'Cleanup submitted' : live.status === 'restored' ? `${zone.name.split('—')[0].trim()} is glowing` : 'Zone restoring'}
        </h1>
        <p className="text-xs text-slate-400 mt-1 px-4">{tier.blurb}</p>
      </div>

      {held ? (
        <Card glowToken="amber" className="p-4 text-center">
          <p className="text-sm text-slate-300">
            Your points are held pending a quick, private review. No public flag, and you can appeal with one tap.
            Reliable activity restores your trust score quickly.
          </p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 text-center">
            <RevealStat value={`+${impact.points}`} label="Glow Points" glowToken={t.glow} />
            <RevealStat value={collectedCount} label="Items" glowToken="cyan" />
            <RevealStat value={`${pounds} lb`} label="Removed" glowToken="lime" />
          </div>

          {/* Impact breakdown — proves it isn't weight-based */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Impact score breakdown</span>
              <span className="text-[11px] text-slate-500">{Math.round(confidence * 100)}% confidence</span>
            </div>
            <div className="space-y-2">
              {[
                ['Cleanup quality', impact.breakdown.cleanupQuality, 'emerald'],
                ['Location priority', impact.breakdown.locationPriority, 'fuchsia'],
                ['Disposal / recycling', impact.breakdown.disposal, 'cyan'],
                ['Consistency & return', impact.breakdown.consistency, 'amber'],
                ['Team & event', impact.breakdown.teamEvent, 'lime'],
                ['Community', impact.breakdown.community, 'violet'],
              ].map(([label, val, tok]) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                    <span>{label}</span>
                    <span>{Math.round(val * 100)}%</span>
                  </div>
                  <ProgressBar value={val * 100} glowToken={tok} height="h-1.5" />
                </div>
              ))}
            </div>
            {impact.capped && (
              <p className="mt-2 text-[11px] text-amber-300">Unusually large claim — capped and flagged for routine review.</p>
            )}
          </Card>

          {/* New guardian unlocks */}
          {newCreatures.map((id) => {
            const c = CREATURES[id];
            if (!c) return null;
            return (
              <Card key={id} glowToken={c.glow} className="p-4 flex items-center gap-3 animate-fadeInUp">
                <div className="text-4xl animate-float">{c.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wide text-slate-400">New guardian</span>
                    <Chip glowToken={c.glow} className="capitalize">{c.rarity}</Chip>
                  </div>
                  <div className="font-bold text-white">{c.name}</div>
                  <div className="text-[11px] text-slate-400">{c.lore}</div>
                </div>
                <Sparkles size={18} className={glow(c.glow).text} />
              </Card>
            );
          })}
        </>
      )}

      <div className="grid grid-cols-2 gap-3 pt-1">
        <Button variant="ghost" onClick={onClose}>
          <Share2 size={16} /> Share card
        </Button>
        <Button glowToken={t.glow} onClick={onClose}>
          {held ? 'Back to map' : 'Claim & continue'} <Footprints size={16} />
        </Button>
      </div>
      {!held && (
        <p className="text-center text-[11px] text-slate-500">
          {live.contributors.length} restorer{live.contributors.length === 1 ? '' : 's'} are now linked to this place forever.
        </p>
      )}
    </div>
  );
}

function RevealStat({ value, label, glowToken }) {
  const g = glow(glowToken);
  return (
    <Card className="p-3">
      <div className={`text-xl font-bold ${g.text}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-slate-400 mt-0.5">{label}</div>
    </Card>
  );
}
