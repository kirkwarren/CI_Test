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
            const frame = t.rarity === 'rare' ? 'from-fuchsia-400 via-fuchsia-500 to-ocean-500'
              : t.rarity === 'uncommon' ? 'from-ocean-300 to-ocean-600'
                : 'from-slate-400/70 to-slate-600/70';
            return count ? (
              <div key={t.type} className={cx('rounded-2xl p-[2px] bg-gradient-to-b shadow-card', frame, t.rarity === 'rare' && 'shadow-glow')}>
                <div className="relative rounded-[14px] bg-grime-900 p-3 text-center overflow-hidden">
                  {/* card sheen */}
                  <span className="absolute -top-6 -left-8 h-16 w-24 bg-white/10 rotate-[20deg] pointer-events-none" />
                  <span className="text-3xl block drop-shadow">{t.emoji}</span>
                  <p className="text-[11px] font-black mt-1.5 leading-tight text-white">{t.type}</p>
                  <span className={cx('inline-block rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wide mt-1.5', RARITY_STYLE[t.rarity])}>
                    {t.rarity}
                  </span>
                  <p className="text-[10px] font-bold mt-1 text-quest-300">cleaned ×{count}</p>
                </div>
              </div>
            ) : (
              <div key={t.type} className="rounded-2xl p-3 text-center bg-white/[0.02] ring-1 ring-dashed ring-white/10">
                <span className="text-3xl block grayscale opacity-20 blur-[2px]">{t.emoji}</span>
                <p className="text-[13px] font-black mt-1.5 text-white/25">???</p>
                <span className={cx('inline-block rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wide mt-1.5 opacity-50', RARITY_STYLE[t.rarity])}>
                  {t.rarity}
                </span>
                <p className="text-[10px] font-bold mt-1 text-white/20">not yet found</p>
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
