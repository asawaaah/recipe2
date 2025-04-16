'use client'

import { useRecipes } from '@/state/hooks/useRecipes'
import { RecipeCard } from "@/components/blocks/RecipeCard"
import { RecipeCardSkeleton } from "@/components/blocks/RecipeCardSkeleton"
import { RecipeViewToggle } from "@/components/ui/recipe-view-toggle"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"

export default function AllRecipes() {
  // Fetch recipes using React Query
  const { data: recipes, isLoading, error } = useRecipes()
  
  // Use local state for view mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Try to get view mode from preferences
  useEffect(() => {
    try {
      // Dynamically import to avoid the error if PreferencesProvider is not available
      const { usePreferences } = require("@/state/hooks/usePreferences")
      const preferences = usePreferences()
      if (preferences && preferences.recipeViewMode) {
        setViewMode(preferences.recipeViewMode)
      }
    } catch (error) {
      // Fallback to grid view if preferences aren't available
    }
  }, [])
  
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">All Recipes</h1>
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
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load recipes. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">All Recipes ({recipes?.length || 0})</h1>
        <RecipeViewToggle />
      </div>
      
      {/* Recipe grid with responsive columns based on view mode */}
      <div className={`
        ${viewMode === 'grid' 
          ? 'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
          : 'flex flex-col gap-4'
        }
      `}>
        {recipes && recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.handle || recipe.id}
              title={recipe.title}
              description={recipe.description}
              cookingTime={recipe.cooking_time}
              servings={recipe.servings}
              imageUrl={recipe.image_url}
              className={viewMode === 'list' ? 'w-full' : ''}
              listView={viewMode === 'list'}
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No recipes found. Try adding some new recipes!
          </p>
        )}
      </div>
    </div>
  )
} 