import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Recipe } from '@/types/recipe'
import { Database } from '@/lib/supabase'
import { createClient as createServerClient } from '@supabase/supabase-js'

/**
 * Server component function to fetch recipe data
 * 
 * This uses direct Supabase queries since React Query hooks can only be used in client components
 */
export async function fetchRecipe(handle: string): Promise<Recipe | null> {
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
  } catch (err) {
    console.error('Unexpected error fetching recipe:', err)
    return null
  }
} 