import React from 'react';
import {
  BarChart3,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Target,
  ShieldCheck,
  Zap,
  BookOpen,
  Layers,
} from 'lucide-react';
import { UserProfile, RoadmapStage, Mission } from '../types';
import { computeSkillGaps } from '../utils/analyzer';

interface SkillGapAnalyzerProps {
  profile: UserProfile | null;
  stages: RoadmapStage[];
  missions: Mission[];
  onNavigateToTab: (tab: 'roadmap' | 'missions' | 'coach') => void;
  onOpenCoachWithPrompt?: (prompt: string) => void;
}

export const SkillGapAnalyzer: React.FC<SkillGapAnalyzerProps> = ({
  profile,
  stages,
  missions,
  onNavigateToTab,
  onOpenCoachWithPrompt,
}) => {
  const analysis = computeSkillGaps(profile, stages, missions);
  const { skills, primaryGap, overallReadiness, summaryInsight, nextRecommendedAction } = analysis;

  const categoryColor: Record<string, { badge: string; text: string; bg: string }> = {
    foundational: {
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500',
    },
    core: {
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      text: 'text-cyan-400',
      bg: 'bg-cyan-500',
    },
    workflow: {
      badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      text: 'text-indigo-400',
      bg: 'bg-indigo-500',
    },
    practical: {
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      text: 'text-amber-400',
      bg: 'bg-amber-500',
    },
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-800/40">
                Signature Feature
              </span>
              <span className="text-xs text-slate-400">
                Target: {profile?.goal || 'Web Developer'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1.5 font-['Outfit']">
              Skill Gap Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              PathPilot compares your current experience and verified project completions against the industry-standard baseline for {profile?.goal || 'your target role'}.
            </p>
          </div>

          {/* Readiness Gauge */}
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 bg-slate-950/80 p-3.5 sm:p-4 rounded-xl border border-slate-800 w-full sm:w-auto shrink-0">
            <div className="text-left sm:text-right">
              <div className="text-xs text-slate-400">Target Readiness</div>
              <div className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono">
                {overallReadiness}%
              </div>
              <div className="text-[11px] text-slate-400">Calculated from Roadmap</div>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Insight Summary Callout */}
        <div className="mt-5 p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {summaryInsight}
          </div>
        </div>
      </div>

      {/* Primary Skill Gap Spotlight */}
      {primaryGap && (
        <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 shadow-lg shadow-amber-950/10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3 sm:gap-3.5">
              <div className="p-2.5 sm:p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Primary Current Skill Gap
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {primaryGap.gapPercentage}% Gap Remaining
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  {primaryGap.skill} ({primaryGap.currentLevel}% of {primaryGap.requiredLevel}%)
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed max-w-2xl">
                  {primaryGap.recommendation}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 w-full sm:w-auto">
              {onOpenCoachWithPrompt && (
                <button
                  type="button"
                  onClick={() =>
                    onOpenCoachWithPrompt(
                      `Why is "${primaryGap.skill}" my biggest skill gap for becoming a ${profile?.goal || 'developer'}, and how should I practice it?`
                    )
                  }
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors text-center"
                >
                  Ask AI Coach
                </button>
              )}
              <button
                type="button"
                onClick={() => onNavigateToTab('roadmap')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/15"
              >
                <span>Jump to Stage Tasks</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Skill Matrix (Percentages breakdown as requested in prompt) */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
              Skill Proficiency Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live skill progression updated as you complete tasks, challenges, and practical missions.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span>Current Level</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-700" />
              <span>Target Benchmark</span>
            </div>
          </div>
        </div>

        {/* Skill Bars List */}
        <div className="space-y-3 sm:space-y-4">
          {skills.map((skillItem) => {
            const catInfo = categoryColor[skillItem.category] || categoryColor.core;
            const isFinished = skillItem.currentLevel >= skillItem.requiredLevel;

            return (
              <div
                key={skillItem.skill}
                className="p-3.5 sm:p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white text-sm">
                      {skillItem.skill}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${catInfo.badge}`}
                    >
                      {skillItem.category}
                    </span>
                    {skillItem.isPrimaryGap && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        Top Gap
                      </span>
                    )}
                    {isFinished && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Target Met
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono flex-wrap">
                    <span className="text-white font-bold">{skillItem.currentLevel}%</span>
                    <span className="text-slate-500">/ {skillItem.requiredLevel}% Target</span>
                    <span className="text-slate-400">
                      ({skillItem.gapPercentage}% gap)
                    </span>
                  </div>
                </div>

                {/* Visual Dual Progress Bar */}
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden relative">
                  {/* Benchmark Target Marker Line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-500 z-10"
                    style={{ left: `${skillItem.requiredLevel}%` }}
                    title={`Target: ${skillItem.requiredLevel}%`}
                  />

                  {/* Current Fill */}
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFinished
                        ? 'bg-emerald-400'
                        : skillItem.isPrimaryGap
                        ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    }`}
                    style={{ width: `${skillItem.currentLevel}%` }}
                  />
                </div>

                {/* Practical Recommendation */}
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {skillItem.recommendation}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* What to Work on Next Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-cyan-950/30 border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" /> Recommended Next Action
          </span>
          <h3 className="text-sm sm:text-base font-bold text-white">
            {nextRecommendedAction.title}
          </h3>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            {nextRecommendedAction.description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (nextRecommendedAction.actionType === 'mission') {
              onNavigateToTab('missions');
            } else {
              onNavigateToTab('roadmap');
            }
          }}
          className="w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all flex items-center justify-center gap-2 shrink-0 shadow-md shadow-cyan-500/20 active:scale-95"
        >
          <span>Take Action Now</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Ethical Grounding Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
        <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>PathPilot Grounding Statement:</strong> Skill gap calculations evaluate technical milestones, hands-on tasks, and practical mission deliverables against curated beginner benchmarks. PathPilot does not make unsupported claims regarding guaranteed employment, job placement, or hiring outcomes.
        </p>
      </div>
    </div>
  );
};
