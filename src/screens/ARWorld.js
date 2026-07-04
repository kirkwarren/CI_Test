import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useGame } from '../game/GameState';
import {
  LITTER_CLASS_MAP, NON_LITTER_CLASSES, SIZE_TIERS, TOO_CLOSE_FRAC,
  GOLDEN_MULT, RUSH_MULT, REACH, REPORT_TYPES, ADOPT_BONUS,
  buddyStage, BUDDY_STAGES,
} from '../game/data';
import { play, buzz, isSoundOn, setSoundOn } from '../game/sound';
import ParkMap from '../ui/ParkMap';
import { DetectFrame, BuddySprite } from '../ui/art';
import { cx, Pill, BigBtn } from '../ui/bits';
import {
  ShieldCheck, QrCode, Check, Loader2, Hand, ShoppingBag, Crosshair,
  CameraOff, RefreshCw, ChevronRight, Leaf, Trophy, ClipboardList, BookOpen,
  Volume2, VolumeX, Navigation2, Maximize2, X, Footprints, Flag, Camera,
} from 'lucide-react';

const DETECT_MS = 220;
const MIN_SCORE = 0.5;
const COLLECT_RADIUS = 0.12;
const COMBO_WINDOW_MS = 9000;

const fmtClock = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
const metersOf = (d) => Math.round(d * 7);

// CleanQuest AR-first: the live camera IS the game world. A picture-in-picture
// minimap guides you to litter zones and golden rewards; detection, grabbing,
// and bin disposal all happen over the live feed without ever leaving it.
const ARWorld = ({ onSheet }) => {
  const {
    bankRun, player, goldenId, rushEndsAt, spawns, pos, walkTo, showToast, myRank, claimable, toast,
    adoptedId, adoptBlock, fileReport, buddyXp, leaderboard,
  } = useGame();
  const buddyIdx = BUDDY_STAGES.indexOf(buddyStage(buddyXp));
  const hiScore = leaderboard[0] ? leaderboard[0].points : player.points;
  const pad6 = (n) => String(Math.max(0, Math.round(n))).padStart(6, '0');

  // Optional QA flag: ?debugClasses=frisbee adds detector classes for desktop QA.
  const classMap = useMemo(() => {
    const extra = new URLSearchParams(window.location.search).get('debugClasses');
    if (!extra) return LITTER_CLASS_MAP;
    const m = { ...LITTER_CLASS_MAP };
    extra.split(',').forEach((c) => {
      const k = c.trim();
      if (k && !m[k]) m[k] = { type: `QA:${k}`, emoji: '🧪', points: 5, recyclable: false, rarity: 'common' };
    });
    return m;
  }, []);
  const classes = useMemo(() => Object.keys(classMap), [classMap]);

  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const streamRef = useRef(null);
  const modelRef = useRef(null);
  const loopRef = useRef(null);
  const grabbedZonesRef = useRef([]);
  const lastGrabRef = useRef(0);
  const comboMaxRef = useRef(1);

  const [camState, setCamState] = useState('starting');
  const [modelState, setModelState] = useState('loading');
  const [detections, setDetections] = useState([]);
  const [nonLitter, setNonLitter] = useState([]);
  const [flyers, setFlyers] = useState([]);
  const [bursts, setBursts] = useState([]); // spark explosions at grab points
  const [comboFx, setComboFx] = useState(null); // center-screen combo pop
  const [bag, setBag] = useState([]);
  const [grabFx, setGrabFx] = useState(null);
  const [combo, setCombo] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [flashMsg, setFlashMsg] = useState(null);
  const [mode, setMode] = useState('hunt'); // hunt | dispose | banking
  const [creditPct, setCreditPct] = useState(0);
  const [mapOpen, setMapOpen] = useState(false);
  const [mapSel, setMapSel] = useState(null);
  const [guiding, setGuiding] = useState(null); // spawn being walked to
  const [soundOn, setSound] = useState(isSoundOn());
  const [report, setReport] = useState(null); // null | {step:'pick'|'sending'|'done', type}

  const rushActive = Date.now() < rushEndsAt;
  const pending = bag.reduce((s, b) => s + b.pts, 0);
  const comboBonusPct = Math.min(50, Math.max(0, (combo - 1) * 10));

  // --- world context: which litter zone am I standing in? where's the gold? ---
  const currentZone = useMemo(() => {
    let best = null;
    spawns.forEach((s) => {
      if (s.status !== 'active') return;
      const d = Math.hypot(s.x - pos.x, s.y - pos.y);
      if (d <= REACH && (!best || d < best.d)) best = { ...s, d };
    });
    return best;
  }, [spawns, pos]);
  const goldenSpawn = spawns.find((s) => s.id === goldenId && s.status === 'active');
  const goldenHere = currentZone && currentZone.id === goldenId;
  const goldenDist = goldenSpawn ? Math.hypot(goldenSpawn.x - pos.x, goldenSpawn.y - pos.y) : null;
  const goldenBearing = goldenSpawn ? Math.atan2(goldenSpawn.y - pos.y, goldenSpawn.x - pos.x) * 180 / Math.PI + 90 : 0;

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // keep the screen awake during a cleanup session (supported browsers)
  useEffect(() => {
    let lock = null;
    const request = async () => {
      try { lock = await navigator.wakeLock?.request('screen'); } catch { /* unsupported */ }
    };
    request();
    const onVis = () => { if (document.visibilityState === 'visible') request(); };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      try { if (lock) lock.release(); } catch { /* no-op */ }
    };
  }, []);

  const flash = useCallback((msg, warn = false) => {
    setFlashMsg({ msg, warn, id: Date.now() });
    setTimeout(() => setFlashMsg((f) => (f && f.msg === msg ? null : f)), 1500);
  }, []);

  // ---- camera + on-device detector ----
  const boot = useCallback(async () => {
    setCamState('starting');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('nocam');
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
    setModelState('loading');
    try {
      const [tf, cocoSsd] = await Promise.all([import('@tensorflow/tfjs'), import('@tensorflow-models/coco-ssd')]);
      await tf.ready();
      modelRef.current = await cocoSsd.load({ modelUrl: `${process.env.PUBLIC_URL}/models/coco-ssd/model.json` });
      setModelState('ready');
    } catch {
      setModelState('error');
    }
  }, []);

  useEffect(() => {
    boot();
    return () => {
      if (loopRef.current) clearTimeout(loopRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, [boot]);

  // ---- continuous detection over the live feed ----
  useEffect(() => {
    if (camState !== 'live' || modelState !== 'ready' || mode !== 'hunt') return undefined;
    let stopped = false;
    const tick = async () => {
      if (stopped) return;
      const video = videoRef.current;
      const wrap = wrapRef.current;
      const model = modelRef.current;
      if (model && video && video.readyState >= 2 && wrap) {
        let preds = [];
        try { preds = await model.detect(video, 12); } catch { preds = []; }
        const vw = video.videoWidth || 1280;
        const vh = video.videoHeight || 720;
        const cw = wrap.clientWidth;
        const ch = wrap.clientHeight;
        const scale = Math.max(cw / vw, ch / vh);
        const ox = (cw - vw * scale) / 2;
        const oy = (ch - vh * scale) / 2;
        const zones = grabbedZonesRef.current;
        const litter = [];
        const others = [];
        preds.filter((p) => p.score >= MIN_SCORE).forEach((p, i) => {
          const [x, y, w, h] = p.bbox;
          const bw = Math.min(w * scale, cw - 16);
          const bh = Math.min(h * scale, ch - 140);
          const bl = Math.max(8, Math.min(x * scale + ox, cw - bw - 8));
          const bt = Math.max(96, Math.min(y * scale + oy, ch - bh - 60));
          const box = { l: bl, t: bt, w: bw, h: bh };
          if (classes.includes(p.class)) {
            const ncx = (x + w / 2) / vw;
            const ncy = (y + h / 2) / vh;
            if (zones.some((z) => Math.hypot(z.x - ncx, z.y - ncy) < COLLECT_RADIUS)) return;
            const frac = (w * h) / (vw * vh);
            const tooClose = frac > TOO_CLOSE_FRAC;
            const size = SIZE_TIERS.find((t) => frac <= t.max) || SIZE_TIERS[SIZE_TIERS.length - 1];
            const meta = classMap[p.class];
            litter.push({
              id: `${p.class}-${i}`, ncx, ncy, score: p.score, ...meta,
              size, tooClose, pts: Math.round(meta.points * size.mult), box,
            });
          } else if (NON_LITTER_CLASSES.includes(p.class) && others.length < 4) {
            others.push({ id: `nl-${p.class}-${i}`, klass: p.class, score: p.score, box });
          }
        });
        setDetections(litter);
        setNonLitter(others);
      }
      loopRef.current = setTimeout(tick, DETECT_MS);
    };
    tick();
    return () => { stopped = true; if (loopRef.current) clearTimeout(loopRef.current); };
  }, [camState, modelState, mode, classes, classMap]);

  // ---- grab: ground → hand → bag, attributed to the zone you're in ----
  const grab = (det) => {
    if (grabFx) return;
    if (det.tooClose) {
      play('reject'); buzz([40, 60, 40]);
      flash('Too close — step back so we can see it', true);
      return;
    }
    play('grab'); buzz(15);
    grabbedZonesRef.current = [...grabbedZonesRef.current, { x: det.ncx, y: det.ncy }];
    setDetections((prev) => prev.filter((d) => d.id !== det.id));
    setGrabFx({ phase: 'ground', det });
    setTimeout(() => setGrabFx((f) => (f ? { ...f, phase: 'hand' } : f)), 380);
    setTimeout(() => setGrabFx((f) => (f ? { ...f, phase: 'bag' } : f)), 800);
    setTimeout(() => {
      const now = Date.now();
      play('bag'); buzz(25);
      setCombo((c) => {
        const next = now - lastGrabRef.current < COMBO_WINDOW_MS ? c + 1 : 1;
        comboMaxRef.current = Math.max(comboMaxRef.current, next);
        if (next > 1) {
          setTimeout(() => play('combo', next), 140);
          setComboFx({ n: next, id: now });
          setTimeout(() => setComboFx((f) => (f && f.id === now ? null : f)), 950);
        }
        return next;
      });
      lastGrabRef.current = now;
      const item = {
        ...det,
        zoneId: currentZone ? currentZone.id : null,
        density: currentZone ? currentZone.density : 0,
        golden: !!goldenHere,
      };
      setBag((prev) => [...prev, item]);
      const wrap = wrapRef.current;
      const fx = det.box.l + det.box.w / 2;
      const fy = det.box.t + det.box.h / 2;
      const id = now;
      setFlyers((prev) => [...prev, { id, emoji: det.emoji, pts: det.pts, x: fx, y: fy, dx: 44 - fx, dy: (wrap ? wrap.clientHeight - 96 : 700) - fy }]);
      setTimeout(() => setFlyers((prev) => prev.filter((f) => f.id !== id)), 900);
      setBursts((prev) => [...prev, { id, x: fx, y: fy, golden: goldenHere }]);
      setTimeout(() => setBursts((prev) => prev.filter((b) => b.id !== id)), 650);
      setGrabFx(null);
      flash(`+${det.pts}${goldenHere ? ' ×3 🌟' : ''} pending · ${det.size.label} ${det.type}`);
    }, 1150);
  };

  // ---- guide-me navigation via the PiP map ----
  const guideTo = (s) => {
    play('tick');
    setMapOpen(false);
    setMapSel(null);
    setGuiding(s);
    walkTo(s.x, s.y, () => {
      setGuiding(null);
      play('combo', 3); buzz([20, 40, 20]);
      showToast(`Arrived at ${s.name} — litter zone active!`, '📍');
    });
  };

  // ---- totals & banking ----
  const totals = useMemo(() => {
    const base = bag.reduce((s, b) => s + b.pts, 0);
    const goldenPts = bag.reduce((s, b) => s + (b.golden ? b.pts * (GOLDEN_MULT - 1) : 0), 0);
    const zonePts = Math.round(bag.reduce((s, b) => s + b.pts * 0.25 * b.density, 0));
    const rushPts = rushActive ? base * (RUSH_MULT - 1) : 0;
    const comboPts = Math.round(base * (comboBonusPct / 100));
    const streakPts = Math.round(base * Math.min(0.15, player.streak * 0.03));
    const adoptedPts = adoptedId ? Math.round(bag.reduce((s, b) => s + (b.zoneId === adoptedId ? b.pts * ADOPT_BONUS : 0), 0)) : 0;
    const xl = bag.filter((b) => b.size && b.size.mult >= 2).length;
    const breakdown = [
      { label: `${bag.length} items, size-weighted${xl ? ` (${xl} large!)` : ''}`, pts: base },
      ...(goldenPts ? [{ label: `🌟 Golden zone ×${GOLDEN_MULT}`, pts: goldenPts }] : []),
      ...(rushActive ? [{ label: `⚡ Litter Rush ×${RUSH_MULT}`, pts: rushPts }] : []),
      ...(adoptedPts ? [{ label: '🏡 Your adopted block +25%', pts: adoptedPts }] : []),
      { label: `Combo ×${Math.max(combo, 1)} bonus`, pts: comboPts },
      ...(zonePts ? [{ label: 'Litter-zone density bonus', pts: zonePts }] : []),
      { label: `${player.streak}-day streak`, pts: streakPts },
    ];
    return { breakdown, total: base + goldenPts + rushPts + adoptedPts + comboPts + zonePts + streakPts };
  }, [bag, comboBonusPct, combo, player.streak, rushActive, adoptedId]);

  const scanBin = () => {
    play('bank'); buzz([30, 40, 30, 40, 60]);
    setMode('banking');
    let p = 0;
    const t = setInterval(() => {
      p = Math.min(100, p + 5);
      setCreditPct(p);
      if (p >= 100) {
        clearInterval(t);
        setTimeout(() => {
          const zoneIds = [...new Set(bag.map((b) => b.zoneId).filter(Boolean))];
          bankRun({ items: bag, breakdown: totals.breakdown, total: totals.total, comboMax: comboMaxRef.current, zoneIds });
          // reset the run — the camera never closes
          setBag([]); setCombo(0); setCreditPct(0);
          comboMaxRef.current = 1;
          grabbedZonesRef.current = [];
          setMode('hunt');
        }, 500);
      }
    }, 45);
  };

  const busy = camState === 'starting' || (camState === 'live' && modelState === 'loading');
  const dead = camState === 'denied' || camState === 'error' || modelState === 'error';
  const hunting = camState === 'live' && modelState === 'ready' && mode === 'hunt';

  const toggleSound = () => { const v = !soundOn; setSoundOn(v); setSound(v); if (v) play('tick'); };

  const mapSelSpawn = mapSel ? spawns.find((s) => s.id === mapSel) : null;
  const mapSelDist = mapSelSpawn ? Math.hypot(mapSelSpawn.x - pos.x, mapSelSpawn.y - pos.y) : 0;

  return (
    <div ref={wrapRef} className="absolute inset-0 bg-black overflow-hidden">
      {/* ============ THE LIVE CAMERA — the game world ============ */}
      <video ref={videoRef} muted playsInline autoPlay className={cx('absolute inset-0 h-full w-full object-cover', mode !== 'hunt' && 'opacity-60')} />
      {mode !== 'hunt' && <div className="absolute inset-0 bg-black/35" />}

      {/* 90s CRT treatment: phosphor vignette under the HUD, scanlines above all */}
      <div className="cq-crt absolute inset-0 z-[4] pointer-events-none" />
      <div className="cq-scanlines absolute inset-0 z-[60] pointer-events-none opacity-60" />

      {/* AI-rejected objects */}
      {hunting && nonLitter.map((o) => (
        <div key={o.id} className="absolute z-[9] pointer-events-none" style={{ left: o.box.l, top: o.box.t, width: o.box.w, height: o.box.h }}>
          <span className="absolute inset-0 rounded-xl border-2 border-dashed border-white/40" />
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/65 text-white/75 px-2.5 py-0.5 text-[10px] font-black">
            ✕ {o.klass} — not litter
          </span>
        </div>
      ))}

      {/* litter boxes — holographic capture frames */}
      {hunting && detections.map((d) => (
        <button key={d.id} onClick={() => grab(d)} className="absolute z-10 animate-pop" style={{ left: d.box.l, top: d.box.t, width: d.box.w, height: d.box.h }}>
          <DetectFrame tooClose={d.tooClose} golden={goldenHere} />
          <span className={cx('absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-black shadow-card', d.tooClose ? 'bg-rose-400 text-white' : 'bg-gradient-to-r from-quest-300 to-ocean-400 text-grime-900')}>
            {d.emoji} {d.type} · {Math.round(d.score * 100)}%
          </span>
          {d.tooClose ? (
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-rose-500 text-white px-3 py-1 text-[11px] font-black shadow-card">⚠ Too close — step back</span>
          ) : (
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white text-grime-900 px-3 py-1 text-[11px] font-black shadow-card animate-pulseGlow">
              GRAB +{d.pts}{goldenHere && ' 🌟'}
              <span className={cx('ml-1.5 rounded-full px-1.5 py-0.5 text-[9px]', d.size.mult >= 3 ? 'bg-sun-400' : d.size.mult >= 2 ? 'bg-ocean-400 text-white' : 'bg-quest-200')}>
                {d.size.label}{d.size.mult > 1 ? ` ×${d.size.mult}` : ''}
              </span>
            </span>
          )}
        </button>
      ))}

      {/* sonar scan + reticle */}
      {hunting && detections.length === 0 && !grabFx && (
        <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <span className="absolute left-1/2 top-8 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full border-2 border-quest-300/50 cq-sonar" />
          <span className="absolute left-1/2 top-8 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full border-2 border-ocean-400/40 cq-sonar" style={{ animationDelay: '1.3s' }} />
          <Crosshair className="h-12 w-12 text-white/60 animate-pulseGlow mx-auto" />
          <p className="text-white/80 text-[13px] font-bold mt-2 drop-shadow">Point your camera at litter</p>
        </div>
      )}

      {/* flyers */}
      {flyers.map((f) => (
        <span key={f.id} className="absolute z-30 pointer-events-none" style={{ left: f.x, top: f.y }}>
          <span
            className="block text-3xl"
            style={{ transition: 'transform 0.75s cubic-bezier(0.5,-0.3,0.8,0.6), opacity 0.75s', transform: 'translate(0,0) scale(1)', opacity: 1 }}
            ref={(el) => { if (el) requestAnimationFrame(() => { el.style.transform = `translate(${f.dx}px, ${f.dy}px) scale(0.25)`; el.style.opacity = '0.3'; }); }}
          >
            {f.emoji}
          </span>
          <span className="absolute -top-2 left-6 text-quest-300 font-black text-lg drop-shadow animate-rise">+{f.pts}</span>
        </span>
      ))}

      {/* spark bursts at grab points */}
      {bursts.map((b) => (
        <span key={b.id} className="absolute z-30 pointer-events-none" style={{ left: b.x, top: b.y }}>
          {Array.from({ length: 8 }).map((_, k) => {
            const ang = (k / 8) * Math.PI * 2;
            return (
              <span
                key={k}
                className={cx('absolute block h-2 w-2 rounded-full', b.golden ? 'bg-sun-400' : k % 2 ? 'bg-quest-300' : 'bg-ocean-400')}
                style={{ transition: 'transform 0.55s cubic-bezier(0.1,0.8,0.3,1), opacity 0.55s', transform: 'translate(0,0) scale(1.4)', opacity: 1, boxShadow: '0 0 8px rgba(110,231,183,0.9)' }}
                ref={(el) => {
                  if (el) requestAnimationFrame(() => {
                    el.style.transform = `translate(${Math.cos(ang) * 62}px, ${Math.sin(ang) * 62}px) scale(0.1)`;
                    el.style.opacity = '0';
                  });
                }}
              />
            );
          })}
        </span>
      ))}

      {/* arcade combo announcer + impact frame */}
      {comboFx && (
        <>
          <div key={`if-${comboFx.id}`} className="cq-impact absolute inset-0 bg-white z-[25] pointer-events-none" />
          <div className="absolute left-1/2 top-[34%] -translate-x-1/2 z-30 pointer-events-none w-full text-center">
            <span className="block animate-pop">
              <span className="block font-black text-[44px] leading-none bg-gradient-to-b from-yellow-200 to-sun-500 bg-clip-text text-transparent drop-shadow-lg" style={{ WebkitTextStroke: '1.5px rgba(0,0,0,0.35)' }}>
                ×{comboFx.n}
              </span>
              <span className="cq-pixel block text-[17px] text-quest-200 mt-1">
                {comboFx.n >= 8 ? 'PERFECT PARK!!' : comboFx.n >= 5 ? 'CLEAN COMBO!' : comboFx.n >= 3 ? 'TRIPLE!!' : 'DOUBLE PICKUP!'}
              </span>
            </span>
          </div>
        </>
      )}

      {/* grab chain */}
      {grabFx && (
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 z-20 flex items-center gap-1.5 bg-black/80 rounded-full px-3.5 py-2 animate-pop whitespace-nowrap">
          {[['ground', Crosshair, 'Spotted'], ['hand', Hand, 'In hand'], ['bag', ShoppingBag, 'Bagged!']].map(([key, Icon, label], i) => {
            const on = ['ground', 'hand', 'bag'].indexOf(grabFx.phase) >= i;
            return (
              <React.Fragment key={key}>
                {i > 0 && <ChevronRight className={cx('h-3.5 w-3.5', on ? 'text-quest-300' : 'text-white/25')} />}
                <span className={cx('flex items-center gap-1 text-[11px] font-black', on ? 'text-quest-300' : 'text-white/40')}>
                  <Icon className="h-4 w-4" /> {label}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* loading / dead states */}
      {busy && (
        <div className="absolute inset-0 grid place-items-center bg-black/75 z-20 text-center px-8">
          <div>
            <Loader2 className="h-11 w-11 text-quest-300 animate-spinSlow mx-auto" />
            <p className="text-white font-black text-base mt-3">{camState === 'starting' ? 'Opening camera…' : 'Warming up the litter detector…'}</p>
            <p className="text-white/50 text-[11px] mt-1">Runs privately on your device</p>
          </div>
        </div>
      )}
      {dead && (
        <div className="absolute inset-0 grid place-items-center bg-grime-900 z-20 text-center px-8">
          <div>
            <CameraOff className="h-11 w-11 text-sun-400 mx-auto" />
            <p className="text-white font-black text-lg mt-3">{camState === 'denied' ? 'Camera access needed' : 'Couldn’t start AR'}</p>
            <p className="text-white/50 text-[12px] mt-1 max-w-[250px] mx-auto">CleanQuest is live AR — the camera has to see the litter you pick up for it to count.</p>
            <button onClick={boot} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-quest-400 text-quest-900 font-black text-sm px-5 py-3 active:scale-95">
              <RefreshCw className="h-4 w-4" /> Try again
            </button>
          </div>
        </div>
      )}

      {/* ============ HUD ============ */}
      {/* top row: arcade score bar + VHS OSD */}
      <div className="absolute top-0 inset-x-0 p-3 flex items-start gap-2 bg-gradient-to-b from-black/70 to-transparent z-20">
        <Pill className="bg-grime-900/80 text-white backdrop-blur"><Leaf className="h-3.5 w-3.5 text-quest-300" /> CleanQuest</Pill>
        <span className="cq-pixel cq-vhs text-rose-400 text-[13px] mt-1.5 flex items-center gap-1">
          <span className="cq-blink">●</span>REC·SP {fmtClock(seconds)}
        </span>
        <div className="flex-1" />
        <div className="cq-pixel text-right leading-tight mt-0.5">
          <p className="text-sun-400 text-[13px]">SCORE {pad6(player.points)}</p>
          <p className="text-white/60 text-[10px]">HI {pad6(hiScore)} · 1UP</p>
        </div>
      </div>

      {/* status / navigation line */}
      <div className="absolute top-[3.4rem] inset-x-0 flex justify-center gap-1.5 z-20 pointer-events-none flex-wrap px-3">
        {currentZone ? (
          <span className={cx('rounded-full text-[11px] font-black px-3 py-1 shadow-card', goldenHere ? 'bg-gradient-to-r from-yellow-200 to-sun-400 text-grime-900' : 'bg-quest-400/90 text-quest-900')}>
            📍 {currentZone.name} · {'⭐'.repeat(currentZone.density)}{goldenHere ? ` · 🌟×${GOLDEN_MULT}` : ''}{currentZone.id === adoptedId ? ' · 🏡 yours' : ''}
          </span>
        ) : guiding ? (
          <span className="rounded-full bg-ocean-500/85 text-white text-[11px] font-black px-3 py-1 shadow-card flex items-center gap-1">
            <Footprints className="h-3 w-3" /> Walking to {guiding.name}…
          </span>
        ) : goldenSpawn ? (
          <span className="rounded-full bg-black/60 backdrop-blur text-white text-[11px] font-black px-3 py-1 flex items-center gap-1.5">
            <Navigation2 className="h-3.5 w-3.5 text-sun-400" style={{ transform: `rotate(${goldenBearing}deg)` }} />
            🌟 Golden ×{GOLDEN_MULT} · {metersOf(goldenDist)} m — follow the mini-map
          </span>
        ) : (
          <span className="rounded-full bg-black/60 backdrop-blur text-white/80 text-[11px] font-black px-3 py-1">Open the mini-map to find litter zones</span>
        )}
        {rushActive && <span className="rounded-full bg-fuchsia-500/85 text-white text-[11px] font-black px-3 py-1">⚡ RUSH ×{RUSH_MULT}</span>}
      </div>

      {/* AI readout */}
      {hunting && (detections.length > 0 || nonLitter.length > 0) && (
        <div className="absolute top-[5.4rem] inset-x-0 flex justify-center z-20 pointer-events-none">
          <span className="rounded-full bg-black/60 backdrop-blur text-[11px] font-black px-3 py-1">
            <span className="text-quest-300">🤖 {detections.length} litter</span>
            {nonLitter.length > 0 && <span className="text-white/55"> · {nonLitter.length} not litter</span>}
          </span>
        </div>
      )}

      {/* flash + combo + toast */}
      {flashMsg && (
        <div className="absolute top-[7.2rem] inset-x-0 flex justify-center z-20 pointer-events-none">
          <span className={cx('rounded-full px-3.5 py-1.5 text-[12px] font-black shadow-card animate-slideUp', flashMsg.warn ? 'bg-sun-400 text-grime-900' : 'bg-quest-300 text-quest-900')}>
            <Check className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />{flashMsg.msg}
          </span>
        </div>
      )}
      {toast && (
        <div className="absolute top-[7.2rem] inset-x-0 flex justify-center z-20 pointer-events-none">
          <span className="rounded-full bg-white text-grime-900 text-[12px] font-extrabold px-4 py-2 shadow-card animate-slideUp">{toast.emoji} {toast.msg}</span>
        </div>
      )}
      {hunting && combo > 1 && (
        <div className="absolute top-[7.2rem] right-3 z-20 pointer-events-none">
          <span className="block rounded-2xl bg-sun-400 text-grime-900 px-3 py-1.5 text-sm font-black shadow-card animate-pop">⚡ ×{combo}</span>
        </div>
      )}

      {/* right button stack */}
      <div className="absolute top-24 right-3 z-20 flex flex-col gap-2">
        <button onClick={() => { play('tick'); onSheet('leaderboard'); }} className="grid place-items-center h-10 w-10 rounded-full bg-grime-900/80 backdrop-blur shadow-card active:scale-95">
          <span className="text-[10px] font-black text-sun-400 leading-none">#{myRank}</span>
          <Trophy className="h-3.5 w-3.5 text-sun-400 -mt-0.5" />
        </button>
        <button onClick={() => { play('tick'); onSheet('today'); }} className="relative grid place-items-center h-10 w-10 rounded-full bg-grime-900/80 backdrop-blur shadow-card active:scale-95">
          <ClipboardList className="h-5 w-5 text-sun-400" />
          {claimable > 0 && <span className="absolute -top-1 -right-1 grid place-items-center h-4.5 min-w-4.5 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black ring-2 ring-grime-900 animate-pulseGlow">{claimable}</span>}
        </button>
        <button onClick={() => { play('tick'); onSheet('dex'); }} className="grid place-items-center h-10 w-10 rounded-full bg-grime-900/80 backdrop-blur shadow-card active:scale-95">
          <BookOpen className="h-5 w-5 text-ocean-400" />
        </button>
        <button onClick={() => { play('tick'); onSheet('profile'); }} className="grid place-items-center h-10 w-10 rounded-full bg-grime-900/80 backdrop-blur shadow-card active:scale-95 text-lg">
          {player.avatar}
        </button>
        <button onClick={() => { play('tick'); onSheet('fairplay'); }} className="grid place-items-center h-10 w-10 rounded-full bg-grime-900/80 backdrop-blur shadow-card active:scale-95">
          <ShieldCheck className="h-5 w-5 text-quest-300" />
        </button>
        <button onClick={toggleSound} className="grid place-items-center h-10 w-10 rounded-full bg-grime-900/80 backdrop-blur shadow-card active:scale-95">
          {soundOn ? <Volume2 className="h-5 w-5 text-white/85" /> : <VolumeX className="h-5 w-5 text-white/40" />}
        </button>
      </div>

      {/* buddy companion in a Tamagotchi shell — your 90s pocket pal */}
      <div className="absolute bottom-[21.3rem] left-3.5 z-20 pointer-events-none">
        <span className="cq-pixel cq-blink absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-quest-200 z-10">1UP</span>
        <div className="relative w-[84px] h-[96px]" style={{ borderRadius: '50% 50% 47% 47% / 56% 56% 44% 44%', background: 'linear-gradient(160deg,#67e8f9 0%,#0891b2 55%,#155e75 100%)', boxShadow: '0 6px 14px -6px rgba(0,0,0,0.6), inset 0 3px 6px rgba(255,255,255,0.5), inset 0 -4px 8px rgba(0,0,0,0.35)' }}>
          {/* dot-matrix LCD window */}
          <div className="cq-dmg-dots absolute left-1/2 top-[16%] -translate-x-1/2 w-[58px] h-[52px] rounded-lg ring-2 ring-[#155e75] grid place-items-center overflow-hidden" style={{ background: '#9bbc0f' }}>
            <BuddySprite stage={buddyIdx} size={46} className="animate-floaty" />
          </div>
          {/* three shell buttons */}
          <div className="absolute bottom-[9%] left-1/2 -translate-x-1/2 flex gap-1.5">
            {[0, 1, 2].map((k) => (
              <span key={k} className="h-2 w-2 rounded-full bg-cyan-100/90 ring-1 ring-[#155e75]" />
            ))}
          </div>
        </div>
      </div>

      {/* ============ PiP MINI-MAP — Game Boy radar ============ */}
      <button
        onClick={() => { play('tick'); setMapOpen(true); }}
        className="absolute bottom-44 left-3 z-20 w-32 h-40 rounded-2xl overflow-hidden ring-2 ring-[#3a4a3a] shadow-card active:scale-95 transition"
      >
        <span className="cq-dmg absolute inset-0 block">
          <ParkMap compact />
        </span>
        <span className="cq-dmg-dots absolute inset-0 pointer-events-none" />
        <span className="absolute inset-0 pointer-events-none rounded-2xl" style={{ boxShadow: 'inset 0 0 22px rgba(20,60,20,0.55), inset 0 8px 14px -10px rgba(255,255,255,0.35)' }} />
        <span className="absolute top-1 left-1 grid place-items-center h-5 w-5 rounded-full bg-black/55 text-[9px] font-black text-lime-200 ring-1 ring-lime-200/40">N</span>
        <span className="absolute top-1 right-1 grid place-items-center h-5 w-5 rounded-md bg-black/50"><Maximize2 className="h-3 w-3 text-lime-200" /></span>
        <span className="cq-pixel absolute bottom-0 inset-x-0 bg-[#0f380f]/85 text-[#9bbc0f] text-[9px] py-0.5 text-center">
          {goldenSpawn ? `★ ${metersOf(goldenDist)}M` : 'RADAR'}
        </span>
      </button>

      {/* ============ bottom dock — glassy card ============ */}
      <div className="absolute bottom-0 inset-x-0 p-3 pb-4 bg-gradient-to-t from-black/70 to-transparent z-20">
        <div className="glass rounded-[26px] ring-1 ring-white/20 p-3.5 shadow-soft">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative shrink-0">
            {/* key retriggers the pop every time an item lands */}
            <span key={bag.length} className={cx('grid place-items-center h-12 w-12 rounded-2xl bg-white/15 ring-1 ring-white/25 text-2xl', bag.length > 0 && 'animate-pop')}>🛍️</span>
            <span className="absolute -bottom-1 -right-1 grid place-items-center h-5 min-w-5 px-1 rounded-full bg-quest-300 text-quest-900 text-[11px] font-black">{bag.length}</span>
          </div>
          <div className="flex-1 flex gap-1 overflow-x-auto no-scrollbar">
            {bag.length === 0
              ? <span className={cx('text-[12px] font-bold', hunting && !detections.length ? 'cq-pixel cq-blink text-quest-200' : 'text-white/45')}>{hunting ? (detections.length ? `${detections.length} litter in view — tap GRAB` : 'INSERT LITTER · AIM CAMERA') : 'Bag is empty'}</span>
              : bag.map((b, i) => (
                <span key={i} className={cx('relative grid place-items-center h-8 w-8 rounded-lg bg-white/12 text-base shrink-0 animate-pop', (b.golden || (b.size && b.size.mult >= 2)) && 'ring-2 ring-sun-400')}>
                  {b.emoji}
                  {b.golden && <span className="absolute -top-1.5 -right-1.5 text-[9px]">🌟</span>}
                </span>
              ))}
          </div>
          <div className="text-right shrink-0">
            <p className="text-quest-300 font-black text-xl leading-none">+{pending}</p>
            <p className="text-white/50 text-[9px] font-bold">PENDING</p>
          </div>
        </div>

        {mode === 'hunt' && (
          <div className="flex gap-2">
            <button
              onClick={() => { play('tick'); setReport({ step: 'pick', type: null }); }}
              className="shrink-0 grid place-items-center w-[52px] rounded-2xl bg-sun-500/20 ring-1 ring-sun-400/40 text-sun-400 active:scale-95 transition"
              aria-label="Report hazard or hotspot"
            >
              <Flag className="h-5 w-5" />
            </button>
            <BigBtn tone={bag.length ? 'go' : 'plain'} disabled={bag.length === 0 || !!grabFx} onClick={() => setMode('dispose')} className="flex-1">
              🗑️ Dispose bag & bank points
            </BigBtn>
          </div>
        )}
        {mode === 'dispose' && (
          <div className="flex gap-2">
            <BigBtn tone="plain" className="flex-1" onClick={() => setMode('hunt')}>Keep hunting</BigBtn>
            <BigBtn className="flex-[1.6]" onClick={scanBin}>📷 Scan bin QR</BigBtn>
          </div>
        )}
        </div>
      </div>

      {/* dispose / banking overlays */}
      {mode === 'dispose' && (
        <div className="absolute inset-0 z-[15] grid place-items-center pointer-events-none">
          <div className="text-center">
            <div className="relative mx-auto h-44 w-44 rounded-3xl ring-[3px] ring-quest-300 bg-black/45 overflow-hidden">
              <QrCode className="absolute inset-0 m-auto h-24 w-24 text-white/90" />
              <div className="absolute inset-x-0 h-0.5 bg-quest-300 shadow-glow animate-floaty" style={{ top: '50%' }} />
            </div>
            <p className="text-white font-black text-base mt-4 drop-shadow">Find an approved bin & scan its QR</p>
            <p className="text-white/60 text-[11px] mt-1">Your {bag.length} items stay pending until the bag is binned</p>
          </div>
        </div>
      )}
      {mode === 'banking' && (
        <div className="absolute inset-0 z-[15] grid place-items-center pointer-events-none">
          <div className="text-center">
            <div className="relative mx-auto h-24 w-24">
              <span className="absolute inset-0 rounded-full bg-quest-400/30 animate-pulseGlow" />
              <div className="relative grid place-items-center h-24 w-24 rounded-full bg-gradient-to-b from-quest-300 to-quest-600 ring-4 ring-white/60 shadow-glow text-4xl">
                {creditPct >= 100 ? <Check className="h-12 w-12 text-quest-900" /> : '🗑️'}
              </div>
            </div>
            <p className="text-white font-black text-2xl mt-4 drop-shadow">+{Math.round(totals.total * (creditPct / 100))}</p>
            <p className="text-quest-300 text-xs font-bold">{creditPct >= 100 ? 'Verified & banked ✓' : 'Banking your points…'}</p>
          </div>
        </div>
      )}

      {/* ============ REPORT FLOW — players are the city's sensors ============ */}
      {report && (
        <div className="absolute inset-0 z-40 flex items-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setReport(null)} />
          <div className="relative w-full rounded-t-[30px] bg-grime-900 ring-1 ring-white/10 animate-slideUp p-5 pb-7">
            {report.step === 'pick' && (
              <>
                <h3 className="text-white font-black text-lg flex items-center gap-2"><Flag className="h-5 w-5 text-sun-400" /> Report what you see</h3>
                <p className="text-white/45 text-[12px] font-semibold mt-0.5 mb-4">Can't (or shouldn't) bag it? Reporting still earns points — and helps the whole city.</p>
                <div className="space-y-2.5">
                  {REPORT_TYPES.map((t) => (
                    <button key={t.id} onClick={() => { play('tick'); setReport({ step: 'sending', type: t }); setTimeout(() => { fileReport(t.id); setReport({ step: 'done', type: t }); play('bank'); buzz([20, 30, 40]); }, 1300); }}
                      className="w-full rounded-2xl bg-white/5 ring-1 ring-white/10 p-3.5 flex items-center gap-3 active:scale-[0.98] transition text-left">
                      <span className="text-2xl shrink-0">{t.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-black text-[13px]">{t.label}</p>
                        <p className="text-white/50 text-[11px] leading-snug">{t.desc}</p>
                      </div>
                      <span className="shrink-0 rounded-xl bg-quest-500/15 text-quest-300 font-black text-[12px] px-2.5 py-1.5">+{t.pts}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            {report.step === 'sending' && (
              <div className="text-center py-6">
                <div className="relative mx-auto h-16 w-16">
                  <Loader2 className="h-16 w-16 text-quest-300 animate-spinSlow" />
                  <Camera className="absolute inset-0 m-auto h-6 w-6 text-white/70" />
                </div>
                <p className="text-white font-black text-base mt-3">Capturing & geotagging…</p>
                <p className="text-white/45 text-[11px] mt-1">In-app capture · location-locked · sent securely</p>
              </div>
            )}
            {report.step === 'done' && report.type && (
              <div className="text-center py-4">
                <span className="text-4xl">{report.type.emoji}</span>
                <p className="text-white font-black text-lg mt-2">Report sent · +{report.type.pts} pts</p>
                <div className="mt-3 space-y-1.5 text-[12px] font-bold">
                  {report.type.forwards && <p className="text-ocean-400">📨 Forwarded to Riverton 311 — city crew dispatched</p>}
                  {report.type.makesSpawn && <p className="text-quest-300">🗺️ New spawn added to the map for nearby players</p>}
                </div>
                <div className="mt-5">
                  <BigBtn onClick={() => setReport(null)}>Back to hunting</BigBtn>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============ EXPANDED MAP ============ */}
      {mapOpen && (
        <div className="absolute inset-0 z-40">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { setMapOpen(false); setMapSel(null); }} />
          <div className="absolute inset-x-3 top-14 bottom-4 rounded-[28px] overflow-hidden ring-2 ring-white/30 shadow-2xl animate-pop">
            <ParkMap onSelectSpawn={(s) => { play('tick'); setMapSel(s.id); }} selectedId={mapSel} />
            <button onClick={() => { setMapOpen(false); setMapSel(null); }} className="absolute top-3 right-3 grid place-items-center h-9 w-9 rounded-full bg-black/60 text-white active:scale-90">
              <X className="h-4.5 w-4.5" />
            </button>
            <span className="absolute top-3 left-3 rounded-full bg-black/60 text-white text-[11px] font-black px-3 py-1.5">
              🗺️ Riverton Commons — tap a spawn to get guided
            </span>

            {mapSelSpawn && (
              <div className="absolute bottom-3 inset-x-3 rounded-3xl bg-grime-900/95 backdrop-blur ring-1 ring-white/12 p-4 animate-slideUp">
                <div className="flex items-center gap-3 mb-2.5">
                  <span className="grid place-items-center h-11 w-11 rounded-2xl bg-white text-2xl">{mapSelSpawn.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-black text-sm">{mapSelSpawn.name}</p>
                    <p className="text-white/50 text-[11px]">
                      {metersOf(mapSelDist)} m · {'⭐'.repeat(mapSelSpawn.density)}
                      {mapSelSpawn.id === goldenId && <span className="text-sun-400 font-black"> · 🌟 GOLDEN ×{GOLDEN_MULT}</span>}
                      {mapSelSpawn.reported && <span className="text-ocean-400 font-black"> · 📣 player-reported</span>}
                    </p>
                  </div>
                  {mapSelSpawn.id === adoptedId ? (
                    <span className="shrink-0 rounded-xl bg-quest-500/15 text-quest-300 font-black text-[11px] px-2.5 py-1.5">🏡 Yours · +25%</span>
                  ) : (
                    <button onClick={() => { adoptBlock(mapSelSpawn.id); play('combo', 2); }} className="shrink-0 rounded-xl bg-white/8 ring-1 ring-white/15 text-white font-black text-[11px] px-2.5 py-1.5 active:scale-95">
                      🏡 Adopt
                    </button>
                  )}
                </div>
                {mapSelDist <= REACH ? (
                  <BigBtn onClick={() => { setMapOpen(false); setMapSel(null); play('tick'); }}>📷 You're here — look around!</BigBtn>
                ) : (
                  <BigBtn tone="sun" onClick={() => guideTo(mapSelSpawn)}>🧭 Guide me there ({metersOf(mapSelDist)} m)</BigBtn>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ARWorld;
