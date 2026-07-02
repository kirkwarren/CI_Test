import React from 'react';
import { useGame } from '../game/GameState';
import { TRASHDEX, RARITY_STYLE } from '../game/data';
import { cx, Sheet } from '../ui/bits';
import { BookOpen } from 'lucide-react';

// The Trashdex — a Pokédex for litter. Discover every species by cleaning it.
const Trashdex = ({ onClose }) => {
  const { dex } = useGame();
  const found = TRASHDEX.filter((t) => dex[t.type]).length;

  return (
    <Sheet onClose={onClose}>
      <div className="px-5 pb-8">
        <h2 className="text-white font-black text-xl tracking-tight flex items-center gap-2 mt-1">
          <BookOpen className="h-5 w-5 text-quest-300" /> Trashdex
        </h2>
        <p className="text-white/45 text-[12px] font-semibold mt-0.5">Every species of litter you've cleaned out of the world.</p>

        <div className="flex items-center gap-3 mt-3 mb-4">
          <div className="h-2.5 flex-1 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-quest-400 to-ocean-400 shadow-glow transition-all duration-500" style={{ width: `${(found / TRASHDEX.length) * 100}%` }} />
          </div>
          <span className="text-white font-black text-sm">{found}/{TRASHDEX.length}</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {TRASHDEX.map((t) => {
            const count = dex[t.type];
            return (
              <div key={t.type} className={cx('rounded-2xl p-3 text-center ring-1', count ? 'bg-white/6 ring-white/10' : 'bg-white/[0.02] ring-white/5')}>
                <span className={cx('text-3xl block', !count && 'grayscale opacity-25 blur-[1.5px]')}>{t.emoji}</span>
                <p className={cx('text-[11px] font-black mt-1.5 leading-tight', count ? 'text-white' : 'text-white/30')}>
                  {count ? t.type : '???'}
                </p>
                <span className={cx('inline-block rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wide mt-1.5', RARITY_STYLE[t.rarity])}>
                  {t.rarity}
                </span>
                <p className={cx('text-[10px] font-bold mt-1', count ? 'text-quest-300' : 'text-white/20')}>
                  {count ? `cleaned ×${count}` : 'not yet found'}
                </p>
              </div>
            );
          })}
        </div>

        <p className="text-center text-white/40 text-[11px] font-semibold mt-4">
          Complete the Trashdex to unlock the 🥇 <b className="text-sun-400">Golden Grabber</b> avatar frame.
        </p>
      </div>
    </Sheet>
  );
};

export default Trashdex;
