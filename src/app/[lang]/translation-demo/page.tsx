import { Locale } from "@/middleware"
import { ClientTranslationDemo } from "@/components/demo/ClientTranslationDemo"
import { withLocale } from "@/components/i18n/withLocale"
import { ServerTranslationDemo } from "@/components/demo/ServerTranslationDemo"

// Use the withLocale HOC to get access to translations
export default withLocale<{ params: { lang: Locale } }>(async ({ t, params }) => {
  return (
    <div className="container py-10 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{t('common.language')} Demo</h1>
        <p className="text-muted-foreground">
          This page demonstrates how to use translations in both server and client components
        </p>
      </div>
      
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">
          {t('common.welcome')}
        </h2>
        <p>
          {t('common.welcomeMessage')}
        </p>
        
        <div className="grid gap-2">
          <h3 className="text-xl font-medium">Navigation</h3>
          <ul className="list-disc pl-6">
            <li>{t('common.home')}</li>
            <li>{t('common.allRecipes')}</li>
            <li>{t('common.myCookbook')}</li>
            <li>{t('common.login')}</li>
            <li>{t('common.signup')}</li>
          </ul>
        </div>
      </div>
      
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">
          Server Component Translation Demo
        </h2>
        
        <ServerTranslationDemo locale={params.lang} />
      </div>
      
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">
          Client Component Translation Demo
        </h2>
        
        <ClientTranslationDemo />
      </div>
    </div>
  )
}) 