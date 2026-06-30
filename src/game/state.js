// GlowUp — live game state: a reducer + React context with localStorage
// persistence so the "shared, persistent world" feeling survives refreshes.

import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { ZONES, CREATURES, EVENT, PLAYER_CREW_ID } from './data';

const STORAGE_KEY = 'glowup.save.v1';

// Level curve: each level needs a bit more than the last (quadratic-ish).
export function levelForXp(xp) {
  return Math.max(1, Math.floor(Math.sqrt(xp / 250)) + 1);
}
export function xpForLevel(level) {
  return Math.pow(level - 1, 2) * 250;
}

// Per-zone glow: 10 levels, each ~one verified contribution of restoredPct.
const PCT_PER_LEVEL = 100;
export function glowLevelFor(restoredPct) {
  return Math.min(10, Math.floor(restoredPct / PCT_PER_LEVEL) + (restoredPct > 0 ? 0 : 0));
}

function initialZones() {
  const map = {};
  for (const z of ZONES) {
    map[z.id] = {
      id: z.id,
      restoredPct: 0, // accumulates; every PCT_PER_LEVEL raises the glow level
      glowLevel: 0,
      status: 'faded', // faded | restoring | restored
      contributors: [], // player names who helped
      lastTurn: null,
    };
  }
  return map;
}

export function freshState() {
  return {
    player: {
      name: 'You',
      handle: '@you',
      xp: 0,
      glowPoints: 0, // spendable points (impact score accrues here)
      trustScore: 0.7, // private 0..1, improves with reliable behavior
      streakDays: 1,
      missionsCompleted: 0,
      piecesCollected: 0,
      poundsRemoved: 0,
      volunteerHours: 0,
      recycledItems: 0,
      hazardsReported: 0,
      locationsRestored: 0,
      glowZonesActivated: 0,
      heldForReview: 0, // missions whose rewards are pending review
    },
    zones: initialZones(),
    collection: {}, // creatureId -> { unlockedAtZone, when }
    badges: [],
    feed: [], // recent activity "echoes"
    crewWeeklyBonus: 0, // points the player has personally added to the crew
    event: {
      joined: false,
      team: null, // 'sunrise' | 'tidewater'
      personalLbs: 0,
      cityLbs: EVENT.startCityLbs,
    },
    redeemed: [], // reward ids
    settings: { youthMode: false },
    version: 1,
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw);
    // Shallow-merge so new fields in code don't break old saves.
    const base = freshState();
    return {
      ...base,
      ...parsed,
      player: { ...base.player, ...(parsed.player || {}) },
      zones: { ...base.zones, ...(parsed.zones || {}) },
      event: { ...base.event, ...(parsed.event || {}) },
      settings: { ...base.settings, ...(parsed.settings || {}) },
    };
  } catch {
    return freshState();
  }
}

// ---- Badge rules -----------------------------------------------------------
const BADGE_RULES = [
  { id: 'first-glow', label: 'First Glow', emoji: '✨', when: (p) => p.missionsCompleted >= 1 },
  { id: 'streak-5', label: '5-Day Streak', emoji: '🔥', when: (p) => p.streakDays >= 5 },
  { id: 'restorer-5', label: 'Restorer', emoji: '🌳', when: (p) => p.locationsRestored >= 5 },
  { id: 'recycler-25', label: 'Recycler', emoji: '♻️', when: (p) => p.recycledItems >= 25 },
  { id: 'guardian-of-the-watch', label: 'Hazard Watch', emoji: '🚨', when: (p) => p.hazardsReported >= 1 },
  { id: 'hundred-lbs', label: '100 lb Club', emoji: '💪', when: (p) => p.poundsRemoved >= 100 },
];

function recomputeBadges(player, existing) {
  const have = new Set(existing.map((b) => b.id));
  const next = [...existing];
  for (const rule of BADGE_RULES) {
    if (!have.has(rule.id) && rule.when(player)) {
      next.push({ id: rule.id, label: rule.label, emoji: rule.emoji });
    }
  }
  return next;
}

// Decide which creatures a player has now earned, given the action context.
function unlockCreatures(state) {
  const unlocked = { ...state.collection };
  const add = (id, atZone) => {
    if (!unlocked[id]) unlocked[id] = { unlockedAtZone: atZone || null, when: Date.now() };
  };

  const restoredByType = {};
  let parksRestored = 0;
  for (const z of ZONES) {
    const live = state.zones[z.id];
    if (!live) continue;
    if (live.restoredPct > 0) restoredByType[z.type] = (restoredByType[z.type] || 0) + 1;
    if (z.type === 'park' && live.status === 'restored') parksRestored += 1;
  }

  // Place-tied unlocks.
  for (const z of ZONES) {
    const live = state.zones[z.id];
    if (!live || live.restoredPct <= 0) continue;
    const c = CREATURES[z.guardian];
    if (!c) continue;
    if (z.type === 'creek' || z.type === 'beach') {
      if (live.glowLevel >= 2) add(c.id, z.id); // rare guardians want Glow Level 2
    } else {
      add(c.id, z.id);
    }
    // Beach/creek shore guardians also award on first restore for their type.
    if (z.type === 'beach') add('tideling', z.id);
  }

  // Behavior-tied unlocks.
  if (state.player.recycledItems >= 25) add('pollin');
  if (parksRestored >= 3) add('verdania');

  return unlocked;
}

function pushFeed(feed, entry) {
  return [{ ...entry, t: Date.now() }, ...feed].slice(0, 20);
}

// ---- Reducer ---------------------------------------------------------------
function reducer(state, action) {
  switch (action.type) {
    case 'COMPLETE_MISSION': {
      // payload: { zoneId, tier, points, pieces, pounds, minutes, recycled,
      //            inEvent, held }
      const p = action.payload;
      const zone = state.zones[p.zoneId];
      const heldForReview = p.tier === 'REVIEW';

      // Player stat updates.
      const player = { ...state.player };
      player.missionsCompleted += 1;
      player.piecesCollected += p.pieces;
      player.recycledItems += p.recycled || 0;
      player.volunteerHours = Math.round((player.volunteerHours + p.minutes / 60) * 10) / 10;
      player.poundsRemoved = Math.round((player.poundsRemoved + p.pounds) * 10) / 10;

      if (heldForReview) {
        player.heldForReview += 1;
        // Trust dips slightly but recovers; no points awarded yet.
        player.trustScore = Math.max(0.2, Math.round((player.trustScore - 0.05) * 100) / 100);
      } else {
        player.glowPoints += p.points;
        player.xp += p.points;
        // Reliable behavior nudges trust upward over time.
        player.trustScore = Math.min(1, Math.round((player.trustScore + 0.02) * 100) / 100);
      }

      // Zone restoration updates (only on verified, non-review cleanups).
      const zones = { ...state.zones };
      let newlyRestored = false;
      if (zone && !heldForReview) {
        const restoredPct = Math.min(1000, zone.restoredPct + Math.max(40, Math.round(p.points / 10)));
        const glowLevel = glowLevelFor(restoredPct);
        const wasRestored = zone.status === 'restored';
        const status = restoredPct >= PCT_PER_LEVEL ? 'restored' : 'restoring';
        newlyRestored = status === 'restored' && !wasRestored;
        const contributors = zone.contributors.includes(player.name)
          ? zone.contributors
          : [...zone.contributors, player.name];
        zones[p.zoneId] = { ...zone, restoredPct, glowLevel, status, contributors, lastTurn: Date.now() };
        if (newlyRestored) {
          player.locationsRestored += 1;
          player.glowZonesActivated += 1;
        }
      }

      let next = { ...state, player, zones };

      // Event contribution.
      if (p.inEvent && state.event.joined && !heldForReview) {
        next = {
          ...next,
          event: {
            ...state.event,
            personalLbs: Math.round((state.event.personalLbs + p.pounds) * 10) / 10,
            cityLbs: Math.round((state.event.cityLbs + p.pounds) * 10) / 10,
          },
        };
      }

      // Crew contribution + collectibles + badges + feed.
      next.crewWeeklyBonus = state.crewWeeklyBonus + (heldForReview ? 0 : p.points);
      next.collection = unlockCreatures(next);
      next.badges = recomputeBadges(next.player, state.badges);
      next.feed = pushFeed(state.feed, {
        kind: 'mission',
        text: heldForReview
          ? `Cleanup at ${zoneName(p.zoneId)} submitted — held for quick review.`
          : `Restored ${zoneName(p.zoneId)} (+${p.points} pts, ${p.pounds} lb).`,
      });
      return next;
    }

    case 'REPORT_HAZARD': {
      const player = {
        ...state.player,
        hazardsReported: state.player.hazardsReported + 1,
        glowPoints: state.player.glowPoints + 75,
        xp: state.player.xp + 75,
        trustScore: Math.min(1, Math.round((state.player.trustScore + 0.01) * 100) / 100),
      };
      const next = { ...state, player };
      next.badges = recomputeBadges(player, state.badges);
      next.feed = pushFeed(state.feed, {
        kind: 'hazard',
        text: `Reported a hazard (${action.payload?.kind || 'unsafe waste'}) to the city. +75 pts for keeping it safe.`,
      });
      return next;
    }

    case 'JOIN_EVENT': {
      return {
        ...state,
        event: { ...state.event, joined: true, team: action.payload.team },
        feed: pushFeed(state.feed, { kind: 'event', text: `Checked in to ${EVENT.name} with ${action.payload.teamName}.` }),
      };
    }

    case 'REDEEM_REWARD': {
      const r = action.payload;
      if (state.player.glowPoints < r.cost || state.redeemed.includes(r.id)) return state;
      return {
        ...state,
        player: { ...state.player, glowPoints: state.player.glowPoints - r.cost },
        redeemed: [...state.redeemed, r.id],
        feed: pushFeed(state.feed, { kind: 'reward', text: `Redeemed “${r.name}” for ${r.cost} pts.` }),
      };
    }

    case 'TOGGLE_YOUTH_MODE':
      return { ...state, settings: { ...state.settings, youthMode: !state.settings.youthMode } };

    case 'RESET':
      return freshState();

    default:
      return state;
  }
}

function zoneName(zoneId) {
  const z = ZONES.find((z) => z.id === zoneId);
  return z ? z.name : 'a Fade Zone';
}

// ---- Context ---------------------------------------------------------------
const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable — non-fatal for a prototype */
    }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
}

// Selector helpers used across screens.
export function selectLevel(state) {
  const level = levelForXp(state.player.xp);
  const curBase = xpForLevel(level);
  const nextBase = xpForLevel(level + 1);
  const into = state.player.xp - curBase;
  const span = Math.max(1, nextBase - curBase);
  return { level, pct: Math.min(1, into / span), toNext: Math.max(0, nextBase - state.player.xp) };
}

export { PLAYER_CREW_ID, PCT_PER_LEVEL };
