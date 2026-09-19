'use client';

import React from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { useNav } from '@/components/NavProvider';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useNav();

  return (
    <div className={`app-shell flex-1 ml-0 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} flex flex-col min-h-screen pb-16 lg:pb-0 w-full overflow-x-hidden transition-[margin] duration-200`}>
      <Header />
      <main className="app-main flex-1 pt-24 px-4 sm:px-8 lg:px-10 pb-12 overflow-y-auto max-w-[1536px] w-full mx-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
