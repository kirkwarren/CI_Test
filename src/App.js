// GlowUp — "Restore your world."
// A location-based augmented-reality game that turns real-world cleanup into a
// competitive, cooperative, visually magical experience.
//
// This is a product prototype: a self-contained, mobile-first React app that
// demonstrates the full core loop — discover Fade Zones on a living map, run an
// immersive AR cleanup mission, pass multi-signal verification, watch the world
// restore, collect place-tied guardians, climb crew leaderboards, join a live
// event with shared AR progression, and track real civic impact.

import React, { useState } from 'react';
import { Flame, Zap } from 'lucide-react';
import { GameProvider, useGame, selectLevel } from './game/state';
import BottomNav from './components/BottomNav';
import { ProgressBar, glow } from './components/ui';

import MapScreen from './screens/MapScreen';
import MissionFlow from './screens/MissionFlow';
import CollectionScreen from './screens/CollectionScreen';
import CrewScreen from './screens/CrewScreen';
import ImpactScreen from './screens/ImpactScreen';
import EventScreen from './screens/EventScreen';
import ProfileScreen from './screens/ProfileScreen';

function PlayerBar() {
  const { state } = useGame();
  const { level, pct, toNext } = selectLevel(state);
  const g = glow('emerald');
  return (
    <header className="px-4 pt-3 pb-2 bg-gradient-to-b from-slate-900 to-transparent">
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${g.from} ${g.to} flex items-center justify-center text-slate-950 font-bold ${g.glowShadow}`}>
            {level}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Level {level}</span>
            <span className="text-[11px] text-slate-400">{toNext} XP to next</span>
          </div>
          <ProgressBar value={pct * 100} className="mt-1" />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 text-amber-300" title="Cleanup streak">
            <Flame size={16} />
            <span className="text-sm font-bold">{state.player.streakDays}</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-300" title="Glow Points">
            <Zap size={16} />
            <span className="text-sm font-bold">{state.player.glowPoints.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function Shell() {
  const [tab, setTab] = useState('map');
  const [missionZoneId, setMissionZoneId] = useState(null);
  const [showEvent, setShowEvent] = useState(false);

  // Full-screen overlays take over the whole frame.
  if (missionZoneId) {
    return <MissionFlow zoneId={missionZoneId} onClose={() => setMissionZoneId(null)} />;
  }
  if (showEvent) {
    return (
      <EventScreen
        onClose={() => setShowEvent(false)}
        onStartMission={(zoneId) => {
          setShowEvent(false);
          setMissionZoneId(zoneId);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PlayerBar />
      <main className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6">
        {tab === 'map' && (
          <MapScreen onStartMission={setMissionZoneId} onOpenEvent={() => setShowEvent(true)} />
        )}
        {tab === 'collection' && <CollectionScreen />}
        {tab === 'crew' && <CrewScreen onOpenEvent={() => setShowEvent(true)} />}
        {tab === 'impact' && <ImpactScreen />}
        {tab === 'profile' && <ProfileScreen />}
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

// The phone frame — keeps the experience feeling like a mobile AR app even on
// a wide desktop browser.
function PhoneFrame({ children }) {
  return (
    <div className="min-h-full w-full bg-slate-950 text-slate-100 flex items-stretch justify-center">
      {/* Ambient backdrop glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md h-screen bg-slate-950/60 sm:border-x border-white/10 shadow-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <PhoneFrame>
        <Shell />
      </PhoneFrame>
    </GameProvider>
  );
}
