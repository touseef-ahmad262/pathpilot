import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Compass,
  Code,
  Palette,
  BarChart2,
  Smartphone,
  Clock,
  Calendar,
  Layers,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { GOAL_PRESETS } from '../data/presets';
import { ExperienceLevel, UserProfile } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: Omit<UserProfile, 'id' | 'createdAt'>) => void;
  onTryDemo: () => void;
  onClose?: () => void;
}

const PRESET_ICONS: Record<string, React.ReactNode> = {
  Code: <Code className="h-6 w-6 text-cyan-400" />,
  Palette: <Palette className="h-6 w-6 text-purple-400" />,
  BarChart2: <BarChart2 className="h-6 w-6 text-emerald-400" />,
  Sparkles: <Sparkles className="h-6 w-6 text-indigo-400" />,
  Smartphone: <Smartphone className="h-6 w-6 text-pink-400" />,
};

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onTryDemo,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('web-dev');
  const [customGoal, setCustomGoal] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [experience, setExperience] = useState<ExperienceLevel>('complete-beginner');
  const [existingSkills, setExistingSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState<string>('');
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(12);
  const [timeframe, setTimeframe] = useState<string>('6 months');
  const [targetMonths, setTargetMonths] = useState<number>(6);

  if (!isOpen) return null;

  const currentPreset = GOAL_PRESETS.find((p) => p.id === selectedGoalId) || GOAL_PRESETS[0];

  const handleToggleSkill = (skill: string) => {
    if (existingSkills.includes(skill)) {
      setExistingSkills(existingSkills.filter((s) => s !== skill));
    } else {
      setExistingSkills([...existingSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !existingSkills.includes(trimmed)) {
      setExistingSkills([...existingSkills, trimmed]);
      setCustomSkillInput('');
    }
  };

  const handleTimeframeSelect = (tf: string, months: number) => {
    setTimeframe(tf);
    setTargetMonths(months);
  };

  const handleFinish = () => {
    const finalGoal = selectedGoalId === 'custom' ? customGoal.trim() || 'Custom Tech Goal' : currentPreset.title;
    onComplete({
      name: name.trim() || 'Aspiring Developer',
      goal: finalGoal,
      goalId: selectedGoalId === 'custom' ? 'web-dev' : selectedGoalId,
      experience,
      existingSkills,
      hoursPerWeek,
      timeframe,
      targetMonths,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-cyan-950/40 overflow-hidden my-8">
        {/* Decorative Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

        {/* Header & Step Indicator */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Compass className="h-4 w-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight font-['Outfit']">
                PathPilot Onboarding
              </h2>
              <p className="text-xs text-slate-400">Step {step} of 4: Personalize Your Journey</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onTryDemo}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3" />
              <span>Try Demo Instead</span>
            </button>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="px-6 pt-3 flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-cyan-400' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Body Content by Step */}
        <div className="p-6">
          {/* STEP 1: What do you want to achieve? */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">
                  What do you want to achieve?
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Choose a target career path or define a custom tech goal. PathPilot will construct an interactive roadmap around your destination.
                </p>
              </div>

              {/* Goal Presets Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {GOAL_PRESETS.map((preset) => {
                  const isSelected = selectedGoalId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedGoalId(preset.id);
                        setHoursPerWeek(preset.defaultHours);
                        setTimeframe(preset.defaultTimeframe);
                        setTargetMonths(preset.defaultMonths);
                      }}
                      className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/20 ring-1 ring-cyan-400 shadow-md shadow-cyan-500/10'
                          : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/70'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                          {PRESET_ICONS[preset.iconName] || <Code className="h-6 w-6 text-cyan-400" />}
                        </div>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {preset.badge}
                        </span>
                      </div>
                      <div className="mt-3">
                        <h4 className="font-semibold text-white text-sm">{preset.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {preset.shortDescription}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Optional Name */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  What is your name or preferred handle? (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Current Experience Level */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">
                  What is your current experience?
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Be completely honest! PathPilot adapts the beginning stages so you never feel lost or overwhelmed.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    level: 'complete-beginner' as ExperienceLevel,
                    title: 'Complete Beginner',
                    desc: 'Never coded or designed before. Starting completely from scratch.',
                    tag: 'Most Popular',
                  },
                  {
                    level: 'some-basics' as ExperienceLevel,
                    title: 'Some Basics',
                    desc: 'Watched a few tutorials, experimented with code snippets or basic tools.',
                    tag: 'Building Momentum',
                  },
                  {
                    level: 'intermediate' as ExperienceLevel,
                    title: 'Intermediate Foundation',
                    desc: 'Comfortable with fundamentals, but lacking real project experience or structure.',
                    tag: 'Project Ready',
                  },
                ].map((item) => {
                  const isSelected = experience === item.level;
                  return (
                    <button
                      key={item.level}
                      type="button"
                      onClick={() => setExperience(item.level)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/20 ring-1 ring-cyan-400 shadow-sm'
                          : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/70'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                          <span className="text-[10px] font-medium bg-slate-800 text-cyan-300 px-2 py-0.5 rounded border border-slate-700">
                            {item.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                      </div>
                      <div
                        className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Existing Skills */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">
                  Which skills do you already have?
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Select any skills you are already familiar with. If none, simply skip ahead! Our Skill Gap Analyzer will calculate your baseline.
                </p>
              </div>

              {/* Recommended Skill Chips */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Relevant for {currentPreset.title}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentPreset.availableSkills.map((skill) => {
                    const isSelected = existingSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleToggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                            : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-cyan-400" />}
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Skill Input */}
              <form onSubmit={handleAddCustomSkill} className="pt-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Add another skill:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    placeholder="e.g. Python, Figma, Notion"
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </form>

              {existingSkills.length > 0 && (
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
                  <span className="text-slate-300 font-semibold">{existingSkills.length} selected:</span>{' '}
                  {existingSkills.join(', ')}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Hours & Timeframe */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">
                  Commitment & Target Timeframe
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  How much time can you realistically invest? PathPilot balances your stage deadlines accordingly.
                </p>
              </div>

              {/* Hours per week */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm font-semibold text-white">Hours available per week</span>
                  </div>
                  <span className="text-base font-bold text-cyan-400">{hoursPerWeek} hrs / week</span>
                </div>

                <input
                  type="range"
                  min={4}
                  max={35}
                  step={1}
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Casual (4 hrs)</span>
                  <span>Moderate (12 hrs)</span>
                  <span>Intense (25+ hrs)</span>
                </div>
              </div>

              {/* Target timeframe */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm font-semibold text-white">Desired Timeframe</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: '3 Months', months: 3, subtitle: 'Fast Track (~15 hrs/wk)' },
                    { label: '6 Months', months: 6, subtitle: 'Balanced Pace (Recommended)' },
                    { label: '12 Months', months: 12, subtitle: 'Thorough Part-Time' },
                  ].map((tf) => {
                    const isSelected = targetMonths === tf.months;
                    return (
                      <button
                        key={tf.months}
                        type="button"
                        onClick={() => handleTimeframeSelect(tf.label, tf.months)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-950/20 ring-1 ring-cyan-400 shadow-sm'
                            : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-semibold text-white text-sm">{tf.label}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{tf.subtitle}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Summary Pill */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 border border-cyan-500/20 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Destination:</span>{' '}
                  <span className="font-bold text-white">{currentPreset.title}</span>
                </div>
                <div>
                  <span className="text-slate-400">Pace:</span>{' '}
                  <span className="font-bold text-cyan-300">{hoursPerWeek} hrs/wk for {timeframe}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
            >
              Next Step <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
            >
              <Zap className="h-4 w-4 fill-slate-950" />
              Generate My Roadmap
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
