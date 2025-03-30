'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme } from '@/components/layout/settings-panel';

type FontSize = 'small' | 'medium' | 'large';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColorScheme?: string;
  defaultFontSize?: FontSize;
};

type ThemeContextType = {
  theme: Theme;
  colorScheme: string;
  fontSize: FontSize;
  setTheme: (theme: Theme) => void;
  setColorScheme: (colorScheme: string) => void;
  setFontSize: (fontSize: FontSize) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  defaultColorScheme = 'default',
  defaultFontSize = 'medium',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [colorScheme, setColorScheme] = useState(defaultColorScheme);
  const [fontSize, setFontSize] = useState<FontSize>(defaultFontSize);
  const [mounted, setMounted] = useState(false);
  
  // Handle theme change
  useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    
    // Remove old theme
    root.classList.remove('light', 'dark');
    
    // Apply new theme
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    // Save preference to local storage
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);
  
  // Handle color scheme change
  useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    
    // Remove old color scheme
    root.classList.remove(
      'theme-default',
      'theme-emerald',
      'theme-orange',
      'theme-rose',
      'theme-purple',
      'theme-cyan'
    );
    
    // Apply new color scheme
    root.classList.add(`theme-${colorScheme}`);
    
    // Save preference to local storage
    localStorage.setItem('colorScheme', colorScheme);
  }, [colorScheme, mounted]);
  
  // Handle font size change
  useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    
    // Remove old font size
    root.classList.remove('text-small', 'text-medium', 'text-large');
    
    // Apply new font size
    root.classList.add(`text-${fontSize}`);
    
    // Save preference to local storage
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize, mounted]);
  
  // Initialize from local storage and mark as mounted
  useEffect(() => {
    setMounted(true);
    
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const storedColorScheme = localStorage.getItem('colorScheme');
    const storedFontSize = localStorage.getItem('fontSize') as FontSize | null;
    
    if (storedTheme) {
      setTheme(storedTheme);
    }
    
    if (storedColorScheme) {
      setColorScheme(storedColorScheme);
    }
    
    if (storedFontSize) {
      setFontSize(storedFontSize);
    }
    
    // Apply initial classes to prevent flash
    const root = window.document.documentElement;
    const initialTheme = storedTheme || defaultTheme;
    
    // Apply theme
    if (initialTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(initialTheme);
    }
    
    // Apply color scheme
    root.classList.add(`theme-${storedColorScheme || defaultColorScheme}`);
    
    // Apply font size
    root.classList.add(`text-${storedFontSize || defaultFontSize}`);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(systemTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [defaultTheme, defaultColorScheme, defaultFontSize]);
  
  // Avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }
  
  const value = {
    theme,
    colorScheme,
    fontSize,
    setTheme,
    setColorScheme,
    setFontSize,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 