export type ExperienceLevel = 'complete-beginner' | 'some-basics' | 'intermediate';

export interface UserProfile {
  id: string;
  name: string;
  goal: string;
  goalId?: string;
  experience: ExperienceLevel;
  existingSkills: string[];
  hoursPerWeek: number;
  timeframe: string;
  targetMonths: number;
  createdAt: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: string;
  resourceHint?: string;
}

export interface StageChallenge {
  title: string;
  prompt: string;
  checklist: string[];
  xpReward: number;
  completed: boolean;
}

export interface StageMiniProject {
  title: string;
  objective: string;
  deliverables: string[];
  xpReward: number;
  completed: boolean;
}

export interface RoadmapStage {
  id: string;
  phaseNumber: number;
  phaseTitle: string;
  title: string;
  description: string;
  estimatedWeeks: number;
  skills: string[];
  tasks: RoadmapTask[];
  practicalChallenge: StageChallenge;
  miniProject: StageMiniProject;
  completed: boolean;
}

export interface SkillGap {
  skill: string;
  currentLevel: number; // 0 to 100
  requiredLevel: number; // 0 to 100
  gapPercentage: number; // requiredLevel - currentLevel
  isPrimaryGap: boolean;
  category: 'foundational' | 'core' | 'practical' | 'workflow';
  recommendation: string;
  linkedStageId?: string;
}

export interface Mission {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  skillsPracticed: string[];
  xpReward: number;
  description: string;
  instructions: string[];
  deliverables: string[];
  completed: boolean;
  completedAt?: string;
  stageId?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  criteria: string;
}

export interface GamificationState {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  badges: Badge[];
  completedMissionIds: string[];
  completedTaskIds: string[];
}

export interface GoalPreset {
  id: string;
  title: string;
  shortDescription: string;
  tagline: string;
  iconName: string;
  badge: string;
  defaultTimeframe: string;
  defaultMonths: number;
  defaultHours: number;
  availableSkills: string[];
  stages: RoadmapStage[];
  missions: Mission[];
  skillWeights: { skill: string; requiredLevel: number; category: SkillGap['category'] }[];
}

export interface AICoachMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  mode?: 'gemini' | 'fallback';
}
