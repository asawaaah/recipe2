import { Locale } from '@/middleware'

// Define the mapping of localized path segments to internal route segments
export type RouteSegment = 'recipes' | 'login' | 'signup' | 'my-cookbook' | 'all-recipes'

// Maps localized paths to internal route segments
export const pathMappings: Record<Locale, Partial<Record<string, RouteSegment>>> = {
  en: {
    // English uses the same segments as internal routes
    'recipes': 'recipes',
    'login': 'login',
    'signup': 'signup',
    'my-cookbook': 'my-cookbook',
    'all-recipes': 'all-recipes',
  },
  fr: {
    // French localized paths
    'recettes': 'recipes',
    'connexion': 'login',
    'inscription': 'signup',
    'mon-livre-de-cuisine': 'my-cookbook',
    'toutes-les-recettes': 'all-recipes',
  },
  es: {
    // Spanish localized paths
    'recetas': 'recipes',
    'iniciar-sesion': 'login',
    'registrarse': 'signup',
    'mi-libro-de-cocina': 'my-cookbook', 
    'todas-las-recetas': 'all-recipes',
  },
  de: {
    // German localized paths
    'rezepte': 'recipes',
    'anmelden': 'login',
    'registrieren': 'signup',
    'mein-kochbuch': 'my-cookbook',
    'alle-rezepte': 'all-recipes',
  }
}

// Helper function to get localized path segment for an internal route
export function getLocalizedPathSegment(
  locale: Locale, 
  internalSegment: RouteSegment
): string {
  // Find the localized path for this internal segment
  const localizedSegment = Object.entries(pathMappings[locale]).find(
    ([_, value]) => value === internalSegment
  )?.[0]
  
  // Return the localized segment if found, otherwise return the internal segment
  return localizedSegment || internalSegment
}

// Helper function to get internal route segment for a localized path
export function getInternalPathSegment(
  locale: Locale,
  localizedSegment: string
): RouteSegment | undefined {
  return pathMappings[locale][localizedSegment] as RouteSegment | undefined
} 