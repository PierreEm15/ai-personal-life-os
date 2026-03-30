'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, TrendingUp, TrendingDown, Wallet, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import { formatCurrency } from '@/lib/utils';
import type { ExpenseItem, IncomeItem } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#64748b'];
const EXPENSE_CATEGORIES = ['food', 'transport', 'entertainment', 'utilities', 'shopping', 'health', 'education', 'other'];
const INCOME_SOURCES = ['salary', 'freelance', 'investment', 'otherIncome'];

export default function FinancesPage() {
  const t = useTranslations('finances');
  const tc = useTranslations('common');
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [incomes, setIncomes] = useState<IncomeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [expRes, incRes] = await Promise.all([
        fetch('/api/expenses'),
        fetch('/api/income'),
      ]);
      if (expRes.ok) { const d = await expRes.json(); setExpenses(Array.isArray(d) ? d : []); }
      if (incRes.ok) { const d = await incRes.json(); setIncomes(Array.isArray(d) ? d : []); }
    } catch (error) { console.error('Failed to load financial data:', error); }
    finally { setLoading(false); }
  }

  async function createExpense(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(fd.get('amount') as string),
          category: fd.get('category'),
          description: fd.get('description'),
          date: fd.get('date') || new Date().toISOString(),
        }),
      });
      if (res.ok) { await loadData(); setExpenseDialogOpen(false); }
    } catch (error) { console.error('Failed to create expense:', error); }
  }

  async function createIncome(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(fd.get('amount') as string),
          source: fd.get('source'),
          description: fd.get('description'),
          date: fd.get('date') || new Date().toISOString(),
        }),
      });
      if (res.ok) { await loadData(); setIncomeDialogOpen(false); }
    } catch (error) { console.error('Failed to create income:', error); }
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const balance = totalIncome - totalExpenses;
  const healthScore = totalIncome > 0 ? Math.min(Math.round(((totalIncome - totalExpenses) / totalIncome) * 100), 100) : 0;

  const categoryData = EXPENSE_CATEGORIES.map((cat) => ({
    name: t(cat as keyof IntlMessages['finances']),
    value: expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter((d) => d.value > 0);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopBar title={t('title')} />
        <main className="p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-l-4 border-l-emerald-500">
              <CardContent className="flex items-center gap-4 py-4">
                <TrendingUp className="h-8 w-8 text-emerald-500" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('income')}</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="flex items-center gap-4 py-4">
                <TrendingDown className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('expenses')}</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-primary">
              <CardContent className="flex items-center gap-4 py-4">
                <Wallet className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('balance')}</p>
                  <p className={`text-2xl font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatCurrency(balance)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="flex items-center gap-4 py-4">
                <Sparkles className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('healthScore')}</p>
                  <p className="text-2xl font-bold">{healthScore}/100</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-2">
            <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive"><Plus className="h-4 w-4 mr-2" />{t('addExpense')}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{t('addExpense')}</DialogTitle></DialogHeader>
                <form onSubmit={createExpense} className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('amount')}</Label>
                    <Input name="amount" type="number" step="0.01" required />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('category')}</Label>
                    <Select name="category" defaultValue="food">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {EXPENSE_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>{t(c as keyof IntlMessages['finances'])}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('description')}</Label>
                    <Input name="description" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('date')}</Label>
                    <Input name="date" type="date" />
                  </div>
                  <Button type="submit" className="w-full">{tc('create')}</Button>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={incomeDialogOpen} onOpenChange={setIncomeDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />{t('addIncome')}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{t('addIncome')}</DialogTitle></DialogHeader>
                <form onSubmit={createIncome} className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('amount')}</Label>
                    <Input name="amount" type="number" step="0.01" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Source</Label>
                    <Select name="source" defaultValue="salary">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {INCOME_SOURCES.map((s) => (
                          <SelectItem key={s} value={s}>{t(s as keyof IntlMessages['finances'])}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('description')}</Label>
                    <Input name="description" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('date')}</Label>
                    <Input name="date" type="date" />
                  </div>
                  <Button type="submit" className="w-full">{tc('create')}</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>{t('spendingByCategory')}</CardTitle></CardHeader>
              <CardContent>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label>
                        {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-muted-foreground py-12">{tc('noData')}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>{t('expenses')}</CardTitle></CardHeader>
              <CardContent className="space-y-2 max-h-72 overflow-y-auto">
                {expenses.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">{tc('noData')}</p>
                ) : (
                  expenses.slice(0, 10).map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                      <div>
                        <p className="text-sm font-medium">{expense.description || expense.category}</p>
                        <p className="text-xs text-muted-foreground">{new Date(expense.date).toLocaleDateString()}</p>
                      </div>
                      <span className="text-sm font-medium text-red-600">-{formatCurrency(expense.amount)}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
