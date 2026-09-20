'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Compass, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, MapPin, Briefcase } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedPersona, setSelectedPersona] = useState('Product Marketing Lead');
  const [selectedUniverses, setSelectedUniverses] = useState<string[]>(['Jobs', 'Fellowships', 'Conferences']);
  const [locationPref, setLocationPref] = useState('Remote / Worldwide');
  const [isFinishing, setIsFinishing] = useState(false);

  const personas = [
    { title: 'Product Marketing Lead', desc: 'B2B SaaS, Positioning, Growth & Time Intelligence' },
    { title: 'AI Systems Architect / Engineer', desc: 'Agentic Workflows, LLM Systems & Automation' },
    { title: 'Founder & Researcher', desc: 'Early-stage Ventures, Grants & Research Fellowships' },
    { title: 'Creative & Media Director', desc: 'Visual Design, Photography & Film Productions' },
  ];

  const universes = [
    'Jobs', 'Fellowships', 'Grants', 'Accelerators', 
    'Conferences', 'Hackathons', 'Residencies', 'Competitions'
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
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a]">
      <div className="w-full max-w-xl space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
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
                  Oppverse matches opportunities specifically against your profile persona.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {personas.map((p) => {
                  const isSelected = selectedPersona === p.title;
                  return (
                    <button
                      key={p.title}
                      type="button"
                      onClick={() => setSelectedPersona(p.title)}
                      className={`p-4 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-zinc-900 border-white text-white shadow-sm'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white">{p.title}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">{p.desc}</p>
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
                  Choose the categories you want your autonomous agents to track continuously.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {universes.map((cat) => {
                  const isSelected = selectedUniverses.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleUniverse(cat)}
                      className={`p-3 rounded-xl text-center border text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-white text-zinc-950 border-white font-semibold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      {cat}
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
                  <ShieldCheck className="w-5 h-5 text-white" /> Location & Eligibility Filters
                </h2>
                <p className="text-xs text-zinc-400">
                  Strict gating prevents zero-hope applications and false positives.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">Location Preference</label>
                  <select
                    value={locationPref}
                    onChange={(e) => setLocationPref(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none"
                  >
                    <option value="Remote / Worldwide">Remote / Worldwide (All Continents)</option>
                    <option value="United States & Canada">United States & Canada</option>
                    <option value="United Kingdom & Europe">United Kingdom & Europe</option>
                    <option value="Africa & Emerging Markets">Africa & Emerging Markets</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Instant Daily Brief Ready
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    We will automatically synthesize your personalized Spotlight Match and 5 curated shelves upon entry.
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
                  {isFinishing ? 'Synthesizing Matches...' : 'Enter Opportunity Universe'} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}