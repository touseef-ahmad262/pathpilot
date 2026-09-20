import React from 'react';
import { Award, CheckCircle2, Lock, X, Sparkles } from 'lucide-react';
import { Badge, GamificationState } from '../types';

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  gamification: GamificationState;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({
  isOpen,
  onClose,
  gamification,
}) => {
  if (!isOpen) return null;

  const unlockedCount = gamification.badges.filter((b) => b.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                Achievements & Badges
              </h3>
              <p className="text-xs text-slate-400">
                {unlockedCount} of {gamification.badges.length} Unlocked
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Badges List */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {gamification.badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                badge.unlocked
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-60'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl border shrink-0 ${
                  badge.unlocked
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
              >
                {badge.unlocked ? (
                  <Sparkles className="h-5 w-5" />
                ) : (
                  <Lock className="h-5 w-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-white truncate">
                    {badge.title}
                  </h4>
                  {badge.unlocked ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-500">
                      Locked
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 mt-1">{badge.description}</p>
                <div className="text-[11px] text-slate-400 mt-1.5">
                  <span className="text-slate-500">Criteria:</span> {badge.criteria}
                </div>

                {badge.unlocked && badge.unlockedAt && (
                  <div className="text-[10px] text-amber-400/80 mt-1 font-mono">
                    Unlocked on {new Date(badge.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
