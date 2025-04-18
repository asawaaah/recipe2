"use client"

import { Providers as AppProviders } from "@/state/providers"
import { Locale, defaultLocale } from "@/middleware"
import { createContext, useContext } from 'react'

// Create a context for the language
export const LangContext = createContext<Locale>(defaultLocale)

interface ProvidersProps {
  children: React.ReactNode
  lang?: Locale
}

export function Providers({ children, lang = defaultLocale }: ProvidersProps) {
  return (
    <LangContext.Provider value={lang}>
      <AppProviders lang={lang}>{children}</AppProviders>
    </LangContext.Provider>
  )
}

// Create a hook to access the language context
export const useLang = () => {
  const context = useContext(LangContext)
  if (context === undefined) {
    throw new Error('useLang must be used within a LangContext Provider')
  }
  return context
} 