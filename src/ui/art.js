import React, { useRef } from 'react';
import { cx } from './bits';

// Hand-crafted SVG game art — glossy Pokémon-Go-style pins, a buddy creature
// with a face, and holographic AR frames. All self-contained, no assets.

const uid = () => `a${Math.random().toString(36).slice(2, 8)}`;

const PIN_TONES = {
  active: ['#6ee7b7', '#059669', '#065f46'],
  far: ['#e2e8f0', '#94a3b8', '#475569'],
  golden: ['#fde68a', '#f59e0b', '#b45309'],
  blue: ['#7dd3fc', '#0284c7', '#075985'],
  report: ['#93c5fd', '#3b82f6', '#1d4ed8'],
};

// Glossy teardrop map pin with a white face circle holding an emoji.
export const Pin = ({ tone = 'active', size = 46, emoji, className, wobble }) => {
  const id = useRef(uid()).current;
  const [hi, lo, edge] = PIN_TONES[tone] || PIN_TONES.active;
  return (
    <span className={cx('relative block', wobble && 'animate-floaty', className)} style={{ width: size, height: size * 1.3 }}>
      <svg viewBox="0 0 100 130" width={size} height={size * 1.3} className="absolute inset-0">
        <defs>
          <radialGradient id={`${id}g`} cx="32%" cy="26%" r="80%">
            <stop offset="0%" stopColor={hi} />
            <stop offset="100%" stopColor={lo} />
          </radialGradient>
        </defs>
        <ellipse cx="50" cy="121" rx="20" ry="6" fill="rgba(0,0,0,0.28)" />
        <path
          d="M50 116 C50 116 13 66 13 44 a37 37 0 1 1 74 0 C87 66 50 116 50 116 Z"
          fill={`url(#${id}g)`}
          stroke="#ffffff"
          strokeWidth="6"
          style={{ filter: `drop-shadow(0 2px 2px ${edge}66)` }}
        />
        <circle cx="50" cy="44" r="23" fill="#ffffff" />
        <circle cx="50" cy="44" r="23" fill="none" stroke={`${edge}22`} strokeWidth="2" />
        <ellipse cx="36" cy="22" rx="11" ry="6" fill="#ffffff" opacity="0.45" transform="rotate(-28 36 22)" />
      </svg>
      {emoji && (
        <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none" style={{ top: size * 1.3 * 0.34, fontSize: size * 0.4 }}>
          {emoji}
        </span>
      )}
    </span>
  );
};

// The player: a glossy blue orb with the avatar inside.
export const PlayerOrb = ({ size = 48, avatar = '🧑‍🚀', className }) => {
  const id = useRef(uid()).current;
  return (
    <span className={cx('relative block', className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} className="absolute inset-0">
        <defs>
          <radialGradient id={`${id}p`} cx="32%" cy="26%" r="80%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0369a1" />
          </radialGradient>
        </defs>
        <ellipse cx="50" cy="93" rx="24" ry="6" fill="rgba(0,0,0,0.28)" />
        <circle cx="50" cy="48" r="40" fill={`url(#${id}p)`} stroke="#ffffff" strokeWidth="7" />
        <ellipse cx="34" cy="28" rx="14" ry="8" fill="#ffffff" opacity="0.5" transform="rotate(-30 34 28)" />
      </svg>
      <span className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 leading-none" style={{ fontSize: size * 0.46 }}>
        {avatar}
      </span>
    </span>
  );
};

// Buddy Eco-Spirit — a cel-shaded sprout creature that evolves. stage 0..2.
export const BuddySprite = ({ stage = 0, size = 60, className }) => {
  const id = useRef(uid()).current;
  const headY = stage === 0 ? 62 : 60;
  const headR = stage === 0 ? 20 : 23;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <defs>
        <radialGradient id={`${id}b`} cx="34%" cy="28%" r="85%">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="100%" stopColor="#10b981" />
        </radialGradient>
        <radialGradient id={`${id}l`} cx="34%" cy="28%" r="85%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#047857" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="93" rx="19" ry="5" fill="rgba(0,0,0,0.25)" />

      {/* Grove Guardian canopy */}
      {stage >= 2 && (
        <g>
          <circle cx="30" cy="36" r="14" fill={`url(#${id}l)`} stroke="#065f46" strokeWidth="1.2" />
          <circle cx="70" cy="36" r="14" fill={`url(#${id}l)`} stroke="#065f46" strokeWidth="1.2" />
          <circle cx="50" cy="24" r="17" fill={`url(#${id}l)`} stroke="#065f46" strokeWidth="1.2" />
          <circle cx="44" cy="20" r="2" fill="#fbbf24" />
          <circle cx="58" cy="30" r="2" fill="#f9a8d4" />
        </g>
      )}

      {/* sprout stem + leaves */}
      {stage < 2 && (
        <g>
          <path d={`M50 ${headY - headR} Q50 ${headY - headR - 12} 50 ${headY - headR - 16}`} stroke="#047857" strokeWidth="3.4" fill="none" strokeLinecap="round" />
          <ellipse cx="40" cy={headY - headR - 14} rx="10" ry="5" fill={`url(#${id}l)`} transform={`rotate(-32 40 ${headY - headR - 14})`} />
          <ellipse cx="60" cy={headY - headR - 14} rx="10" ry="5" fill={`url(#${id}l)`} transform={`rotate(32 60 ${headY - headR - 14})`} />
        </g>
      )}

      {/* sapling side leaves */}
      {stage >= 1 && (
        <g>
          <ellipse cx="24" cy={headY + 2} rx="9" ry="4.5" fill={`url(#${id}l)`} transform={`rotate(-18 24 ${headY + 2})`} />
          <ellipse cx="76" cy={headY + 2} rx="9" ry="4.5" fill={`url(#${id}l)`} transform={`rotate(18 76 ${headY + 2})`} />
        </g>
      )}

      {/* body */}
      <circle cx="50" cy={headY} r={headR} fill={`url(#${id}b)`} stroke="#065f46" strokeWidth="1.6" />
      <ellipse cx="41" cy={headY - headR * 0.55} rx="7" ry="4" fill="#ffffff" opacity="0.4" transform={`rotate(-24 41 ${headY - headR * 0.55})`} />

      {/* face */}
      <circle cx="42.5" cy={headY - 1} r="3.1" fill="#053b2c" />
      <circle cx="43.6" cy={headY - 2.2} r="1.1" fill="#ffffff" />
      <circle cx="57.5" cy={headY - 1} r="3.1" fill="#053b2c" />
      <circle cx="58.6" cy={headY - 2.2} r="1.1" fill="#ffffff" />
      <path d={`M44.5 ${headY + 6.5} Q50 ${headY + 11} 55.5 ${headY + 6.5}`} stroke="#053b2c" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="36" cy={headY + 5} r="3" fill="#f9a8d4" opacity="0.55" />
      <circle cx="64" cy={headY + 5} r="3" fill="#f9a8d4" opacity="0.55" />
    </svg>
  );
};

const MED_TONES = {
  green: ['#a7f3d0', '#059669'],
  gold: ['#fde68a', '#d97706'],
  blue: ['#bae6fd', '#0284c7'],
  pink: ['#fbcfe8', '#db2777'],
  grey: ['#e2e8f0', '#64748b'],
};

// Glossy circular medallion holding an emoji — quest icons, list art, etc.
export const Medallion = ({ tone = 'green', size = 44, children, className, dimmed }) => {
  const id = useRef(uid()).current;
  const [hi, lo] = MED_TONES[tone] || MED_TONES.green;
  return (
    <span className={cx('relative inline-block shrink-0', dimmed && 'grayscale opacity-40', className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} className="absolute inset-0">
        <defs>
          <radialGradient id={`${id}m`} cx="32%" cy="26%" r="80%">
            <stop offset="0%" stopColor={hi} />
            <stop offset="100%" stopColor={lo} />
          </radialGradient>
        </defs>
        <circle cx="50" cy="52" r="45" fill="rgba(0,0,0,0.25)" />
        <circle cx="50" cy="48" r="45" fill={`url(#${id}m)`} stroke="#ffffff" strokeWidth="5" />
        <ellipse cx="35" cy="28" rx="15" ry="8" fill="#ffffff" opacity="0.45" transform="rotate(-28 35 28)" />
      </svg>
      <span className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 leading-none" style={{ fontSize: size * 0.46 }}>
        {children}
      </span>
    </span>
  );
};

// Holographic detection frame: gradient marching-ants rect + solid corner ticks.
export const DetectFrame = ({ tooClose, golden }) => {
  const id = useRef(uid()).current;
  return (
    <svg className="absolute inset-0 h-full w-full overflow-visible pointer-events-none" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`${id}f`} x1="0%" y1="0%" x2="100%" y2="100%">
          {tooClose ? (
            <>
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#f43f5e" />
            </>
          ) : golden ? (
            <>
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="100%" stopColor="#38bdf8" />
            </>
          )}
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)" rx="14" fill="none"
        stroke={`url(#${id}f)`} strokeWidth="3" strokeDasharray="16 10" className="cq-dash"
        style={{ filter: 'drop-shadow(0 0 6px rgba(52,211,153,0.6))' }} />
    </svg>
  );
};
