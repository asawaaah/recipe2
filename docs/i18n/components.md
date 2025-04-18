# i18n Components

> This document is part of the i18n documentation series:
> - 📐 [i18n Architecture](./architecture.md)
> - 🧩 [Components](./components.md) - Current document
> - 🔗 [Routes & URLs](./routes-and-urls.md)
> - 👍 [Best Practices](./best-practices.md)
> - 🔧 [Advanced Topics](./advanced-topics.md)
> - 📘 [README](./README.md)

## Overview

This document covers the core components and hooks that make up our i18n system. These components handle translation, language detection, and proper URL handling throughout the application.

## The Standard Translation Hook

The central component of our i18n system is the `useTranslation` hook. Always use this hook to access translations:

```tsx
import { useTranslation } from '@/components/i18n/TranslationContext'

function MyComponent() {
  const { t, locale } = useTranslation()
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>Current language: {locale}</p>
    </div>
  )
}
```

### Implementation Details

The `useTranslation` hook provides:
- A translation function `t` that accepts dot-notation keys
- The current `locale` (language code)
- The entire `dictionary` object (rarely needed directly)

Under the hood, it:
1. Accesses the translation context
2. Extracts the current language from the URL path
3. Falls back to context language if needed
4. Constructs the translation function

```tsx
// src/components/i18n/TranslationContext.tsx (simplified)
export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  
  // Extract language from URL path
  const pathname = usePathname();
  const pathLang = pathname?.split('/')?.[1] as Locale;
  const isValidLocale = locales.includes(pathLang as Locale);
  
  // Use path language if valid, otherwise use context language
  const locale = isValidLocale ? pathLang : context.locale;
  const { dictionary } = context;
  
  // Create translation function
  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let result: any = dictionary;
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return key; // Fallback to key if translation missing
      }
    }
    
    return result;
  }, [dictionary]);
  
  return { t, locale, dictionary };
}
```

⚠️ **IMPORTANT**: Never use any other translation method besides the `useTranslation` hook from `@/components/i18n/TranslationContext`.

## TranslationProvider

The `TranslationProvider` in `@/components/i18n/TranslationContext.tsx` provides the translation context to the entire application. It is already set up in the `[lang]/layout.tsx` file:

```tsx
// src/app/[lang]/layout.tsx
export default async function LocaleLayout({
  children,
  params: { lang },
}: PropsWithChildren<{ params: { lang: string } }>) {
  const dictionary = await getDictionary(lang as Locale);
  
  return (
    <TranslationProvider dictionary={dictionary} locale={lang as Locale}>
      {children}
    </TranslationProvider>
  );
}
```

You don't need to add the provider to your components; it's already present in the application layout.

## The LocalizedLink Component

Always use the `LocalizedLink` component for internal navigation instead of Next.js's default `Link`:

```tsx
import { LocalizedLink } from '@/components/i18n/LocalizedLink'

function MyNavigation() {
  const { t } = useTranslation()
  
  return (
    <nav>
      <LocalizedLink href="/recipes">
        {t('common.allRecipes')}
      </LocalizedLink>
    </nav>
  )
}
```

### Implementation Details

The `LocalizedLink` component:
1. Preserves the current language when navigating
2. Handles external URLs correctly (no modification)
3. Supports custom language overrides via props
4. Automatically localizes path segments based on language

```tsx
// src/components/i18n/LocalizedLink.tsx (simplified)
export function LocalizedLink({
  href,
  locale,
  ...props
}: LocalizedLinkProps) {
  // Get current language from URL path
  const pathname = usePathname();
  const pathLang = pathname?.split('/')?.[1] as Locale;
  const isValidLocale = locales.includes(pathLang as Locale);
  
  // Get language from context as fallback
  const contextLang = useLang();
  
  // Use provided locale, path language, or context language
  const language = locale || 
    (isValidLocale ? pathLang : (contextLang || defaultLocale));
  
  // Don't modify external URLs
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return <Link href={href} {...props} />;
  }
  
  // Generate localized path for internal links
  const localizedHref = generateLocalizedPath(href, language);
  
  return <Link href={localizedHref} {...props} />;
}
```

⚠️ **WARNING**: Never use the regular Next.js `Link` component for internal links, as it would break both the language prefix and localized paths.

## withLocale HOC for Server Components

For server components, use the `withLocale` Higher-Order Component (HOC):

```tsx
import { withLocale } from '@/components/i18n/withLocale'

export default withLocale<{ params: { lang: Locale } }>(async ({ t, params }) => {
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
    </div>
  )
})
```

### Implementation Details

The `withLocale` HOC:
1. Extracts the language from route parameters
2. Loads the appropriate translation dictionary
3. Creates a translation function
4. Passes the translation function to your component

```tsx
// src/components/i18n/withLocale.tsx (simplified)
export function withLocale<P extends { params: { lang: string } }>(
  Component: (props: P & { t: (key: string) => string }) => Promise<ReactNode> | ReactNode
) {
  return async function LocalizedComponent(props: P) {
    const { params } = props;
    const { lang } = params;
    const t = await getTranslations(lang as Locale);
    return Component({ ...props, t });
  }
}
```

## LanguageSwitcher Component

The `LanguageSwitcher` component provides a UI for users to change their language:

```tsx
// Using the language switcher in a component
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher'

function Header() {
  return (
    <header>
      <h1>Recipe2</h1>
      <LanguageSwitcher />
    </header>
  )
}
```

### Implementation Details

The `LanguageSwitcher` component:
1. Displays buttons/dropdown for each supported language
2. Handles routing to equivalent URLs in the selected language
3. Preserves all parameters and path segments during language change
4. Updates language preferences in localStorage

```tsx
// src/components/i18n/LanguageSwitcher.tsx (simplified)
export function LanguageSwitcher() {
  const { locale } = useTranslation();
  const { setLanguage } = usePreferences();
  const pathname = usePathname();
  const router = useRouter();
  
  const switchLanguage = (newLocale: Locale) => {
    // Update preferences
    setLanguage(newLocale);
    
    // Generate equivalent localized path in new language
    const newPath = getLocalizedPathForOtherLanguage(pathname, newLocale);
    
    // Navigate to new URL
    router.push(newPath);
  };
  
  return (
    <div className="language-switcher">
      {locales.map((lang) => (
        <button
          key={lang}
          onClick={() => switchLanguage(lang)}
          className={locale === lang ? 'active' : ''}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
```

## Integration with Server Components

When using i18n in server components, follow these patterns:

### Page Components (generateMetadata)

```tsx
// src/app/[lang]/recipes/page.tsx
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  const t = await getTranslations(lang as Locale);
  
  // Generate alternate URLs for each language
  const alternateLanguages: Record<string, string> = {};
  locales.forEach(locale => {
    alternateLanguages[locale] = getLocalizedCanonical('/recipes', locale);
  });
  
  return {
    title: t('recipes.title'),
    description: t('recipes.description'),
    alternates: {
      languages: alternateLanguages,
      canonical: getLocalizedCanonical('/recipes', lang),
    },
  };
}

export default withLocale<{ params: { lang: Locale } }>(async ({ t, params }) => {
  // Component implementation
});
```

## Where to Find These Components

Each of these components lives in a specific file:

| Component | File Path |
|-----------|-----------|
| `useTranslation` | `src/components/i18n/TranslationContext.tsx` |
| `TranslationProvider` | `src/components/i18n/TranslationContext.tsx` |
| `LocalizedLink` | `src/components/i18n/LocalizedLink.tsx` |
| `withLocale` | `src/components/i18n/withLocale.tsx` |
| `LanguageSwitcher` | `src/components/i18n/LanguageSwitcher.tsx` | 