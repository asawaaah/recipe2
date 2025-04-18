import 'server-only'
import { Locale, locales } from '@/middleware'

// Re-export the Dictionary type from the TranslationContext
import { Dictionary } from '@/components/i18n/TranslationContext'

// We use dynamic imports to ensure we only load the dictionary that we need
const dictionaries = {
  en: () => import('./en.json').then((module) => module.default as Dictionary),
  fr: () => import('./fr.json').then((module) => module.default as Dictionary),
  es: () => import('./es.json').then((module) => module.default as Dictionary),
  de: () => import('./de.json').then((module) => module.default as Dictionary),
} as const;

export const getDictionary = async (locale: Locale | string): Promise<Dictionary> => {
  // Safeguard against unsupported locales
  if (!locales.includes(locale as Locale)) {
    console.warn(`Locale '${locale}' is not supported. Falling back to English.`);
    return dictionaries.en();
  }
  
  return dictionaries[locale as Locale]();
} 