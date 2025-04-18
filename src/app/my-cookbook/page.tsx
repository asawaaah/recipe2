'use client'

import { SidebarLayout } from "@/components/layouts/SidebarLayout"
import { useUser } from "@/state/hooks/useUser"
import { useUserRecipes } from "@/state/hooks/useRecipes"
import { RecipeCard } from "@/components/blocks/RecipeCard"
import { RecipeCardSkeleton } from "@/components/blocks/RecipeCardSkeleton"
import { RecipeViewToggle } from "@/components/ui/recipe-view-toggle"
import { Button } from "@/components/ui/button"
import { Plus, Edit } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { usePreferences } from "@/state/hooks/usePreferences"
import { useTranslation } from "@/components/i18n/TranslationContext"
import { LocalizedLink } from "@/components/i18n/LocalizedLink"

export default function MyCookbookPage() {
  const { profile } = useUser()
  const { data: recipes, isLoading, error } = useUserRecipes(profile?.id)
  const { recipeViewMode: viewMode } = usePreferences()
  const { t } = useTranslation()
  
  return (
    <SidebarLayout
      breadcrumbs={[
        { label: t('common.home'), href: "/" },
        { label: t('common.myCookbook'), isCurrentPage: true }
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('common.myCookbook')}</h1>
          <LocalizedLink href="/my-cookbook/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('common.create')}
            </Button>
          </LocalizedLink>
        </div>
        
        {isLoading ? (
          <>
            <div className="flex justify-end">
              <RecipeViewToggle />
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <RecipeCardSkeleton key={i} />
              ))}
            </div>
          </>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('errors.general')}</AlertTitle>
            <AlertDescription>
              {t('errors.loadingFailed')}
            </AlertDescription>
          </Alert>
        ) : recipes?.length ? (
          <>
            <div className="flex justify-end">
              <RecipeViewToggle />
            </div>
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4' 
                : 'flex flex-col gap-2'
              }
            `}>
              {recipes.map((recipe) => (
                <div key={recipe.id} className="relative group">
                  <LocalizedLink 
                    href={`/my-cookbook/edit/${recipe.id}`} 
                    className="absolute top-2 right-2 z-10 bg-background/80 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-4 w-4" />
                  </LocalizedLink>
                  <RecipeCard
                    id={recipe.id}
                    title={recipe.title}
                    description={recipe.description}
                    cookingTime={recipe.cooking_time}
                    servings={recipe.servings}
                    imageUrl={recipe.image_url}
                    className={viewMode === 'list' ? 'w-full' : ''}
                    listView={viewMode === 'list'}
                    handle={recipe.handle || recipe.id}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 space-y-6">
            <p className="text-muted-foreground">{t('recipe.emptyRecipes')}</p>
            <LocalizedLink href="/my-cookbook/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('recipe.createFirstRecipe')}
              </Button>
            </LocalizedLink>
          </div>
        )}
      </div>
    </SidebarLayout>
  )
}
