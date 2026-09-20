'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  ChevronDown, 
  Check, 
  ShieldCheck,
  Menu,
  LogOut,
  LogIn
} from 'lucide-react';
import { initialProfile } from '@/lib/sample-data';
import { useTheme } from '@/components/ThemeProvider';
import { useNav } from '@/components/NavProvider';

import { useAuth } from '@/components/AuthProvider';

export default function Header() {
  const [selectedPersonaId, setSelectedPersonaId] = useState(initialProfile.activePersonaId);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { toggleMobileMenu, isSidebarCollapsed, toggleSidebar } = useNav();
  const { user, signOut } = useAuth();

  const activePersona = initialProfile.personas.find(p => p.id === selectedPersonaId) || initialProfile.personas[0];
  const userDisplayName = user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'Tomide Williams');
  const userInitials = userDisplayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'TW';

  return (
    <header className={`app-header h-20 fixed top-0 right-0 left-0 ${isSidebarCollapsed ? 'lg:left-20' : 'lg:left-64'} px-4 sm:px-8 lg:px-10 flex items-center justify-between z-30 transition-all`}>
      {/* Left: Mobile Menu Toggle & Brand / Search Bar */}
      
      <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-lg">
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="lg:hidden icon-button !w-9 !h-9 text-zinc-300 hover:text-white flex-shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/" className="lg:hidden flex items-center gap-1.5 flex-shrink-0 mr-1 sm:mr-2">
          <img src="/brand/oppverse-icon-dark.png" alt="Oppverse AI" className="w-6 h-6 object-contain rounded" />
          <span className="font-display font-bold text-base text-white">Oppverse AI</span>
        </Link>

        <div className="header-search relative w-full hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search opportunities, grants, fellowships..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-zinc-600 text-white text-xs outline-none transition-all placeholder:text-zinc-500"
          />
        </div>
      </div>

      {/* Right Controls: Persona Switcher, Theme, Notifications & User Profile */}
      <div className="header-actions flex items-center gap-2 sm:gap-3">
        {/* Persona Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsPersonaOpen(!isPersonaOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-200 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="persona-label text-zinc-400 font-medium">Persona:</span>
            <span className="persona-name font-semibold text-white truncate max-w-[130px]">{activePersona.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {isPersonaOpen && (
            <div className="absolute right-0 mt-2 w-72 p-2 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl z-50 animate-fadeIn">
              <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Active Opportunity Persona</p>
                <p className="text-xs text-zinc-500">Matching algorithm weights change dynamically.</p>
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

        {/* User Profile / Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 pl-1 sm:pl-2 border-l border-zinc-800 hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-950 font-bold text-xs flex-shrink-0">
              {userInitials}
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-white leading-tight truncate max-w-[120px]">{userDisplayName}</p>
              <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 inline" /> {user ? 'Online' : 'Verified'}
              </p>
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl z-50 animate-fadeIn">
              <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
                <p className="text-xs font-semibold text-white truncate">{userDisplayName}</p>
                <p className="text-[11px] text-zinc-400 truncate">{user?.email || 'tomide@williams.brand'}</p>
              </div>
              <div className="py-1 space-y-1">
                <Link
                  href="/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 block transition-colors"
                >
                  Opportunity Profile
                </Link>
                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      signOut();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-white hover:bg-zinc-900 flex items-center gap-2 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" /> Sign In
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}