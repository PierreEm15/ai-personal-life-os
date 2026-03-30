import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/session';
import { XP_REWARDS } from '@/lib/gamification';

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json([]);

    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 50,
    });
    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Expenses GET error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const expense = await prisma.expense.create({
      data: {
        userId,
        amount: body.amount,
        category: body.category,
        description: body.description || null,
        date: body.date ? new Date(body.date) : new Date(),
        isRecurring: body.isRecurring || false,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: XP_REWARDS.EXPENSE_LOG } },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Expenses POST error:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
