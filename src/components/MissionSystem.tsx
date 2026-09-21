import React, { useState } from 'react';
import {
  Target,
  Clock,
  Award,
  Sparkles,
  CheckCircle2,
  Check,
  ChevronRight,
  Filter,
  Code2,
  FolderGit2,
  X,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { Mission } from '../types';

interface MissionSystemProps {
  missions: Mission[];
  onToggleMission: (missionId: string) => void;
  onOpenCoachWithPrompt?: (prompt: string) => void;
}

export const MissionSystem: React.FC<MissionSystemProps> = ({
  missions,
  onToggleMission,
  onOpenCoachWithPrompt,
}) => {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

  const completedCount = missions.filter((m) => m.completed).length;
  const totalXpAvailable = missions.reduce((acc, m) => acc + m.xpReward, 0);
  const earnedXp = missions.filter((m) => m.completed).reduce((acc, m) => acc + m.xpReward, 0);

  const filteredMissions = missions.filter((m) => {
    if (filterDifficulty !== 'all' && m.difficulty !== filterDifficulty) return false;
    if (filterStatus === 'completed' && !m.completed) return false;
    if (filterStatus === 'active' && m.completed) return false;
    return true;
  });

  const difficultyColors: Record<string, { badge: string; border: string }> = {
    Beginner: {
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      border: 'hover:border-emerald-500/40',
    },
    Intermediate: {
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      border: 'hover:border-cyan-500/40',
    },
    Advanced: {
      badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      border: 'hover:border-purple-500/40',
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
                Practical Mission System
              </span>
              <span className="text-xs text-slate-400">
                Hands-On Project Portfolio
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1.5 font-['Outfit']">
              Real-World Code Missions
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Tutorials teach concepts, but missions build developers. Complete practical missions linked to your roadmap to earn XP, advance your level, and unlock the Builder achievement.
            </p>
          </div>

          {/* XP & Mission Progress Stats */}
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 bg-slate-950/80 p-3 sm:p-3.5 rounded-xl border border-slate-800 w-full sm:w-auto">
            <div className="text-left sm:text-right">
              <div className="text-xs text-slate-400">Missions Completed</div>
              <div className="text-lg sm:text-xl font-bold text-cyan-400 font-mono">
                {completedCount} / {missions.length}
              </div>
              <div className="text-[11px] text-amber-400 font-semibold">
                {earnedXp} / {totalXpAvailable} XP
              </div>
            </div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
              <Target className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-slate-400 font-medium shrink-0">Status:</span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  filterStatus === 'all'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({missions.length})
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  filterStatus === 'active'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  filterStatus === 'completed'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Completed ({completedCount})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium shrink-0">Difficulty:</span>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-cyan-400 w-full sm:w-auto"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredMissions.map((mission) => {
          const diff = difficultyColors[mission.difficulty] || difficultyColors.Beginner;
          return (
            <div
              key={mission.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                mission.completed
                  ? 'bg-slate-900/60 border-emerald-500/30'
                  : `bg-slate-900 border-slate-800 ${diff.border} hover:shadow-lg hover:shadow-cyan-950/20`
              }`}
              onClick={() => setSelectedMission(mission)}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${diff.badge}`}
                  >
                    {mission.difficulty}
                  </span>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                    <Sparkles className="h-3 w-3" />
                    <span>+{mission.xpReward} XP</span>
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white mt-3 line-clamp-2">
                  {mission.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                  {mission.description}
                </p>

                {/* Skills practiced pills */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {mission.skillsPracticed.map((sk) => (
                    <span
                      key={sk}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-4 sm:mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="h-3 w-3" /> ~{mission.estimatedHours} hrs
                </span>

                <div className="flex items-center gap-1 text-cyan-400 font-semibold group-hover:text-cyan-300">
                  {mission.completed ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5">
                      View Mission <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mission Detail Modal Dialog */}
      {selectedMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 max-h-[90vh] flex flex-col">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
              {/* Modal Top Bar */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                        difficultyColors[selectedMission.difficulty]?.badge || ''
                      }`}
                    >
                      {selectedMission.difficulty}
                    </span>
                    <span className="text-xs text-slate-400">
                      Category: {selectedMission.category}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                    {selectedMission.title}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedMission(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Time & XP Reward Banner */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Estimated Time: {selectedMission.estimatedHours} Hours</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-400 font-bold shrink-0">
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span>Reward: +{selectedMission.xpReward} XP</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Mission Brief
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  {selectedMission.description}
                </p>
              </div>

              {/* Step-by-Step Instructions */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Implementation Instructions
                </h4>
                <div className="mt-2 space-y-2">
                  {selectedMission.instructions.map((inst, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5"
                    >
                      <span className="font-mono font-bold text-cyan-400 text-xs mt-0.5">
                        0{i + 1}
                      </span>
                      <span className="leading-relaxed">{inst}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Deliverables */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Expected Deliverables
                </h4>
                <div className="mt-2 space-y-1">
                  {selectedMission.deliverables.map((del, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {onOpenCoachWithPrompt && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenCoachWithPrompt(
                        `How do I get started with the mission: "${selectedMission.title}"? Give me a quick architecture breakdown.`
                      );
                      setSelectedMission(null);
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2 text-center sm:text-left"
                  >
                    Ask AI Coach for Tips
                  </button>
                )}

                <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedMission(null)}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 text-center"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onToggleMission(selectedMission.id);
                      setSelectedMission((prev) =>
                        prev ? { ...prev, completed: !prev.completed } : null
                      );
                    }}
                    className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      selectedMission.completed
                        ? 'bg-slate-800 text-slate-400 hover:text-white'
                        : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/20'
                    }`}
                  >
                    <Check className="h-4 w-4" />
                    <span>
                      {selectedMission.completed ? 'Reopen Mission' : 'Mark Mission Complete'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
