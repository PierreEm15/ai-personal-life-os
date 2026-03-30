import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/session';

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json([]);

    const habits = await prisma.habit.findMany({
      where: { userId, isActive: true },
      include: {
        logs: {
          where: {
            completedAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const habitsWithStatus = habits.map((h) => ({
      ...h,
      todayCompleted: h.logs.length > 0,
    }));

    return NextResponse.json(habitsWithStatus);
  } catch (error) {
    console.error('Habits GET error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const habit = await prisma.habit.create({
      data: {
        userId,
        name: body.name,
        description: body.description || null,
        frequency: body.frequency || 'daily',
        color: body.color || '#6366f1',
        targetCount: body.targetCount || 1,
      },
    });

    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    console.error('Habits POST error:', error);
    return NextResponse.json({ error: 'Failed to create habit' }, { status: 500 });
  }
}
