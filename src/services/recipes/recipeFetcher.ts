import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Recipe } from '@/types/recipe'

export async function fetchRecipe(handle: string): Promise<Recipe | null> {
  const supabase = createServerComponentClient({ cookies })
  
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
      )
    `)
    .eq('handle', handle)
    .single()

  if (error) {
    console.error('Fetch error:', error)
    return null
  }

  // Transform the data to match our Recipe type
  const recipe = {
    ...data,
    user: data.user || null
  }

  return recipe as Recipe
} 