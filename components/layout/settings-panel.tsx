'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  X, 
  Moon, 
  Sun, 
  Monitor, 
  Check,
  ChevronRight,
  User,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

// Define available themes and color schemes
const colorSchemes = [
  { name: 'Default', value: 'default', lightColor: '#4f46e5', darkColor: '#6366f1' },
  { name: 'Emerald', value: 'emerald', lightColor: '#10b981', darkColor: '#059669' },
  { name: 'Orange', value: 'orange', lightColor: '#f97316', darkColor: '#ea580c' },
  { name: 'Rose', value: 'rose', lightColor: '#f43f5e', darkColor: '#e11d48' },
  { name: 'Purple', value: 'purple', lightColor: '#a855f7', darkColor: '#9333ea' },
  { name: 'Cyan', value: 'cyan', lightColor: '#06b6d4', darkColor: '#0891b2' },
  { name: 'Neutral', value: 'neutral', lightColor: '#525252', darkColor: '#262626' },
  { name: 'Slate', value: 'slate', lightColor: '#475569', darkColor: '#1e293b' },
  { name: 'Gray', value: 'gray', lightColor: '#4b5563', darkColor: '#1f2937' },
  { name: 'Zinc', value: 'zinc', lightColor: '#52525b', darkColor: '#27272a' },
  { name: 'Stone', value: 'stone', lightColor: '#57534e', darkColor: '#292524' },
  { name: 'Red', value: 'red', lightColor: '#dc2626', darkColor: '#b91c1c' },
  { name: 'Amber', value: 'amber', lightColor: '#d97706', darkColor: '#b45309' },
  { name: 'Yellow', value: 'yellow', lightColor: '#ca8a04', darkColor: '#a16207' },
  { name: 'Lime', value: 'lime', lightColor: '#65a30d', darkColor: '#4d7c0f' },
  { name: 'Green', value: 'green', lightColor: '#16a34a', darkColor: '#15803d' },
  { name: 'Teal', value: 'teal', lightColor: '#0d9488', darkColor: '#0f766e' },
  { name: 'Sky', value: 'sky', lightColor: '#0284c7', darkColor: '#0369a1' },
  { name: 'Blue', value: 'blue', lightColor: '#2563eb', darkColor: '#1d4ed8' },
  { name: 'Indigo', value: 'indigo', lightColor: '#4f46e5', darkColor: '#4338ca' },
  { name: 'Violet', value: 'violet', lightColor: '#7c3aed', darkColor: '#6d28d9' },
  { name: 'Fuchsia', value: 'fuchsia', lightColor: '#c026d3', darkColor: '#a21caf' },
  { name: 'Pink', value: 'pink', lightColor: '#db2777', darkColor: '#be185d' },
];

export type Theme = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';

interface SettingsPanelProps {
  onThemeChange?: (theme: Theme) => void;
  onColorSchemeChange?: (colorScheme: string) => void;
  onFontSizeChange?: (fontSize: FontSize) => void;
  currentTheme?: Theme;
  currentColorScheme?: string;
  currentFontSize?: FontSize;
}

export function SettingsPanel({
  onThemeChange,
  onColorSchemeChange,
  onFontSizeChange,
  currentTheme = 'system',
  currentColorScheme = 'default',
  currentFontSize = 'medium',
}: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('appearance');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect current mode for color scheme display more robustly
  useEffect(() => {
    // Check for dark mode in a few different ways to be resilient
    const checkDarkMode = () => {
      // First check HTML class
      if (typeof document !== 'undefined') {
        if (document.documentElement.classList.contains('dark')) {
          return true;
        }
        
        // Then check media query as fallback
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          // Only use this if theme is system or not explicitly light
          if (currentTheme === 'system' || currentTheme === 'dark') {
            return true;
          }
        }
        
        // Finally check stored preference
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
          return true;
        }
      }
      return false;
    };
    
    setIsDarkMode(checkDarkMode());

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(checkDarkMode());
        }
      });
    });

    if (typeof document !== 'undefined') {
      observer.observe(document.documentElement, { attributes: true });
    }
    
    // Also listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        if (currentTheme === 'system') {
          setIsDarkMode(checkDarkMode());
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => {
        observer.disconnect();
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
    
    return () => observer.disconnect();
  }, [currentTheme]);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleThemeChange = (theme: Theme) => {
    if (onThemeChange) {
      onThemeChange(theme);
    }
  };

  const handleColorSchemeChange = (colorScheme: string) => {
    if (onColorSchemeChange) {
      onColorSchemeChange(colorScheme);
    }
  };

  const handleFontSizeChange = (fontSize: FontSize) => {
    if (onFontSizeChange) {
      onFontSizeChange(fontSize);
    }
  };

  // Determine background color
  const bgColor = isDarkMode ? '#262626' : '#ffffff';
  const textColor = isDarkMode ? '#f5f5f5' : '#171717';

  return (
    <>
      {/* Settings Button */}
      <Button        
        size="icon"
        onClick={togglePanel}
        className="fixed right-4 bottom-4 z-50 rounded-full shadow-md"
        aria-label="Settings"
      >
        <Settings className="h-5 w-5 animate-spin-slow" />
      </Button>

      {/* Off-canvas Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-80 border-l transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          backgroundColor: bgColor,
          color: textColor
        }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div 
            className="flex items-center justify-between p-4 border-b"
            style={{ borderColor: isDarkMode ? '#404040' : '#e5e7eb' }}
          >
            <h2 className="text-lg font-semibold" style={{ color: textColor }}>Settings</h2>
            <Button variant="ghost" size="icon" onClick={togglePanel}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <div className="px-2 pt-2">
              <TabsList className="w-full grid grid-cols-2" style={{ backgroundColor: isDarkMode ? '#404040' : '#f5f5f5' }}>
                <TabsTrigger value="appearance" className="text-sm" style={{ color: isDarkMode ? '#f5f5f5' : '#171717' }}>
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="general" className="text-sm" style={{ color: isDarkMode ? '#f5f5f5' : '#171717' }}>
                  General
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Appearance Tab Content */}
            <div 
              className={`p-4 space-y-6 overflow-y-auto flex-1 ${activeTab === 'appearance' ? 'block' : 'hidden'} scrollbar-thin scrollbar-thumb-rounded`} 
              style={{ 
                maxHeight: 'calc(100vh - 120px)',
                scrollbarWidth: 'thin',
                scrollbarColor: isDarkMode ? '#525252 #262626' : '#e5e7eb #ffffff'
              }}
            >
              {/* Theme Selection */}
              <div>
                <h3 className="text-sm font-medium mb-3" style={{ color: textColor }}>Theme</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={currentTheme === 'light' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-20 gap-1"
                    onClick={() => handleThemeChange('light')}
                  >
                    <Sun className="h-5 w-5" />
                    <span className="text-xs">Light</span>
                  </Button>
                  <Button
                    variant={currentTheme === 'dark' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-20 gap-1"
                    onClick={() => handleThemeChange('dark')}
                  >
                    <Moon className="h-5 w-5" />
                    <span className="text-xs">Dark</span>
                  </Button>
                  <Button
                    variant={currentTheme === 'system' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-20 gap-1"
                    onClick={() => handleThemeChange('system')}
                  >
                    <Monitor className="h-5 w-5" />
                    <span className="text-xs">System</span>
                  </Button>
                </div>
              </div>

              {/* Color Scheme Selection */}
              <div>
                <h3 className="text-sm font-medium mb-3" style={{ color: textColor }}>Color Scheme</h3>
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Search colors..."
                    className="w-full px-3 py-1 text-sm rounded-md border"
                    style={{ 
                      backgroundColor: isDarkMode ? 'rgba(64, 64, 64, 0.3)' : 'rgba(245, 245, 245, 0.3)',
                      borderColor: isDarkMode ? '#525252' : '#e5e7eb',
                      color: textColor
                    }}
                    onChange={(e) => {
                      const searchPanel = document.getElementById('color-scheme-panel');
                      if (searchPanel) {
                        const buttons = searchPanel.querySelectorAll('button');
                        const searchTerm = e.target.value.toLowerCase();
                        
                        buttons.forEach((button) => {
                          const parent = button.parentElement;
                          if (parent) {
                            const schemeName = button.getAttribute('data-name')?.toLowerCase() || '';
                            if (schemeName.includes(searchTerm) || searchTerm === '') {
                              parent.classList.remove('hidden');
                            } else {
                              parent.classList.add('hidden');
                            }
                          }
                        });
                      }
                    }}
                  />
                </div>
                <div id="color-scheme-panel" className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1"
                  style={{ 
                    backgroundColor: isDarkMode ? 'rgba(38, 38, 38, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                    borderRadius: '0.375rem'
                  }}>
                  {colorSchemes.map((scheme) => (
                    <div key={scheme.value} className="relative">
                      <button
                        data-name={scheme.name}
                        className={`relative h-12 w-full rounded-md flex items-center justify-center overflow-hidden ${
                          currentColorScheme === scheme.value
                            ? 'ring-2 ring-offset-1'
                            : 'border'
                        }`}
                        style={{
                          backgroundColor: isDarkMode ? scheme.darkColor : scheme.lightColor,
                          borderColor: isDarkMode ? '#525252' : '#e5e7eb',
                          boxShadow: currentColorScheme === scheme.value 
                            ? `0 0 0 1px ${isDarkMode ? '#262626' : '#ffffff'}, 0 0 0 3px ${isDarkMode ? '#f5f5f5' : '#171717'}`
                            : 'none'
                        }}
                        onClick={() => handleColorSchemeChange(scheme.value)}
                        title={scheme.name}
                      >
                        {currentColorScheme === scheme.value && (
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </button>
                      <span className="text-[10px] mt-1 block text-center truncate" style={{ color: textColor }}>
                        {scheme.name}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-2" style={{ color: isDarkMode ? '#a1a1aa' : '#6b7280' }}>
                  Accent color used throughout the application
                </p>
              </div>

              {/* Font Size */}
              <div>
                <h3 className="text-sm font-medium mb-3" style={{ color: textColor }}>Font Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={currentFontSize === 'small' ? 'default' : 'outline'} 
                    className="text-xs h-10"
                    onClick={() => handleFontSizeChange('small')}
                    style={{
                      backgroundColor: currentFontSize === 'small' ? (isDarkMode ? '#404040' : '#f5f5f5') : 'transparent',
                      borderColor: isDarkMode ? '#525252' : '#e5e7eb',
                      color: textColor
                    }}
                  >
                    Small
                  </Button>
                  <Button 
                    variant={currentFontSize === 'medium' ? 'default' : 'outline'} 
                    className="text-sm h-10"
                    onClick={() => handleFontSizeChange('medium')}
                    style={{
                      backgroundColor: currentFontSize === 'medium' ? (isDarkMode ? '#404040' : '#f5f5f5') : 'transparent',
                      borderColor: isDarkMode ? '#525252' : '#e5e7eb',
                      color: textColor
                    }}
                  >
                    Medium
                  </Button>
                  <Button 
                    variant={currentFontSize === 'large' ? 'default' : 'outline'} 
                    className="text-base h-10"
                    onClick={() => handleFontSizeChange('large')}
                    style={{
                      backgroundColor: currentFontSize === 'large' ? (isDarkMode ? '#404040' : '#f5f5f5') : 'transparent',
                      borderColor: isDarkMode ? '#525252' : '#e5e7eb',
                      color: textColor
                    }}
                  >
                    Large
                  </Button>
                </div>
              </div>
            </div>

            {/* General Tab Content */}
            <div 
              className={`p-4 space-y-4 overflow-y-auto flex-1 ${activeTab === 'general' ? 'block' : 'hidden'} scrollbar-thin scrollbar-thumb-rounded`} 
              style={{ 
                maxHeight: 'calc(100vh - 120px)',
                scrollbarWidth: 'thin',
                scrollbarColor: isDarkMode ? '#525252 #262626' : '#e5e7eb #ffffff'
              }}
            >
              {/* Search Bar */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search settings..."
                  className="w-full px-3 py-1 text-sm rounded-md border"
                  style={{ 
                    backgroundColor: isDarkMode ? 'rgba(64, 64, 64, 0.3)' : 'rgba(245, 245, 245, 0.3)',
                    borderColor: isDarkMode ? '#525252' : '#e5e7eb',
                    color: textColor
                  }}
                />
              </div>

              {/* Account Settings */}
              <div>
                <h3 className="text-sm font-medium mb-2" style={{ color: textColor }}>Account Settings</h3>
                <div className="rounded-md flex flex-col" style={{ 
                  backgroundColor: isDarkMode ? 'rgba(64, 64, 64, 0.5)' : 'rgba(245, 245, 245, 0.5)'
                }}>
                  <Link href="/settings/account/profile" passHref>
                    <Button variant="ghost" className="w-full justify-between py-2 h-auto border-b" 
                      style={{ 
                        color: textColor,
                        borderColor: isDarkMode ? '#525252' : '#e5e7eb'
                      }}
                      onClick={togglePanel}
                    >
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <span>Profile Information</span>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Button>
                  </Link>
                  <Link href="/settings/account/preferences" passHref>
                    <Button variant="ghost" className="w-full justify-between py-2 h-auto border-b" 
                      style={{ 
                        color: textColor,
                        borderColor: isDarkMode ? '#525252' : '#e5e7eb'
                      }}
                      onClick={togglePanel}
                    >
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        <span>Account Preferences</span>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Button>
                  </Link>
                  <Link href="/settings/security/login-history" passHref>
                    <Button variant="ghost" className="w-full justify-between py-2 h-auto" 
                      style={{ 
                        color: textColor,
                        borderColor: isDarkMode ? '#525252' : '#e5e7eb'
                      }}
                      onClick={togglePanel}
                    >
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Login History</span>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Security */}
              <div>
                <h3 className="text-sm font-medium mb-2" style={{ color: textColor }}>Security</h3>
                <div className="rounded-md flex flex-col" style={{ 
                  backgroundColor: isDarkMode ? 'rgba(64, 64, 64, 0.5)' : 'rgba(245, 245, 245, 0.5)'
                }}>
                  <Link href="/settings/security/change-password" passHref>
                    <Button variant="ghost" className="w-full justify-between py-2 h-auto border-b" 
                      style={{ 
                        color: textColor,
                        borderColor: isDarkMode ? '#525252' : '#e5e7eb'
                      }}
                      onClick={togglePanel}
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span>Change Password</span>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Button>
                  </Link>
                  <Link href="/settings/security/two-factor" passHref>
                    <Button variant="ghost" className="w-full justify-between py-2 h-auto border-b" 
                      style={{ 
                        color: textColor,
                        borderColor: isDarkMode ? '#525252' : '#e5e7eb'
                      }}
                      onClick={togglePanel}
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        <span>Two-Factor Authentication</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded" style={{ 
                        backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
                        color: isDarkMode ? '#9ca3af' : '#6b7280'
                      }}>Off</span>
                    </Button>
                  </Link>
                  <Link href="/settings/security/logs" passHref>
                    <Button variant="ghost" className="w-full justify-between py-2 h-auto" 
                      style={{ 
                        color: textColor,
                        borderColor: isDarkMode ? '#525252' : '#e5e7eb'
                      }}
                      onClick={togglePanel}
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <path d="M8 11l3 3 6-6" />
                        </svg>
                        <span>Security Log</span>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Language */}
              <div>
                <h3 className="text-sm font-medium mb-2" style={{ color: textColor }}>Language</h3>
                <div className="rounded-md" style={{ backgroundColor: isDarkMode ? 'rgba(64, 64, 64, 0.5)' : 'rgba(245, 245, 245, 0.5)' }}>
                  <Button variant="ghost" className="w-full justify-between py-2 h-auto" style={{ color: textColor }}>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M2 12h20"></path>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      </svg>
                      <span>English (US)</span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Button>
                </div>
              </div>

              {/* Accessibility */}
              <div>
                <h3 className="text-sm font-medium mb-2" style={{ color: textColor }}>Accessibility</h3>
                <div className="rounded-md flex flex-col" style={{ 
                  backgroundColor: isDarkMode ? 'rgba(64, 64, 64, 0.5)' : 'rgba(245, 245, 245, 0.5)'
                }}>
                  <div className="flex justify-between items-center w-full p-2 h-auto border-b" 
                    style={{ 
                      borderColor: isDarkMode ? '#525252' : '#e5e7eb',
                      color: textColor
                    }}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2"></path>
                        <path d="M7 12h14l-3-3m0 6 3-3"></path>
                      </svg>
                      <span>High Contrast Mode</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"
                        style={{
                          backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                        }}
                      ></div>
                    </label>
                  </div>
                  <div className="flex justify-between items-center w-full p-2 h-auto" 
                    style={{ 
                      color: textColor
                    }}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 17l-5-5 5-5M14 17l5-5-5-5"></path>
                      </svg>
                      <span>Reduce Motion</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"
                        style={{
                          backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                        }}
                      ></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <h3 className="text-sm font-medium mb-2" style={{ color: textColor }}>Notifications</h3>
                <div className="rounded-md flex flex-col" style={{ 
                  backgroundColor: isDarkMode ? 'rgba(64, 64, 64, 0.5)' : 'rgba(245, 245, 245, 0.5)'
                }}>
                  <div className="flex justify-between items-center w-full p-2 h-auto border-b" 
                    style={{ 
                      borderColor: isDarkMode ? '#525252' : '#e5e7eb',
                      color: textColor
                    }}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>
                      </svg>
                      <span>Push Notifications</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked/>
                      <div className="w-9 h-5 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"
                        style={{
                          backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                        }}
                      ></div>
                    </label>
                  </div>
                  <div className="flex justify-between items-center w-full p-2 h-auto border-b" 
                    style={{ 
                      borderColor: isDarkMode ? '#525252' : '#e5e7eb',
                      color: textColor
                    }}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <span>SMS Notifications</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"
                        style={{
                          backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                        }}
                      ></div>
                    </label>
                  </div>
                  <div className="flex justify-between items-center w-full p-2 h-auto" 
                    style={{ 
                      color: textColor
                    }}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      <span>Email Notifications</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked/>
                      <div className="w-9 h-5 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"
                        style={{
                          backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                        }}
                      ></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Data Usage */}
              <div>
                <h3 className="text-sm font-medium mb-2" style={{ color: textColor }}>Data Usage</h3>
                <div className="rounded-md" style={{ backgroundColor: isDarkMode ? 'rgba(64, 64, 64, 0.5)' : 'rgba(245, 245, 245, 0.5)' }}>
                  <Button variant="ghost" className="w-full justify-between py-2 h-auto" style={{ color: textColor }}>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                        <line x1="6" y1="6" x2="6.01" y2="6"></line>
                        <line x1="6" y1="18" x2="6.01" y2="18"></line>
                      </svg>
                      <span>Storage & Cache</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs mr-2" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>45.8 MB</span>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </div>
                  </Button>
                </div>
              </div>

              {/* Help & Support */}
              <div>
                <h3 className="text-sm font-medium mb-2" style={{ color: textColor }}>Help & Support</h3>
                <div className="rounded-md flex flex-col" style={{ 
                  backgroundColor: isDarkMode ? 'rgba(64, 64, 64, 0.5)' : 'rgba(245, 245, 245, 0.5)'
                }}>
                  <Button variant="ghost" className="w-full justify-between py-2 h-auto border-b" 
                    style={{ 
                      color: textColor,
                      borderColor: isDarkMode ? '#525252' : '#e5e7eb'
                    }}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      <span>Help Center</span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Button>
                  <Button variant="ghost" className="w-full justify-between py-2 h-auto border-b" 
                    style={{ 
                      color: textColor,
                      borderColor: isDarkMode ? '#525252' : '#e5e7eb'
                    }}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                      <span>Contact Support</span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Button>
                  <Button variant="ghost" className="w-full justify-between py-2 h-auto" 
                    style={{ 
                      color: textColor,
                      borderColor: isDarkMode ? '#525252' : '#e5e7eb'
                    }}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                      </svg>
                      <span>Feedback</span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Button>
                </div>
              </div>

              {/* About */}
              <div>
                <h3 className="text-sm font-medium mb-2" style={{ color: textColor }}>About</h3>
                <div className="rounded-md flex flex-col" style={{ 
                  backgroundColor: isDarkMode ? 'rgba(64, 64, 64, 0.5)' : 'rgba(245, 245, 245, 0.5)'
                }}>
                  <Button variant="ghost" className="w-full justify-between py-2 h-auto border-b" 
                    style={{ 
                      color: textColor,
                      borderColor: isDarkMode ? '#525252' : '#e5e7eb'
                    }}
                  >
                    <span>Application Version</span>
                    <span className="text-xs" style={{ color: isDarkMode ? '#a1a1aa' : '#6b7280' }}>v1.0.0</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-between py-2 h-auto border-b" 
                    style={{ 
                      color: textColor,
                      borderColor: isDarkMode ? '#525252' : '#e5e7eb'
                    }}
                  >
                    <span>Terms of Service</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Button>
                  <Button variant="ghost" className="w-full justify-between py-2 h-auto" 
                    style={{ 
                      color: textColor,
                      borderColor: isDarkMode ? '#525252' : '#e5e7eb'
                    }}
                  >
                    <span>Privacy Policy</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Button>
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={togglePanel}
        />
      )}
    </>
  );
} 