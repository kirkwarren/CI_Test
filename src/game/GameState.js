import React, { createContext, useContext, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { INITIAL_SPAWNS, RIVALS, PLAYER_START, xpForLevel } from './data';

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
  const [pos, setPos] = useState({ x: 46, y: 48 }); // player position on the map (%)
  const [banked, setBanked] = useState(null); // celebration payload
  const [toast, setToast] = useState(null);
  const walkRef = useRef(null);

  // Rivals slowly earn points too — the weekly race feels alive.
  useEffect(() => {
    const t = setInterval(() => {
      setRivals((prev) => prev.map((r, i) => (Math.random() < 0.3 ? { ...r, points: r.points + 3 + ((i * 7) % 9) } : r)));
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

  // Leaderboard = rivals + you, sorted. Rank is 1-based.
  const leaderboard = useMemo(() => {
    const rows = [...rivals.map((r) => ({ ...r, you: false })), { id: 'you', name: player.name, avatar: player.avatar, points: player.points, you: true }];
    rows.sort((a, b) => b.points - a.points);
    return rows.map((r, i) => ({ ...r, rank: i + 1 }));
  }, [rivals, player.points, player.name, player.avatar]);
  const myRank = leaderboard.find((r) => r.you).rank;

  // Bank a finished encounter: points hit the leaderboard, XP/levels apply,
  // the spawn is cleared (and respawns elsewhere later).
  const bankEncounter = useCallback((spawn, { items, breakdown, total }) => {
    const rankBefore = myRank;
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
      // compute rank after against current rivals
      const after = [...rivals.map((r) => r.points), next.points].sort((a, b) => b - a).indexOf(next.points) + 1;
      setTimeout(() => setBanked({ spawn, items, breakdown, total, leveled, level, rankBefore, rankAfter: after }), 0);
      return next;
    });
    setSpawns((prev) => prev.map((s) => (s.id === spawn.id ? { ...s, status: 'cleaned' } : s)));
    // respawn somewhere new after a while
    setTimeout(() => {
      setSpawns((prev) => prev.map((s) => (s.id === spawn.id
        ? { ...s, status: 'active', x: 10 + Math.random() * 78, y: 14 + Math.random() * 68 }
        : s)));
    }, 25000);
  }, [myRank, rivals]);

  const value = useMemo(() => ({
    player, spawns, pos, leaderboard, myRank, banked, toast,
    walkTo, bankEncounter, showToast,
    dismissBanked: () => setBanked(null),
  }), [player, spawns, pos, leaderboard, myRank, banked, toast, walkTo, bankEncounter, showToast]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
