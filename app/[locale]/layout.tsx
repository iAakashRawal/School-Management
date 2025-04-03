'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/components/providers/language-provider';

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { setLanguage, currentLanguage } = useLanguage();
  const { locale } = params;

  useEffect(() => {
    if (locale && locale !== currentLanguage) {
      try {
        setLanguage(locale);
      } catch (error) {
        console.error('Error setting language:', error);
      }
    }
  }, [locale, currentLanguage, setLanguage]);

  if (!locale) {
    return null;
  }

  return <>{children}</>;
} 