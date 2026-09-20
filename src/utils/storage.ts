import { UserProfile, RoadmapStage, Mission, GamificationState, Badge } from '../types';
import {
  DEMO_USER_PROFILE,
  getDemoStages,
  getDemoMissions,
  getDemoGamification,
  INITIAL_BADGES,
  GOAL_PRESETS,
} from '../data/presets';

const STORAGE_KEYS = {
  PROFILE: 'pathpilot_user_profile_v1',
  STAGES: 'pathpilot_roadmap_stages_v1',
  MISSIONS: 'pathpilot_missions_v1',
  GAMIFICATION: 'pathpilot_gamification_v1',
  IS_DEMO: 'pathpilot_is_demo_v1',
};

// Safe localStorage wrapper
export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`PathPilot storage read error for key "${key}":`, e);
      return defaultValue;
    }
  },
  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`PathPilot storage write error for key "${key}":`, e);
      return false;
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`PathPilot storage remove error for key "${key}":`, e);
    }
  },
};

// State loader
export function loadInitialState(): {
  profile: UserProfile | null;
  stages: RoadmapStage[];
  missions: Mission[];
  gamification: GamificationState;
  isDemo: boolean;
} {
  const isDemo = storage.get<boolean>(STORAGE_KEYS.IS_DEMO, false);
  let profile = storage.get<UserProfile | null>(STORAGE_KEYS.PROFILE, null);
  let stages = storage.get<RoadmapStage[]>(STORAGE_KEYS.STAGES, []);
  let missions = storage.get<Mission[]>(STORAGE_KEYS.MISSIONS, []);
  let gamification = storage.get<GamificationState>(STORAGE_KEYS.GAMIFICATION, {
    xp: 0,
    level: 1,
    streakDays: 1,
    lastActiveDate: new Date().toISOString(),
    badges: INITIAL_BADGES,
    completedMissionIds: [],
    completedTaskIds: [],
  });

  // If empty and no profile yet, return clean state (ready for Onboarding or Demo)
  if (!profile && !isDemo) {
    return {
      profile: null,
      stages: [],
      missions: [],
      gamification: {
        xp: 0,
        level: 1,
        streakDays: 1,
        lastActiveDate: new Date().toISOString(),
        badges: INITIAL_BADGES,
        completedMissionIds: [],
        completedTaskIds: [],
      },
      isDemo: false,
    };
  }

  // Evaluate daily streak on load
  gamification = updateStreakOnActivity(gamification);

  return {
    profile,
    stages,
    missions,
    gamification,
    isDemo,
  };
}

// Load Demo Profile immediately for Judges
export function loadDemoProfileState(): {
  profile: UserProfile;
  stages: RoadmapStage[];
  missions: Mission[];
  gamification: GamificationState;
} {
  const profile = DEMO_USER_PROFILE;
  const stages = getDemoStages();
  const missions = getDemoMissions();
  const gamification = getDemoGamification();

  storage.set(STORAGE_KEYS.PROFILE, profile);
  storage.set(STORAGE_KEYS.STAGES, stages);
  storage.set(STORAGE_KEYS.MISSIONS, missions);
  storage.set(STORAGE_KEYS.GAMIFICATION, gamification);
  storage.set(STORAGE_KEYS.IS_DEMO, true);

  return { profile, stages, missions, gamification };
}

// Reset all progress
export function clearAllUserData(): void {
  storage.remove(STORAGE_KEYS.PROFILE);
  storage.remove(STORAGE_KEYS.STAGES);
  storage.remove(STORAGE_KEYS.MISSIONS);
  storage.remove(STORAGE_KEYS.GAMIFICATION);
  storage.remove(STORAGE_KEYS.IS_DEMO);
}

// Generate new roadmap from Onboarding
export function createRoadmapFromOnboarding(
  profileData: Omit<UserProfile, 'id' | 'createdAt'>
): {
  profile: UserProfile;
  stages: RoadmapStage[];
  missions: Mission[];
  gamification: GamificationState;
} {
  const profile: UserProfile = {
    ...profileData,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const preset = GOAL_PRESETS.find((p) => p.id === profile.goalId) || GOAL_PRESETS[0];
  const stages = JSON.parse(JSON.stringify(preset.stages)) as RoadmapStage[];
  const missions = JSON.parse(JSON.stringify(preset.missions)) as Mission[];

  const gamification: GamificationState = {
    xp: 50, // Welcome bonus XP
    level: 1,
    streakDays: 1,
    lastActiveDate: new Date().toISOString(),
    badges: INITIAL_BADGES,
    completedMissionIds: [],
    completedTaskIds: [],
  };

  storage.set(STORAGE_KEYS.PROFILE, profile);
  storage.set(STORAGE_KEYS.STAGES, stages);
  storage.set(STORAGE_KEYS.MISSIONS, missions);
  storage.set(STORAGE_KEYS.GAMIFICATION, gamification);
  storage.set(STORAGE_KEYS.IS_DEMO, false);

  return { profile, stages, missions, gamification };
}

// Gamification calculations
export function calculateLevel(xp: number): number {
  return Math.floor(xp / 350) + 1;
}

export function getXpProgressInLevel(xp: number): { current: number; max: number; percentage: number } {
  const current = xp % 350;
  const max = 350;
  const percentage = Math.round((current / max) * 100);
  return { current, max, percentage };
}

// Update streak on daily activity
export function updateStreakOnActivity(state: GamificationState): GamificationState {
  try {
    const today = new Date();
    const todayDateStr = today.toISOString().split('T')[0];
    const lastDateStr = state.lastActiveDate.split('T')[0];

    if (todayDateStr === lastDateStr) {
      return state;
    }

    const lastDate = new Date(lastDateStr);
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let newStreak = state.streakDays;
    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }

    const updated = {
      ...state,
      streakDays: newStreak,
      lastActiveDate: today.toISOString(),
    };
    storage.set(STORAGE_KEYS.GAMIFICATION, updated);
    return updated;
  } catch (e) {
    return state;
  }
}

// Evaluate badges unlocked
export function evaluateBadges(
  gamification: GamificationState,
  stages: RoadmapStage[],
  missions: Mission[]
): { updatedGamification: GamificationState; newlyUnlocked: Badge[] } {
  const newlyUnlocked: Badge[] = [];
  const completedTasksCount = stages.flatMap((s) => s.tasks).filter((t) => t.completed).length;
  const completedChallengesCount = stages.filter((s) => s.practicalChallenge.completed).length;
  const anyStageCompleted = stages.some((s) => s.tasks.every((t) => t.completed));
  const completedMissionsCount = missions.filter((m) => m.completed).length;

  const updatedBadges = gamification.badges.map((b) => {
    if (b.unlocked) return b;

    let shouldUnlock = false;
    if (b.id === 'first_step' && completedTasksCount >= 1) shouldUnlock = true;
    if (b.id === 'consistency' && gamification.streakDays >= 3) shouldUnlock = true;
    if (b.id === 'builder' && completedMissionsCount >= 1) shouldUnlock = true;
    if (b.id === 'problem_solver' && completedChallengesCount >= 2) shouldUnlock = true;
    if (b.id === 'roadmap_master' && anyStageCompleted) shouldUnlock = true;
    if (b.id === 'fast_learner' && gamification.xp >= 700) shouldUnlock = true;

    if (shouldUnlock) {
      const unlockedBadge = { ...b, unlocked: true, unlockedAt: new Date().toISOString() };
      newlyUnlocked.push(unlockedBadge);
      return unlockedBadge;
    }
    return b;
  });

  const updatedState: GamificationState = {
    ...gamification,
    badges: updatedBadges,
    level: calculateLevel(gamification.xp),
  };

  storage.set(STORAGE_KEYS.GAMIFICATION, updatedState);
  return { updatedGamification: updatedState, newlyUnlocked };
}
