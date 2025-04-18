'use client'

import { useTranslation } from '@/components/i18n/TranslationContext'
import { Locale } from '@/middleware'

/**
 * A hook that provides access to the translation dictionary
 * with type-safe access to translation keys.
 * 
 * @example
 * ```tsx
 * import { useClientDictionary } from '@/utils/client-dictionary'
 * 
 * function MyComponent() {
 *   const { t, locale } = useClientDictionary()
 *   
 *   return (
 *     <div>
 *       <h1>{t('common.welcome')}</h1>
 *       <p>Current language: {locale}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useClientDictionary() {
  const { t, locale, dictionary } = useTranslation()
  
  return {
    t,
    locale: locale as Locale,
    dictionary
  }
}

/**
 * A helper function to format translation strings with variables
 * 
 * @example
 * ```tsx
 * import { formatMessage } from '@/utils/client-dictionary'
 * 
 * function MyComponent() {
 *   const { t } = useClientDictionary()
 *   
 *   return (
 *     <p>{formatMessage(t('recipe.authoredBy'), { author: 'John Doe' })}</p>
 *   )
 * }
 * ```
 */
export function formatMessage(message: string, variables: Record<string, string | number>) {
  return Object.entries(variables).reduce((acc, [key, value]) => {
    return acc.replace(new RegExp(`{${key}}`, 'g'), String(value))
  }, message)
} 