import { Locale } from "@/middleware"
import { withLocale } from "@/components/i18n/withLocale"
import { ClientTranslationForm } from "@/components/demo/ClientTranslationForm"
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher"
import { Button } from "@/components/ui/button"
import { LocalizedLink } from "@/components/i18n/LocalizedLink"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default withLocale<{ params: { lang: Locale } }>(async ({ t, params }) => {
  return (
    <div className="container py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Client Component Translation</h1>
        <p className="text-muted-foreground">
          Demonstrating translations in an interactive client component
        </p>
        
        <div className="flex justify-center pt-4">
          <LanguageSwitcher />
        </div>
      </div>
      
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Client-side translation</AlertTitle>
        <AlertDescription>
          This form uses the useTranslation hook to dynamically load translations in a client component.
          Try changing the language with the switcher above and see how the form updates instantly.
        </AlertDescription>
      </Alert>
      
      <ClientTranslationForm />
      
      <div className="flex justify-center mt-8">
        <Button asChild variant="outline">
          <LocalizedLink href="/">{t('common.home')}</LocalizedLink>
        </Button>
      </div>
    </div>
  )
}) 