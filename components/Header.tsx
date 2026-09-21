'use client';

import React, { useState, useEffect } from 'react';
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
  LogIn,
  Clock,
  Sparkles,
  AlertTriangle,
  X,
  ExternalLink
} from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { useTheme } from '@/components/ThemeProvider';
import { useNav } from '@/components/NavProvider';
import { useAuth } from '@/components/AuthProvider';
import { generateOpportunityNotifications, AppNotification } from '@/lib/notifications';
import { fetchOpportunities, fetchUserProfile } from '@/lib/supabase/db';

export default function Header() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const { theme, toggleTheme } = useTheme();
  const { toggleMobileMenu, isSidebarCollapsed } = useNav();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (!user?.id) return;
    fetchUserProfile(user.id).then((userProfile) => {
      setProfile(userProfile);
      setSelectedPersonaId(userProfile?.activePersonaId || '');
    });
  }, [user?.id]);

  useEffect(() => {
    async function loadNotifs() {
      try {
        const liveOpps = await fetchOpportunities();
        const notifs = generateOpportunityNotifications(liveOpps);
        setNotifications(notifs);
      } catch (e) {
        setNotifications([]);
      }
    }
    loadNotifs();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markSingleAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? ({ ...n, read: true }) : n));
  };

  const activePersona = profile?.personas.find(p => p.id === selectedPersonaId) || profile?.personas[0];
  const userDisplayName = user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'Member');
  const userInitials = userDisplayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'ME';

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

        <Link href="/app" className="lg:hidden flex items-center gap-1.5 flex-shrink-0 mr-1 sm:mr-2">
          <img src="/brand/oppverse-icon-dark.png" alt="Oppverse AI" className="brand-icon w-6 h-6 object-contain rounded" />
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
            <span className="persona-name font-semibold text-white truncate max-w-[130px]">{activePersona?.name || 'Set up profile'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {isPersonaOpen && (
            <div className="absolute right-0 mt-2 w-72 p-2 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl z-50 animate-fadeIn">
              <div className="py-1 space-y-1">
                {(profile?.personas || []).map((persona) => {
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

        {/* Notification Bell with Live Alerts Popover */}
        <div className="relative">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="icon-button !w-9 !h-9 relative" 
            aria-label="Notifications" 
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-zinc-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 p-3 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl z-50 animate-fadeIn">
              <div className="flex items-center justify-between px-2 pb-2.5 border-b border-zinc-800/80 mb-2">
                <div className="flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Opportunity Alerts</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-mono text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead} 
                    className="text-[10px] text-zinc-400 hover:text-white transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-zinc-500 text-xs">
                    No active deadline alerts at this time.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markSingleAsRead(n.id)}
                      className={`p-2.5 rounded-xl border text-xs transition-all ${
                        n.read ? 'bg-zinc-900/40 border-zinc-900 opacity-70' :
                        n.type === 'deadline_critical' ? 'bg-rose-950/30 border-rose-800/60' :
                        n.type === 'deadline_urgent' ? 'bg-amber-950/30 border-amber-800/60' :
                        'bg-zinc-900 border-zinc-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 font-semibold">
                          {n.type === 'deadline_critical' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                          ) : n.type === 'deadline_urgent' ? (
                            <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          )}
                          <span className={
                            n.type === 'deadline_critical' ? 'text-rose-300 text-[11px]' :
                            n.type === 'deadline_urgent' ? 'text-amber-300 text-[11px]' :
                            'text-zinc-200 text-[11px]'
                          }>
                            {n.title}
                          </span>
                        </div>
                        <span className="text-[9px] text-zinc-500 font-mono">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed pl-5 mb-1.5">
                        {n.message}
                      </p>
                      {n.link && (
                        <div className="pl-5">
                          <Link
                            href={n.link}
                            onClick={() => setIsNotifOpen(false)}
                            className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-medium"
                          >
                            View Opportunity <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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
                <p className="text-[11px] text-zinc-400 truncate">{user?.email || (user ? 'Account Member' : 'Guest Session')}</p>
              </div>
              <div className="py-1 space-y-1">
                <Link
                  href="/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 block transition-colors"
                >
                  Opportunity Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    signOut();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
