import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useGame } from '../game/GameState';
import { LITTER_CLASS_MAP, NON_LITTER_CLASSES, SIZE_TIERS, TOO_CLOSE_FRAC } from '../game/data';
import { play, buzz } from '../game/sound';
import { cx, Pill, BigBtn } from '../ui/bits';
import {
  X, ShieldCheck, Video, QrCode, Check, Loader2, Hand, ShoppingBag,
  Crosshair, CameraOff, RefreshCw, MapPin, ChevronRight,
} from 'lucide-react';

const DETECT_MS = 220;
const MIN_SCORE = 0.5;
const COLLECT_RADIUS = 0.12;
const COMBO_WINDOW_MS = 9000;

const fmtClock = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// The AR "catch screen": live camera full-screen, real on-device detection
// boxing litter, tap to grab (ground → hand → bag), then bank at a bin QR.
const Encounter = ({ spawn, onClose, onFairPlay }) => {
  const { bankEncounter, player } = useGame();

  // Optional QA flag: ?debugClasses=person,frisbee adds extra detector classes
  // so the pipeline can be exercised on a desktop without real litter.
  const classMap = useMemo(() => {
    const extra = new URLSearchParams(window.location.search).get('debugClasses');
    if (!extra) return LITTER_CLASS_MAP;
    const m = { ...LITTER_CLASS_MAP };
    extra.split(',').forEach((c) => {
      const k = c.trim();
      if (k && !m[k]) m[k] = { type: `QA:${k}`, emoji: '🧪', points: 5, recyclable: false };
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

  const [camState, setCamState] = useState('starting'); // starting | live | denied | error
  const [modelState, setModelState] = useState('loading'); // loading | ready | error
  const [detections, setDetections] = useState([]);
  const [nonLitter, setNonLitter] = useState([]); // AI-rejected objects (shown grey)
  const [flyers, setFlyers] = useState([]); // emoji particles flying to the bag
  const [bag, setBag] = useState([]);
  const [grabFx, setGrabFx] = useState(null); // {phase, det}
  const [combo, setCombo] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [flashMsg, setFlashMsg] = useState(null);
  const [mode, setMode] = useState('hunt'); // hunt | dispose | banking
  const [creditPct, setCreditPct] = useState(0);
  const lastGrabRef = useRef(0);

  const pending = bag.reduce((s, b) => s + b.pts, 0);
  const comboBonusPct = Math.min(50, Math.max(0, (combo - 1) * 10));

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const flash = useCallback((msg, warn = false) => {
    setFlashMsg({ msg, warn, id: Date.now() });
    setTimeout(() => setFlashMsg((f) => (f && f.msg === msg ? null : f)), 1500);
  }, []);

  // ---- camera + detector boot ----
  const boot = useCallback(async () => {
    setCamState('starting');
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

  // ---- continuous detection over the live video ----
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
          // clamp boxes fully inside the frame so edge detections can't
          // overflow the viewport (labels stay tappable and on-screen)
          const bw = Math.min(w * scale, cw - 16);
          const bh = Math.min(h * scale, ch - 120);
          const bl = Math.max(8, Math.min(x * scale + ox, cw - bw - 8));
          const bt = Math.max(64, Math.min(y * scale + oy, ch - bh - 56));
          const box = { l: bl, t: bt, w: bw, h: bh };
          if (classes.includes(p.class)) {
            const ncx = (x + w / 2) / vw;
            const ncy = (y + h / 2) / vh;
            if (zones.some((z) => Math.hypot(z.x - ncx, z.y - ncy) < COLLECT_RADIUS)) return;
            // size-weighted scoring from the share of frame the box covers
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

  // ---- grab: the visible ground → hand → bag transfer ----
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
        if (next > 1) setTimeout(() => play('combo', next), 140);
        return next;
      });
      lastGrabRef.current = now;
      setBag((prev) => [...prev, det]);
      // emoji particle flies from the box into the bag + floating points
      const wrap = wrapRef.current;
      const fx = det.box.l + det.box.w / 2;
      const fy = det.box.t + det.box.h / 2;
      const id = now;
      setFlyers((prev) => [...prev, {
        id, emoji: det.emoji, pts: det.pts, x: fx, y: fy,
        dx: 44 - fx, dy: (wrap ? wrap.clientHeight - 96 : 700) - fy,
      }]);
      setTimeout(() => setFlyers((prev) => prev.filter((f) => f.id !== id)), 900);
      setGrabFx(null);
      flash(`+${det.pts} pending · ${det.size.label} ${det.type}`);
    }, 1150);
  };

  // ---- dispose & bank ----
  const totals = useMemo(() => {
    const base = bag.reduce((s, b) => s + b.pts, 0);
    const comboPts = Math.round(base * (comboBonusPct / 100));
    const zonePts = Math.round(base * 0.25 * spawn.density);
    const streakPts = Math.round(base * Math.min(0.15, player.streak * 0.03));
    const xl = bag.filter((b) => b.size && b.size.mult >= 2).length;
    const breakdown = [
      { label: `${bag.length} items, size-weighted${xl ? ` (${xl} large!)` : ''}`, pts: base },
      { label: `Combo ×${Math.max(combo, 1)} bonus`, pts: comboPts },
      { label: `${spawn.name} density bonus`, pts: zonePts },
      { label: `${player.streak}-day streak`, pts: streakPts },
    ];
    return { breakdown, total: base + comboPts + zonePts + streakPts };
  }, [bag, comboBonusPct, combo, spawn, player.streak]);

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
          if (streamRef.current) streamRef.current.getTracks().forEach((tr) => tr.stop());
          bankEncounter(spawn, { items: bag, breakdown: totals.breakdown, total: totals.total });
          onClose();
        }, 500);
      }
    }, 45);
  };

  const busy = camState === 'starting' || (camState === 'live' && modelState === 'loading');
  const dead = camState === 'denied' || camState === 'error' || modelState === 'error';
  const hunting = camState === 'live' && modelState === 'ready' && mode === 'hunt';

  return (
    <div ref={wrapRef} className="absolute inset-0 z-30 bg-black overflow-hidden">
      {/* live camera */}
      <video ref={videoRef} muted playsInline autoPlay className={cx('absolute inset-0 h-full w-full object-cover', mode !== 'hunt' && 'opacity-60')} />
      {mode !== 'hunt' && <div className="absolute inset-0 bg-black/35" />}

      {/* ---- AI-rejected objects: grey "not litter" boxes ---- */}
      {hunting && nonLitter.map((o) => (
        <div key={o.id} className="absolute z-[9] pointer-events-none" style={{ left: o.box.l, top: o.box.t, width: o.box.w, height: o.box.h }}>
          <span className="absolute inset-0 rounded-xl border-2 border-dashed border-white/40" />
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/65 text-white/75 px-2.5 py-0.5 text-[10px] font-black">
            ✕ {o.klass} — not litter
          </span>
        </div>
      ))}

      {/* ---- litter boxes: size-tagged, tap to grab ---- */}
      {hunting && detections.map((d) => (
        <button key={d.id} onClick={() => grab(d)} className="absolute z-10" style={{ left: d.box.l, top: d.box.t, width: d.box.w, height: d.box.h }}>
          <span className={cx('absolute inset-0 rounded-xl border-[3px] animate-pop',
            d.tooClose ? 'border-rose-400 border-dashed' : cx(d.size.ring, 'shadow-glow'))} />
          <span className={cx('absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-black shadow-card',
            d.tooClose ? 'bg-rose-400 text-white' : 'bg-quest-400 text-quest-900')}>
            {d.emoji} {d.type} · {Math.round(d.score * 100)}%
          </span>
          {d.tooClose ? (
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-rose-500 text-white px-3 py-1 text-[11px] font-black shadow-card">
              ⚠ Too close — step back
            </span>
          ) : (
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white text-grime-900 px-3 py-1 text-[11px] font-black shadow-card animate-pulseGlow">
              GRAB +{d.pts}
              <span className={cx('ml-1.5 rounded-full px-1.5 py-0.5 text-[9px]',
                d.size.mult >= 3 ? 'bg-sun-400' : d.size.mult >= 2 ? 'bg-ocean-400 text-white' : 'bg-quest-200')}>
                {d.size.label}{d.size.mult > 1 ? ` ×${d.size.mult}` : ''}
              </span>
            </span>
          )}
        </button>
      ))}

      {/* ---- emoji particles flying into the bag ---- */}
      {flyers.map((f) => (
        <span key={f.id} className="absolute z-30 pointer-events-none" style={{ left: f.x, top: f.y }}>
          <span
            className="block text-3xl"
            style={{ animation: 'none', transition: 'transform 0.75s cubic-bezier(0.5,-0.3,0.8,0.6), opacity 0.75s', transform: 'translate(0,0) scale(1)', opacity: 1 }}
            ref={(el) => { if (el) requestAnimationFrame(() => { el.style.transform = `translate(${f.dx}px, ${f.dy}px) scale(0.25)`; el.style.opacity = '0.3'; }); }}
          >
            {f.emoji}
          </span>
          <span className="absolute -top-2 left-6 text-quest-300 font-black text-lg drop-shadow animate-rise">+{f.pts}</span>
        </span>
      ))}

      {/* reticle when nothing detected */}
      {hunting && detections.length === 0 && !grabFx && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <Crosshair className="h-12 w-12 text-white/70 animate-pulseGlow mx-auto" />
          <p className="text-white/85 text-[13px] font-bold mt-2 drop-shadow">Point your camera at litter</p>
        </div>
      )}

      {/* grab transfer chain */}
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

      {/* loading state */}
      {busy && (
        <div className="absolute inset-0 grid place-items-center bg-black/75 z-20 text-center px-8">
          <div>
            <Loader2 className="h-11 w-11 text-quest-300 animate-spinSlow mx-auto" />
            <p className="text-white font-black text-base mt-3">{camState === 'starting' ? 'Opening camera…' : 'Warming up the litter detector…'}</p>
            <p className="text-white/50 text-[11px] mt-1">Runs privately on your device — no video leaves your phone</p>
          </div>
        </div>
      )}

      {/* camera dead state */}
      {dead && (
        <div className="absolute inset-0 grid place-items-center bg-grime-900 z-20 text-center px-8">
          <div>
            <CameraOff className="h-11 w-11 text-sun-400 mx-auto" />
            <p className="text-white font-black text-lg mt-3">{camState === 'denied' ? 'Camera access needed' : 'Couldn’t start AR'}</p>
            <p className="text-white/50 text-[12px] mt-1 max-w-[250px] mx-auto">
              CleanQuest is live AR — the camera has to see the litter you pick up for it to count.
            </p>
            <button onClick={boot} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-quest-400 text-quest-900 font-black text-sm px-5 py-3 active:scale-95">
              <RefreshCw className="h-4 w-4" /> Try again
            </button>
            <button onClick={onClose} className="block mx-auto mt-3 text-white/40 text-xs font-bold">Back to map</button>
          </div>
        </div>
      )}

      {/* ---- top HUD ---- */}
      <div className="absolute top-0 inset-x-0 p-3 flex items-center gap-2 bg-gradient-to-b from-black/70 to-transparent z-20">
        <Pill className="bg-rose-500/90 text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulseGlow" /> REC {fmtClock(seconds)}
        </Pill>
        <Pill className="bg-black/55 text-white/90 backdrop-blur"><MapPin className="h-3 w-3 text-quest-300" /> {spawn.name}</Pill>
        <Pill className="bg-black/55 text-white/90 backdrop-blur"><Video className="h-3 w-3 text-quest-300" /> Live</Pill>
        <div className="flex-1" />
        <button onClick={onFairPlay} className="grid place-items-center h-9 w-9 rounded-full bg-black/55 backdrop-blur"><ShieldCheck className="h-4.5 w-4.5 text-quest-300" /></button>
        <button onClick={onClose} className="grid place-items-center h-9 w-9 rounded-full bg-black/55 backdrop-blur"><X className="h-4.5 w-4.5 text-white/85" /></button>
      </div>

      {/* AI discrimination readout */}
      {hunting && (detections.length > 0 || nonLitter.length > 0) && (
        <div className="absolute top-[3.6rem] inset-x-0 flex justify-center z-20 pointer-events-none">
          <span className="rounded-full bg-black/60 backdrop-blur text-[11px] font-black px-3 py-1">
            <span className="text-quest-300">🤖 {detections.length} litter</span>
            {nonLitter.length > 0 && <span className="text-white/55"> · {nonLitter.length} not litter</span>}
          </span>
        </div>
      )}

      {/* flash + combo */}
      {flashMsg && (
        <div className="absolute top-24 inset-x-0 flex justify-center z-20 pointer-events-none">
          <span className={cx('rounded-full px-3.5 py-1.5 text-[12px] font-black shadow-card animate-slideUp', flashMsg.warn ? 'bg-sun-400 text-grime-900' : 'bg-quest-300 text-quest-900')}>
            <Check className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />{flashMsg.msg}
          </span>
        </div>
      )}
      {hunting && combo > 1 && (
        <div className="absolute top-16 right-3 z-20 pointer-events-none">
          <span className="block rounded-2xl bg-sun-400 text-grime-900 px-3 py-1.5 text-sm font-black shadow-card animate-pop">⚡ COMBO ×{combo}</span>
        </div>
      )}

      {/* ---- dispose overlay ---- */}
      {mode === 'dispose' && (
        <div className="absolute inset-0 z-20 grid place-items-center">
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
        <div className="absolute inset-0 z-20 grid place-items-center">
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

      {/* ---- bottom dock ---- */}
      <div className="absolute bottom-0 inset-x-0 p-4 pb-5 bg-gradient-to-t from-black/90 via-black/55 to-transparent z-20">
        {/* bag row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="relative shrink-0">
            <span className="grid place-items-center h-12 w-12 rounded-2xl bg-white/15 ring-1 ring-white/25 text-2xl">🛍️</span>
            <span className="absolute -bottom-1 -right-1 grid place-items-center h-5 min-w-5 px-1 rounded-full bg-quest-300 text-quest-900 text-[11px] font-black">{bag.length}</span>
          </div>
          <div className="flex-1 flex gap-1 overflow-x-auto no-scrollbar">
            {bag.length === 0
              ? <span className="text-white/45 text-[12px] font-bold">{hunting ? `${detections.length} litter in view — tap GRAB` : 'Bag is empty'}</span>
              : bag.map((b, i) => (
                <span key={i} className={cx('relative grid place-items-center h-8 w-8 rounded-lg bg-white/12 text-base shrink-0 animate-pop', b.size && b.size.mult >= 2 && 'ring-2 ring-sun-400')}>
                  {b.emoji}
                  {b.size && b.size.mult >= 2 && <span className="absolute -top-1.5 -right-1.5 rounded-full bg-sun-400 text-grime-900 text-[7px] font-black px-1">{b.size.label}</span>}
                </span>
              ))}
          </div>
          <div className="text-right shrink-0">
            <p className="text-quest-300 font-black text-xl leading-none">+{pending}</p>
            <p className="text-white/50 text-[9px] font-bold">PENDING</p>
          </div>
        </div>

        {mode === 'hunt' && (
          <BigBtn tone={bag.length ? 'go' : 'plain'} disabled={bag.length === 0 || !!grabFx} onClick={() => setMode('dispose')}>
            🗑️ Dispose bag & bank points
          </BigBtn>
        )}
        {mode === 'dispose' && (
          <div className="flex gap-2">
            <BigBtn tone="plain" className="flex-1" onClick={() => setMode('hunt')}>Keep hunting</BigBtn>
            <BigBtn className="flex-[1.6]" onClick={scanBin}>📷 Scan bin QR</BigBtn>
          </div>
        )}
      </div>
    </div>
  );
};

export default Encounter;
