import { Metadata } from "next"
import { SidebarLayout } from "@/components/layouts/SidebarLayout"
import AllRecipes from "@/components/blocks/AllRecipes"
import { Locale, locales } from "@/middleware"
import { getTranslations } from "@/utils/server-dictionary"

interface RecipesPageProps {
  params: { 
    lang: Locale 
  }
}

export async function generateMetadata({ params }: RecipesPageProps): Promise<Metadata> {
  const t = await getTranslations(params.lang)
  
  // Generate alternate URLs for each language
  const alternateLanguages: Record<string, string> = {}
  locales.forEach(locale => {
    alternateLanguages[locale] = `/${locale}/recipes`
  })
  
  return {
    title: t('common.allRecipes'),
    description: t('common.welcomeMessage'),
    alternates: {
      languages: alternateLanguages,
      canonical: `/${params.lang}/recipes`,
    },
    openGraph: {
      title: t('common.allRecipes'),
      description: t('common.welcomeMessage'),
      locale: params.lang,
      type: 'website',
    },
  }
}

export default async function RecipesPage({
  params
}: RecipesPageProps) {
  const t = await getTranslations(params.lang)
  
  return (
    <SidebarLayout
      breadcrumbs={[
        { label: t('common.home'), href: `/${params.lang}` },
        { label: t('common.allRecipes'), isCurrentPage: true }
      ]}
    >
      <AllRecipes />
    </SidebarLayout>
  )
} 