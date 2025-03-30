'use client';

import { useTheme } from '@/components/providers/theme-provider';
import { SettingsPanel } from '@/components/layout/settings-panel';

export function ThemeSwitcher() {
  try {
    const { theme, colorScheme, fontSize, setTheme, setColorScheme, setFontSize } = useTheme();

    return (
      <SettingsPanel 
        currentTheme={theme} 
        currentColorScheme={colorScheme}
        currentFontSize={fontSize}
        onThemeChange={setTheme}
        onColorSchemeChange={setColorScheme}
        onFontSizeChange={setFontSize}
      />
    );
  } catch (error) {
    console.error('Error in ThemeSwitcher:', error);
    return null;
  }
} 