import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import { RecipeMetadata } from './types'
import { Database } from '@/lib/supabase'
import { createClient as createServerClient } from '@supabase/supabase-js'

/**
 * Fetches metadata for a recipe by handle for use in generateMetadata
 * 
 * Note: This uses direct Supabase calls instead of React Query hooks
 * because it's a server component function (React Query hooks can only 
 * be used in client components)
 */
export async function fetchRecipeMetadata(handle: string): Promise<Metadata> {
  try {
    // Use server-side client without cookies to avoid auth issues
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Fetch the recipe with user data
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .select(`
        *,
        user:users (
          username,
          firstname,
          lastname
        )
      `)
      .eq('handle', handle)
      .single()

    if (recipeError || !recipe) {
      console.error('Error fetching recipe:', recipeError)
      return {
        title: 'Recipe Not Found',
        description: 'The requested recipe could not be found.',
        openGraph: {
          title: 'Recipe Not Found',
          description: 'The requested recipe could not be found.'
        }
      }
    }

    // Create author display name
    const authorName = recipe.user?.firstname && recipe.user?.lastname
      ? `${recipe.user.firstname} ${recipe.user.lastname}`
      : recipe.user?.username || 'Unknown Chef'

    const title = `${recipe.title} by ${authorName} - Recipe Details`

    return {
      title,
      description: recipe.description,
      openGraph: {
        title,
        description: recipe.description,
        images: recipe.image_url ? [{ url: recipe.image_url }] : undefined
      }
    }
  } catch (err) {
    console.error('Unexpected error fetching recipe metadata:', err)
    return {
      title: 'Error Loading Recipe',
      description: 'There was an error loading the recipe details.'
    }
  }
} 