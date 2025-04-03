'use client';

import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Providers } from '@/components/providers/providers';
import '../i18n.config';

const inter = Inter({ subsets: ['latin'] });

// This function will run in the browser before hydration
const blockingScript = `
  (function() {
    try {
      // Retrieve stored values
      const storedTheme = localStorage.getItem('theme');
      const storedColorScheme = localStorage.getItem('colorScheme') || 'default';
      const storedFontSize = localStorage.getItem('fontSize') || 'medium';
      const storedLang = localStorage.getItem('language') || 'en';
      
      // Clear classes first to avoid conflicts
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.remove('text-small', 'text-medium', 'text-large');
      
      // Remove any color scheme classes
      const oldClasses = [...document.documentElement.classList];
      oldClasses.forEach(cls => {
        if (cls.startsWith('theme-')) {
          document.documentElement.classList.remove(cls);
        }
      });
      
      // Set theme
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (storedTheme === 'light') {
        document.documentElement.classList.add('light');
      } else {
        // Default or system theme
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.add(isDarkMode ? 'dark' : 'light');
      }
      
      // Set color scheme
      document.documentElement.classList.add('theme-' + storedColorScheme);
      
      // Set font size
      document.documentElement.classList.add('text-' + storedFontSize);
      
      // Set language attributes
      document.documentElement.lang = storedLang;
      if (storedLang === 'ar') {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
    } catch (e) {
      console.error('Error in theme script:', e);
    }
  })();
`;

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script 
          id="theme-script" 
          dangerouslySetInnerHTML={{ __html: blockingScript }} 
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 