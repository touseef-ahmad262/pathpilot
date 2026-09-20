import React, { useState } from 'react';
import { BookOpen, X, Sparkles, CheckCircle2, Github, ExternalLink, Award, ShieldCheck, Code, Target, Compass } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'submission' | 'rubric' | 'journey'>('submission');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-['Outfit']">
                  PathPilot — Devpost Hackathon Dossier
                </h3>
                <span className="text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                  FirstCommit Entry
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Created by Touseef Ahmad (Age 19) •{' '}
                <a
                  href="https://github.com/touseef-ahmad262"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline inline-flex items-center gap-0.5"
                >
                  github.com/touseef-ahmad262 <ExternalLink className="h-2.5 w-2.5" />
                </a>
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('submission')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'submission'
                ? 'border-cyan-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Devpost Submission Summary
          </button>
          <button
            onClick={() => setActiveTab('rubric')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'rubric'
                ? 'border-cyan-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Judging Criteria Alignment
          </button>
          <button
            onClick={() => setActiveTab('journey')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'journey'
                ? 'border-cyan-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Learning Journey & Tech Stack
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[62vh] overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {activeTab === 'submission' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-white text-base">Inspiration & Problem</h4>
                <p className="mt-1 text-slate-300">
                  Beginners often suffer from <strong>"Tutorial Hell"</strong> and direction overload. They know what they want to become (e.g., "Web Developer", "Data Analyst"), but they don't know:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
                  <li>What to learn first, and what order actually makes sense.</li>
                  <li>What specific skills they are missing compared to industry standards.</li>
                  <li>What practical, real-world projects to build that prove competence.</li>
                  <li>How to stay consistent with weekly hours and visible progress.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white text-base">The Solution: PathPilot</h4>
                <p className="mt-1 text-slate-300">
                  <strong>PathPilot</strong> turns ambitious career goals into personalized, structured learning paths. It is not just a static checklist: it analyzes the beginner's current skills, computes precise percentage-based skill gaps, generates phase-by-phase roadmaps with verification challenges, and rewards hands-on mission completions with XP and achievements.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Signature Tagline:
                </span>
                <p className="text-base font-semibold text-white font-['Outfit']">
                  "Turn your goal into a path. Turn your path into progress."
                </p>
              </div>
            </div>
          )}

          {activeTab === 'rubric' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">1. Learning & Growth (30%)</span>
                  <span className="text-xs text-cyan-400 font-mono">30% Weight</span>
                </div>
                <p className="text-xs text-slate-300">
                  Built by a 19-year-old self-taught developer to solve the exact problem beginners face. The app breaks complex career curricula into structured phases with time estimates, verification checklists, and hands-on deliverables.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">2. Creativity & Impact (25%)</span>
                  <span className="text-xs text-cyan-400 font-mono">25% Weight</span>
                </div>
                <p className="text-xs text-slate-300">
                  Introduces the <strong>Skill Gap Analyzer</strong> with percentage metrics (e.g. HTML 100%, CSS 70%, JavaScript 35%, Git 25%, Projects 20%) and the <strong>Practical Mission System</strong> that pulls learners out of passive video consumption into real code delivery.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">3. Technical Execution (25%)</span>
                  <span className="text-xs text-cyan-400 font-mono">25% Weight</span>
                </div>
                <p className="text-xs text-slate-300">
                  Full-stack architecture featuring TypeScript, React 18+, Tailwind CSS, and an Express backend. Server-side proxy for Gemini 3.8 Flash prevents browser API key leaks. An intelligent heuristic fallback ensures 100% offline stability if API limits or offline modes occur.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">4. Presentation & Communication (20%)</span>
                  <span className="text-xs text-cyan-400 font-mono">20% Weight</span>
                </div>
                <p className="text-xs text-slate-300">
                  Clean, original UI designed without AI clichés: custom typography scale, dark luxury palette with high-contrast accessibility, instant "Try Demo" mode for judges, and thorough documentation in Git.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'journey' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-white text-base">Architectural Highlights</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-cyan-400 block text-xs">Frontend</span>
                    <span className="text-xs text-slate-300">React, TypeScript, Vite, Tailwind CSS, Lucide Icons</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-indigo-400 block text-xs">Backend & AI</span>
                    <span className="text-xs text-slate-300">Express server, @google/genai (Gemini 3.8 Flash), tsx runtime</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-emerald-400 block text-xs">Persistence</span>
                    <span className="text-xs text-slate-300">Resilient localStorage engine with corruption fallbacks</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-amber-400 block text-xs">Gamification</span>
                    <span className="text-xs text-slate-300">Dynamic XP engine, Streak calculator, Badge evaluator</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400">
                  <strong>Ethical Grounding:</strong> PathPilot empowers beginner learning and skill mastery without making exaggerated or unsubstantiated employment claims. Every recommendation is grounded in hands-on tasks and practical code deliverables.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            PathPilot • Built for FirstCommit Hackathon
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
