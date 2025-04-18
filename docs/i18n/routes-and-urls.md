# Routes & URLs

> This document is part of the i18n documentation series:
> - 📐 [i18n Architecture](./architecture.md)
> - 🧩 [Components](./components.md)
> - 🔗 [Routes & URLs](./routes-and-urls.md) - Current document
> - 👍 [Best Practices](./best-practices.md)
> - 🔧 [Advanced Topics](./advanced-topics.md)
> - 📘 [README](./README.md)

## Overview

This document covers how our application handles localized routing, including URL path translation and canonical URL management for SEO.

## URL Structure

Our application uses a fully localized URL structure:

| Language | Sample URL Path |
|----------|----------------|
| English | `/recipes` |
| French | `/recettes` |
| Spanish | `/recetas` |
| German | `/rezepte` |

This structure gives several advantages:
- Better UX by showing users URLs in their language
- Improved SEO by indexing localized paths
- Clearer content organization across languages

## Route Mappings

The core of our localized URLs is the path mapping system, defined in:

```
src/utils/route-mappings-data.ts
```

This file contains mappings between internal route names (used in the Next.js file system) and localized external paths:

```typescript
export type RouteSegment = 
  | 'recipes'
  | 'profile'
  | 'about'
  | 'search';

// Map internal route names to localized segments
export const pathMappings: Record<Locale, Record<RouteSegment, string>> = {
  en: {
    recipes: 'recipes',
    profile: 'profile',
    about: 'about',
    search: 'search',
  },
  fr: {
    recipes: 'recettes',
    profile: 'profil',
    about: 'a-propos',
    search: 'recherche',
  },
  es: {
    recipes: 'recetas',
    profile: 'perfil',
    about: 'sobre-nosotros',
    search: 'busqueda',
  },
  de: {
    recipes: 'rezepte',
    profile: 'profil',
    about: 'uber-uns',
    search: 'suche',
  },
};
```

### Adding New Routes

To add a new route to the system:

1. Update the `RouteSegment` type with your new route name
2. Add localized versions for all supported languages in `pathMappings`
3. Create the route in Next.js as normal (in English)

## URL Transformation Flow

When a user accesses your application, URLs are transformed in several ways:

### Incoming Request Flow:

1. User visits `/recettes` (French URL)
2. Middleware intercepts and identifies as French "recipes" route
3. Request is internally rewritten to `/fr/recipes`  
4. Next.js serves the content from `/app/[lang]/recipes/`
5. The page receives `lang: 'fr'` in its params

### Outgoing Link Flow:

1. Developer creates `<LocalizedLink href="/recipes">View Recipes</LocalizedLink>`
2. LocalizedLink detects current language (e.g., French) 
3. Link is transformed to `/recettes` 
4. User sees and clicks on a properly localized URL

## Middleware Implementation

The core URL rewriting happens in `src/middleware.ts`:

```typescript
// src/middleware.ts (simplified)
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip for non-HTML routes (assets, API)
  if (!shouldHandleLocale(pathname)) {
    return NextResponse.next();
  }
  
  // Extract first segment to check if it's already a locale
  const firstSegment = pathname.split('/')[1]; 
  const isLocalePrefix = locales.includes(firstSegment as Locale);
  
  // If URL already has locale, check if a segment needs rewriting
  if (isLocalePrefix) {
    const lang = firstSegment as Locale;
    const pathWithoutLocale = pathname.substring(firstSegment.length + 1);
    
    // Check if path has localized segments that need rewriting
    const internalPath = rewriteLocalizedPathToInternal(pathWithoutLocale, lang);
    
    // If rewriting is needed, update URL
    if (internalPath !== pathWithoutLocale) {
      const newUrl = new URL(`/${lang}${internalPath}`, request.url);
      return NextResponse.rewrite(newUrl);
    }
    
    return NextResponse.next();
  }
  
  // No locale in URL, detect language
  const detectedLocale = detectLanguage(request);
  
  // First, check if path has localized segments that need rewriting
  const internalPath = rewriteLocalizedPathToInternal(pathname, detectedLocale);
  
  // Create new URL with language prefix
  const newUrl = new URL(`/${detectedLocale}${internalPath}`, request.url);
  return NextResponse.rewrite(newUrl);
}
```

## Helper Functions

Several helper functions manage URL transformations:

### getLocalizedPath

Converts an internal path to a localized one for display:

```typescript
import { getLocalizedSegment } from '@/utils/route-mappings-data';

// Converts internal path to localized path
// e.g., "/recipes/123" -> "/recettes/123" for French
export function getLocalizedPath(internalPath: string, locale: Locale): string {
  // Split path into segments
  const segments = internalPath.split('/').filter(Boolean);
  
  // If empty path, return just the locale
  if (segments.length === 0) return `/${locale}`;
  
  // Process first segment (route name)
  const firstSegment = segments[0] as RouteSegment;
  const localizedSegment = getLocalizedSegment(firstSegment, locale);
  
  // Rebuild path with localized first segment
  const localizedPath = [localizedSegment, ...segments.slice(1)].join('/');
  return `/${localizedPath}`;
}
```

### getInternalPath

Converts a localized path back to an internal one:

```typescript
import { getInternalSegment } from '@/utils/route-mappings-data';

// Converts localized path to internal path
// e.g., "/recettes/123" -> "/recipes/123" for French
export function getInternalPath(localizedPath: string, locale: Locale): string {
  // Split path into segments
  const segments = localizedPath.split('/').filter(Boolean);
  
  // If empty path, return just the locale
  if (segments.length === 0) return `/${locale}`;
  
  // Process first segment (route name)
  const firstSegment = segments[0];
  const internalSegment = getInternalSegment(firstSegment, locale);
  
  // Rebuild path with internal first segment
  const internalPath = [internalSegment, ...segments.slice(1)].join('/');
  return `/${internalPath}`;
}
```

## SEO & Canonical URLs

For proper SEO handling, we generate canonical URLs with fully localized paths:

```typescript
import { getLocalizedPath } from '@/utils/localized-routes';

// Generates localized canonical URL for SEO
// e.g., "/recipes" -> "https://example.com/recettes" for French
export function getLocalizedCanonical(
  internalPath: string, 
  locale: Locale
): string {
  const localizedPath = getLocalizedPath(internalPath, locale);
  // Remove leading locale prefix if present
  const pathWithoutLocale = localizedPath.startsWith(`/${locale}/`)
    ? localizedPath.substring(locale.length + 1)
    : localizedPath;
    
  return `${process.env.NEXT_PUBLIC_SITE_URL}${pathWithoutLocale}`;
}
```

### Implementing In Pages

In each page component:

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  
  // Generate alternate URLs for each language
  const alternateLanguages: Record<string, string> = {};
  locales.forEach(locale => {
    alternateLanguages[locale] = getLocalizedCanonical('/recipes', locale);
  });
  
  return {
    // Other metadata...
    alternates: {
      languages: alternateLanguages,
      canonical: getLocalizedCanonical('/recipes', lang),
    },
  };
}
```

## Handling Dynamic Parameters

For dynamic routes (e.g., `/recipes/[handle]`), the same pattern applies:

```tsx
// LocalizedLink usage with dynamic params
<LocalizedLink href={`/recipes/${recipe.handle}`}>
  {recipe.title}
</LocalizedLink>
```

The URL will be correctly localized (e.g., `/recettes/chocolate-cake` in French) while preserving the dynamic parameter.

## Child Routes

For nested routes, we use a similar pattern with additional nesting in the route mappings:

```typescript
export type ChildRouteSegment = 
  | 'settings'
  | 'orders'
  | 'favourites';

export type ParentRouteSegment =
  | 'profile';
  
// Parent route mappings as before
export const pathMappings = { /* as before */ };

// Child route mappings
export const childPathMappings: Record<
  Locale, 
  Record<ParentRouteSegment, Record<ChildRouteSegment, string>>
> = {
  en: {
    profile: {
      settings: 'settings',
      orders: 'orders',
      favourites: 'favourites',
    },
  },
  fr: {
    profile: {
      settings: 'parametres',
      orders: 'commandes',
      favourites: 'favoris',
    },
  },
  // Other languages...
};
```

Additional helper functions handle the transformation of child routes.

## Test It Yourself

To test the URL system:

1. Visit `/recipes` (English path)
2. Switch language to French
3. URL should change to `/recettes`
4. All links on the page should use localized paths 