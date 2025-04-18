# Recipe Multilingual Translation Implementation Plan

This document provides a structured, incremental approach to implementing the multilingual recipe workflow described in `multilingualRecipeWorkflow.md`. Each phase is designed to build upon our existing architecture while maintaining consistency with best practices established in `structure.md` and `languageWorkflow.md`.

## Table of Contents

1. [Phase 1: Database Schema Enhancement](#phase-1-database-schema-enhancement)
2. [Phase 2: Service Layer Updates](#phase-2-service-layer-updates)
3. [Phase 3: Core Components Development](#phase-3-core-components-development)
4. [Phase 4: Recipe Creation Flow](#phase-4-recipe-creation-flow)
5. [Phase 5: Recipe Display Logic](#phase-5-recipe-display-logic)
6. [Phase 6: Translation Interface](#phase-6-translation-interface)
7. [Phase 7: Language Filtering and Navigation](#phase-7-language-filtering-and-navigation)
8. [Phase 8: Testing and Optimization](#phase-8-testing-and-optimization)
9. [Integration Checklist](#integration-checklist)

## Phase 1: Database Schema Enhancement

**Objective**: Extend the database schema to support source language tracking and enhanced translation workflows.

### Tasks

1. Add source language column to recipes table:
```sql
ALTER TABLE recipes ADD COLUMN source_locale VARCHAR(10) NOT NULL DEFAULT 'en';
CREATE INDEX idx_recipes_source_locale ON recipes(source_locale);
```

2. Add status tracking to translations table:
```sql
ALTER TABLE recipe_translations ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'complete';
ALTER TABLE recipe_translations ADD COLUMN completion_percentage INTEGER NOT NULL DEFAULT 100;
ALTER TABLE recipe_translations ADD COLUMN translator_id UUID REFERENCES users(id);
ALTER TABLE recipe_translations ADD COLUMN last_translated TIMESTAMP WITH TIME ZONE DEFAULT NOW();
```

3. Create translation requests table:
```sql
CREATE TABLE translation_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  requested_locale VARCHAR(10) NOT NULL,
  requester_id UUID REFERENCES users(id),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  translator_id UUID REFERENCES users(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(recipe_id, requested_locale)
);

CREATE INDEX idx_translation_requests_recipe_locale 
  ON translation_requests(recipe_id, requested_locale);
```

4. Create tables for ingredient and instruction translations:
```sql
CREATE TABLE ingredient_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  locale VARCHAR(10) NOT NULL,
  name TEXT NOT NULL,
  unit TEXT,
  notes TEXT,
  UNIQUE(ingredient_id, locale)
);

CREATE TABLE instruction_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instruction_id UUID REFERENCES instructions(id) ON DELETE CASCADE,
  locale VARCHAR(10) NOT NULL,
  description TEXT NOT NULL,
  UNIQUE(instruction_id, locale)
);
```

### Validation Criteria

- All schema changes are applied successfully
- Migrations are reversible
- Indexes are created for performance
- Foreign key constraints are properly defined
- Default values are appropriate

## Phase 2: Service Layer Updates

**Objective**: Extend the recipe service layer to handle source language tracking and enhanced translation workflows.

### Tasks

1. Update Recipe types to include source language:
```typescript
// src/services/recipes/types.ts
export interface Recipe extends RecipeMetadata {
  // Existing fields
  source_locale: Locale;
  applied_locale?: Locale; // To track which language is being displayed
}

export interface RecipeTranslation {
  // Existing fields
  status: 'complete' | 'partial' | 'machine-translated' | 'pending';
  completion_percentage: number;
  translator_id?: string;
  last_translated: string;
}
```

2. Enhance recipe creation service to set source language:
```typescript
// src/services/recipes/recipeCreator.ts
export async function createRecipe(
  recipeData: RecipeInput,
  locale: Locale = 'en'
): Promise<Recipe | null> {
  try {
    // Set the source locale to the current UI language
    const recipe = {
      ...recipeData,
      source_locale: locale
    };
    
    // Create the recipe with transaction to ensure base recipe and translation are created together
    const { data, error } = await supabase.rpc('create_recipe_with_translation', {
      recipe_data: recipe,
      locale: locale
    });
    
    // ...rest of implementation
  } catch (err) {
    console.error('Error creating recipe:', err);
    return null;
  }
}
```

3. Update recipe fetching service to handle language fallbacks:
```typescript
// src/services/recipes/recipeFetcher.ts
export async function fetchRecipes({ 
  locale, 
  onlyTranslated = false,
  sourceLocale = null 
}: {
  locale: Locale,
  onlyTranslated?: boolean,
  sourceLocale?: Locale | null
}): Promise<Recipe[]> {
  try {
    // Build query with source_locale support
    let query = supabase
      .from('recipes')
      .select(`
        *,
        translations:recipe_translations(*)
      `);
    
    // Filter by source language if specified
    if (sourceLocale) {
      query = query.eq('source_locale', sourceLocale);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Apply language filtering if requested
    if (onlyTranslated) {
      return data.filter(recipe => 
        recipe.source_locale === locale || 
        recipe.translations.some(t => t.locale === locale && t.status === 'complete')
      );
    }
    
    // Apply translations where available
    return data.map(recipe => {
      const translation = recipe.translations.find(t => t.locale === locale);
      
      if (translation) {
        return {
          ...recipe,
          title: translation.title,
          description: translation.description,
          handle: translation.handle,
          applied_locale: locale
        };
      }
      
      // Fall back to source language content
      return {
        ...recipe,
        applied_locale: recipe.source_locale
      };
    });
  } catch (err) {
    console.error('Error fetching recipes:', err);
    return [];
  }
}
```

4. Create translation request service:
```typescript
// src/services/recipes/translationRequestService.ts
export async function requestTranslation(
  recipeId: string,
  locale: Locale,
  requesterId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('translation_requests')
      .insert({
        recipe_id: recipeId,
        requested_locale: locale,
        requester_id: requesterId
      });
    
    return !error;
  } catch (err) {
    console.error('Error requesting translation:', err);
    return false;
  }
}
```

### Validation Criteria

- All services handle source language correctly
- Fallback mechanisms work as expected
- Translation status is properly tracked
- Error handling is robust

## Phase 3: Core Components Development

**Objective**: Create the UI components needed to display and manage multilingual recipe content.

### Tasks

1. Create LanguageIndicator component:
```tsx
// src/components/recipes/LanguageIndicator.tsx
import { useTranslation } from '@/components/i18n/TranslationContext';
import { Tooltip } from '@/components/ui/tooltip';
import { Locale } from '@/middleware';

interface LanguageIndicatorProps {
  sourceLanguage: Locale;
  displayedLanguage: Locale;
  currentLanguage: Locale;
}

export function LanguageIndicator({ 
  sourceLanguage, 
  displayedLanguage, 
  currentLanguage 
}: LanguageIndicatorProps) {
  const { t } = useTranslation();
  
  // Only show indicator if content isn't in user's current language
  if (displayedLanguage !== currentLanguage) {
    return (
      <div className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
        <span>{displayedLanguage.toUpperCase()}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon className="h-3 w-3" />
          </TooltipTrigger>
          <TooltipContent>
            {t('recipe.displayedInLanguage', { language: displayedLanguage })}
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }
  
  return null;
}
```

2. Create TranslationBadge component:
```tsx
// src/components/recipes/TranslationBadge.tsx
import { useTranslation } from '@/components/i18n/TranslationContext';
import { Button } from '@/components/ui/button';
import { Locale } from '@/middleware';

interface TranslationBadgeProps {
  sourceLocale: Locale;
  displayedLocale: Locale;
  recipeId: string;
  canContribute?: boolean;
}

export function TranslationBadge({
  sourceLocale,
  displayedLocale,
  recipeId,
  canContribute = false
}: TranslationBadgeProps) {
  const { t, locale: currentLocale } = useTranslation();
  
  // No need to show badge if displayed in user's language
  if (displayedLocale === currentLocale) {
    return null;
  }
  
  return (
    <div className="rounded-md bg-secondary p-2 mb-4">
      <div className="flex items-center justify-between">
        <p className="text-sm">
          {t('recipe.displayedInOriginalLanguage', { language: displayedLocale.toUpperCase() })}
        </p>
        
        {canContribute && (
          <Button 
            variant="outline" 
            size="sm"
            asChild
          >
            <LocalizedLink href={`/recipes/${recipeId}/translate?to=${currentLocale}`}>
              {t('recipe.helpTranslate')}
            </LocalizedLink>
          </Button>
        )}
      </div>
    </div>
  );
}
```

3. Create LanguageFilterToggle component:
```tsx
// src/components/recipes/LanguageFilterToggle.tsx
import { useTranslation } from '@/components/i18n/TranslationContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface LanguageFilterToggleProps {
  onlyShowCurrentLanguage: boolean;
  onChange: (value: boolean) => void;
}

export function LanguageFilterToggle({
  onlyShowCurrentLanguage,
  onChange
}: LanguageFilterToggleProps) {
  const { t, locale } = useTranslation();
  
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="language-filter" 
        checked={onlyShowCurrentLanguage}
        onCheckedChange={onChange}
      />
      <Label htmlFor="language-filter">
        {t('recipe.onlyShowInCurrentLanguage', { language: locale.toUpperCase() })}
      </Label>
    </div>
  );
}
```

### Validation Criteria

- Components render correctly
- Language indicators appear only when needed
- Translation badges show appropriate messages
- Components follow the design system

## Phase 4: Recipe Creation Flow

**Objective**: Update the recipe creation flow to properly set and store the source language.

### Tasks

1. Update RecipeForm component to capture source language:
```tsx
// src/components/forms/RecipeForm.tsx
import { useTranslation } from '@/components/i18n/TranslationContext';

export function RecipeForm({ onSubmit, initialData }) {
  const { locale } = useTranslation();
  
  const handleSubmit = async (data) => {
    // Pass current UI language as source_locale
    onSubmit({
      ...data,
      source_locale: locale
    });
  };
  
  // Rest of component implementation
}
```

2. Create database trigger to auto-create translations for source language:
```sql
CREATE OR REPLACE FUNCTION create_source_translation() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO recipe_translations (
    recipe_id, 
    locale, 
    title, 
    description, 
    handle, 
    status, 
    completion_percentage
  ) VALUES (
    NEW.id,
    NEW.source_locale,
    NEW.title,
    NEW.description,
    NEW.handle,
    'complete',
    100
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_recipe_insert
  AFTER INSERT ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION create_source_translation();
```

3. Create stored procedure for recipe creation with transaction:
```sql
CREATE OR REPLACE FUNCTION create_recipe_with_translation(
  recipe_data JSONB,
  locale TEXT
) RETURNS JSONB AS $$
DECLARE
  new_recipe_id UUID;
  new_recipe JSONB;
BEGIN
  -- Begin transaction
  BEGIN
    -- Insert the recipe
    INSERT INTO recipes (
      title,
      description,
      handle,
      user_id,
      cooking_time,
      servings,
      source_locale
    ) VALUES (
      recipe_data->>'title',
      recipe_data->>'description',
      recipe_data->>'handle',
      (recipe_data->>'user_id')::UUID,
      (recipe_data->>'cooking_time')::INTEGER,
      (recipe_data->>'servings')::INTEGER,
      locale
    )
    RETURNING id INTO new_recipe_id;
    
    -- Insert ingredients
    INSERT INTO ingredients (recipe_id, name, amount, unit)
    SELECT 
      new_recipe_id,
      (ingredient->>'name'),
      (ingredient->>'amount')::NUMERIC,
      (ingredient->>'unit')
    FROM jsonb_array_elements(recipe_data->'ingredients') AS ingredient;
    
    -- Insert instructions
    INSERT INTO instructions (recipe_id, step_number, description)
    SELECT 
      new_recipe_id,
      (instruction->>'step_number')::INTEGER,
      (instruction->>'description')
    FROM jsonb_array_elements(recipe_data->'instructions') AS instruction;
    
    -- Get the created recipe with translations
    SELECT jsonb_build_object(
      'id', r.id,
      'title', r.title,
      'description', r.description,
      'handle', r.handle,
      'source_locale', r.source_locale,
      'translations', (
        SELECT jsonb_agg(t) FROM recipe_translations t 
        WHERE t.recipe_id = r.id
      )
    ) INTO new_recipe
    FROM recipes r
    WHERE r.id = new_recipe_id;
    
    -- Commit transaction
    RETURN new_recipe;
  EXCEPTION WHEN OTHERS THEN
    -- Rollback transaction
    RAISE;
  END;
END;
$$ LANGUAGE plpgsql;
```

### Validation Criteria

- Recipe creation sets the correct source language
- Source language translation is automatically created
- Transaction ensures data integrity
- The form captures all required information

## Phase 5: Recipe Display Logic

**Objective**: Update recipe display components to handle language fallbacks and indicators.

### Tasks

1. Update RecipeDetailPage component:
```tsx
// src/app/[lang]/recipes/[handle]/page.tsx
import { notFound } from 'next/navigation';
import { Locale } from '@/middleware';
import { fetchRecipeByHandle } from '@/services/recipes/recipeFetcher';
import { TranslationBadge } from '@/components/recipes/TranslationBadge';
import { getSessionUser } from '@/services/auth/session';

interface RecipeDetailProps {
  params: {
    lang: Locale;
    handle: string;
  }
}

export default async function RecipeDetailPage({ params }: RecipeDetailProps) {
  const { lang, handle } = params;
  const recipe = await fetchRecipeByHandle(handle, lang);
  
  if (!recipe) {
    return notFound();
  }
  
  // Get current user to determine if they can contribute translations
  const user = await getSessionUser();
  
  // Determine which language is being displayed
  const displayedLocale = recipe.applied_locale || recipe.source_locale;
  const isSourceLanguage = displayedLocale === recipe.source_locale;
  
  return (
    <div>
      <TranslationBadge 
        sourceLocale={recipe.source_locale}
        displayedLocale={displayedLocale}
        recipeId={recipe.id}
        canContribute={!!user}
      />
      
      <h1 className="text-3xl font-bold">{recipe.title}</h1>
      <p className="text-lg text-muted-foreground mt-2">{recipe.description}</p>
      
      {/* Rest of recipe detail implementation */}
    </div>
  );
}
```

2. Update RecipeCard component:
```tsx
// src/components/blocks/RecipeCard.tsx
import { Locale } from '@/middleware';
import { Recipe } from '@/services/recipes/types';
import { LocalizedLink } from '@/components/i18n/LocalizedLink';
import { LanguageIndicator } from '@/components/recipes/LanguageIndicator';

interface RecipeCardProps {
  recipe: Recipe;
  currentLocale: Locale;
}

export function RecipeCard({ recipe, currentLocale }: RecipeCardProps) {
  const displayedLocale = recipe.applied_locale || recipe.source_locale;
  
  // Find the handle for the current display language
  const displayedHandle = recipe.translations?.find(
    t => t.locale === displayedLocale
  )?.handle || recipe.handle;
  
  return (
    <div className="recipe-card rounded-lg border p-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{recipe.title}</h3>
        
        <LanguageIndicator 
          sourceLanguage={recipe.source_locale}
          displayedLanguage={displayedLocale}
          currentLanguage={currentLocale}
        />
      </div>
      
      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
        {recipe.description}
      </p>
      
      <div className="mt-4">
        <LocalizedLink 
          href={`/recipes/${displayedHandle}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          View Recipe
        </LocalizedLink>
      </div>
    </div>
  );
}
```

3. Update AllRecipes component with language filtering:
```tsx
// src/components/blocks/AllRecipes.tsx
'use client'

import { useState } from 'react';
import { useTranslation } from '@/components/i18n/TranslationContext';
import { useRecipes } from '@/state/queries/recipes';
import { RecipeCard } from '@/components/blocks/RecipeCard';
import { LanguageFilterToggle } from '@/components/recipes/LanguageFilterToggle';

export default function AllRecipes() {
  const { locale } = useTranslation();
  const [onlyShowCurrentLanguage, setOnlyShowCurrentLanguage] = useState(false);
  
  // Query recipes with language filter
  const { data: recipes, isLoading } = useRecipes({
    locale,
    onlyTranslated: onlyShowCurrentLanguage
  });
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Recipes</h1>
        
        <LanguageFilterToggle 
          onlyShowCurrentLanguage={onlyShowCurrentLanguage}
          onChange={setOnlyShowCurrentLanguage}
        />
      </div>
      
      {isLoading ? (
        <RecipeGridSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes?.map(recipe => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              currentLocale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Validation Criteria

- Recipe detail page shows the content in the correct language
- Language indicators appear appropriately
- Recipe cards show the correct language badge
- Filtering by language works as expected
- URLs are correct for each language version

## Phase 6: Translation Interface

**Objective**: Create the translation interface for contributing translations to recipes.

### Tasks

1. Create TranslationForm component:
```tsx
// src/components/recipes/TranslationForm.tsx
'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Recipe } from '@/services/recipes/types';
import { Locale } from '@/middleware';
import { createRecipeTranslation } from '@/services/recipes/translationService';

const translationSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  ingredients: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(2, 'Ingredient name is required')
    })
  ),
  instructions: z.array(
    z.object({
      id: z.string(),
      description: z.string().min(5, 'Instruction is required')
    })
  )
});

interface TranslationFormProps {
  recipe: Recipe;
  targetLocale: Locale;
}

export function TranslationForm({ recipe, targetLocale }: TranslationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(translationSchema),
    defaultValues: {
      title: '',
      description: '',
      ingredients: recipe.ingredients.map(i => ({ id: i.id, name: '' })),
      instructions: recipe.instructions.map(i => ({ id: i.id, description: '' }))
    }
  });
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const result = await createRecipeTranslation({
        recipe_id: recipe.id,
        locale: targetLocale,
        title: data.title,
        description: data.description,
        // Additional fields will be processed separately
      });
      
      if (result) {
        toast({
          title: 'Translation submitted successfully',
          description: 'Thank you for contributing to our multilingual community!',
          variant: 'success'
        });
      } else {
        throw new Error('Failed to submit translation');
      }
    } catch (err) {
      toast({
        title: 'Error submitting translation',
        description: 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-8">
        <div className="side-by-side-translation">
          <div className="source-content">
            <h3>Original ({recipe.source_locale.toUpperCase()})</h3>
            <h2>{recipe.title}</h2>
          </div>
          
          <div className="translation-field">
            <h3>Translation ({targetLocale.toUpperCase()})</h3>
            <input 
              {...form.register('title')}
              className="w-full p-2 border rounded"
              placeholder="Translated title"
            />
            {form.formState.errors.title && (
              <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
            )}
          </div>
        </div>
        
        {/* Similar sections for description, ingredients, instructions */}
        
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Translation'}
        </Button>
      </div>
    </form>
  );
}
```

2. Create TranslationPage:
```tsx
// src/app/[lang]/recipes/[id]/translate/page.tsx
import { notFound, redirect } from 'next/navigation';
import { Locale } from '@/middleware';
import { fetchRecipe } from '@/services/recipes/recipeFetcher';
import { TranslationForm } from '@/components/recipes/TranslationForm';
import { getSessionUser } from '@/services/auth/session';

interface TranslatePageProps {
  params: {
    lang: Locale;
    id: string;
  };
  searchParams: {
    to?: string;
  };
}

export default async function TranslatePage({ 
  params, 
  searchParams 
}: TranslatePageProps) {
  // Ensure user is logged in
  const user = await getSessionUser();
  if (!user) {
    redirect(`/${params.lang}/auth/login?returnTo=/recipes/${params.id}/translate`);
  }
  
  // Get recipe data
  const recipe = await fetchRecipe(params.id);
  if (!recipe) {
    return notFound();
  }
  
  // Determine target language (use URL param or current UI language)
  const targetLocale = (searchParams.to as Locale) || params.lang;
  
  // Don't allow translating to the source language
  if (targetLocale === recipe.source_locale) {
    redirect(`/${params.lang}/recipes/${params.id}`);
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Translate Recipe from {recipe.source_locale.toUpperCase()} to {targetLocale.toUpperCase()}
      </h1>
      
      <TranslationForm 
        recipe={recipe}
        targetLocale={targetLocale}
      />
    </div>
  );
}
```

3. Create translation status dashboard:
```tsx
// src/app/[lang]/translations/page.tsx
import { redirect } from 'next/navigation';
import { Locale } from '@/middleware';
import { getUserTranslationRequests } from '@/services/recipes/translationRequestService';
import { LocalizedLink } from '@/components/i18n/LocalizedLink';
import { getSessionUser } from '@/services/auth/session';

interface TranslationsPageProps {
  params: {
    lang: Locale;
  }
}

export default async function TranslationsPage({ params }: TranslationsPageProps) {
  // Ensure user is logged in
  const user = await getSessionUser();
  if (!user) {
    redirect(`/${params.lang}/auth/login?returnTo=/translations`);
  }
  
  // Get user's translation requests and contributions
  const requests = await getUserTranslationRequests(user.id);
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Translation Dashboard</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Translation Requests</h2>
          {requests.length > 0 ? (
            <ul className="space-y-2">
              {requests.map(request => (
                <li key={request.id} className="p-4 border rounded">
                  <div className="flex justify-between">
                    <div>
                      <h3>{request.recipe_title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Requested: {new Date(request.requested_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="badge">{request.status}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No translation requests yet.</p>
          )}
        </div>
        
        {/* Similar sections for contributions, available translations, etc. */}
      </div>
    </div>
  );
}
```

### Validation Criteria

- Translation form shows side-by-side comparison
- Form validation works properly
- Submissions are stored correctly
- Translation dashboard shows accurate information
- User authentication is enforced for translation features

## Phase 7: Language Filtering and Navigation

**Objective**: Enhance navigation and filtering to support the multilingual recipe experience.

### Tasks

1. Update recipe search to handle multilingual content:
```tsx
// src/components/search/RecipeSearch.tsx
'use client'

import { useState } from 'react';
import { useTranslation } from '@/components/i18n/TranslationContext';
import { useSearch } from '@/state/hooks/useSearch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export function RecipeSearch() {
  const { locale } = useTranslation();
  const [query, setQuery] = useState('');
  const [searchLocale, setSearchLocale] = useState<'current' | 'all'>('current');
  
  const { search, results, isSearching } = useSearch();
  
  const handleSearch = () => {
    // Search in current language only or in all languages
    search(query, {
      locale: searchLocale === 'current' ? locale : undefined
    });
  };
  
  return (
    <div>
      <div className="flex gap-2">
        <Input 
          value={query} 
          onChange={e => setQuery(e.target.value)}
          placeholder="Search recipes..."
          className="flex-1"
        />
        
        <select 
          value={searchLocale}
          onChange={e => setSearchLocale(e.target.value as 'current' | 'all')}
          className="p-2 border rounded"
        >
          <option value="current">Current language</option>
          <option value="all">All languages</option>
        </select>
        
        <Button onClick={handleSearch} disabled={isSearching}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
      
      {/* Search results display */}
    </div>
  );
}
```

2. Add language filter to recipe listing page:
```tsx
// src/app/[lang]/recipes/page.tsx
'use client'

import { useState } from 'react';
import { useTranslation } from '@/components/i18n/TranslationContext';
import { Locale, locales } from '@/middleware';
import AllRecipes from '@/components/blocks/AllRecipes';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function RecipesPage() {
  const { locale, t } = useTranslation();
  const [filter, setFilter] = useState<'all' | Locale>(locale);
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('recipes.allRecipes')}</h1>
      
      <Tabs defaultValue={filter} onValueChange={(val) => setFilter(val as 'all' | Locale)}>
        <TabsList>
          <TabsTrigger value="all">{t('recipes.allLanguages')}</TabsTrigger>
          {locales.map(loc => (
            <TabsTrigger key={loc} value={loc}>
              {loc.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all">
          <AllRecipes filter={{ locale, onlyTranslated: false }} />
        </TabsContent>
        
        {locales.map(loc => (
          <TabsContent key={loc} value={loc}>
            <AllRecipes 
              filter={{ 
                locale, 
                sourceLocale: loc === locale ? loc : undefined,
                onlyTranslated: loc !== locale
              }} 
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
```

3. Create language-specific user preferences:
```tsx
// src/state/providers/PreferencesProvider.tsx
'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { Locale } from '@/middleware';

interface PreferencesContextType {
  // Existing preferences
  showOnlyCurrentLanguage: boolean;
  setShowOnlyCurrentLanguage: (value: boolean) => void;
}

export const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children, initialLocale }: { 
  children: React.ReactNode,
  initialLocale: Locale
}) {
  // Load preferences from local storage
  const [showOnlyCurrentLanguage, setShowOnlyCurrentLanguage] = useState(false);
  
  // Initialize preferences from local storage
  useEffect(() => {
    const storedValue = localStorage.getItem('recipe-language-filter');
    if (storedValue) {
      setShowOnlyCurrentLanguage(storedValue === 'true');
    }
  }, []);
  
  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('recipe-language-filter', showOnlyCurrentLanguage.toString());
  }, [showOnlyCurrentLanguage]);
  
  return (
    <PreferencesContext.Provider
      value={{
        // Existing preferences
        showOnlyCurrentLanguage,
        setShowOnlyCurrentLanguage,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}
```

### Validation Criteria

- Language filtering works correctly
- Search handles multilingual content properly
- User preferences are stored and applied
- Navigation maintains the correct language context
- UI clearly indicates the current filter state

## Phase 8: Testing and Optimization

**Objective**: Ensure the multilingual recipe system works correctly and performs well.

### Tasks

1. Create database function to bulk update existing recipes:
```sql
-- Update existing recipes to set source_locale
CREATE OR REPLACE FUNCTION update_existing_recipes_source_locale() RETURNS void AS $$
BEGIN
  -- Set default source locale to 'en' for all recipes without a source_locale
  UPDATE recipes SET source_locale = 'en' WHERE source_locale IS NULL;
  
  -- For each recipe, create a translation record in the source language if it doesn't exist
  INSERT INTO recipe_translations (recipe_id, locale, title, description, handle, status, completion_percentage)
  SELECT 
    r.id, 
    r.source_locale, 
    r.title, 
    r.description, 
    r.handle, 
    'complete', 
    100
  FROM recipes r
  WHERE NOT EXISTS (
    SELECT 1 FROM recipe_translations rt 
    WHERE rt.recipe_id = r.id AND rt.locale = r.source_locale
  );
END;
$$ LANGUAGE plpgsql;
```

2. Create language consistency test:
```typescript
// src/tests/multilingual.test.ts
import { fetchRecipes } from '@/services/recipes/recipeFetcher';
import { Locale, locales } from '@/middleware';

describe('Multilingual Recipe System', () => {
  test('Recipes are displayed in requested language when available', async () => {
    // For each locale, fetch recipes
    for (const locale of locales) {
      const recipes = await fetchRecipes(locale);
      
      // For each recipe that has a translation in this locale
      recipes.forEach(recipe => {
        const hasTranslation = recipe.translations?.some(t => t.locale === locale);
        
        if (hasTranslation) {
          // Ensure the recipe data is using the translated content
          const translation = recipe.translations?.find(t => t.locale === locale);
          expect(recipe.title).toBe(translation?.title);
          expect(recipe.description).toBe(translation?.description);
          expect(recipe.applied_locale).toBe(locale);
        }
      });
    }
  });
  
  test('Recipes fall back to source language when translation unavailable', async () => {
    const recipes = await fetchRecipes('fr');
    
    // Find recipes that don't have a French translation but have a source language
    const untranslatedRecipes = recipes.filter(recipe => 
      recipe.source_locale !== 'fr' && 
      !recipe.translations?.some(t => t.locale === 'fr')
    );
    
    untranslatedRecipes.forEach(recipe => {
      // Ensure they fall back to source language
      expect(recipe.applied_locale).toBe(recipe.source_locale);
    });
  });
});
```

3. Create performance optimization function:
```sql
-- Create index for better recipe filtering performance
CREATE INDEX idx_recipe_translations_compound 
  ON recipe_translations(recipe_id, locale, status);

-- Create materialized view for common recipe queries
CREATE MATERIALIZED VIEW recipe_language_summary AS
SELECT 
  r.id,
  r.source_locale,
  json_agg(DISTINCT rt.locale) AS available_locales
FROM recipes r
LEFT JOIN recipe_translations rt ON r.id = rt.recipe_id
WHERE rt.status = 'complete'
GROUP BY r.id;

-- Create function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_recipe_language_summary() RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY recipe_language_summary;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update the materialized view
CREATE TRIGGER update_recipe_language_summary
AFTER INSERT OR UPDATE OR DELETE ON recipe_translations
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_recipe_language_summary();
```

### Validation Criteria

- All tests pass
- Performance is acceptable under load
- Data migration for existing recipes works correctly
- Queries are optimized with proper indexes
- UI is responsive even with many recipes

## Integration Checklist

Before deploying to production, ensure:

1. **Database Schema**:
   - All tables and indexes are created
   - Migration scripts are tested on staging environment
   - Data migration for existing recipes is prepared

2. **UI Components**:
   - All new components follow design system
   - Components handle edge cases (missing translations, RTL languages)
   - Accessibility standards are met

3. **Translation Dictionary**:
   - All new UI strings are added to dictionaries
   - All supported languages have translations for new UI elements

4. **Performance**:
   - Database queries are optimized
   - Client-side filtering is minimized
   - Lazy loading is implemented for large recipe lists

5. **User Experience**:
   - Language indicators are clear but not intrusive
   - Translation workflow is intuitive
   - Fallback behaviors are predictable

6. **Documentation**:
   - Developer documentation is updated
   - User guides for translation contribution are created
   - API documentation reflects new endpoints and parameters

By following this implementation plan, we'll create a robust multilingual recipe system that maintains consistency with our existing architecture while providing a seamless experience for users across all supported languages.