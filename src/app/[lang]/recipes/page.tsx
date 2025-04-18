import { Metadata } from "next"
import { SidebarLayout } from "@/components/layouts/SidebarLayout"
import AllRecipes from "@/components/blocks/AllRecipes"
import { Locale, locales } from "@/middleware"
import { getTranslations } from "@/utils/server-dictionary"
import { getLocalizedCanonical } from "@/utils/localized-routes"

interface RecipesPageProps {
  params: { 
    lang: Locale 
  }
}

export async function generateMetadata({ params }: RecipesPageProps): Promise<Metadata> {
  // Await params to access its properties
  const { lang } = await params;
  
  const t = await getTranslations(lang)
  
  // Generate alternate URLs for each language
  const alternateLanguages: Record<string, string> = {}
  locales.forEach(locale => {
    // Generate a localized alternate URL for each language
    alternateLanguages[locale] = getLocalizedCanonical('/recipes', locale)
  })
  
  return {
    title: t('common.allRecipes'),
    description: t('common.welcomeMessage'),
    alternates: {
      languages: alternateLanguages,
      canonical: getLocalizedCanonical('/recipes', lang),
    },
    openGraph: {
      title: t('common.allRecipes'),
      description: t('common.welcomeMessage'),
      locale: lang,
      type: 'website',
    },
  }
}

export default async function RecipesPage({
  params
}: RecipesPageProps) {
  // Await params to access its properties
  const { lang } = await params;
  
  const t = await getTranslations(lang)
  
  return (
    <SidebarLayout
      breadcrumbs={[
        { label: t('common.home'), href: `/${lang}` },
        { label: t('common.allRecipes'), isCurrentPage: true }
      ]}
    >
      <AllRecipes />
    </SidebarLayout>
  )
} 