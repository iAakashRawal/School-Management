'use client';

import { useState, useEffect } from 'react';
import { useTheme } from './theme-provider';
import { SettingsPanel } from '@/components/layout/settings-panel';

// Define types for theme settings
type ThemeType = 'light' | 'dark' | 'system';
type FontSizeType = 'small' | 'medium' | 'large';

interface ThemeState {
  theme: ThemeType;
  colorScheme: string;
  fontSize: FontSizeType;
}

// Simple theme switcher that uses localStorage for persistence
export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(false);
  
  // Safely get theme context
  let theme;
  try {
    theme = useTheme();
  } catch (e) {
    console.error('Error accessing theme context in ThemeSwitcher:', e);
    setError(true);
    return null;
  }
  
  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Don't render during SSR or if there was an error
  if (!mounted || error) {
    return null;
  }
  
  return (
    <SettingsPanel
      currentTheme={theme.theme}
      currentColorScheme={theme.colorScheme}
      currentFontSize={theme.fontSize}
      onThemeChange={theme.setTheme}
      onColorSchemeChange={theme.setColorScheme}
      onFontSizeChange={theme.setFontSize}
    />
  );
} 