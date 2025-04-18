import { getDictionary } from '@/dictionaries'
import { Locale } from '@/middleware'

// This component must be imported and used in server components
export async function TranslatedText({
  locale,
  keyPath,
}: {
  locale: Locale
  keyPath: string // e.g. "common.home" or "auth.loginButton"
}) {
  const dictionary = await getDictionary(locale)
  
  // Split the key path and access nested dictionary properties
  const keys = keyPath.split('.')
  let translation: any = dictionary
  
  for (const key of keys) {
    if (translation && typeof translation === 'object' && key in translation) {
      translation = translation[key]
    } else {
      return keyPath // Return the key path if translation is not found
    }
  }
  
  return translation
} 