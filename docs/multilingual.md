# Multilingual Implementation Guide

This document provides a comprehensive guide to the multilingual features in our Recipe application.

## Table of Contents

1. [Overview](#overview)
2. [Adding New Translations](#adding-new-translations)
3. [Translation Workflow](#translation-workflow)
4. [Testing Translations](#testing-translations)
5. [Deployment](#deployment)
6. [Adding New Content](#adding-new-content)
7. [Best Practices](#best-practices)
8. [Translation Context and Hints](#translation-context-and-hints)
9. [Troubleshooting](#troubleshooting)
10. [Localized URL Handles](#localized-url-handles)

## Overview

Our application supports multiple languages using a combination of:

- Next.js app router with `[lang]` dynamic segments
- JSON-based dictionaries for static content
- Database translations for user-generated content
- SEO optimizations for language variants
- Localized URL handles for recipes

Currently supported languages:
- English (en) - Default
- Spanish (es)
- French (fr)
- German (de)

## Adding New Translations

### Adding a New Language

1. Create a new dictionary file in `src/dictionaries/` (e.g., `it.json` for Italian)
2. Add the new locale to the supported locales in `src/middleware.ts`:

```typescript
export const locales: Locale[] = ['en', 'es', 'fr', 'de', 'it']
```

3. Create all translation entries for the new language, using the English dictionary as a reference

### Updating Existing Translations

1. Open the dictionary file for the language you want to update (e.g., `src/dictionaries/es.json`)
2. Add or modify translation keys as needed
3. Keep translation keys consistent across all language files

## Translation Workflow

### For Developers

1. Always use translation keys rather than hardcoded text
2. Use the `useTranslation` hook in client components:

```typescript
import { useTranslation } from '@/app/providers'

function MyComponent() {
  const { t } = useTranslation()
  return <h1>{t('common.welcome')}</h1>
}
```

3. Use the `getTranslations` function in server components:

```typescript
import { getTranslations } from '@/utils/server-dictionary'

export default async function ServerComponent({ params }: { params: { lang: Locale }}) {
  const t = await getTranslations(params.lang)
  return <h1>{t('common.welcome')}</h1>
}
```

4. Use the `withLocale` HOC for reusable components:

```typescript
import { withLocale } from '@/components/i18n/withLocale'

export default withLocale(({ t }) => {
  return <h1>{t('common.welcome')}</h1>
})
```

### For Translators

1. Work directly with the JSON files in `src/dictionaries/`
2. Maintain the same structure and keys as the English version
3. For user-generated content, use the translation UI in the application (e.g., `/recipes/{handle}/translate`)
4. Submit translations as pull requests to the repository

## Testing Translations

1. Run the application locally:

```bash
npm run dev
```

2. Test each language by navigating to `http://localhost:3000/{lang}/` where `{lang}` is the locale code
3. Verify that all text is properly translated
4. Check that links maintain the correct language parameter
5. Test language switching using the language switcher component

### Automated Tests

We have automated tests to verify translation completeness:

```bash
npm run test:translations
```

This will check that all languages have the same keys and no missing translations.

## Deployment

1. Before deployment, ensure all translations are up to date
2. Run the translation tests to verify completeness
3. Deploy using your normal workflow
4. After deployment, verify that language switching works correctly
5. Check the SEO metadata in all languages using browser developer tools

## Adding New Content

### Adding New Pages

1. Create the page under the `[lang]` directory (e.g., `src/app/[lang]/new-page/page.tsx`)
2. Add translation keys for any static text in the dictionaries
3. Implement the `generateMetadata` function with language alternates:

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = await getTranslations(params.lang)
  
  // Generate alternate URLs for each language
  const alternateLanguages: Record<string, string> = {}
  locales.forEach(locale => {
    alternateLanguages[locale] = `/${locale}/new-page`
  })
  
  return {
    title: t('newPage.title'),
    description: t('newPage.description'),
    alternates: {
      languages: alternateLanguages,
      canonical: `/${params.lang}/new-page`,
    },
    // Additional metadata...
  }
}
```

### Adding New Components

1. Use the translation hooks or functions as described in the Translation Workflow section
2. Remember to use the `LocalizedLink` component for internal links:

```typescript
import { LocalizedLink } from '@/components/i18n/LocalizedLink'

// Usage
<LocalizedLink href="/recipes">View Recipes</LocalizedLink>
```

### Adding New User-Generated Content Types

If you're adding a new type of user-generated content that needs translations:

1. Create a new database table for the translations (similar to `recipe_translations`)
2. Add appropriate foreign keys and locale fields
3. Implement service functions for CRUD operations on translations
4. Create a translation UI component for the content type

## Best Practices

1. **Organize translation keys logically** - Group related translations under namespaces (e.g., `common`, `recipe`, etc.)
2. **Use variables for dynamic content** - For text with variables, use placeholders:
   ```json
   {
     "recipe": {
       "cookingTimeMinutes": "Cooking time: {{minutes}} min"
     }
   }
   ```
3. **Keep translations concise** - Avoid overly complex translations that might break layouts
4. **Run translation tests regularly** - This prevents missing translations from reaching production
5. **Consider text expansion** - Some languages may require more space than English
6. **Use proper canonical URLs** - Always set the correct canonical and alternate URLs for SEO
7. **Document new translation keys** - When adding new keys, update this guide if necessary

## Translation Context and Hints

For translators, context is crucial for accurate translations. We provide a few ways to add context:

### Comments in Dictionary Files

You can add comments in the dictionary files to provide context for translators:

```json
{
  "common": {
    // This appears on the main navigation menu
    "home": "Home",
    
    // Used for recipe filtering, context: cooking time
    "short": "Short",
    "medium": "Medium",
    "long": "Long"
  }
}
```

### Translation Context Components

For complex phrases or sentences with variables, use the TranslationContext component:

```typescript
import { TranslationContext } from '@/components/i18n/TranslationContext'

<TranslationContext 
  id="recipe.ratingInfo" 
  context="Shows the average rating of a recipe"
  variables={{ 
    rating: 4.5, 
    count: 12 
  }}
/>
```

### Maintain a Translation Glossary

We maintain a glossary of common terms in `docs/translation-glossary.md` - refer to this when translating technical or domain-specific terms.

## Troubleshooting

### Missing Translations

If text appears in English when it should be translated:

1. Check that the translation key exists in the specific language dictionary
2. Verify the key is being correctly referenced in the component
3. Make sure you're using the translation function (`t`) correctly

### Language Detection Issues

If the app doesn't correctly detect or switch languages:

1. Check the URL path contains the correct language code
2. Verify the middleware language detection is working
3. Check browser language settings if using automatic detection

### SEO Issues

If search engines aren't recognizing language variants correctly:

1. Verify the `generateMetadata` function includes proper language alternates
2. Check the `canonical` URL is pointing to the correct language version
3. Use browser dev tools to inspect the `<link rel="alternate" hreflang="...">` tags

### Component-specific Translation Problems

For components that don't show translated content correctly:

1. Check if the component is client-side (needs `useTranslation`) or server-side (needs `getTranslations`)
2. Verify the component has access to the current language, either through context or props
3. For dynamic routes, ensure the language parameter is being passed correctly

### Database Translation Problems

If user-generated content translations aren't working:

1. Check that translations exist in the database for the requested locale
2. Verify the query includes translations in the selection
3. Ensure the frontend is correctly applying the translation when available

## Localized URL Handles

Our application supports localized URL handles for recipes, allowing each language to have a semantically appropriate URL.

For example:
- English: `/en/recipes/chocolate-brownies-by-john-doe`
- French: `/fr/recipes/brownies-chocolat-par-john-doe`
- Spanish: `/es/recipes/brownies-chocolate-por-john-doe`

### Database Schema

The recipe_translations table includes a `handle` field for localized URLs:

```sql
ALTER TABLE recipe_translations ADD COLUMN handle TEXT UNIQUE;
CREATE INDEX idx_recipe_translations_handle ON recipe_translations(handle);
```

### Creating Localized Handles

When creating a recipe translation:

1. Generate a URL-friendly handle based on the translated title
2. Ensure it's unique within that language
3. Store it in the `handle` field of the recipe_translations table

Example handle generator:

```typescript
function generateLocalizedHandle(title: string, locale: string): string {
  // Convert title to lowercase, replace spaces with hyphens
  const baseHandle = title.toLowerCase().replace(/\s+/g, '-')
    // Remove special characters
    .replace(/[^\w\-]+/g, '')
    // Trim hyphens from start and end
    .replace(/^-+|-+$/g, '');
    
  return baseHandle;
}
```

### URL Resolution

The application resolves localized URLs in this order:

1. First tries to find a recipe_translation with matching locale and handle
2. If not found, falls back to the default recipe with that handle
3. If still not found, returns a 404 error

This is handled in the `fetchRecipeByHandle` service:

```typescript
export async function fetchRecipeByHandle(handle: string, locale: Locale): Promise<Recipe | null> {
  // First try to find by localized handle
  const localizedRecipe = await findRecipeByLocalizedHandle(handle, locale);
  if (localizedRecipe) return localizedRecipe;
  
  // Fall back to default handle
  return findRecipeByDefaultHandle(handle);
}
```

### Generating URLs in Components

When generating links to recipes, always use the localized handle when available:

```typescript
<LocalizedLink 
  href={`/recipes/${recipe.translations?.find(t => t.locale === currentLocale)?.handle || recipe.handle}`}
>
  {recipe.title}
</LocalizedLink>
```

### SEO Considerations

In the recipe page metadata, update language alternates to use the correct localized handles:

```typescript
// Generate alternate URLs for each language using the correct handle for each
const alternateLanguages: Record<string, string> = {}
locales.forEach(locale => {
  const localizedHandle = recipe.translations?.find(t => t.locale === locale)?.handle || recipe.handle;
  alternateLanguages[locale] = `/${locale}/recipes/${localizedHandle}`;
})
``` 