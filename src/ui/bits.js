import React from 'react';

export const cx = (...c) => c.filter(Boolean).join(' ');

// Chunky pill used across the HUD.
export const Pill = ({ children, className, onClick }) => (
  <button
    onClick={onClick}
    disabled={!onClick}
    className={cx(
      'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-extrabold shadow-card',
      onClick && 'active:scale-95 transition-transform',
      className
    )}
  >
    {children}
  </button>
);

// Big game button.
export const BigBtn = ({ children, onClick, tone = 'go', disabled, className }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cx(
      'w-full rounded-2xl py-3.5 text-[15px] font-black tracking-tight transition active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100',
      tone === 'go' && 'bg-gradient-to-b from-quest-300 to-quest-500 text-quest-900 shadow-glow',
      tone === 'plain' && 'bg-white/12 text-white',
      tone === 'sun' && 'bg-gradient-to-b from-sun-400 to-sun-600 text-grime-900',
      className
    )}
  >
    {children}
  </button>
);

// Full-screen sheet that slides up over the map.
export const Sheet = ({ children, onClose, tall }) => (
  <div className="absolute inset-0 z-40 flex items-end">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <div className={cx('relative w-full rounded-t-[30px] bg-grime-900 ring-1 ring-white/10 animate-slideUp overflow-y-auto no-scrollbar', tall ? 'max-h-[94%]' : 'max-h-[80%]')}>
      <div className="sticky top-0 flex justify-center pt-2.5 pb-1 bg-grime-900/95 z-10">
        <span className="h-1.5 w-12 rounded-full bg-white/20" />
      </div>
      {children}
    </div>
  </div>
);
