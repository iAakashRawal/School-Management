'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useLanguage } from '@/components/providers/language-provider';
import { Button } from '@/components/ui/button';
import { Check, Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { t } = useTranslation('common');
  const { currentLanguage, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle mounting state to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!mounted) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-dropdown')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, mounted]);

  // Handle language change
  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  // Get current language object
  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative language-dropdown">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="h-4 w-4 mr-1" />
        <span className="text-sm">{getCurrentLanguage().flag}</span>
        <span className="hidden md:inline">{getCurrentLanguage().name}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border border-border z-50">
          <div className="py-1 rounded-md bg-popover text-popover-foreground">
            {languages.map((language) => (
              <button
                key={language.code}
                className="flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-muted"
                onClick={() => handleLanguageChange(language.code)}
              >
                <div className="flex items-center">
                  <span className="mr-2">{language.flag}</span>
                  <span>{language.name}</span>
                </div>
                {currentLanguage === language.code && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 