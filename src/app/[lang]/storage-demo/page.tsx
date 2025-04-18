import { Locale } from "@/middleware"
import { withLocale } from "@/components/i18n/withLocale"
import { StorageDemo } from "@/components/demo/StorageDemo"
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher"
import { Button } from "@/components/ui/button"
import { LocalizedLink } from "@/components/i18n/LocalizedLink"

export default withLocale<{ params: { lang: Locale } }>(async ({ t, params }) => {
  return (
    <div className="container py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Language Storage Demo</h1>
        <p className="text-muted-foreground">
          This page demonstrates how language preferences are stored in localStorage
        </p>
        
        <div className="flex justify-center pt-4">
          <LanguageSwitcher />
        </div>
      </div>
      
      <StorageDemo />
      
      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Notice how both LANGUAGE and PREFERRED_LANGUAGE keys are used to store the language preference.
          <br />
          This ensures backward compatibility while following the guide's recommendations.
        </p>
        
        <div className="flex justify-center">
          <Button asChild variant="outline">
            <LocalizedLink href="/">{t('common.home')}</LocalizedLink>
          </Button>
        </div>
      </div>
    </div>
  )
}) 