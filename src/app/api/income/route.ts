import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/session';

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json([]);

    const incomes = await prisma.income.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 50,
    });
    return NextResponse.json(incomes);
  } catch (error) {
    console.error('Income GET error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const income = await prisma.income.create({
      data: {
        userId,
        amount: body.amount,
        source: body.source,
        description: body.description || null,
        date: body.date ? new Date(body.date) : new Date(),
        isRecurring: body.isRecurring || false,
      },
    });

    return NextResponse.json(income, { status: 201 });
  } catch (error) {
    console.error('Income POST error:', error);
    return NextResponse.json({ error: 'Failed to create income' }, { status: 500 });
  }
}
