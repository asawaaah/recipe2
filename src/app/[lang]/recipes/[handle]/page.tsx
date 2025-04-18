import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchRecipeByHandle } from '@/services/recipes/recipeFetcher'
import { SidebarLayout } from '@/components/layouts/SidebarLayout'
import RecipeDetailView from '@/components/blocks/RecipeDetailView'
import { Locale, locales } from '@/middleware'
import { Recipe as RecipeType } from '@/services/recipes/types'

interface RecipePageProps {
  params: {
    handle: string
    lang: Locale
  }
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  // Await params to access its properties
  const { handle, lang } = await params;
  
  const recipe = await fetchRecipeByHandle(handle, lang)
  if (!recipe) return {}

  const authorName = recipe.user?.username 
    ? `${recipe.user.username}`
    : 'Unknown Chef'

  // Generate alternate URLs for each language with localized handles
  const alternateLanguages: Record<string, string> = {}
  
  // Get all available translations
  const translations = (recipe as RecipeType).translations || []
  
  locales.forEach(locale => {
    // Find if there's a translation for this locale with a handle
    const translation = translations.find(t => t.locale === locale && t.handle)
    
    // Use translation handle if available, otherwise use default handle
    const localizedHandle = translation?.handle || recipe.handle
    alternateLanguages[locale] = `/${locale}/recipes/${localizedHandle}`
  })

  // Find if there's a translation for the requested language
  const hasTranslation = (recipe as RecipeType).translations?.some(
    (translation) => translation.locale === lang
  )

  // If no translation and not in default language, indicate this page is a translation of the default
  const isDefaultLanguage = lang === 'en'

  return {
    title: `${recipe.title} by ${authorName}`,
    description: recipe.description,
    alternates: {
      languages: alternateLanguages,
      canonical: isDefaultLanguage || hasTranslation 
        ? `/${lang}/recipes/${handle}` 
        : `/en/recipes/${recipe.handle}`,
    },
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      images: recipe.image_url ? [recipe.image_url] : [],
      locale: lang,
      type: 'article',
    },
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  // Await params to access its properties
  const { handle, lang } = await params;
  
  return (
    <SidebarLayout
      breadcrumbs={[
        { label: 'Home', href: `/${lang}` },
        { label: 'Recipes', href: `/${lang}/recipes` },
        { label: 'Details', isCurrentPage: true }
      ]}
    >
      <RecipeDetailView handle={handle} />
    </SidebarLayout>
  )
} 