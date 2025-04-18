import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Recipe } from '@/types/recipe'
import { Database } from '@/lib/supabase'
import { createClient as createServerClient } from '@supabase/supabase-js'
import { Locale } from '@/middleware'
import { findRecipeByLocalizedHandle } from './translationService'
import { RecipeTranslation } from './types'

/**
 * Find a recipe by its handle, first checking for localized handles
 * 
 * @param handle The URL handle to look up
 * @param locale The current locale
 * @returns The recipe if found, null otherwise
 */
export async function fetchRecipeByHandle(handle: string, locale?: Locale): Promise<Recipe | null> {
  // If we have a locale, first check for a localized handle
  if (locale) {
    // Try to find a translation with this handle and locale
    const translation = await findRecipeByLocalizedHandle(handle, locale);
    
    if (translation) {
      // Use the recipe_id from the translation to fetch the full recipe
      return fetchRecipe(translation.recipe_id, locale);
    }
  }
  
  // Fall back to the default handle lookup
  try {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        ingredients (*),
        instructions (*),
        user:users!recipes_user_id_fkey (
          id,
          username,
          firstname,
          lastname
        ),
        translations:recipe_translations (*)
      `)
      .eq('handle', handle)
      .single()

    if (error) {
      console.error('Recipe not found by handle:', error)
      return null
    }

    // Transform the data to match our Recipe type
    let recipe = {
      ...data,
      user: data.user || null
    }
    
    // If locale is provided, use translated content if available
    if (locale && data.translations && Array.isArray(data.translations)) {
      const translation = data.translations.find((t: any) => t.locale === locale)
      
      if (translation) {
        recipe = {
          ...recipe,
          title: translation.title,
          description: translation.description
        }
      }
    }

    return recipe as Recipe
  } catch (err) {
    console.error('Unexpected error fetching recipe by handle:', err)
    return null
  }
}

/**
 * Server component function to fetch recipe data
 * 
 * This uses direct Supabase queries since React Query hooks can only be used in client components
 */
export async function fetchRecipe(recipeId: string, locale?: Locale): Promise<Recipe | null> {
  try {
    // Use server-side client without cookies to avoid auth issues
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        ingredients (*),
        instructions (*),
        user:users!recipes_user_id_fkey (
          id,
          username,
          firstname,
          lastname
        ),
        translations:recipe_translations (*)
      `)
      .eq('id', recipeId)
      .single()

    if (error) {
      console.error('Fetch error:', error)
      return null
    }

    // Transform the data to match our Recipe type
    let recipe = {
      ...data,
      user: data.user || null
    }
    
    // If locale is provided, use translated content if available
    if (locale && data.translations && Array.isArray(data.translations)) {
      const translation = data.translations.find((t: any) => t.locale === locale)
      
      if (translation) {
        recipe = {
          ...recipe,
          title: translation.title,
          description: translation.description
        }
      }
    }

    return recipe as Recipe
  } catch (err) {
    console.error('Unexpected error fetching recipe:', err)
    return null
  }
}

/**
 * Fetch multiple recipes with their translations
 */
export async function fetchRecipes(locale?: Locale): Promise<Recipe[]> {
  try {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        user:users!recipes_user_id_fkey (
          id,
          username,
          firstname,
          lastname
        ),
        translations:recipe_translations (*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Fetch error:', error)
      return []
    }
    
    // Process each recipe to include translations if available
    const recipes = data.map(recipe => {
      let result = {
        ...recipe,
        user: recipe.user || null
      }
      
      // If locale is provided, use translated content if available
      if (locale && recipe.translations && Array.isArray(recipe.translations)) {
        const translation = recipe.translations.find((t: any) => t.locale === locale)
        
        if (translation) {
          result = {
            ...result,
            title: translation.title,
            description: translation.description,
            handle: translation.handle
          }
        }
      }
      
      return result
    })
    
    return recipes as Recipe[]
  } catch (err) {
    console.error('Unexpected error fetching recipes:', err)
    return []
  }
} 