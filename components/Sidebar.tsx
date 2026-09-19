'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Compass, 
  Target, 
  Bookmark, 
  Briefcase, 
  Bot, 
  User, 
  Award,
  Layers,
  Zap,
  Globe2
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Opportunity Universe', href: '/', icon: Sparkles, badge: 'Daily' },
    { name: 'Discover', href: '/discover', icon: Compass },
    { name: 'My Missions', href: '/missions', icon: Target, badge: '3 Active' },
    { name: 'Saved Opportunities', href: '/saved', icon: Bookmark },
    { name: 'Applications & Tracker', href: '/applications', icon: Briefcase, badge: '4' },
    { name: 'Oppverse AI Agent', href: '/agent', icon: Bot },
    { name: 'Opportunity Profile', href: '/profile', icon: User, highlight: true },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass-panel border-r border-slate-800/80 flex flex-col justify-between z-40">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/60 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Oppverse<span className="text-cyan-400">.ai</span>
              </span>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-500">
                Opportunity Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Main Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/20 to-cyan-500/10 text-white border border-indigo-500/30 shadow-glow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    isActive ? 'bg-indigo-500/40 text-cyan-300' : 'bg-slate-800 text-slate-400'
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
      <div className="p-4 border-t border-slate-800/60">
        <Link 
          href="/profile"
          className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/40 block transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 group-hover:text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Profile Strength
            </span>
            <span className="text-xs font-bold text-cyan-400">88%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full w-[88%]" />
          </div>
          <p className="text-[11px] text-slate-500 mt-2 truncate">
            Active: <span className="text-slate-300 font-medium">Product Marketing Lead</span>
          </p>
        </Link>
      </div>
    </aside>
  );
}
