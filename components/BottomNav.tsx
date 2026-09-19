'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutGrid, 
  Compass, 
  Target, 
  Briefcase, 
  MessageSquare 
} from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Universe', href: '/', icon: LayoutGrid },
    { name: 'Discover', href: '/discover', icon: Compass },
    { name: 'Missions', href: '/missions', icon: Target },
    { name: 'Tracker', href: '/applications', icon: Briefcase },
    { name: 'AI Agent', href: '/agent', icon: MessageSquare },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/80 h-16 px-2 flex items-center justify-around shadow-2xl"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors ${
              isActive
                ? 'text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${
              isActive ? 'bg-zinc-800/80 text-white' : ''
            }`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-medium mt-0.5 ${
              isActive ? 'text-white font-semibold' : 'text-zinc-500'
            }`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}