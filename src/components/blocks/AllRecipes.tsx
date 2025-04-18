'use client'

import { useRecipes } from '@/state/hooks/useRecipes'
import { RecipeCard } from "@/components/blocks/RecipeCard"
import { RecipeCardSkeleton } from "@/components/blocks/RecipeCardSkeleton"
import { RecipeViewToggle } from "@/components/ui/recipe-view-toggle"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { usePreferences } from "@/state/hooks/usePreferences"
import { RecipeTranslation } from '@/services/recipes/types'
import { useTranslation } from '@/components/i18n/TranslationContext'

export default function AllRecipes() {
  // Get translations from standard hook
  const { t, locale: currentLang } = useTranslation()
  
  // Fetch recipes using React Query with locale filter
  const { data: recipes, isLoading, error } = useRecipes({ locale: currentLang })
  
  // Get view mode from preferences
  const { recipeViewMode: viewMode } = usePreferences()
  
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">{t('common.allRecipes')}</h1>
          <RecipeViewToggle />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }
  
  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t('errors.general')}</AlertTitle>
        <AlertDescription>
          {t('errors.loadingFailed')}
        </AlertDescription>
      </Alert>
    )
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">{t('common.allRecipes')} ({recipes?.length || 0})</h1>
        <RecipeViewToggle />
      </div>
      
      {/* Recipe grid with responsive columns based on view mode */}
      <div className={`
        ${viewMode === 'grid' 
          ? 'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
          : 'flex flex-col gap-2'
        }
      `}>
        {recipes && recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              description={recipe.description}
              cookingTime={recipe.cooking_time}
              servings={recipe.servings}
              imageUrl={recipe.image_url}
              className={viewMode === 'list' ? 'w-full' : ''}
              listView={viewMode === 'list'}
              handle={recipe.handle}
              translations={recipe.translations?.map((t: RecipeTranslation) => ({
                locale: t.locale,
                handle: t.handle
              }))}
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8">
            {t('recipe.emptyRecipes')}
          </p>
        )}
      </div>
    </div>
  )
} 