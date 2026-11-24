import React, { useState } from 'react';
import { GameProvider } from './game/GameState';
import ARWorld from './screens/ARWorld';
import Leaderboard from './screens/Leaderboard';
import Profile from './screens/Profile';
import Today from './screens/Today';
import Trashdex from './screens/Trashdex';
import BankedOverlay from './ui/BankedOverlay';
import FairPlay from './ui/FairPlay';
import Onboarding from './ui/Onboarding';

const INTRO_KEY = 'cq_intro_v1';
const seenIntro = () => {
  try { return window.localStorage.getItem(INTRO_KEY) === '1'; } catch { return true; }
};

// CleanQuest — AR-first: the live camera is the home screen. A PiP mini-map
// guides you to litter zones and golden rewards; sheets slide over the feed.
const App = () => {
  const [sheet, setSheet] = useState(null); // leaderboard | profile | today | dex | fairplay
  const [intro, setIntro] = useState(() => !seenIntro());
  const finishIntro = () => {
    try { window.localStorage.setItem(INTRO_KEY, '1'); } catch { /* no-op */ }
    setIntro(false);
  };

  return (
    <GameProvider>
      <div className="min-h-full w-full flex items-stretch sm:items-center justify-center sm:py-6">
        <div className="relative w-full sm:max-w-[440px] h-[100dvh] sm:h-[860px] sm:max-h-[92vh] sm:rounded-[40px] overflow-hidden bg-grime-900 sm:ring-1 sm:ring-white/10 sm:shadow-2xl">
          <ARWorld onSheet={setSheet} />

          {sheet === 'leaderboard' && <Leaderboard onClose={() => setSheet(null)} />}
          {sheet === 'profile' && <Profile onClose={() => setSheet(null)} />}
          {sheet === 'fairplay' && <FairPlay onClose={() => setSheet(null)} />}
          {sheet === 'today' && <Today onClose={() => setSheet(null)} />}
          {sheet === 'dex' && <Trashdex onClose={() => setSheet(null)} />}

          <BankedOverlay />

          {intro && <Onboarding onDone={finishIntro} />}
        </div>
      </div>
    </GameProvider>
  );
};

export default App;
