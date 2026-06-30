// GlowUp — shared UI primitives. A small, cohesive design system so every
// screen reads as the same "AR mobile game" rather than a form app.

import React from 'react';
import { GLOW } from '../game/data';

export function glow(token) {
  return GLOW[token] || GLOW.emerald;
}

// Frosted card used everywhere.
export function Card({ className = '', glowToken, children, ...rest }) {
  const g = glowToken ? glow(glowToken) : null;
  return (
    <div
      className={
        'rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm ' +
        (g ? g.border + ' ' : '') +
        className
      }
      {...rest}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children, right }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">{children}</h2>
      {right}
    </div>
  );
}

export function Button({ variant = 'primary', glowToken = 'emerald', className = '', children, ...rest }) {
  const g = glow(glowToken);
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none';
  const variants = {
    primary: `bg-gradient-to-r ${g.from} ${g.to} text-slate-950 ${g.glowShadow} hover:brightness-110`,
    ghost: 'bg-white/5 text-slate-100 border border-white/10 hover:bg-white/10',
    subtle: `bg-white/5 ${g.text} border ${g.border} hover:bg-white/10`,
    danger: 'bg-rose-500/90 text-white hover:bg-rose-500',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function Chip({ glowToken = 'emerald', className = '', children }) {
  const g = glow(glowToken);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${g.bg} ${g.text} border ${g.border} ${className}`}
    >
      {children}
    </span>
  );
}

export function ProgressBar({ value = 0, glowToken = 'emerald', className = '', height = 'h-2' }) {
  const g = glow(glowToken);
  return (
    <div className={`w-full ${height} rounded-full bg-white/10 overflow-hidden ${className}`}>
      <div
        className={`${height} rounded-full bg-gradient-to-r ${g.from} ${g.to} transition-all duration-700`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

// Big stat block.
export function Stat({ label, value, sub, glowToken = 'emerald', icon }) {
  const g = glow(glowToken);
  return (
    <Card className="p-3.5">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </div>
      <div className={`mt-1 text-2xl font-bold ${g.text}`}>{value}</div>
      {sub && <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>}
    </Card>
  );
}

// A glowing orb / node used on the map and in reveals.
export function GlowOrb({ glowToken = 'emerald', size = 'h-3.5 w-3.5', faded = false, pulse = true }) {
  const g = glow(glowToken);
  if (faded) {
    return <span className={`block ${size} rounded-full bg-slate-600/80 ring-2 ring-slate-700`} />;
  }
  return (
    <span className="relative inline-flex">
      {pulse && <span className={`absolute inline-flex ${size} rounded-full ${g.dot} opacity-60 animate-ping-slow`} />}
      <span className={`relative inline-flex ${size} rounded-full ${g.dot} ${g.glowShadow}`} />
    </span>
  );
}

export function RarityTag({ rarity }) {
  const map = {
    common: 'emerald',
    uncommon: 'cyan',
    rare: 'fuchsia',
    legendary: 'amber',
  };
  return (
    <Chip glowToken={map[rarity] || 'emerald'} className="capitalize">
      {rarity}
    </Chip>
  );
}

// Section header used at the top of each screen.
export function ScreenHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-end justify-between gap-3 mb-4">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function Divider() {
  return <div className="h-px bg-white/10 my-4" />;
}

// Empty / hint state.
export function Hint({ icon, children }) {
  return (
    <div className="flex items-start gap-2 rounded-xl bg-white/[0.03] border border-white/10 p-3 text-xs text-slate-400">
      {icon}
      <span>{children}</span>
    </div>
  );
}
