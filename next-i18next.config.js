/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'ar', 'zh'],
  },
  localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  
  detection: {
    order: ['path', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
    caches: ['cookie'],
  },
}; 