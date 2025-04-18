import { Locale } from "@/middleware"
import { getDictionary } from "@/dictionaries"
import { withLocale } from "@/components/i18n/withLocale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher"
import { Button } from "@/components/ui/button"
import { LocalizedLink } from "@/components/i18n/LocalizedLink"

function TranslationApproach1({ dict, lang }: { dict: any, lang: Locale }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Approach 1: Direct Dictionary Import</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-muted rounded-md">
          <p className="font-mono text-xs">getDictionary(params.lang)</p>
        </div>
        
        <div>
          <p className="font-medium">{dict.common.language}: {lang}</p>
          <p>{dict.common.welcomeMessage}</p>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>Pros:</p>
          <ul className="list-disc pl-5">
            <li>Direct and simple approach</li>
            <li>Good for pages that need full dictionary access</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

function TranslationApproach2({ t, lang }: { t: (key: string) => string, lang: Locale }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Approach 2: withLocale HOC</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-muted rounded-md">
          <p className="font-mono text-xs">withLocale(async ({"{"} t, params {"}"}) {"=>"} ...)</p>
        </div>
        
        <div>
          <p className="font-medium">{t('common.language')}: {lang}</p>
          <p>{t('common.welcomeMessage')}</p>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>Pros:</p>
          <ul className="list-disc pl-5">
            <li>More reusable across components</li>
            <li>Cleaner access through the t() function</li>
            <li>Consistent pattern across the app</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

// Hybrid page that shows both approaches
export default async function TranslationComparisonPage({ 
  params 
}: { 
  params: { lang: Locale } 
}) {
  // Direct dictionary approach
  const dict = await getDictionary(params.lang)
  
  // For the withLocale approach, we'll render this separately
  // without trying to create a component from it
  return (
    <div className="container py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Server Translation Approaches</h1>
        <p className="text-muted-foreground">
          Comparing different ways to handle translations in server components
        </p>
        
        <div className="flex justify-center pt-4">
          <LanguageSwitcher />
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <TranslationApproach1 dict={dict} lang={params.lang} />
        
        {/* Approach 2 content rendered directly with withLocale */}
        {await withLocale<{ params: { lang: Locale } }>(
          async ({ t, params: p }) => (
            <TranslationApproach2 t={t} lang={p.lang} />
          )
        )({ params })}
      </div>
      
      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Both approaches are valid ways to handle translations in server components.
          <br />
          Choose the one that fits your specific component needs and team preferences.
        </p>
        
        <div className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <LocalizedLink href="/server-demo">Server Demo</LocalizedLink>
          </Button>
          <Button asChild variant="outline">
            <LocalizedLink href="/">{dict.common.home}</LocalizedLink>
          </Button>
        </div>
      </div>
    </div>
  )
} 