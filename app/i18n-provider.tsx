'use client';

import { appWithTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import type { AppProps } from 'next/app';

function I18nWrapper(props: AppProps) {
  const { Component, pageProps } = props;
  const { setLanguage } = useLanguage();
  const locale = pageProps.locale as string | undefined;

  useEffect(() => {
    if (locale) {
      setLanguage(locale);
    }
  }, [locale, setLanguage]);

  return <Component {...pageProps} />;
}

export default appWithTranslation(I18nWrapper); 