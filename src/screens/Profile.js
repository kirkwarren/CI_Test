import React from 'react';
import { useGame } from '../game/GameState';
import { xpForLevel, buddyStage, buddyNext, BUDDY_STAGES } from '../game/data';
import { cx, Sheet } from '../ui/bits';
import { PlayerOrb, BuddySprite } from '../ui/art';
import { Zap, Flame, ShoppingBag, CheckCircle2, Share2 } from 'lucide-react';

const Ring = ({ pct, children }) => {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-32 w-32 mx-auto">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="9" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="#34d399" strokeWidth="9" strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * c} ${c}`} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
};

const Profile = ({ onClose }) => {
  const { player, myRank, showToast, buddyXp } = useGame();
  const need = xpForLevel(player.level);
  const pct = Math.min(100, (player.xp / need) * 100);
  const buddy = buddyStage(buddyXp);
  const next = buddyNext(buddyXp);
  const buddyIdx = BUDDY_STAGES.indexOf(buddy);

  return (
    <Sheet onClose={onClose}>
      <div className="px-5 pb-8 text-center">
        <Ring pct={pct}>
          <PlayerOrb size={78} avatar={player.avatar} />
        </Ring>
        <h2 className="text-white font-black text-xl mt-2">Trainer, Level {player.level}</h2>
        <p className="text-white/50 text-[12px] font-bold">{player.xp} / {need} XP to level {player.level + 1}</p>

        <div className="grid grid-cols-4 gap-2 mt-5">
          {[
            [<Zap key="i" className="h-5 w-5 text-quest-300 mx-auto" />, player.points.toLocaleString(), 'points'],
            [<Flame key="i" className="h-5 w-5 text-sun-400 mx-auto" />, player.streak, 'day streak'],
            [<ShoppingBag key="i" className="h-5 w-5 text-ocean-400 mx-auto" />, player.lifetime.bags, 'bags'],
            [<CheckCircle2 key="i" className="h-5 w-5 text-fuchsia-400 mx-auto" />, player.lifetime.items, 'items'],
          ].map(([icon, v, l], i) => (
            <div key={i} className="rounded-2xl bg-white/6 ring-1 ring-white/8 py-3">
              {icon}
              <p className="text-white font-black text-lg leading-tight mt-1">{v}</p>
              <p className="text-white/45 text-[10px] font-bold">{l}</p>
            </div>
          ))}
        </div>

        <p className="text-white/60 text-[13px] font-bold mt-5">
          Rank <span className="text-sun-400 font-black">#{myRank}</span> in this week's Cleanup Cup
        </p>

        {/* buddy Eco-Spirit */}
        <div className="mt-5 rounded-3xl bg-gradient-to-br from-quest-500/12 to-fuchsia-500/8 ring-1 ring-quest-400/20 p-4 flex items-center gap-4">
          <BuddySprite stage={buddyIdx} size={84} className="shrink-0 animate-floaty drop-shadow-lg" />
          <div className="flex-1 text-left">
            <p className="text-white font-black text-base leading-tight">{buddy.name}</p>
            <p className="text-white/50 text-[11px] font-bold">Your buddy grows with every item you clean</p>
            {next ? (
              <>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden mt-2">
                  <div className="h-full rounded-full bg-gradient-to-r from-quest-400 to-fuchsia-400 transition-all duration-500" style={{ width: `${Math.min(100, (buddyXp / next.min) * 100)}%` }} />
                </div>
                <p className="text-white/45 text-[10px] font-bold mt-1">{buddyXp} / {next.min} · evolves into {next.emoji} {next.name}</p>
              </>
            ) : (
              <p className="text-fuchsia-300 text-[11px] font-black mt-1.5">Fully evolved — a true guardian 🌟</p>
            )}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-left text-white font-black text-sm mb-2">Badges</p>
          <div className="grid grid-cols-6 gap-2">
            {player.badges.map((b) => (
              <div key={b.id} title={b.name} className={cx('rounded-2xl py-2.5 ring-1', b.got ? 'bg-white/8 ring-quest-400/30' : 'bg-white/[0.02] ring-white/5')}>
                <span className={cx('text-2xl block', !b.got && 'grayscale opacity-25')}>{b.emoji}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => showToast('Impact card copied — share it!', '📲')}
          className="mt-6 w-full rounded-2xl py-3.5 font-black text-quest-900 bg-gradient-to-b from-quest-300 to-quest-500 shadow-glow active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          <Share2 className="h-4.5 w-4.5" /> Share my impact
        </button>
      </div>
    </Sheet>
  );
};

export default Profile;
