'use client';

import { useTranslation } from 'next-i18next';
import { useLanguage } from '@/components/providers/language-provider';

export default function Dashboard() {
  const { t } = useTranslation('common');
  const { currentLanguage } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold mb-2">{t('students.all')}</h2>
          <p className="text-4xl font-bold">248</p>
        </div>
        
        <div className="bg-card border rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold mb-2">{t('teachers.all')}</h2>
          <p className="text-4xl font-bold">32</p>
        </div>
        
        <div className="bg-card border rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold mb-2">{t('classes.all')}</h2>
          <p className="text-4xl font-bold">16</p>
        </div>
      </div>
      
      <div className="bg-card border rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">{t('settings.language')}: {t(`languages.${currentLanguage}`)}</h2>
        <p>
          {t('dashboard')} {t('app_name')}
        </p>
      </div>
    </div>
  );
} 