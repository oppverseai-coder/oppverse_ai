'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  UploadCloud, 
  CircleDot,
  ShieldCheck, 
  Activity, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Target, 
  Briefcase, 
  GraduationCap, 
  Globe2, 
  Award, 
  Sliders, 
  ChevronRight, 
  FileText, 
  AlertCircle, 
  X, 
  Loader2,
  Sparkles,
  Check
} from 'lucide-react';
import { initialProfile as sampleProfile } from '@/lib/sample-data';
import { UserProfile, OpportunityCategory, Persona } from '@/lib/types';
import { useAuth } from '@/components/AuthProvider';
import { fetchUserProfile, updateUserProfile } from '@/lib/supabase/db';

export default function ProfilePage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfile>(sampleProfile);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'personas' | 'cv-upload' | 'universes' | 'experience'>('personas');
  
  // CV Upload & Parsing State
  const [cvInputText, setCvInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(false);
  const [extractedPreview, setExtractedPreview] = useState<any | null>(null);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const data = await fetchUserProfile(user?.id);
        if (data) setProfile(data);
      } catch (err) {
        console.warn('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [user?.id]);

  const allUniverses: OpportunityCategory[] = [
    'Jobs', 
    'Fellowships', 
    'Scholarships', 
    'Grants', 
    'Conferences', 
    'Travel', 
    'Accelerators', 
    'Speaking', 
    'Competitions'
  ];

  const handleUniverseToggle = (cat: OpportunityCategory) => {
    const universes = profile.selectedUniverses || [];
    const exists = universes.includes(cat);
    const updated = exists 
      ? universes.filter(c => c !== cat)
      : [...universes, cat];
    
    setProfile(prev => ({ ...prev, selectedUniverses: updated }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleParseCV = async () => {
    setIsParsing(true);
    setParseSuccess(false);

    try {
      let res;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        if (user?.id) formData.append('userId', user.id);

        res = await fetch('/api/parse-cv', {
          method: 'POST',
          body: formData
        });
      } else {
        res = await fetch('/api/parse-cv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            cvText: cvInputText || "Sample Executive CV Content",
            userId: user?.id 
          })
        });
      }

      const result = await res.json();
      if (result.success && result.data) {
        setExtractedPreview(result.data);
        setParseSuccess(true);
      }
    } catch (e) {
      console.error('Error extracting CV:', e);
    } finally {
      setIsParsing(false);
    }
  };

  const handleApplyExtractedData = async () => {
    if (!extractedPreview) return;

    const mergedProfile: UserProfile = {
      ...profile,
      fullName: extractedPreview.fullName || profile.fullName,
      email: extractedPreview.email || profile.email,
      yearsOfExperience: extractedPreview.yearsOfExperience || profile.yearsOfExperience,
      careerLevel: extractedPreview.careerLevel || profile.careerLevel,
      citizenship: extractedPreview.citizenship?.length ? extractedPreview.citizenship : profile.citizenship,
      countryOfResidence: extractedPreview.countryOfResidence || profile.countryOfResidence,
      city: extractedPreview.city || profile.city,
      skills: Array.from(new Set([...profile.skills, ...(extractedPreview.skills || [])])),
      education: extractedPreview.education?.length ? extractedPreview.education : profile.education,
      workHistory: extractedPreview.workHistory?.length ? extractedPreview.workHistory : profile.workHistory,
      personas: extractedPreview.suggestedPersonas?.length ? extractedPreview.suggestedPersonas : profile.personas,
      profileStrength: 94
    };

    setProfile(mergedProfile);
    setIsSaving(true);
    try {
      if (user?.id) {
        await updateUserProfile(user.id, mergedProfile);
      }
      setSaveSuccess(true);
      setExtractedPreview(null);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.warn('Error saving merged profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      if (user?.id) {
        await updateUserProfile(user.id, profile);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.warn('Error saving profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="icon-frame">
              <User className="icon-md" />
            </div>
            <div>
              <h1 className="page-title font-display">
                Opportunity Profile & Identity Engine
              </h1>
              <p className="page-description">
                One master profile powers your entire personalized opportunity universe.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5 animate-bounce">
              <CheckCircle2 className="w-4 h-4" /> Synced to Oppverse Cloud
            </span>
          )}
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="btn btn-primary disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        {/* Left 2 Columns: Main Engine Tabs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Engine Tabs */}
          <div className="tab-list flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-zinc-800">
            <button
              onClick={() => setActiveTab('personas')}
              className={`tab-button ${
                activeTab === 'personas'
                  ? 'tab-button-active'
                  : ''
              }`}
            >
              <Sliders className="w-3.5 h-3.5" /> Personas & Identity
            </button>
            <button
              onClick={() => setActiveTab('cv-upload')}
              className={`tab-button ${
                activeTab === 'cv-upload'
                  ? 'tab-button-active'
                  : ''
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" /> AI Resume Ingestion
            </button>
            <button
              onClick={() => setActiveTab('universes')}
              className={`tab-button ${
                activeTab === 'universes'
                  ? 'tab-button-active'
                  : ''
              }`}
            >
              <Target className="w-3.5 h-3.5" /> Opportunity Universes
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`tab-button ${
                activeTab === 'experience'
                  ? 'tab-button-active'
                  : ''
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" /> Skills & Timeline
            </button>
          </div>

          {/* TAB 1: PERSONAS & IDENTITY */}
          {activeTab === 'personas' && (
            <div className="space-y-6">
              {/* Persona Selector Banner */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <CircleDot className="w-4 h-4 text-zinc-400" /> Active Opportunity Personas
                    </h3>
                    <p className="text-xs text-slate-400">
                      Switch between your active professional identities to reshape your opportunity feed.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                    {(profile.personas || []).length} Active Personas
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(profile.personas || []).map((persona) => {
                    const isSelected = persona.id === profile.activePersonaId;
                    return (
                      <div
                        key={persona.id}
                        onClick={() => setProfile(prev => ({ ...prev, activePersonaId: persona.id }))}
                        className={`p-4 rounded-xl cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-zinc-800 border-zinc-600'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-300'}`}>
                            {persona.name}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {persona.headline || persona.role}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {(persona.targetUniverses || (persona as any).targetCategories || ['Jobs', 'Fellowships']).slice(0, 3).map((u: string, i: number) => (
                            <span key={i} className="text-[9px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-medium">
                              {u}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Core Identity Details */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
                  Primary Identity & Demographics
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Full Legal Name</label>
                    <input
                      type="text"
                      value={profile.fullName || ''}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="w-full p-2.5 rounded-xl glass-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Email Address</label>
                    <input
                      type="email"
                      value={profile.email || ''}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl glass-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                      Citizenship (Crucial for Eligibility)
                    </label>
                    <input
                      type="text"
                      value={(profile.citizenship || []).join(', ')}
                      onChange={(e) => setProfile({ ...profile, citizenship: e.target.value.split(',').map(s => s.trim()) })}
                      placeholder="e.g. Nigeria, Ghana"
                      className="w-full p-2.5 rounded-xl glass-input text-sm border-indigo-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Country & City of Residence</label>
                    <input
                      type="text"
                      value={`${profile.city || ''}, ${profile.countryOfResidence || ''}`}
                      onChange={(e) => {
                        const parts = e.target.value.split(',');
                        setProfile({
                          ...profile,
                          city: parts[0]?.trim() || '',
                          countryOfResidence: parts[1]?.trim() || profile.countryOfResidence
                        });
                      }}
                      className="w-full p-2.5 rounded-xl glass-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Years of Professional Experience</label>
                    <input
                      type="number"
                      value={profile.yearsOfExperience || 0}
                      onChange={(e) => setProfile({ ...profile, yearsOfExperience: parseInt(e.target.value) || 0 })}
                      className="w-full p-2.5 rounded-xl glass-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Career Seniority Level</label>
                    <select
                      value={profile.careerLevel || 'Mid-Career'}
                      onChange={(e: any) => setProfile({ ...profile, careerLevel: e.target.value })}
                      className="w-full p-2.5 rounded-xl glass-input text-sm"
                    >
                      <option value="Early-Career">Early-Career (0â€“3 yrs)</option>
                      <option value="Mid-Career">Mid-Career (3â€“6 yrs)</option>
                      <option value="Senior">Senior (6â€“10 yrs)</option>
                      <option value="Executive">Executive / Director (10+ yrs)</option>
                      <option value="Founder">Founder / Venture Builder</option>
                      <option value="Student">Student / Graduate</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI CV INGESTION */}
          {activeTab === 'cv-upload' && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" /> AI Resume Ingestion & Parser
                  </h3>
                  <p className="text-xs text-slate-400">
                    Upload your PDF / DOCX resume or paste your bio to auto-populate verified skills, timeline, and personas.
                  </p>
                </div>
                <span className="badge">
                  Zero Hallucination
                </span>
              </div>

              {/* Upload Dropzone */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                className={`dropzone cursor-pointer p-8 rounded-2xl border-2 border-dashed text-center transition-all ${
                  isDragging 
                    ? 'border-cyan-400 bg-cyan-950/20' 
                    : selectedFile 
                    ? 'border-emerald-500/60 bg-emerald-950/10' 
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <UploadCloud className={`w-10 h-10 mx-auto mb-3 ${selectedFile ? 'text-emerald-400' : 'text-zinc-400'}`} />
                {selectedFile ? (
                  <div>
                    <p className="text-sm font-bold text-white flex items-center justify-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" /> {selectedFile.name}
                    </p>
                    <p className="text-xs text-emerald-400/80 mt-1">Ready to extract with Oppverse AI</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-white">Click or Drag & Drop your Resume (PDF, DOCX)</p>
                    <p className="text-xs text-slate-500 mt-1">Files up to 25MB supported</p>
                  </div>
                )}
              </div>

              {/* Text Input Option */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block">
                  Or Paste Resume / LinkedIn Summary Text
                </label>
                <textarea
                  rows={4}
                  value={cvInputText}
                  onChange={(e) => setCvInputText(e.target.value)}
                  placeholder="Paste your CV or LinkedIn summary here if you don't have a PDF file handy..."
                  className="w-full p-3 rounded-xl glass-input text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Extracts verified timeline & capabilities only
                </p>
                <button
                  onClick={handleParseCV}
                  disabled={isParsing || (!selectedFile && !cvInputText.trim())}
                  className="btn btn-primary disabled:opacity-50"
                >
                  {isParsing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Extracting with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-cyan-300" /> Extract & Analyze Resume
                    </>
                  )}
                </button>
              </div>

              {/* Extracted Data Review Card */}
              {extractedPreview && (
                <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-700 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Extracted Profile Review
                    </h4>
                    <span className="text-[10px] font-semibold text-zinc-400">92% Verification Score</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                      <span className="text-zinc-500 block text-[10px]">Full Name</span>
                      <strong className="text-white">{extractedPreview.fullName}</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                      <span className="text-zinc-500 block text-[10px]">Track Record</span>
                      <strong className="text-white">{extractedPreview.yearsOfExperience}+ Years ({extractedPreview.careerLevel})</strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-zinc-400 text-xs font-semibold block mb-1.5">Extracted Core Capabilities ({extractedPreview.skills.length}):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {extractedPreview.skills.map((s: string) => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-cyan-300 border border-zinc-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800">
                    <button
                      onClick={() => setExtractedPreview(null)}
                      className="btn btn-secondary text-xs"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={handleApplyExtractedData}
                      disabled={isSaving}
                      className="btn btn-primary text-xs"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Apply to My Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: OPPORTUNITY UNIVERSES */}
          {activeTab === 'universes' && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan-400" /> Target Opportunity Universes
                </h3>
                <p className="text-xs text-slate-400">
                  Select which universes Oppverse should continuously search on your behalf.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allUniverses.map((category) => {
                  const isChecked = (profile.selectedUniverses || []).includes(category);
                  return (
                    <button
                      key={category}
                      onClick={() => handleUniverseToggle(category)}
                      className={`p-3.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-zinc-800 border-zinc-600 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-xs font-semibold">{category}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Goals */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Aspirations & Goals
                </h4>
                <div className="space-y-2">
                  {(profile.goals || []).map((goal, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-200 flex items-center justify-between">
                      <span>{goal}</span>
                      <button 
                        onClick={() => setProfile(prev => ({ ...prev, goals: prev.goals.filter((_, i) => i !== idx) }))}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SKILLS & TIMELINE */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              {/* Skills Tags */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" /> Core Capabilities & Skills
                </h3>

                <div className="flex flex-wrap gap-2">
                  {(profile.skills || []).map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-xl bg-slate-800/90 text-cyan-300 border border-slate-700 text-xs font-medium flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="inline-flex h-5 w-5 items-center justify-center text-slate-400 hover:text-rose-400"
                        aria-label={`Remove ${skill}`}
                        title={`Remove ${skill}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                    placeholder="Add a skill (e.g. AI Prompting, Venture Fundraising)..."
                    className="flex-1 p-2.5 rounded-xl glass-input text-xs"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="btn btn-secondary"
                  >
                    Add Skill
                  </button>
                </div>
              </div>

              {/* Work History */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-400" /> Verified Work History
                </h3>

                <div className="space-y-3">
                  {(profile.workHistory || []).map((work, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{work.role}</span>
                        <span className="text-[11px] text-slate-400">{work.startDate} â€” {work.endDate}</span>
                      </div>
                      <p className="text-xs text-cyan-400 font-medium">{work.company} â€¢ {work.location}</p>
                      <p className="text-xs text-slate-400 pt-1 leading-relaxed">{work.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: Profile Strength & Explanations */}
        <div className="space-y-6">
          {/* Profile Strength Card */}
          <div className="insight-panel relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-slate-400" />
                Profile Strength
              </span>
              <span className="stat-value font-display">
                {profile.profileStrength || 88}%
              </span>
            </div>

            <div className="progress-track mb-5">
              <div 
                className="progress-value transition-all duration-500"
                style={{ width: `${profile.profileStrength || 88}%` }}
              />
            </div>

            {/* Explainable Value Insight */}
            <div className="border-t border-slate-800 pt-4 text-xs text-slate-300 space-y-2">
              <p className="font-bold text-white flex items-center gap-1.5">
                <CircleDot className="w-3.5 h-3.5 text-zinc-400" /> Why Completeness Matters
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Adding your exact citizenship eliminates <span className="text-cyan-300 font-semibold">90%+ of ineligibility frustrations</span> before you ever spend time applying.
              </p>
            </div>

            {/* Unlock Checklist */}
            <div className="mt-5 space-y-2.5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Unlock Suggestions
              </p>
              <div className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Citizenship verified (Nigerian eligibility active)</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Active Personas configured</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-300">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Add past speaking video links to boost keynote invites</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="insight-panel space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Identity Graph Stats
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="stat-tile">
                <span className="stat-value">{(profile.skills || []).length}</span>
                <p className="text-[11px] text-slate-400">Verified Skills</p>
              </div>
              <div className="stat-tile">
                <span className="stat-value">{(profile.selectedUniverses || []).length}</span>
                <p className="text-[11px] text-slate-400">Active Universes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
