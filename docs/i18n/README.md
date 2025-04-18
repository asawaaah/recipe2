# Internationalization (i18n) Documentation

This directory contains comprehensive documentation for the Recipe2 app's internationalization system.

## Quick Start

The Recipe2 app uses a custom i18n solution that supports:
- Multiple languages (English, French, Spanish, German)
- URL-based language prefixes (`/en/`, `/fr/`, `/es/`, `/de/`)
- Localized URL paths (e.g., `/fr/recettes` instead of `/fr/recipes`)
- SEO-friendly canonical URLs
- Server and client component translations

### Key Components

```tsx
// Use the standard hooks and components for i18n
import { useTranslation } from '@/components/i18n/TranslationContext'
import { LocalizedLink } from '@/components/i18n/LocalizedLink'
import { withLocale } from '@/components/i18n/withLocale'

// Client component example
function MyComponent() {
  const { t, locale } = useTranslation()
  return (
    <div>
      <h1>{t('common.title')}</h1>
      <LocalizedLink href="/recipes">
        {t('common.viewRecipes')}
      </LocalizedLink>
    </div>
  )
}

// Server component example
export default withLocale<{ params: { lang: Locale } }>(async ({ t, params }) => {
  return <h1>{t('common.welcome')}</h1>
})
```

## Documentation Map

| Document | Description |
|----------|-------------|
| [Architecture](./architecture.md) | Core concepts, structure, and language detection strategy |
| [Components](./components.md) | Translation components, hooks, and server integration |
| [Routes & URLs](./routes-and-urls.md) | URL handling, localized paths, and SEO optimization |
| [Best Practices](./best-practices.md) | Guidelines, patterns, and common pitfalls to avoid |
| [Advanced Topics](./advanced-topics.md) | Performance, nested routes, testing, and troubleshooting |

## Legacy Documentation

For historical reference, the original comprehensive guide is available at:
- [languageWorkflow.md](../languageWorkflow.md) (Legacy)

## Related Documentation

The i18n system is also covered at a high level in:
- [fullStack.md](../fullStack.md) - Overall architecture documentation 