'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Clock, Users } from 'lucide-react'
import { LocalizedLink } from '@/components/i18n/LocalizedLink'
import RecipeDetails from '@/components/blocks/RecipeDetails'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { useRecipeByHandle } from '@/state/hooks/useRecipes'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/components/i18n/TranslationContext'
import { Recipe } from '@/services/recipes/types'

interface RecipeDetailViewProps {
  handle: string
}

export default function RecipeDetailView({ handle }: RecipeDetailViewProps) {
  const router = useRouter()
  const { data: recipe, isLoading, error, refetch } = useRecipeByHandle(handle)
  const [retryCount, setRetryCount] = useState(0)
  const { t, locale } = useTranslation()
  
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
      <div className="container py-10" aria-busy="true" aria-label={t('common.loading')}>
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
      <Alert variant="destructive" className="m-4" role="alert">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t('errors.general')}</AlertTitle>
        <AlertDescription className="space-y-4">
          {isPGRSTError ? (
            <>Recipe not found. The recipe with handle "{handle}" does not exist.</>
          ) : (
            <>
              {errorMessage}. {t('errors.loadingFailed')}
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
              {t('common.retry')}
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
  
  // Get the current translation if available
  const currentTranslation = recipe.translations?.find(
    (t: {locale: string}) => t.locale === locale
  );
  
  // Use translated content if available, otherwise use default
  const title = currentTranslation?.title || recipe.title;
  const description = currentTranslation?.description || recipe.description;
  
  const authorName = recipe.user?.username 
    ? `${recipe.user.username}`
    : t('recipe.unknownChef')
  
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">{title}</h1>
      {description && (
        <p className="text-lg mb-6 text-muted-foreground">{description}</p>
      )}
      <div className="flex flex-wrap gap-4 mb-6">
        {recipe.cooking_time && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-4 h-4" aria-hidden="true" />
            <span>{recipe.cooking_time} {t('recipe.minutes')}</span>
          </Badge>
        )}
        {recipe.servings && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="w-4 h-4" aria-hidden="true" />
            <span>{recipe.servings} {t('recipe.servings')}</span>
          </Badge>
        )}
        <Badge variant="outline">
          <span>{t('recipe.authoredBy')}</span> <LocalizedLink href={`/users/${recipe.user?.username || 'unknown'}`} className="hover:underline ml-1">{authorName}</LocalizedLink>
        </Badge>
      </div>
      <RecipeDetails recipe={{...recipe, title, description}} />
    </div>
  )
} 