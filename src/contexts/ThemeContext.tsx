
import React, { createContext, useContext, useEffect } from 'react';
import { useUserSettings } from '@/hooks/useUserSettings';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, updateSettings, loading } = useUserSettings();

  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  };

  const getEffectiveTheme = (theme: Theme): 'light' | 'dark' => {
    if (theme === 'system') {
      return getSystemTheme();
    }
    return theme;
  };

  const setTheme = (theme: Theme) => {
    updateSettings({ theme });
  };

  const effectiveTheme = getEffectiveTheme(settings.theme);

  // Apply theme to document
  useEffect(() => {
    if (loading) return;

    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
    
    // Set data attribute for better CSS targeting
    root.setAttribute('data-theme', effectiveTheme);
  }, [effectiveTheme, loading]);

  // Listen for system theme changes
  useEffect(() => {
    if (settings.theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = document.documentElement;
      const newTheme = getSystemTheme();
      root.classList.remove('light', 'dark');
      root.classList.add(newTheme);
      root.setAttribute('data-theme', newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  // Don't render children until settings are loaded
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme: settings.theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
