import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'es'];
const defaultLocale = 'es';
const defaultTheme = 'light';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lang = request.nextUrl.searchParams.get('lang');
  const theme = request.nextUrl.searchParams.get('theme');

  // If lang or theme is missing, redirect to include defaults
  if (!lang || !locales.includes(lang) || !theme) {
    const url = request.nextUrl.clone();
    if (!lang || !locales.includes(lang)) url.searchParams.set('lang', defaultLocale);
    if (!theme) url.searchParams.set('theme', defaultTheme);
    return NextResponse.redirect(url);
  }

  // Pass values to Layout via headers
  const response = NextResponse.next();
  response.headers.set('x-lang', lang);
  response.headers.set('x-theme', theme);
  return response;
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};