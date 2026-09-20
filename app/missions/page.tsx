'use client';

import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Plus, 
  Play, 
  CheckCircle2, 
  Clock, 
  Globe2, 
  Zap, 
  Layers,
  ArrowRight,
  Search,
  Sliders,
  Loader2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { sampleMissions } from '@/lib/sample-data';
import { Mission } from '@/lib/types';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { fetchUserMissions, saveUserMission } from '@/lib/supabase/db';

export default function MissionsPage() {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>(sampleMissions);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newPrompt, setNewPrompt] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runningMissionId, setRunningMissionId] = useState<string | null>(null);
  const [sweepActive, setSweepActive] = useState(false);

  useEffect(() => {
    async function loadMissions() {
      setLoading(true);
      try {
        const data = await fetchUserMissions(user?.id);
        if (data && data.length > 0) setMissions(data);
      } catch (e) {
        console.warn('Error loading missions:', e);
      } finally {
        setLoading(false);
      }
    }
    loadMissions();
  }, [user?.id]);

  const handleCreateMission = async () => {
    if (!newPrompt.trim() || !newTitle.trim()) return;

    setIsSubmitting(true);
    const newMissionObj: Mission = {
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

    try {
      if (user?.id) {
        await saveUserMission(user.id, {
          title: newTitle,
          prompt: newPrompt,
          categories: ['Jobs', 'Fellowships']
        });
      }
      setMissions([newMissionObj, ...missions]);
      setNewPrompt('');
      setNewTitle('');
      setIsCreating(false);
    } catch (err) {
      console.warn('Saved mission locally:', err);
      setMissions([newMissionObj, ...missions]);
      setNewPrompt('');
      setNewTitle('');
      setIsCreating(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunMission = async (missionId: string, prompt: string) => {
    setRunningMissionId(missionId);
    try {
      const res = await fetch('/api/missions/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionId,
          prompt,
          userId: user?.id
        })
      });
      const data = await res.json();
      if (data.success) {
        setMissions(prev => prev.map(m => m.id === missionId ? {
          ...m,
          matchCount: data.matchCount,
          lastRunAt: data.lastRunAt
        } : m));
      }
    } catch (err) {
      console.warn('Mission run error:', err);
    } finally {
      setTimeout(() => setRunningMissionId(null), 800);
    }
  };

  const handleGlobalSweep = async () => {
    setSweepActive(true);
    try {
      for (const m of missions) {
        await fetch('/api/missions/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ missionId: m.id, prompt: m.prompt, userId: user?.id })
        });
      }
      setMissions(prev => prev.map(m => ({ ...m, matchCount: m.matchCount + 1, lastRunAt: new Date().toISOString() })));
    } catch (e) {
      console.warn('Global sweep error:', e);
    } finally {
      setSweepActive(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="icon-frame">
            <Target className="icon-md" />
          </div>
          <div>
            <h1 className="page-title font-display">
              My Missions (Autonomous Search Agents)
            </h1>
            <p className="page-description">
              Persistent instructions to Oppverse to continuously hunt specific opportunities across the internet.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGlobalSweep}
            disabled={sweepActive}
            className="btn btn-secondary text-xs flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${sweepActive ? 'animate-spin text-cyan-400' : ''}`} />
            {sweepActive ? 'Sweeping Web...' : 'Run All Missions'}
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4" /> Create Opportunity Mission
          </button>
        </div>
      </div>

      {/* Mission Creator Modal / Form */}
      {isCreating && (
        <div className="glass-panel p-6 rounded-2xl border border-zinc-700 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-slate-400" /> Create Persistent Opportunity Mission
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
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateMission}
              disabled={isSubmitting}
              className="btn btn-primary disabled:opacity-50"
            >
              {isSubmitting ? 'Activating...' : 'Activate Mission'}
            </button>
          </div>
        </div>
      )}

      {/* Active Missions Grid */}
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-3 text-zinc-400">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
          <span className="text-xs">Loading active autonomous missions...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {missions.map((mission) => {
            const isRunning = runningMissionId === mission.id;
            return (
              <div 
                key={mission.id}
                className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="badge badge-success">
                      <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`} /> Active Agent
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

                <div className="space-y-2 pt-2 border-t border-slate-800/60">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" /> 
                      {new Date(mission.lastRunAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      onClick={() => handleRunMission(mission.id, mission.prompt)}
                      disabled={isRunning}
                      className="text-xs text-zinc-300 hover:text-white font-medium flex items-center gap-1 py-1 px-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700"
                    >
                      <Play className={`w-3 h-3 ${isRunning ? 'text-cyan-400 animate-spin' : 'text-emerald-400'}`} />
                      {isRunning ? 'Hunting...' : 'Run Hunt'}
                    </button>
                  </div>

                  <div className="flex items-center justify-end">
                    <Link 
                      href="/discover"
                      className="text-cyan-400 hover:text-cyan-300 font-semibold text-xs flex items-center gap-1"
                    >
                      View Matches <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
