import { Locale } from '@/middleware'
import { RouteSegment, getLocalizedPathSegment } from './route-mappings-data'

/**
 * Transforms an internal route to a localized route
 * Example: /recipes/pasta becomes /fr/recettes/pasta for French
 */
export function getLocalizedRoute(internalPath: string, locale: Locale): string {
  // Don't modify external URLs
  if (internalPath.startsWith('http://') || internalPath.startsWith('https://')) {
    return internalPath
  }
  
  // Remove leading slash if present
  const path = internalPath.startsWith('/') ? internalPath.slice(1) : internalPath
  
  // Split path into segments
  const segments = path.split('/')
  
  // If path is empty, just return locale
  if (segments.length === 0 || (segments.length === 1 && segments[0] === '')) {
    return `/${locale}`
  }
  
  // Get the first segment and check if it's an internal route segment
  const firstSegment = segments[0]
  const isInternalRouteSegment = firstSegment as RouteSegment
  
  // If the first segment is an internal route segment, localize it
  if (isInternalRouteSegment) {
    // Replace the first segment with its localized equivalent
    const localizedSegment = getLocalizedPathSegment(locale, isInternalRouteSegment)
    segments[0] = localizedSegment
  }
  
  // Reconstruct the path with the locale prefix
  return `/${locale}/${segments.join('/')}`
}

/**
 * Generates a localized canonical URL for metadata
 * This should be used in the generateMetadata function of each page
 */
export function getLocalizedCanonical(
  baseUrl: string, 
  locale: Locale, 
  params: Record<string, string> = {}
): string {
  // For routes like '/recipes' or '/recipes/[handle]'
  let localizedRoute = baseUrl

  // Replace any route parameters if provided
  Object.entries(params).forEach(([key, value]) => {
    localizedRoute = localizedRoute.replace(`[${key}]`, value)
  })

  // Transform to localized version
  return getLocalizedRoute(localizedRoute, locale)
}

/**
 * Extracts route params from a path pattern and actual path
 * Example: extractParams('/recipes/[handle]', '/recipes/pasta') returns { handle: 'pasta' }
 */
export function extractParams(
  pattern: string,
  path: string
): Record<string, string> {
  const patternSegments = pattern.split('/').filter(Boolean)
  const pathSegments = path.split('/').filter(Boolean)
  
  const params: Record<string, string> = {}
  
  patternSegments.forEach((segment, index) => {
    // Check if segment is a parameter (enclosed in square brackets)
    if (segment.startsWith('[') && segment.endsWith(']')) {
      const paramName = segment.slice(1, -1)
      params[paramName] = pathSegments[index] || ''
    }
  })
  
  return params
}

/**
 * Builds a path with parameters replaced
 * Example: buildPath('/recipes/[handle]', { handle: 'pasta' }) returns '/recipes/pasta'
 */
export function buildPath(
  pattern: string,
  params: Record<string, string> = {}
): string {
  let result = pattern
  
  // Replace each parameter in the pattern
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`[${key}]`, value)
  })
  
  return result
} 