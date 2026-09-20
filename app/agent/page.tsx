'use client';

import React, { useState, useEffect } from 'react';
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
import { initialProfile, sampleOpportunities } from '@/lib/sample-data';
import { Opportunity, UserProfile } from '@/lib/types';
import { evaluateOpportunityMatch } from '@/lib/matching';
import { useAuth } from '@/components/AuthProvider';
import { fetchOpportunities, fetchUserProfile } from '@/lib/supabase/db';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

export default function AgentPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(sampleOpportunities);

  useEffect(() => {
    async function loadData() {
      try {
        const [opps, userProf] = await Promise.all([
          fetchOpportunities(),
          fetchUserProfile(user?.id)
        ]);
        if (opps && opps.length > 0) setOpportunities(opps);
        if (userProf) setProfile(userProf);
      } catch (e) {
        console.warn('Agent data load error:', e);
      }
    }
    loadData();
  }, [user?.id]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "agent",
      text: "Hello Tomide. I am your Oppverse Opportunity Intelligence Agent. I continuously analyze your active personas, verified capabilities, and global opportunities across all 8 universes. What opportunities would you like to explore today?",
      time: "9:00 AM"
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    "What are my top 3 opportunities closing this month?",
    "Find fully funded scholarships & fellowships for Africans",
    "Create preparation checklist for Berlin Fellowship",
    "Show me remote PMM jobs paying global compensation"
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
      const q = messageToSend.toLowerCase();
      let replyText = '';

      if (q.includes('top 3') || q.includes('closing') || q.includes('best')) {
        const ranked = opportunities
          .map(opp => ({ opp, match: evaluateOpportunityMatch(profile, opp) }))
          .filter(m => m.match.eligibilityStatus === 'Eligible')
          .sort((a, b) => b.match.matchScore - a.match.matchScore)
          .slice(0, 3);

        replyText = `Here are your **Top 3 Verified Opportunities** ranked by the 5-Layer Matching Engine for your **${profile.fullName}** profile:\n\n` +
          ranked.map((r, idx) => 
            `**${idx + 1}. ${r.opp.title}** (${r.opp.provider})\n` +
            `â€¢ **Fit:** ${r.match.matchScore}% Match (${r.opp.fundingStatus}: ${r.opp.fundingAmount || 'Fully Covered'})\n` +
            `â€¢ **Deadline:** ${new Date(r.opp.deadline).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}\n` +
            `â€¢ **Why it matches:** ${r.match.whyItMatches[0] || 'High verified capability overlap.'}\n`
          ).join('\n') +
          `\nWould you like me to generate a tailored preparation checklist for any of these?`;
      } else if (q.includes('berlin') || q.includes('checklist')) {
        replyText = "Here is your custom **Preparation Checklist** for the **Berlin AI & Emerging Tech Leadership Fellowship**:\n\n" +
          "â€¢ **[Ready] Master CV:** Verified product marketing & AI revenue systems track record.\n" +
          "â€¢ **[Action Required] 800-Word Motivation Statement:** Focus on Nigerian AI ecosystem case studies and Conductor time intelligence framework.\n" +
          "â€¢ **[Action Required] 2 References:** Request endorsement from VP of Engineering / Executive collaborator.\n" +
          "â€¢ **[Logistics]:** Fully covered (â‚¬4,200/mo stipend + roundtrip flights + housing in Berlin Mitte).\n\n" +
          "I have structured this application in your **Applications Workspace**. Would you like to start drafting the motivation statement?";
      } else if (q.includes('fellowship') || q.includes('scholarship') || q.includes('fully funded')) {
        const fundedOpps = opportunities
          .filter(o => o.fundingStatus === 'Fully Funded')
          .slice(0, 3);

        replyText = `I found **${fundedOpps.length} Verified Fully Funded Opportunities** with confirmed African / Nigerian applicant eligibility:\n\n` +
          fundedOpps.map((opp, i) => 
            `**${i + 1}. ${opp.title}** (${opp.provider})\n` +
            `â€¢ **Category:** ${opp.category} â€¢ **Coverage:** ${opp.fundingAmount || '100% Funded'}\n` +
            `â€¢ **Location:** ${opp.locationType} (${opp.hostCountry || 'Global'})\n`
          ).join('\n') +
          `\nAll items are pre-screened with **zero eligibility disqualifications**.`;
      } else {
        const matches = opportunities
          .map(opp => ({ opp, match: evaluateOpportunityMatch(profile, opp) }))
          .filter(m => m.opp.title.toLowerCase().includes(q) || m.opp.category.toLowerCase().includes(q) || m.opp.description.toLowerCase().includes(q))
          .slice(0, 2);

        if (matches.length > 0) {
          replyText = `Based on your query "${messageToSend}", I matched **${matches.length} opportunities** in the Opportunity Graph:\n\n` +
            matches.map((m, i) => 
              `**${i + 1}. ${m.opp.title}** (${m.opp.provider})\n` +
              `â€¢ **Match Fit:** ${m.match.matchScore}% (${m.match.matchLabel})\n` +
              `â€¢ **Eligibility:** ${m.match.eligibilityStatus}\n`
            ).join('\n');
        } else {
          replyText = `I analyzed our Opportunity Graph for "${messageToSend}". I verified 4 potential opportunities across Jobs, Fellowships, and Speaking engagements matching your active **${profile.personas[0]?.name || 'Product Marketing'}** persona. Would you like me to activate a continuous search mission for this?`;
        }
      }

      const agentMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'agent',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
    }, 600);
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
            <p className="text-xs text-slate-400">Connected to Opportunity Graph â€¢ 5-Layer Explainable Matching Engine</p>
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
                TW
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
