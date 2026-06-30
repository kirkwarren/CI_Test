import React from 'react';

export const cx = (...c) => c.filter(Boolean).join(' ');

export const ProgressBar = ({ value, max = 100, gradient = 'from-quest-400 to-ocean-400', height = 'h-2.5', glow = true }) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cx('w-full rounded-full bg-white/10 overflow-hidden', height)}>
      <div
        className={cx('h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out', gradient, glow && 'shadow-glow')}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export const Chip = ({ children, className }) => (
  <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold', className)}>
    {children}
  </span>
);

export const priorityChip = (priority) => {
  switch (priority) {
    case 'High':
      return 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30';
    case 'Medium':
      return 'bg-sun-500/15 text-sun-400 ring-1 ring-sun-400/30';
    default:
      return 'bg-quest-500/15 text-quest-300 ring-1 ring-quest-400/30';
  }
};

export const SectionTitle = ({ children, sub, action }) => (
  <div className="flex items-end justify-between mb-3">
    <div>
      <h2 className="text-white font-extrabold text-lg tracking-tight">{children}</h2>
      {sub && <p className="text-white/45 text-xs mt-0.5">{sub}</p>}
    </div>
    {action}
  </div>
);

export const Card = ({ children, className, onClick }) => (
  <div
    onClick={onClick}
    className={cx(
      'glass rounded-3xl p-4 shadow-card',
      onClick && 'cursor-pointer active:scale-[0.985] transition-transform',
      className
    )}
  >
    {children}
  </div>
);

export const StatTile = ({ label, value, icon, accent = 'text-quest-300' }) => (
  <div className="glass rounded-2xl px-3 py-3 flex-1 min-w-0">
    <div className={cx('text-xl', accent)}>{icon}</div>
    <div className="text-white font-extrabold text-lg leading-tight mt-1 truncate">{value}</div>
    <div className="text-white/45 text-[11px] font-medium truncate">{label}</div>
  </div>
);

export const PrimaryButton = ({ children, onClick, className, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cx(
      'w-full rounded-2xl py-3.5 font-extrabold text-grime-900 text-[15px] tracking-tight',
      'bg-gradient-to-r from-quest-300 to-quest-400 shadow-glow',
      'active:scale-[0.98] transition-transform disabled:opacity-40 disabled:active:scale-100',
      className
    )}
  >
    {children}
  </button>
);
