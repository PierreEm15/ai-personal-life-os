import OpenAI from 'openai';

function getOpenAIClient(): OpenAI {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  });
}

export async function getAIResponse(
  systemPrompt: string,
  userMessage: string,
  context?: string
): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return 'AI service is not configured. Please set the OPENAI_API_KEY environment variable.';
    }

    const openai = getOpenAIClient();
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
    ];

    if (context) {
      messages.push({ role: 'system', content: `Context: ${context}` });
    }

    messages.push({ role: 'user', content: userMessage });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || 'No response generated.';
  } catch (error) {
    console.error('AI Error:', error);
    return 'AI service is currently unavailable. Please try again later.';
  }
}

export const AI_PROMPTS = {
  productivity: `You are a Productivity AI assistant. Analyze the user's tasks and schedule to suggest better time management strategies. Be specific, actionable, and encouraging.`,

  habit: `You are a Habit Optimization AI. Analyze the user's habit tracking data and suggest improvements, new habits to adopt, and strategies to maintain streaks. Be motivating and science-backed.`,

  financial: `You are a Financial Insight AI. Analyze the user's spending patterns, income, and expenses to provide actionable financial advice, savings recommendations, and budget optimization tips.`,

  learning: `You are a Learning Coach AI. Create personalized learning plans based on the user's goals, current progress, and available time. Suggest resources and optimal study strategies.`,

  lifeStrategy: `You are a Life Strategy AI. Generate comprehensive weekly and monthly life plans that balance productivity, health, learning, finances, and personal goals. Be holistic and practical.`,

  assistant: `You are the AI Personal Life OS assistant. You help users optimize their entire life - productivity, habits, finances, learning, and goals. You are knowledgeable, encouraging, and action-oriented. Provide specific, personalized advice based on the user's data and questions.`,
};

export default getOpenAIClient;
