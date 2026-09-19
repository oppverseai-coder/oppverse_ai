'use client';

import React, { useState } from 'react';
import { 
  MessageSquareText,
  Send, 
  ArrowRight
} from 'lucide-react';
import AgentMessageRenderer from '@/components/AgentMessageRenderer';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

export default function AgentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "agent",
      text: "Hello Tomide. I am your Oppverse Opportunity Agent. I continuously analyze your profile, active personas, and global opportunities across 16 categories. How can I assist your opportunity search today?",
      time: "9:00 AM"
    },
    {
      id: "2",
      sender: "user",
      text: "What are my top 3 opportunities closing this month?",
      time: "9:01 AM"
    },
    {
      id: "3",
      sender: "agent",
      text: "Here are your highest-priority matches with upcoming deadlines:\n\n1. **Berlin AI & Emerging Tech Leadership Fellowship** (Bosch & Techstars)\n• Fit: 94% Match (Fully Funded: €4,200/mo + Flights + Housing)\n• Deadline: October 8, 2026\n\n2. **AI Product Summit London (Call for Speakers)**\n• Fit: 89% Match (Keynote flights & VIP accommodation covered)\n• Deadline: September 30, 2026\n\n3. **Senior Product Marketing Manager (AI)** (Synthesia)\n• Fit: 91% Match (Remote global, $120k–$155k)\n• Deadline: October 15, 2026\n\nWould you like me to generate an application checklist for the Berlin Fellowship?",
      time: "9:01 AM"
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    "Find fully funded scholarships for Africans",
    "Create preparation checklist for Berlin Fellowship",
    "Show me remote PMM jobs paying global rates",
    "Find speaking opportunities with travel stipends"
  ];

  const handleSend = (text?: string) => {
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

    setTimeout(() => {
      let replyText = `Based on your verified Oppverse profile and current goals, I have analyzed our Opportunity Graph for "${messageToSend}". I found 4 matching verified opportunities with Nigerian eligibility active. All results are ranked without hallucinated criteria.`;

      if (messageToSend.toLowerCase().includes('berlin') || messageToSend.toLowerCase().includes('checklist')) {
        replyText = "Here is your custom preparation checklist for the **Berlin AI & Emerging Tech Leadership Fellowship**:\n\n• **Executive CV Update:** Tailor your experience toward AI systems and GTM leadership.\n• **Statement of Intent:** Emphasize your unique perspective leading emerging market AI products.\n• **2 Letters of Recommendation:** Request from senior engineering / executive collaborators.\n• **Pitch Deck / Portfolio:** Attach proof of shipped systems.\n\nWould you like me to create an active Workspace tracker for this fellowship?";
      }

      const agentMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'agent',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="space-y-6 animate-fadeIn h-[calc(100vh-8rem)] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="icon-frame !w-10 !h-10 !flex-[0_0_40px]">
            <MessageSquareText className="icon-md" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-white flex items-center gap-2">
              Oppverse AI Agent
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </h1>
            <p className="text-xs text-slate-400">Grounded in the Opportunity Graph • Zero Hallucinations</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'agent' && (
              <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center flex-shrink-0 text-cyan-400">
                <MessageSquareText className="w-4 h-4" />
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
                TW
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center flex-shrink-0 text-cyan-400">
              <MessageSquareText className="w-4 h-4" />
            </div>
            <div className="glass-panel border-slate-800 px-4 py-3 rounded-2xl text-slate-400 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-[11px] text-slate-400">Analyzing Opportunity Graph...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompt Suggestions & Input */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
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
            placeholder="Ask Oppverse AI anything about your opportunities, eligibility, or applications..."
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
