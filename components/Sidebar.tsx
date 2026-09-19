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

export default function Sidebar() {
  const pathname = usePathname();
  const { isMobileMenuOpen, closeMobileMenu } = useNav();

  const navItems = [
    { name: 'Opportunity Universe', href: '/', icon: LayoutGrid, badge: 'Daily' },
    { name: 'Discover', href: '/discover', icon: Compass },
    { name: 'My Missions', href: '/missions', icon: Target, badge: '3 Active' },
    { name: 'Saved Opportunities', href: '/saved', icon: Bookmark },
    { name: 'Applications & Tracker', href: '/applications', icon: Briefcase, badge: '4' },
    { name: 'Oppverse AI Agent', href: '/agent', icon: MessageSquare },
    { name: 'Opportunity Profile', href: '/profile', icon: User, highlight: true },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Brand Header */}
        <div className="brand-header px-5 h-16 border-b border-zinc-800 flex items-center justify-between">
          <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-3 group">
            <span className="brand-compact hidden font-display font-semibold text-lg">O</span>
            <div className="brand-copy">
              <span className="font-display font-semibold text-lg tracking-tight text-white">
                Oppverse
              </span>
              <p className="text-[9px] uppercase font-semibold tracking-wider text-zinc-500 mt-0.5">
                Opportunity Intelligence
              </p>
            </div>
          </Link>

          {/* Close button for mobile drawer */}
          <button
            onClick={closeMobileMenu}
            className="lg:hidden icon-button !w-8 !h-8 text-zinc-400 hover:text-white"
            aria-label="Close navigation menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <div className="nav-heading px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
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
                className={`sidebar-link flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all border ${
                  isActive
                    ? 'sidebar-link-active'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`icon-sm ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                  <span className="nav-label">{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`nav-badge badge ${
                    isActive ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profile Mini Status */}
      <div className="profile-status p-4 border-t border-zinc-800">
        <Link 
          href="/profile"
          onClick={closeMobileMenu}
          className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 block transition-colors group"
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
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="app-sidebar hidden lg:flex w-64 h-screen fixed left-0 top-0 glass-panel border-r border-zinc-800 flex-col justify-between z-40">
        {sidebarContent}
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
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}