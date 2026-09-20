import { SkillGap, RoadmapStage, Mission, UserProfile } from '../types';
import { GOAL_PRESETS } from '../data/presets';

export interface AnalysisResult {
  skills: SkillGap[];
  primaryGap: SkillGap | null;
  overallReadiness: number; // 0 to 100
  summaryInsight: string;
  nextRecommendedAction: {
    title: string;
    description: string;
    actionType: 'task' | 'mission' | 'challenge';
    targetId?: string;
  };
}

export function computeSkillGaps(
  profile: UserProfile | null,
  stages: RoadmapStage[],
  missions: Mission[]
): AnalysisResult {
  if (!profile) {
    return {
      skills: [],
      primaryGap: null,
      overallReadiness: 0,
      summaryInsight: 'Complete onboarding to generate your personalized skill gap analysis.',
      nextRecommendedAction: {
        title: 'Start Onboarding',
        description: 'Define your goal and experience to build your customized path.',
        actionType: 'task',
      },
    };
  }

  // Find preset or fallback to web-dev
  const preset = GOAL_PRESETS.find((p) => p.id === profile.goalId) || GOAL_PRESETS[0];
  const skillDefinitions = preset.skillWeights;

  // Calculate task completion ratio
  const totalTasks = stages.flatMap((s) => s.tasks);
  const completedTasks = totalTasks.filter((t) => t.completed);
  const completedMissions = missions.filter((m) => m.completed);

  const existingSkillsLower = (profile.existingSkills || []).map((s) => s.toLowerCase());

  const skillGaps: SkillGap[] = skillDefinitions.map((def) => {
    let currentScore = 0;
    const skillNameLower = def.skill.toLowerCase();

    // Baseline from onboarding skills
    const hasBaseline = existingSkillsLower.some(
      (existing) =>
        skillNameLower.includes(existing) ||
        existing.includes(skillNameLower) ||
        (existing.includes('html') && skillNameLower.includes('html')) ||
        (existing.includes('css') && skillNameLower.includes('css')) ||
        (existing.includes('javascript') && skillNameLower.includes('javascript'))
    );

    if (hasBaseline) {
      if (profile.experience === 'intermediate') {
        currentScore = 55;
      } else if (profile.experience === 'some-basics') {
        currentScore = 40;
      } else {
        currentScore = 25;
      }
    } else {
      currentScore = profile.experience === 'intermediate' ? 25 : profile.experience === 'some-basics' ? 15 : 5;
    }

    // Boost based on roadmap tasks that match this skill
    const relevantTasks = totalTasks.filter((t) => {
      const taskText = (t.title + ' ' + t.description).toLowerCase();
      const tokens = skillNameLower.split(/[\s&,/]+/);
      return tokens.some((token) => token.length > 2 && taskText.includes(token));
    });

    if (relevantTasks.length > 0) {
      const completedRel = relevantTasks.filter((t) => t.completed).length;
      const boostFromTasks = (completedRel / relevantTasks.length) * 45;
      currentScore += boostFromTasks;
    } else {
      // General task progress contribution
      const generalProgress = totalTasks.length > 0 ? completedTasks.length / totalTasks.length : 0;
      currentScore += generalProgress * 30;
    }

    // Boost based on completed missions if practical/project oriented
    if (def.category === 'practical') {
      const missionRatio = missions.length > 0 ? completedMissions.length / missions.length : 0;
      currentScore = Math.max(currentScore, Math.round(missionRatio * 85 + (completedTasks.length > 0 ? 15 : 0)));
    }

    // Round and clamp to 100
    const clampedScore = Math.min(100, Math.max(0, Math.round(currentScore)));
    const gap = Math.max(0, def.requiredLevel - clampedScore);

    // Contextual recommendations based on gap size
    let recommendation = '';
    if (clampedScore >= def.requiredLevel) {
      recommendation = `Target proficiency reached (${clampedScore}%). Maintain active practice by shipping real missions.`;
    } else if (gap <= 25) {
      recommendation = `Close to target! Complete upcoming stage challenges to solidify advanced concepts.`;
    } else if (gap <= 50) {
      recommendation = `Moderate gap (${gap}% remaining). Focus on hands-on exercises and avoid jumping ahead.`;
    } else {
      recommendation = `Critical learning priority (${gap}% remaining). Dedicate your next study blocks to core fundamentals here.`;
    }

    // Linked stage lookup
    const linkedStage = stages.find((st) =>
      st.skills.some((sk) => skillNameLower.includes(sk.toLowerCase()))
    );

    return {
      skill: def.skill,
      currentLevel: clampedScore,
      requiredLevel: def.requiredLevel,
      gapPercentage: gap,
      isPrimaryGap: false,
      category: def.category,
      recommendation,
      linkedStageId: linkedStage?.id,
    };
  });

  // Identify primary gap (highest gap percentage, prioritizing foundational then core)
  let primaryGap: SkillGap | null = null;
  let highestGapWeight = -1;

  skillGaps.forEach((gap) => {
    // Weight foundational & core slightly higher to prioritize sequence
    const categoryMultiplier =
      gap.category === 'foundational' ? 1.3 : gap.category === 'core' ? 1.15 : 1.0;
    const weightedGap = gap.gapPercentage * categoryMultiplier;

    if (gap.gapPercentage > 15 && weightedGap > highestGapWeight) {
      highestGapWeight = weightedGap;
      primaryGap = gap;
    }
  });

  // Flag the primary gap in array
  if (primaryGap) {
    const target = skillGaps.find((g) => g.skill === (primaryGap as SkillGap).skill);
    if (target) target.isPrimaryGap = true;
  }

  // Calculate overall readiness
  const totalTargetWeight = skillDefinitions.reduce((acc, s) => acc + s.requiredLevel, 0);
  const totalCurrentWeight = skillGaps.reduce((acc, s) => acc + s.currentLevel, 0);
  const overallReadiness = Math.min(
    100,
    Math.round((totalCurrentWeight / Math.max(1, totalTargetWeight)) * 100)
  );

  // Generate summary insight
  let summaryInsight = '';
  if (!primaryGap || (primaryGap as SkillGap).gapPercentage <= 15) {
    summaryInsight = `Outstanding progress! Your skills align well with your target goal of ${profile.goal}. Focus on shipping your capstone mission.`;
  } else {
    summaryInsight = `Your largest skill bottleneck is in "${(primaryGap as SkillGap).skill}" with a ${(primaryGap as SkillGap).gapPercentage}% gap. Focusing on this area will deliver the fastest momentum before moving to advanced topics.`;
  }

  // Next recommended action
  let nextAction: {
    title: string;
    description: string;
    actionType: 'task' | 'mission' | 'challenge';
    targetId?: string;
  } = {
    title: 'Begin Next Roadmap Task',
    description: 'Work through the active stage tasks to systematically close your skill gaps.',
    actionType: 'task',
    targetId: undefined,
  };

  // Find first uncompleted task
  const nextTask = totalTasks.find((t) => !t.completed);
  const nextMission = missions.find((m) => !m.completed);

  if (primaryGap && (primaryGap as SkillGap).category === 'practical' && nextMission) {
    nextAction = {
      title: `Mission: ${nextMission.title}`,
      description: `Build this practical mission to strengthen hands-on project experience (+${nextMission.xpReward} XP).`,
      actionType: 'mission',
      targetId: nextMission.id,
    };
  } else if (nextTask) {
    nextAction = {
      title: nextTask.title,
      description: `${nextTask.description} (Est. ${nextTask.estimatedMinutes} mins)`,
      actionType: 'task',
      targetId: nextTask.id,
    };
  }

  return {
    skills: skillGaps,
    primaryGap,
    overallReadiness,
    summaryInsight,
    nextRecommendedAction: nextAction,
  };
}
