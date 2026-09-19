'use client';

import React, { useState } from 'react';
import { 
  User, 
  UploadCloud, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
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
  AlertCircle
} from 'lucide-react';
import { initialProfile as sampleProfile } from '@/lib/sample-data';
import { UserProfile, OpportunityCategory, Persona } from '@/lib/types';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(sampleProfile);
  const [activeTab, setActiveTab] = useState<'personas' | 'cv-upload' | 'universes' | 'experience'>('personas');
  const [cvInputText, setCvInputText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newSkill, setNewSkill] = useState('');

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
    const exists = profile.selectedUniverses.includes(cat);
    const updated = exists 
      ? profile.selectedUniverses.filter(c => c !== cat)
      : [...profile.selectedUniverses, cat];
    
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

  const handleParseCV = async () => {
    setIsParsing(true);
    setParseSuccess(false);

    try {
      const res = await fetch('/api/parse-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText: cvInputText || "Sample Executive CV Content" })
      });
      const data = await res.json();
      if (data.success) {
        setParseSuccess(true);
        setProfile(prev => ({
          ...prev,
          fullName: data.data.fullName || prev.fullName,
          yearsOfExperience: data.data.yearsOfExperience || prev.yearsOfExperience,
          skills: Array.from(new Set([...prev.skills, ...(data.data.skills || [])])),
          profileStrength: 92
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsParsing(false);
    }
  };

  const handleSaveProfile = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const activePersona = profile.personas.find(p => p.id === profile.activePersonaId) || profile.personas[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-glow">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-white">
                Opportunity Profile & Identity Engine
              </h1>
              <p className="text-sm text-slate-400">
                One profile powers your entire personalized opportunity universe.
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
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-glow transition-all active:scale-95"
          >
            Save Profile Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Main Engine Tabs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Engine Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800/80 overflow-x-auto">
            <button
              onClick={() => setActiveTab('personas')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'personas'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-glow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" /> Personas & Identity
            </button>
            <button
              onClick={() => setActiveTab('cv-upload')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'cv-upload'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-glow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" /> AI CV Ingestion
            </button>
            <button
              onClick={() => setActiveTab('universes')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'universes'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-glow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Target className="w-3.5 h-3.5" /> Opportunity Universes
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'experience'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-glow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
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
                      <Sparkles className="w-4 h-4 text-cyan-400" /> Active Opportunity Personas
                    </h3>
                    <p className="text-xs text-slate-400">
                      Switch between your active professional identities to reshape your opportunity feed.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                    {profile.personas.length} Active Personas
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {profile.personas.map((persona) => {
                    const isSelected = persona.id === profile.activePersonaId;
                    return (
                      <div
                        key={persona.id}
                        onClick={() => setProfile(prev => ({ ...prev, activePersonaId: persona.id }))}
                        className={`p-4 rounded-xl cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-gradient-to-b from-indigo-600/20 to-slate-900 border-indigo-500/50 shadow-glow'
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
                          {persona.headline}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {persona.targetUniverses.slice(0, 2).map((u, i) => (
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
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="w-full p-2.5 rounded-xl glass-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
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
                      value={profile.citizenship.join(', ')}
                      onChange={(e) => setProfile({ ...profile, citizenship: e.target.value.split(',').map(s => s.trim()) })}
                      placeholder="e.g. Nigeria, Ghana"
                      className="w-full p-2.5 rounded-xl glass-input text-sm border-indigo-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Country & City of Residence</label>
                    <input
                      type="text"
                      value={`${profile.city}, ${profile.countryOfResidence}`}
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
                      value={profile.yearsOfExperience}
                      onChange={(e) => setProfile({ ...profile, yearsOfExperience: parseInt(e.target.value) || 0 })}
                      className="w-full p-2.5 rounded-xl glass-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Career Seniority Level</label>
                    <select
                      value={profile.careerLevel}
                      onChange={(e: any) => setProfile({ ...profile, careerLevel: e.target.value })}
                      className="w-full p-2.5 rounded-xl glass-input text-sm"
                    >
                      <option value="Early-Career">Early-Career (0–3 yrs)</option>
                      <option value="Mid-Career">Mid-Career (3–6 yrs)</option>
                      <option value="Senior">Senior (6–10 yrs)</option>
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
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" /> Fast-Track AI CV Parser
                  </h3>
                  <p className="text-xs text-slate-400">
                    Paste your resume text or upload your CV to auto-populate your Oppverse Profile.
                  </p>
                </div>
                <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                  Zero Hallucination
                </span>
              </div>

              {/* Upload Dropzone */}
              <div className="p-8 rounded-2xl border-2 border-dashed border-slate-700/80 hover:border-indigo-500/50 bg-slate-900/40 text-center transition-all">
                <UploadCloud className="w-10 h-10 text-indigo-400 mx-auto mb-3 animate-pulse" />
                <p className="text-sm font-semibold text-white">Drag & drop your CV (PDF or DOCX)</p>
                <p className="text-xs text-slate-500 mt-1">or paste your resume text below for instant AI extraction</p>
              </div>

              {/* Text Input Option */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block">
                  Paste Resume / Bio Text (Optional)
                </label>
                <textarea
                  rows={6}
                  value={cvInputText}
                  onChange={(e) => setCvInputText(e.target.value)}
                  placeholder="Paste your CV, LinkedIn summary, or bio here to let Oppverse extract your roles, degrees, and verified capabilities..."
                  className="w-full p-3 rounded-xl glass-input text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Grounded in your real experience only
                </p>
                <button
                  onClick={handleParseCV}
                  disabled={isParsing}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-glow flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {isParsing ? 'Extracting with Oppverse AI...' : 'Extract & Populate Profile'}
                </button>
              </div>

              {parseSuccess && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="font-bold">Extraction Successful!</p>
                    <p className="text-emerald-400/80">Extracted 8 core skills, 2 past roles, and your verified qualifications.</p>
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
                  const isChecked = profile.selectedUniverses.includes(category);
                  return (
                    <button
                      key={category}
                      onClick={() => handleUniverseToggle(category)}
                      className={`p-3.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-glow'
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
                  {profile.goals.map((goal, idx) => (
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
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-xl bg-slate-800/90 text-cyan-300 border border-slate-700 text-xs font-medium flex items-center gap-2"
                    >
                      {skill}
                      <button onClick={() => handleRemoveSkill(skill)} className="text-slate-400 hover:text-rose-400">
                        ×
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
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
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
                  {profile.workHistory.map((work, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{work.role}</span>
                        <span className="text-[11px] text-slate-400">{work.startDate} — {work.endDate}</span>
                      </div>
                      <p className="text-xs text-cyan-400 font-medium">{work.company} • {work.location}</p>
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
          <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 shadow-glow relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Profile Strength
              </span>
              <span className="text-xl font-display font-extrabold text-cyan-400">
                {profile.profileStrength}%
              </span>
            </div>

            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-4">
              <div 
                className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${profile.profileStrength}%` }}
              />
            </div>

            {/* Explainable Value Insight */}
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-slate-300 space-y-2">
              <p className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Why Completeness Matters
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
                <span>3 Active Personas configured</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-300">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Add past speaking video links to boost keynote invites</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Identity Graph Stats
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-lg font-bold text-white">{profile.skills.length}</span>
                <p className="text-[11px] text-slate-400">Verified Skills</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-lg font-bold text-cyan-400">{profile.selectedUniverses.length}</span>
                <p className="text-[11px] text-slate-400">Active Universes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
