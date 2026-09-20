'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutGrid, 
  Compass, 
  Target, 
  Bookmark, 
  Briefcase, 
  MessageSquare, 
  User, 
  Activity,
  X
} from 'lucide-react';
import { useNav } from '@/components/NavProvider';

export function SidebarToggleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.85" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="3" />
      <path d="M9 3v18" />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { isMobileMenuOpen, closeMobileMenu, isSidebarCollapsed, toggleSidebar } = useNav();
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/forgot-password') || pathname.startsWith('/reset-password') || pathname.startsWith('/onboarding');
  if (isAuthPage) return null;

  const navItems = [
    { name: 'Opportunity Universe', href: '/', icon: LayoutGrid },
    { name: 'Discover', href: '/discover', icon: Compass },
    { name: 'My Missions', href: '/missions', icon: Target },
    { name: 'Saved Opportunities', href: '/saved', icon: Bookmark },
    { name: 'Applications & Tracker', href: '/applications', icon: Briefcase },
    { name: 'Oppverse AI Agent', href: '/agent', icon: MessageSquare },
    { name: 'Opportunity Profile', href: '/profile', icon: User, highlight: true },
  ];

  const sidebarContent = (collapsed = false) => (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Brand Header */}
        <div className={`brand-header h-20 flex items-center border-b border-zinc-800 ${collapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
          {collapsed ? (
            <button
              type="button"
              onClick={toggleSidebar}
              className="sidebar-link flex min-h-10 w-full items-center justify-center py-2 rounded-xl hover:bg-zinc-900 border border-transparent transition-all group"
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <img src="/brand/oppverse-icon-dark.png" alt="Oppverse AI" className="w-7 h-7 object-contain rounded-lg shadow-sm group-hover:scale-105 transition-transform" />
            </button>
          ) : (
            <div className="flex items-center justify-between w-full min-w-0">
              <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2.5 group whitespace-nowrap min-w-0" title="Oppverse AI">
                <img src="/brand/oppverse-icon-dark.png" alt="Oppverse AI" className="w-7 h-7 object-contain rounded-lg flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform" />
                <span className="font-display font-semibold text-lg tracking-tight text-white whitespace-nowrap">
                  Oppverse AI
                </span>
              </Link>

              <button
                type="button"
                onClick={toggleSidebar}
                className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-all flex-shrink-0 ml-2"
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <SidebarToggleIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Close button for mobile drawer */}
          <button
            onClick={closeMobileMenu}
            className="lg:hidden icon-button !w-8 !h-8 text-zinc-400 hover:text-white ml-auto"
            aria-label="Close navigation menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className={`${collapsed ? 'px-2' : 'px-4'} py-6 space-y-1.5`}>
          {collapsed && (
            <button
              type="button"
              onClick={toggleSidebar}
              className="sidebar-link flex min-h-10 w-full items-center justify-center py-2 mb-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent transition-all"
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <SidebarToggleIcon className="w-4 h-4" />
            </button>
          )}
          <div className={`nav-heading px-3 pb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 ${collapsed ? 'sr-only' : ''}`}>
            Main Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                title={item.name}
                className={`sidebar-link flex min-h-10 items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-3'} py-2 rounded-xl text-[13px] font-medium transition-all border ${
                  isActive
                    ? 'sidebar-link-active'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`icon-sm ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                  {!collapsed && <span className="nav-label truncate">{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profile Mini Status */}
      <div className={`profile-status border-t border-zinc-800 ${collapsed ? 'p-2' : 'p-4'}`}>
        {collapsed ? (
          <div className="flex flex-col items-center">
            <Link href="/profile" className="icon-button !w-10 !h-10" title="Profile strength: 88%" aria-label="Profile strength: 88%">
              <Activity className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <Link 
            href="/profile"
            onClick={closeMobileMenu}
            className="profile-status-card p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 block transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-slate-400" />
                Profile Strength
              </span>
              <span className="text-xs font-bold text-zinc-100">88%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-zinc-200 h-full rounded-full w-[88%]" />
            </div>
            <p className="text-[11px] text-slate-500 mt-2 truncate">
              Active: <span className="text-slate-300 font-medium">Product Marketing Lead</span>
            </p>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className={`app-sidebar hidden lg:flex ${isSidebarCollapsed ? 'w-20' : 'w-64'} h-screen fixed left-0 top-0 glass-panel border-r border-zinc-800 flex-col justify-between z-40 transition-[width] duration-200`}>
        {sidebarContent(isSidebarCollapsed)}
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Overlay */}
          <div 
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Sidebar Content */}
          <div className="relative w-72 max-w-[85vw] h-full bg-zinc-950 border-r border-zinc-800 z-50 flex flex-col shadow-2xl animate-fadeIn">
            {sidebarContent(false)}
          </div>
        </div>
      )}
    </>
  );
}