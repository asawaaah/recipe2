import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import RecipeDetails from '@/components/blocks/RecipeDetails'

// This enables dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const supabase = createServerComponentClient({ cookies })
  
  console.log('Attempting to fetch recipe for metadata with handle:', params.handle)
  const { data: recipe, error: metadataError } = await supabase
    .from('recipes')
    .select('title, description')
    .eq('handle', params.handle)
    .single()

  if (metadataError) {
    console.error('Error fetching recipe metadata:', metadataError)
  }

  console.log('Metadata fetch result:', recipe)

  if (!recipe) {
    return {
      title: 'Recipe Not Found',
      description: 'The requested recipe could not be found.'
    }
  }

  return {
    title: `${recipe.title} - Recipe Details`,
    description: recipe.description
  }
}

export default async function RecipeDetailsPage({ params }: { params: { handle: string } }) {
  const supabase = createServerComponentClient({ cookies })

  // Simple query to check if the recipe exists
  const { data: recipe, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('handle', params.handle)
    .single()

  if (error) {
    console.error('Database error:', error.message)
    console.error('Error details:', error)
    return <div>Error loading recipe: {error.message}</div>
  }

  if (!recipe) {
    console.log('No recipe found with handle:', params.handle)
    return <div>
      <h1>Debug Info</h1>
      <pre>
        Searching for handle: {params.handle}
        Recipe data: {JSON.stringify(recipe, null, 2)}
      </pre>
    </div>
  }

  return (
    <div>
      <h1>Recipe Found!</h1>
      <pre>{JSON.stringify(recipe, null, 2)}</pre>
    </div>
  )
} 