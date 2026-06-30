import React from 'react';
import { cx } from './ui';
import { Map, Compass, Users, CalendarHeart, BarChart3 } from 'lucide-react';

const TABS = [
  { key: 'map', label: 'Map', Icon: Map },
  { key: 'quests', label: 'Quests', Icon: Compass },
  { key: 'crew', label: 'Crew', Icon: Users },
  { key: 'events', label: 'Events', Icon: CalendarHeart },
  { key: 'dashboard', label: 'Impact', Icon: BarChart3 },
];

const BottomNav = ({ active, onChange, onProfile, avatar }) => (
  <div className="absolute bottom-0 inset-x-0 z-30">
    <div className="mx-3 mb-3 glass rounded-[26px] px-2 py-2 flex items-center justify-between shadow-soft">
      {TABS.map(({ key, label, Icon }) => {
        const on = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="relative flex-1 flex flex-col items-center gap-0.5 py-1.5"
          >
            <span className={cx('grid place-items-center h-9 w-9 rounded-2xl transition-all',
              on ? 'bg-gradient-to-br from-quest-400 to-quest-600 shadow-glow' : 'bg-transparent')}>
              <Icon className={cx('h-5 w-5 transition-colors', on ? 'text-grime-900' : 'text-white/55')} strokeWidth={on ? 2.6 : 2} />
            </span>
            <span className={cx('text-[10px] font-bold transition-colors', on ? 'text-white' : 'text-white/45')}>{label}</span>
          </button>
        );
      })}
      <button onClick={onProfile} className="relative flex-1 flex flex-col items-center gap-0.5 py-1.5">
        <span className="grid place-items-center h-9 w-9 rounded-2xl bg-white/8 text-lg">{avatar}</span>
        <span className="text-[10px] font-bold text-white/45">You</span>
      </button>
    </div>
  </div>
);

export default BottomNav;
