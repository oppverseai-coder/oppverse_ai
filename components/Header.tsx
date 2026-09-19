'use client';

import React, { useState } from 'react';
import { Sparkles, Bell, Search, ChevronDown, Check, UserCircle, Globe, ShieldCheck } from 'lucide-react';
import { initialProfile } from '@/lib/sample-data';

export default function Header() {
  const [selectedPersonaId, setSelectedPersonaId] = useState(initialProfile.activePersonaId);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);

  const activePersona = initialProfile.personas.find(p => p.id === selectedPersonaId) || initialProfile.personas[0];

  return (
    <header className="h-16 fixed top-0 right-0 left-64 glass-panel border-b border-slate-800/80 px-8 flex items-center justify-between z-30">
      {/* Search Universe Bar */}
      <div className="flex items-center gap-4 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search jobs, fellowships, grants, speaking..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm glass-input placeholder:text-slate-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Right Controls: Persona Switcher & Profile */}
      <div className="flex items-center gap-4">
        {/* Persona Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsPersonaOpen(!isPersonaOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-500/60 transition-all text-xs text-slate-200"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Persona:</span>
            <span className="font-semibold text-white">{activePersona.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isPersonaOpen && (
            <div className="absolute right-0 mt-2 w-72 glass-panel rounded-2xl border border-slate-700/80 shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-800/80">
                <p className="text-xs font-semibold text-slate-300">Switch Opportunity Persona</p>
                <p className="text-[11px] text-slate-500">Tailors your daily feed and matching priority</p>
              </div>
              <div className="py-1 space-y-1">
                {initialProfile.personas.map((persona) => {
                  const isCurrent = persona.id === selectedPersonaId;
                  return (
                    <button
                      key={persona.id}
                      onClick={() => {
                        setSelectedPersonaId(persona.id);
                        setIsPersonaOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between ${
                        isCurrent
                          ? 'bg-indigo-600/20 text-cyan-300 border border-indigo-500/30'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{persona.name}</p>
                        <p className="text-[10px] text-slate-400 truncate w-48">{persona.role}</p>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 shadow-glow" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xs shadow-glow">
            TW
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">Tomide Williams</p>
            <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 inline" /> Verified Profile
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
