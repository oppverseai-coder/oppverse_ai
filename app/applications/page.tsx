'use client';

import React, { useState } from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Plus, 
  ExternalLink, 
  ChevronRight, 
  Trash2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { sampleOpportunities } from '@/lib/sample-data';
import { ApplicationStatus } from '@/lib/types';

interface TrackedApp {
  id: string;
  oppId: string;
  title: string;
  provider: string;
  category: string;
  status: ApplicationStatus;
  deadline: string;
  checklist: Array<{ id: string; task: string; completed: boolean }>;
  notes: string;
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<TrackedApp[]>([
    {
      id: "app_1",
      oppId: "opp_002",
      title: "Berlin AI & Emerging Tech Leadership Fellowship",
      provider: "Robert Bosch Foundation",
      category: "Fellowships",
      status: "Preparing",
      deadline: "2026-10-08T23:59:59Z",
      checklist: [
        { id: "c1", task: "Tailor CV to highlight AI GTM impact", completed: true },
        { id: "c2", task: "Draft 800-word Motivation Statement", completed: false },
        { id: "c3", task: "Request reference from VP of Engineering", completed: false }
      ],
      notes: "Focus on Nigerian AI ecosystem case studies and Conductor time intelligence framework."
    },
    {
      id: "app_2",
      oppId: "opp_004",
      title: "Call for Speakers: AI Product Summit London",
      provider: "Product Led Alliance",
      category: "Speaking",
      status: "Ready",
      deadline: "2026-09-30T23:59:59Z",
      checklist: [
        { id: "c4", task: "Submit 300-word Session Abstract", completed: true },
        { id: "c5", task: "Link past keynote recording", completed: true }
      ],
      notes: "Talk title: Building Agentic GTM Systems in 2026."
    },
    {
      id: "app_3",
      oppId: "opp_001",
      title: "Senior Product Marketing Manager",
      provider: "Synthesia AI",
      category: "Jobs",
      status: "Applied",
      deadline: "2026-10-15T23:59:59Z",
      checklist: [
        { id: "c6", task: "Submit application form", completed: true }
      ],
      notes: "Referred by network connection on LinkedIn."
    }
  ]);

  const [selectedAppId, setSelectedAppId] = useState<string>("app_1");

  const statuses: ApplicationStatus[] = ['Saved', 'Preparing', 'Ready', 'Applied', 'Interview', 'Won'];

  const activeApp = apps.find(a => a.id === selectedAppId) || apps[0];

  const handleToggleChecklist = (appId: string, checkId: string) => {
    setApps(apps.map(a => {
      if (a.id !== appId) return a;
      return {
        ...a,
        checklist: a.checklist.map(c => c.id === checkId ? { ...c, completed: !c.completed } : c)
      };
    }));
  };

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    setApps(apps.map(a => a.id === appId ? { ...a, status: newStatus } : a));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="icon-frame">
            <Briefcase className="icon-md" />
          </div>
          <div>
            <h1 className="page-title font-display">
              Application Workspace & Pipeline Tracker
            </h1>
            <p className="page-description">
              Manage checklists, document requirements, and track outcomes from decision to win.
            </p>
          </div>
        </div>

        <div className="badge !min-h-8 !px-3">
          <span>Active Pipeline: <strong className="text-cyan-400">{apps.length} Opportunities</strong></span>
        </div>
      </div>

      {/* Kanban / Pipeline View */}
      <div className="flex md:grid md:grid-cols-6 gap-3 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory">
        {statuses.map((status) => {
          const statusApps = apps.filter(a => a.status === status);
          return (
            <div key={status} className="min-w-[220px] md:min-w-0 snap-start flex-1 glass-panel p-3.5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">{status}</span>
                <span className="badge !min-h-5 !px-1.5">
                  {statusApps.length}
                </span>
              </div>

              <div className="space-y-2">
                {statusApps.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedAppId(app.id)}
                    className={`p-3 rounded-xl cursor-pointer text-xs transition-all border ${
                      app.id === selectedAppId
                        ? 'bg-zinc-800 border-zinc-600 text-white'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <p className="font-bold line-clamp-1">{app.title}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{app.provider}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Application Workspace Detail */}
      {activeApp && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                {activeApp.category} • {activeApp.provider}
              </span>
              <h2 className="text-xl font-bold font-display text-white mt-1">
                {activeApp.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Stage:</span>
              <select
                value={activeApp.status}
                onChange={(e: any) => handleStatusChange(activeApp.id, e.target.value)}
                className="px-3 py-1.5 rounded-xl glass-input text-xs font-bold text-cyan-300"
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Checklist */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Preparation Checklist
              </h3>
              <div className="space-y-2">
                {activeApp.checklist.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => handleToggleChecklist(activeApp.id, item.id)}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-all text-xs"
                  >
                    <input 
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => {}}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className={item.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                      {item.task}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes & Strategy */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                Strategic Notes & Pitch Angle
              </h3>
              <textarea
                rows={4}
                value={activeApp.notes}
                onChange={(e) => {
                  const newNotes = e.target.value;
                  setApps(apps.map(a => a.id === activeApp.id ? { ...a, notes: newNotes } : a));
                }}
                className="w-full p-3 rounded-xl glass-input text-xs leading-relaxed"
                placeholder="Add notes, essay outline points, or interview prep thoughts..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
