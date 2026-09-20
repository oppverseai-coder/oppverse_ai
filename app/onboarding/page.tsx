'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Compass, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Globe, GraduationCap, Briefcase, Award, Rocket, Lightbulb, Palette } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedPersona, setSelectedPersona] = useState('Early-Career Professional');
  const [selectedUniverses, setSelectedUniverses] = useState<string[]>([
    'Jobs & Internships', 
    'Fellowships & Leadership', 
    'Grants & Funding'
  ]);
  const [countryOfCitizenship, setCountryOfCitizenship] = useState('Nigeria');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level (3-5 years)');
  const [isFinishing, setIsFinishing] = useState(false);

  // 6 Core User Segments from PRD Section 5
  const personas = [
    { 
      id: 'early_career',
      title: 'Early-Career Professional', 
      desc: 'Jobs, Graduate programs, Fellowships, Professional training & Travel programs',
      icon: Briefcase
    },
    { 
      id: 'student_grad',
      title: 'Student & Graduate', 
      desc: 'Scholarships, Internships, Graduate schemes, Competitions & Study-abroad',
      icon: GraduationCap
    },
    { 
      id: 'mid_career',
      title: 'Mid-Career Professional / Leader', 
      desc: 'International roles, Leadership fellowships, Speaking & Industry awards',
      icon: Award
    },
    { 
      id: 'founder',
      title: 'Founder & Entrepreneur', 
      desc: 'Grants, Accelerators, Startup funding, Founder fellowships & Pitch opportunities',
      icon: Rocket
    },
    { 
      id: 'researcher',
      title: 'Researcher & Academic', 
      desc: 'Research grants, Fellowships, Scholarships, Conferences & Calls for papers',
      icon: Lightbulb
    },
    { 
      id: 'creative',
      title: 'Creative & Independent', 
      desc: 'Residencies, Creative grants, Awards, Competitions & International programs',
      icon: Palette
    },
  ];

  // Core Opportunity Universes from PRD Section 1
  const universes = [
    'Jobs & Internships', 
    'Fellowships & Leadership', 
    'Scholarships & Study Abroad', 
    'Grants & Funding', 
    'Conferences & Events', 
    'Travel & Exchanges', 
    'Accelerators & Competitions', 
    'Speaking & Research'
  ];

  const toggleUniverse = (cat: string) => {
    setSelectedUniverses(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleFinish = () => {
    setIsFinishing(true);
    setTimeout(() => {
      router.push('/');
      router.refresh();
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a]">
      <div className="w-full max-w-xl space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <img src="/brand/oppverse-icon-dark.png" alt="Oppverse AI" className="w-7 h-7 object-contain rounded-lg shadow-sm" />
            <span className="font-display font-semibold text-lg text-white">Oppverse Setup</span>
          </div>
          <span className="text-xs font-semibold text-zinc-400">Step {step} of 3</span>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl space-y-6">
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-white" /> What is your primary focus?
                </h2>
                <p className="text-xs text-zinc-400">
                  Select your primary persona from the 6 Oppverse core user segments.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                {personas.map((p) => {
                  const Icon = p.icon;
                  const isSelected = selectedPersona === p.title;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPersona(p.title)}
                      className={`p-3.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-zinc-900 border-white text-white shadow-sm'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white flex items-center gap-2">
                          <Icon className="w-4 h-4 text-zinc-400" />
                          {p.title}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1 pl-6">{p.desc}</p>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-white" /> Select your Opportunity Universes
                </h2>
                <p className="text-xs text-zinc-400">
                  Choose the categories you want your autonomous intelligence engine to track.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {universes.map((cat) => {
                  const isSelected = selectedUniverses.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleUniverse(cat)}
                      className={`p-3 rounded-xl text-left border text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-white text-zinc-950 border-white font-semibold shadow-sm'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{cat}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={selectedUniverses.length === 0}
                  className="w-2/3 py-2.5 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  Next Step <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-white" /> Eligibility & Experience Layer
                </h2>
                <p className="text-xs text-zinc-400">
                  Accurate criteria screening prevents false-hope applications.
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 mb-1.5 block flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-zinc-400" /> Country of Citizenship / Origin
                  </label>
                  <select
                    value={countryOfCitizenship}
                    onChange={(e) => setCountryOfCitizenship(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none"
                  >
                    <option value="Nigeria">Nigeria</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="South Africa">South Africa</option>
                    <option value="Uganda">Uganda</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Other">Other Global</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 mb-1.5 block flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-zinc-400" /> Professional Experience Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none"
                  >
                    <option value="Student / Entry-Level (0-2 years)">Student / Entry-Level (0-2 years)</option>
                    <option value="Mid-Level (3-5 years)">Mid-Level (3-5 years)</option>
                    <option value="Senior / Lead (6-9 years)">Senior / Lead (6-9 years)</option>
                    <option value="Director / Executive (10+ years)">Director / Executive (10+ years)</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Personalized Universe Ready
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Oppverse will evaluate live opportunities across your selected universes with verified eligibility screening.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={isFinishing}
                  className="w-2/3 py-2.5 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isFinishing ? 'Building Universe...' : 'Enter Oppverse'} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
