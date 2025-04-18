# i18n Advanced Topics

> This document is part of the i18n documentation series:
> - 📐 [i18n Architecture](./architecture.md)
> - 🧩 [Components](./components.md)
> - 🔗 [Routes & URLs](./routes-and-urls.md)
> - 👍 [Best Practices](./best-practices.md)
> - 🔧 [Advanced Topics](./advanced-topics.md) - Current document
> - 📘 [README](./README.md)

## Overview

This document covers advanced internationalization topics including performance optimization, complex routing scenarios, testing strategies, and troubleshooting common issues.

## Performance Optimization

### Bundle Size Management

Our i18n system is designed to minimize bundle size through several techniques:

#### Dictionary Code Splitting

We load dictionaries dynamically based on the active language:

```typescript
// Dictionaries are code-split by language
const dictionaries = {
  en: () => import('@/dictionaries/en.json').then(m => m.default),
  fr: () => import('@/dictionaries/fr.json').then(m => m.default),
  es: () => import('@/dictionaries/es.json').then(m => m.default),
  de: () => import('@/dictionaries/de.json').then(m => m.default),
};
```

This ensures users only download the translations they need.

#### Server-Side Generation

For static pages, we generate translations at build time:

```typescript
// src/app/[lang]/page.tsx
export async function generateStaticParams() {
  return locales.map(lang => ({ lang }));
}
```

### Caching Strategies

Implement caching at various levels to improve performance:

#### Dictionary Cache

Use a global dictionary cache to prevent repeated imports:

```typescript
// Global dictionary cache
const dictionaryCache: Record<Locale, any> = {};

export async function getDictionary(locale: Locale) {
  // Return from cache if available
  if (dictionaryCache[locale]) {
    return dictionaryCache[locale];
  }
  
  // Load and cache dictionary
  const dictionary = await import(`@/dictionaries/${locale}.json`).then(m => m.default);
  dictionaryCache[locale] = dictionary;
  return dictionary;
}
```

#### Server Component Caching

Use React's cache function for server components:

```typescript
import { cache } from 'react';
import { getDictionary } from '@/utils/dictionary';
import type { Locale } from '@/i18n-config';

export const getTranslations = cache(async (locale: Locale) => {
  const dictionary = await getDictionary(locale);
  
  return function t(key: string) {
    // Translation implementation
    // ...
  };
});
```

### Measuring i18n Performance

Monitor the impact of internationalization on your application:

1. **Bundle Size Analysis**: Use tools like `next/bundle-analyzer` to measure dictionary size
2. **Load Time Metrics**: Compare page load times across languages
3. **Component Render Profiling**: Check for unnecessary re-renders in translated components

## Complex Routing Scenarios

### Nested Dynamic Routes

Handle nested dynamic routes with localization:

```tsx
// src/app/[lang]/recipes/[category]/[id]/page.tsx
export default withLocale<{
  params: { lang: Locale; category: string; id: string }
}>(async ({ t, params }) => {
  const { category, id } = params;
  // Fetch recipe data...
  
  return (
    <div>
      <h1>{recipe.title}</h1>
      <p>{t('recipe.category')}: {t(`categories.${category}`)}</p>
    </div>
  );
});
```

### URL Path Parameters

For routes with multiple dynamic segments, maintain consistent localization:

```typescript
// Handle complex URL path parameters
export function getLocalizedPathWithParams(
  internalPath: string,
  params: Record<string, string>,
  locale: Locale
): string {
  let path = internalPath;
  
  // Replace path parameters with actual values
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`[${key}]`, value);
  });
  
  // Now localize the resulting path
  return getLocalizedPath(path, locale);
}
```

### Catch-All Routes

Support localized catch-all routes:

```tsx
// src/app/[lang]/[[...slug]]/page.tsx
export default withLocale<{
  params: { lang: Locale; slug?: string[] }
}>(async ({ t, params }) => {
  const { slug = [] } = params;
  
  // Handle dynamic content based on slug
  // ...
  
  return (
    <div>
      <h1>{pageData.title}</h1>
      <LocalizedLink href="/recipes">
        {t('common.backToRecipes')}
      </LocalizedLink>
    </div>
  );
});
```

## Testing i18n Implementation

### Unit Testing Translations

Test that translations are correctly applied:

```typescript
// __tests__/i18n/translation.test.ts
import { render, screen } from '@testing-library/react';
import { TranslationProvider } from '@/components/i18n/TranslationContext';
import TestComponent from './TestComponent';

describe('Translations', () => {
  it('renders correct translations for English', () => {
    const mockDictionary = {
      test: { greeting: 'Hello' }
    };
    
    render(
      <TranslationProvider dictionary={mockDictionary} locale="en">
        <TestComponent />
      </TranslationProvider>
    );
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
  
  it('renders correct translations for French', () => {
    const mockDictionary = {
      test: { greeting: 'Bonjour' }
    };
    
    render(
      <TranslationProvider dictionary={mockDictionary} locale="fr">
        <TestComponent />
      </TranslationProvider>
    );
    
    expect(screen.getByText('Bonjour')).toBeInTheDocument();
  });
});
```

### Testing Localized Routing

Test that URL localization works correctly:

```typescript
// __tests__/i18n/routing.test.ts
import { getLocalizedPath, getInternalPath } from '@/utils/localized-routes';

describe('Localized routing', () => {
  it('converts internal paths to localized paths', () => {
    expect(getLocalizedPath('/recipes', 'en')).toBe('/recipes');
    expect(getLocalizedPath('/recipes', 'fr')).toBe('/recettes');
    expect(getLocalizedPath('/recipes/dessert', 'fr')).toBe('/recettes/dessert');
  });
  
  it('converts localized paths to internal paths', () => {
    expect(getInternalPath('/recipes', 'en')).toBe('/recipes');
    expect(getInternalPath('/recettes', 'fr')).toBe('/recipes');
    expect(getInternalPath('/recettes/dessert', 'fr')).toBe('/recipes/dessert');
  });
});
```

### Integration Testing

Test complete user flows across languages:

```typescript
// __tests__/integration/language-switch.test.ts
import { render, screen, fireEvent } from '@testing-library/react';
import App from '@/app/[lang]/page';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/en/recipes',
}));

describe('Language switching', () => {
  it('switches language and preserves current page', () => {
    render(
      <>
        <App params={{ lang: 'en' }} />
        <LanguageSwitcher />
      </>
    );
    
    // Find and click French language option
    const frButton = screen.getByText('FR');
    fireEvent.click(frButton);
    
    // Verify router was called with correct path
    expect(mockRouter.push).toHaveBeenCalledWith('/fr/recettes');
  });
});
```

### End-to-End Testing

Use Playwright or Cypress to test complete language flows:

```typescript
// e2e/language-flow.spec.ts (Playwright example)
test('user can change language and maintain context', async ({ page }) => {
  // Start on homepage in English
  await page.goto('/en');
  
  // Verify English content
  await expect(page.locator('h1')).toHaveText('Welcome to Recipe2');
  
  // Switch to French
  await page.click('[data-testid="lang-switch-fr"]');
  
  // Verify URL changed to French version
  await expect(page).toHaveURL('/fr');
  
  // Verify content is now in French
  await expect(page.locator('h1')).toHaveText('Bienvenue à Recipe2');
  
  // Navigate to recipes
  await page.click('text=Recettes');
  
  // Verify URL is localized
  await expect(page).toHaveURL('/fr/recettes');
});
```

## Dictionary Validation

Ensure all dictionaries have consistent keys:

```typescript
// scripts/validate-dictionaries.ts
import fs from 'fs';
import path from 'path';

// Load all dictionaries
const dictionaries = {};
const locales = ['en', 'fr', 'es', 'de'];

locales.forEach(locale => {
  const filePath = path.join(process.cwd(), 'src/dictionaries', `${locale}.json`);
  dictionaries[locale] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
});

// Extract all keys from English dictionary (reference)
function extractKeys(obj, prefix = '') {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      return [...acc, ...extractKeys(value, newKey)];
    }
    return [...acc, newKey];
  }, []);
}

const englishKeys = extractKeys(dictionaries.en);

// Check each language for missing keys
locales.filter(locale => locale !== 'en').forEach(locale => {
  const localeKeys = extractKeys(dictionaries[locale]);
  const missingKeys = englishKeys.filter(key => !localeKeys.includes(key));
  
  if (missingKeys.length > 0) {
    console.error(`[${locale}] Missing translations for keys:`);
    missingKeys.forEach(key => console.error(`  - ${key}`));
  } else {
    console.log(`[${locale}] All translations present!`);
  }
});
```

## Troubleshooting

### Common Issues and Solutions

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Missing translations | Translation key not found in dictionary | Check key path and ensure it exists in all language files |
| Wrong language displaying | Language detection fails | Check middleware for proper language detection logic |
| URL not localizing | Path mapping missing | Ensure route segment is defined in `pathMappings` |
| Metadata missing alternates | `generateMetadata` not configured | Check all page components have proper alternates configuration |
| Language switching breaks URL | Custom URL parameters lost | Use `getLocalizedPathForOtherLanguage` with all parameters |

### Debugging Middleware

To debug the middleware language detection and path rewriting:

```typescript
// Enhanced middleware with debugging
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Add debug header in development
  if (process.env.NODE_ENV === 'development') {
    const headers = new Headers(request.headers);
    headers.set('x-i18n-debug', 'true');
    
    console.log('[Middleware] Processing:', pathname);
    console.log('[Middleware] Accept-Language:', request.headers.get('Accept-Language'));
    
    const segments = pathname.split('/').filter(Boolean);
    console.log('[Middleware] Path segments:', segments);
    
    if (segments[0] && locales.includes(segments[0] as Locale)) {
      console.log('[Middleware] Detected locale from URL:', segments[0]);
    } else {
      const detectedLocale = detectLanguage(request);
      console.log('[Middleware] Detected locale from headers:', detectedLocale);
    }
  }
  
  // Continue with normal middleware logic
  // ...
}
```

### Translation Context Inspection

Create a debugging component to inspect translation context:

```tsx
// src/components/debug/TranslationDebug.tsx
'use client';

import { useTranslation } from '@/components/i18n/TranslationContext';

export function TranslationDebug() {
  const { locale, dictionary } = useTranslation();
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <details className="translation-debug">
      <summary>Translation Debug</summary>
      <div>
        <p>Active locale: {locale}</p>
        <p>Dictionary entries: {Object.keys(dictionary).length}</p>
        <pre>{JSON.stringify(dictionary, null, 2)}</pre>
      </div>
    </details>
  );
}
```

## Advanced URL Handling

### Query Parameters with Localized Paths

Preserve query parameters when generating localized links:

```typescript
export function getLocalizedPathWithQuery(
  internalPath: string,
  query: Record<string, string>,
  locale: Locale
): string {
  const localizedPath = getLocalizedPath(internalPath, locale);
  const queryString = new URLSearchParams(query).toString();
  
  if (!queryString) {
    return localizedPath;
  }
  
  return `${localizedPath}?${queryString}`;
}
```

### Hash Fragments

Support hash fragments in localized URLs:

```typescript
export function getLocalizedPathWithHash(
  internalPath: string,
  hash: string,
  locale: Locale
): string {
  const localizedPath = getLocalizedPath(internalPath, locale);
  
  if (!hash) {
    return localizedPath;
  }
  
  const hashWithPrefix = hash.startsWith('#') ? hash : `#${hash}`;
  return `${localizedPath}${hashWithPrefix}`;
}
```

## RTL Language Support

For right-to-left (RTL) languages:

### Detecting RTL Languages

```typescript
export const rtlLocales = ['ar', 'he', 'fa'] as const;

export function isRTL(locale: Locale): boolean {
  return rtlLocales.includes(locale as any);
}
```

### Setting HTML Direction

```tsx
// src/app/[lang]/layout.tsx
export default function LocaleLayout({ 
  children, 
  params,
}: { 
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const isRtl = isRTL(params.lang);
  
  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      {children}
    </div>
  );
}
```

### CSS for RTL Support

Use logical properties in CSS to support RTL layouts:

```css
/* Use logical properties for RTL support */
.navigation {
  padding-inline-start: 1rem;
  margin-inline-end: 2rem;
}

/* Instead of */
.navigation {
  padding-left: 1rem;
  margin-right: 2rem;
}
```

## Content Fallbacks

For missing translations, implement a fallback strategy:

```typescript
export function t(key: string, locale: Locale): string {
  const keys = key.split('.');
  let value = dictionaries[locale];
  
  // Try to find in requested locale
  for (const k of keys) {
    if (value === undefined) break;
    value = value[k];
  }
  
  // If not found, try English fallback
  if (value === undefined && locale !== 'en') {
    value = dictionaries.en;
    for (const k of keys) {
      if (value === undefined) break;
      value = value[k];
    }
  }
  
  // Last resort - return the key
  if (value === undefined) {
    return key;
  }
  
  return value;
}
```

## Conclusion

This document covers advanced aspects of our i18n implementation. By leveraging these techniques, you can build a robust, performant, and maintainable internationalized application. 