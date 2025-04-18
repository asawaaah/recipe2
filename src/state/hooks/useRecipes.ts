"use client"

import { 
  useRecipes as useRecipesQuery, 
  useUserRecipes as useUserRecipesQuery, 
  useRecipe as useRecipeQuery,
  useRecipeByHandle as useRecipeByHandleQuery,
  useCreateRecipe,
  useDeleteRecipe,
  useUpdateRecipe
} from "../queries/recipes"

export function useRecipes(filters = {}) {
  return useRecipesQuery(filters)
}

export function useUserRecipes(userId: string | undefined, options: Record<string, any> = {}) {
  return useUserRecipesQuery(userId, options)
}

export function useRecipe(recipeId: string | undefined) {
  return useRecipeQuery(recipeId)
}

export function useRecipeByHandle(handle: string | undefined) {
  return useRecipeByHandleQuery(handle)
}

export const recipeHooks = {
  useRecipes,
  useUserRecipes,
  useRecipe,
  useRecipeByHandle,
  useCreateRecipe,
  useUpdateRecipe,
  useDeleteRecipe
} 