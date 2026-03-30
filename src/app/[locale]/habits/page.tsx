'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Flame, Trophy, TrendingUp, CheckCircle2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import type { HabitItem } from '@/types';

export default function HabitsPage() {
  const t = useTranslations('habits');
  const tc = useTranslations('common');
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => { loadHabits(); }, []);

  async function loadHabits() {
    try {
      const res = await fetch('/api/habits');
      if (res.ok) {
        const data = await res.json();
        setHabits(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to load habits:', error);
    } finally { setLoading(false); }
  }

  async function createHabit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          description: formData.get('description'),
          frequency: formData.get('frequency'),
          color: formData.get('color') || '#6366f1',
        }),
      });
      if (res.ok) { await loadHabits(); setDialogOpen(false); }
    } catch (error) { console.error('Failed to create habit:', error); }
  }

  async function logHabit(habitId: string) {
    try {
      await fetch(`/api/habits/${habitId}/log`, { method: 'POST' });
      await loadHabits();
    } catch (error) { console.error('Failed to log habit:', error); }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopBar title={t('title')} />
        <main className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="p-3 rounded-full bg-orange-500/10">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('streak')}</p>
                  <p className="text-2xl font-bold">
                    {habits.reduce((max, h) => Math.max(max, h.streak), 0)} days
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="p-3 rounded-full bg-amber-500/10">
                  <Trophy className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('bestStreak')}</p>
                  <p className="text-2xl font-bold">
                    {habits.reduce((max, h) => Math.max(max, h.bestStreak), 0)} days
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="p-3 rounded-full bg-emerald-500/10">
                  <TrendingUp className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('completionRate')}</p>
                  <p className="text-2xl font-bold">{habits.length > 0 ? '85' : '0'}%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t('today')}</h2>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />{t('newHabit')}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('newHabit')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={createHabit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('habitName')}</Label>
                    <Input name="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input name="description" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('frequency')}</Label>
                    <Select name="frequency" defaultValue="daily">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">{t('daily')}</SelectItem>
                        <SelectItem value="weekly">{t('weekly')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Input name="color" type="color" defaultValue="#6366f1" />
                  </div>
                  <Button type="submit" className="w-full">{tc('create')}</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p className="text-muted-foreground col-span-full">{tc('loading')}</p>
            ) : habits.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center text-muted-foreground">
                  {tc('noData')}
                </CardContent>
              </Card>
            ) : (
              habits.map((habit) => (
                <Card key={habit.id} className="overflow-hidden">
                  <div className="h-1" style={{ backgroundColor: habit.color }} />
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{habit.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">{habit.frequency}</Badge>
                    </div>
                    {habit.description && (
                      <p className="text-xs text-muted-foreground">{habit.description}</p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Flame className="h-4 w-4 text-orange-500" />
                        {habit.streak} day streak
                      </span>
                      <span className="text-muted-foreground">Best: {habit.bestStreak}</span>
                    </div>
                    <Progress value={Math.min(habit.streak * 10, 100)} className="h-2" />
                    <Button
                      onClick={() => logHabit(habit.id)}
                      className="w-full"
                      variant={habit.todayCompleted ? 'secondary' : 'default'}
                      disabled={habit.todayCompleted}
                    >
                      {habit.todayCompleted ? (
                        <><CheckCircle2 className="h-4 w-4 mr-2" /> Completed</>
                      ) : (
                        t('logHabit')
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
