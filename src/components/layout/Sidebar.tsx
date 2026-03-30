'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import {
  LayoutDashboard,
  CheckSquare,
  Repeat,
  DollarSign,
  BookOpen,
  BarChart3,
  MessageSquare,
  Settings,
  Sparkles,
  Trophy,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

interface SidebarProps {
  user?: { name?: string | null; email?: string | null; xp?: number; level?: number };
  xpProgress?: number;
}

export default function Sidebar({ user, xpProgress = 0 }: SidebarProps) {
  const t = useTranslations('nav');
  const tg = useTranslations('gamification');
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/tasks', label: t('tasks'), icon: CheckSquare },
    { href: '/habits', label: t('habits'), icon: Repeat },
    { href: '/finances', label: t('finances'), icon: DollarSign },
    { href: '/learning', label: t('learning'), icon: BookOpen },
    { href: '/analytics', label: t('analytics'), icon: BarChart3 },
    { href: '/chat', label: t('chat'), icon: MessageSquare },
    { href: '/settings', label: t('settings'), icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="flex items-center gap-2 p-6 border-b">
        <Sparkles className="h-7 w-7 text-primary" />
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
          Life OS
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-sidebar-accent'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Trophy className="h-4 w-4 text-amber-500" />
          <span>{tg('level')} {user?.level || 1}</span>
          <span className="ml-auto">{user?.xp || 0} {tg('xp')}</span>
        </div>
        <Progress value={xpProgress} className="h-2" />

        <div className="flex items-center gap-3 pt-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
          </div>
          <Link href="/api/auth/signout" className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
