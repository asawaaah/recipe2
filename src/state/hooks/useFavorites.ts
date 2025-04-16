"use client"

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase'
import { usePreferences } from './usePreferences'
import { recipeKeys } from '../queries/recipes'

export function useFavorites() {
  const { favoriteRecipes, addFavorite, removeFavorite, isFavorite } = usePreferences()
  const supabase = createClient()
  
  // Get favorite recipes data from Supabase
  const {
    data: favoriteRecipesData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [recipeKeys.lists(), 'favorites', favoriteRecipes],
    queryFn: async () => {
      if (!favoriteRecipes.length) return []
      
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .in('id', favoriteRecipes)
        .order('created_at', { ascending: false })
        
      if (error) throw error
      return data
    },
    enabled: favoriteRecipes.length > 0,
  })
  
  // Toggle favorite status
  const toggleFavorite = (recipeId: string) => {
    if (isFavorite(recipeId)) {
      removeFavorite(recipeId)
    } else {
      addFavorite(recipeId)
    }
  }
  
  return {
    favoriteRecipes: favoriteRecipesData || [],
    favoriteRecipeIds: favoriteRecipes,
    isLoading,
    error,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    refetch
  }
} 