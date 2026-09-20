'use client';

import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  FolderLock,
  UploadCloud,
  FileCheck,
  Download,
  Copy,
  Check,
  Loader2
} from 'lucide-react';
import { ApplicationStatus } from '@/lib/types';
import { useAuth } from '@/components/AuthProvider';
import { fetchUserApplications, fetchUserVaultDocs } from '@/lib/supabase/db';

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

interface VaultDoc {
  id: string;
  name: string;
  type: string;
  size: string;
  updatedAt: string;
  tags: string[];
}

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'kanban' | 'vault'>('kanban');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  const [vaultDocs, setVaultDocs] = useState<VaultDoc[]>([
    {
      id: "v1",
      name: "Tomide_Williams_Master_CV_2026.pdf",
      type: "Master Resume / CV",
      size: "248 KB",
      updatedAt: "Sep 18, 2026",
      tags: ["CV", "Verified", "Product Marketing", "AI Systems"]
    },
    {
      id: "v2",
      name: "Global_Leadership_Motivation_Statement_v3.docx",
      type: "Motivation Statement",
      size: "42 KB",
      updatedAt: "Sep 15, 2026",
      tags: ["Fellowships", "Grants", "Draft"]
    },
    {
      id: "v3",
      name: "Executive_Bio_and_Speaker_Headshot.zip",
      type: "Speaker Kit & Bio",
      size: "4.2 MB",
      updatedAt: "Sep 10, 2026",
      tags: ["Conferences", "Speaking", "High-Res"]
    },
    {
      id: "v4",
      name: "Recommendation_Letter_Fauzan_CEO.pdf",
      type: "Reference Letter",
      size: "180 KB",
      updatedAt: "Aug 28, 2026",
      tags: ["Reference", "Endorsement"]
    }
  ]);

  useEffect(() => {
    async function loadData() {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const [dbApps, dbDocs] = await Promise.all([
          fetchUserApplications(user.id),
          fetchUserVaultDocs(user.id)
        ]);
        if (dbApps && dbApps.length > 0) {
          setApps(dbApps.map((a: any) => ({
            id: a.id,
            oppId: a.opportunity_id,
            title: a.opportunities?.title || 'Application',
            provider: a.opportunities?.provider || 'Global Provider',
            category: a.opportunities?.category || 'General',
            status: a.status as ApplicationStatus,
            deadline: a.deadline || a.opportunities?.deadline || '2026-11-30T23:59:59Z',
            checklist: a.checklist || [],
            notes: a.notes || ''
          })));
        }
        if (dbDocs && dbDocs.length > 0) {
          setVaultDocs(dbDocs.map((d: any) => ({
            id: d.id,
            name: d.name,
            type: d.document_type,
            size: d.file_size || '150 KB',
            updatedAt: new Date(d.updated_at || d.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
            tags: d.tags || []
          })));
        }
      } catch (e) {
        console.warn('Using local application tracking fallback:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.id]);

  const statuses: ApplicationStatus[] = ['Saved', 'Preparing', 'Ready', 'Applied', 'Interview', 'Won'];
  const selectedApp = apps.find(a => a.id === selectedAppId) || apps[0];

  const handleToggleChecklist = (appId: string, checkId: string) => {
    setApps(apps.map(app => {
      if (app.id !== appId) return app;
      return {
        ...app,
        checklist: app.checklist.map(item => 
          item.id === checkId ? { ...item, completed: !item.completed } : item
        )
      };
    }));
  };

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    setApps(apps.map(app => app.id === appId ? { ...app, status: newStatus } : app));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-white">
              Application Workspace & Pipeline
            </h1>
            <p className="text-xs text-zinc-400">
              Track active applications, deadlines, personalized checklists & your master document vault.
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-zinc-950 border border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab('kanban')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'kanban'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Pipeline Board ({apps.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vault')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'vault'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FolderLock className="w-3.5 h-3.5" /> Document Vault ({vaultDocs.length})
          </button>
        </div>
      </div>

      {activeTab === 'kanban' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Kanban Board Columns (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {statuses.map(status => {
                const statusApps = apps.filter(a => a.status === status);
                return (
                  <div key={status} className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                      <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          status === 'Won' ? 'bg-emerald-400' :
                          status === 'Applied' || status === 'Interview' ? 'bg-cyan-400' :
                          status === 'Ready' ? 'bg-amber-400' : 'bg-zinc-500'
                        }`} />
                        {status}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">
                        {statusApps.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 min-h-[220px] rounded-xl bg-zinc-950/40 p-1.5 border border-dashed border-zinc-900">
                      {statusApps.map(app => {
                        const isSelected = app.id === selectedAppId;
                        const completedCount = app.checklist.filter(c => c.completed).length;
                        return (
                          <div
                            key={app.id}
                            onClick={() => setSelectedAppId(app.id)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-2.5 ${
                              isSelected
                                ? 'bg-zinc-900 border-zinc-600 shadow-md'
                                : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
                                {app.category}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                {new Date(app.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </span>
                            </div>

                            <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                              {app.title}
                            </h4>

                            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-900">
                              <span className="truncate max-w-[120px]">{app.provider}</span>
                              <span className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                                <FileCheck className="w-3 h-3" /> {completedCount}/{app.checklist.length}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Opportunity Workspace Drawer (4 Cols) */}
          {selectedApp && (
            <div className="lg:col-span-4 p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-6">
              <div className="space-y-2 pb-4 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Active Workspace</span>
                  <select
                    value={selectedApp.status}
                    onChange={(e) => handleStatusChange(selectedApp.id, e.target.value as ApplicationStatus)}
                    className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs font-semibold outline-none"
                  >
                    {statuses.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <h3 className="text-base font-bold text-white leading-snug">{selectedApp.title}</h3>
                <p className="text-xs text-zinc-400">{selectedApp.provider} â€¢ {selectedApp.category}</p>
              </div>

              {/* Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Preparation Checklist
                </h4>
                <div className="space-y-2">
                  {selectedApp.checklist.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleToggleChecklist(selectedApp.id, item.id)}
                      className="w-full p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 flex items-start gap-2.5 text-left transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        readOnly
                        className="mt-0.5 rounded accent-emerald-500"
                      />
                      <span className={`text-xs ${item.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                        {item.task}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Application Notes</h4>
                <textarea
                  rows={3}
                  value={selectedApp.notes}
                  onChange={(e) => {
                    const val = e.target.value;
                    setApps(apps.map(a => a.id === selectedApp.id ? { ...a, notes: val } : a));
                  }}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white outline-none focus:border-zinc-600"
                  placeholder="Add strategy notes, referral contacts, or essay ideas..."
                />
              </div>

              <div className="pt-2">
                <a
                  href="#"
                  className="w-full py-2.5 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  Open Official Application Portal <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Document Vault View */
        <div className="space-y-6">
          {/* Upload Dropzone */}
          <div className="p-8 rounded-2xl bg-zinc-950 border-2 border-dashed border-zinc-800 hover:border-zinc-700 text-center space-y-3 cursor-pointer transition-colors">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-center mx-auto">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Upload New Master Document</h3>
              <p className="text-xs text-zinc-400">
                Drag and drop your updated CV, Motivation Letters, Case Studies, or Portfolios (PDF, DOCX up to 25MB)
              </p>
            </div>
          </div>

          {/* Vault Document Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vaultDocs.map(doc => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-zinc-300" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{doc.name}</h4>
                      <p className="text-xs text-zinc-400">{doc.type} â€¢ {doc.size}</p>
                    </div>
                  </div>

                  <span className="text-[10px] text-zinc-500 flex-shrink-0">Updated {doc.updatedAt}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {doc.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-900 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => handleCopy(doc.id, doc.name)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 flex items-center gap-1.5 transition-colors"
                  >
                    {copiedId === doc.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Link
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Link
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
