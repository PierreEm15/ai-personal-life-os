'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, BookOpen, GraduationCap, Code, Languages, Sparkles } from 'lucide-react';
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
import type { LearningItemType } from '@/types';

const typeIcons: Record<string, React.ReactNode> = {
  course: <GraduationCap className="h-5 w-5" />,
  book: <BookOpen className="h-5 w-5" />,
  skill: <Code className="h-5 w-5" />,
  language: <Languages className="h-5 w-5" />,
};

export default function LearningPage() {
  const t = useTranslations('learning');
  const tc = useTranslations('common');
  const [items, setItems] = useState<LearningItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => { loadItems(); }, []);

  async function loadItems() {
    try {
      const res = await fetch('/api/learning');
      if (res.ok) { const d = await res.json(); setItems(Array.isArray(d) ? d : []); }
    } catch (error) { console.error('Failed to load learning items:', error); }
    finally { setLoading(false); }
  }

  async function createItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/learning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: fd.get('title'),
          type: fd.get('type'),
          category: fd.get('category'),
          url: fd.get('url'),
        }),
      });
      if (res.ok) { await loadItems(); setDialogOpen(false); }
    } catch (error) { console.error('Failed to create item:', error); }
  }

  async function updateProgress(id: string, progress: number) {
    try {
      await fetch(`/api/learning/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress, status: progress >= 100 ? 'completed' : 'in_progress' }),
      });
      await loadItems();
    } catch (error) { console.error('Failed to update progress:', error); }
  }

  const statusColor = (s: string) => {
    switch (s) {
      case 'completed': return 'success' as const;
      case 'in_progress': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopBar title={t('title')} />
        <main className="p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {['course', 'book', 'skill', 'language'].map((type) => (
              <Card key={type}>
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">{typeIcons[type]}</div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t(type as keyof IntlMessages['learning'])}</p>
                    <p className="text-2xl font-bold">{items.filter((i) => i.type === type).length}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t('title')}</h2>
            <div className="flex gap-2">
              <Button variant="outline">
                <Sparkles className="h-4 w-4 mr-2" />{t('aiLearningPlan')}
              </Button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button><Plus className="h-4 w-4 mr-2" />{t('newItem')}</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{t('newItem')}</DialogTitle></DialogHeader>
                  <form onSubmit={createItem} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input name="title" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select name="type" defaultValue="course">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="course">{t('course')}</SelectItem>
                          <SelectItem value="book">{t('book')}</SelectItem>
                          <SelectItem value="skill">{t('skill')}</SelectItem>
                          <SelectItem value="language">{t('languageItem')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Input name="category" />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('url')}</Label>
                      <Input name="url" type="url" />
                    </div>
                    <Button type="submit" className="w-full">{tc('create')}</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p className="text-muted-foreground col-span-full">{tc('loading')}</p>
            ) : items.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center text-muted-foreground">{tc('noData')}</CardContent>
              </Card>
            ) : (
              items.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="text-primary">{typeIcons[item.type]}</div>
                        <CardTitle className="text-base">{item.title}</CardTitle>
                      </div>
                      <Badge variant={statusColor(item.status)}>{t(item.status === 'not_started' ? 'notStarted' : item.status === 'in_progress' ? 'inProgress' : 'completed')}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t('progress')}</span>
                      <span className="font-medium">{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => updateProgress(item.id, Math.min(item.progress + 10, 100))}>
                        +10%
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => updateProgress(item.id, 100)}>
                        {t('completed')}
                      </Button>
                    </div>
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
