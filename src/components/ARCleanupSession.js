import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { generateLitter, INTEGRITY_SIGNALS, FAIR_PLAY } from '../data/gameData';
import { PrimaryButton, Chip, cx } from './ui';
import {
  X, MapPin, ShieldCheck, Video, Footprints, Fingerprint, Hand, Trash2,
  QrCode, Check, Loader2, ScanLine, ShoppingBag, Recycle, Crosshair, ChevronRight,
} from 'lucide-react';

const ICONS = { MapPin, ShieldCheck, Video, Footprints, Fingerprint, Hand, Trash2, QrCode };

const ARMING = 'arming';
const LIVE = 'live';
const DISPOSAL = 'disposal';

const fmtClock = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// ---- Fair Play (anti-cheat) explainer sheet -------------------------------
const FairPlaySheet = ({ onClose }) => (
  <div className="absolute inset-0 z-20 flex items-end">
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-full max-h-[88%] overflow-y-auto no-scrollbar rounded-t-[28px] bg-grime-900 ring-1 ring-white/10 animate-slideUp p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-white font-black text-lg tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-quest-300" /> Fair play & anti-cheat
        </h3>
        <button onClick={onClose} className="grid place-items-center h-8 w-8 rounded-full bg-white/8 text-white/60"><X className="h-4 w-4" /></button>
      </div>
      <p className="text-white/45 text-xs mb-4">No single signal decides a cleanup. Layers stack so leaderboards stay clean.</p>
      <div className="space-y-3">
        {FAIR_PLAY.map((f) => {
          const Icon = ICONS[f.icon] || ShieldCheck;
          return (
            <div key={f.title} className="rounded-2xl bg-white/5 ring-1 ring-white/8 p-3.5 flex gap-3">
              <span className="grid place-items-center h-9 w-9 rounded-xl bg-quest-500/15 shrink-0">
                <Icon className="h-5 w-5 text-quest-300" />
              </span>
              <div>
                <p className="text-white font-bold text-sm">{f.title}</p>
                <p className="text-white/55 text-[12px] leading-relaxed mt-0.5">{f.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

// ---- Simulated AR camera surface ------------------------------------------
// Tries the real device camera as a dim live backdrop; always renders a
// stylized "ground" plane so detection overlays read in any environment.
const ARSurface = ({ children }) => {
  const videoRef = useRef(null);
  const [hasCam, setHasCam] = useState(false);

  useEffect(() => {
    let stream;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
          setHasCam(true);
        }
      } catch {
        setHasCam(false);
      }
    })();
    return () => { if (stream) stream.getTracks().forEach((t) => t.stop()); };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* real camera, dimmed */}
      <video ref={videoRef} muted playsInline className={cx('absolute inset-0 h-full w-full object-cover transition-opacity duration-700', hasCam ? 'opacity-40' : 'opacity-0')} />
      {/* synthetic environment */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg,#0b2230 0%,#0c2a24 38%,#10362b 100%)',
      }} />
      {/* sky / horizon glow */}
      <div className="absolute inset-x-0 top-0 h-1/3" style={{ background: 'radial-gradient(120% 90% at 50% 0%, rgba(56,189,248,0.18), transparent 70%)' }} />
      {/* perspective ground grid */}
      <svg className="absolute inset-x-0 bottom-0 h-2/3 w-full opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 12.5} y1="100" x2={50} y2="0" stroke="rgba(255,255,255,0.18)" strokeWidth="0.3" />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={100 - i * i * 2.6} x2="100" y2={100 - i * i * 2.6} stroke="rgba(255,255,255,0.14)" strokeWidth="0.3" />
        ))}
      </svg>
      {children}
    </div>
  );
};

const ARCleanupSession = ({ zone, onClose }) => {
  const { completeMission, player } = useGame();
  const [stage, setStage] = useState(ARMING);
  const [items, setItems] = useState(() => generateLitter(zone));
  const [collected, setCollected] = useState([]);
  const [lockedId, setLockedId] = useState(null);
  const [pickPhase, setPickPhase] = useState(null); // null | 'ground' | 'hand' | 'bagged'
  const [seconds, setSeconds] = useState(0);
  const [armStep, setArmStep] = useState(0); // integrity checks revealed
  const [microToast, setMicroToast] = useState(null);
  const [showFairPlay, setShowFairPlay] = useState(false);
  const [sorted, setSorted] = useState(true);
  const [disposalPhase, setDisposalPhase] = useState('walk'); // walk | scan | deposit | done
  const [credited, setCredited] = useState(0);
  const timerRef = useRef(null);

  const remaining = items.filter((it) => it.status === 'ground');
  const pendingPoints = collected.reduce((s, it) => s + it.points, 0);
  const bagPct = Math.min(100, Math.round((collected.length / Math.max(items.length, 1)) * 100));

  // session clock during live + disposal
  useEffect(() => {
    if (stage === LIVE || stage === DISPOSAL) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [stage]);

  // reveal integrity checks one-by-one while arming
  useEffect(() => {
    if (stage !== ARMING) return;
    if (armStep >= INTEGRITY_SIGNALS.length) return;
    const t = setTimeout(() => setArmStep((s) => s + 1), 620);
    return () => clearTimeout(t);
  }, [stage, armStep]);

  const flash = useCallback((message, tone = 'ok') => {
    setMicroToast({ message, tone, id: Date.now() });
    setTimeout(() => setMicroToast((m) => (m && m.message === message ? null : m)), 1600);
  }, []);

  const lockItem = (it) => {
    if (pickPhase) return;
    setLockedId(it.id);
  };

  // The full "transfer": ground → hand → bag, observed continuously.
  const pickUp = (it) => {
    if (pickPhase) return;
    setLockedId(it.id);
    setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, status: 'collecting' } : x)));
    setPickPhase('ground');
    setTimeout(() => setPickPhase('hand'), 480);
    setTimeout(() => {
      setPickPhase('bagged');
      // occasional anti-cheat micro feedback
      if (collected.length === 1) flash('Duplicate frame rejected', 'warn');
      else flash(`Verified · ${it.type}`, 'ok');
    }, 1000);
    setTimeout(() => {
      setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, status: 'bagged' } : x)));
      setCollected((prev) => [...prev, it]);
      setLockedId(null);
      setPickPhase(null);
    }, 1400);
  };

  const startDisposal = () => {
    setStage(DISPOSAL);
    setDisposalPhase('walk');
    setTimeout(() => setDisposalPhase('scan'), 1400);
  };

  const runDeposit = () => {
    setDisposalPhase('deposit');
    // count credited points up
    let c = 0;
    const total = computeTotal().totalPoints;
    const step = Math.max(1, Math.round(total / 24));
    const t = setInterval(() => {
      c = Math.min(total, c + step);
      setCredited(c);
      if (c >= total) {
        clearInterval(t);
        setDisposalPhase('done');
        setTimeout(finalize, 700);
      }
    }, 40);
  };

  // Score the session from the items that completed the full journey.
  const computeTotal = () => {
    const itemsPoints = collected.reduce((s, it) => s + it.points, 0);
    const recyclePts = sorted ? Math.round(collected.filter((c) => c.recyclable).reduce((s, it) => s + it.points, 0) * 0.2) : 0;
    const priorityMult = (zone.priority === 'High' ? 0.3 : zone.priority === 'Medium' ? 0.15 : 0.05)
      + (zone.litterDensity === 'Heavy' ? 0.15 : zone.litterDensity === 'Moderate' ? 0.08 : 0);
    const priorityPts = Math.round(itemsPoints * priorityMult);
    const streakPts = Math.round(itemsPoints * Math.min(0.15, player.streak * 0.02));
    const cityPts = zone.cityPriority ? Math.round(itemsPoints * 0.15) : 0;
    const breakdown = [
      { key: 'items', label: `${collected.length} items collected & bagged`, points: itemsPoints, color: '#10b981' },
      { key: 'priority', label: 'Area priority & litter density', points: priorityPts, color: '#0ea5e9' },
      { key: 'disposal', label: sorted ? 'Sorted recyclables (+20%)' : 'Disposed (unsorted)', points: recyclePts, color: '#f59e0b' },
      { key: 'consistency', label: `${player.streak}-day streak bonus`, points: streakPts, color: '#a78bfa' },
      ...(cityPts ? [{ key: 'city', label: 'City priority zone bonus', points: cityPts, color: '#fb7185' }] : []),
    ];
    return { breakdown, totalPoints: breakdown.reduce((s, b) => s + b.points, 0) };
  };

  const finalize = () => {
    const { breakdown, totalPoints } = computeTotal();
    completeMission(zone, { sorted, breakdown, totalPoints });
    onClose();
  };

  const lockedItem = items.find((x) => x.id === lockedId);

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={stage === ARMING ? onClose : undefined} />
      <div className="relative w-full max-w-[440px] h-[100dvh] sm:h-[860px] sm:max-h-[92vh] overflow-hidden sm:rounded-[32px] bg-grime-900 ring-1 ring-white/10 flex flex-col">

        {/* ===================== ARMING ===================== */}
        {stage === ARMING && (
          <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-5 pb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{zone.icon}</span>
                <div>
                  <p className="text-white font-bold text-sm">{zone.name}</p>
                  <p className="text-white/40 text-[11px]">AR cleanup session</p>
                </div>
              </div>
              <button onClick={onClose} className="grid place-items-center h-9 w-9 rounded-full bg-white/8 text-white/60"><X className="h-4.5 w-4.5" /></button>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-quest-500/15 to-ocean-500/10 ring-1 ring-quest-400/20 p-5 text-center">
              <div className="relative mx-auto h-20 w-20">
                <span className="absolute inset-0 rounded-full bg-quest-500/20 animate-pulseGlow" />
                <div className="relative grid place-items-center h-20 w-20 rounded-full bg-grime-800 ring-2 ring-quest-400/40">
                  <ShieldCheck className="h-9 w-9 text-quest-300" />
                </div>
              </div>
              <p className="text-white font-extrabold text-lg mt-3">Securing your session</p>
              <p className="text-white/45 text-xs mt-1">Every signal below must pass before points can be earned.</p>
            </div>

            <div className="mt-4 space-y-2">
              {INTEGRITY_SIGNALS.map((sig, i) => {
                const Icon = ICONS[sig.icon] || ShieldCheck;
                const done = i < armStep;
                return (
                  <div key={sig.key} className={cx('rounded-2xl p-3 flex items-center gap-3 ring-1 transition-all',
                    done ? 'bg-quest-500/8 ring-quest-400/20' : 'bg-white/[0.03] ring-white/6')}>
                    <span className={cx('grid place-items-center h-9 w-9 rounded-xl shrink-0', done ? 'bg-quest-500/20' : 'bg-white/6')}>
                      <Icon className={cx('h-5 w-5', done ? 'text-quest-300' : 'text-white/30')} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={cx('font-semibold text-[13px]', done ? 'text-white' : 'text-white/40')}>{sig.label}</p>
                      <p className="text-white/35 text-[11px]">{sig.detail}</p>
                    </div>
                    {done ? <Check className="h-5 w-5 text-quest-300" /> : <Loader2 className="h-4 w-4 text-white/30 animate-spinSlow" />}
                  </div>
                );
              })}
            </div>

            <button onClick={() => setShowFairPlay(true)} className="mt-4 w-full rounded-2xl bg-white/5 ring-1 ring-white/10 p-3 flex items-center gap-2.5 active:scale-[0.98]">
              <ShieldCheck className="h-4 w-4 text-quest-300" />
              <span className="text-white/75 text-[12px] font-semibold flex-1 text-left">How we keep leaderboards fair</span>
              <ChevronRight className="h-4 w-4 text-white/40" />
            </button>

            <div className="mt-4">
              <PrimaryButton disabled={armStep < INTEGRITY_SIGNALS.length} onClick={() => setStage(LIVE)}>
                {armStep < INTEGRITY_SIGNALS.length ? 'Verifying…' : 'Begin AR cleanup'}
              </PrimaryButton>
              <p className="text-center text-white/30 text-[10px] mt-2">Camera stays on for the whole session · in-app capture only</p>
            </div>
          </div>
        )}

        {/* ===================== LIVE ===================== */}
        {stage === LIVE && (
          <div className="relative flex-1">
            <ARSurface>
              {/* scanning sweep */}
              <div className="absolute inset-x-0 top-1/3 bottom-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-quest-400/0 via-quest-400/15 to-quest-400/0 animate-floaty" style={{ top: '20%' }} />
              </div>

              {/* litter detections on the ground plane */}
              {items.filter((it) => it.status !== 'bagged').map((it) => {
                const locked = it.id === lockedId;
                const collecting = it.status === 'collecting';
                return (
                  <button
                    key={it.id}
                    onClick={() => lockItem(it)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                    style={{ left: `${it.x}%`, top: `${it.y}%` }}
                  >
                    {/* flying-to-bag animation */}
                    <span className={cx('relative grid place-items-center transition-all duration-500',
                      collecting && pickPhase === 'hand' && 'scale-110 -translate-y-2',
                      collecting && pickPhase === 'bagged' && 'opacity-0 translate-y-24 scale-50')}>
                      {/* bounding box */}
                      <span className={cx('absolute -inset-3 rounded-lg border transition-colors',
                        locked ? 'border-quest-300' : 'border-quest-400/40 border-dashed')} />
                      {/* corner ticks when locked */}
                      {locked && ['-top-3 -left-3 border-t-2 border-l-2', '-top-3 -right-3 border-t-2 border-r-2', '-bottom-3 -left-3 border-b-2 border-l-2', '-bottom-3 -right-3 border-b-2 border-r-2'].map((p, k) => (
                        <span key={k} className={cx('absolute h-2.5 w-2.5 border-quest-300', p)} />
                      ))}
                      <span className="text-2xl drop-shadow-lg">{it.emoji}</span>
                      {/* label tag */}
                      <span className={cx('absolute left-1/2 -translate-x-1/2 -top-9 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[9px] font-bold transition-opacity',
                        locked ? 'bg-quest-400 text-grime-900 opacity-100' : 'bg-black/60 text-quest-200 opacity-80')}>
                        {it.type} · {Math.round(it.confidence * 100)}%
                      </span>
                    </span>
                  </button>
                );
              })}

              {/* center reticle when nothing locked */}
              {!lockedId && !pickPhase && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <Crosshair className="h-10 w-10 text-white/30 animate-pulseGlow" />
                </div>
              )}
            </ARSurface>

            {/* ---- top integrity HUD ---- */}
            <div className="absolute top-0 inset-x-0 p-3 flex items-center gap-2 bg-gradient-to-b from-black/60 to-transparent">
              <Chip className="bg-rose-500/25 text-white ring-1 ring-rose-400/40">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulseGlow" /> REC {fmtClock(seconds)}
              </Chip>
              <Chip className="glass text-white/85"><MapPin className="h-3 w-3 text-quest-300" /> Locked</Chip>
              <Chip className="glass text-white/85"><Video className="h-3 w-3 text-quest-300" /> Continuous</Chip>
              <button onClick={() => setShowFairPlay(true)} className="ml-auto grid place-items-center h-8 w-8 rounded-full glass">
                <ShieldCheck className="h-4 w-4 text-quest-300" />
              </button>
              <button onClick={onClose} className="grid place-items-center h-8 w-8 rounded-full glass">
                <X className="h-4 w-4 text-white/70" />
              </button>
            </div>

            {/* micro toast */}
            {microToast && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 animate-slideUp">
                <div className={cx('rounded-full px-3 py-1.5 text-[11px] font-bold flex items-center gap-1.5 shadow-soft',
                  microToast.tone === 'warn' ? 'bg-sun-500/90 text-grime-900' : 'bg-quest-400/95 text-grime-900')}>
                  {microToast.tone === 'warn' ? <Fingerprint className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                  {microToast.message}
                </div>
              </div>
            )}

            {/* pickup transfer indicator — the continuous ground→hand→bag chain */}
            {pickPhase && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-44 flex items-center gap-1.5 bg-black/75 rounded-full px-3 py-1.5 animate-pop whitespace-nowrap">
                {[['ground', Crosshair, 'Spotted'], ['hand', Hand, 'Picked up'], ['bagged', ShoppingBag, 'Bagged']].map(([key, Icon, label], i) => {
                  const order = ['ground', 'hand', 'bagged'];
                  const active = order.indexOf(pickPhase) >= i;
                  return (
                    <React.Fragment key={key}>
                      {i > 0 && <ChevronRight className={cx('h-3 w-3 shrink-0', active ? 'text-quest-300' : 'text-white/25')} />}
                      <span className={cx('flex items-center gap-1 text-[10px] font-bold', active ? 'text-quest-300' : 'text-white/40')}>
                        <Icon className="h-3.5 w-3.5 shrink-0" /> {label}
                      </span>
                    </React.Fragment>
                  );
                })}
              </div>
            )}

            {/* ---- bottom action dock ---- */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/85 via-black/55 to-transparent">
              {/* bag + pending */}
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <span className="grid place-items-center h-12 w-12 rounded-2xl bg-white/10 ring-1 ring-white/15 text-2xl">🛍️</span>
                  <span className="absolute -bottom-1 -right-1 grid place-items-center h-5 min-w-5 px-1 rounded-full bg-quest-400 text-grime-900 text-[11px] font-black">{collected.length}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-white/70 font-semibold">Bag fill</span>
                    <span className="text-white/50">{remaining.length} litter left in zone</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-white/12 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-quest-400 to-ocean-400 transition-all duration-500" style={{ width: `${bagPct}%` }} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-quest-300 font-black text-lg leading-none">+{pendingPoints}</p>
                  <p className="text-white/40 text-[9px]">pending</p>
                </div>
              </div>

              {lockedItem && !pickPhase ? (
                <button onClick={() => pickUp(lockedItem)} className="w-full rounded-2xl py-3.5 font-extrabold text-grime-900 bg-gradient-to-r from-quest-300 to-quest-400 shadow-glow active:scale-[0.98] transition flex items-center justify-center gap-2">
                  <Hand className="h-5 w-5" /> Pick up & bag {lockedItem.emoji} {lockedItem.type} (+{lockedItem.points})
                </button>
              ) : remaining.length > 0 ? (
                <div className="rounded-2xl bg-white/8 py-3 text-center text-white/60 text-[13px] font-semibold flex items-center justify-center gap-2">
                  <ScanLine className="h-4 w-4 text-quest-300" /> Tap a detected item to pick it up
                </div>
              ) : (
                <div className="rounded-2xl bg-quest-500/15 py-3 text-center text-quest-200 text-[13px] font-bold flex items-center justify-center gap-2">
                  <Check className="h-4 w-4" /> Zone cleared — head to disposal
                </div>
              )}

              <button
                disabled={collected.length === 0 || !!pickPhase}
                onClick={startDisposal}
                className={cx('mt-2 w-full rounded-2xl py-3 font-bold text-sm flex items-center justify-center gap-2 transition',
                  collected.length === 0 || pickPhase ? 'bg-white/5 text-white/30' : 'bg-white/12 text-white active:scale-[0.98]')}
              >
                <QrCode className="h-4 w-4" /> Finish & dispose bag ({collected.length})
              </button>
            </div>
          </div>
        )}

        {/* ===================== DISPOSAL ===================== */}
        {stage === DISPOSAL && (
          <div className="relative flex-1">
            <ARSurface>
              <div className="absolute inset-0 grid place-items-center">
                {disposalPhase === 'walk' && (
                  <div className="text-center animate-pop">
                    <div className="relative mx-auto h-16 w-16">
                      <span className="absolute inset-0 rounded-full bg-ocean-400/25 animate-ripple" />
                      <span className="relative grid place-items-center h-16 w-16 rounded-full bg-ocean-500 ring-2 ring-white/40"><Footprints className="h-7 w-7 text-white" /></span>
                    </div>
                    <p className="text-white font-bold text-sm mt-3">Walk to the approved disposal point</p>
                    <p className="text-white/45 text-[11px]">Riverside Recycling Station · 40m</p>
                  </div>
                )}

                {disposalPhase === 'scan' && (
                  <div className="text-center">
                    <div className="relative mx-auto h-44 w-44 rounded-3xl ring-2 ring-quest-400/50 overflow-hidden bg-black/40">
                      <div className="absolute inset-6 grid place-items-center"><QrCode className="h-24 w-24 text-white/80" /></div>
                      <div className="absolute inset-x-0 h-0.5 bg-quest-300 shadow-glow animate-floaty" style={{ top: '50%' }} />
                      {['-top-px -left-px border-t-2 border-l-2', '-top-px -right-px border-t-2 border-r-2', '-bottom-px -left-px border-b-2 border-l-2', '-bottom-px -right-px border-b-2 border-r-2'].map((p, k) => (
                        <span key={k} className={cx('absolute h-6 w-6 border-quest-300 rounded', p)} />
                      ))}
                    </div>
                    <p className="text-white font-bold text-sm mt-4">Scan the station QR to confirm disposal</p>
                  </div>
                )}

                {(disposalPhase === 'deposit' || disposalPhase === 'done') && (
                  <div className="text-center animate-pop">
                    <div className="relative mx-auto h-24 w-24">
                      <span className="absolute inset-0 rounded-full bg-quest-400/30 animate-pulseGlow" />
                      <div className="relative grid place-items-center h-24 w-24 rounded-full bg-gradient-to-br from-quest-400 to-quest-600 ring-4 ring-quest-200/40 text-4xl shadow-glow">
                        {disposalPhase === 'done' ? <Check className="h-12 w-12 text-grime-900" /> : '🛍️'}
                      </div>
                    </div>
                    <p className="text-white font-black text-2xl mt-4">+{credited}</p>
                    <p className="text-quest-300 text-xs font-semibold">{disposalPhase === 'done' ? 'High-confidence verified ✓' : 'Crediting your impact…'}</p>
                  </div>
                )}
              </div>
            </ARSurface>

            {/* disposal HUD */}
            <div className="absolute top-0 inset-x-0 p-3 flex items-center gap-2 bg-gradient-to-b from-black/60 to-transparent">
              <Chip className="bg-rose-500/25 text-white ring-1 ring-rose-400/40"><span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulseGlow" /> REC {fmtClock(seconds)}</Chip>
              <Chip className="glass text-white/85"><Video className="h-3 w-3 text-quest-300" /> Continuous</Chip>
              <span className="ml-auto text-white/60 text-[11px] font-semibold">{collected.length} items in bag</span>
            </div>

            {/* disposal action dock */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/85 to-transparent">
              {/* sort toggle */}
              {disposalPhase !== 'done' && (
                <button onClick={() => setSorted((v) => !v)} className={cx('mb-3 w-full rounded-2xl p-3 flex items-center gap-3 ring-1 transition',
                  sorted ? 'bg-quest-500/12 ring-quest-400/30' : 'bg-white/5 ring-white/10')}>
                  <span className={cx('grid place-items-center h-9 w-9 rounded-xl', sorted ? 'bg-quest-500/25' : 'bg-white/8')}>
                    <Recycle className={cx('h-5 w-5', sorted ? 'text-quest-300' : 'text-white/40')} />
                  </span>
                  <div className="text-left flex-1">
                    <p className="text-white font-semibold text-sm">Sort into recycling stream</p>
                    <p className="text-white/45 text-[11px]">{collected.filter((c) => c.recyclable).length} of {collected.length} items recyclable · +20%</p>
                  </div>
                  <span className={cx('h-6 w-11 rounded-full p-0.5 transition', sorted ? 'bg-quest-400' : 'bg-white/15')}>
                    <span className={cx('block h-5 w-5 rounded-full bg-white transition-transform', sorted && 'translate-x-5')} />
                  </span>
                </button>
              )}

              {disposalPhase === 'walk' && (
                <div className="rounded-2xl bg-white/8 py-3.5 text-center text-white/60 text-sm font-semibold flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spinSlow" /> Arriving at station…
                </div>
              )}
              {disposalPhase === 'scan' && (
                <PrimaryButton onClick={runDeposit}>Scan QR & deposit bag</PrimaryButton>
              )}
              {disposalPhase === 'deposit' && (
                <div className="rounded-2xl bg-white/8 py-3.5 text-center text-white/60 text-sm font-semibold flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spinSlow" /> Confirming bag at station…
                </div>
              )}
              {disposalPhase === 'done' && (
                <PrimaryButton onClick={finalize}>See your impact</PrimaryButton>
              )}
            </div>
          </div>
        )}

        {showFairPlay && <FairPlaySheet onClose={() => setShowFairPlay(false)} />}
      </div>
    </div>
  );
};

export default ARCleanupSession;
