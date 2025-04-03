/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // We're handling locales via middleware for App Router
  // i18n commented out because we're using App Router
  // i18n: {
  //   defaultLocale: 'en',
  //   locales: ['en', 'es', 'fr', 'ar', 'zh'],
  // },
}

module.exports = nextConfig 