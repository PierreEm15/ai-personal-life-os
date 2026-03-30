export const XP_REWARDS = {
  TASK_COMPLETE: 10,
  HABIT_LOG: 5,
  STREAK_BONUS: 15,
  EXPENSE_LOG: 3,
  LEARNING_PROGRESS: 8,
  GOAL_PROGRESS: 12,
  DAILY_LOGIN: 5,
  WEEKLY_REVIEW: 20,
};

export const LEVELS = [
  { level: 1, xpRequired: 0, title: 'Beginner' },
  { level: 2, xpRequired: 100, title: 'Starter' },
  { level: 3, xpRequired: 250, title: 'Learner' },
  { level: 4, xpRequired: 500, title: 'Achiever' },
  { level: 5, xpRequired: 1000, title: 'Organizer' },
  { level: 6, xpRequired: 2000, title: 'Optimizer' },
  { level: 7, xpRequired: 3500, title: 'Strategist' },
  { level: 8, xpRequired: 5000, title: 'Master' },
  { level: 9, xpRequired: 7500, title: 'Expert' },
  { level: 10, xpRequired: 10000, title: 'Life OS Champion' },
];

export const ACHIEVEMENTS = [
  { id: 'first_task', name: 'First Step', description: 'Complete your first task', icon: '🎯', xpReward: 20 },
  { id: 'streak_7', name: 'Week Warrior', description: '7-day habit streak', icon: '🔥', xpReward: 50 },
  { id: 'streak_30', name: 'Monthly Master', description: '30-day habit streak', icon: '⚡', xpReward: 200 },
  { id: 'tasks_10', name: 'Task Crusher', description: 'Complete 10 tasks', icon: '💪', xpReward: 30 },
  { id: 'tasks_100', name: 'Centurion', description: 'Complete 100 tasks', icon: '🏆', xpReward: 100 },
  { id: 'budget_set', name: 'Money Wise', description: 'Track your first expense', icon: '💰', xpReward: 15 },
  { id: 'learning_start', name: 'Knowledge Seeker', description: 'Start your first learning item', icon: '📚', xpReward: 15 },
  { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', icon: '⭐', xpReward: 100 },
  { id: 'level_10', name: 'Life OS Master', description: 'Reach level 10', icon: '👑', xpReward: 500 },
];

export function getLevelForXP(xp: number) {
  let currentLevel = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.xpRequired) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return currentLevel;
}

export function getXPToNextLevel(xp: number) {
  const currentLevel = getLevelForXP(xp);
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1);
  if (!nextLevel) return 0;
  return nextLevel.xpRequired - xp;
}

export function getXPProgress(xp: number) {
  const currentLevel = getLevelForXP(xp);
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1);
  if (!nextLevel) return 100;
  const levelXP = xp - currentLevel.xpRequired;
  const levelRange = nextLevel.xpRequired - currentLevel.xpRequired;
  return Math.round((levelXP / levelRange) * 100);
}
