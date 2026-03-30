'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, AreaChart, Area,
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export default function AnalyticsPage() {
  const t = useTranslations('analytics');

  const productivityData = [
    { week: 'W1', score: 65 }, { week: 'W2', score: 72 },
    { week: 'W3', score: 68 }, { week: 'W4', score: 78 },
    { week: 'W5', score: 82 }, { week: 'W6', score: 75 },
    { week: 'W7', score: 85 }, { week: 'W8', score: 88 },
  ];

  const habitData = [
    { name: 'Exercise', rate: 85 }, { name: 'Reading', rate: 72 },
    { name: 'Meditation', rate: 90 }, { name: 'Journaling', rate: 65 },
    { name: 'Water', rate: 95 },
  ];

  const spendingTrend = [
    { month: 'Jan', amount: 2400 }, { month: 'Feb', amount: 2200 },
    { month: 'Mar', amount: 2800 }, { month: 'Apr', amount: 2100 },
    { month: 'May', amount: 2500 }, { month: 'Jun', amount: 2300 },
  ];

  const radarData = [
    { subject: 'Productivity', value: 85 }, { subject: 'Health', value: 70 },
    { subject: 'Finance', value: 75 }, { subject: 'Learning', value: 80 },
    { subject: 'Habits', value: 90 }, { subject: 'Goals', value: 65 },
  ];

  const taskCompletionData = [
    { day: 'Mon', completed: 5, total: 6 }, { day: 'Tue', completed: 4, total: 7 },
    { day: 'Wed', completed: 6, total: 6 }, { day: 'Thu', completed: 3, total: 5 },
    { day: 'Fri', completed: 7, total: 8 }, { day: 'Sat', completed: 2, total: 3 },
    { day: 'Sun', completed: 1, total: 2 },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopBar title={t('title')} />
        <main className="p-6 space-y-6">
          {/* Score Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: t('productivityScore'), score: 85, color: 'text-primary' },
              { label: t('habitSuccessRate'), score: 82, color: 'text-emerald-500' },
              { label: t('financialHealth'), score: 75, color: 'text-amber-500' },
              { label: t('learningProgress'), score: 68, color: 'text-violet-500' },
            ].map((item) => (
              <Card key={item.label}>
                <CardContent className="pt-6 text-center space-y-2">
                  <p className={`text-4xl font-bold ${item.color}`}>{item.score}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <Progress value={item.score} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Productivity Trend */}
            <Card>
              <CardHeader><CardTitle>{t('weeklyTrend')}</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={productivityData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Life Balance Radar */}
            <Card>
              <CardHeader><CardTitle>Life Balance</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" className="text-xs" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Task Completion */}
            <Card>
              <CardHeader><CardTitle>{t('taskCompletion')}</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={taskCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Spending Trend */}
            <Card>
              <CardHeader><CardTitle>{t('spendingTrend')}</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={spendingTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Habits */}
            <Card className="md:col-span-2">
              <CardHeader><CardTitle>{t('topHabits')}</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {habitData.map((habit) => (
                    <div key={habit.name} className="flex items-center gap-4">
                      <span className="w-24 text-sm font-medium">{habit.name}</span>
                      <Progress value={habit.rate} className="flex-1 h-3" />
                      <span className="w-12 text-sm text-right font-medium">{habit.rate}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
