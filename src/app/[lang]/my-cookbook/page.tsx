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
import Link from "next/link"
import { RecipeTranslation } from "@/services/recipes/types"
import { use } from "react"

export default function MyCookbookPage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  // Unwrap params using React.use since it's a Promise in Next.js 15.3+
  const { lang } = use(params)
  
  const { profile } = useUser()
  const { recipeViewMode: viewMode } = usePreferences()
  
  // Get current language from context
  const locale = lang
  
  // Pass the locale to the useUserRecipes hook
  const { data: recipes, isLoading, error } = useUserRecipes(profile?.id, { locale })
  
  return (
    <SidebarLayout
      breadcrumbs={[
        { label: "Home", href: `/${lang}` },
        { label: "My Cookbook", isCurrentPage: true }
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Cookbook</h1>
          <Link href={`/${lang}/my-cookbook/create`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Recipe
            </Button>
          </Link>
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
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load your recipes. Please try again later.
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
                  <Link 
                    href={`/${lang}/my-cookbook/edit/${recipe.id}`} 
                    className="absolute top-2 right-2 z-10 bg-background/80 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <RecipeCard
                    id={recipe.handle || recipe.id}
                    title={recipe.title}
                    description={recipe.description}
                    cookingTime={recipe.cooking_time}
                    servings={recipe.servings}
                    imageUrl={recipe.image_url}
                    className={viewMode === 'list' ? 'w-full' : ''}
                    listView={viewMode === 'list'}
                    handle={recipe.handle || recipe.id}
                    translations={recipe.translations?.map((t: RecipeTranslation) => ({
                      locale: t.locale,
                      handle: t.handle
                    }))}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 space-y-6">
            <p className="text-muted-foreground">You haven't created any recipes yet.</p>
            <Link href={`/${lang}/my-cookbook/create`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Recipe
              </Button>
            </Link>
          </div>
        )}
      </div>
    </SidebarLayout>
  )
} 