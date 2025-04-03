'use client';

import { useEffect } from 'react';
import { useTheme } from './theme-provider';
import { ThemeSwitcher } from './theme-switcher';

// Helper to calculate text color based on background brightness
const getTextColor = (bgColor: string): string => {
  try {
    // Convert hex to RGB
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    
    // Calculate brightness (0-255)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return white for dark backgrounds, black for light backgrounds
    return brightness < 128 ? '#ffffff' : '#000000';
  } catch (e) {
    console.error('Error calculating text color:', e);
    return '#ffffff'; // Fallback to white text
  }
};

export default function ThemeManager() {
  // Try to access theme context
  let theme;
  try {
    theme = useTheme();
  } catch (e) {
    console.error('Error accessing theme in ThemeManager:', e);
    return null;
  }
  
  const { 
    theme: themeMode,
    setTheme,
    colorScheme,
    setColorScheme,
    fontSize,
    setFontSize,
    sidebarColor,
    setSidebarColor,
    setSidebarTextColor
  } = theme;

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      
      // Load saved preferences
      const storedTheme = localStorage.getItem('theme');
      const storedColorScheme = localStorage.getItem('colorScheme');
      const storedFontSize = localStorage.getItem('fontSize');
      const storedSidebarColor = localStorage.getItem('sidebarColor');
      
      // Set theme state from localStorage or leave defaults
      if (storedTheme) setTheme(storedTheme as 'light' | 'dark' | 'system');
      if (storedColorScheme) setColorScheme(storedColorScheme);
      if (storedFontSize) setFontSize(storedFontSize as 'small' | 'medium' | 'large');
      if (storedSidebarColor) {
        setSidebarColor(storedSidebarColor);
        setSidebarTextColor(getTextColor(storedSidebarColor));
      }
    } catch (e) {
      console.error('Error initializing from localStorage:', e);
    }
  }, [setTheme, setColorScheme, setFontSize, setSidebarColor, setSidebarTextColor]);

  // Theme change effect
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      
      localStorage.setItem('theme', themeMode);
      
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      
      if (themeMode === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(themeMode);
      }
    } catch (e) {
      console.error('Error updating theme mode:', e);
    }
  }, [themeMode]);

  // Color scheme change effect
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      
      localStorage.setItem('colorScheme', colorScheme);
      
      const root = document.documentElement;
      root.classList.forEach(cls => {
        if (cls.startsWith('theme-')) {
          root.classList.remove(cls);
        }
      });
      
      root.classList.add(`theme-${colorScheme}`);
    } catch (e) {
      console.error('Error updating color scheme:', e);
    }
  }, [colorScheme]);

  // Font size change effect
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      
      localStorage.setItem('fontSize', fontSize);
      
      const root = document.documentElement;
      root.classList.remove('text-small', 'text-medium', 'text-large');
      root.classList.add(`text-${fontSize}`);
    } catch (e) {
      console.error('Error updating font size:', e);
    }
  }, [fontSize]);

  // Sidebar color change effect
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      
      localStorage.setItem('sidebarColor', sidebarColor);
      setSidebarTextColor(getTextColor(sidebarColor));
    } catch (e) {
      console.error('Error updating sidebar color:', e);
    }
  }, [sidebarColor, setSidebarTextColor]);

  // System theme change listener
  useEffect(() => {
    try {
      if (typeof window === 'undefined' || themeMode !== 'system') return;
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(mediaQuery.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } catch (e) {
      console.error('Error setting up media query listener:', e);
    }
  }, [themeMode]);

  // Return ThemeSwitcher component
  return <ThemeSwitcher />;
} 