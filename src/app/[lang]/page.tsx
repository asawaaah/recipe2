import { Metadata } from "next"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Locale, locales } from "@/middleware"
import { getTranslations } from "@/utils/server-dictionary"
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher"
import { LocalizedLink } from "@/components/i18n/LocalizedLink"
import { withLocale } from "@/components/i18n/withLocale"

interface HomePageProps {
  params: {
    lang: Locale
  }
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  // Await params to access its properties
  const { lang } = await params;
  
  const t = await getTranslations(lang)
  
  // Generate alternate URLs for each language
  const alternateLanguages: Record<string, string> = {}
  locales.forEach(locale => {
    alternateLanguages[locale] = `/${locale}`
  })
  
  return {
    title: t('common.welcome'),
    description: t('common.welcomeMessage'),
    alternates: {
      languages: alternateLanguages,
      canonical: `/${lang}`,
    },
    openGraph: {
      title: t('common.welcome'),
      description: t('common.welcomeMessage'),
      locale: lang,
      type: 'website',
    },
  }
}

export default withLocale<{ params: { lang: Locale } }>(async ({ t, params }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          {t('common.welcome')}
        </h1>
        <p className="text-center text-lg mb-8">
          {t('common.welcomeMessage')}
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button asChild size="lg">
            <LocalizedLink href="/example" className="flex items-center gap-2">
              View UI Components
              <ArrowRight className="h-4 w-4" />
            </LocalizedLink>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <LocalizedLink href="/my-cookbook" className="flex items-center gap-2">
              {t('common.myCookbook')}
              <ArrowRight className="h-4 w-4" />
            </LocalizedLink>
          </Button>
          <Button asChild size="lg" variant="outline">
            <LocalizedLink href="/recipes" className="flex items-center gap-2">
              {t('common.allRecipes')}
              <ArrowRight className="h-4 w-4" />
            </LocalizedLink>
          </Button>
          <Button asChild size="lg" variant="default">
            <LocalizedLink href="/translation-demo" className="flex items-center gap-2">
              {t('common.language')} Demo
              <ArrowRight className="h-4 w-4" />
            </LocalizedLink>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <LocalizedLink href="/preferences-demo" className="flex items-center gap-2">
              Preferences Demo
              <ArrowRight className="h-4 w-4" />
            </LocalizedLink>
          </Button>
          <Button asChild size="lg" variant="outline">
            <LocalizedLink href="/hooks-demo" className="flex items-center gap-2">
              Translation Hooks
              <ArrowRight className="h-4 w-4" />
            </LocalizedLink>
          </Button>
          <Button asChild size="lg" variant="default">
            <LocalizedLink href="/language-switcher-demo" className="flex items-center gap-2">
              Language Switcher
              <ArrowRight className="h-4 w-4" />
            </LocalizedLink>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <LocalizedLink href="/storage-demo" className="flex items-center gap-2">
              Storage Demo
              <ArrowRight className="h-4 w-4" />
            </LocalizedLink>
          </Button>
          <Button asChild size="lg" variant="outline">
            <LocalizedLink href="/server-demo" className="flex items-center gap-2">
              Server Translation
              <ArrowRight className="h-4 w-4" />
            </LocalizedLink>
          </Button>
          <Button asChild size="lg" variant="default">
            <LocalizedLink href="/translation-comparison" className="flex items-center gap-2">
              Translation Comparison
              <ArrowRight className="h-4 w-4" />
            </LocalizedLink>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <LocalizedLink href="/client-form-demo" className="flex items-center gap-2">
              Client Form Demo
              <ArrowRight className="h-4 w-4" />
            </LocalizedLink>
          </Button>
        </div>
      </div>
    </main>
  )
}) 