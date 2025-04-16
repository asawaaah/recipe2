"use client"

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase'
import { recipeKeys } from '../queries/recipes'
import { toast } from 'sonner'
import { usePreferences } from './usePreferences'

export type CreateRecipeData = {
  title: string
  description: string
  handle: string
  user_id?: string
  image_url?: string
  cooking_time?: number
  servings?: number
  ingredients?: { name: string; amount: number | string; unit: string }[]
  instructions?: { step_number: number; description: string }[]
  tags?: string[]
}

export type UpdateRecipeData = Partial<CreateRecipeData> & { id: string }

export function useRecipeActions() {
  const queryClient = useQueryClient()
  const supabase = createClient()
  const { addFavorite, removeFavorite } = usePreferences()
  
  // Create Recipe
  const createRecipeMutation = useMutation({
    mutationFn: async (newRecipe: CreateRecipeData) => {
      // Get current user if user_id not provided
      if (!newRecipe.user_id) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('You must be logged in to create a recipe')
        newRecipe.user_id = user.id
      }
      
      // Insert recipe basic info
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          title: newRecipe.title,
          description: newRecipe.description,
          handle: newRecipe.handle,
          user_id: newRecipe.user_id,
          image_url: newRecipe.image_url,
          cooking_time: newRecipe.cooking_time,
          servings: newRecipe.servings,
        })
        .select()
        .single()
        
      if (recipeError) throw recipeError
      const recipeId = recipeData.id
      
      // Insert ingredients if provided
      if (newRecipe.ingredients && newRecipe.ingredients.length > 0) {
        const { error: ingredientsError } = await supabase
          .from('ingredients')
          .insert(
            newRecipe.ingredients.map(ingredient => ({
              ...ingredient,
              recipe_id: recipeId,
              amount: typeof ingredient.amount === 'string' ? parseFloat(ingredient.amount) || 0 : ingredient.amount
            }))
          )
          
        if (ingredientsError) throw ingredientsError
      }
      
      // Insert instructions if provided
      if (newRecipe.instructions && newRecipe.instructions.length > 0) {
        const { error: instructionsError } = await supabase
          .from('instructions')
          .insert(
            newRecipe.instructions.map(instruction => ({
              ...instruction,
              recipe_id: recipeId,
            }))
          )
          
        if (instructionsError) throw instructionsError
      }
      
      // Insert tags if provided
      if (newRecipe.tags && newRecipe.tags.length > 0) {
        for (const tagName of newRecipe.tags) {
          // Check if tag exists
          const { data: existingTag } = await supabase
            .from('tags')
            .select('id')
            .eq('name', tagName)
            .single()
            
          let tagId = existingTag?.id
          
          // Create tag if it doesn't exist
          if (!tagId) {
            const { data: newTag, error: tagError } = await supabase
              .from('tags')
              .insert({ name: tagName })
              .select()
              .single()
              
            if (tagError) throw tagError
            tagId = newTag.id
          }
          
          // Add tag to recipe
          const { error: relationError } = await supabase
            .from('recipe_tags')
            .insert({
              recipe_id: recipeId,
              tag_id: tagId,
            })
            
          if (relationError) throw relationError
        }
      }
      
      return recipeData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
      toast.success('Recipe created successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create recipe: ${error.message}`)
    }
  })
  
  // Update Recipe
  const updateRecipeMutation = useMutation({
    mutationFn: async ({ id, ...recipe }: UpdateRecipeData) => {
      // Update recipe basic info
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .update({
          ...(recipe.title && { title: recipe.title }),
          ...(recipe.description && { description: recipe.description }),
          ...(recipe.handle && { handle: recipe.handle }),
          ...(recipe.image_url && { image_url: recipe.image_url }),
          ...(recipe.cooking_time && { cooking_time: recipe.cooking_time }),
          ...(recipe.servings && { servings: recipe.servings }),
        })
        .eq('id', id)
        .select()
        .single()
        
      if (recipeError) throw recipeError
      
      // Update ingredients if provided
      if (recipe.ingredients) {
        // Delete existing ingredients
        const { error: deleteIngredientsError } = await supabase
          .from('ingredients')
          .delete()
          .eq('recipe_id', id)
          
        if (deleteIngredientsError) throw deleteIngredientsError
        
        // Insert new ingredients
        if (recipe.ingredients.length > 0) {
          // Filter out temporary IDs and prepare ingredients for insertion
          const preparedIngredients = recipe.ingredients.map(ingredient => {
            // Extract needed fields, excluding id and created_at/updated_at
            const { name, amount, unit } = ingredient;
            return {
              recipe_id: id,
              name,
              amount: typeof amount === 'string' ? parseFloat(amount) || 0 : amount,
              unit
            };
          });

          const { error: ingredientsError } = await supabase
            .from('ingredients')
            .insert(preparedIngredients)
            
          if (ingredientsError) throw ingredientsError
        }
      }
      
      // Update instructions if provided
      if (recipe.instructions) {
        // Delete existing instructions
        const { error: deleteInstructionsError } = await supabase
          .from('instructions')
          .delete()
          .eq('recipe_id', id)
          
        if (deleteInstructionsError) throw deleteInstructionsError
        
        // Insert new instructions
        if (recipe.instructions.length > 0) {
          // Filter out temporary IDs and prepare instructions for insertion
          const preparedInstructions = recipe.instructions.map(instruction => {
            // Extract needed fields, excluding id and created_at/updated_at
            const { step_number, description } = instruction;
            return {
              recipe_id: id,
              step_number,
              description
            };
          });

          const { error: instructionsError } = await supabase
            .from('instructions')
            .insert(preparedInstructions)
            
          if (instructionsError) throw instructionsError
        }
      }
      
      return recipeData
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(data.id) })
      toast.success('Recipe updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update recipe: ${error.message}`)
    }
  })
  
  // Delete Recipe
  const deleteRecipeMutation = useMutation({
    mutationFn: async (recipeId: string) => {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId)
        
      if (error) throw error
      return recipeId
    },
    onSuccess: (recipeId) => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(recipeId) })
      toast.success('Recipe deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete recipe: ${error.message}`)
    }
  })
  
  // Toggle favorite
  const toggleFavorite = (recipeId: string, isFavorite: boolean) => {
    try {
      if (isFavorite) {
        removeFavorite(recipeId)
        toast.success('Removed from favorites')
      } else {
        addFavorite(recipeId)
        toast.success('Added to favorites')
      }
    } catch (error) {
      toast.error('Failed to update favorites')
    }
  }
  
  return {
    createRecipe: createRecipeMutation.mutate,
    isCreating: createRecipeMutation.isPending,
    createRecipeError: createRecipeMutation.error,
    
    updateRecipe: updateRecipeMutation.mutate,
    isUpdating: updateRecipeMutation.isPending,
    updateRecipeError: updateRecipeMutation.error,
    
    deleteRecipe: deleteRecipeMutation.mutate,
    isDeleting: deleteRecipeMutation.isPending,
    deleteRecipeError: deleteRecipeMutation.error,
    
    toggleFavorite,
  }
} 