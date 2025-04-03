'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

// Define available languages
export const languages = [
  { code: 'en', name: 'English', dir: 'ltr', flag: '🇬🇧' },
  { code: 'es', name: 'Español', dir: 'ltr', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', dir: 'ltr', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', dir: 'rtl', flag: '🇸🇦' },
  { code: 'zh', name: '中文', dir: 'ltr', flag: '🇨🇳' },
];

type LanguageContextType = {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  languages: typeof languages;
  direction: 'ltr' | 'rtl';
};

const defaultContext: LanguageContextType = {
  currentLanguage: 'en',
  setLanguage: () => {},
  languages,
  direction: 'ltr',
};

const LanguageContext = React.createContext<LanguageContextType>(defaultContext);

export function LanguageProvider({ 
  children,
  defaultLocale = 'en' 
}: { 
  children: React.ReactNode;
  defaultLocale?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = React.useState(defaultLocale);
  const [direction, setDirection] = React.useState<'ltr' | 'rtl'>('ltr');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    
    try {
      const storedLang = localStorage.getItem('language');
      const pathSegments = pathname?.split('/') || [];
      const urlLang = pathSegments.length > 1 ? pathSegments[1] : '';
      
      const isValidLang = languages.some(lang => lang.code === urlLang);
      const lang = isValidLang ? urlLang : (storedLang || defaultLocale);
      
      if (lang !== currentLanguage) {
        setCurrentLanguage(lang);
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
      }
    } catch (error) {
      console.error("Error setting initial language:", error);
    }
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    
    try {
      const lang = languages.find(l => l.code === currentLanguage);
      if (lang) {
        setDirection(lang.dir as 'ltr' | 'rtl');
        document.documentElement.dir = lang.dir;
        document.documentElement.lang = lang.code;
      }
    } catch (error) {
      console.error("Error updating document direction:", error);
    }
  }, [currentLanguage, mounted]);

  const setLanguage = React.useCallback((lang: string) => {
    if (!mounted) return;
    
    try {
      if (lang !== currentLanguage) {
        localStorage.setItem('language', lang);
        setCurrentLanguage(lang);
        i18n.changeLanguage(lang);
        
        const segments = pathname?.split('/') || [];
        let newPath: string;
        
        // Remove any existing language prefix
        if (segments.length > 1 && languages.some(l => l.code === segments[1])) {
          segments.splice(1, 1);
        }
        
        // Only add language prefix for non-English languages
        if (lang !== 'en') {
          segments.splice(1, 0, lang);
        }
        
        newPath = segments.join('/') || '/';
        router.push(newPath);
      }
    } catch (error) {
      console.error("Error setting language:", error);
    }
  }, [currentLanguage, mounted, pathname, router, i18n]);

  const value = React.useMemo(() => ({
    currentLanguage,
    setLanguage,
    languages,
    direction,
  }), [currentLanguage, setLanguage, direction]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return React.useContext(LanguageContext);
} 