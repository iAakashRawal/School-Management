'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  X, 
  Moon, 
  Sun, 
  Monitor, 
  Check,
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define available themes and color schemes
const colorSchemes = [
  { name: 'Default', value: 'default', lightColor: '#4f46e5', darkColor: '#6366f1' },
  { name: 'Emerald', value: 'emerald', lightColor: '#10b981', darkColor: '#059669' },
  { name: 'Orange', value: 'orange', lightColor: '#f97316', darkColor: '#ea580c' },
  { name: 'Rose', value: 'rose', lightColor: '#f43f5e', darkColor: '#e11d48' },
  { name: 'Purple', value: 'purple', lightColor: '#a855f7', darkColor: '#9333ea' },
  { name: 'Cyan', value: 'cyan', lightColor: '#06b6d4', darkColor: '#0891b2' },
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

  // Detect current mode for color scheme display
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

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

  return (
    <>
      {/* Settings Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={togglePanel}
        className="fixed right-4 bottom-4 z-50 rounded-full shadow-md"
        aria-label="Settings"
      >
        <Settings className="h-5 w-5" />
      </Button>

      {/* Off-canvas Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-80 bg-card border-l transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-foreground">Settings</h2>
            <Button variant="ghost" size="icon" onClick={togglePanel}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
            <div className="px-2 pt-2">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="appearance" className="text-sm">
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="general" className="text-sm">
                  General
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Appearance Tab Content */}
            <div className={`p-4 space-y-6 overflow-y-auto flex-1 ${activeTab === 'appearance' ? 'block' : 'hidden'}`}>
              {/* Theme Selection */}
              <div>
                <h3 className="text-sm font-medium mb-3">Theme</h3>
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
                <h3 className="text-sm font-medium mb-3">Color Scheme</h3>
                <div className="grid grid-cols-3 gap-2">
                  {colorSchemes.map((scheme) => (
                    <button
                      key={scheme.value}
                      className={`relative h-16 rounded-md flex items-center justify-center overflow-hidden ${
                        currentColorScheme === scheme.value
                          ? 'ring-2 ring-offset-2 ring-offset-background ring-primary'
                          : 'border border-border'
                      }`}
                      style={{
                        backgroundColor: isDarkMode ? scheme.darkColor : scheme.lightColor,
                      }}
                      onClick={() => handleColorSchemeChange(scheme.value)}
                    >
                      {currentColorScheme === scheme.value && (
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Accent color used throughout the application
                </p>
              </div>

              {/* Font Size */}
              <div>
                <h3 className="text-sm font-medium mb-3">Font Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={currentFontSize === 'small' ? 'default' : 'outline'} 
                    className="text-xs h-10"
                    onClick={() => handleFontSizeChange('small')}
                  >
                    Small
                  </Button>
                  <Button 
                    variant={currentFontSize === 'medium' ? 'default' : 'outline'} 
                    className="text-sm h-10"
                    onClick={() => handleFontSizeChange('medium')}
                  >
                    Medium
                  </Button>
                  <Button 
                    variant={currentFontSize === 'large' ? 'default' : 'outline'} 
                    className="text-base h-10"
                    onClick={() => handleFontSizeChange('large')}
                  >
                    Large
                  </Button>
                </div>
              </div>
            </div>

            {/* General Tab Content */}
            <div className={`p-4 space-y-4 overflow-y-auto flex-1 ${activeTab === 'general' ? 'block' : 'hidden'}`}>
              {/* Language */}
              <div>
                <h3 className="text-sm font-medium mb-2">Language</h3>
                <div className="bg-secondary/50 rounded-md">
                  <Button variant="ghost" className="w-full justify-between py-2 h-auto">
                    <span>English (US)</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Button>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <h3 className="text-sm font-medium mb-2">Notifications</h3>
                <div className="bg-secondary/50 rounded-md">
                  <Button variant="ghost" className="w-full justify-between py-2 h-auto">
                    <span>Notification Settings</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Button>
                </div>
              </div>

              {/* Data Usage */}
              <div>
                <h3 className="text-sm font-medium mb-2">Data Usage</h3>
                <div className="bg-secondary/50 rounded-md">
                  <Button variant="ghost" className="w-full justify-between py-2 h-auto">
                    <span>Storage & Cache</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Button>
                </div>
              </div>

              {/* About */}
              <div>
                <h3 className="text-sm font-medium mb-2">About</h3>
                <div className="bg-secondary/50 rounded-md flex flex-col divide-y divide-border/50">
                  <Button variant="ghost" className="w-full justify-between py-2 h-auto">
                    <span>Application Version</span>
                    <span className="text-xs text-muted-foreground">v1.0.0</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-between py-2 h-auto">
                    <span>Terms of Service</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Button>
                  <Button variant="ghost" className="w-full justify-between py-2 h-auto">
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
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={togglePanel}
        />
      )}
    </>
  );
} 