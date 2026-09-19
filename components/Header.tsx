'use client';

import React, { useState } from 'react';
import { Bell, Search, ChevronDown, Check, ShieldCheck, Moon, Sun } from 'lucide-react';
import { initialProfile } from '@/lib/sample-data';
import { useTheme } from '@/components/ThemeProvider';

export default function Header() {
  const [selectedPersonaId, setSelectedPersonaId] = useState(initialProfile.activePersonaId);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const activePersona = initialProfile.personas.find(p => p.id === selectedPersonaId) || initialProfile.personas[0];

  return (
    <header className="app-header h-16 fixed top-0 right-0 left-64 glass-panel border-b border-zinc-800 px-8 flex items-center justify-between z-30">
      {/* Search Universe Bar */}
      <div className="header-search flex items-center gap-4 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search jobs, fellowships, grants, speaking..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-[13px] glass-input placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* Right Controls: Persona Switcher & Profile */}
      <div className="header-actions flex items-center gap-4">
        {/* Persona Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsPersonaOpen(!isPersonaOpen)}
            className="persona-switcher flex items-center gap-2.5 px-3 h-9 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-600 transition-colors text-xs text-zinc-200"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="persona-label text-slate-400">Persona:</span>
            <span className="persona-name font-semibold text-white">{activePersona.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isPersonaOpen && (
            <div className="surface-menu absolute right-0 mt-2 w-72 p-2 z-50">
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
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between border ${
                        isCurrent
                          ? 'bg-zinc-800 text-white border border-zinc-700'
                          : 'text-zinc-300 hover:bg-zinc-900 border-transparent'
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{persona.name}</p>
                        <p className="text-[10px] text-slate-400 truncate w-48">{persona.role}</p>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="icon-button"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="icon-sm" /> : <Moon className="icon-sm" />}
        </button>

        {/* Notification Bell */}
        <button className="icon-button relative" aria-label="Notifications" title="Notifications">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-zinc-100" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-950 font-bold text-xs">
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
