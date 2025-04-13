import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import { RecipeMetadata } from './types'

export async function fetchRecipeMetadata(handle: string): Promise<Metadata> {
  const supabase = createServerComponentClient({ cookies })
  
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
} 