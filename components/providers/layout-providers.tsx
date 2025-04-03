'use client';

import React, { createContext, useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { SidebarColorProvider } from '@/components/providers/sidebar-color-provider';

// This context will store information about the current theme/dark mode
// to be used by the SidebarColorProvider without causing circular dependencies
export const ThemeStateContext = createContext<{
  isDarkMode: boolean;
  currentColorScheme: string;
}>({
  isDarkMode: false,
  currentColorScheme: 'default'
});

// Main layout providers wrapper
export default function LayoutProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentColorScheme, setCurrentColorScheme] = useState('default');
  
  // Initialize mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Set up theme detection - make sure this runs on every render
  useEffect(() => {
    // Only run in the browser and after component is mounted
    if (typeof window !== 'undefined' && mounted) {
      // Try to get from localStorage first
      const storedDarkMode = localStorage.getItem('isDarkMode') === 'true';
      const storedColorScheme = localStorage.getItem('currentColorScheme') || 'default';
      
      // Then check if document has dark class
      const documentHasDarkClass = document.documentElement.classList.contains('dark');
      
      // Or check system preference
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      setIsDarkMode(storedDarkMode || documentHasDarkClass || prefersDarkMode);
      setCurrentColorScheme(storedColorScheme);
      
      // Set up observer to detect theme changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            const hasDarkClass = document.documentElement.classList.contains('dark');
            setIsDarkMode(hasDarkClass);
          }
        });
      });
      
      observer.observe(document.documentElement, { attributes: true });
      
      return () => observer.disconnect();
    }
  }, [mounted]); // Include mounted in dependencies
  
  // Early return without providers during SSR
  if (!mounted) {
    return <>{children}</>;
  }
  
  return (
    <ThemeProvider defaultTheme="system" defaultColorScheme="default" defaultFontSize="medium">
      <ThemeStateContext.Provider value={{ isDarkMode, currentColorScheme }}>
        <SidebarColorProvider>
          {children}
        </SidebarColorProvider>
      </ThemeStateContext.Provider>
    </ThemeProvider>
  );
} 