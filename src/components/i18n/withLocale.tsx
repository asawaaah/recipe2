import { Locale } from '@/middleware'
import { getTranslations } from '@/utils/server-dictionary'
import { ReactNode } from 'react'

/**
 * A higher-order component that provides internationalization utilities to server components
 * 
 * @example
 * ```tsx
 * const Page = withLocale<{ id: string }>(async ({ t, params }) => {
 *   return (
 *     <div>
 *       <h1>{t('common.welcome')}</h1>
 *       <p>Item ID: {params.id}</p>
 *     </div>
 *   )
 * })
 * ```
 */
export function withLocale<P extends { params: { lang: string } }>(
  Component: (props: P & { t: (key: string) => string }) => Promise<ReactNode> | ReactNode
) {
  return async function LocalizedComponent(props: P) {
    // Await params to access its properties
    const { params } = props;
    const { lang } = await params;
    const t = await getTranslations(lang as Locale)
    return Component({ ...props, t })
  }
}

/**
 * A wrapper component for internationalized server components
 * 
 * @example
 * ```tsx
 * export default async function Page({ params }: { params: { lang: string } }) {
 *   return (
 *     <LocaleWrapper params={params}>
 *       {({ t }) => (
 *         <div>
 *           <h1>{t('common.welcome')}</h1>
 *         </div>
 *       )}
 *     </LocaleWrapper>
 *   )
 * }
 * ```
 */
export async function LocaleWrapper({
  params,
  children,
}: {
  params: { lang: string }
  children: (props: { t: (key: string) => string }) => ReactNode
}) {
  // Await params to access its properties
  const { lang } = await params;
  const t = await getTranslations(lang as Locale)
  return children({ t })
} 