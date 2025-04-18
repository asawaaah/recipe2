import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LocalizedLink } from "@/components/i18n/LocalizedLink"
import { useTranslation } from "@/components/i18n/TranslationContext"

export default function Home() {
  const { t } = useTranslation()
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          {t('common.welcome')}
        </h1>
        <p className="text-center text-lg mb-8">
          {t('common.welcomeMessage')}
        </p>
        
        <div className="flex justify-center gap-4 mt-8">
          <Button asChild size="lg">
            <LocalizedLink href="/example" className="flex items-center gap-2">
              {t('homepage.viewComponents')}
              <ArrowRight className="h-4 w-4" />
            </LocalizedLink>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <LocalizedLink href="/my-cookbook" className="flex items-center gap-2">
              {t('homepage.cookbookWithSidebar')}
              <ArrowRight className="h-4 w-4" />
            </LocalizedLink>
          </Button>
          <Button asChild size="lg" variant="outline">
            <LocalizedLink href="/all-recipes" className="flex items-center gap-2">
              {t('common.allRecipes')}
              <ArrowRight className="h-4 w-4" />
            </LocalizedLink>
          </Button>
        </div>
      </div>
    </main>
  )
}
