'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  CheckCircle2,
  Repeat,
  DollarSign,
  BookOpen,
  Zap,
  TrendingUp,
  Flame,
  Target,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import { getXPProgress } from '@/lib/gamification';
import type { DashboardStats, TaskItem, AIInsightItem } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#10b981', '#f59e0b', '#ef4444'];

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [insights, setInsights] = useState<AIInsightItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, tasksRes, insightsRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/tasks?limit=5&status=todo'),
          fetch('/api/ai/insights?limit=3'),
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
        if (tasksRes.ok) {
          const data = await tasksRes.json();
          setTasks(Array.isArray(data) ? data : []);
        }
        if (insightsRes.ok) {
          const data = await insightsRes.json();
          setInsights(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const weeklyData = [
    { day: 'Mon', tasks: 4, habits: 3 },
    { day: 'Tue', tasks: 6, habits: 5 },
    { day: 'Wed', tasks: 3, habits: 4 },
    { day: 'Thu', tasks: 7, habits: 5 },
    { day: 'Fri', tasks: 5, habits: 3 },
    { day: 'Sat', tasks: 2, habits: 4 },
    { day: 'Sun', tasks: 1, habits: 2 },
  ];

  const categoryData = [
    { name: 'Food', value: 35 },
    { name: 'Transport', value: 20 },
    { name: 'Entertainment', value: 15 },
    { name: 'Utilities', value: 20 },
    { name: 'Shopping', value: 10 },
  ];

  const productivityScore = stats?.productivityScore || 78;
  const xpProgress = getXPProgress(stats?.xp || 0);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        user={{ name: 'User', xp: stats?.xp || 0, level: stats?.level || 1 }}
        xpProgress={xpProgress}
      />

      <div className="flex-1 ml-64">
        <TopBar title={t('title')} />

        <main className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t('tasksCompleted')}</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.tasksCompleted || 0}/{stats?.totalTasks || 0}</div>
                <Progress value={stats?.totalTasks ? (stats.tasksCompleted / stats.totalTasks) * 100 : 0} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-chart-5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t('habitsTracked')}</CardTitle>
                <Repeat className="h-5 w-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeHabits || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.habitCompletionRate || 0}% {t('habitProgress')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t('monthlySpending')}</CardTitle>
                <DollarSign className="h-5 w-5 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats?.monthlyExpenses?.toFixed(0) || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Income: ${stats?.monthlyIncome?.toFixed(0) || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-chart-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t('productivityScore')}</CardTitle>
                <Zap className="h-5 w-5 text-violet-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productivityScore}/100</div>
                <Progress value={productivityScore} className="mt-2 h-2" />
              </CardContent>
            </Card>
          </div>

          {/* Gamification Bar */}
          <Card className="bg-gradient-to-r from-primary/10 via-chart-2/10 to-chart-5/10">
            <CardContent className="flex items-center gap-6 py-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-sm font-medium">{t('level')} {stats?.level || 1}</p>
                  <p className="text-xs text-muted-foreground">{stats?.xp || 0} {t('xp')}</p>
                </div>
              </div>
              <div className="flex-1">
                <Progress value={xpProgress} className="h-3" />
              </div>
              <div className="flex items-center gap-2">
                <Flame className="h-6 w-6 text-orange-500" />
                <div>
                  <p className="text-sm font-bold">{stats?.streakDays || 0}</p>
                  <p className="text-xs text-muted-foreground">{t('streak')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Today's Tasks */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{t('todaysTasks')}</CardTitle>
                <Target className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t('noTasks')}</p>
                ) : (
                  tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                      <div className={`h-2 w-2 rounded-full ${
                        task.priority === 'urgent' ? 'bg-destructive' :
                        task.priority === 'high' ? 'bg-amber-500' :
                        task.priority === 'medium' ? 'bg-primary' : 'bg-muted-foreground'
                      }`} />
                      <span className="text-sm flex-1">{task.title}</span>
                      <Badge variant={task.priority === 'urgent' ? 'destructive' : 'secondary'} className="text-xs">
                        {task.priority}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{t('aiSuggestion')}</CardTitle>
                <Sparkles className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent className="space-y-3">
                {insights.length === 0 ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-sm font-medium text-primary">Productivity Tip</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Start your day with the most important task. Research shows that tackling your hardest task first leads to 40% higher completion rates.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-chart-5/5 border border-chart-5/10">
                      <p className="text-sm font-medium text-emerald-600">Habit Insight</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Consider adding a morning routine habit. Users with morning routines are 2x more productive throughout the day.
                      </p>
                    </div>
                  </div>
                ) : (
                  insights.map((insight) => (
                    <div key={insight.id} className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-sm font-medium">{insight.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{insight.content}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Weekly Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('weeklyInsights')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="tasks" fill="#6366f1" radius={[4, 4, 0, 0]} name="Tasks" />
                    <Bar dataKey="habits" fill="#10b981" radius={[4, 4, 0, 0]} name="Habits" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Spending by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('financialSummary')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label>
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
