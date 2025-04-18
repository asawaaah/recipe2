import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { pathMappings } from './utils/route-mappings-data';

// Define supported locales and default locale
export const locales = ['en', 'fr', 'es', 'de'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale = 'en';

// Get locale from request headers using negotiator
function getLocale(request: NextRequest) {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip for non-content paths (assets, api routes, etc.)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return;
  }
  
  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (!pathnameHasLocale) {
    // Get the preferred locale from the request
    const locale = getLocale(request);
    
    // Build the new URL with the locale
    const newUrl = new URL(
      `/${locale}${pathname === '/' ? '' : pathname}`,
      request.url
    );
    
    // Preserve query parameters
    request.nextUrl.searchParams.forEach((value, key) => {
      newUrl.searchParams.set(key, value);
    });
    
    // Redirect to the new URL with the locale
    return NextResponse.redirect(newUrl);
  }
  
  // Handle localized path segments (e.g., /fr/recettes -> /fr/recipes)
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length >= 2) {
    const locale = segments[0] as Locale;
    const localizedSegment = segments[1];
    
    // Skip handling for the root locale path (e.g., /fr)
    if (segments.length === 1) {
      return;
    }
    
    // Check if this localized segment has a mapping for this locale
    const mapping = pathMappings[locale];
    const internalSegment = mapping[localizedSegment];
    
    // If we have a mapping and the localized segment is different from the internal segment
    if (internalSegment && localizedSegment !== internalSegment) {
      // Build the internal path URL (keeping the rest of the path intact)
      const internalPath = [
        '', // For leading slash
        locale,
        internalSegment,
        ...segments.slice(2) // Include all subsequent segments (e.g., /fr/recettes/pasta -> /fr/recipes/pasta)
      ].join('/');
      
      const newUrl = new URL(internalPath, request.url);
      
      // Preserve query parameters
      request.nextUrl.searchParams.forEach((value, key) => {
        newUrl.searchParams.set(key, value);
      });
      
      // Use rewrite instead of redirect to maintain the original URL in the browser
      return NextResponse.rewrite(newUrl);
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets/images (static assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets|images|sw.js).*)',
  ],
}; 