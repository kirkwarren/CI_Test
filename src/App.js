import React, { useState } from 'react';
import { GameProvider } from './game/GameState';
import MapHome from './screens/MapHome';
import Encounter from './screens/Encounter';
import Leaderboard from './screens/Leaderboard';
import Profile from './screens/Profile';
import Today from './screens/Today';
import Trashdex from './screens/Trashdex';
import BankedOverlay from './ui/BankedOverlay';
import FairPlay from './ui/FairPlay';

// CleanQuest — a Pokémon-Go-style AR game for picking up litter.
// Home is the map; encounters are live-camera AR; points bank to a leaderboard.
const App = () => {
  const [encounter, setEncounter] = useState(null); // spawn being cleaned
  const [sheet, setSheet] = useState(null); // 'leaderboard' | 'profile' | 'fairplay'

  return (
    <GameProvider>
      <div className="min-h-full w-full flex items-stretch sm:items-center justify-center sm:py-6">
        {/* phone frame */}
        <div className="relative w-full sm:max-w-[440px] h-[100dvh] sm:h-[860px] sm:max-h-[92vh] sm:rounded-[40px] overflow-hidden bg-grime-900 sm:ring-1 sm:ring-white/10 sm:shadow-2xl">
          <MapHome
            onEncounter={setEncounter}
            onLeaderboard={() => setSheet('leaderboard')}
            onProfile={() => setSheet('profile')}
            onFairPlay={() => setSheet('fairplay')}
            onToday={() => setSheet('today')}
            onDex={() => setSheet('dex')}
          />

          {encounter && (
            <Encounter spawn={encounter} onClose={() => setEncounter(null)} onFairPlay={() => setSheet('fairplay')} />
          )}

          {sheet === 'leaderboard' && <Leaderboard onClose={() => setSheet(null)} />}
          {sheet === 'profile' && <Profile onClose={() => setSheet(null)} />}
          {sheet === 'fairplay' && <FairPlay onClose={() => setSheet(null)} />}
          {sheet === 'today' && <Today onClose={() => setSheet(null)} />}
          {sheet === 'dex' && <Trashdex onClose={() => setSheet(null)} />}

          <BankedOverlay />
        </div>
      </div>
    </GameProvider>
  );
};

export default App;
