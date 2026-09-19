'use client';

import React, { useState } from 'react';
import { 
  Target, 
  Sparkles, 
  Plus, 
  Play, 
  CheckCircle2, 
  Clock, 
  Globe2, 
  Zap, 
  Layers,
  ArrowRight,
  Bot,
  Sliders
} from 'lucide-react';
import { sampleMissions, sampleOpportunities, initialProfile } from '@/lib/sample-data';
import { Mission } from '@/lib/types';
import Link from 'next/link';

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>(sampleMissions);
  const [isCreating, setIsCreating] = useState(false);
  const [newPrompt, setNewPrompt] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const handleCreateMission = () => {
    if (!newPrompt.trim() || !newTitle.trim()) return;

    const mission: Mission = {
      id: `msn_${Date.now()}`,
      title: newTitle,
      prompt: newPrompt,
      targetCategories: ['Jobs', 'Fellowships'],
      countries: ['Remote', 'Global'],
      fundingPreference: 'Fully Funded',
      isActive: true,
      matchCount: 4,
      lastRunAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    setMissions([mission, ...missions]);
    setNewPrompt('');
    setNewTitle('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center shadow-glow">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-white">
              My Missions (Autonomous Search Agents)
            </h1>
            <p className="text-sm text-slate-400">
              Persistent instructions to Oppverse to continuously hunt specific opportunities across the internet.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-glow flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Create Opportunity Mission
        </button>
      </div>

      {/* Mission Creator Modal / Form */}
      {isCreating && (
        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/40 shadow-glow space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" /> Create Persistent Opportunity Mission
            </h3>
            <span className="text-xs text-slate-400">Runs autonomously 24/7</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Mission Name</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Find Remote AI Product Lead Roles"
                className="w-full p-2.5 rounded-xl glass-input text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Natural-Language Instructions to Oppverse Agent
              </label>
              <textarea
                rows={3}
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                placeholder="e.g. Find fully funded 2026/2027 fellowships in technology leadership or public policy open to Nigerian citizens with travel coverage..."
                className="w-full p-2.5 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateMission}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-glow"
            >
              Activate Mission
            </button>
          </div>
        </div>
      )}

      {/* Active Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {missions.map((mission) => (
          <div 
            key={mission.id}
            className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Agent
                </span>
                <span className="text-xs font-bold text-cyan-400 font-mono">
                  {mission.matchCount} Matches Found
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                {mission.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                "{mission.prompt}"
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" /> Ingested 6h ago
              </span>
              <Link 
                href="/discover"
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                View Matches <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
