import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
  User,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { UserProfile, RoadmapStage, Mission, AICoachMessage } from '../types';
import { computeSkillGaps } from '../utils/analyzer';

interface AICoachViewProps {
  profile: UserProfile | null;
  stages: RoadmapStage[];
  missions: Mission[];
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

const DEFAULT_QUESTIONS = [
  'What should I learn next?',
  'Why is this my biggest skill gap?',
  'Give me a beginner practice challenge.',
  'Explain this concept simply: Asynchronous JavaScript',
];

export const AICoachView: React.FC<AICoachViewProps> = ({
  profile,
  stages,
  missions,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const analysis = computeSkillGaps(profile, stages, missions);
  const activeStage = stages.find((s) => s.tasks.some((t) => !t.completed)) || stages[0];

  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverMode, setServerMode] = useState<'gemini' | 'fallback' | 'checking'>('checking');
  const [messages, setMessages] = useState<AICoachMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hello! I'm your PathPilot Roadmap Coach. I'm actively synced with your target of **${
        profile?.goal || 'Web Developer'
      }** (${profile?.experience || 'Beginner'} level). I know your current primary gap is **${
        analysis.primaryGap?.skill || 'Core Fundamentals'
      }**, and your active stage is **${activeStage?.title || 'Phase 1'}**.\n\nHow can I support your study session today? Feel free to pick a prompt below or ask anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: 'gemini',
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom on message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Check health on mount to detect server mode
  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        if (data.hasApiKey) {
          setServerMode('gemini');
        } else {
          setServerMode('fallback');
        }
      })
      .catch(() => setServerMode('fallback'));
  }, []);

  // Handle external prompt injection (e.g. clicked from Skill Gap Analyzer or Roadmap)
  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputQuestion.trim();
    if (!textToSend || loading) return;

    const userMessage: AICoachMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuestion('');
    setLoading(true);

    // Prepare contextual payload
    const userContext = {
      goal: profile?.goal || 'Web Developer',
      experience: profile?.experience || 'complete-beginner',
      timeframe: profile?.timeframe || '6 months',
      hoursPerWeek: profile?.hoursPerWeek || 12,
      existingSkills: profile?.existingSkills || [],
      primaryGap: analysis.primaryGap?.skill || 'Fundamental Programming',
      currentStage: `${activeStage?.phaseTitle}: ${activeStage?.title}`,
      activeMission: missions.find((m) => !m.completed)?.title || 'First Mission',
      progress: analysis.overallReadiness,
    };

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          userContext,
        }),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();

      const aiMessage: AICoachMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Keep practicing steadily to close your skill gaps!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: data.mode === 'gemini' ? 'gemini' : 'fallback',
      };

      setMessages((prev) => [...prev, aiMessage]);
      if (data.mode) setServerMode(data.mode);
    } catch (err) {
      console.warn('AI Coach server unreachable, activating offline mentor:', err);
      // Client-side fallback if server fetch fails
      const fallbackReply = `🎯 **PathPilot Offline Mentor:**\n\nFocus on your active stage **${activeStage?.title}**. Work specifically on closing your primary skill gap (**${analysis.primaryGap?.skill}**) by finishing today's roadmap task and committing code to GitHub!`;
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'assistant',
          content: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: 'fallback',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-800/40">
                Context-Aware Mentor
              </span>
              <span className="text-xs text-slate-400">
                Powered by Gemini 3.8 Flash
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1.5 font-['Outfit'] flex items-center gap-2">
              <span>PathPilot AI Coach</span>
              <Sparkles className="h-5 w-5 text-indigo-400" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              An intelligent mentor grounded in your selected goal, skill gap percentages, active roadmap stage, and weekly study schedule.
            </p>
          </div>

          {/* Context Synchronization Badge */}
          <div className="bg-slate-950/80 p-3 sm:p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5 w-full sm:w-auto shrink-0">
            <div className="flex items-center justify-between gap-3 text-slate-400">
              <span>Current Focus:</span>
              <span className="font-semibold text-white truncate max-w-[160px]">
                {profile?.goal || 'Web Developer'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-slate-400">
              <span>Active Gap:</span>
              <span className="font-semibold text-amber-400 truncate max-w-[160px]">
                {analysis.primaryGap?.skill || 'Fundamentals'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-slate-400 pt-1 border-t border-slate-800/80">
              <span>Engine Status:</span>
              <span
                className={`font-semibold text-[11px] px-1.5 py-0.5 rounded ${
                  serverMode === 'gemini'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                }`}
              >
                {serverMode === 'gemini' ? '● Gemini Live' : '● Heuristic Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Question Chips */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Recommended Beginner Prompts:
          </span>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-1.5 text-left"
              >
                <Lightbulb className="h-3 w-3 text-cyan-400 shrink-0" />
                <span className="line-clamp-1">{q}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col h-[460px] sm:h-[520px] shadow-lg">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-3.5 sm:p-5 overflow-y-auto space-y-3 sm:space-y-4">
          {messages.map((msg) => {
            const isAssistant = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 sm:gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
              >
                {isAssistant && (
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
                    <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-xl rounded-2xl p-3 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                    isAssistant
                      ? 'bg-slate-950 border border-slate-800 text-slate-200 shadow-sm'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans break-words">{msg.content}</div>

                  <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    {isAssistant && (
                      <span className="text-[10px] font-mono text-cyan-400/80">
                        {msg.mode === 'gemini' ? 'Gemini 3.8 Flash' : 'Smart Heuristic'}
                      </span>
                    )}
                  </div>
                </div>

                {!isAssistant && (
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 shadow-sm mt-0.5">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shrink-0 animate-pulse">
                <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:p-4 text-xs text-slate-400 flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-cyan-400" />
                <span>Coach is thinking with your roadmap context...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder={`Ask a question (e.g. "What should I practice today for ${
              profile?.goal || 'Web Developer'
            }?")`}
            disabled={loading}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 disabled:opacity-60 min-w-0"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || loading}
            className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:hover:bg-cyan-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20 shrink-0"
          >
            <span>Ask</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>

      {/* Safety & Grounding Note */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
        <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Responsible AI Implementation:</strong> All AI interactions route through server-side endpoints with zero API keys exposed in browser bundles. The coach provides pedagogical guidance, coding practice advice, and conceptual breakdowns without guaranteeing employment outcomes.
        </p>
      </div>
    </div>
  );
};
