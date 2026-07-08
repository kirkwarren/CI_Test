import React, { useState } from 'react';
import { BuddySprite, Medallion, Pin } from './art';
import { BigBtn, cx } from './bits';
import { play } from '../game/sound';
import { ShieldCheck, Trophy } from 'lucide-react';

// First-open experience: three quick slides that sell the loop.
// Shown once (localStorage cq_intro_v1), skippable.
const SLIDES = [0, 1, 2];

const Onboarding = ({ onDone }) => {
  const [i, setI] = useState(0);

  const next = () => {
    play(i === 0 ? 'boot' : 'tick'); // console power-on jingle off the title screen
    if (i < SLIDES.length - 1) setI(i + 1);
    else onDone();
  };

  return (
    <div className="absolute inset-0 z-[70] overflow-hidden bg-gradient-to-b from-[#06281f] via-grime-900 to-[#04121f]">
      {/* ambient sparkles */}
      {Array.from({ length: 14 }).map((_, k) => (
        <span key={k} className="absolute rounded-full bg-quest-300/40 animate-pulseGlow"
          style={{ left: `${(k * 37) % 100}%`, top: `${(k * 53) % 100}%`, width: 4 + (k % 3) * 2, height: 4 + (k % 3) * 2, animationDelay: `${(k % 5) * 0.5}s` }} />
      ))}

      <div className="relative h-full flex flex-col items-center justify-between px-7 py-10">
        {/* slide content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center w-full">
          {i === 0 && (
            <div key="s0" className="animate-slideUp">
              <div className="relative inline-block">
                <span className="absolute inset-0 -m-6 rounded-full bg-quest-400/20 animate-pulseGlow" />
                <BuddySprite stage={0} size={150} className="relative animate-floaty drop-shadow-2xl" />
              </div>
              <h1 className="mt-6 font-black text-4xl tracking-tight bg-gradient-to-r from-quest-300 via-white to-ocean-400 bg-clip-text text-transparent">
                CleanQuest
              </h1>
              <p className="text-white/60 text-[15px] font-bold mt-2 text-balance">
                Your city is the game board.<br />Real litter. Real points. Real impact.
              </p>
              <p className="text-quest-300/80 text-[12px] font-black mt-4">This is Sprout — your cleanup buddy. It grows as you clean. 🌱</p>
              <p className="cq-pixel text-white/30 text-[10px] mt-6">© 1996 CLEANQUEST CO. · LICENSED BY CITY OF RIVERTON</p>
            </div>
          )}

          {i === 1 && (
            <div key="s1" className="animate-slideUp w-full max-w-[300px]">
              <h2 className="font-black text-2xl text-white tracking-tight mb-6">Three taps to a<br /><span className="text-quest-300">cleaner street</span></h2>
              <div className="space-y-4 text-left">
                {[
                  ['green', '📷', 'Point your camera', 'On-device AI spots real litter and boxes it live — and knows what isn’t litter.'],
                  ['blue', '🧤', 'GRAB it', 'The camera watches the whole journey: ground → hand → bag. Bigger trash, bigger points.'],
                  ['gold', '🗑️', 'Bin it to bank', 'Scan any approved bin’s QR — points hit the leaderboard only after real disposal.'],
                ].map(([tone, e, t, d]) => (
                  <div key={t} className="flex items-center gap-3.5 rounded-3xl bg-white/5 ring-1 ring-white/10 p-3.5">
                    <Medallion tone={tone} size={48}>{e}</Medallion>
                    <div>
                      <p className="text-white font-black text-[14px]">{t}</p>
                      <p className="text-white/50 text-[11.5px] leading-snug">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {i === 2 && (
            <div key="s2" className="animate-slideUp w-full max-w-[300px]">
              <div className="flex justify-center gap-3 mb-5">
                <Pin tone="golden" size={54} emoji="🍾" wobble />
                <Pin tone="active" size={54} emoji="🥤" />
                <Pin tone="report" size={54} emoji="📣" />
              </div>
              <h2 className="font-black text-2xl text-white tracking-tight">Climb the<br /><span className="text-sun-400">Weekly Cleanup Cup</span></h2>
              <div className="mt-5 space-y-3 text-left">
                <div className="flex items-start gap-3 rounded-3xl bg-sun-500/10 ring-1 ring-sun-400/25 p-3.5">
                  <Trophy className="h-5 w-5 text-sun-400 mt-0.5 shrink-0" />
                  <p className="text-white/75 text-[12.5px] leading-snug"><b className="text-white">Golden spawns pay ×3.</b> Follow the mini-map to special rewards, rush hours, and your adopted block.</p>
                </div>
                <div className="flex items-start gap-3 rounded-3xl bg-quest-500/10 ring-1 ring-quest-400/25 p-3.5">
                  <ShieldCheck className="h-5 w-5 text-quest-300 mt-0.5 shrink-0" />
                  <p className="text-white/75 text-[12.5px] leading-snug"><b className="text-white">Fair by design.</b> Only camera-verified, bin-scanned cleanups score — cheaters never touch the board.</p>
                </div>
                <div className="flex items-start gap-3 rounded-3xl bg-ocean-500/10 ring-1 ring-ocean-400/25 p-3.5">
                  <span className="text-lg mt--0.5">🏙️</span>
                  <p className="text-white/75 text-[12.5px] leading-snug"><b className="text-white">Your city wins.</b> Every verified item raises the neighborhood meter — hit the goal and sponsors plant real trees.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* dots + CTA */}
        <div className="w-full max-w-[300px]">
          <div className="flex justify-center gap-2 mb-4">
            {SLIDES.map((s) => (
              <span key={s} className={cx('h-2 rounded-full transition-all duration-300', s === i ? 'w-6 bg-quest-300' : 'w-2 bg-white/20')} />
            ))}
          </div>
          <BigBtn onClick={next} className={cx(i === 0 && 'cq-pixel')}>
            {i === 0 ? <span><span className="cq-blink">▶</span> PRESS START</span> : i < SLIDES.length - 1 ? 'Next' : "📷 Let's clean!"}
          </BigBtn>
          {i < SLIDES.length - 1 && (
            <button onClick={() => { play('tick'); onDone(); }} className="w-full text-center text-white/35 text-[12px] font-bold mt-3">
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
