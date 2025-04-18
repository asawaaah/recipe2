# i18n Best Practices

> This document is part of the i18n documentation series:
> - 📐 [i18n Architecture](./architecture.md)
> - 🧩 [Components](./components.md)
> - 🔗 [Routes & URLs](./routes-and-urls.md)
> - 👍 [Best Practices](./best-practices.md) - Current document
> - 🔧 [Advanced Topics](./advanced-topics.md)
> - 📘 [README](./README.md)

## Overview

This document provides guidelines and best practices for working with the Recipe2 app's internationalization system. Following these practices will help maintain a consistent user experience across different languages and avoid common pitfalls.

## Translation Keys

### ✅ Do: Use Hierarchical Keys

Organize translation keys hierarchically by feature or section:

```json
{
  "common": {
    "buttons": {
      "submit": "Submit",
      "cancel": "Cancel"
    }
  },
  "recipes": {
    "filters": {
      "vegetarian": "Vegetarian"
    }
  }
}
```

### ❌ Don't: Use Flat Keys

Avoid flat structures that make organization difficult:

```json
{
  "submitButton": "Submit",
  "cancelButton": "Cancel",
  "vegetarianFilter": "Vegetarian"
}
```

### ✅ Do: Use Consistent Naming Conventions

Stick to consistent naming patterns:

```json
{
  "common": {
    "buttons": {
      "submit": "Submit",
      "cancel": "Cancel",
      "delete": "Delete"
    }
  }
}
```

### ❌ Don't: Mix Naming Styles

Avoid inconsistent naming:

```json
{
  "common": {
    "submitBtn": "Submit",
    "button_cancel": "Cancel",
    "DeleteButton": "Delete"
  }
}
```

## Content Translation

### ✅ Do: Account for Text Expansion

Some languages may require more space than English:

```tsx
<button className="btn btn-flexible">
  {t('common.buttons.subscribe')}
</button>
```

### ❌ Don't: Hardcode Text Lengths

Avoid fixed-width elements that can't accommodate longer text:

```tsx
<button className="btn w-24">
  {t('common.buttons.subscribe')}
</button>
```

### ✅ Do: Use Format Strings for Variables

Use placeholders in translations:

```json
{
  "recipe": {
    "cookingTime": "Cooking time: {{minutes}} minutes"
  }
}
```

```tsx
// With a function that handles variable insertion
t('recipe.cookingTime', { minutes: recipe.cookingTime })
```

### ❌ Don't: Concatenate Strings

Avoid string concatenation which breaks in languages with different word order:

```tsx
// BAD: This breaks in languages where word order differs
t('recipe.cookingTime') + ': ' + recipe.cookingTime + ' ' + t('recipe.minutes')
```

## Component Usage

### ✅ Do: Use LocalizedLink for Internal Navigation

Always use the LocalizedLink component for internal links:

```tsx
import { LocalizedLink } from '@/components/i18n/LocalizedLink'

<LocalizedLink href="/recipes">
  {t('common.viewRecipes')}
</LocalizedLink>
```

### ❌ Don't: Use Regular Next.js Link for Internal Routes

Regular Link components don't handle localized paths:

```tsx
// BAD: Breaks localized URL paths
import Link from 'next/link'

<Link href="/recipes">
  {t('common.viewRecipes')}
</Link>
```

### ✅ Do: Specify Image Alt Text in Dictionaries

Keep image alt text in translation dictionaries:

```json
{
  "homePage": {
    "heroAlt": "Chef preparing a meal in kitchen"
  }
}
```

```tsx
<Image 
  src="/images/hero.jpg"
  alt={t('homePage.heroAlt')}
  width={1200}
  height={800}
/>
```

### ❌ Don't: Hardcode Alt Text

Don't hardcode alt text in components:

```tsx
// BAD: Alt text is not translatable
<Image 
  src="/images/hero.jpg"
  alt="Chef preparing a meal in kitchen"
  width={1200}
  height={800}
/>
```

## Server Components

### ✅ Do: Use withLocale for Server Components

Use the withLocale HOC for server components:

```tsx
import { withLocale } from '@/components/i18n/withLocale'

export default withLocale<{ params: { lang: Locale } }>(async ({ t, params }) => {
  return <h1>{t('common.welcome')}</h1>
})
```

### ❌ Don't: Implement Custom Translation Logic

Avoid custom translation logic that bypasses the standard system:

```tsx
// BAD: Custom translation implementation
export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params
  const dictionary = await import(`@/dictionaries/${lang}.json`)
  
  return <h1>{dictionary.common.welcome}</h1>
}
```

## Metadata & SEO

### ✅ Do: Use Localized Canonical URLs

Generate proper canonical URLs with localized paths:

```tsx
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    // Other metadata...
    alternates: {
      canonical: getLocalizedCanonical('/recipes', params.lang),
    },
  }
}
```

### ❌ Don't: Use Internal Paths for Canonical URLs

Don't use internal paths for canonical URLs:

```tsx
// BAD: Uses internal paths instead of localized ones
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    // Other metadata...
    alternates: {
      canonical: `https://example.com/${params.lang}/recipes`,
    },
  }
}
```

### ✅ Do: Provide Alternative Language URLs

Always provide alternate language URLs for SEO:

```tsx
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const alternateLanguages: Record<string, string> = {}
  
  locales.forEach(locale => {
    alternateLanguages[locale] = getLocalizedCanonical('/recipes', locale)
  })
  
  return {
    // Other metadata...
    alternates: {
      languages: alternateLanguages,
      canonical: getLocalizedCanonical('/recipes', params.lang),
    },
  }
}
```

### ❌ Don't: Omit Language Alternatives

Don't skip language alternatives in metadata:

```tsx
// BAD: No language alternatives provided
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: t('recipes.title'),
    description: t('recipes.description'),
    // Missing alternates configuration
  }
}
```

## Dictionary Management

### ✅ Do: Keep All Dictionaries in Sync

Ensure all languages have the same keys:

```json
// en.json
{
  "common": {
    "welcome": "Welcome"
  }
}

// fr.json
{
  "common": {
    "welcome": "Bienvenue"
  }
}
```

### ❌ Don't: Leave Missing Translations

Avoid having keys in one language but not others:

```json
// en.json
{
  "common": {
    "welcome": "Welcome",
    "goodbye": "Goodbye" 
  }
}

// fr.json (BAD: Missing 'goodbye' key)
{
  "common": {
    "welcome": "Bienvenue"
  }
}
```

### ✅ Do: Handle Pluralization Properly

Account for different pluralization rules in different languages:

```json
{
  "recipe": {
    "commentsCount_zero": "No comments",
    "commentsCount_one": "1 comment",
    "commentsCount_other": "{{count}} comments"
  }
}
```

### ❌ Don't: Assume English Pluralization Rules

Don't assume all languages follow English pluralization patterns:

```json
// BAD: Only handles singular/plural case
{
  "recipe": {
    "commentsCountSingular": "1 comment",
    "commentsCountPlural": "{{count}} comments"
  }
}
```

## Common Pitfalls

### Date and Time Formatting

Use proper localization for dates and times:

```tsx
// Good: Localized date format
const formattedDate = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}).format(new Date(date))
```

### Number Formatting

Format numbers according to locale:

```tsx
// Good: Localized number format
const formattedPrice = new Intl.NumberFormat(locale, {
  style: 'currency',
  currency: 'EUR'
}).format(price)
```

### RTL Language Support

Design with right-to-left languages in mind:

```tsx
<html dir={isRTL(params.lang) ? 'rtl' : 'ltr'} lang={params.lang}>
```

### Character Encoding

Always use UTF-8 encoding for dictionaries and ensure proper HTML encoding:

```html
<meta charset="utf-8" />
```

## Performance Tips

### Cache Translation Dictionaries

Cache dictionaries to avoid repeated loading:

```typescript
const dictionaryCache = new Map<Locale, Promise<any>>()

export async function getDictionary(locale: Locale) {
  if (!dictionaryCache.has(locale)) {
    dictionaryCache.set(
      locale,
      import(`@/dictionaries/${locale}.json`).then(module => module.default)
    )
  }
  return dictionaryCache.get(locale)!
}
```

### Code-Split Dictionaries

Load only the active language dictionary:

```typescript
// Good: Code-split dictionaries
export const dictionaries = {
  en: () => import('@/dictionaries/en.json').then(m => m.default),
  fr: () => import('@/dictionaries/fr.json').then(m => m.default),
  // ...
}
``` 