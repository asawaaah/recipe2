import "@/styles/globals.css"
import { locales, Locale } from "@/middleware"
import { getDictionary } from "@/dictionaries"
import { TranslationProvider } from "@/components/i18n/TranslationContext"
import type { Metadata } from 'next'

export async function generateMetadata({ 
  params 
}: { 
  params: { lang: string } 
}): Promise<Metadata> {
  // Await params to access its properties
  const { lang } = await params;
  
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
      canonical: `/${lang}`,
    },
  }
}

export async function generateStaticParams() {
  return locales.map(lang => ({ lang }))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  // Await params to access its properties
  const { lang } = await params;
  
  // Get the dictionary for the current locale
  const dictionary = await getDictionary(lang as Locale)

  return (
    <TranslationProvider dictionary={dictionary} locale={lang as Locale}>
      {children}
    </TranslationProvider>
  )
} 