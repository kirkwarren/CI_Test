import React from 'react';
import { FAIR_PLAY } from '../game/data';
import { Sheet } from './bits';
import { ShieldCheck } from 'lucide-react';

const FairPlay = ({ onClose }) => (
  <Sheet onClose={onClose}>
    <div className="px-5 pb-8">
      <h3 className="text-white font-black text-xl tracking-tight flex items-center gap-2 mt-1">
        <ShieldCheck className="h-5 w-5 text-quest-300" /> Fair play
      </h3>
      <p className="text-white/45 text-[12px] font-semibold mt-1 mb-4">
        Points come only from cleanups the camera actually witnessed — so the leaderboard can't be gamed.
      </p>
      <div className="space-y-2.5">
        {FAIR_PLAY.map((f) => (
          <div key={f.title} className="rounded-2xl bg-white/5 ring-1 ring-white/8 p-3.5 flex gap-3">
            <span className="text-2xl shrink-0">{f.emoji}</span>
            <div>
              <p className="text-white font-black text-sm">{f.title}</p>
              <p className="text-white/55 text-[12px] leading-relaxed mt-0.5">{f.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Sheet>
);

export default FairPlay;
