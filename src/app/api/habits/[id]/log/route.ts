import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/session';
import { XP_REWARDS } from '@/lib/gamification';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    // Check if already logged today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existing = await prisma.habitLog.findFirst({
      where: { habitId: id, completedAt: { gte: today } },
    });

    if (existing) {
      return NextResponse.json({ error: 'Already logged today' }, { status: 400 });
    }

    // Create log
    const log = await prisma.habitLog.create({
      data: { habitId: id },
    });

    // Update streak
    const habit = await prisma.habit.findUnique({ where: { id } });
    if (habit) {
      const newStreak = habit.streak + 1;
      const bestStreak = Math.max(newStreak, habit.bestStreak);
      await prisma.habit.update({
        where: { id },
        data: { streak: newStreak, bestStreak },
      });

      // Award XP
      let xp = XP_REWARDS.HABIT_LOG;
      if (newStreak % 7 === 0) xp += XP_REWARDS.STREAK_BONUS;
      await prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: xp } },
      });
    }

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error('Habit log error:', error);
    return NextResponse.json({ error: 'Failed to log habit' }, { status: 500 });
  }
}
