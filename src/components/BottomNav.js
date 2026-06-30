// GlowUp — bottom tab navigation for the phone shell.

import React from 'react';
import { Map, Sparkles, Users, BarChart3, User } from 'lucide-react';

const TABS = [
  { id: 'map', label: 'Map', icon: Map },
  { id: 'collection', label: 'Collect', icon: Sparkles },
  { id: 'crew', label: 'Crews', icon: Users },
  { id: 'impact', label: 'Impact', icon: BarChart3 },
  { id: 'profile', label: 'You', icon: User },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="border-t border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="grid grid-cols-5">
        {TABS.map((t) => {
          const Icon = t.icon;
          const on = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={
                'flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ' +
                (on ? 'text-emerald-300' : 'text-slate-500 hover:text-slate-300')
              }
              aria-label={t.label}
              aria-current={on ? 'page' : undefined}
            >
              <span className="relative">
                {on && (
                  <span className="absolute -inset-2 rounded-full bg-emerald-400/15 blur-sm" aria-hidden />
                )}
                <Icon size={20} className="relative" strokeWidth={on ? 2.4 : 2} />
              </span>
              {t.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
