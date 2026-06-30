import React from 'react';
import { useGame } from '../context/GameContext';
import { Chip, ProgressBar, cx } from '../components/ui';
import { CITY_CHALLENGES, LIVE_EVENT } from '../data/gameData';
import { Clock, Gift, Calendar, MapPin, Users, Star, Trophy, Radio, Heart } from 'lucide-react';

const EventsScreen = () => {
  const { showToast } = useGame();
  const e = LIVE_EVENT;

  return (
    <div className="px-4 pb-28 pt-2">
      {/* LIVE event hero */}
      <div className="rounded-[28px] overflow-hidden ring-1 ring-rose-400/20 shadow-soft">
        <div className="relative bg-gradient-to-br from-grime-800 to-grime-900 p-5">
          <div className="absolute right-4 top-4 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulseGlow" />
            <span className="text-rose-400 text-[11px] font-black uppercase tracking-widest">Live now</span>
          </div>
          <span className="text-4xl">{e.icon}</span>
          <h2 className="text-white font-black text-2xl tracking-tight mt-2">{e.title}</h2>
          <p className="text-white/55 text-sm mt-0.5">Hosted with {e.celebrity}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Chip className="glass text-white/80"><Calendar className="h-3 w-3" /> {e.date}</Chip>
            <Chip className="glass text-white/80"><MapPin className="h-3 w-3" /> {e.location}</Chip>
            <Chip className="glass text-white/80"><Users className="h-3 w-3" /> {e.checkedIn} checked in</Chip>
          </div>

          {/* shared AR restoration meter */}
          <div className="mt-5 rounded-3xl bg-black/30 ring-1 ring-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-xs font-bold flex items-center gap-1.5"><Radio className="h-3.5 w-3.5 text-quest-300" /> AR restoration meter</span>
              <span className="text-quest-300 font-black text-sm">{e.meter}%</span>
            </div>
            <ProgressBar value={e.meter} gradient="from-rose-400 via-sun-400 to-quest-400" height="h-3" />
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div>
                <p className="text-white font-black text-lg">{e.bagsCollected}</p>
                <p className="text-white/45 text-[10px]">of {e.goalBags} bags</p>
              </div>
              <div>
                <p className="text-white font-black text-lg">{e.poundsCollected.toLocaleString()}</p>
                <p className="text-white/45 text-[10px]">pounds</p>
              </div>
              <div>
                <p className="text-white font-black text-lg">{e.volunteerHours}</p>
                <p className="text-white/45 text-[10px]">volunteer hrs</p>
              </div>
            </div>
          </div>

          {/* perk */}
          <div className="mt-3 rounded-2xl bg-quest-500/12 ring-1 ring-quest-400/25 p-3 flex items-start gap-2.5">
            <Heart className="h-4 w-4 text-quest-300 mt-0.5 shrink-0" />
            <p className="text-white/75 text-[12px]">{e.perk}</p>
          </div>

          {/* live event teams */}
          <div className="mt-4 space-y-2">
            {e.teams.map((t, i) => (
              <div key={t.name} className={cx('flex items-center gap-3 rounded-2xl px-3 py-2.5', t.celeb ? 'bg-sun-500/12 ring-1 ring-sun-400/25' : 'bg-white/5')}>
                <span className="font-black text-white/50 text-sm w-4">{i + 1}</span>
                <p className="flex-1 text-white font-bold text-sm flex items-center gap-1.5">
                  {t.name}{t.celeb && <Star className="h-3.5 w-3.5 text-sun-400" />}
                </p>
                <p className="text-white/70 font-bold text-sm">{t.score.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <button onClick={() => showToast('Checked in! You joined Otter Squad 🦦', '📍')} className="mt-4 w-full rounded-2xl py-3.5 font-extrabold text-grime-900 bg-gradient-to-r from-rose-300 to-sun-400 shadow-glow active:scale-[0.98] transition">
            Check in & join a team
          </button>
        </div>
      </div>

      {/* City challenges */}
      <div className="mt-6">
        <h2 className="text-white font-extrabold text-lg tracking-tight mb-3 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-sun-400" /> City challenges
        </h2>
        <div className="space-y-3">
          {CITY_CHALLENGES.map((c) => (
            <div key={c.id} className={cx('rounded-3xl p-[1.5px] bg-gradient-to-r', c.accent)}>
              <div className="rounded-[22px] bg-grime-900 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm">{c.title}</p>
                    <p className="text-white/45 text-[11px]">{c.sponsor}</p>
                  </div>
                  <Chip className="bg-white/10 text-white/80"><Clock className="h-3 w-3" /> {c.daysLeft}d</Chip>
                </div>
                <p className="text-white/65 text-[12px] mt-2.5">{c.goal}</p>
                <div className="mt-2">
                  <ProgressBar value={c.progress} gradient="from-ocean-400 to-quest-400" height="h-2" />
                </div>
                <div className="mt-3 rounded-2xl bg-white/5 p-2.5 flex items-start gap-2">
                  <Gift className="h-4 w-4 text-sun-400 mt-0.5 shrink-0" />
                  <p className="text-white/70 text-[11px]">{c.reward}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-white/30 text-[11px] mt-6 px-6">
        Rewards are local & non-cash — gift cards, park & transit passes, tickets, and donations to schools and nonprofits.
      </p>
    </div>
  );
};

export default EventsScreen;
