import { Locale } from "@/middleware"
import { getDictionary } from "@/dictionaries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LocalizedLink } from "@/components/i18n/LocalizedLink"
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher"

// Direct server component translation without using the withLocale HOC
export default async function ServerTranslationDemoPage({ 
  params 
}: { 
  params: { lang: Locale } 
}) {
  // Get the dictionary directly in the server component
  const dict = await getDictionary(params.lang)
  
  return (
    <div className="container py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Server Translation Demo</h1>
        <p className="text-muted-foreground">
          Demonstrating direct dictionary access in a Server Component
        </p>
        
        <div className="flex justify-center pt-4">
          <LanguageSwitcher />
        </div>
      </div>
      
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>{dict.common.language}: {params.lang.toUpperCase()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <h3 className="text-lg font-medium">{dict.common.welcome}</h3>
            <p>{dict.common.welcomeMessage}</p>
          </div>
          
          <div className="grid gap-2">
            <h3 className="text-lg font-medium">Navigation</h3>
            <ul className="list-disc pl-6">
              <li>{dict.common.home}</li>
              <li>{dict.common.allRecipes}</li>
              <li>{dict.common.myCookbook}</li>
            </ul>
          </div>
          
          <div className="pt-4 border-t mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              This page directly imports and uses the dictionary in a server component,
              without using the withLocale higher-order component.
            </p>
            <Button asChild variant="outline" size="sm">
              <LocalizedLink href="/">{dict.common.home}</LocalizedLink>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          The dictionary is fetched server-side and the page is fully rendered on the server.
          <br/>
          Try viewing the page source to see that all translations are present in the HTML.
        </p>
      </div>
    </div>
  )
} 