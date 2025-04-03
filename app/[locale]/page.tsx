'use client';

import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/language-provider';
import { useParams } from 'next/navigation';

export default function Home() {
  const { t } = useTranslation('common');
  const { currentLanguage } = useLanguage();
  const params = useParams();
  const locale = params.locale as string;
  
  // Helper function to create localized paths
  const localePath = (path: string) => {
    if (path.startsWith(`/${locale}/`)) return path;
    if (path === '/') return `/${locale}`;
    return `/${locale}${path}`;
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold mb-6">{t('app_name')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full mt-8">
        <Link 
          href={localePath('/dashboard')}
          className="bg-primary text-primary-foreground rounded-lg p-6 transition-all hover:shadow-lg"
        >
          <h2 className="text-xl font-bold mb-2">{t('dashboard')}</h2>
          <p className="text-sm opacity-80">{t('navigation.dashboard')}</p>
        </Link>
        
        <Link 
          href={localePath('/auth/login')}
          className="bg-secondary text-secondary-foreground rounded-lg p-6 transition-all hover:shadow-lg"
        >
          <h2 className="text-xl font-bold mb-2">{t('auth.sign_in')}</h2>
          <p className="text-sm opacity-80">{t('auth.login')}</p>
        </Link>
      </div>
      
      <div className="mt-10 text-muted-foreground">
        <p>{t('settings.language')}: {t(`languages.${currentLanguage}`)}</p>
      </div>
    </div>
  );
} 