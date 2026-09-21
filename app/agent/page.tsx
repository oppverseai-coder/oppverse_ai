'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquareText, 
  Send, 
  Sparkles,
  Bot,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import AgentMessageRenderer from '@/components/AgentMessageRenderer';
import { useAuth } from '@/components/AuthProvider';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

export default function AgentPage() {
  const { user } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "agent",
      text: "Hello. I am your Oppverse Opportunity Intelligence Agent. I analyze your active personas, verified capabilities, and global opportunities. What would you like to explore today?",
      time: "9:00 AM"
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = [
    "What are my top 3 opportunities closing this month?",
    "Find fully funded scholarships & fellowships for Africans",
    "Create preparation checklist for Berlin Fellowship",
    "Show me remote PMM jobs paying global compensation"
  ];

  const handleSend = async (text?: string) => {
    const messageToSend = text || inputVal;
    if (!messageToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: messageToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!text) setInputVal('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat/agent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: messageToSend }) });
      const payload = await response.json();
      const replyText = response.ok ? payload.reply : (payload.error || 'I could not load your opportunity context. Please try again.');
      const agentMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'agent',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, agentMsg]);
    } catch {
      setMessages(prev => [...prev, { id: String(Date.now() + 1), sender: 'agent', text: 'I could not load your opportunity context. Please try again.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn h-[calc(100vh-8rem)] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="icon-frame !w-10 !h-10 !flex-[0_0_40px]">
            <Bot className="icon-md text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-white flex items-center gap-2">
              Oppverse AI Copilot
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </h1>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'agent' && (
              <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center flex-shrink-0 text-cyan-400">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl transition-all ${
                msg.sender === 'user'
                  ? 'bg-zinc-100 text-zinc-950 px-4 py-3 font-medium text-xs'
                  : 'glass-panel border-slate-800 text-slate-200 p-4 text-xs leading-relaxed'
              }`}
            >
              {msg.sender === 'user' ? (
                <p className="whitespace-pre-line">{msg.text}</p>
              ) : (
                <AgentMessageRenderer 
                  content={msg.text} 
                  onActionClick={(actionText) => handleSend(actionText)} 
                />
              )}
              <span className={`text-[10px] mt-2 block text-right ${
                msg.sender === 'user' ? 'text-zinc-500' : 'opacity-60'
              }`}>
                {msg.time}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-300 font-bold text-xs">
                {(user?.user_metadata?.full_name || user?.email || 'ME').split(/[\s@]/).map((part: string) => part[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center flex-shrink-0 text-cyan-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="glass-panel border-slate-800 px-4 py-3 rounded-2xl text-slate-400 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] text-slate-400">Evaluating 5-layer match vectors...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompt Suggestions & Input */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="btn btn-secondary !min-h-8 !px-3 whitespace-nowrap text-xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Oppverse AI about verified opportunities, eligibility, or checklist strategies..."
            className="w-full pl-4 pr-12 py-3 rounded-2xl glass-input text-xs"
          />
          <button
            onClick={() => handleSend()}
            className="icon-button absolute right-2 top-1/2 -translate-y-1/2 !bg-zinc-100 !text-zinc-950 hover:!bg-white"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
