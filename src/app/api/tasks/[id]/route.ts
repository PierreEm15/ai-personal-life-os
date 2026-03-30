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
    if (body.title) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.priority) updateData.priority = body.priority;
    if (body.status) {
      updateData.status = body.status;
      if (body.status === 'done') {
        updateData.completedAt = new Date();
        await prisma.user.update({
          where: { id: userId },
          data: { xp: { increment: XP_REWARDS.TASK_COMPLETE } },
        });
      }
    }
    if (body.dueDate) updateData.dueDate = new Date(body.dueDate);

    const task = await prisma.task.update({
      where: { id, userId },
      data: updateData,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Task PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await prisma.task.delete({ where: { id, userId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Task DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
