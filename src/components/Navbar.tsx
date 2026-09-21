import React, { useState } from 'react';
import {
  Compass,
  Flame,
  Award,
  Sparkles,
  Map,
  BarChart3,
  Target,
  LayoutDashboard,
  Bot,
  PlayCircle,
  RotateCcw,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { UserProfile, GamificationState } from '../types';
import { getXpProgressInLevel } from '../utils/storage';

export type ActiveTab = 'roadmap' | 'analyzer' | 'missions' | 'dashboard' | 'coach';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: UserProfile | null;
  gamification: GamificationState;
  onOpenDemo: () => void;
  onReset: () => void;
  onOpenOnboarding: () => void;
  onOpenBadges: () => void;
  isDemo: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  gamification,
  onOpenDemo,
  onReset,
  onOpenOnboarding,
  onOpenBadges,
  isDemo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const xpInfo = getXpProgressInLevel(gamification.xp);
  const unlockedBadgesCount = gamification.badges.filter((b) => b.unlocked).length;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Logo & Wordmark */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-0.5 sm:p-1 min-w-0"
              title="Go to Dashboard"
            >
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
                <Compass className="h-4 w-4 sm:h-5 sm:w-5 text-white animate-spin-slow" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-['Outfit']">
                    Path<span className="text-cyan-400">Pilot</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-semibold px-1 sm:px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 tracking-wider">
                    v1.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block truncate max-w-[200px] lg:max-w-xs">
                  Turn goal into path. Path into progress.
                </p>
              </div>
            </button>

            {/* Active Profile Goal Indicator */}
            {profile ? (
              <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-800 text-xs">
                <span className="text-slate-400">Goal:</span>
                <span className="font-semibold text-slate-200 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/60 truncate max-w-[140px] xl:max-w-[200px]">
                  {profile.goal}
                </span>
                {isDemo && (
                  <span className="text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-md shrink-0">
                    Demo Mode
                  </span>
                )}
              </div>
            ) : null}
          </div>

          {/* Navigation Tabs (Desktop & Large Tablet) */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'roadmap'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Map className="h-3.5 w-3.5" />
              <span>Roadmap</span>
            </button>

            <button
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative ${
                activeTab === 'analyzer'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Skill Gaps</span>
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 absolute top-1 right-1"></span>
            </button>

            <button
              onClick={() => setActiveTab('missions')}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'missions'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Target className="h-3.5 w-3.5" />
              <span>Missions</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('coach')}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'coach'
                  ? 'bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-cyan-300 hover:text-cyan-200 hover:bg-slate-800'
              }`}
            >
              <Bot className="h-3.5 w-3.5" />
              <span>AI Coach</span>
            </button>
          </nav>

          {/* Gamification Stats & Quick Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Streak Counter */}
            <div
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold"
              title={`${gamification.streakDays} Day Learning Streak`}
            >
              <Flame className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
              <span>{gamification.streakDays}d</span>
            </div>

            {/* Level & XP Pill */}
            <button
              onClick={onOpenBadges}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition-colors"
              title="Click to view Achievements & Badges"
            >
              <div className="flex items-center gap-1 font-semibold text-cyan-400">
                <Sparkles className="h-3 w-3" />
                <span>Lvl {gamification.level}</span>
              </div>
              <div className="hidden sm:block text-[11px] text-slate-400">
                {gamification.xp} XP
              </div>
              <div className="hidden xs:flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-[10px] text-amber-300 font-bold">
                  {unlockedBadgesCount}
                </span>
              </div>
            </button>

            {/* Try Demo Button (Prominent for Judges) */}
            <button
              onClick={onOpenDemo}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-md shadow-emerald-500/15 transition-all active:scale-95 shrink-0"
              title="Load realistic sample Web Developer profile for Hackathon Judges"
            >
              <PlayCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Try</span> Demo
            </button>

            {/* Reset / Onboarding Trigger */}
            <div className="relative shrink-0">
              <button
                onClick={onReset}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors"
                title="Reset or New Roadmap"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1.5 border-t border-slate-800/80 no-scrollbar touch-pan-x">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors min-h-[36px] ${
              activeTab === 'roadmap' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 bg-slate-900/60 border border-slate-800/60'
            }`}
          >
            <Map className="h-3.5 w-3.5" /> Roadmap
          </button>
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors min-h-[36px] ${
              activeTab === 'analyzer' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 bg-slate-900/60 border border-slate-800/60'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" /> Skill Gaps
          </button>
          <button
            onClick={() => setActiveTab('missions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors min-h-[36px] ${
              activeTab === 'missions' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 bg-slate-900/60 border border-slate-800/60'
            }`}
          >
            <Target className="h-3.5 w-3.5" /> Missions
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors min-h-[36px] ${
              activeTab === 'dashboard' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 bg-slate-900/60 border border-slate-800/60'
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('coach')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors min-h-[36px] ${
              activeTab === 'coach' ? 'bg-indigo-500 text-white font-bold shadow-sm' : 'text-cyan-400 bg-slate-900/60 border border-slate-800/60'
            }`}
          >
            <Bot className="h-3.5 w-3.5" /> AI Coach
          </button>
        </div>
      </div>
    </header>
  );
};
