import 'server-only'
import { getDictionary } from '@/dictionaries'
import { Locale } from '@/middleware'

/**
 * A utility function to get translations in server components
 * 
 * @example
 * ```tsx
 * import { getTranslations } from '@/utils/server-dictionary'
 * 
 * export default async function ServerComponent({ params }: { params: { lang: string } }) {
 *   // Await params to access its properties
 *   const { lang } = await params;
 *   const t = await getTranslations(lang)
 *   
 *   return (
 *     <div>
 *       <h1>{t('common.welcome')}</h1>
 *     </div>
 *   )
 * }
 * ```
 */
export async function getTranslations(locale: Locale | string) {
  const dictionary = await getDictionary(locale)
  
  /**
   * A helper function to get a nested translation by dot notation
   */
  const t = (key: string): string => {
    const keys = key.split('.')
    let result: any = dictionary
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k]
      } else {
        console.warn(`Translation key not found: ${key}`)
        return key
      }
    }
    
    return result
  }
  
  return t
}

/**
 * A helper function to format translation strings with variables
 * 
 * @example
 * ```tsx
 * import { getTranslations, formatMessage } from '@/utils/server-dictionary'
 * 
 * export default async function ServerComponent({ params }: { params: { lang: string } }) {
 *   // Await params to access its properties
 *   const { lang } = await params;
 *   const t = await getTranslations(lang)
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