'use client';

import { useTranslations } from 'next-intl';
import { User, CreditCard, Globe, Bell, Palette, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { PLANS } from '@/lib/stripe';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const tc = useTranslations('common');

  async function handleUpgrade() {
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      if (res.ok) {
        const { url } = await res.json();
        if (url) window.location.href = url;
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopBar title={t('title')} />
        <main className="p-6 space-y-6 max-w-3xl">
          {/* Profile */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>{t('profile')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{tc('name')}</Label>
                <Input defaultValue="User" />
              </div>
              <div className="space-y-2">
                <Label>{tc('email')}</Label>
                <Input type="email" defaultValue="user@example.com" />
              </div>
              <Button>{tc('save')}</Button>
            </CardContent>
          </Card>

          {/* Language */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <CardTitle>{t('language')}</CardTitle>
              </div>
              <CardDescription>Choose your preferred language</CardDescription>
            </CardHeader>
            <CardContent>
              <LanguageSwitcher />
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <CardTitle>{t('subscription')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="text-sm">{t('currentPlan')}:</span>
                <Badge>{tc('free')}</Badge>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                {/* Free Plan */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {PLANS.free.name}
                      <Badge variant="secondary">Current</Badge>
                    </CardTitle>
                    <CardDescription>$0/month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {PLANS.free.features.map((f) => (
                        <li key={f} className="text-sm flex items-center gap-2">
                          <span className="text-emerald-500">&#10003;</span> {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Premium Plan */}
                <Card className="border-2 border-primary relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg">
                    <Crown className="h-3 w-3 inline mr-1" />
                    Recommended
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {PLANS.premium.name}
                    </CardTitle>
                    <CardDescription>$15/month</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {PLANS.premium.features.map((f) => (
                        <li key={f} className="text-sm flex items-center gap-2">
                          <span className="text-emerald-500">&#10003;</span> {f}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" onClick={handleUpgrade}>
                      <Crown className="h-4 w-4 mr-2" />
                      {tc('upgrade')}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <CardTitle>{t('notifications')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">AI Insights</p>
                  <p className="text-xs text-muted-foreground">Receive AI-generated insights and suggestions</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Task Reminders</p>
                  <p className="text-xs text-muted-foreground">Get notified about upcoming task deadlines</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Habit Reminders</p>
                  <p className="text-xs text-muted-foreground">Daily reminders for your habits</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Weekly Report</p>
                  <p className="text-xs text-muted-foreground">Weekly summary of your progress</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
