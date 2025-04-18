'use client'

import Link from 'next/link'
import { useLang } from '@/app/providers'
import { ComponentProps } from 'react'
import { usePathname } from 'next/navigation'
import { locales, Locale, defaultLocale } from '@/middleware'
import { getLocalizedRoute, buildPath } from '@/utils/localized-routes'
import { RouteSegment, getInternalPathSegment, getLocalizedPathSegment } from '@/utils/route-mappings-data'

type LocalizedLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string // The path without language prefix
  locale?: Locale // Optional override for the current language
  [key: string]: any // Additional params for the URL (allowing more flexible props)
}

/**
 * A Link component that automatically adds the current language prefix to the href
 * and localizes the path segments based on the language
 * 
 * @example
 * ```tsx
 * <LocalizedLink href="/recipes">All Recipes</LocalizedLink>
 * // Will render as <a href="/en/recipes">All Recipes</a> if English
 * // Will render as <a href="/fr/recettes">All Recipes</a> if French
 * 
 * <LocalizedLink href="/recipes/[handle]" handle="pasta">Pasta Recipe</LocalizedLink>
 * // Will render as <a href="/en/recipes/pasta">Pasta Recipe</a> if English
 * // Will render as <a href="/fr/recettes/pasta">Pasta Recipe</a> if French
 * ```
 */
export function LocalizedLink({ href, locale, ...props }: LocalizedLinkProps) {
  // Get current language from URL path
  const pathname = usePathname()
  const pathLang = pathname?.split('/')?.[1] as Locale
  const isValidLocale = locales.includes(pathLang as Locale)
  
  // Get language from context as fallback
  const contextLang = useLang()
  
  // Use the provided locale prop first, then path language if valid, otherwise context or default
  const language = locale || 
    (isValidLocale ? pathLang : (contextLang as Locale || defaultLocale))
  
  // Don't modify external URLs (those starting with http:// or https://)
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return <Link href={href} {...props} />
  }
  
  // If href is just "/", we're linking to the homepage
  if (href === '/') {
    return <Link href={`/${language}`} {...props} />
  }
  
  // For language switching on the current page, we need to handle the current path translation
  if (href === pathname && locale) {
    // We're switching language on the current page
    // Get the path segments to transform the localized path correctly
    const segments = pathname.split('/').filter(Boolean)
    
    // If we have more than just the language segment
    if (segments.length > 1) {
      const currentLocale = segments[0] as Locale
      const currentLocalizedSegment = segments[1]
      
      // Find the internal route segment for the current localized segment
      const internalSegment = getInternalPathSegment(currentLocale, currentLocalizedSegment)
      
      if (internalSegment) {
        // Now get the localized segment for the target language
        const targetLocalizedSegment = getLocalizedPathSegment(locale, internalSegment)
        
        // Build the new path with the target language and localized segment
        const newPath = [
          '', // For leading slash
          locale,
          targetLocalizedSegment,
          ...segments.slice(2) // Keep any remaining path segments
        ].join('/')
        
        return <Link href={newPath} {...props} />
      }
    }
  }
  
  // Extract any route params passed as props (like 'handle', 'id', etc.)
  const { children, ...restProps } = props
  const routeParams: Record<string, string> = {}
  
  // Filter out props that are route parameters (not standard HTML attributes)
  Object.entries(restProps).forEach(([key, value]) => {
    if (typeof value === 'string' && href.includes(`[${key}]`)) {
      routeParams[key] = value
      // Remove from props to avoid passing them as HTML attributes
      delete restProps[key as keyof typeof restProps]
    }
  })
  
  // Replace route parameters in the href pattern
  const pathWithParams = buildPath(href, routeParams)
  
  // Generate localized URL with appropriate path segments for the language
  const localizedHref = getLocalizedRoute(pathWithParams, language)
  
  return <Link href={localizedHref} {...restProps}>{children}</Link>
} 