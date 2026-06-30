// GlowUp — Collection screen. Place-tied AR guardians, earned only through
// meaningful real-world action (never purchasable).

import React, { useState } from 'react';
import { Lock, Sparkles, MapPin } from 'lucide-react';
import { CREATURES, RARITY_ORDER, ZONES } from '../game/data';
import { useGame } from '../game/state';
import { Card, Chip, ScreenHeader, ProgressBar, glow, Hint } from '../components/ui';

function zoneNameFor(zoneId) {
  const z = ZONES.find((z) => z.id === zoneId);
  return z ? z.name : null;
}

export default function CollectionScreen() {
  const { state } = useGame();
  const [selected, setSelected] = useState(null);

  const all = Object.values(CREATURES).sort(
    (a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity),
  );
  const unlockedCount = Object.keys(state.collection).length;
  const sel = selected ? CREATURES[selected] : null;
  const selUnlock = sel && state.collection[sel.id];

  return (
    <div className="space-y-5 py-2">
      <ScreenHeader title="Glow Codex" subtitle={`${unlockedCount} of ${all.length} guardians awakened`} />

      <Card className="p-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Collection progress</span>
          <span>{Math.round((unlockedCount / all.length) * 100)}%</span>
        </div>
        <ProgressBar value={(unlockedCount / all.length) * 100} glowToken="fuchsia" />
      </Card>

      <div className="grid grid-cols-3 gap-3">
        {all.map((c) => {
          const unlocked = !!state.collection[c.id];
          const g = glow(c.glow);
          return (
            <button
              key={c.id}
              onClick={() => setSelected(c.id)}
              className={`aspect-square rounded-2xl border p-2 flex flex-col items-center justify-center text-center transition active:scale-95 ${
                unlocked ? `${g.border} ${g.bg}` : 'border-white/10 bg-white/[0.03]'
              }`}
            >
              <div className={`text-3xl ${unlocked ? 'animate-float' : 'grayscale opacity-30'}`}>
                {unlocked ? c.emoji : '❔'}
              </div>
              <div className="mt-1 text-[10px] font-semibold text-white truncate w-full">
                {unlocked ? c.name : '???'}
              </div>
              {!unlocked && <Lock size={10} className="text-slate-500 mt-0.5" />}
            </button>
          );
        })}
      </div>

      <Hint icon={<Sparkles size={14} className="mt-0.5 text-fuchsia-300 shrink-0" />}>
        Guardians are tied to real places and real impact. Rare and legendary guardians are <b>earned</b> through
        restoration — never bought.
      </Hint>

      {/* Detail sheet */}
      {sel && (
        <div className="fixed inset-0 z-30 grid place-items-end sm:place-items-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn" onClick={() => setSelected(null)}>
          <Card glowToken={sel.glow} className="w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4">
              <div className={`text-6xl ${selUnlock ? 'animate-float' : 'grayscale opacity-40'}`}>
                {selUnlock ? sel.emoji : '❔'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold text-white">{selUnlock ? sel.name : '???'}</h3>
                  <Chip glowToken={sel.glow} className="capitalize">{sel.rarity}</Chip>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{sel.kind}</div>
              </div>
            </div>
            <p className="text-sm text-slate-300 mt-3">{selUnlock ? sel.lore : 'A guardian still waiting to be awakened.'}</p>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Sparkles size={13} className={glow(sel.glow).text} /> How to earn: {sel.unlock}
              </div>
              {selUnlock?.unlockedAtZone && zoneNameFor(selUnlock.unlockedAtZone) && (
                <div className="flex items-center gap-2 text-xs text-emerald-300">
                  <MapPin size={13} /> Awakened at {zoneNameFor(selUnlock.unlockedAtZone)}
                </div>
              )}
            </div>
            <button onClick={() => setSelected(null)} className="mt-4 w-full text-center text-xs text-slate-400 hover:text-white">
              Close
            </button>
          </Card>
        </div>
      )}
    </div>
  );
}
