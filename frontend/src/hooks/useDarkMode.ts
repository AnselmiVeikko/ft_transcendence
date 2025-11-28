import { useState, useEffect, useMemo } from 'react';

const getInitialState = (): 'dark' | 'light' | 'system' => {
  const storedPreference = localStorage.getItem('color-theme');
  if (storedPreference === 'dark' || storedPreference === 'light' || storedPreference === 'system') {
    return storedPreference;
  }
  return 'system';
};

const isSystemDark = (): boolean =>
  window.matchMedia('(prefers-color-scheme: dark)').matches;

export const useDarkMode = () => {
  const [themePreference, setThemePreference] = useState<'dark' | 'light' | 'system'>(getInitialState);

  const appliedTheme = useMemo<'dark' | 'light'>(() => {
    if (themePreference === 'system') {
      return isSystemDark() ? 'dark' : 'light';
    }
    return themePreference;
  }, [themePreference]);

  // effect to update the html class and localstorage whenever themePreference changes
  useEffect(() => {
    const root = window.document.documentElement;

    if (appliedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('color-theme', themePreference);

  }, [themePreference, appliedTheme]);

  useEffect(() => {
    if (themePreference !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handler = (e: MediaQueryListEvent) => {
      const root = window.document.documentElement;
      if (e.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [themePreference]);
  
  const setMode = (mode: 'dark' | 'light' | 'system') => {
    setThemePreference(mode);
  };
  return { themePreference, appliedTheme, setMode };
};