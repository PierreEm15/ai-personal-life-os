'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Plus,
  Sparkles,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import type { TaskItem } from '@/types';

export default function TasksPage() {
  const t = useTranslations('tasks');
  const tc = useTranslations('common');
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const task = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      priority: formData.get('priority') as string,
      dueDate: formData.get('dueDate') as string || null,
      projectName: formData.get('projectName') as string || null,
    };
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (res.ok) {
        await loadTasks();
        setDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  }

  async function updateTaskStatus(id: string, status: string) {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await loadTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }

  async function deleteTask(id: string) {
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      await loadTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  }

  async function getAISuggestions() {
    try {
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'productivity', context: JSON.stringify(tasks.slice(0, 10)) }),
      });
      if (res.ok) {
        alert((await res.json()).content || 'AI suggestion generated!');
      }
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return task.status !== 'done';
    if (filter === 'completed') return task.status === 'done';
    if (filter === 'overdue') return task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
    return true;
  });

  const priorityColor = (p: string) => {
    switch (p) {
      case 'urgent': return 'destructive';
      case 'high': return 'warning' as 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopBar title={t('title')} />
        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList>
                <TabsTrigger value="all">{t('allTasks')}</TabsTrigger>
                <TabsTrigger value="completed">{t('completed')}</TabsTrigger>
                <TabsTrigger value="overdue">{t('overdue')}</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex gap-2">
              <Button variant="outline" onClick={getAISuggestions}>
                <Sparkles className="h-4 w-4 mr-2" />
                {t('aiSuggest')}
              </Button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('newTask')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('newTask')}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={createTask} className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t('taskTitle')}</Label>
                      <Input name="title" required />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('description')}</Label>
                      <Textarea name="description" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t('priority')}</Label>
                        <Select name="priority" defaultValue="medium">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">{t('low')}</SelectItem>
                            <SelectItem value="medium">{t('medium')}</SelectItem>
                            <SelectItem value="high">{t('high')}</SelectItem>
                            <SelectItem value="urgent">{t('urgent')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>{t('dueDate')}</Label>
                        <Input name="dueDate" type="date" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('project')}</Label>
                      <Input name="projectName" />
                    </div>
                    <Button type="submit" className="w-full">{tc('create')}</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <p className="text-muted-foreground">{tc('loading')}</p>
            ) : filteredTasks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  {tc('noData')}
                </CardContent>
              </Card>
            ) : (
              filteredTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center gap-4 py-4">
                    <button
                      onClick={() => updateTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
                      className="shrink-0"
                    >
                      {task.status === 'done' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : task.status === 'in_progress' ? (
                        <Clock className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">{task.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        {task.projectName && (
                          <Badge variant="outline" className="text-xs">{task.projectName}</Badge>
                        )}
                        {task.dueDate && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        {task.aiSuggested && (
                          <Badge variant="secondary" className="text-xs">
                            <Sparkles className="h-3 w-3 mr-1" /> AI
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge variant={priorityColor(task.priority)}>{task.priority}</Badge>
                    <Select
                      value={task.status}
                      onValueChange={(value) => updateTaskStatus(task.id, value)}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">{t('todo')}</SelectItem>
                        <SelectItem value="in_progress">{t('inProgress')}</SelectItem>
                        <SelectItem value="done">{t('done')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
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
