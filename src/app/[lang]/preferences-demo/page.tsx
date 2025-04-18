import { Locale } from "@/middleware"
import { withLocale } from "@/components/i18n/withLocale"
import { PreferencesDemo } from "@/components/demo/PreferencesDemo"

export default withLocale<{ params: { lang: Locale } }>(async ({ t, params }) => {
  return (
    <div className="container py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Language Preferences Demo</h1>
        <p className="text-muted-foreground">
          This page demonstrates how language preferences are stored and used
        </p>
      </div>
      
      <PreferencesDemo />
    </div>
  )
}) 