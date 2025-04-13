import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchRecipe } from '@/services/recipes/recipeFetcher'
import RecipeDetails from '@/components/blocks/RecipeDetails'
import { Badge } from '@/components/ui/badge'
import { Clock, Users } from 'lucide-react'
import Link from 'next/link'
import { SidebarLayout } from '@/components/layouts/SidebarLayout'

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

export default async function RecipePage({ params }: RecipePageProps) {
  const recipe = await fetchRecipe(params.handle)
  if (!recipe) notFound()

  const authorName = recipe.user?.username 
    ? `${recipe.user.username}`
    : 'Unknown Chef'

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Recipes', href: '/recipes' },
    { label: recipe.title, isCurrentPage: true }
  ]

  return (
    <SidebarLayout breadcrumbs={breadcrumbs}>
      <div className="container py-10">
        <h1 className="text-4xl font-bold mb-6">{recipe.title}</h1>
        <div className="flex gap-4 mb-6">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {recipe.cooking_time} minutes
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {recipe.servings} servings
          </Badge>
          <Badge variant="outline">
            By <Link href={`/chefs/${recipe.user?.username || 'unknown'}`} className="hover:underline ml-1">{authorName}</Link>
          </Badge>
        </div>
        <RecipeDetails recipe={recipe} />
      </div>
    </SidebarLayout>
  )
} 