import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import {
  INITIAL_PLAYER,
  INITIAL_ZONES,
  ECO_SPIRITS,
  BADGES,
  xpForLevel,
} from '../data/gameData';

const GameContext = createContext(null);

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};

export const GameProvider = ({ children }) => {
  const [player, setPlayer] = useState(INITIAL_PLAYER);
  const [zones, setZones] = useState(INITIAL_ZONES);
  // Transient celebration payload shown in a full-screen overlay.
  const [reward, setReward] = useState(null);
  // Lightweight toast queue.
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, icon = '✅') => {
    setToast({ message, icon, id: Math.round(performance.now()) });
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  const restoredCount = useMemo(
    () => zones.filter((z) => z.status === 'restored').length,
    [zones]
  );

  // Completing a verified mission updates player progress, transforms the zone,
  // and may unlock an Eco Spirit / badge.
  const completeMission = useCallback(
    (zone, options) => {
      const { sorted, breakdown, totalPoints } = options;

      setPlayer((prev) => {
        // XP & level-up handling.
        let xp = prev.xp + Math.round(totalPoints * 0.5);
        let level = prev.level;
        let leveledUp = false;
        while (xp >= xpForLevel(level)) {
          xp -= xpForLevel(level);
          level += 1;
          leveledUp = true;
        }

        const newBadges = [...prev.badges];
        const earnedBadges = [];
        const grant = (id) => {
          if (!newBadges.includes(id)) {
            newBadges.push(id);
            const b = BADGES.find((x) => x.id === id);
            if (b) earnedBadges.push(b);
          }
        };
        if (zone.type === 'Waterway' && zone.cityPriority) grant('river-hero');

        const spirit = ECO_SPIRITS.find(
          (s) => s.unlockZone === zone.id && !prev.spirits.includes(s.id)
        );
        const newSpirits = spirit ? [...prev.spirits, spirit.id] : prev.spirits;

        // Stash celebration details for the overlay (read after state commits).
        window.setTimeout(() => {
          setReward({
            zone,
            totalPoints,
            breakdown,
            leveledUp,
            newLevel: level,
            earnedBadges,
            spirit: spirit || null,
            sorted,
          });
        }, 0);

        return {
          ...prev,
          xp,
          level,
          impactScore: prev.impactScore + totalPoints,
          badges: newBadges,
          spirits: newSpirits,
          lifetime: {
            ...prev.lifetime,
            missions: prev.lifetime.missions + 1,
            spacesRestored: prev.lifetime.spacesRestored + 1,
            pounds: prev.lifetime.pounds + Math.round(zone.basePoints / 18),
            hours: prev.lifetime.hours + Math.round(zone.durationMin / 60 * 10) / 10,
            recycled: prev.lifetime.recycled + (sorted ? Math.round(zone.basePoints / 40) : 0),
          },
        };
      });

      setZones((prev) =>
        prev.map((z) => (z.id === zone.id ? { ...z, status: 'restored' } : z))
      );
    },
    []
  );

  const dismissReward = useCallback(() => setReward(null), []);

  const value = useMemo(
    () => ({
      player,
      zones,
      restoredCount,
      reward,
      toast,
      showToast,
      completeMission,
      dismissReward,
    }),
    [player, zones, restoredCount, reward, toast, showToast, completeMission, dismissReward]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
