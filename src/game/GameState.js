import React, { createContext, useContext, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  INITIAL_SPAWNS, RIVALS, PLAYER_START, xpForLevel,
  DAILY_QUESTS, buddyStage, GOLDEN_CHANCE, RUSH_MINUTES,
} from './data';

const Ctx = createContext(null);
export const useGame = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useGame outside GameProvider');
  return v;
};

export const GameProvider = ({ children }) => {
  const [player, setPlayer] = useState(PLAYER_START);
  const [spawns, setSpawns] = useState(INITIAL_SPAWNS.map((s) => ({ ...s, status: 'active' })));
  const [rivals, setRivals] = useState(RIVALS);
  const [pos, setPos] = useState({ x: 46, y: 48 });
  const [banked, setBanked] = useState(null);
  const [toast, setToast] = useState(null);
  const walkRef = useRef(null);

  // ---- the daily / civic loop ----
  const [quests, setQuests] = useState(DAILY_QUESTS.map((q) => ({ ...q, progress: 0, claimed: false })));
  const [dex, setDex] = useState({ 'Plastic bottle': 21, Cup: 9, 'Food waste': 5, 'Paper / carton': 2 });
  const [buddyXp, setBuddyXp] = useState(84);
  const [goldenId, setGoldenId] = useState('s2'); // one spawn shines gold (3×)
  const [cleanliness, setCleanliness] = useState(62);
  const rushEndsAtRef = useRef(Date.now() + RUSH_MINUTES * 60 * 1000);

  // Rivals keep earning and the neighborhood keeps (slowly) getting cleaner
  // from community play — the world feels alive.
  useEffect(() => {
    const t = setInterval(() => {
      setRivals((prev) => prev.map((r, i) => (Math.random() < 0.3 ? { ...r, points: r.points + 3 + ((i * 7) % 9) } : r)));
      if (Math.random() < 0.25) setCleanliness((c) => Math.min(99, Math.round((c + 0.4) * 10) / 10));
    }, 9000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => () => clearInterval(walkRef.current), []);

  const showToast = useCallback((msg, emoji = '✅') => {
    setToast({ msg, emoji, id: Date.now() });
    setTimeout(() => setToast(null), 2400);
  }, []);

  // Animate the avatar toward a target (prototype stand-in for real GPS walking).
  const walkTo = useCallback((x, y, onArrive) => {
    clearInterval(walkRef.current);
    walkRef.current = setInterval(() => {
      setPos((p) => {
        const dx = x - p.x;
        const dy = y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < 1.5) {
          clearInterval(walkRef.current);
          if (onArrive) setTimeout(onArrive, 120);
          return { x, y };
        }
        const step = 1.6;
        return { x: p.x + (dx / d) * step, y: p.y + (dy / d) * step };
      });
    }, 60);
  }, []);

  const leaderboard = useMemo(() => {
    const rows = [...rivals.map((r) => ({ ...r, you: false })), { id: 'you', name: player.name, avatar: player.avatar, points: player.points, you: true }];
    rows.sort((a, b) => b.points - a.points);
    return rows.map((r, i) => ({ ...r, rank: i + 1 }));
  }, [rivals, player.points, player.name, player.avatar]);
  const myRank = leaderboard.find((r) => r.you).rank;

  // Bank a cleanup run (may span several litter zones — or none: street litter
  // counts too). The hub of the loop: points/XP/rank, Trashdex, buddy, quests,
  // cleanliness, and zone respawns.
  const bankRun = useCallback(({ items, breakdown, total, comboMax = 1, zoneIds = [] }) => {
    const rankBefore = myRank;
    const firstZone = spawns.find((s) => s.id === zoneIds[0]);
    const title = firstZone ? firstZone.name : 'Street cleanup';

    // Trashdex: count every banked item; note first-time discoveries.
    const newSpecies = [];
    setDex((prev) => {
      const next = { ...prev };
      items.forEach((it) => {
        if (!(it.type in next)) newSpecies.push(it.type);
        next[it.type] = (next[it.type] || 0) + 1;
      });
      return next;
    });

    // Buddy grows with every item cleaned.
    let buddyUp = null;
    setBuddyXp((prev) => {
      const next = prev + items.length * 9;
      const a = buddyStage(prev);
      const b = buddyStage(next);
      if (b.name !== a.name) buddyUp = { from: a, to: b };
      return next;
    });

    // Daily quests tick forward.
    const largeCount = items.filter((it) => it.size && it.size.mult >= 2).length;
    setQuests((prev) => prev.map((q) => {
      if (q.claimed) return q;
      let p = q.progress;
      if (q.type === 'items') p += items.length;
      if (q.type === 'large') p += largeCount;
      if (q.type === 'combo') p = Math.max(p, comboMax);
      if (q.type === 'banks') p += 1;
      return { ...q, progress: Math.min(q.target, p) };
    }));

    // The neighborhood visibly improves.
    setCleanliness((c) => Math.min(99, c + 1));

    setPlayer((prev) => {
      let xp = prev.xp + Math.round(total * 0.6);
      let level = prev.level;
      let leveled = false;
      while (xp >= xpForLevel(level)) { xp -= xpForLevel(level); level += 1; leveled = true; }
      const next = {
        ...prev,
        xp, level,
        points: prev.points + total,
        lifetime: { items: prev.lifetime.items + items.length, bags: prev.lifetime.bags + 1, missions: prev.lifetime.missions + 1 },
      };
      const after = [...rivals.map((r) => r.points), next.points].sort((a, b) => b - a).indexOf(next.points) + 1;
      setTimeout(() => setBanked({
        title, items, breakdown, total, leveled, level,
        rankBefore, rankAfter: after, newSpecies, buddyUp,
      }), 0);
      return next;
    });

    // every zone touched in this run gets cleaned + respawned elsewhere
    zoneIds.forEach((zid) => {
      setSpawns((prev) => prev.map((s) => (s.id === zid ? { ...s, status: 'cleaned' } : s)));
      setGoldenId((g) => (g === zid ? null : g));
      setTimeout(() => {
        setSpawns((prev) => prev.map((s) => (s.id === zid
          ? { ...s, status: 'active', x: 10 + Math.random() * 78, y: 14 + Math.random() * 68 }
          : s)));
        if (Math.random() < GOLDEN_CHANCE) setGoldenId(zid);
      }, 25000);
    });
  }, [myRank, rivals, spawns]);

  // Claim a completed daily quest → instant points on the leaderboard.
  const claimQuest = useCallback((id) => {
    setQuests((prev) => prev.map((q) => {
      if (q.id !== id || q.claimed || q.progress < q.target) return q;
      setPlayer((p) => ({ ...p, points: p.points + q.reward }));
      showToast(`Quest complete! +${q.reward} pts`, '🎯');
      return { ...q, claimed: true };
    }));
  }, [showToast]);

  const claimable = quests.filter((q) => !q.claimed && q.progress >= q.target).length;

  const value = useMemo(() => ({
    player, spawns, pos, leaderboard, myRank, banked, toast,
    quests, claimQuest, claimable, dex, buddyXp, goldenId, cleanliness,
    rushEndsAt: rushEndsAtRef.current,
    walkTo, bankRun, showToast,
    dismissBanked: () => setBanked(null),
  }), [player, spawns, pos, leaderboard, myRank, banked, toast, quests, claimQuest, claimable, dex, buddyXp, goldenId, cleanliness, walkTo, bankRun, showToast]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
