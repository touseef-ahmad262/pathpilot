import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Award,
  Sparkles,
  Zap,
  FolderGit2,
  Code2,
  Check,
  Filter,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { RoadmapStage, RoadmapTask, StageChallenge, StageMiniProject } from '../types';

interface RoadmapViewProps {
  stages: RoadmapStage[];
  onToggleTask: (stageId: string, taskId: string) => void;
  onToggleChallenge: (stageId: string) => void;
  onToggleMiniProject: (stageId: string) => void;
  onOpenCoachWithPrompt?: (prompt: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  stages,
  onToggleTask,
  onToggleChallenge,
  onToggleMiniProject,
  onOpenCoachWithPrompt,
}) => {
  // Store which stages are expanded. By default, expand first uncompleted stage or stage 0
  const initialExpanded = stages.reduce<Record<string, boolean>>((acc, s, idx) => {
    acc[s.id] = idx === 0 || !s.completed;
    return acc;
  }, {});

  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>(initialExpanded);
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');

  const toggleExpand = (stageId: string) => {
    setExpandedStages((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
  };

  const expandAll = () => {
    const allExp = stages.reduce<Record<string, boolean>>((acc, s) => {
      acc[s.id] = true;
      return acc;
    }, {});
    setExpandedStages(allExp);
  };

  const collapseAll = () => {
    setExpandedStages({});
  };

  // Filter stages
  const filteredStages = stages.filter((stage) => {
    const stageFinished = stage.tasks.every((t) => t.completed);
    if (filter === 'completed') return stageFinished;
    if (filter === 'in-progress') return !stageFinished;
    return true;
  });

  // Calculate totals
  const totalTasks = stages.flatMap((s) => s.tasks);
  const completedTasks = totalTasks.filter((t) => t.completed);
  const overallPercent = totalTasks.length > 0 ? Math.round((completedTasks.length / totalTasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-800/40">
                Interactive Learning Path
              </span>
              <span className="text-xs text-slate-400">
                {stages.length} Structured Phases
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1 font-['Outfit']">
              Personalized Career Roadmap
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Follow this step-by-step sequence of foundational concepts, practical mini-projects, and verification challenges. Click any task to mark it complete and earn XP.
            </p>
          </div>

          {/* Progress Overview Pill */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-right">
              <div className="text-xs text-slate-400">Overall Progress</div>
              <div className="text-xl font-bold text-cyan-400 font-mono">
                {overallPercent}%
              </div>
              <div className="text-[11px] text-slate-500">
                {completedTasks.length}/{totalTasks.length} tasks
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-800 relative flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-4 border-cyan-400"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${overallPercent > 25 ? '100% 0%,' : ''} ${
                    overallPercent > 50 ? '100% 100%,' : ''
                  } ${overallPercent > 70 ? '0% 100%,' : ''} ${overallPercent >= 100 ? '0% 0%,' : ''} 50% 50%)`,
                }}
              />
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Filter Controls & Expand / Collapse */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Stages ({stages.length})
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filter === 'in-progress'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filter === 'completed'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Completed
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800 transition-colors"
            >
              Expand All
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={collapseAll}
              className="text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800 transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Stages Timeline */}
      <div className="space-y-4">
        {filteredStages.map((stage, index) => {
          const isExpanded = Boolean(expandedStages[stage.id]);
          const stageTasks = stage.tasks;
          const completedInStage = stageTasks.filter((t) => t.completed).length;
          const stageFinished = stageTasks.length > 0 && completedInStage === stageTasks.length;
          const stagePercent = stageTasks.length > 0 ? Math.round((completedInStage / stageTasks.length) * 100) : 0;

          return (
            <div
              key={stage.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                stageFinished
                  ? 'bg-slate-900/60 border-emerald-500/30'
                  : isExpanded
                  ? 'bg-slate-900 border-slate-700 shadow-lg shadow-cyan-950/20'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Stage Header Accordion Trigger */}
              <button
                type="button"
                onClick={() => toggleExpand(stage.id)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 focus:outline-none focus-visible:bg-slate-800/40"
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  {/* Phase Number Badge */}
                  <div
                    className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 font-mono font-bold text-sm transition-colors ${
                      stageFinished
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    }`}
                  >
                    {stageFinished ? (
                      <Check className="h-5 w-5 stroke-[2.5]" />
                    ) : (
                      `0${stage.phaseNumber}`
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-slate-400">
                        {stage.phaseTitle}
                      </span>
                      <span className="text-[11px] text-slate-500">• Est. {stage.estimatedWeeks} weeks</span>
                      {stageFinished && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          Stage Complete
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
                      {stage.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {/* Mini Progress Indicator */}
                  <div className="hidden sm:block text-right">
                    <div className="text-xs font-mono font-semibold text-slate-300">
                      {completedInStage}/{stageTasks.length} Done
                    </div>
                    <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          stageFinished ? 'bg-emerald-400' : 'bg-cyan-400'
                        }`}
                        style={{ width: `${stagePercent}%` }}
                      />
                    </div>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Stage Expanded Details */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-6">
                  {/* Stage Description & Skills Chips */}
                  <div className="space-y-3">
                    <p className="text-sm text-slate-300">{stage.description}</p>
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-xs font-medium text-slate-400 mr-1">Skills covered:</span>
                      {stage.skills.map((sk) => (
                        <span
                          key={sk}
                          className="text-xs px-2.5 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tasks Checklist */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center justify-between">
                      <span>Core Learning Tasks</span>
                      <span className="text-slate-500 font-mono">
                        {completedInStage} of {stageTasks.length} Completed
                      </span>
                    </h4>

                    <div className="grid grid-cols-1 gap-2.5">
                      {stageTasks.map((task) => {
                        return (
                          <div
                            key={task.id}
                            className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                              task.completed
                                ? 'bg-slate-950/40 border-slate-800/80 opacity-80'
                                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <button
                                type="button"
                                onClick={() => onToggleTask(stage.id, task.id)}
                                className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                                  task.completed
                                    ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-sm'
                                    : 'border-slate-700 hover:border-cyan-400 bg-slate-900'
                                }`}
                                title={task.completed ? 'Mark as incomplete' : 'Mark as completed'}
                              >
                                {task.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                              </button>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span
                                    className={`text-sm font-semibold ${
                                      task.completed ? 'line-through text-slate-400' : 'text-white'
                                    }`}
                                  >
                                    {task.title}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                                  {task.description}
                                </p>

                                {task.resourceHint && (
                                  <div className="flex items-center gap-1 text-[11px] text-cyan-400/90 mt-1.5 font-medium">
                                    <ExternalLink className="h-3 w-3" />
                                    <span>Resource: {task.resourceHint}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col items-end shrink-0 text-right">
                              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                                <Clock className="h-3 w-3" /> {task.estimatedMinutes}m
                              </span>
                              <span className="text-[10px] text-amber-400 font-semibold mt-1">
                                +30 XP
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stage Practical Challenge & Mini-Project Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
                    {/* Practical Challenge */}
                    <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                            <Zap className="h-3.5 w-3.5" /> Stage Practical Challenge
                          </span>
                          <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            +{stage.practicalChallenge.xpReward} XP
                          </span>
                        </div>

                        <h5 className="text-sm font-bold text-white mt-2">
                          {stage.practicalChallenge.title}
                        </h5>
                        <p className="text-xs text-slate-400 mt-1">
                          {stage.practicalChallenge.prompt}
                        </p>

                        <div className="mt-3 space-y-1">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            Verification Checklist:
                          </span>
                          {stage.practicalChallenge.checklist.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => onToggleChallenge(stage.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            stage.practicalChallenge.completed
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>
                            {stage.practicalChallenge.completed
                              ? 'Challenge Completed'
                              : 'Mark Challenge Complete'}
                          </span>
                        </button>

                        {onOpenCoachWithPrompt && (
                          <button
                            type="button"
                            onClick={() =>
                              onOpenCoachWithPrompt(
                                `Give me a beginner practice challenge for stage ${stage.phaseNumber}: ${stage.title}`
                              )
                            }
                            className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                          >
                            Ask AI Coach
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Stage Mini-Project */}
                    <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
                            <FolderGit2 className="h-3.5 w-3.5" /> Stage Mini-Project
                          </span>
                          <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                            +{stage.miniProject.xpReward} XP
                          </span>
                        </div>

                        <h5 className="text-sm font-bold text-white mt-2">
                          {stage.miniProject.title}
                        </h5>
                        <p className="text-xs text-slate-400 mt-1">
                          {stage.miniProject.objective}
                        </p>

                        <div className="mt-3 space-y-1">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            Required Deliverables:
                          </span>
                          {stage.miniProject.deliverables.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => onToggleMiniProject(stage.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            stage.miniProject.completed
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>
                            {stage.miniProject.completed
                              ? 'Mini-Project Finished'
                              : 'Mark Project Finished'}
                          </span>
                        </button>

                        <span className="text-[11px] text-slate-400">
                          Builds GitHub Trail
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
