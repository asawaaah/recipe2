# i18n Architecture

> This document is part of the i18n documentation series:
> - 📐 [i18n Architecture](./architecture.md) - Current document
> - 🧩 [Components](./components.md)
> - 🔗 [Routes & URLs](./routes-and-urls.md)
> - 👍 [Best Practices](./best-practices.md)
> - 🔧 [Advanced Topics](./advanced-topics.md)
> - 📘 [README](./README.md)

## Overview

The Recipe2 app uses a comprehensive i18n solution built on Next.js middleware and App Router. The system supports multiple languages while optimizing for SEO and user experience.

## Core Concepts

Our internationalization architecture is built on these foundational principles:

1. **Language-Based URLs**: Every URL includes a language prefix (`/en/`, `/fr/`, etc.)
2. **Dynamic Language Detection**: Middleware detects user preferences on first visit
3. **Consistent Experience**: Language context is maintained throughout the app
4. **Built for SEO**: Localized paths and proper metadata for search engines
5. **Performance Focused**: Server-side rendering of translations where possible

## Project Structure

```
/src
  /app
    /[lang]                # All language-specific routes
      /layout.tsx          # Translation Provider setup
      /page.tsx            # Home page with withLocale wrapper
      /recipes             # Uses internal English naming
      /my-cookbook         # All routes follow internal naming
    /layout.tsx            # Root layout with HTML/body
    /providers.tsx         # LangContext provider
  /components
    /i18n
      /LanguageSwitcher.tsx    # Language switcher component
      /LocalizedLink.tsx       # Link component that preserves language
      /TranslationContext.tsx  # Translation context and hook
      /withLocale.tsx          # HOC for server components
  /dictionaries            # Translation JSON files
    /en.json               # English translations
    /fr.json               # French translations
    /es.json               # Spanish translations
    /de.json               # German translations
  /middleware.ts           # Language detection middleware
  /utils
    /route-mappings-data.ts  # Localized URL path mappings
    /localized-routes.ts     # Utilities for localized URL generation
    /server-dictionary.ts    # Server-side translation utilities
```

## Language Detection Strategy

The app uses a unified language detection strategy with the following priority:

1. **URL Path Language**: Extract language from the first segment of the URL path
2. **Context Language**: Fall back to the language provided by the language context
3. **Default Language**: Use the application's default language (English)

```typescript
// Standard pattern for language detection
const pathname = usePathname()
const pathLang = pathname?.split('/')?.[1] as Locale
const isValidLocale = locales.includes(pathLang as Locale)
const currentLang = isValidLocale ? pathLang : defaultLocale
```

This consistent approach ensures that the user's language preference is properly detected and maintained throughout the application.

## How Language Detection Works Under the Hood

1. The middleware (`src/middleware.ts`) intercepts all requests and:
   - Redirects to user's preferred language if no language prefix is present
   - Rewrites localized paths to internal paths (e.g., `/fr/recettes` → `/fr/recipes`)

2. The root layout (`src/app/layout.tsx`) sets up the basic HTML attributes:
   ```tsx
   <html lang={params?.lang ?? 'en'}>
   ```

3. The language-specific layout (`src/app/[lang]/layout.tsx`) loads and provides translations:
   ```tsx
   <TranslationProvider dictionary={dictionary} locale={lang as Locale}>
     {children}
   </TranslationProvider>
   ```

4. Components use the language context to access translations and the current language:
   ```tsx
   const { t, locale } = useTranslation()
   ```

## Middleware Implementation

The middleware implements three critical functions:

1. **Language Detection**: Determines user's preferred language from browser settings
2. **Automatic Redirects**: Adds language prefix to URLs that don't have one
3. **URL Rewriting**: Translates localized paths to internal paths

```typescript
// Simplified middleware logic
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip for assets, API routes, etc.
  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return
  }
  
  // Add language prefix if missing
  if (!pathnameHasLocale) {
    const locale = getLocale(request)
    const newUrl = new URL(`/${locale}${pathname}`, request.url)
    return NextResponse.redirect(newUrl)
  }
  
  // Handle localized path segments
  const segments = pathname.split('/').filter(Boolean)
  const locale = segments[0]
  const localizedSegment = segments[1]
  
  // Map localized paths to internal routes
  if (internalSegment && localizedSegment !== internalSegment) {
    const internalPath = `/${locale}/${internalSegment}/${segments.slice(2).join('/')}`
    return NextResponse.rewrite(new URL(internalPath, request.url))
  }
}
```

## Translation Storage

Translations are stored as JSON files in the `/dictionaries` directory, with one file per language. Each file follows the same nested structure:

```json
{
  "common": {
    "welcome": "Welcome",
    "allRecipes": "All Recipes",
    "myCookbook": "My Cookbook"
  },
  "recipe": {
    "ingredients": "Ingredients",
    "instructions": "Instructions",
    "cookingTime": "Cooking Time"
  }
  // ...more sections
}
```

This structure makes it easy to maintain and update translations while keeping them organized by feature or page.

## Integration with Next.js

Our i18n system is deeply integrated with Next.js features:

1. **App Router**: Language is part of the route via `/[lang]/` parameter
2. **Middleware**: Handles language detection and URL rewriting
3. **generateMetadata**: Each page provides localized metadata
4. **Server Components**: Use the `withLocale` HOC for server translations

This integration provides a seamless experience where language is a core part of the application's routing and rendering strategy.