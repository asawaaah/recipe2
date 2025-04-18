# Recipe2 - Multilingual Recipe App Architecture

## Table of Contents

- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [UI Components & Pages](#ui-components--pages)
- [State Management](#state-management)
- [Internationalization (i18n)](#internationalization-i18n)
- [Supabase Data Layer](#supabase-data-layer)
- [Services & Data Fetching](#services--data-fetching)
- [Utilities & Helpers](#utilities--helpers)
- [SEO & Meta](#seo--meta)
- [Testing & CI/CD](#testing--cicd)
- [Future Considerations](#future-considerations)

## Technology Stack

### Front-End
- **Framework**: Next.js 15.3.1 (React 18.2.0) with App Router
- **Styling**: TailwindCSS 3.4.1 with shadcn/ui components
- **Language**: TypeScript 5.3.3
- **State Management**: React Context API + TanStack Query (React Query) 5.24.1
- **Form Handling**: React Hook Form 7.55.0 with Zod 3.24.2 validation

### Back-End
- **Database**: PostgreSQL 15 (via Supabase)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: Next.js Server Actions + Supabase Functions

### Key Dependencies
- **UI Components**: 
  - Radix UI Primitives (various components)
  - shadcn/ui (built on Radix)
  - Class Variance Authority
  - Tailwind Merge
  - Framer Motion
  - Sonner (toast notifications)
- **Internationalization**: 
  - FormatJS/Intl-LocaleMatcher
  - Negotiator
  - Custom i18n implementation
- **Data Fetching**: 
  - TanStack React Query
  - Supabase JS Client
- **Date Handling**: date-fns

## Project Structure

```
/src
  /app                     # Next.js App Router pages & layouts
    /[lang]                # Language-based routing
    /auth                  # Authentication pages
    /recipes               # Recipe routes
    /my-cookbook           # User's personal recipes
    /all-recipes           # Browse all recipes
  /components              # Reusable UI components
    /blocks                # Domain-specific components
    /i18n                  # Custom internationalization components
      /LanguageSwitcher.tsx    # Language switcher UI component
      /LocalizedLink.tsx       # Link component that preserves language
      /TranslationContext.tsx  # Translation context and hooks
      /withLocale.tsx          # HOC for server components
    /ui                    # UI primitives
  /dictionaries            # Translation files (en, fr, es, de)
  /hooks                   # Custom React hooks
  /lib                     # Core utilities
    /supabase              # Supabase client & types
    /validators            # Zod schemas
  /middleware.ts           # i18n routing middleware
  /state                   # State management
    /providers             # Context providers
  /services                # API services
    /recipes               # Recipe-related services
      /recipeFetcher.ts    # Fetches recipes with translations
      /translationService.ts # Handles recipe translations
    /users                 # User-related services
  /types                   # TypeScript type definitions
  /utils                   # Helper functions
    /route-mappings-data.ts  # Localized URL path mappings
    /localized-routes.ts     # Utilities for localized URL generation
```

### Routing Strategy

The application uses a sophisticated routing approach:

1. **Language-Based Directory Structure**: All routes are organized under `/app/[lang]/...`
2. **Internal Route Names**: Files and directories use English naming for internal routes
3. **Localized Path Segments**: URLs are rewritten to show localized path segments for each language
4. **Route Handling Flow**:
   - User requests `/fr/recettes/pasta`
   - Middleware rewrites internally to `/fr/recipes/pasta`
   - App Router renders appropriate components
   - Links generate localized paths

This provides a clean code structure while optimizing for SEO with language-specific URLs.

## UI Components & Pages

### Core Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with welcome message, redirects to language-specific route |
| `/[lang]` | Language-specific homepage |
| `/[lang]/login` | User login page |
| `/[lang]/signup` | User registration page |
| `/[lang]/auth/callback` | Auth callback handler |
| `/[lang]/verify-email` | Email verification page |
| `/[lang]/all-recipes` | Browse all recipes page |
| `/[lang]/recipes/[handle]` | View specific recipe by localized handle |
| `/[lang]/recipes/[handle]/translate` | Create/edit recipe translations |
| `/[lang]/my-cookbook` | User's personal recipe collection |

### Key Components

- **`RecipeCard`**: Displays recipe preview with image, title, and metadata
- **`RecipeDetailView`**: Full recipe view with ingredients, instructions, and metadata
- **`RecipeList`**: Grid of recipe cards with filtering options
- **`LoginForm`/`SignupForm`**: Authentication forms with validation
- **`LocalizedLink`**: Special link component that preserves language context
- **`LanguageSwitcher`**: UI component for switching between languages
- **`TranslationContext`**: Provides i18n functionality to components
- **`SidebarLayout`**: Layout with navigation sidebar for authenticated sections

## State Management

The application uses a combination of React Context API for global state and TanStack Query for server state.

### Context Providers

```tsx
// AppProviders.tsx
<QueryProvider>
  <PreferencesProvider initialLanguage={lang}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </PreferencesProvider>
</QueryProvider>
```

- **`QueryProvider`**: TanStack Query client for data fetching and caching
- **`PreferencesProvider`**: User preferences (language, etc.)
- **`ThemeProvider`**: Theme switching (light/dark)
- **`AuthProvider`**: Authentication state
- **`LangContext`**: Current language context (from middleware)

## Internationalization (i18n)

The app implements a comprehensive custom i18n solution supporting four languages: English (en), French (fr), Spanish (es), and German (de).

### Implementation

- **URL-Based Routing**: `/[lang]/...` routes for all pages
- **Middleware**: Detects user's preferred language and redirects accordingly
- **Dictionary-based translations**: JSON files for each supported language
- **Custom i18n Components**: Specialized components for handling translations
- **Localized URL paths**: URL segments are translated for each language (e.g., `/fr/recettes` instead of `/fr/recipes`)

### Key i18n Components

#### TranslationContext & Hook

```tsx
// src/components/i18n/TranslationContext.tsx
export function useTranslation() {
  const context = useContext(TranslationContext);
  
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  
  // Get the current pathname to extract the locale
  const pathname = usePathname();
  const pathLang = pathname?.split('/')?.[1] as Locale;
  const isValidLocale = locales.includes(pathLang as Locale);
  
  // Use the path language if valid, otherwise use the context language
  const locale = isValidLocale ? pathLang : context.locale;
  const { dictionary } = context;
  
  // Helper function to get a nested translation by dot notation
  const t = (key: string): string => {
    // Implementation to get nested translations
    // ...
  };
  
  return { t, locale, dictionary };
}
```

#### LocalizedLink Component

```tsx
// src/components/i18n/LocalizedLink.tsx
export function LocalizedLink({ href, locale, ...props }: LocalizedLinkProps) {
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
  
  // Add language prefix to internal links
  const path = href.startsWith('/') ? href : `/${href}`;
  const localizedHref = `/${language}${path}`;
  
  return <Link href={localizedHref} {...props} />;
}
```

#### withLocale HOC for Server Components

```tsx
// src/components/i18n/withLocale.tsx
export function withLocale<P extends { params: { lang: string } }>(
  Component: (props: P & { t: (key: string) => string }) => Promise<ReactNode> | ReactNode
) {
  return async function LocalizedComponent(props: P) {
    const { params } = props;
    const { lang } = await params;
    const t = await getTranslations(lang as Locale);
    return Component({ ...props, t });
  }
}
```

### Dictionary Structure

The translation dictionaries follow a consistent structure for all UI text:

```typescript
// Dictionary type definition
export type Dictionary = {
  handle: {
    recipes: string
  }
  common: {
    home: string
    allRecipes: string
    // ...
  }
  recipe: {
    title: string
    description: string
    // ...
  }
  auth: {
    common: {
      // ...
    }
    login: {
      // ...
    }
    // ...
  }
  // ...
}
```

### Localized URL Paths

The application supports fully localized URL paths where not only content is translated but also URL segments themselves:

```
/en/recipes/pasta-carbonara  (English)
/fr/recettes/pasta-carbonara (French)
/es/recetas/pasta-carbonara  (Spanish)
/de/rezepte/pasta-carbonara  (German)
```

#### Path Mapping Implementation

- **Central Mapping**: `src/utils/route-mappings-data.ts` maps internal segments to localized ones
- **Middleware Rewriting**: `src/middleware.ts` intercepts requests to localized paths and internally maps them
- **Unified Navigation**: `LocalizedLink` component automatically generates correct localized paths

```typescript
// src/utils/route-mappings-data.ts
export const pathMappings: Record<Locale, Partial<Record<string, RouteSegment>>> = {
  en: { 'recipes': 'recipes' },
  fr: { 'recettes': 'recipes' },
  es: { 'recetas': 'recipes' },
  de: { 'rezepte': 'recipes' }
}
```

This implementation keeps the internal folder structure simple while providing SEO benefits of localized URLs.

#### Adding a New Localized Path

To add a new localized path, follow these steps:

1. **Update the RouteSegment type**:
   ```typescript
   // In src/utils/route-mappings-data.ts
   export type RouteSegment = 'recipes' | 'login' | 'my-account'; // Add your new route
   ```

2. **Add mappings for each language**:
   ```typescript
   // In src/utils/route-mappings-data.ts
   export const pathMappings: Record<Locale, Partial<Record<string, RouteSegment>>> = {
     en: {
       // English
       'recipes': 'recipes',
       'my-account': 'my-account', // Same as internal name for English
       // ...
     },
     fr: {
       // French
       'recettes': 'recipes',
       'mon-compte': 'my-account', // Translated segment
       // ...
     },
     es: {
       // Spanish
       'recetas': 'recipes',
       'mi-cuenta': 'my-account', // Translated segment
       // ...
     },
     de: {
       // German
       'rezepte': 'recipes',
       'mein-konto': 'my-account', // Translated segment
       // ...
     },
   }
   ```

3. **Create the route folder using the internal name**:
   ```
   src/app/[lang]/my-account/page.tsx
   ```

4. **Use LocalizedLink for navigation**:
   ```tsx
   <LocalizedLink href="/my-account">
     {t('common.myAccount')}
   </LocalizedLink>
   // Will render as:
   // - /en/my-account (English)
   // - /fr/mon-compte (French)
   // - /es/mi-cuenta (Spanish)
   // - /de/mein-konto (German)
   ```

5. **Add canonical URLs to metadata**:
   ```tsx
   export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
     return {
       // ...
       alternates: {
         languages: alternateLanguages,
         canonical: getLocalizedCanonical('/my-account', params.lang),
       },
     }
   }
   ```

This approach ensures that your new path is fully localized while maintaining a consistent internal route structure.

### Language Detection Strategy

The application uses a consistent language detection strategy:

1. Extract language from URL path first segment
2. Fall back to language context if URL doesn't have a valid language
3. Use default language (English) as final fallback

#### Implementation Files

The language detection strategy is implemented across several key files:

- **`src/middleware.ts`**: Intercepts all requests without a language prefix and redirects them to the user's preferred language based on browser settings
- **`src/components/i18n/TranslationContext.tsx`**: Implements the detection hierarchy in the `useTranslation` hook
- **`src/components/i18n/LocalizedLink.tsx`**: Preserves language when navigating between pages

#### Example Implementation

```typescript
// Standard pattern used throughout the application
const pathname = usePathname()
const pathLang = pathname?.split('/')?.[1] as Locale
const isValidLocale = locales.includes(pathLang as Locale)
const currentLang = isValidLocale ? pathLang : defaultLocale
```

This unified approach ensures language preferences are maintained consistently throughout the application, even during client-side navigation or after user interaction.

### i18n Documentation

Comprehensive documentation for the i18n system is available in `docs/languageWorkflow.md`, providing guidelines for developers on:
- Language detection
- Translation components and hooks
- URL handling and navigation
- Best practices
- Common pitfalls to avoid

## Supabase Data Layer

### Database Schema

#### Core Tables

| Table | Description | Key Fields |
|-------|-------------|------------|
| `users` | User accounts | id, email, username |
| `recipes` | Recipe base information | id, title, description, user_id, handle, image_url |
| `recipe_translations` | Localized recipe content | id, recipe_id, locale, title, description, handle |
| `ingredients` | Recipe ingredients | id, recipe_id, name, amount, unit |
| `instructions` | Recipe steps | id, recipe_id, step_number, description |
| `tags` | Recipe categories | id, name |
| `recipe_tags` | Many-to-many relationship | recipe_id, tag_id |
| `comments` | User comments on recipes | id, recipe_id, user_id, content |

#### Key Relationships

- One user can have many recipes
- One recipe can have many ingredients, instructions, tags, and comments
- One recipe can have multiple translations (one per language)
- Each recipe and recipe translation has a unique URL handle

#### Row-Level Security

The database implements row-level security (RLS) on tables to ensure users can only:
- Read public recipes from all users
- Read/write their own recipes, ingredients, and instructions
- Comment on any public recipe

### Migrations

The database uses a migration-based approach for schema changes. Key migrations include:

- `create_initial_schema`: Sets up the base schema
- `create_security_policies`: Implements row-level security
- `add_handle_and_trigger`: Adds URL-friendly handles to recipes
- `add_recipe_translations`: Creates the translation table
- `add_localized_handles`: Adds localized URL handles to recipe translations

### Stored Procedures

The database includes several stored procedures for common operations:

- `generate_recipe_handle()`: Automatically generates SEO-friendly handles
- `generate_unique_handle()`: Ensures handles are unique within each language
- `create_recipe_with_translation()`: Creates a recipe with its first translation

## Services & Data Fetching

### Supabase Client

The app uses the Supabase JS client for data access:

```typescript
// src/lib/supabase.ts
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Server Actions

The app uses Next.js Server Actions for data mutations:

```typescript
// src/services/recipes/translationService.ts
'use server'

export async function createRecipeTranslation(
  translation: RecipeTranslationInput
): Promise<RecipeTranslation | null> {
  // Implementation...
}

export async function updateRecipeTranslation(
  id: string,
  translation: Partial<RecipeTranslationInput>
): Promise<RecipeTranslation | null> {
  // Implementation...
}
```

### Translation Service

The app has a dedicated translation service with functions for:

- Creating and updating translations
- Finding recipes by localized handles
- Generating unique handles for each language
- Handling fallbacks when translations aren't available

### Data Fetching Pattern

- **Server Components**: Use direct Supabase queries with server-side client
- **Client Components**: Use TanStack Query hooks for data fetching, caching, and synchronization

### Translation Strategy

- Each recipe has a base record in the `recipes` table
- Localized content is stored in `recipe_translations` 
- When fetching a recipe, the system:
  1. Tries to find a translation for the requested language by localized handle
  2. Falls back to the recipe's original language if translation is missing
  3. Returns consistent data structure regardless of translation availability

## Utilities & Helpers

### Form Validation

Zod schemas are used for form validation:

- User registration/login
- Recipe creation and editing
- Translation creation/editing

### Translation Utilities

The app includes utilities for both server and client components:

```typescript
// src/utils/server-dictionary.ts
export async function getTranslations(locale: Locale): Promise<(key: string) => string> {
  const dictionary = await getDictionary(locale);
  
  return function t(key: string): string {
    // Implementation...
  };
}

// src/utils/client-dictionary.ts
import { useTranslation } from '@/components/i18n/TranslationContext';
// ...
```

## SEO & Meta

### Implementation

- **Dynamic Metadata**: Each page defines metadata using Next.js's `generateMetadata` function
- **Localized Metadata**: Page titles and descriptions are translated based on the current locale
- **Alternate URLs**: Each page provides alternateLanguages metadata with all available translations
- **Localized Canonical URLs**: Canonical tags use fully localized paths for better SEO
- **hreflang Tags**: Link to alternative language versions

#### Canonical URL Generation

```typescript
// Using the getLocalizedCanonical utility for SEO-friendly canonical URLs
return {
  title: t('common.allRecipes'),
  description: t('common.welcomeMessage'),
  alternates: {
    languages: alternateLanguages,
    canonical: getLocalizedCanonical('/recipes', lang),
  },
  // ...
}
```

The `getLocalizedCanonical` utility:
1. Takes an internal route (like `/recipes` or `/recipes/[handle]`)
2. Substitutes any dynamic parameters like `[handle]`
3. Transforms the path segments to their localized versions based on the language
4. Returns a fully localized URL like `/fr/recettes/pasta-carbonara`

This ensures search engines index the proper localized URLs and prevents duplicate content issues.

### URL Strategy

- Each recipe has a unique, SEO-friendly handle generated from its title
- Each translation has its own language-specific handle for improved SEO
- Handles are guaranteed to be unique within each language
- URL segments are localized (e.g., `/fr/recettes` instead of `/fr/recipes`)
- URLs follow the pattern `/{lang}/{localized-segment}/{handle}` for optimal SEO

## Testing & CI/CD

### Linting & Formatting

- ESLint for code linting
- Prettier for code formatting with TailwindCSS plugin

## Future Considerations

1. **User Experience Improvements**:
   - Advanced recipe search with filtering
   - Favoriting/saving recipes
   - User profile pages
   
2. **Content Management**:
   - Admin interface for content moderation
   - Bulk translation management
   
3. **Performance Optimization**:
   - Image optimization and lazy loading
   - Code splitting and bundle optimization
   
4. **Mobile Experience**:
   - Progressive Web App (PWA) capabilities
   - Responsive design enhancements
   
5. **Analytics & Monitoring**:
   - User behavior tracking
   - Performance monitoring
   
6. **Translation Management**:
   - Integration with third-party translation services
   - Machine translation suggestions 