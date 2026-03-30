import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/session';
import { XP_REWARDS } from '@/lib/gamification';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    const updateData: Record<string, unknown> = {};
    if (body.progress !== undefined) updateData.progress = body.progress;
    if (body.status) updateData.status = body.status;
    if (body.notes !== undefined) updateData.notes = body.notes;

    const item = await prisma.learningItem.update({
      where: { id, userId },
      data: updateData,
    });

    if (body.progress !== undefined) {
      await prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: XP_REWARDS.LEARNING_PROGRESS } },
      });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Learning PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update learning item' }, { status: 500 });
  }
}
