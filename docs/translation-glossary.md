# Translation Glossary

This document provides definitions and preferred translations for common terms used throughout the Recipe application. Maintaining consistency in translations is important for a good user experience.

## Using This Glossary

1. When translating, refer to this glossary for standard translations of common terms
2. If a term is not in this glossary but appears frequently, consider adding it
3. If you're unsure about a translation, leave a comment in the PR or issue

## Cooking and Recipe Terms

| English Term | Description | Spanish (es) | French (fr) | German (de) |
|--------------|-------------|--------------|-------------|-------------|
| Recipe | A set of instructions for preparing a dish | Receta | Recette | Rezept |
| Ingredient | An item used in a recipe | Ingrediente | Ingrédient | Zutat |
| Instruction | Step in preparing a recipe | Instrucción | Instruction | Anleitung |
| Serving | Portion size | Porción | Portion | Portion |
| Cooking Time | Time needed to prepare the recipe | Tiempo de Cocción | Temps de Cuisson | Kochzeit |
| Chef | Person who creates recipes | Chef | Chef | Koch |

## Application Interface Terms

| English Term | Description | Spanish (es) | French (fr) | German (de) |
|--------------|-------------|--------------|-------------|-------------|
| Home | Main page | Inicio | Accueil | Startseite |
| All Recipes | Recipes listing page | Todas las Recetas | Toutes les Recettes | Alle Rezepte |
| My Cookbook | User's saved recipes | Mi Libro de Recetas | Mon Livre de Recettes | Mein Kochbuch |
| Login | Authentication action | Iniciar Sesión | Connexion | Anmelden |
| Sign Up | Registration action | Registrarse | S'inscrire | Registrieren |
| Create | Action to make something new | Crear | Créer | Erstellen |
| Edit | Action to modify | Editar | Modifier | Bearbeiten |
| Save | Action to store changes | Guardar | Sauvegarder | Speichern |
| Delete | Action to remove | Eliminar | Supprimer | Löschen |
| Cancel | Action to abort | Cancelar | Annuler | Abbrechen |

## Technical Terms

| English Term | Description | Spanish (es) | French (fr) | German (de) |
|--------------|-------------|--------------|-------------|-------------|
| Profile | User account page | Perfil | Profil | Profil |
| Settings | Configuration page | Configuración | Paramètres | Einstellungen |
| Upload | Action to send a file | Subir | Télécharger | Hochladen |
| Download | Action to receive a file | Descargar | Télécharger | Herunterladen |
| Search | Action to find content | Buscar | Rechercher | Suchen |
| Filter | Action to narrow results | Filtrar | Filtrer | Filtern |
| Sort | Action to arrange in order | Ordenar | Trier | Sortieren |
| Tag | Label for categorizing | Etiqueta | Tag | Schlagwort |

## Content Types

| English Term | Description | Spanish (es) | French (fr) | German (de) |
|--------------|-------------|--------------|-------------|-------------|
| Comment | User feedback on recipes | Comentario | Commentaire | Kommentar |
| Rating | Star-based evaluation | Valoración | Évaluation | Bewertung |
| Review | Detailed feedback | Reseña | Avis | Rezension |
| Image | Picture of recipe | Imagen | Image | Bild |
| Description | Text explaining recipe | Descripción | Description | Beschreibung |
| Title | Name of recipe | Título | Titre | Titel |

## Translation Guidelines

1. **Measurements**: Keep units in their original form (`g`, `kg`, `oz`, etc.)
2. **Food Items**: Translate with regional variations in mind
3. **Technical Terms**: For UI elements, prefer localized terms
4. **Brand Names**: Don't translate app name or proprietary features
5. **Plurals**: Be aware of plural forms, which vary by language

## Adding to the Glossary

To add a new term to this glossary:

1. Submit a PR with the new term added to the appropriate section
2. Include translations for all supported languages
3. Add a brief description of the term for context 

# Multilingual Recipe Workflow

This document outlines the comprehensive approach to handling multilingual recipe content in our application. It addresses specific challenges with content created in different languages and provides a consistent strategy for recipe display, language fallbacks, and translation workflows.

## Table of Contents

1. [Introduction](#introduction)
2. [Core Concepts](#core-concepts)
3. [Recipe Creation and Source Language](#recipe-creation-and-source-language)
4. [Recipe Display Strategy](#recipe-display-strategy)
5. [Translation Workflow](#translation-workflow)
6. [Language Fallback Strategy](#language-fallback-strategy)
7. [Database Schema Updates](#database-schema-updates)
8. [User Experience Considerations](#user-experience-considerations)
9. [Implementation Guide](#implementation-guide)
10. [Integration with Existing i18n System](#integration-with-existing-i18n-system)
11. [Common Scenarios and Solutions](#common-scenarios-and-solutions)
12. [Performance Considerations](#performance-considerations)

## Introduction

Our application serves a global audience who create and consume recipes in multiple languages. Unlike UI elements that are translated into all supported languages from the start, user-generated recipe content is created in a specific source language and may or may not have translations into other languages.

This document outlines our approach to handling:
- Recipes created in different source languages
- Displaying recipes appropriate to the user's chosen language
- Providing fallbacks when translations are not available
- Workflows for translating recipes
- Ensuring consistent navigation across languages

## Core Concepts

### Source Language

The **source language** is the original language in which a recipe was created. This is stored in the database as the primary recipe content and serves as the source of truth for any translations.

### Translated Content

**Translated content** refers to recipe data (title, description, ingredients, instructions, etc.) that has been manually translated from the source language into one or more target languages.

### Language Preference vs. Available Content

There is a distinction between:
- The user's **language preference** (the UI language they've selected)
- **Available translations** for a specific recipe

These may not always align, requiring a clear fallback strategy.

### Translation Status

Each recipe has a **translation status** for each supported language, which can be:
- **Complete**: Fully translated into this language
- **Partial**: Some elements translated, others in the source language
- **None**: No translation available for this language

## Recipe Creation and Source Language

### Creation Workflow

1. When a user creates a recipe, the current UI language is automatically set as the recipe's **source language**
2. All recipe data is stored in the primary `recipes` table, which does not have language-specific fields
3. A record is also created in the `recipe_translations` table for the source language
4. Recipe ingredients and instructions are always associated with the source language version

### Database Storage

The source language acts as the primary recipe data:

```sql
-- Creating a new recipe in Spanish (source language)
INSERT INTO recipes (title, description, handle, ...) 
VALUES ('Tortilla Española', 'Deliciosa tortilla tradicional...', 'tortilla-espanola', ...);

-- Creating the source language translation record
INSERT INTO recipe_translations (recipe_id, locale, title, description, handle)
VALUES (NEW.id, 'es', 'Tortilla Española', 'Deliciosa tortilla tradicional...', 'tortilla-espanola');
```

## Recipe Display Strategy

### Language Priority

When displaying recipes, we use the following priority order:

1. **Match**: Display the recipe in the user's preferred language if a translation exists
2. **Fallback**: Display the recipe in its source language if no translation exists in the user's language
3. **Indication**: Clearly indicate to the user when viewing content in a language other than their preference

### Recipe Filtering

Two different approaches are supported based on user preference:

#### 1. Show All Available Recipes (default)

By default, we show all recipes regardless of available translations, applying our fallback strategy when needed.

#### 2. Show Only Translated Recipes (optional preference)

Users can opt to see only recipes that have translations in their current language. This can be set in the user preferences.

```typescript
// Example: Language-based recipe filtering
const fetchLocalizedRecipes = async (locale: Locale, onlyTranslated: boolean = false) => {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      translations:recipe_translations(id, locale, title, description, handle)
    `)
    
  if (error) throw error
  
  // Filter recipes based on the onlyTranslated preference
  if (onlyTranslated) {
    // Return only recipes that have a translation in the user's locale
    return data.filter(recipe => 
      recipe.translations.some((t: any) => t.locale === locale)
    )
  } else {
    // Return all recipes, applying translation when available
    return data.map(recipe => {
      const translation = recipe.translations.find((t: any) => t.locale === locale)
      if (translation) {
        return {
          ...recipe,
          title: translation.title,
          description: translation.description,
          handle: translation.handle
        }
      }
      return recipe
    })
  }
}
```

### UI Indicators for Mixed-Language Content

When a recipe is displayed in a language different from the user's preference:

1. Show a badge or indicator near the recipe title
2. Provide a tooltip explaining that the recipe is in its original language
3. Offer a quick link to help translate the recipe (for registered users)

Example UI component:

```tsx
function LanguageIndicator({ sourceLanguage, currentLanguage }) {
  if (sourceLanguage !== currentLanguage) {
    return (
      <div className="language-indicator">
        <span className="badge">
          {sourceLanguage.toUpperCase()}
        </span>
        <Tooltip content={t('recipe.originalLanguageNotice')} />
      </div>
    )
  }
  return null
}
```

## Translation Workflow

### User-Driven Translation

Our approach relies on a collaborative translation model where:

1. Recipe authors can translate their own recipes into languages they know
2. Community members can contribute translations for recipes they appreciate 
3. Translations require approval (either by the original author or by moderators)

### Translation Interface

The translation interface allows:

1. Side-by-side view of source and target language content
2. Ability to translate specific sections independently:
   - Title and description
   - Ingredients
   - Instructions
   - Notes and tips
3. Machine translation suggestions to assist human translators
4. Translation memory to reuse common phrases and ingredients

### Translation Status

To encourage complete translations, each translation has a completion status:

```typescript
type TranslationStatus = 'complete' | 'partial' | 'machine-translated' | 'pending';

interface RecipeTranslation {
  // existing fields
  status: TranslationStatus;
  completion_percentage: number; // 0-100
  translated_sections: string[]; // Which sections are translated
  last_translated: string; // Timestamp
  translator_id: string; // User who created/updated the translation
}
```

### Recipe Ingredients and Instructions Translation

Unlike the basic recipe title and description, ingredients and instructions require more structured translation:

```sql
-- Schema additions for translated ingredients and instructions
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

## Language Fallback Strategy

### Handling Missing Translations

When a recipe is viewed in a language without a complete translation:

1. **Content Priority**: Display translated content where available, fall back to source language where not
2. **Metadata Fallback**: If metadata like title/description isn't translated, use source language with a clear indicator
3. **Related Content**: For related recipes, comments, etc., apply the same fallback logic independently

### Structured Fallback Chain

Our fallback chain for recipe content is:

1. Requested language (user's current UI language)
2. Source language of the recipe
3. English (if neither of the above)

```typescript
function getRecipeContent(recipe, requestedLocale) {
  // First try the requested locale
  const requestedTranslation = recipe.translations?.find(t => t.locale === requestedLocale)
  
  if (requestedTranslation) {
    return {
      title: requestedTranslation.title,
      description: requestedTranslation.description,
      // ...other fields
      appliedLocale: requestedLocale
    }
  }
  
  // Fall back to source language (stored in recipe_source_locale field)
  const sourceTranslation = recipe.translations?.find(t => t.locale === recipe.source_locale)
  
  if (sourceTranslation) {
    return {
      title: sourceTranslation.title,
      description: sourceTranslation.description,
      // ...other fields
      appliedLocale: recipe.source_locale
    }
  }
  
  // Last resort: use the recipe's original fields
  return {
    title: recipe.title,
    description: recipe.description,
    // ...other fields
    appliedLocale: 'unknown'
  }
}
```

## Database Schema Updates

To fully support our multilingual recipe workflow, we recommend these schema updates:

### 1. Add Source Language to Recipes Table

```sql
-- Add source language field to recipes table
ALTER TABLE recipes ADD COLUMN source_locale VARCHAR(10) NOT NULL DEFAULT 'en';

-- Create index for efficient filtering by source language
CREATE INDEX idx_recipes_source_locale ON recipes(source_locale);
```

### 2. Add Translation Status Fields

```sql
-- Add status fields to translation table
ALTER TABLE recipe_translations ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'complete';
ALTER TABLE recipe_translations ADD COLUMN completion_percentage INTEGER NOT NULL DEFAULT 100;
ALTER TABLE recipe_translations ADD COLUMN translator_id UUID REFERENCES users(id);
ALTER TABLE recipe_translations ADD COLUMN last_translated TIMESTAMP WITH TIME ZONE DEFAULT NOW();
```

### 3. Create Translation Request Table

```sql
-- Create table to track translation requests
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

-- Index for efficient querying
CREATE INDEX idx_translation_requests_recipe_locale 
  ON translation_requests(recipe_id, requested_locale);
```

## User Experience Considerations

### Language Switching with Recipes

When a user switches languages while viewing a recipe:

1. Attempt to load the recipe in the new language
2. If translation exists, display the translated version
3. If no translation exists, display the source language version with a clear notification
4. Maintain the same recipe, just in a different language (don't navigate away)

### Recipes List Filtering

In recipe listings:

1. Default to showing all recipes regardless of language
2. Provide a clear UI filter to "Show only recipes in [current language]"
3. When filtering by language, only include recipes with either:
   - Original content in the current language
   - A complete translation in the current language

### Translation Contribution UI

Make translation contribution intuitive:

1. Show "Help translate this recipe" buttons on recipes without translations
2. Provide a translation dashboard for users to see what recipes need translation
3. Gamify translation with badges or recognition for active translators

## Implementation Guide

### Recipe Detail Page Updates

1. Update detail page to handle source language fallback:

```tsx
function RecipeDetailPage({ params }) {
  const { lang, handle } = params;
  const recipe = await fetchRecipeByHandle(handle, lang);
  
  if (!recipe) return notFound();
  
  // Determine if we're showing a translation or original
  const isTranslation = recipe.source_locale !== lang;
  const displayedLocale = recipe.applied_locale || recipe.source_locale;
  
  return (
    <div>
      {isTranslation ? (
        <TranslationBadge 
          sourceLocale={recipe.source_locale} 
          displayedLocale={displayedLocale} 
        />
      ) : null}
      
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
      
      {/* ... recipe content ... */}
      
      {/* Show translation options if user is signed in */}
      <TranslationOptions 
        recipe={recipe} 
        currentLocale={lang}
      />
    </div>
  );
}
```

### Recipe Card Updates

Update recipe cards to show language indicators:

```tsx
function RecipeCard({ recipe, currentLocale }) {
  const recipeLocale = getDisplayedLocale(recipe, currentLocale);
  const needsTranslation = recipeLocale !== currentLocale;
  
  return (
    <div className="recipe-card">
      {needsTranslation && (
        <div className="translation-badge">
          {recipeLocale.toUpperCase()}
        </div>
      )}
      
      <h3>{recipe.title}</h3>
      <p>{recipe.description}</p>
      
      {/* ... other card content ... */}
    </div>
  );
}
```

### Recipe Fetching Service

Enhance our recipe fetching service with language handling:

```typescript
export async function fetchRecipes({ 
  locale, 
  onlyTranslated = false,
  sourceLocale = null 
}) {
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
    // Find translation in requested locale
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
    
    // Fall back to source language
    return {
      ...recipe,
      applied_locale: recipe.source_locale
    };
  });
}
```

## Integration with Existing i18n System

Our existing i18n system (documented in `languageWorkflow.md`) focuses on UI element translation. The multilingual recipe workflow builds on this foundation but addresses the specific needs of user-generated content.

Key integration points:

1. **URL Structure**: Maintain the `/{locale}/recipes/...` URL structure
2. **Language Detection**: Use the same language detection strategy from URL paths
3. **Translation Hooks**: Extend existing translation hooks to handle recipe content
4. **Fallback Strategy**: Implement recipe-specific fallbacks while using UI fallbacks from the main system

## Common Scenarios and Solutions

### Scenario 1: User creates a recipe in Spanish

1. A Spanish-speaking user creates a recipe while using the Spanish UI
2. The recipe is stored with `source_locale = 'es'`
3. A record in the `recipe_translations` table is created with `locale = 'es'`
4. English users browsing all recipes can see this recipe with a Spanish language indicator
5. English users who filter for English-only content will not see this recipe

### Scenario 2: Translating to a new language

1. A user viewing a recipe not in their language clicks "Help translate"
2. They're presented with a side-by-side translation interface
3. They translate the recipe content and submit
4. A moderator or the original author approves the translation
5. The recipe is now available in the new language

### Scenario 3: Language switching with partial translations

1. A user views a recipe in English that was translated from Spanish
2. The user switches to French where no translation exists
3. The system falls back to showing the recipe in Spanish (the source language)
4. A clear notification indicates the recipe is displayed in its original language

### Scenario 4: Searching across languages

1. A user searches for "chocolate cake" in English
2. The search returns:
   - English recipes with "chocolate cake" in the title/description
   - Translated recipes from other languages matching the term
   - Original recipes in other languages are not included unless they have an English translation
3. Results are clearly marked with their language

## Performance Considerations

### Query Optimization

To maintain performance:

1. Use appropriate indexes for recipe_translations queries
2. Cache frequently accessed recipes with their translations
3. Use JOIN operations strategically to minimize database round-trips

### Pagination with Language Filtering

When implementing paginated results with language filtering:

1. Apply language filters directly in the database query, not in application code
2. Use a consistent ordering to avoid skipping or duplicating recipes across pages
3. Consider offset-based pagination for language-filtered queries

Example optimized query:

```sql
-- Efficient query for paginated, language-filtered recipes
SELECT r.*, 
  json_agg(rt.*) as translations,
  EXISTS(
    SELECT 1 FROM recipe_translations 
    WHERE recipe_id = r.id AND locale = :locale
  ) as has_translation
FROM recipes r
LEFT JOIN recipe_translations rt ON r.id = rt.recipe_id
GROUP BY r.id
HAVING r.source_locale = :locale OR EXISTS(
  SELECT 1 FROM recipe_translations 
  WHERE recipe_id = r.id AND locale = :locale
)
ORDER BY r.created_at DESC
LIMIT :limit OFFSET :offset;
```

---

By implementing this comprehensive multilingual recipe workflow, we provide a seamless experience for users creating and consuming recipes in any of our supported languages while maintaining high performance and a quality user experience. 