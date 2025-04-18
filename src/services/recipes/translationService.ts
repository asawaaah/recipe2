'use server'

import { createClient } from '@supabase/supabase-js'
import { RecipeTranslation, RecipeTranslationInput } from './types'
import { Database } from '@/lib/supabase'
import { Locale } from '@/middleware'

// Initialize Supabase client
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Generate a URL-friendly handle from a title
 */
export async function generateHandle(title: string): Promise<string> {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/^-+|-+$/g, ''); // Trim hyphens from start and end
}

/**
 * Check if a handle already exists for a locale
 */
export async function isHandleUnique(handle: string, locale: string, excludeId?: string): Promise<boolean> {
  try {
    let query = supabase
      .from('recipe_translations')
      .select('id')
      .eq('locale', locale)
      .eq('handle', handle);
    
    // Exclude current translation if updating
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error checking handle uniqueness:', error);
      return false;
    }
    
    // Handle is unique if no results are found
    return data.length === 0;
  } catch (err) {
    console.error('Unexpected error checking handle uniqueness:', err);
    return false;
  }
}

/**
 * Ensure a handle is unique by adding a suffix if needed
 */
export async function ensureUniqueHandle(baseHandle: string, locale: string, excludeId?: string): Promise<string> {
  let handle = baseHandle;
  let counter = 0;
  let isUnique = await isHandleUnique(handle, locale, excludeId);
  
  // Add a numeric suffix until we find a unique handle
  while (!isUnique && counter < 100) {
    counter++;
    handle = `${baseHandle}-${counter}`;
    isUnique = await isHandleUnique(handle, locale, excludeId);
  }
  
  return handle;
}

/**
 * Fetch translations for a specific recipe
 */
export async function getRecipeTranslations(
  recipeId: string
): Promise<RecipeTranslation[]> {
  try {
    const { data, error } = await supabase
      .from('recipe_translations')
      .select('*')
      .eq('recipe_id', recipeId)

    if (error) {
      console.error('Error fetching recipe translations:', error)
      return []
    }

    return data as RecipeTranslation[]
  } catch (err) {
    console.error('Unexpected error fetching recipe translations:', err)
    return []
  }
}

/**
 * Fetch a specific translation for a recipe by locale
 */
export async function getRecipeTranslation(
  recipeId: string,
  locale: string
): Promise<RecipeTranslation | null> {
  try {
    const { data, error } = await supabase
      .from('recipe_translations')
      .select('*')
      .eq('recipe_id', recipeId)
      .eq('locale', locale)
      .single()

    if (error) {
      console.error('Error fetching recipe translation:', error)
      return null
    }

    return data as RecipeTranslation
  } catch (err) {
    console.error('Unexpected error fetching recipe translation:', err)
    return null
  }
}

/**
 * Find a recipe by its localized handle
 */
export async function findRecipeByLocalizedHandle(
  handle: string,
  locale: string
): Promise<RecipeTranslation | null> {
  try {
    const { data, error } = await supabase
      .from('recipe_translations')
      .select('*')
      .eq('handle', handle)
      .eq('locale', locale)
      .single()

    if (error) {
      console.error('Error finding recipe by localized handle:', error)
      return null
    }

    return data as RecipeTranslation
  } catch (err) {
    console.error('Unexpected error finding recipe by localized handle:', err)
    return null
  }
}

/**
 * Save a new translation for a recipe
 */
export async function createRecipeTranslation(
  translation: RecipeTranslationInput
): Promise<RecipeTranslation | null> {
  try {
    // Generate a handle from the title if not provided
    if (!translation.handle && translation.title) {
      const baseHandle = await generateHandle(translation.title);
      translation.handle = await ensureUniqueHandle(baseHandle, translation.locale);
    }
    
    const { data, error } = await supabase
      .from('recipe_translations')
      .insert(translation)
      .select()
      .single()

    if (error) {
      console.error('Error creating recipe translation:', error)
      return null
    }

    return data as RecipeTranslation
  } catch (err) {
    console.error('Unexpected error creating recipe translation:', err)
    return null
  }
}

/**
 * Update an existing translation
 */
export async function updateRecipeTranslation(
  id: string,
  translation: Partial<RecipeTranslationInput>
): Promise<RecipeTranslation | null> {
  try {
    // Update handle if title changed
    if (translation.title && !translation.handle) {
      // Get current translation to determine locale
      const { data: current } = await supabase
        .from('recipe_translations')
        .select('locale')
        .eq('id', id)
        .single();
      
      if (current) {
        const baseHandle = await generateHandle(translation.title);
        translation.handle = await ensureUniqueHandle(baseHandle, current.locale, id);
      }
    }
    
    const { data, error } = await supabase
      .from('recipe_translations')
      .update(translation)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating recipe translation:', error)
      return null
    }

    return data as RecipeTranslation
  } catch (err) {
    console.error('Unexpected error updating recipe translation:', err)
    return null
  }
}

/**
 * Delete a translation
 */
export async function deleteRecipeTranslation(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('recipe_translations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting recipe translation:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('Unexpected error deleting recipe translation:', err)
    return false
  }
}

/**
 * Get or create a translation for a recipe in the specified locale
 * If a translation exists, it will be returned
 * If not, a new one will be created with default values from the main recipe
 */
export async function getOrCreateTranslation(
  recipeId: string,
  locale: Locale
): Promise<RecipeTranslation | null> {
  // First try to get an existing translation
  const existingTranslation = await getRecipeTranslation(recipeId, locale)
  
  if (existingTranslation) {
    return existingTranslation
  }
  
  // If no translation exists, get the original recipe data
  const { data: recipe, error } = await supabase
    .from('recipes')
    .select('title, description, handle')
    .eq('id', recipeId)
    .single()
  
  if (error || !recipe) {
    console.error('Error fetching recipe for translation:', error)
    return null
  }
  
  // Generate a localized handle based on the title
  const baseHandle = await generateHandle(recipe.title);
  const handle = await ensureUniqueHandle(baseHandle, locale);
  
  // Create a new translation with the original recipe data and the new handle
  const newTranslation: RecipeTranslationInput = {
    recipe_id: recipeId,
    locale,
    title: recipe.title,
    description: recipe.description || '',
    handle
  }
  
  return createRecipeTranslation(newTranslation)
} 