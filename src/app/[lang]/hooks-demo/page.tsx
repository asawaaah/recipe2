import { Locale } from "@/middleware"
import { withLocale } from "@/components/i18n/withLocale"
import { ClientHookDemo } from "@/components/demo/ClientHookDemo"
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher"
import { Button } from "@/components/ui/button"
import { LocalizedLink } from "@/components/i18n/LocalizedLink"

export default withLocale<{ params: { lang: Locale } }>(async ({ t, params }) => {
  return (
    <div className="container py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Translation Hooks Demo</h1>
        <p className="text-muted-foreground">
          This page demonstrates how to use the useTranslation hook in client components
        </p>
        
        <div className="flex justify-center pt-4">
          <LanguageSwitcher />
        </div>
      </div>
      
      <ClientHookDemo />
      
      <div className="flex justify-center">
        <Button asChild variant="outline">
          <LocalizedLink href="/">{t('common.home')}</LocalizedLink>
        </Button>
      </div>
    </div>
  )
}) 