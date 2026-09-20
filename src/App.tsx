import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Award,
  Zap,
  CheckCircle2,
  Compass,
  ArrowRight,
  Flame,
  X,
  PlayCircle,
  RotateCcw,
} from 'lucide-react';
import { Navbar, ActiveTab } from './components/Navbar';
import { HackathonBanner } from './components/HackathonBanner';
import { OnboardingModal } from './components/OnboardingModal';
import { RoadmapView } from './components/RoadmapView';
import { SkillGapAnalyzer } from './components/SkillGapAnalyzer';
import { MissionSystem } from './components/MissionSystem';
import { DashboardView } from './components/DashboardView';
import { AICoachView } from './components/AICoachView';
import { BadgeModal } from './components/BadgeModal';
import { DocsModal } from './components/DocsModal';
import {
  UserProfile,
  RoadmapStage,
  Mission,
  GamificationState,
  Badge,
} from './types';
import {
  loadInitialState,
  loadDemoProfileState,
  createRoadmapFromOnboarding,
  clearAllUserData,
  evaluateBadges,
  calculateLevel,
  storage,
} from './utils/storage';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stages, setStages] = useState<RoadmapStage[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [gamification, setGamification] = useState<GamificationState>({
    xp: 0,
    level: 1,
    streakDays: 1,
    lastActiveDate: new Date().toISOString(),
    badges: [],
    completedMissionIds: [],
    completedTaskIds: [],
  });
  const [isDemo, setIsDemo] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<ActiveTab>('roadmap');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState<boolean>(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState<boolean>(false);

  const [coachPrompt, setCoachPrompt] = useState<string | undefined>(undefined);

  // Toast notifications for XP & Badges
  const [toastNotification, setToastNotification] = useState<{
    id: string;
    title: string;
    description: string;
    iconType: 'xp' | 'badge' | 'level';
  } | null>(null);

  // Initialize on load
  useEffect(() => {
    const initial = loadInitialState();
    if (initial.profile) {
      setProfile(initial.profile);
      setStages(initial.stages);
      setMissions(initial.missions);
      setGamification(initial.gamification);
      setIsDemo(initial.isDemo);
    } else {
      // By default load demo immediately so judges see a fully populated state!
      const demoData = loadDemoProfileState();
      setProfile(demoData.profile);
      setStages(demoData.stages);
      setMissions(demoData.missions);
      setGamification(demoData.gamification);
      setIsDemo(true);
    }
  }, []);

  // Show celebratory toast
  const triggerToast = (
    title: string,
    description: string,
    iconType: 'xp' | 'badge' | 'level' = 'xp'
  ) => {
    setToastNotification({
      id: String(Date.now()),
      title,
      description,
      iconType,
    });
    setTimeout(() => {
      setToastNotification((curr) => (curr?.title === title ? null : curr));
    }, 3800);
  };

  // Helper to persist stages and re-evaluate badges
  const persistState = (
    newStages: RoadmapStage[],
    newMissions: Mission[],
    xpGain: number
  ) => {
    setStages(newStages);
    setMissions(newMissions);
    storage.set('pathpilot_roadmap_stages_v1', newStages);
    storage.set('pathpilot_missions_v1', newMissions);

    const prevLevel = gamification.level;
    const newXp = Math.max(0, gamification.xp + xpGain);
    const newLevel = calculateLevel(newXp);

    let updatedGamification: GamificationState = {
      ...gamification,
      xp: newXp,
      level: newLevel,
    };

    if (newLevel > prevLevel && xpGain > 0) {
      triggerToast(
        `Level Up! You reached Level ${newLevel}!`,
        'Keep crushing your roadmap milestones.',
        'level'
      );
    } else if (xpGain > 0) {
      triggerToast(`+${xpGain} XP Earned!`, 'Milestone recorded in your journey.', 'xp');
    }

    const badgeEval = evaluateBadges(updatedGamification, newStages, newMissions);
    setGamification(badgeEval.updatedGamification);

    if (badgeEval.newlyUnlocked.length > 0) {
      const b = badgeEval.newlyUnlocked[0];
      setTimeout(() => {
        triggerToast(`Achievement Unlocked: ${b.title}!`, b.description, 'badge');
      }, 700);
    }
  };

  // Toggle task completion
  const handleToggleTask = (stageId: string, taskId: string) => {
    let xpDiff = 0;
    const updatedStages = stages.map((stage) => {
      if (stage.id !== stageId) return stage;
      const updatedTasks = stage.tasks.map((task) => {
        if (task.id !== taskId) return task;
        const newCompleted = !task.completed;
        xpDiff = newCompleted ? 30 : -30;
        return { ...task, completed: newCompleted };
      });

      const allTasksFinished = updatedTasks.every((t) => t.completed);
      return {
        ...stage,
        tasks: updatedTasks,
        completed: allTasksFinished,
      };
    });

    persistState(updatedStages, missions, xpDiff);
  };

  // Toggle stage practical challenge
  const handleToggleChallenge = (stageId: string) => {
    let xpDiff = 0;
    const updatedStages = stages.map((stage) => {
      if (stage.id !== stageId) return stage;
      const newStatus = !stage.practicalChallenge.completed;
      xpDiff = newStatus ? stage.practicalChallenge.xpReward : -stage.practicalChallenge.xpReward;
      return {
        ...stage,
        practicalChallenge: {
          ...stage.practicalChallenge,
          completed: newStatus,
        },
      };
    });

    persistState(updatedStages, missions, xpDiff);
  };

  // Toggle stage mini-project
  const handleToggleMiniProject = (stageId: string) => {
    let xpDiff = 0;
    const updatedStages = stages.map((stage) => {
      if (stage.id !== stageId) return stage;
      const newStatus = !stage.miniProject.completed;
      xpDiff = newStatus ? stage.miniProject.xpReward : -stage.miniProject.xpReward;
      return {
        ...stage,
        miniProject: {
          ...stage.miniProject,
          completed: newStatus,
        },
      };
    });

    persistState(updatedStages, missions, xpDiff);
  };

  // Toggle Mission
  const handleToggleMission = (missionId: string) => {
    let xpDiff = 0;
    const updatedMissions = missions.map((m) => {
      if (m.id !== missionId) return m;
      const newStatus = !m.completed;
      xpDiff = newStatus ? m.xpReward : -m.xpReward;
      return { ...m, completed: newStatus };
    });

    persistState(stages, updatedMissions, xpDiff);
  };

  // Load Demo
  const handleLoadDemo = () => {
    const demo = loadDemoProfileState();
    setProfile(demo.profile);
    setStages(demo.stages);
    setMissions(demo.missions);
    setGamification(demo.gamification);
    setIsDemo(true);
    setIsOnboardingOpen(false);
    triggerToast('Demo Mode Activated', 'Loaded sample Web Developer profile for hackathon evaluation.', 'level');
  };

  // Reset or Start New
  const handleReset = () => {
    clearAllUserData();
    setProfile(null);
    setStages([]);
    setMissions([]);
    setIsDemo(false);
    setIsOnboardingOpen(true);
  };

  // Onboarding Complete
  const handleOnboardingComplete = (profileData: Omit<UserProfile, 'id' | 'createdAt'>) => {
    const newRoadmap = createRoadmapFromOnboarding(profileData);
    setProfile(newRoadmap.profile);
    setStages(newRoadmap.stages);
    setMissions(newRoadmap.missions);
    setGamification(newRoadmap.gamification);
    setIsDemo(false);
    setIsOnboardingOpen(false);
    setActiveTab('roadmap');
    triggerToast('Roadmap Generated!', 'Welcome to PathPilot. Let’s make real progress.', 'level');
  };

  // Open AI Coach with preset prompt
  const handleOpenCoachWithPrompt = (prompt: string) => {
    setCoachPrompt(prompt);
    setActiveTab('coach');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-cyan-500 selection:text-slate-950">
      {/* Hackathon Devpost Banner */}
      <HackathonBanner onOpenDocs={() => setIsDocsModalOpen(true)} />

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        gamification={gamification}
        onOpenDemo={handleLoadDemo}
        onReset={handleReset}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenBadges={() => setIsBadgeModalOpen(true)}
        isDemo={isDemo}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Floating Toast Notification */}
        {toastNotification && (
          <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
            <div className="p-4 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl shadow-cyan-950/40 flex items-center gap-3.5 backdrop-blur-md">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {toastNotification.iconType === 'badge' ? (
                  <Award className="h-5 w-5 text-amber-400" />
                ) : toastNotification.iconType === 'level' ? (
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                ) : (
                  <Zap className="h-5 w-5 text-cyan-400" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {toastNotification.title}
                </div>
                <div className="text-[11px] text-slate-400">
                  {toastNotification.description}
                </div>
              </div>
              <button
                onClick={() => setToastNotification(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white ml-2"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'roadmap' && (
          <RoadmapView
            stages={stages}
            onToggleTask={handleToggleTask}
            onToggleChallenge={handleToggleChallenge}
            onToggleMiniProject={handleToggleMiniProject}
            onOpenCoachWithPrompt={handleOpenCoachWithPrompt}
          />
        )}

        {activeTab === 'analyzer' && (
          <SkillGapAnalyzer
            profile={profile}
            stages={stages}
            missions={missions}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onOpenCoachWithPrompt={handleOpenCoachWithPrompt}
          />
        )}

        {activeTab === 'missions' && (
          <MissionSystem
            missions={missions}
            onToggleMission={handleToggleMission}
            onOpenCoachWithPrompt={handleOpenCoachWithPrompt}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            stages={stages}
            missions={missions}
            gamification={gamification}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onOpenBadges={() => setIsBadgeModalOpen(true)}
            onOpenCoachWithPrompt={handleOpenCoachWithPrompt}
          />
        )}

        {activeTab === 'coach' && (
          <AICoachView
            profile={profile}
            stages={stages}
            missions={missions}
            initialPrompt={coachPrompt}
            onClearInitialPrompt={() => setCoachPrompt(undefined)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-850 border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-cyan-400" />
            <span className="font-bold text-white font-['Outfit']">PathPilot</span>
            <span className="text-slate-500">— Turn your goal into a path. Turn your path into progress.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsDocsModalOpen(true)}
              className="hover:text-cyan-300 transition-colors underline underline-offset-2"
            >
              Devpost Rubric Dossier
            </button>
            <span>•</span>
            <a
              href="https://github.com/touseef-ahmad262"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-300 transition-colors"
            >
              Touseef Ahmad (Age 19)
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
        onTryDemo={handleLoadDemo}
        onClose={() => setIsOnboardingOpen(false)}
      />

      <BadgeModal
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
        gamification={gamification}
      />

      <DocsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />
    </div>
  );
}
