import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchRecipeByHandle } from '@/services/recipes/recipeFetcher'
import { SidebarLayout } from '@/components/layouts/SidebarLayout'
import RecipeDetailView from '@/components/blocks/RecipeDetailView'
import { Locale, locales } from '@/middleware'
import { Recipe as RecipeType } from '@/services/recipes/types'
import { getLocalizedCanonical } from '@/utils/localized-routes'

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

  // Get translation for the requested language if available
  const currentTranslation = (recipe as RecipeType).translations?.find(
    t => t.locale === lang
  );
  
  // Use translated content if available, otherwise use default content
  const title = currentTranslation?.title || recipe.title;
  const description = currentTranslation?.description || recipe.description;

  const authorName = recipe.user?.username 
    ? `${recipe.user.username}`
    : (lang === 'fr' ? 'Chef Inconnu' : 
       lang === 'es' ? 'Chef Desconocido' : 
       lang === 'de' ? 'Unbekannter Koch' : 'Unknown Chef');

  // Format the title properly for the current language
  const formattedTitle = lang === 'fr' ? `${title} par ${authorName}` :
                          lang === 'es' ? `${title} por ${authorName}` :
                          lang === 'de' ? `${title} von ${authorName}` :
                          `${title} by ${authorName}`;

  // Generate alternate URLs for each language with localized handles
  const alternateLanguages: Record<string, string> = {}
  
  // Get all available translations
  const translations = (recipe as RecipeType).translations || []
  
  locales.forEach(locale => {
    // Find if there's a translation for this locale with a handle
    const translation = translations.find(t => t.locale === locale && t.handle)
    
    // Use translation handle if available, otherwise use default handle
    const localizedHandle = translation?.handle || recipe.handle
    alternateLanguages[locale] = getLocalizedCanonical('/recipes/[handle]', locale, { handle: localizedHandle })
  })

  // Find if there's a translation for the requested language
  const hasTranslation = (recipe as RecipeType).translations?.some(
    (translation) => translation.locale === lang
  )

  // If no translation and not in default language, indicate this page is a translation of the default
  const isDefaultLanguage = lang === 'en'

  // Create JSON-LD structured data for Recipe
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: title,
    description: description,
    author: {
      '@type': 'Person',
      name: recipe.user?.username || authorName
    },
    image: recipe.image_url ? [recipe.image_url] : [],
    recipeIngredient: recipe.ingredients?.map(ing => `${ing.amount} ${ing.unit} ${ing.name}`) || [],
    recipeInstructions: recipe.instructions?.map(inst => ({
      '@type': 'HowToStep',
      text: inst.description
    })) || [],
    cookTime: recipe.cooking_time ? `PT${recipe.cooking_time}M` : undefined,
    recipeYield: recipe.servings ? `${recipe.servings} servings` : undefined
  };

  return {
    title: formattedTitle,
    description: description,
    alternates: {
      languages: alternateLanguages,
      canonical: isDefaultLanguage || hasTranslation 
        ? getLocalizedCanonical('/recipes/[handle]', lang, { handle }) 
        : getLocalizedCanonical('/recipes/[handle]', 'en', { handle: recipe.handle }),
    },
    openGraph: {
      title: title,
      description: description,
      images: recipe.image_url ? [recipe.image_url] : [],
      locale: lang,
      type: 'article',
    },
    // Add additional metadata
    formatDetection: {
      telephone: false,
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: recipe.image_url ? [recipe.image_url] : [],
    },
    // Merged other properties
    other: {
      'robots': 'index, follow',
      'script:ld+json': JSON.stringify(jsonLd),
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
        { label: 'Recipes', href: getLocalizedCanonical('/recipes', lang) },
        { label: 'Details', isCurrentPage: true }
      ]}
    >
      <RecipeDetailView handle={handle} />
    </SidebarLayout>
  )
} 