'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem('oppverse-theme');
    const initialTheme: Theme = storedTheme === 'light' ? 'light' : 'dark';
    const appliedTheme: Theme = pathname === '/' ? 'dark' : initialTheme;
    const root = document.documentElement;
    root.dataset.themeScope = pathname === '/' ? 'landing' : 'product';
    root.classList.remove('light', 'dark');
    root.classList.add(appliedTheme);
    root.style.colorScheme = appliedTheme;
    setThemeState(appliedTheme);
  }, [pathname]);

  const setTheme = (nextTheme: Theme) => {
    if (pathname === '/') return;
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(nextTheme);
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem('oppverse-theme', nextTheme);
    setThemeState(nextTheme);
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    }),
    [theme, pathname]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}
