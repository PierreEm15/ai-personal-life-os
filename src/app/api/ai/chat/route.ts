import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/session';
import { getAIResponse, AI_PROMPTS } from '@/lib/ai';

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json([]);

    const messages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Chat GET error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Save user message
    await prisma.chatMessage.create({
      data: { userId, role: 'user', content: message },
    });

    // Get user context
    const [tasks, habits, expenses] = await Promise.all([
      prisma.task.findMany({ where: { userId }, take: 10, orderBy: { createdAt: 'desc' } }),
      prisma.habit.findMany({ where: { userId, isActive: true } }),
      prisma.expense.findMany({ where: { userId }, take: 10, orderBy: { date: 'desc' } }),
    ]);

    const context = `User's recent tasks: ${tasks.map((t) => `${t.title} (${t.status})`).join(', ')}. Active habits: ${habits.map((h) => `${h.name} (streak: ${h.streak})`).join(', ')}. Recent expenses: ${expenses.map((e) => `$${e.amount} on ${e.category}`).join(', ')}.`;

    // Get AI response
    const aiContent = await getAIResponse(AI_PROMPTS.assistant, message, context);

    // Save AI response
    const aiMessage = await prisma.chatMessage.create({
      data: { userId, role: 'assistant', content: aiContent },
    });

    return NextResponse.json(aiMessage);
  } catch (error) {
    console.error('Chat POST error:', error);
    return NextResponse.json({
      id: Date.now().toString(),
      role: 'assistant',
      content: 'I apologize, but I\'m currently unable to process your request. Please make sure the OpenAI API key is configured. In the meantime, here are some general tips: 1) Break large tasks into smaller ones, 2) Track your habits daily, 3) Review your finances weekly.',
      createdAt: new Date().toISOString(),
    });
  }
}
