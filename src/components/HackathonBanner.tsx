import React, { useState } from 'react';
import { Award, ExternalLink, Github, Sparkles, BookOpen, ChevronRight, X, User } from 'lucide-react';

interface HackathonBannerProps {
  onOpenDocs?: () => void;
}

export const HackathonBanner: React.FC<HackathonBannerProps> = ({ onOpenDocs }) => {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          <span>Devpost Hackathon Entry: <strong>Beginner's Paradise – FirstCommit</strong></span>
        </div>
        <button
          onClick={() => setCollapsed(false)}
          className="text-cyan-400 hover:text-cyan-300 font-medium text-xs"
        >
          Show Hackathon Panel
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/70 border-b border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Hackathon Identity */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-semibold text-[11px]">
              <Sparkles className="h-3 w-3" />
              Devpost: Beginner's Paradise – FirstCommit
            </span>

            <span className="text-slate-400 hidden sm:inline">•</span>

            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-slate-400">Built by:</span>
              <a
                href="https://github.com/touseef-ahmad262"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-white hover:text-cyan-300 flex items-center gap-1 transition-colors underline underline-offset-2 decoration-slate-600 hover:decoration-cyan-400"
              >
                <Github className="h-3.5 w-3.5" />
                <span>Touseef Ahmad (Age 19)</span>
                <ExternalLink className="h-2.5 w-2.5 opacity-60" />
              </a>
            </div>
          </div>

          {/* Right: Judging Criteria Pillars */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-400 font-medium">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                Learning & Growth (30%)
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                Creativity & Impact (25%)
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                Technical Execution (25%)
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                Presentation (20%)
              </span>
            </div>

            {onOpenDocs && (
              <button
                type="button"
                onClick={onOpenDocs}
                className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-semibold transition-colors flex items-center gap-1"
              >
                <BookOpen className="h-3 w-3" />
                <span>Judging Overview</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 ml-1"
              title="Minimize banner"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
