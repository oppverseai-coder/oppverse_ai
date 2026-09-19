'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  Search, 
  ChevronDown, 
  Check, 
  ShieldCheck, 
  Moon, 
  Sun, 
  Menu 
} from 'lucide-react';
import { initialProfile } from '@/lib/sample-data';
import { useTheme } from '@/components/ThemeProvider';
import { useNav } from '@/components/NavProvider';

export default function Header() {
  const [selectedPersonaId, setSelectedPersonaId] = useState(initialProfile.activePersonaId);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { toggleMobileMenu } = useNav();

  const activePersona = initialProfile.personas.find(p => p.id === selectedPersonaId) || initialProfile.personas[0];

  return (
    <header className="app-header h-16 fixed top-0 right-0 left-0 lg:left-64 glass-panel border-b border-zinc-800 px-4 sm:px-8 flex items-center justify-between z-30 transition-all">
      {/* Left: Mobile Menu Toggle & Brand / Search Bar */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-lg">
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="lg:hidden icon-button !w-9 !h-9 text-zinc-300 hover:text-white flex-shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <Link href="/" className="lg:hidden flex items-center gap-1.5 flex-shrink-0 mr-1 sm:mr-2">
          <span className="font-display font-bold text-base text-white">Oppverse</span>
        </Link>

        {/* Search Universe Bar */}
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search opportunities..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs glass-input placeholder:text-zinc-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Right Controls: Persona Switcher & Profile */}
      <div className="header-actions flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
        {/* Persona Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsPersonaOpen(!isPersonaOpen)}
            className="persona-switcher flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 h-9 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors text-xs text-zinc-200"
            aria-label="Switch opportunity persona"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="persona-label hidden sm:inline text-zinc-400">Persona:</span>
            <span className="persona-name font-medium text-white max-w-[90px] sm:max-w-[140px] truncate">
              {activePersona.name}
            </span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>

          {isPersonaOpen && (
            <div className="surface-menu absolute right-0 mt-2 w-72 p-2 z-50 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl animate-fadeIn">
              <div className="px-3 py-2 border-b border-zinc-800">
                <p className="text-xs font-semibold text-zinc-200">Switch Opportunity Persona</p>
                <p className="text-[11px] text-zinc-400">Tailors your daily feed and matching priority</p>
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
                          ? 'bg-zinc-800 text-white border-zinc-700'
                          : 'text-zinc-300 hover:bg-zinc-900 border-transparent'
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{persona.name}</p>
                        <p className="text-[10px] text-zinc-400 truncate w-48">{persona.role}</p>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="icon-button !w-9 !h-9"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-zinc-300" /> : <Moon className="w-4 h-4 text-zinc-300" />}
        </button>

        {/* Notification Bell */}
        <button className="icon-button !w-9 !h-9 relative" aria-label="Notifications" title="Notifications">
          <Bell className="w-4 h-4 text-zinc-300" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-cyan-400" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 pl-1 sm:pl-2 border-l border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-950 font-bold text-xs flex-shrink-0">
            TW
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">Tomide Williams</p>
            <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 inline" /> Verified
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}