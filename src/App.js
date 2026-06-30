import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { CITY } from './data/gameData';
import BottomNav from './components/BottomNav';
import ARCleanupSession from './components/ARCleanupSession';
import RewardOverlay from './components/RewardOverlay';
import Toast from './components/Toast';
import MapScreen from './screens/MapScreen';
import QuestsScreen from './screens/QuestsScreen';
import CrewScreen from './screens/CrewScreen';
import EventsScreen from './screens/EventsScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import { Leaf, Flame, Zap } from 'lucide-react';

const TITLES = {
  map: 'Explore',
  quests: 'Quests',
  crew: 'Crew',
  events: 'Events & City',
  dashboard: 'Impact',
  profile: 'Your Profile',
};

const TopBar = () => {
  const { player } = useGame();
  return (
    <div className="sticky top-0 z-20 px-4 pt-4 pb-3 bg-gradient-to-b from-grime-900/95 to-grime-900/70 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center h-9 w-9 rounded-2xl bg-gradient-to-br from-quest-400 to-ocean-500 shadow-glow">
            <Leaf className="h-5 w-5 text-grime-900" strokeWidth={2.6} />
          </span>
          <div className="leading-none">
            <p className="text-white font-black text-base tracking-tight">CleanQuest</p>
            <p className="text-white/40 text-[10px] font-semibold">{CITY.name} · {CITY.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="glass rounded-full px-2.5 py-1.5 flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-sun-400" />
            <span className="text-white font-bold text-xs">{player.streak}</span>
          </span>
          <span className="glass rounded-full px-2.5 py-1.5 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-quest-300" />
            <span className="text-white font-bold text-xs">{player.impactScore.toLocaleString()}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

const Shell = () => {
  const [tab, setTab] = useState('map');
  const [activeZone, setActiveZone] = useState(null);
  const { player } = useGame();

  const startMission = (zone) => {
    if (zone.status === 'restored') return;
    setActiveZone(zone);
  };

  return (
    <div className="min-h-full w-full flex items-stretch sm:items-center justify-center sm:py-6">
      {/* Phone frame */}
      <div className="relative w-full sm:max-w-[440px] sm:rounded-[40px] overflow-hidden bg-grime-900 sm:ring-1 sm:ring-white/10 sm:shadow-2xl">
        <div className="relative h-[100dvh] sm:h-[860px] sm:max-h-[90vh] flex flex-col">
          <TopBar />
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <div className="px-4 pt-1">
              <h1 className="sr-only">{TITLES[tab]}</h1>
            </div>
            {tab === 'map' && <MapScreen onSelectZone={startMission} />}
            {tab === 'quests' && <QuestsScreen onSelectZone={startMission} />}
            {tab === 'crew' && <CrewScreen />}
            {tab === 'events' && <EventsScreen />}
            {tab === 'dashboard' && <DashboardScreen />}
            {tab === 'profile' && <ProfileScreen />}
          </div>

          <BottomNav
            active={tab}
            onChange={setTab}
            onProfile={() => setTab('profile')}
            avatar={player.avatar}
          />
        </div>

        {/* Overlays scoped to the phone frame */}
        {activeZone && <ARCleanupSession zone={activeZone} onClose={() => setActiveZone(null)} />}
        <RewardOverlay />
        <Toast />
      </div>
    </div>
  );
};

const App = () => (
  <GameProvider>
    <Shell />
  </GameProvider>
);

export default App;
