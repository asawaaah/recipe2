'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Clock, Users } from 'lucide-react'
import Link from 'next/link'
import RecipeDetails from '@/components/blocks/RecipeDetails'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { useRecipeByHandle } from '@/state/hooks/useRecipes'
import { Button } from '@/components/ui/button'

interface RecipeDetailViewProps {
  handle: string
}

export default function RecipeDetailView({ handle }: RecipeDetailViewProps) {
  const router = useRouter()
  const { data: recipe, isLoading, error, refetch } = useRecipeByHandle(handle)
  const [retryCount, setRetryCount] = useState(0)
  
  // Redirect to not found page if recipe doesn't exist
  useEffect(() => {
    if (!isLoading && !recipe && !error) {
      router.push('/not-found')
    }
  }, [recipe, isLoading, router, error])
  
  // Handle retry
  const handleRetry = () => {
    setRetryCount(count => count + 1)
    refetch()
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container py-10">
        <Skeleton className="h-10 w-2/3 mb-6" />
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-2">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Error state
  if (error) {
    const errorMessage = error instanceof Error 
      ? error.message
      : 'Failed to load recipe details'
    
    const isPGRSTError = errorMessage.includes('PGRST116') || 
                          errorMessage.includes('The result contains 0 rows')
    
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="space-y-4">
          {isPGRSTError ? (
            <>Recipe not found. The recipe with handle "{handle}" does not exist.</>
          ) : (
            <>
              {errorMessage}. Please try again later.
            </>
          )}
          <div className="pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleRetry}
            >
              <RefreshCcw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }
  
  // No recipe yet - still loading or redirecting
  if (!recipe) {
    return null
  }
  
  const authorName = recipe.user?.username 
    ? `${recipe.user.username}`
    : 'Unknown Chef'
  
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">{recipe.title}</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        {recipe.cooking_time && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {recipe.cooking_time} minutes
          </Badge>
        )}
        {recipe.servings && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {recipe.servings} servings
          </Badge>
        )}
        <Badge variant="outline">
          By <Link href={`/users/${recipe.user?.username || 'unknown'}`} className="hover:underline ml-1">{authorName}</Link>
        </Badge>
      </div>
      <RecipeDetails recipe={recipe} />
    </div>
  )
} 