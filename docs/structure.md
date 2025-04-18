# Recipe2 Technical Architecture

This document provides a comprehensive technical overview of the Recipe2 application, including its architecture, components, and implementation details.

## 1. Project Overview

### Purpose and Core Functionality

Recipe2 is a multilingual recipe sharing and management application that allows users to:
- Create, search, and browse recipes
- Translate recipes into multiple languages
- Save favorite recipes to personal cookbooks
- Rate and comment on recipes
- Filter and search based on ingredients, cooking time, and other parameters

### Target Audience

- Home cooks looking for recipe ideas
- Food enthusiasts who want to share their culinary creations
- International users seeking recipes in their native language
- Content creators who want to publish recipes for a global audience

## 2. Tech Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.1.0 | React framework for server-side rendering and routing |
| React | 18.2.0 | UI library for component-based development |
| TypeScript | 5.3.3 | Static typing for improved code quality |
| Tailwind CSS | 3.4.1 | Utility-first CSS framework for styling |
| Supabase | 2.39.7 | Backend-as-a-Service for database, authentication, and storage |

### Role of Each Technology

- **Next.js**: Provides the application framework with app router, server components, API routes, and optimal rendering strategies.
- **React**: Enables component-based UI development with hooks and state management.
- **TypeScript**: Ensures type safety across the codebase for better developer experience and fewer bugs.
- **Tailwind CSS**: Allows for rapid UI development with utility classes and consistent design.
- **Supabase**: Serves as the backend with PostgreSQL database, authentication, storage, and real-time capabilities.

## 3. Dependencies

### Core Dependencies

```json
{
  "@formatjs/intl-localematcher": "^0.6.1",      // Locale matching for i18n
  "@hookform/resolvers": "^3.10.0",              // Form validation resolvers
  "@radix-ui/react-*": "^1.x - ^2.x",            // Unstyled, accessible UI components
  "@supabase/auth-helpers-nextjs": "^0.9.0",     // Supabase auth integration for Next.js
  "@supabase/ssr": "^0.6.1",                     // Server-side rendering support for Supabase
  "@supabase/supabase-js": "^2.39.7",            // Supabase JavaScript client
  "@tanstack/react-query": "^5.24.1",            // Data fetching and caching
  "class-variance-authority": "^0.7.1",          // Component style variants
  "clsx": "^2.1.1",                              // Conditional class name utility
  "date-fns": "^3.6.0",                          // Date manipulation library
  "framer-motion": "^12.7.2",                    // Animation library
  "lucide-react": "^0.341.0",                    // Icon library
  "negotiator": "^1.0.0",                        // Content negotiation for HTTP
  "next-themes": "^0.4.6",                       // Theme management for Next.js
  "react-hook-form": "^7.55.0",                  // Form state management
  "sonner": "^2.0.3",                            // Toast notifications
  "tailwind-merge": "^2.6.0",                    // Merge Tailwind CSS classes
  "zod": "^3.24.2"                               // Schema validation
}
```

### Dev Dependencies

```json
{
  "@tailwindcss/typography": "^0.5.10",          // Typographic styles for Tailwind
  "@types/negotiator": "^0.6.3",                 // TypeScript types for Negotiator
  "eslint": "^8.57.0",                           // Code linting
  "prettier": "^3.2.5",                          // Code formatting
  "prettier-plugin-tailwindcss": "^0.5.11"       // Tailwind class sorting
}
```

## 4. Directory Structure

```
recipe2/
├── .cursor/                  # Cursor IDE configuration
├── .next/                    # Next.js build output
├── docs/                     # Documentation
├── migrations/               # Supabase database migrations
├── node_modules/             # npm dependencies
├── public/                   # Static assets
├── src/                      # Source code
│   ├── app/                  # Next.js App Router pages
│   │   ├── [lang]/           # Language-specific routes
│   │   ├── providers.tsx     # App-level providers
│   │   └── layout.tsx        # Root layout
│   ├── components/           # Reusable UI components
│   ├── dictionaries/         # Translation files
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   │   ├── supabase/         # Supabase client and helpers
│   │   └── validators/       # Form validation schemas
│   ├── middleware.ts         # Next.js middleware (i18n routing)
│   ├── services/             # Data services
│   │   ├── recipes/          # Recipe-related services
│   │   └── users/            # User-related services
│   ├── state/                # State management
│   │   ├── hooks/            # State-related hooks
│   │   ├── providers/        # Context providers
│   │   └── queries/          # React Query definitions
│   ├── styles/               # Global styles
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Utility functions
├── .env.local                # Environment variables
├── next.config.js            # Next.js configuration
├── package.json              # Project metadata and dependencies
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## 5. UI Components & Pages

### UI Component System

Recipe2 uses a combination of:
- **Radix UI** primitives for accessible, unstyled components
- **Shadcn UI** patterns for consistent component styling
- **Custom components** specific to recipe functionality

Key component categories:
- Layout components (Header, Footer, Sidebar)
- Recipe components (RecipeCard, RecipeDetail, IngredientsList)
- Form components (RecipeForm, SearchForm, FilterPanel)
- Authentication components (LoginForm, SignupForm)
- Feedback components (Toast, Modal, ErrorBoundary)

### Main Routes

```
/[lang]/                      # Home page
/[lang]/recipes/              # All recipes listing
/[lang]/recipes/[handle]      # Individual recipe page
/[lang]/my-cookbook/          # User's saved recipes
/[lang]/auth/                 # Authentication pages
  ├── login/                  # Login page
  ├── signup/                 # Registration page
  └── verify-email/           # Email verification
/[lang]/example/              # Example/demo pages
```

Each route is implemented with:
- Server components for data fetching and SEO
- Client components for interactive UI elements
- Multilingual support via route parameters
- Appropriate metadata for SEO

## 6. State Management

Recipe2 uses a multi-tiered approach to state management:

### Server State

- **Technology**: React Query (TanStack Query)
- **Purpose**: Fetch, cache, and update data from Supabase
- **Examples**: Recipe data, user profiles, comments

```tsx
// Example: React Query for recipes
function useRecipes(filters?: RecipeFilters) {
  return useQuery({
    queryKey: recipeKeys.list(filters || {}),
    queryFn: async () => fetchRecipes(filters)
  });
}
```

### UI/Client State

- **Technology**: React Context API + custom hooks
- **Purpose**: Manage UI state and user preferences
- **Examples**: Theme preferences, view modes, favorites

```tsx
// Example: Theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

### Form State

- **Technology**: React Hook Form + Zod validation
- **Purpose**: Manage complex form state with validation
- **Examples**: Recipe creation/editing, user profile editing

```tsx
// Example: Form hooks with validation
function useRecipeForm() {
  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: { /* ... */ }
  });
  // ...
}
```

### URL State

- **Technology**: Custom hooks over Next.js router
- **Purpose**: State that should be shareable via URL
- **Examples**: Search queries, filter parameters, pagination

### Session State

- **Technology**: Custom hooks over sessionStorage
- **Purpose**: Temporary state that persists during session
- **Examples**: UI preferences, form drafts

### Provider Composition

Providers are composed in a specific order for proper dependency injection:

```tsx
export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <PreferencesProvider>
            {children}
          </PreferencesProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
```

## 7. Multilingual (i18n) Implementation

### URL-Based Routing

Recipe2 uses URL-based localization with the format: `/{locale}/path`:
- Implemented via Next.js middleware
- Supported locales: English (`en`), Spanish (`es`), French (`fr`), German (`de`)
- Default locale: `en`

### Dictionary-Based Translations

Static content translations are stored in JSON files:
- `/src/dictionaries/en.json` - English (default)
- `/src/dictionaries/es.json` - Spanish
- `/src/dictionaries/fr.json` - French
- `/src/dictionaries/de.json` - German

### Translation Helpers

#### Server Components
```tsx
import { getTranslations } from '@/utils/server-dictionary';

export default async function ServerComponent({ params }: { params: { lang: Locale }}) {
  const t = await getTranslations(params.lang);
  return <h1>{t('common.welcome')}</h1>;
}
```

#### Client Components
```tsx
import { useTranslation } from '@/app/providers';

function ClientComponent() {
  const { t } = useTranslation();
  return <p>{t('common.welcome')}</p>;
}
```

### Language Switcher

A dropdown component that:
- Displays the current language
- Shows available languages
- Preserves the current URL path while changing language
- Updates the locale in real-time

### Fallback Strategy

When a translation is missing:
1. Fall back to the English version of the key
2. If the key is missing, show the key name itself
3. Log missing translations in development

## 8. Database Architecture

### Supabase Setup

Recipe2 uses Supabase as its backend database and storage solution. The production database is hosted in the us-east-2 region and connects to the application through the Supabase JavaScript client.

### Core Tables & Relationships

The database schema is organized around the following primary tables:

#### User Management

- **users**: Stores user account information
  - `id` (UUID, PK)
  - `email` (text, unique)
  - `username` (text, unique)
  - `firstname` (text)
  - `lastname` (text)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)
  - Related to: recipes (one-to-many), comments (one-to-many)

#### Recipe Management

- **recipes**: Stores core recipe information
  - `id` (UUID, PK)
  - `title` (text)
  - `description` (text)
  - `user_id` (UUID, FK to users.id)
  - `handle` (text, unique) - URL-friendly identifier
  - `image_url` (text)
  - `cooking_time` (integer)
  - `servings` (integer)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)
  - Related to: ingredients (one-to-many), instructions (one-to-many), tags (many-to-many), translations (one-to-many)

- **ingredients**: Stores recipe ingredients
  - `id` (UUID, PK)
  - `recipe_id` (UUID, FK to recipes.id)
  - `name` (text)
  - `amount` (numeric)
  - `unit` (text)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

- **instructions**: Stores recipe preparation steps
  - `id` (UUID, PK)
  - `recipe_id` (UUID, FK to recipes.id)
  - `step_number` (integer)
  - `description` (text)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

- **tags**: Stores recipe categories
  - `id` (UUID, PK)
  - `name` (text, unique)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

- **recipe_tags**: Junction table for recipe-tag relationships
  - `recipe_id` (UUID, FK to recipes.id, PK)
  - `tag_id` (UUID, FK to tags.id, PK)
  - `created_at` (timestamp)

#### Multilingual Support

- **recipe_translations**: Stores localized recipe content
  - `id` (UUID, PK)
  - `recipe_id` (UUID, FK to recipes.id)
  - `locale` (varchar) - Language code (e.g., 'en', 'fr')
  - `title` (text) - Translated recipe title
  - `description` (text) - Translated recipe description
  - `handle` (text, NOT NULL) - Localized URL slug
  - `created_at` (timestamp)
  - `updated_at` (timestamp)
  - Constraints: Unique(recipe_id, locale), Unique(locale, handle)

#### Social Features

- **comments**: Stores user comments on recipes
  - `id` (UUID, PK)
  - `recipe_id` (UUID, FK to recipes.id)
  - `user_id` (UUID, FK to users.id)
  - `content` (text)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

### Indexes for Performance

```sql
-- Recipe translations indexes
CREATE INDEX idx_recipe_translations_recipe_id ON recipe_translations(recipe_id);
CREATE INDEX idx_recipe_translations_locale ON recipe_translations(locale);
CREATE INDEX idx_recipe_translations_handle ON recipe_translations(handle);
CREATE UNIQUE INDEX idx_recipe_translations_locale_handle ON recipe_translations(locale, handle);
```

### Database Migrations

The database schema is managed through migrations, with key changes including:

1. **Initial Schema**: Basic recipe and user tables
2. **Translation Support**: Added recipe_translations table 
3. **Localized URL Handles**: Added handle field to recipe_translations table with the following migration:

```sql
-- Add localized URL handles to recipe_translations table
ALTER TABLE recipe_translations ADD COLUMN handle TEXT;

-- Create a unique index for handle per locale 
-- This allows the same handle to be used in different languages
CREATE UNIQUE INDEX idx_recipe_translations_locale_handle ON recipe_translations(locale, handle);

-- Create a function to generate a unique handle based on title
CREATE OR REPLACE FUNCTION generate_unique_handle(title TEXT, locale TEXT)
RETURNS TEXT AS $$
DECLARE
  base_handle TEXT;
  unique_handle TEXT;
  counter INT := 0;
BEGIN
  -- Convert title to lowercase, replace spaces with hyphens
  base_handle := lower(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'));
  base_handle := regexp_replace(base_handle, '\s+', '-', 'g');
  
  -- Start with the base handle
  unique_handle := base_handle;
  
  -- Check for existing handle and add a counter if needed
  WHILE EXISTS (
    SELECT 1 FROM recipe_translations 
    WHERE locale = $2 AND handle = unique_handle
  ) LOOP
    counter := counter + 1;
    unique_handle := base_handle || '-' || counter;
  END LOOP;
  
  RETURN unique_handle;
END;
$$ LANGUAGE plpgsql;
```

### Row-Level Security (RLS)

Row-Level Security policies are implemented on key tables to ensure data access control:

- Users can only view their own private data
- Public recipes are viewable by all
- Users can only edit their own content
- Admins have full access to all data

### Database Access Patterns

The application uses optimized query patterns including:

1. **Recipe listings with translations**:
```sql
SELECT r.*, 
  u.username, u.firstname, u.lastname,
  json_agg(rt.*) as translations
FROM recipes r
LEFT JOIN users u ON r.user_id = u.id
LEFT JOIN recipe_translations rt ON r.id = rt.recipe_id
GROUP BY r.id, u.id
```

2. **Fetching recipe by localized handle**:
```sql
SELECT r.*
FROM recipes r
JOIN recipe_translations rt ON r.id = rt.recipe_id
WHERE rt.locale = :locale AND rt.handle = :handle
```

## 9. Services & Data Fetching

### Supabase Client Setup

```typescript
// Server-side client
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false }
    }
  );
}

// Client-side client
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### Recipe Service

Services for recipes include:
- `fetchRecipes`: Get multiple recipes with optional filters
- `fetchRecipeById`: Get a single recipe by ID
- `fetchRecipeByHandle`: Get a recipe by its URL handle
- `createRecipe`: Create a new recipe
- `updateRecipe`: Update an existing recipe
- `deleteRecipe`: Delete a recipe

### Translation Service

Services for translations include:
- `getRecipeTranslations`: Get all translations for a recipe
- `getRecipeTranslation`: Get a specific translation by locale
- `createRecipeTranslation`: Create a new translation
- `updateRecipeTranslation`: Update an existing translation
- `deleteRecipeTranslation`: Delete a translation

### Authentication Service

Services for user authentication:
- `signIn`: Email/password authentication
- `signUp`: User registration
- `signOut`: User logout
- `resetPassword`: Password reset flow
- `updateProfile`: Profile management

## 10. Utilities & Helpers

### Common Utilities

- `formatDate`: Date formatting with localization
- `generateSlug`: URL-friendly slug generation
- `validateImage`: Image validation
- `storage`: Local storage wrappers

### Form Validation

Recipe2 uses Zod for schema validation:

```typescript
// Recipe schema example
export const recipeSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  cooking_time: z.number().min(1).optional(),
  servings: z.number().min(1).optional(),
  ingredients: z.array(
    z.object({
      name: z.string().min(2),
      amount: z.number().min(0),
      unit: z.string()
    })
  ).min(1),
  instructions: z.array(
    z.object({
      step_number: z.number().int().min(1),
      description: z.string().min(5)
    })
  ).min(1)
});
```

These schemas are used with React Hook Form:

```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(recipeSchema)
});
```

## 11. SEO & Meta Configuration

### Language Metadata

Recipe2 implements proper SEO for multilingual content:

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = params;
  const t = await getTranslations(lang);
  
  // Generate alternate URLs for each language
  const alternateLanguages: Record<string, string> = {}
  locales.forEach(locale => {
    alternateLanguages[locale] = `/${locale}/recipes`;
  });
  
  return {
    title: t('recipes.pageTitle'),
    description: t('recipes.pageDescription'),
    alternates: {
      languages: alternateLanguages,
      canonical: `/${lang}/recipes`,
    }
  };
}
```

### Localized URL Handles

Each recipe translation has its own URL handle:

- English: `/en/recipes/chocolate-brownies`
- French: `/fr/recipes/brownies-au-chocolat`
- Spanish: `/es/recipes/brownies-de-chocolate`

### Sitemap & Robots

Next.js app router is used to generate sitemaps and robots.txt:
- Multi-language sitemap entries
- Proper hreflang references
- Canonical URL definitions

## 12. Testing & Quality

### Translation Testing

- Automated tests to verify translation completeness
- Validation of translation key consistency across all language files
- Tools to identify missing translations

### Linting & Formatting

- ESLint for code quality and style enforcement
- Prettier for consistent code formatting
- TypeScript for static type checking

### CI/CD Pipeline

- GitHub Actions for continuous integration
- Automated testing on pull requests
- Deployment to production on merge to main branch

## 13. Future Considerations

### Planned Enhancements

- **Mobile Application**: React Native app using shared API services
- **Advanced Search**: Elasticsearch integration for better recipe search
- **Offline Support**: PWA features for offline recipe access
- **AI Recipe Suggestions**: Machine learning for recipe recommendations
- **Translation Memory System**: TMS integration for better translation workflow
- **Recipe Scaling**: Automatic ingredient scaling based on serving size
- **Shopping List**: Generate shopping lists from recipes
- **Meal Planning**: Calendar-based meal planning feature

### Technical Improvements

- **Performance Optimization**: Image optimization and code splitting
- **Accessibility Enhancements**: WCAG compliance improvements
- **Analytics Integration**: User behavior tracking
- **Content Delivery Network**: Global CDN for assets
- **Server-Side Caching**: Redis or similar for API response caching

---

This document provides a high-level overview of the Recipe2 application architecture. For more detailed information on specific aspects, refer to the specialized documentation in the `/docs` directory. 