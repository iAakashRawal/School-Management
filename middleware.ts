import { NextRequest, NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { languages } from './components/providers/language-provider';

// Configure accept-language
acceptLanguage.languages(languages.map(lang => lang.code));

const PUBLIC_FILE = /\.(.*)$/;

// The matcher defines which paths this middleware will run on
export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export function middleware(request: NextRequest) {
  // Check if the request is for a public file
  if (PUBLIC_FILE.test(request.nextUrl.pathname)) {
    return;
  }

  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = languages
    .every(({ code }) => 
      !pathname.startsWith(`/${code}/`) && pathname !== `/${code}`
    );

  // If it's already localized or is a special path, don't modify
  if (!pathnameIsMissingLocale) {
    return;
  }

  // Get the preferred language from header
  const headerLang = request.headers.get('accept-language')?.split(',')[0].split('-')[0];
  
  // Check if the preferred language is supported and not English
  const preferredLang = languages.find(lang => lang.code === headerLang && lang.code !== 'en');
  
  // If the preferred language is supported and not English, redirect to that language
  if (preferredLang) {
    return NextResponse.redirect(
      new URL(`/${preferredLang.code}${pathname}`, request.url)
    );
  }

  // For English or unsupported languages, continue without locale prefix
  return NextResponse.next();
} 