# Language and Translation Workflow

This document describes the standardized approach to handling internationalization (i18n) in our application. Following these guidelines will ensure consistency across the codebase and prevent common issues with language switching, URL handling, and translations.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Language Detection Strategy](#language-detection-strategy)
3. [Translation Components and Hooks](#translation-components-and-hooks)
4. [URL Handling and Navigation](#url-handling-and-navigation)
5. [Best Practices](#best-practices)
6. [Integration with Other Features](#integration-with-other-features)
7. [Common Pitfalls to Avoid](#common-pitfalls-to-avoid)
8. [Performance Considerations](#performance-considerations)
9. [Troubleshooting Common Issues](#troubleshooting-common-issues)
10. [Recent Fixes and Enhancements](#recent-fixes-and-enhancements)
11. [Key Files Reference](#key-files-reference)

## Architecture Overview

Our application uses a Next.js middleware-based approach to handle internationalization with the following key components:

- **URL-based language routing**: Languages are prefixed in URLs (e.g., `/en/recipes`, `/fr/recipes`)
- **Middleware for language detection**: Auto-detects user's preferred language and redirects
- **Dictionary-based translations**: JSON files with nested key structure
- **Context API**: Provides translations and current language information to components
- **Client components**: Respect and maintain selected language

This architecture ensures a consistent user experience while allowing for deep linking to any page in any supported language.

### Project Structure

```
src/
├── app/
│   ├── [lang]/                # All language-specific routes
│   │   ├── layout.tsx         # Translation Provider setup
│   │   ├── page.tsx           # Home page with withLocale wrapper
│   │   └── ...                # Other routes
│   ├── layout.tsx             # Root layout with HTML/body
│   └── providers.tsx          # LangContext provider
├── components/
│   ├── i18n/
│   │   ├── LanguageSwitcher.tsx    # Language switcher component
│   │   ├── LocalizedLink.tsx       # Link component that preserves language
│   │   ├── TranslationContext.tsx  # Translation context and hook
│   │   └── withLocale.tsx          # HOC for server components
├── dictionaries/              # Translation JSON files
│   ├── en.json                # English translations
│   ├── fr.json                # French translations
│   └── ...                    # Other language files
├── middleware.ts              # Language detection middleware
└── ...
```

## Language Detection Strategy

We use a unified language detection strategy throughout the application, following this priority order:

1. **URL Path Language**: Extract language from the first segment of the URL path
2. **Context Language**: Fall back to the language provided by the language context
3. **Default Language**: Use the application's default language (usually 'en')

```typescript
// Standard pattern for language detection
const pathname = usePathname()
const pathLang = pathname?.split('/')?.[1] as Locale
const isValidLocale = locales.includes(pathLang as Locale)
const currentLang = isValidLocale ? pathLang : defaultLocale
```

### IMPORTANT

Never create custom language detection logic in individual components. Always use the standardized hooks that implement this strategy.

### How Language Detection Works Under the Hood

1. The middleware (`src/middleware.ts`) intercepts all requests and redirects to the user's preferred language if no language prefix is present
2. The root layout (`src/app/layout.tsx`) receives the language parameter and sets up the basic HTML attributes
3. The language-specific layout (`src/app/[lang]/layout.tsx`) loads and provides translations
4. Components use context to access translations and the current language

## Translation Components and Hooks

### The Standard Translation Hook

Always use the `useTranslation` hook from `@/components/i18n/TranslationContext`:

```typescript
import { useTranslation } from '@/components/i18n/TranslationContext'

function MyComponent() {
  // This provides both translation function and current locale
  const { t, locale } = useTranslation()
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>Current language: {locale}</p>
    </div>
  )
}
```

### ❌ NEVER USE

Never use any other translation hooks, such as:
- ~~`@/hooks/useTranslation`~~
- ~~Custom translation functions~~

### TranslationProvider

The `TranslationProvider` in `@/components/i18n/TranslationContext` provides the translation context to the application. It is already set up in the `[lang]/layout.tsx` file. You don't need to add it to your components.

```typescript
// This is already handled in the application layout
<TranslationProvider dictionary={dictionary} locale={lang as Locale}>
  {children}
</TranslationProvider>
```

### Server Components: withLocale

For server components, use the `withLocale` HOC:

```typescript
import { withLocale } from '@/components/i18n/withLocale'

export default withLocale<{ params: { lang: Locale } }>(async ({ t, params }) => {
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
    </div>
  )
})
```

## URL Handling and Navigation

### LocalizedLink Component

Always use the `LocalizedLink` component for internal navigation instead of Next.js's default `Link`:

```typescript
import { LocalizedLink } from '@/components/i18n/LocalizedLink'

function MyNavigation() {
  return (
    <nav>
      <LocalizedLink href="/recipes">All Recipes</LocalizedLink>
      {/* Will render as /en/recipes if current language is English */}
    </nav>
  )
}
```

The `LocalizedLink` component automatically:
1. Preserves the current language when navigating
2. Handles external URLs correctly
3. Supports custom language overrides

### Implementation Details

The `LocalizedLink` component:
1. Extracts the current language from the URL path first
2. Falls back to the language context if needed
3. Prefixes the language to the provided URL (e.g., `/recipes` becomes `/en/recipes`)
4. Skips modification for external URLs (starting with `http://` or `https://`)

### ❌ NEVER USE

Never use the regular Next.js `Link` component for internal links:
- ~~`import Link from 'next/link'`~~

This would break the language prefix and lose the user's language preference.

## Best Practices

### 1. Component Standardization

When creating new components that need translations:

```typescript
// Good practice
import { useTranslation } from '@/components/i18n/TranslationContext'
import { LocalizedLink } from '@/components/i18n/LocalizedLink'

export function MyComponent() {
  const { t, locale } = useTranslation()
  
  return (
    <div>
      <h1>{t('section.title')}</h1>
      <LocalizedLink href="/some-page">
        {t('section.linkText')}
      </LocalizedLink>
    </div>
  )
}
```

### 2. Handling Dynamic Content with Translations

When you need to display both dynamic content and translations:

```typescript
// Good practice
function RecipeInfo({ recipe }) {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{recipe.title}</h1>
      <p>
        {t('recipe.cookingTime')}: {recipe.cookingTime} {t('recipe.minutes')}
      </p>
    </div>
  )
}
```

### 3. Managing Translated URLs/Slugs

For content that should have localized URLs:

```typescript
// Good practice for handling localized slugs
function RecipeCard({ recipe }) {
  const { locale } = useTranslation()
  const localizedHandle = recipe.translations?.find(
    t => t.locale === locale
  )?.handle || recipe.handle
  
  return (
    <LocalizedLink href={`/recipes/${localizedHandle}`}>
      {/* Card content */}
    </LocalizedLink>
  )
}
```

### 4. Fetching Data with Language Awareness

When fetching data, include language information:

```typescript
// Good practice
function MyDataComponent() {
  const { locale } = useTranslation()
  const { data } = useQuery(['data', locale], () => 
    fetchData({ language: locale })
  )
  
  return <div>{/* render data */}</div>
}
```

## Integration with Other Features

### Sidebar and Layout Components

When adding i18n support to layout components:

1. Use `LocalizedLink` in navigation menus and breadcrumbs
2. Get translation keys for all user-facing text
3. Extract the current language from the URL path

Example with `SidebarLayout`:

```tsx
// Good implementation for layout components
export function SidebarLayout({ children, breadcrumbs }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header>
          <Breadcrumb>
            {breadcrumbs.map((item) => (
              <BreadcrumbItem key={item.label}>
                {item.isCurrentPage ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <LocalizedLink href={item.href}>
                      {item.label}
                    </LocalizedLink>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
```

### User Preferences Integration

Our application maintains user language preferences using the `PreferencesProvider`. Language changes are:

1. Persisted in local storage
2. Synced with the URL language
3. Applied to all components through context

When a user changes language:

```typescript
import { usePreferences } from '@/state/providers/PreferencesProvider'
import { useRouter } from 'next/navigation'

function LanguageSwitcher() {
  const { language, setLanguage } = usePreferences()
  const router = useRouter()
  const pathname = usePathname()
  
  const switchLanguage = (newLocale) => {
    // Update preferences
    setLanguage(newLocale)
    
    // Update URL (get path without language prefix)
    const pathnameWithoutLocale = pathname.split('/').slice(2).join('/')
    router.push(`/${newLocale}${pathnameWithoutLocale ? `/${pathnameWithoutLocale}` : ''}`)
  }
  
  // Rest of component
}
```

## Common Pitfalls to Avoid

When working with internationalization in Next.js, it's easy to make certain mistakes that can lead to inconsistent behavior or subtle bugs. Here are the most common pitfalls to avoid:

### 1. Multiple Translation Approaches

**Problem**: Using different hooks or methods to get translations in different components.

**Symptoms**:
- Some components don't translate when language changes
- Inconsistent language display across UI
- Language switching works only partially

**Solution**: 
- Always use the standardized `useTranslation` hook from `@/components/i18n/TranslationContext`
- Remove any direct imports from alternative translation hooks

### 2. Direct DOM Manipulation for Language Switching

**Problem**: Modifying language by directly manipulating HTML attributes or DOM elements.

**Symptoms**:
- Language changes don't persist between page navigations
- Hydration errors related to language attributes
- UI and URL language get out of sync

**Solution**:
- Use the `setLanguage` method from the PreferencesProvider
- Always update URL and context together when changing language

### 3. Missing Language Prefix in Programmatic Navigation

**Problem**: Forgetting to include the language prefix when using `router.push()` or similar navigation methods.

**Symptoms**:
- Language resets to default after certain navigation actions
- URL structure changes unexpectedly
- App reverts to default language on certain actions

**Solution**:
- Always include the current language in programmatic navigation
- Extract the current language using the standard approach 
- Use pattern: `router.push(/${currentLang}${path})`

### 4. Ignoring Language-Specific Slugs/Content

**Problem**: Not accounting for content like slugs or URLs that might need to be localized.

**Symptoms**:
- Broken links when changing language
- Content is in the wrong language despite UI being translated
- URLs don't reflect localized content

**Solution**:
- Design database schema with translations in mind
- Store localized versions of slugs and content identifiers
- Use the correct localized slug for the current language

### 5. Forgetting Server-Side Translation

**Problem**: Not handling translations consistently between client and server components.

**Symptoms**:
- Initial page load shows untranslated content
- Flashes of untranslated content
- SEO content in wrong language

**Solution**:
- Use the `withLocale` HOC for server components
- Ensure metadata and server-generated content use the right language
- Pass dictionaries through to client components if needed

### 6. Hardcoded Text Strings

**Problem**: Adding text directly in components instead of using translation keys.

**Symptoms**:
- Some text never translates regardless of language
- Inconsistent translation coverage across the app
- New features/components are "broken" for non-default languages

**Solution**:
- Always use the `t()` function for user-facing text
- Add translation keys for all strings, even if they're temporary
- Review PRs specifically for hardcoded text

### 7. Ignoring RTL Languages

**Problem**: Not considering right-to-left language layouts during development.

**Symptoms**:
- Broken layouts in RTL languages
- Alignment issues with text and UI elements
- Direction-sensitive UI components look wrong

**Solution**:
- Use appropriate CSS properties for directional styling
- Test with RTL languages if supported
- Use direction-aware components and styles

By avoiding these common pitfalls, you'll create a more robust internationalization system that works consistently across the entire application.

## Performance Considerations

Internationalization can impact application performance if not implemented carefully. Here are key considerations to keep your application fast and responsive:

### Dictionary Loading Strategies

Our application loads dictionaries on server-side rendering for optimal performance. For client-side component fallbacks, we use:

```typescript
// In server components
import { getDictionary } from '@/dictionaries'

// Await is required for server component
const dictionary = await getDictionary(locale)
```

The server-rendered approach avoids loading dictionaries on the client side when possible, keeping bundle sizes smaller.

### Bundle Size Management

To avoid bloating your JavaScript bundles with translations:

1. Server components should always use server-side translations
2. Client components should receive translations through context, not by importing dictionaries
3. Split dictionaries by feature if they become too large

#### ❌ Bad Practice

```typescript
// Directly importing dictionaries in client components (avoid this)
import enDictionary from '@/dictionaries/en.json'
import frDictionary from '@/dictionaries/fr.json'
```

#### ✅ Good Practice

```typescript
// Use context provided by TranslationContext
const { t } = useTranslation()
```

### Debouncing Language Changes

When implementing language switchers with immediate effects, consider debouncing rapid changes:

```typescript
// Debounce implementation for language switching
function LanguageSwitcher() {
  const { setLanguage } = usePreferences()
  const router = useRouter()
  const [isChangingLanguage, setIsChangingLanguage] = useState(false)
  
  const switchLanguage = (newLocale) => {
    if (isChangingLanguage) return
    
    setIsChangingLanguage(true)
    setLanguage(newLocale)
    
    // Navigate to new URL with language prefix
    const pathnameWithoutLocale = pathname.split('/').slice(2).join('/')
    router.push(`/${newLocale}${pathnameWithoutLocale ? `/${pathnameWithoutLocale}` : ''}`)
    
    // Prevent rapid changes
    setTimeout(() => {
      setIsChangingLanguage(false)
    }, 500)
  }
  
  // Component rendering
}
```

### Dynamic Translation Loading

For large applications with many languages, consider dynamic imports of translations:

```typescript
// Dynamic loading of dictionaries
async function loadDictionary(locale) {
  try {
    const dictionary = await import(`@/dictionaries/${locale}.json`)
    return dictionary.default
  } catch (error) {
    console.error(`Failed to load dictionary for ${locale}`, error)
    // Fall back to default locale
    const fallback = await import(`@/dictionaries/en.json`)
    return fallback.default
  }
}
```

### Memoizing Translation Functions

To avoid unnecessary re-renders when using the translation function in many components:

```typescript
// In TranslationContext.tsx
const t = React.useCallback((key: string): string => {
  const keys = key.split('.')
  let result: any = dictionary
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k]
    } else {
      console.warn(`Translation key not found: ${key}`)
      return key
    }
  }
  
  return result
}, [dictionary])
```

By adopting these performance optimizations, you can ensure that internationalization doesn't negatively impact your application's speed and user experience.

## Troubleshooting Common Issues

### 1. Language Not Updating Across Components

If some components don't update when the language changes:

- Ensure all components use the standardized `useTranslation` hook
- Verify there are no direct imports from `@/hooks/useTranslation`
- Check that navigation is using `LocalizedLink` and not the regular `Link`

### 2. URL Language Prefix Issues

If navigating to a page loses the language prefix:

- Replace any standard `Link` components with `LocalizedLink`
- Check that any programmatic navigation with `router.push()` includes the language prefix

### 3. Missing Translations

If translations are missing on certain pages:

- Verify the translation key exists in all language dictionary files
- Check that components are using the `t()` function correctly
- Use fallback text for translations that might be missing

### 4. Inconsistent Language Display

If different parts of the UI show different languages:

- Ensure the URL language prefix matches the language shown in the UI
- Check for any components bypassing the standard language detection strategy
- Verify the `PreferencesProvider` is initialized with the correct language

## Recent Fixes and Enhancements

### Fixing Duplicate HTML Structure

We've optimized the layout structure to avoid duplicate `<html>` and `<body>` tags which caused hydration errors:

- Root layout (`app/layout.tsx`): Contains the html/body structure and initializes providers
- Language layout (`app/[lang]/layout.tsx`): Only provides translations without structural HTML

### Standardizing Translation Hooks

We've unified the translation hook approach by:

1. Consolidating on `@/components/i18n/TranslationContext` as the single source of truth
2. Ensuring the hook always checks URL path first for language information
3. Removing legacy hooks like `@/hooks/useTranslation`

### URL Path-Based Language Detection

All components now consistently extract language from URL paths:

```typescript
// Standardized pattern used in all components
const pathname = usePathname()
const pathLang = pathname?.split('/')?.[1] as Locale
const isValidLocale = locales.includes(pathLang as Locale)
```

### LocalizedLink Integration

We've replaced all instances of regular `Link` components with `LocalizedLink` to ensure language preservation, including in:

- Navigation menus
- Recipe cards
- Breadcrumbs
- Buttons

## Key Files Reference

This section provides a reference to all essential files involved in the internationalization system of our application. Understanding these files and their roles will help you contribute to and maintain the multilingual aspects of the project.

### Core Infrastructure

| File Path | Description |
|-----------|-------------|
| `src/middleware.ts` | Handles language detection and redirects based on user preferences. Contains the `locales` array, `Locale` type, and `defaultLocale` configuration. |
| `src/app/layout.tsx` | Root layout containing the HTML structure. Sets the `lang` attribute on the HTML tag based on the current locale. |
| `src/app/[lang]/layout.tsx` | Language-specific layout that provides the `TranslationProvider` to all routes. |
| `src/app/providers.tsx` | Contains the `LangContext` provider and `useLang` hook that allow components to access the current language. |

### Translation Components and Hooks

| File Path | Description |
|-----------|-------------|
| `src/components/i18n/TranslationContext.tsx` | ✅ **Primary translation hook**. Contains the context provider and `useTranslation` hook that all components should use to access translations. |
| `src/components/i18n/LocalizedLink.tsx` | Link component that preserves the language prefix in navigation. Use instead of Next.js's default Link. |
| `src/components/i18n/LanguageSwitcher.tsx` | UI component for switching languages. Uses the URL path to determine the current language. |
| `src/components/i18n/withLocale.tsx` | Higher-order component (HOC) for providing translations to server components. |
| `src/hooks/useTranslation.ts` | ❌ **Deprecated**. Legacy translation hook that should not be used. |

### Translation Dictionaries

| File Path | Description |
|-----------|-------------|
| `src/dictionaries/index.ts` | Entry point for loading dictionaries. Contains the `getDictionary` function used by server components. |
| `src/dictionaries/en.json` | English translations (default language). |
| `src/dictionaries/fr.json` | French translations. |
| `src/dictionaries/es.json` | Spanish translations. |
| `src/dictionaries/de.json` | German translations. |
| `src/utils/server-dictionary.ts` | Utilities for server-side translations. Contains the `getTranslations` function used in server components. |

### User Preferences and State Management

| File Path | Description |
|-----------|-------------|
| `src/state/providers/PreferencesProvider.tsx` | Manages user preferences including language selection. Responsible for persisting language preferences to local storage. |
| `src/state/utils/storage.ts` | Utilities for reading/writing from local storage, including the language preference. |

### Key Components Using Translations

| File Path | Description |
|-----------|-------------|
| `src/components/blocks/RecipeCard.tsx` | Example of a component using localized URLs and translations. |
| `src/components/blocks/RecipeDetails.tsx` | Example of dynamic content with translations. |
| `src/components/layouts/SidebarLayout.tsx` | Example of a layout component using localized links in navigation/breadcrumbs. |
| `src/app/[lang]/page.tsx` | Example of a server component using the `withLocale` HOC for translations. |

### Documentation

| File Path | Description |
|-----------|-------------|
| `docs/languageWorkflow.md` | This file - the comprehensive guide to i18n in the application. |
| `docs/multilingual.md` | Additional documentation about multilingual support. |
| `docs/translation-glossary.md` | Glossary of translation terms and guidelines. |

### Testing and Examples

| File Path | Description |
|-----------|-------------|
| `src/components/demo/ClientTranslationForm.tsx` | Example of a client component using the translation system. |
| `src/app/[lang]/translation-demo/page.tsx` | Example page demonstrating various translation features. |

By referring to these files, you'll have a comprehensive understanding of how our internationalization system works and where to find specific components or functionality when needed.

---

