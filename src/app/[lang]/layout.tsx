import "@/styles/globals.css"
import { locales, Locale } from "@/middleware"
import { Providers } from "../providers"
import { getDictionary } from "@/dictionaries"
import { TranslationProvider } from "@/components/i18n/TranslationContext"
import type { Metadata } from 'next'

export async function generateMetadata({ 
  params 
}: { 
  params: { lang: string } 
}): Promise<Metadata> {
  return {
    title: 'Recipe App',
    description: 'Your personal recipe manager',
    alternates: {
      languages: {
        'en-US': `/en`,
        'fr-FR': `/fr`,
        'es-ES': `/es`,
        'de-DE': `/de`,
      },
      canonical: `/${params.lang}`,
    },
  }
}

export async function generateStaticParams() {
  return locales.map(lang => ({ lang }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  // Get the dictionary for the current locale
  const dictionary = await getDictionary(params.lang as Locale)

  return (
    <html lang={params.lang} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <TranslationProvider dictionary={dictionary} locale={params.lang as Locale}>
          <Providers lang={params.lang as Locale}>{children}</Providers>
        </TranslationProvider>
      </body>
    </html>
  )
} 