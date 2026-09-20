'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

interface NavContextValue {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const NavContext = createContext<NavContextValue | null>(null);

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Default to collapsed immediately on load
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('oppverse-sidebar-collapsed');
    if (saved !== null) {
      setIsSidebarCollapsed(saved === 'true');
    } else {
      setIsSidebarCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((previous) => {
      const next = !previous;
      localStorage.setItem('oppverse-sidebar-collapsed', String(next));
      return next;
    });
  };

  const value = useMemo(
    () => ({
      isMobileMenuOpen,
      setIsMobileMenuOpen,
      toggleMobileMenu: () => setIsMobileMenuOpen((prev) => !prev),
      closeMobileMenu: () => setIsMobileMenuOpen(false),
      isSidebarCollapsed,
      toggleSidebar,
    }),
    [isMobileMenuOpen, isSidebarCollapsed]
  );

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav() {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error('useNav must be used within NavProvider');
  }
  return context;
}