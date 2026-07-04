// CleanQuest audio + haptics. All SFX are synthesized with WebAudio — no
// asset downloads — and vibration uses navigator.vibrate where supported
// (Android/Chrome; iOS Safari ignores it silently).

let ctx = null;
let enabled = true;
try {
  enabled = window.localStorage.getItem('cq_sound') !== 'off';
} catch { /* SSR/tests */ }

const ac = () => {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
};

// One enveloped tone. slide bends the pitch across the note.
const tone = (freq, { dur = 0.12, type = 'sine', vol = 0.16, at = 0, slide = 0 } = {}) => {
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + at;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
};

export const play = (name, n = 1) => {
  if (!enabled) return;
  switch (name) {
    case 'tick': // UI tap
      tone(660, { dur: 0.05, vol: 0.08, type: 'triangle' });
      break;
    case 'grab': // snatch off the ground
      tone(392, { dur: 0.08, type: 'triangle', slide: 240 });
      tone(784, { dur: 0.1, at: 0.07, type: 'triangle', vol: 0.12 });
      break;
    case 'bag': // thunk into the bag
      tone(150, { dur: 0.16, type: 'sine', vol: 0.22, slide: -70 });
      break;
    case 'combo': // rising ding per combo step
      tone(Math.min(1600, 540 * Math.pow(1.13, n)), { dur: 0.14, type: 'square', vol: 0.08 });
      break;
    case 'bank': // payday arpeggio
      [523, 659, 784, 1046].forEach((f, i) => tone(f, { dur: 0.16, at: i * 0.09, type: 'triangle' }));
      break;
    case 'level': // fanfare
      [392, 523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, { dur: 0.2, at: i * 0.08, type: 'triangle', vol: 0.18 }));
      break;
    case 'reject': // not-litter / too-close buzz
      tone(180, { dur: 0.18, type: 'sawtooth', vol: 0.07 });
      break;
    case 'boot': // 90s console power-on jingle
      [262, 392, 523, 784].forEach((f, i) => tone(f, { dur: 0.14, at: i * 0.11, type: 'square', vol: 0.09 }));
      tone(1046, { dur: 0.4, at: 0.46, type: 'square', vol: 0.1 });
      break;
    case 'coin': // arcade coin drop
      tone(988, { dur: 0.07, type: 'square', vol: 0.1 });
      tone(1319, { dur: 0.22, at: 0.07, type: 'square', vol: 0.1 });
      break;
    default:
      break;
  }
};

export const buzz = (pattern = 15) => {
  if (!enabled) return;
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch { /* unsupported */ }
};

export const isSoundOn = () => enabled;
export const setSoundOn = (v) => {
  enabled = v;
  try { window.localStorage.setItem('cq_sound', v ? 'on' : 'off'); } catch { /* no-op */ }
};
