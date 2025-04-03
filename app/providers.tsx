'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { LanguageProvider } from '@/components/providers/language-provider';
import { usePathname } from 'next/navigation';
import { 
  QueryClient, 
  QueryClientProvider 
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function Providers({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  const [locale, setLocale] = useState<string>('en');
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }));

  useEffect(() => {
    // Extract locale from pathname, excluding default English locale
    // Example: /dashboard -> en, /es/dashboard -> es
    const localePart = pathname.split('/')[1];
    const availableLocales = ['es', 'fr', 'ar', 'zh']; // All except default 'en'
    
    if (availableLocales.includes(localePart)) {
      setLocale(localePart);
    } else {
      setLocale('en'); // Default to English
    }
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider defaultLocale={locale}>
          {children}
        </LanguageProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
} 