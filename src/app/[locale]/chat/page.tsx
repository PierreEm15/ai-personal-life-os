'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Send, Sparkles, Bot, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import type { ChatMessageItem } from '@/types';

export default function ChatPage() {
  const t = useTranslations('chat');
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadHistory() {
    try {
      const res = await fetch('/api/ai/chat');
      if (res.ok) {
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }

  async function sendMessage(content?: string) {
    const text = content || input.trim();
    if (!text) return;
    setInput('');
    setLoading(true);

    const userMsg: ChatMessageItem = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessageItem = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.content || data.message || 'I apologize, I could not generate a response.',
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = [
    { label: t('suggestWeeklyPlan'), prompt: 'Create a detailed weekly plan to optimize my productivity, health, and learning goals.' },
    { label: t('analyzeHabits'), prompt: 'Analyze my current habits and suggest improvements for better consistency and impact.' },
    { label: t('financialAdvice'), prompt: 'Review my spending patterns and suggest ways to save money and improve my financial health.' },
    { label: t('productivityTips'), prompt: 'Give me personalized productivity tips based on common time management challenges.' },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-screen">
        <TopBar title={t('title')} />

        <div className="flex-1 flex flex-col p-6 min-h-0">
          <Card className="flex-1 flex flex-col min-h-0">
            <CardHeader className="pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>{t('title')}</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col min-h-0 pb-0">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4 pb-4">
                  {messages.length === 0 && (
                    <div className="text-center py-12">
                      <Bot className="h-16 w-16 text-primary/20 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Your AI Life Assistant</h3>
                      <p className="text-muted-foreground text-sm mb-6">
                        Ask me anything about productivity, habits, finances, or life optimization.
                      </p>
                      <div className="grid grid-cols-2 gap-2 max-w-lg mx-auto">
                        {suggestions.map((s) => (
                          <Button
                            key={s.label}
                            variant="outline"
                            size="sm"
                            className="text-xs h-auto py-2 px-3"
                            onClick={() => sendMessage(s.prompt)}
                          >
                            {s.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      {msg.role === 'user' && (
                        <div className="shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div className="flex gap-3">
                      <div className="shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="bg-muted rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" />
                          <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.1s]" />
                          <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.2s]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              <div className="py-4 shrink-0">
                <form
                  onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                  className="flex gap-2"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('placeholder')}
                    disabled={loading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={loading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
