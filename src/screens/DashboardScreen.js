import React from 'react';
import { AreaTrend, Donut } from '../components/Charts';
import { Card, StatTile, cx } from '../components/ui';
import { CITY, CITY_IMPACT, CREW_LEADERBOARD, NEIGHBORHOOD_LEADERBOARD } from '../data/gameData';
import {
  Scale, ShoppingBag, Sparkles, Clock, CheckCircle2, Route, Recycle, Users2, Building2, HeartHandshake,
} from 'lucide-react';

const PIE_COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#a78bfa', '#64748b'];

const DashboardScreen = () => {
  const d = CITY_IMPACT;
  return (
    <div className="px-4 pb-28 pt-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="h-2 w-2 rounded-full bg-quest-400 animate-pulseGlow" />
        <p className="text-quest-300 text-[11px] font-bold uppercase tracking-widest">Live · public dashboard</p>
      </div>
      <h1 className="text-white font-black text-2xl tracking-tight">{CITY.name} impact</h1>
      <p className="text-white/45 text-sm">Pilot to date · verified cleanups only</p>

      {/* Hero pounds */}
      <div className="mt-4 rounded-[28px] p-[1.5px] bg-gradient-to-r from-quest-400 to-ocean-500">
        <div className="rounded-[26px] bg-grime-900 px-5 py-5 text-center">
          <p className="text-white/50 text-xs font-semibold uppercase tracking-wide">Pounds of litter removed</p>
          <p className="text-white font-black text-5xl tracking-tight mt-1">{d.pounds.toLocaleString()}</p>
          <p className="text-quest-300 text-xs font-semibold mt-1">≈ {d.pieces.toLocaleString()} pieces of litter</p>
        </div>
      </div>

      {/* Stat grid */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <StatTile label="Bags collected" value={d.bags.toLocaleString()} icon={<ShoppingBag className="h-5 w-5" />} />
        <StatTile label="Volunteer hrs" value={d.hours.toLocaleString()} icon={<Clock className="h-5 w-5" />} accent="text-ocean-400" />
        <StatTile label="Cleanups" value={d.cleanups.toLocaleString()} icon={<CheckCircle2 className="h-5 w-5" />} accent="text-sun-400" />
        <StatTile label="Miles restored" value={d.milesRestored} icon={<Route className="h-5 w-5" />} accent="text-ocean-400" />
        <StatTile label="Recycled (lbs)" value={d.recyclingDiverted.toLocaleString()} icon={<Recycle className="h-5 w-5" />} />
        <StatTile label="Active players" value={d.activePlayers.toLocaleString()} icon={<Users2 className="h-5 w-5" />} accent="text-fuchsia-400" />
      </div>

      {/* Trend chart */}
      <Card className="mt-4">
        <p className="text-white font-bold text-sm mb-1">Pounds removed per week</p>
        <p className="text-white/40 text-[11px] mb-3">Steady week-over-week growth across the pilot</p>
        <AreaTrend data={d.trend} height={150} />
        <div className="flex justify-between mt-1 text-[11px]">
          <span className="text-white/40">Peak week</span>
          <span className="text-quest-300 font-bold">{Math.max(...d.trend.map((t) => t.pounds)).toLocaleString()} lbs</span>
        </div>
      </Card>

      {/* Composition + sponsor impact */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Card>
          <p className="text-white font-bold text-sm mb-2">Litter mix</p>
          <div className="py-1">
            <Donut data={d.byCategory} colors={PIE_COLORS} size={118} />
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {d.byCategory.map((c, i) => (
              <span key={c.name} className="flex items-center gap-1 text-[10px] text-white/55">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} /> {c.name}
              </span>
            ))}
          </div>
        </Card>

        <div className="space-y-3">
          <Card className="bg-gradient-to-br from-sun-500/12 to-quest-500/8 ring-sun-400/20">
            <HeartHandshake className="h-6 w-6 text-sun-400" />
            <p className="text-white font-black text-2xl mt-1">${d.donationsUnlocked.toLocaleString()}</p>
            <p className="text-white/50 text-[11px]">Donations unlocked for schools & nonprofits</p>
          </Card>
          <Card>
            <Building2 className="h-6 w-6 text-ocean-400" />
            <p className="text-white font-black text-2xl mt-1">{d.sponsoredMissions}</p>
            <p className="text-white/50 text-[11px]">City-sponsored missions completed</p>
          </Card>
        </div>
      </div>

      {/* Top crews + neighborhoods */}
      <Card className="mt-4">
        <p className="text-white font-bold text-sm mb-3">Top crews this season</p>
        <div className="space-y-2.5">
          {CREW_LEADERBOARD.slice(0, 3).map((c) => (
            <div key={c.name} className="flex items-center gap-3">
              <span className={cx('font-black text-sm w-4', c.rank === 1 ? 'text-sun-400' : 'text-white/50')}>{c.rank}</span>
              <span className="text-lg">{c.icon}</span>
              <span className={cx('flex-1 text-sm font-bold', c.you ? 'text-quest-300' : 'text-white/85')}>{c.name}</span>
              <span className="text-white/60 text-sm font-bold">{c.impact.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-white/8">
          <p className="text-white font-bold text-sm mb-3">Most improved neighborhoods</p>
          <div className="space-y-2.5">
            {NEIGHBORHOOD_LEADERBOARD.slice(0, 3).map((n) => (
              <div key={n.name} className="flex items-center gap-3">
                <span className={cx('font-black text-sm w-4', n.rank === 1 ? 'text-sun-400' : 'text-white/50')}>{n.rank}</span>
                <Sparkles className="h-4 w-4 text-quest-300" />
                <span className={cx('flex-1 text-sm font-bold', n.you ? 'text-quest-300' : 'text-white/85')}>{n.name}</span>
                <span className="text-white/60 text-sm font-bold">{n.score}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="mt-4 flex items-center gap-2 justify-center text-white/30 text-[11px]">
        <Scale className="h-3.5 w-3.5" /> Weight tracked as an environmental metric — capped in competitive scoring.
      </div>
    </div>
  );
};

export default DashboardScreen;
