export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  xp: number;
  level: number;
  streakDays: number;
  locale: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'done';
  dueDate: string | null;
  projectName: string | null;
  isRecurring: boolean;
  aiSuggested: boolean;
  completedAt: string | null;
  createdAt: string;
}

export interface HabitItem {
  id: string;
  name: string;
  description: string | null;
  frequency: 'daily' | 'weekly';
  targetCount: number;
  color: string;
  streak: number;
  bestStreak: number;
  isActive: boolean;
  todayCompleted?: boolean;
  logs?: HabitLogItem[];
}

export interface HabitLogItem {
  id: string;
  habitId: string;
  completedAt: string;
  count: number;
  note: string | null;
}

export interface ExpenseItem {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string;
  isRecurring: boolean;
}

export interface IncomeItem {
  id: string;
  amount: number;
  source: string;
  description: string | null;
  date: string;
  isRecurring: boolean;
}

export interface LearningItemType {
  id: string;
  title: string;
  type: 'course' | 'book' | 'skill' | 'language';
  category: string | null;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  notes: string | null;
  url: string | null;
}

export interface AIInsightItem {
  id: string;
  type: string;
  title: string;
  content: string;
  priority: string;
  isRead: boolean;
  createdAt: string;
}

export interface AchievementItem {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  xpReward: number;
  unlockedAt: string;
}

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface DashboardStats {
  tasksCompleted: number;
  totalTasks: number;
  activeHabits: number;
  habitCompletionRate: number;
  monthlyExpenses: number;
  monthlyIncome: number;
  learningItems: number;
  productivityScore: number;
  xp: number;
  level: number;
  streakDays: number;
}
