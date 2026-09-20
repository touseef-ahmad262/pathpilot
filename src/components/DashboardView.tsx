import React from 'react';
import {
  Compass,
  Flame,
  Award,
  Sparkles,
  Target,
  BarChart3,
  Map,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Zap,
  Calendar,
  Layers,
  Bot,
} from 'lucide-react';
import { UserProfile, RoadmapStage, Mission, GamificationState, Badge } from '../types';
import { computeSkillGaps } from '../utils/analyzer';
import { getXpProgressInLevel } from '../utils/storage';

interface DashboardViewProps {
  profile: UserProfile | null;
  stages: RoadmapStage[];
  missions: Mission[];
  gamification: GamificationState;
  onNavigateToTab: (tab: 'roadmap' | 'analyzer' | 'missions' | 'coach') => void;
  onOpenBadges: () => void;
  onOpenCoachWithPrompt?: (prompt: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  stages,
  missions,
  gamification,
  onNavigateToTab,
  onOpenBadges,
  onOpenCoachWithPrompt,
}) => {
  const analysis = computeSkillGaps(profile, stages, missions);
  const xpInfo = getXpProgressInLevel(gamification.xp);

  const totalTasks = stages.flatMap((s) => s.tasks);
  const completedTasks = totalTasks.filter((t) => t.completed);
  const overallProgress = totalTasks.length > 0 ? Math.round((completedTasks.length / totalTasks.length) * 100) : 0;

  const completedMissionsCount = missions.filter((m) => m.completed).length;

  // Find active stage (first stage with uncompleted tasks)
  const activeStage = stages.find((s) => s.tasks.some((t) => !t.completed)) || stages[0];

  const unlockedBadges = gamification.badges.filter((b) => b.unlocked);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-cyan-500/10 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-800/40">
                Personal Command Center
              </span>
              <span className="text-xs text-slate-400">
                Created: {new Date(profile?.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1 font-['Outfit']">
              Welcome back, {profile?.name || 'Aspiring Developer'}!
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Target Goal:{' '}
              <span className="font-bold text-white underline decoration-cyan-400 underline-offset-2">
                {profile?.goal || 'Web Developer'}
              </span>{' '}
              • Target Timeframe: {profile?.timeframe || '6 months'} ({profile?.hoursPerWeek || 12} hrs/week)
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateToTab('roadmap')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Map className="h-3.5 w-3.5" />
              <span>Resume Roadmap</span>
            </button>
            <button
              onClick={() => onNavigateToTab('coach')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Bot className="h-3.5 w-3.5 text-cyan-400" />
              <span>Ask AI Coach</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Progress */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Roadmap Progress</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white font-mono">{overallProgress}%</div>
            <p className="text-xs text-slate-400 mt-0.5">
              {completedTasks.length} of {totalTasks.length} tasks completed
            </p>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Level & XP */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Level & Total XP</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white font-mono flex items-center gap-2">
              <span>Lvl {gamification.level}</span>
              <span className="text-xs font-normal text-slate-400">({gamification.xp} XP)</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {xpInfo.max - xpInfo.current} XP to Level {gamification.level + 1}
            </p>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                style={{ width: `${xpInfo.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Learning Streak */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Learning Streak</span>
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Flame className="h-4 w-4 fill-orange-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white font-mono flex items-center gap-1.5">
              <span>{gamification.streakDays}</span>
              <span className="text-sm font-normal text-orange-400">Days Strong</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Keep learning daily to maintain streak</p>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div
                  key={day}
                  className={`h-2 flex-1 rounded-full ${
                    day <= Math.min(7, gamification.streakDays)
                      ? 'bg-orange-400'
                      : 'bg-slate-800'
                  }`}
                  title={`Day ${day}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Completed Missions */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Missions Completed</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white font-mono">
              {completedMissionsCount} / {missions.length}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Practical portfolio code projects
            </p>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    missions.length > 0 ? (completedMissionsCount / missions.length) * 100 : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Current Stage & Next Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Active Stage & Next Action */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Recommended Action Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 border border-cyan-500/30 shadow-lg shadow-cyan-950/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 fill-cyan-400" /> Next Recommended Action
                </span>
                <h3 className="text-lg font-bold text-white">
                  {analysis.nextRecommendedAction.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  {analysis.nextRecommendedAction.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (analysis.nextRecommendedAction.actionType === 'mission') {
                    onNavigateToTab('missions');
                  } else {
                    onNavigateToTab('roadmap');
                  }
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Take Action</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Current Active Roadmap Stage */}
          {activeStage && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Current Focus Phase
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {activeStage.phaseTitle}: {activeStage.title}
                  </h3>
                </div>
                <button
                  onClick={() => onNavigateToTab('roadmap')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                >
                  <span>Open Stage</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <p className="text-xs text-slate-300">{activeStage.description}</p>

              {/* Stage Tasks Snapshot */}
              <div className="space-y-2 pt-1">
                {activeStage.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                      task.completed
                        ? 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                        : 'bg-slate-950 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {task.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
                      )}
                      <span className={`truncate ${task.completed ? 'line-through' : 'font-medium'}`}>
                        {task.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono shrink-0">
                      {task.estimatedMinutes}m
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Skill Gaps Snapshot & Achievements */}
        <div className="space-y-6">
          {/* Skill Gaps Snapshot */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Skill Gaps Overview
              </h3>
              <button
                onClick={() => onNavigateToTab('analyzer')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                View Analyzer
              </button>
            </div>

            <div className="space-y-3">
              {analysis.skills.slice(0, 4).map((skill) => (
                <div key={skill.skill} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200 truncate max-w-[140px]">
                      {skill.skill}
                    </span>
                    <span className="font-mono text-slate-400">
                      {skill.currentLevel}% / {skill.requiredLevel}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        skill.isPrimaryGap
                          ? 'bg-amber-400'
                          : skill.currentLevel >= skill.requiredLevel
                          ? 'bg-emerald-400'
                          : 'bg-cyan-400'
                      }`}
                      style={{ width: `${skill.currentLevel}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {analysis.primaryGap && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2 mt-2">
                <span className="font-bold shrink-0">Top Priority:</span>
                <span>Focus on {analysis.primaryGap.skill} to build maximum learning momentum.</span>
              </div>
            )}
          </div>

          {/* Badges & Achievements */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-400" />
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  Badges ({unlockedBadges.length}/{gamification.badges.length})
                </h3>
              </div>
              <button
                onClick={onOpenBadges}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                All Badges
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {gamification.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center transition-all ${
                    badge.unlocked
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-600 opacity-50'
                  }`}
                  title={`${badge.title}: ${badge.description}`}
                >
                  <Award className={`h-5 w-5 ${badge.unlocked ? 'text-amber-400' : 'text-slate-600'}`} />
                  <span className="text-[10px] font-semibold mt-1 truncate max-w-[70px]">
                    {badge.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
