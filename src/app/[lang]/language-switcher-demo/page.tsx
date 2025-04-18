import { Locale } from "@/middleware"
import { withLocale } from "@/components/i18n/withLocale"
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher"
import { SimpleLanguageSwitcher } from "@/components/i18n/SimpleLanguageSwitcher"
import { Button } from "@/components/ui/button"
import { LocalizedLink } from "@/components/i18n/LocalizedLink"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default withLocale<{ params: { lang: Locale } }>(async ({ t, params }) => {
  return (
    <div className="container py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Language Switcher Demo</h1>
        <p className="text-muted-foreground">
          This page demonstrates two different language switcher components
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Standard Language Switcher</CardTitle>
            <CardDescription>
              Uses Shadcn UI dropdown menu for a polished look
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <LanguageSwitcher />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Simple Language Switcher</CardTitle>
            <CardDescription>
              A lightweight implementation with hover dropdown
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <SimpleLanguageSwitcher />
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          Try switching languages with either component. Your language preference will be saved
          and applied to all pages you visit.
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