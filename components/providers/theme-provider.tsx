'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';
type FontSize = 'small' | 'medium' | 'large';

// Define color mapping for the available color schemes
export const colorSchemeMap = {
  default: { light: '#4f46e5', dark: '#6366f1' },  // indigo
  emerald: { light: '#10b981', dark: '#059669' },  // emerald
  orange: { light: '#f97316', dark: '#ea580c' },   // orange
  rose: { light: '#f43f5e', dark: '#e11d48' },     // rose
  purple: { light: '#a855f7', dark: '#9333ea' },   // purple
  cyan: { light: '#06b6d4', dark: '#0891b2' },     // cyan
  neutral: { light: '#525252', dark: '#262626' },  // neutral-600/800
  slate: { light: '#475569', dark: '#1e293b' },    // slate
  gray: { light: '#4b5563', dark: '#1f2937' },     // gray
  zinc: { light: '#52525b', dark: '#27272a' },     // zinc
  stone: { light: '#57534e', dark: '#292524' },    // stone
  red: { light: '#dc2626', dark: '#b91c1c' },      // red
  amber: { light: '#d97706', dark: '#b45309' },    // amber
  yellow: { light: '#ca8a04', dark: '#a16207' },   // yellow
  lime: { light: '#65a30d', dark: '#4d7c0f' },     // lime
  green: { light: '#16a34a', dark: '#15803d' },    // green
  teal: { light: '#0d9488', dark: '#0f766e' },     // teal
  sky: { light: '#0284c7', dark: '#0369a1' },      // sky
  blue: { light: '#2563eb', dark: '#1d4ed8' },     // blue
  indigo: { light: '#4f46e5', dark: '#4338ca' },   // indigo
  violet: { light: '#7c3aed', dark: '#6d28d9' },   // violet
  fuchsia: { light: '#c026d3', dark: '#a21caf' },  // fuchsia
  pink: { light: '#db2777', dark: '#be185d' },     // pink
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: string;
  setColorScheme: (scheme: string) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  sidebarColor: string;
  setSidebarColor: (color: string) => void;
  sidebarTextColor: string;
  setSidebarTextColor: (color: string) => void;
};

// Create context without a default value
const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  defaultColorScheme = 'default',
  defaultFontSize = 'medium',
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColorScheme?: string;
  defaultFontSize?: FontSize;
}) {
  // State for theme settings
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [colorScheme, setColorScheme] = useState(defaultColorScheme);
  const [fontSize, setFontSize] = useState<FontSize>(defaultFontSize);
  const [sidebarColor, setSidebarColor] = useState('#262626');
  const [sidebarTextColor, setSidebarTextColor] = useState('#ffffff');
  const [currentMode, setCurrentMode] = useState<'light' | 'dark'>('dark');
  
  // Update sidebar color based on color scheme and current mode
  useEffect(() => {
    // Determine if we're in dark mode
    let isDarkMode = false;
    
    // Check HTML class for dark mode
    if (typeof document !== 'undefined') {
      isDarkMode = document.documentElement.classList.contains('dark');
      
      // Also check system preference if theme is set to system
      if (theme === 'system') {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        isDarkMode = prefersDark;
      } else {
        // Explicitly set by user
        isDarkMode = theme === 'dark';
      }
      
      // Set current mode
      setCurrentMode(isDarkMode ? 'dark' : 'light');
      
      // Set sidebar colors based on color scheme and mode
      if (colorScheme in colorSchemeMap) {
        const schemeColors = colorSchemeMap[colorScheme as keyof typeof colorSchemeMap];
        setSidebarColor(isDarkMode ? schemeColors.dark : schemeColors.light);
        
        // Determine text color based on background brightness
        const hexColor = isDarkMode ? schemeColors.dark : schemeColors.light;
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        
        // Calculate perceived brightness using relative luminance formula
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        setSidebarTextColor(brightness > 128 ? '#000000' : '#ffffff');
      }
    }
  }, [theme, colorScheme]);

  // Listen for changes to the HTML class (e.g., when dark mode changes)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDarkMode = document.documentElement.classList.contains('dark');
          setCurrentMode(isDarkMode ? 'dark' : 'light');
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);
  
  const value = {
    theme,
    setTheme,
    colorScheme,
    setColorScheme,
    fontSize,
    setFontSize,
    sidebarColor,
    setSidebarColor,
    sidebarTextColor,
    setSidebarTextColor
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme - simplified to avoid issues
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
} 