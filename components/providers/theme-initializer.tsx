'use client';

import { useEffect, useState } from 'react';
import { useTheme, Theme } from './theme-provider';

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

export function ThemeInitializer() {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(false);
  
  // Get theme context safely 
  let themeContext;
  try {
    themeContext = useTheme();
  } catch (e) {
    console.error('Error accessing theme context:', e);
    setError(true);
    return null; // Exit early if theme context is not available
  }
  
  const { 
    theme,
    setTheme,
    colorScheme,
    setColorScheme,
    fontSize,
    setFontSize,
    sidebarColor,
    setSidebarColor,
    setSidebarTextColor
  } = themeContext;

  // This effect runs once on mount to initialize from localStorage
  useEffect(() => {
    if (error || typeof window === 'undefined') return;
    
    try {
      // Load saved preferences
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      const storedColorScheme = localStorage.getItem('colorScheme');
      const storedFontSize = localStorage.getItem('fontSize') as 'small' | 'medium' | 'large' | null;
      const storedSidebarColor = localStorage.getItem('sidebarColor');
      
      // Apply saved preferences to state (silently, without triggering effects yet)
      if (storedTheme) setTheme(storedTheme);
      if (storedColorScheme) setColorScheme(storedColorScheme);
      if (storedFontSize) setFontSize(storedFontSize);
      if (storedSidebarColor) setSidebarColor(storedSidebarColor);

      // Set the sidebar text color based on sidebar color
      if (storedSidebarColor) {
        setSidebarTextColor(getTextColor(storedSidebarColor));
      }
      
      // Apply initial classes directly to avoid flash
      const root = document.documentElement;
      
      // Clear any existing classes first
      root.classList.remove('light', 'dark');
      root.classList.forEach((cls) => {
        if (cls.startsWith('theme-')) {
          root.classList.remove(cls);
        }
      });
      root.classList.remove('text-small', 'text-medium', 'text-large');
      
      // Apply theme class
      if (storedTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
        root.classList.add(systemTheme);
      } else if (storedTheme) {
        root.classList.add(storedTheme);
      } else {
        // Apply default theme if no stored theme
        root.classList.add('light');
      }
      
      // Apply color scheme class
      root.classList.add(`theme-${storedColorScheme || 'default'}`);
      
      // Apply font size class
      root.classList.add(`text-${storedFontSize || 'medium'}`);
      
      // Mark as mounted only after initializing
      setMounted(true);
    } catch (e) {
      console.error('Error initializing theme:', e);
      setError(true);
    }
  }, [setTheme, setColorScheme, setFontSize, setSidebarColor, setSidebarTextColor, error]);

  // Set up auto-adjusting sidebar text color when sidebar color changes
  useEffect(() => {
    if (!mounted || error) return;
    
    try {
      setSidebarTextColor(getTextColor(sidebarColor));
    } catch (e) {
      console.error('Error updating sidebar text color:', e);
    }
  }, [sidebarColor, setSidebarTextColor, mounted, error]);

  // Update DOM and localStorage when theme changes
  useEffect(() => {
    if (!mounted || error || typeof window === 'undefined') return;

    try {
      localStorage.setItem('theme', theme);
      
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    } catch (e) {
      console.error('Error applying theme:', e);
    }
  }, [theme, mounted, error]);
  
  // Update DOM and localStorage when color scheme changes
  useEffect(() => {
    if (!mounted || error || typeof window === 'undefined') return;

    try {
      localStorage.setItem('colorScheme', colorScheme);
      
      const root = document.documentElement;
      
      // Remove old color schemes
      root.classList.forEach((cls) => {
        if (cls.startsWith('theme-')) {
          root.classList.remove(cls);
        }
      });
      
      // Add new color scheme
      root.classList.add(`theme-${colorScheme}`);
    } catch (e) {
      console.error('Error applying color scheme:', e);
    }
  }, [colorScheme, mounted, error]);
  
  // Update DOM and localStorage when font size changes
  useEffect(() => {
    if (!mounted || error || typeof window === 'undefined') return;

    try {
      localStorage.setItem('fontSize', fontSize);
      
      const root = document.documentElement;
      
      // Remove old font sizes
      root.classList.remove('text-small', 'text-medium', 'text-large');
      
      // Add new font size
      root.classList.add(`text-${fontSize}`);
    } catch (e) {
      console.error('Error applying font size:', e);
    }
  }, [fontSize, mounted, error]);
  
  // Update localStorage when sidebar color changes
  useEffect(() => {
    if (!mounted || error || typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('sidebarColor', sidebarColor);
    } catch (e) {
      console.error('Error saving sidebar color:', e);
    }
  }, [sidebarColor, mounted, error]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || typeof window === 'undefined' || theme !== 'system') return;

    try {
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
  }, [theme, mounted]);

  // This component doesn't render anything visually
  return null;
} 