import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/session';
import { getAIResponse, AI_PROMPTS } from '@/lib/ai';

export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json([]);

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const insights = await prisma.aIInsight.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json(insights);
  } catch (error) {
    console.error('AI Insights GET error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { type, context } = await req.json();

    const promptMap: Record<string, string> = {
      productivity: AI_PROMPTS.productivity,
      habit: AI_PROMPTS.habit,
      financial: AI_PROMPTS.financial,
      learning: AI_PROMPTS.learning,
      strategy: AI_PROMPTS.lifeStrategy,
    };

    const systemPrompt = promptMap[type] || AI_PROMPTS.assistant;
    const content = await getAIResponse(
      systemPrompt,
      `Analyze the following data and provide actionable insights: ${context}`,
    );

    const insight = await prisma.aIInsight.create({
      data: {
        userId,
        type: type || 'productivity',
        title: `${type?.charAt(0).toUpperCase()}${type?.slice(1)} Insight`,
        content,
        priority: 'medium',
      },
    });

    return NextResponse.json(insight, { status: 201 });
  } catch (error) {
    console.error('AI Insights POST error:', error);
    return NextResponse.json({
      content: 'AI insights are currently unavailable. Please configure your OpenAI API key in the environment variables.',
    });
  }
}
