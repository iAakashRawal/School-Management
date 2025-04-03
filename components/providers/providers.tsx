'use client';

import * as React from 'react';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { LanguageProvider } from '@/components/providers/language-provider';
import { Toaster } from 'sonner';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

const ThemeManager = dynamic(
  () => import('@/components/providers/theme-manager'),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageProvider defaultLocale={locale}>
      <ThemeProvider>
        <ThemeManager />
        {children}
        <Toaster position="top-right" />
      </ThemeProvider>
    </LanguageProvider>
  );
} 