import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchRecipe } from '@/services/recipes/recipeFetcher'
import { SidebarLayout } from '@/components/layouts/SidebarLayout'
import RecipeDetailView from '@/components/blocks/RecipeDetailView'

interface RecipePageProps {
  params: {
    handle: string
  }
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const recipe = await fetchRecipe(params.handle)
  if (!recipe) return {}

  const authorName = recipe.user?.username 
    ? `${recipe.user.username}`
    : 'Unknown Chef'

  return {
    title: `${recipe.title} by ${authorName}`,
    description: recipe.description,
  }
}

export default function RecipePage({ params }: RecipePageProps) {
  return (
    <SidebarLayout
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Recipes', href: '/recipes' },
        { label: 'Details', isCurrentPage: true }
      ]}
    >
      <RecipeDetailView handle={params.handle} />
    </SidebarLayout>
  )
} 