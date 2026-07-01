import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { INTEGRITY_SIGNALS, FAIR_PLAY, LITTER_CLASS_MAP, LITTER_CLASSES } from '../data/gameData';
import { PrimaryButton, Chip, cx } from './ui';
import {
  X, MapPin, ShieldCheck, Video, Footprints, Fingerprint, Hand, Trash2,
  QrCode, Check, Loader2, ScanLine, ShoppingBag, Recycle, Crosshair, ChevronRight,
  CameraOff, RefreshCw,
} from 'lucide-react';

const ICONS = { MapPin, ShieldCheck, Video, Footprints, Fingerprint, Hand, Trash2, QrCode };

const ARMING = 'arming';
const LIVE = 'live';
const DISPOSAL = 'disposal';

const BAG_TARGET = 8; // items that visually "fill" the bag
const DETECT_MS = 220; // detection cadence
const MIN_SCORE = 0.5; // detection confidence threshold
const COLLECT_RADIUS = 0.12; // normalized distance to treat a detection as already-bagged

const fmtClock = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// --- Fair Play (anti-cheat) explainer sheet --------------------------------
const FairPlaySheet = ({ onClose }) => (
  <div className="absolute inset-0 z-30 flex items-end">
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

const ARCleanupSession = ({ zone, onClose }) => {
  const { completeMission, player } = useGame();
  const [stage, setStage] = useState(ARMING);
  const [armStep, setArmStep] = useState(0);

  // camera + model
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const streamRef = useRef(null);
  const modelRef = useRef(null);
  const loopRef = useRef(null);
  const [camState, setCamState] = useState('idle'); // idle | requesting | live | denied | error
  const [modelState, setModelState] = useState('idle'); // idle | loading | ready | error
  const [detections, setDetections] = useState([]); // [{id,label,klass,emoji,points,recyclable,score,box:{l,t,w,h}}]

  // gameplay
  const [collected, setCollected] = useState([]);
  const collectedZonesRef = useRef([]); // normalized centers already bagged
  const [seconds, setSeconds] = useState(0);
  const [microToast, setMicroToast] = useState(null);
  const [showFairPlay, setShowFairPlay] = useState(false);
  const [sorted, setSorted] = useState(true);
  const [pickFx, setPickFx] = useState(null); // transient ground->hand->bag chain
  const [disposalPhase, setDisposalPhase] = useState('walk');
  const [credited, setCredited] = useState(0);
  const timerRef = useRef(null);

  const pendingPoints = collected.reduce((s, it) => s + it.points, 0);
  const bagPct = Math.min(100, Math.round((collected.length / BAG_TARGET) * 100));

  const flash = useCallback((message, tone = 'ok') => {
    setMicroToast({ message, tone, id: Date.now() });
    setTimeout(() => setMicroToast((m) => (m && m.message === message ? null : m)), 1500);
  }, []);

  // session clock
  useEffect(() => {
    if (stage === LIVE || stage === DISPOSAL) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [stage]);

  // reveal integrity checks while arming
  useEffect(() => {
    if (stage !== ARMING || armStep >= INTEGRITY_SIGNALS.length) return;
    const t = setTimeout(() => setArmStep((s) => s + 1), 560);
    return () => clearTimeout(t);
  }, [stage, armStep]);

  // ---- start camera + detector when entering LIVE ----
  const startAR = useCallback(async () => {
    setStage(LIVE);
    setCamState('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCamState('live');
    } catch (e) {
      setCamState(e && (e.name === 'NotAllowedError' || e.name === 'SecurityError') ? 'denied' : 'error');
      return;
    }

    // load the on-device object detector
    setModelState('loading');
    try {
      const [tf, cocoSsd] = await Promise.all([
        import('@tensorflow/tfjs'),
        import('@tensorflow-models/coco-ssd'),
      ]);
      await tf.ready();
      // Load the detector from our own origin (no runtime CDN dependency).
      modelRef.current = await cocoSsd.load({
        modelUrl: `${process.env.PUBLIC_URL}/models/coco-ssd/model.json`,
      });
      setModelState('ready');
      runDetectLoop();
    } catch (e) {
      setModelState('error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- continuous real-time detection loop over the live video ----
  const runDetectLoop = useCallback(() => {
    let stopped = false;
    const tick = async () => {
      if (stopped) return;
      const video = videoRef.current;
      const model = modelRef.current;
      const wrap = wrapRef.current;
      if (model && video && video.readyState >= 2 && wrap) {
        let preds = [];
        try { preds = await model.detect(video, 12); } catch { preds = []; }

        const vw = video.videoWidth || 1280;
        const vh = video.videoHeight || 720;
        const cw = wrap.clientWidth;
        const ch = wrap.clientHeight;
        // object-cover mapping: video is scaled to cover the wrapper
        const scale = Math.max(cw / vw, ch / vh);
        const dw = vw * scale;
        const dh = vh * scale;
        const ox = (cw - dw) / 2;
        const oy = (ch - dh) / 2;

        const zones = collectedZonesRef.current;
        const mapped = preds
          .filter((p) => p.score >= MIN_SCORE && LITTER_CLASSES.includes(p.class))
          .map((p, i) => {
            const [x, y, w, h] = p.bbox; // in intrinsic video px
            const cx0 = (x + w / 2) / vw;
            const cy0 = (y + h / 2) / vh;
            const already = zones.some((z) => Math.hypot(z.x - cx0, z.y - cy0) < COLLECT_RADIUS);
            if (already) return null;
            const meta = LITTER_CLASS_MAP[p.class];
            return {
              id: `${p.class}-${i}`,
              cx: cx0,
              cy: cy0,
              score: p.score,
              ...meta,
              box: {
                l: x * scale + ox,
                t: y * scale + oy,
                w: w * scale,
                h: h * scale,
              },
            };
          })
          .filter(Boolean);
        setDetections(mapped);
      }
      loopRef.current = setTimeout(tick, DETECT_MS);
    };
    tick();
    return () => { stopped = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // cleanup camera + loop on unmount
  useEffect(() => () => {
    if (loopRef.current) clearTimeout(loopRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
  }, []);

  // ---- collect a detected item (the ground -> hand -> bag transfer) ----
  const collect = (det) => {
    if (pickFx) return;
    collectedZonesRef.current = [...collectedZonesRef.current, { x: det.cx, y: det.cy }];
    setDetections((prev) => prev.filter((d) => d.id !== det.id));
    setPickFx({ phase: 'ground', det });
    setTimeout(() => setPickFx((f) => (f ? { ...f, phase: 'hand' } : f)), 420);
    setTimeout(() => {
      setPickFx((f) => (f ? { ...f, phase: 'bagged' } : f));
      if (collected.length === 1) flash('Duplicate frame rejected', 'warn');
      else flash(`Verified · ${det.type}`, 'ok');
    }, 900);
    setTimeout(() => {
      setCollected((prev) => [...prev, det]);
      setPickFx(null);
    }, 1300);
  };

  const retryCamera = () => { setCamState('idle'); startAR(); };

  const startDisposal = () => {
    if (loopRef.current) clearTimeout(loopRef.current);
    setStage(DISPOSAL);
    setDisposalPhase('walk');
    setTimeout(() => setDisposalPhase('scan'), 1300);
  };

  const computeTotal = useCallback(() => {
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
  }, [collected, sorted, zone, player.streak]);

  const finalize = () => {
    const { breakdown, totalPoints } = computeTotal();
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    completeMission(zone, { sorted, breakdown, totalPoints });
    onClose();
  };

  const runDeposit = () => {
    setDisposalPhase('deposit');
    let c = 0;
    const total = computeTotal().totalPoints;
    const step = Math.max(1, Math.round(total / 24));
    const t = setInterval(() => {
      c = Math.min(total, c + step);
      setCredited(c);
      if (c >= total) { clearInterval(t); setDisposalPhase('done'); setTimeout(finalize, 700); }
    }, 40);
  };

  const detecting = camState === 'live' && modelState === 'ready';

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={stage === ARMING ? onClose : undefined} />
      <div className="relative w-full max-w-[440px] h-[100dvh] sm:h-[860px] sm:max-h-[92vh] overflow-hidden sm:rounded-[32px] bg-black ring-1 ring-white/10 flex flex-col">

        {/* ===================== ARMING ===================== */}
        {stage === ARMING && (
          <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-5 pb-6 bg-grime-900">
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
              <PrimaryButton disabled={armStep < INTEGRITY_SIGNALS.length} onClick={startAR}>
                {armStep < INTEGRITY_SIGNALS.length ? 'Verifying…' : 'Open camera & begin'}
              </PrimaryButton>
              <p className="text-center text-white/30 text-[10px] mt-2">Live AR · on-device detection · camera stays on the whole session</p>
            </div>
          </div>
        )}

        {/* ===================== LIVE (real camera + AR overlay) ===================== */}
        {stage === LIVE && (
          <div ref={wrapRef} className="relative flex-1 bg-black overflow-hidden">
            {/* the live camera feed — full screen */}
            <video
              ref={videoRef}
              muted
              playsInline
              autoPlay
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* AR detection boxes drawn over the real world */}
            {detecting && detections.map((d) => (
              <button
                key={d.id}
                onClick={() => collect(d)}
                className="absolute z-10 group"
                style={{ left: d.box.l, top: d.box.t, width: d.box.w, height: d.box.h }}
              >
                <span className="absolute inset-0 rounded-lg border-2 border-quest-300 shadow-glow animate-pop" />
                {['-top-0.5 -left-0.5 border-t-2 border-l-2', '-top-0.5 -right-0.5 border-t-2 border-r-2', '-bottom-0.5 -left-0.5 border-b-2 border-l-2', '-bottom-0.5 -right-0.5 border-b-2 border-r-2'].map((p, k) => (
                  <span key={k} className={cx('absolute h-3 w-3 border-quest-200', p)} />
                ))}
                <span className="absolute -top-6 left-0 whitespace-nowrap rounded-md bg-quest-400 text-grime-900 px-1.5 py-0.5 text-[10px] font-black">
                  {d.emoji} {d.type} · {Math.round(d.score * 100)}%
                </span>
                <span className="absolute -bottom-6 right-0 whitespace-nowrap rounded-md bg-black/70 text-quest-200 px-1.5 py-0.5 text-[10px] font-bold">
                  tap to bag +{d.points}
                </span>
              </button>
            ))}

            {/* scanning reticle while detector is warming or nothing found */}
            {detecting && detections.length === 0 && !pickFx && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <Crosshair className="h-12 w-12 text-white/60 animate-pulseGlow mx-auto" />
                <p className="text-white/70 text-xs font-semibold mt-2 drop-shadow">Point at litter to detect it</p>
              </div>
            )}

            {/* camera / model status overlays */}
            {(camState === 'requesting' || (camState === 'live' && modelState === 'loading')) && (
              <div className="absolute inset-0 grid place-items-center bg-black/70 backdrop-blur-sm text-center px-8">
                <div>
                  <Loader2 className="h-10 w-10 text-quest-300 animate-spinSlow mx-auto" />
                  <p className="text-white font-bold text-sm mt-3">
                    {camState === 'requesting' ? 'Starting camera…' : 'Loading on-device AR detector…'}
                  </p>
                  <p className="text-white/45 text-[11px] mt-1">Detection runs privately on your device</p>
                </div>
              </div>
            )}
            {(camState === 'denied' || camState === 'error' || modelState === 'error') && (
              <div className="absolute inset-0 grid place-items-center bg-grime-900 text-center px-8">
                <div>
                  <CameraOff className="h-10 w-10 text-sun-400 mx-auto" />
                  <p className="text-white font-bold text-base mt-3">
                    {camState === 'denied' ? 'Camera access needed' : modelState === 'error' ? 'Detector failed to load' : 'Camera unavailable'}
                  </p>
                  <p className="text-white/50 text-[12px] mt-1 max-w-[240px] mx-auto">
                    {camState === 'denied'
                      ? 'CleanQuest is live AR — allow camera access to detect and bag real litter.'
                      : 'Check your connection and try again.'}
                  </p>
                  <button onClick={retryCamera} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-quest-400 text-grime-900 font-bold text-sm px-4 py-2.5 active:scale-95">
                    <RefreshCw className="h-4 w-4" /> Try again
                  </button>
                  <button onClick={onClose} className="block mx-auto mt-2 text-white/40 text-xs">Cancel</button>
                </div>
              </div>
            )}

            {/* ---- top integrity HUD ---- */}
            <div className="absolute top-0 inset-x-0 p-3 flex items-center gap-2 bg-gradient-to-b from-black/70 to-transparent z-20">
              <Chip className="bg-rose-500/30 text-white ring-1 ring-rose-400/50">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulseGlow" /> REC {fmtClock(seconds)}
              </Chip>
              <Chip className="glass text-white/90"><MapPin className="h-3 w-3 text-quest-300" /> Locked</Chip>
              <Chip className="glass text-white/90"><Video className="h-3 w-3 text-quest-300" /> Live AR</Chip>
              <button onClick={() => setShowFairPlay(true)} className="ml-auto grid place-items-center h-8 w-8 rounded-full glass">
                <ShieldCheck className="h-4 w-4 text-quest-300" />
              </button>
              <button onClick={onClose} className="grid place-items-center h-8 w-8 rounded-full glass">
                <X className="h-4 w-4 text-white/80" />
              </button>
            </div>

            {/* micro toast */}
            {microToast && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 animate-slideUp z-20">
                <div className={cx('rounded-full px-3 py-1.5 text-[11px] font-bold flex items-center gap-1.5 shadow-soft',
                  microToast.tone === 'warn' ? 'bg-sun-500/95 text-grime-900' : 'bg-quest-400/95 text-grime-900')}>
                  {microToast.tone === 'warn' ? <Fingerprint className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                  {microToast.message}
                </div>
              </div>
            )}

            {/* pickup transfer chain (ground -> hand -> bag) */}
            {pickFx && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-44 z-20 flex items-center gap-1.5 bg-black/80 rounded-full px-3 py-1.5 animate-pop whitespace-nowrap">
                {[['ground', Crosshair, 'Spotted'], ['hand', Hand, 'Picked up'], ['bagged', ShoppingBag, 'Bagged']].map(([key, Icon, label], i) => {
                  const order = ['ground', 'hand', 'bagged'];
                  const active = order.indexOf(pickFx.phase) >= i;
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
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/55 to-transparent z-20">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <span className="grid place-items-center h-12 w-12 rounded-2xl bg-white/12 ring-1 ring-white/20 text-2xl">🛍️</span>
                  <span className="absolute -bottom-1 -right-1 grid place-items-center h-5 min-w-5 px-1 rounded-full bg-quest-400 text-grime-900 text-[11px] font-black">{collected.length}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-white/80 font-semibold">Bag fill</span>
                    <span className="text-white/55">{detecting ? `${detections.length} in view` : 'detector warming…'}</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-white/15 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-quest-400 to-ocean-400 transition-all duration-500" style={{ width: `${bagPct}%` }} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-quest-300 font-black text-lg leading-none">+{pendingPoints}</p>
                  <p className="text-white/50 text-[9px]">pending</p>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 py-3 text-center text-white/70 text-[13px] font-semibold flex items-center justify-center gap-2">
                <ScanLine className="h-4 w-4 text-quest-300" />
                {detecting ? 'Tap a highlighted item to pick it up' : 'Aim your camera at litter'}
              </div>

              <button
                disabled={collected.length === 0 || !!pickFx}
                onClick={startDisposal}
                className={cx('mt-2 w-full rounded-2xl py-3 font-bold text-sm flex items-center justify-center gap-2 transition',
                  collected.length === 0 || pickFx ? 'bg-white/8 text-white/35' : 'bg-white/15 text-white active:scale-[0.98]')}
              >
                <QrCode className="h-4 w-4" /> Finish & dispose bag ({collected.length})
              </button>
            </div>
          </div>
        )}

        {/* ===================== DISPOSAL (still on live camera) ===================== */}
        {stage === DISPOSAL && (
          <div className="relative flex-1 bg-black overflow-hidden">
            <video ref={videoRef} muted playsInline autoPlay className="absolute inset-0 h-full w-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 grid place-items-center">
              {disposalPhase === 'walk' && (
                <div className="text-center animate-pop">
                  <div className="relative mx-auto h-16 w-16">
                    <span className="absolute inset-0 rounded-full bg-ocean-400/25 animate-ripple" />
                    <span className="relative grid place-items-center h-16 w-16 rounded-full bg-ocean-500 ring-2 ring-white/40"><Footprints className="h-7 w-7 text-white" /></span>
                  </div>
                  <p className="text-white font-bold text-sm mt-3">Walk to the approved disposal point</p>
                  <p className="text-white/60 text-[11px]">Riverside Recycling Station · 40m</p>
                </div>
              )}
              {disposalPhase === 'scan' && (
                <div className="text-center">
                  <div className="relative mx-auto h-44 w-44 rounded-3xl ring-2 ring-quest-400/60 overflow-hidden bg-black/40">
                    <div className="absolute inset-6 grid place-items-center"><QrCode className="h-24 w-24 text-white/85" /></div>
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

            <div className="absolute top-0 inset-x-0 p-3 flex items-center gap-2 bg-gradient-to-b from-black/70 to-transparent">
              <Chip className="bg-rose-500/30 text-white ring-1 ring-rose-400/50"><span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulseGlow" /> REC {fmtClock(seconds)}</Chip>
              <Chip className="glass text-white/90"><Video className="h-3 w-3 text-quest-300" /> Live AR</Chip>
              <span className="ml-auto text-white/70 text-[11px] font-semibold">{collected.length} items in bag</span>
            </div>

            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
              {disposalPhase !== 'done' && (
                <button onClick={() => setSorted((v) => !v)} className={cx('mb-3 w-full rounded-2xl p-3 flex items-center gap-3 ring-1 transition',
                  sorted ? 'bg-quest-500/15 ring-quest-400/40' : 'bg-white/8 ring-white/15')}>
                  <span className={cx('grid place-items-center h-9 w-9 rounded-xl', sorted ? 'bg-quest-500/25' : 'bg-white/10')}>
                    <Recycle className={cx('h-5 w-5', sorted ? 'text-quest-300' : 'text-white/40')} />
                  </span>
                  <div className="text-left flex-1">
                    <p className="text-white font-semibold text-sm">Sort into recycling stream</p>
                    <p className="text-white/50 text-[11px]">{collected.filter((c) => c.recyclable).length} of {collected.length} items recyclable · +20%</p>
                  </div>
                  <span className={cx('h-6 w-11 rounded-full p-0.5 transition', sorted ? 'bg-quest-400' : 'bg-white/20')}>
                    <span className={cx('block h-5 w-5 rounded-full bg-white transition-transform', sorted && 'translate-x-5')} />
                  </span>
                </button>
              )}
              {disposalPhase === 'walk' && (
                <div className="rounded-2xl bg-white/10 py-3.5 text-center text-white/70 text-sm font-semibold flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spinSlow" /> Arriving at station…
                </div>
              )}
              {disposalPhase === 'scan' && <PrimaryButton onClick={runDeposit}>Scan QR & deposit bag</PrimaryButton>}
              {disposalPhase === 'deposit' && (
                <div className="rounded-2xl bg-white/10 py-3.5 text-center text-white/70 text-sm font-semibold flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spinSlow" /> Confirming bag at station…
                </div>
              )}
              {disposalPhase === 'done' && <PrimaryButton onClick={finalize}>See your impact</PrimaryButton>}
            </div>
          </div>
        )}

        {showFairPlay && <FairPlaySheet onClose={() => setShowFairPlay(false)} />}
      </div>
    </div>
  );
};

export default ARCleanupSession;
