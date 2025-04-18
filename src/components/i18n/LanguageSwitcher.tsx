'use client'

import { usePathname, useRouter } from 'next/navigation'
import { locales, Locale, defaultLocale } from '@/middleware'
import { Button } from '@/components/ui/button'
import { Check, ChevronDown, Globe } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { usePreferences } from '@/state/providers/PreferencesProvider'
import { useLang } from '@/app/providers'
import { getInternalPathSegment, getLocalizedPathSegment } from '@/utils/route-mappings-data'
import { createClient } from '@/lib/supabase'

// Map of language codes to their names
const languageNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
}

interface LanguageSwitcherProps {
  compact?: boolean;
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  // Get current language from URL path
  const pathname = usePathname()
  const pathLang = pathname.split('/')[1] as Locale
  const isValidLocale = locales.includes(pathLang as Locale)
  
  // Get language from context as fallback
  const contextLang = useLang()
  
  // Use the path language if valid, otherwise use context language or default
  const currentLang = isValidLocale ? pathLang : (contextLang || defaultLocale)
  
  // Get language preference setter from preferences
  const { setLanguage } = usePreferences()
  const router = useRouter()
  
  // Helper function to check if a path is a recipe page
  const isRecipePage = (path: string) => {
    // Check for various localized recipe paths
    return path.includes('/recipes/') || 
           path.includes('/recettes/') || 
           path.includes('/recetas/') || 
           path.includes('/rezepte/');
  }
  
  // Helper function to extract handle from a recipe URL
  const extractHandleFromPath = (path: string) => {
    return path.split('/').pop();
  }
  
  // Helper function to get translated handle for a recipe
  const getTranslatedRecipeHandle = async (handle: string, sourceLang: Locale, targetLang: Locale) => {
    if (!handle) return null;
    
    try {
      // Utiliser le client singleton au lieu d'en créer un nouveau
      const supabase = createClient();
      
      // CAS 1: Si on va vers l'anglais (qui est la langue par défaut)
      if (targetLang === 'en') {
        // Étape 1: Essayer de trouver la recipe_id à partir du handle source
        let recipeId = null;
        
        // Si la source est déjà en anglais, pas besoin de chercher
        if (sourceLang === 'en') return handle;
        
        // Sinon, trouver la recipe_id à partir de la traduction actuelle
        const { data: sourceTranslation } = await supabase
          .from('recipe_translations')
          .select('recipe_id')
          .eq('handle', handle)
          .eq('locale', sourceLang)
          .maybeSingle();
        
        recipeId = sourceTranslation?.recipe_id;
        
        // Si on a trouvé un ID de recette, chercher le handle anglais dans la table recipes
        if (recipeId) {
          const { data: recipe } = await supabase
            .from('recipes')
            .select('handle')
            .eq('id', recipeId)
            .single();
          
          if (recipe?.handle) {
            return recipe.handle; // Retourner le handle anglais de la table principale
          }
        }
        
        // Fallback si on n'a pas trouvé le handle anglais
        return handle;
      }
      
      // CAS 2: Si la source est l'anglais et on va vers une autre langue
      if (sourceLang === 'en') {
        // Trouver la recette directement par son handle anglais
        const { data: recipe } = await supabase
          .from('recipes')
          .select('id')
          .eq('handle', handle)
          .maybeSingle();
        
        const recipeId = recipe?.id;
        
        // Si on a trouvé un ID, chercher la traduction dans la langue cible
        if (recipeId) {
          const { data: targetTranslation } = await supabase
            .from('recipe_translations')
            .select('handle')
            .eq('recipe_id', recipeId)
            .eq('locale', targetLang)
            .maybeSingle();
          
          if (targetTranslation?.handle) {
            return targetTranslation.handle;
          }
        }
        
        // Fallback si on n'a pas trouvé de traduction
        return handle;
      }
      
      // CAS 3: Transition entre deux langues non-anglaises (fr->es, es->de, etc.)
      // Étape 1: Trouver recipe_id à partir du handle source
      const { data: sourceTranslation } = await supabase
        .from('recipe_translations')
        .select('recipe_id')
        .eq('handle', handle)
        .eq('locale', sourceLang)
        .maybeSingle();
      
      const recipeId = sourceTranslation?.recipe_id;
      
      // Étape 2: Si on a un recipe_id, chercher la traduction dans la langue cible
      if (recipeId) {
        const { data: targetTranslation } = await supabase
          .from('recipe_translations')
          .select('handle')
          .eq('recipe_id', recipeId)
          .eq('locale', targetLang)
          .maybeSingle();
        
        if (targetTranslation?.handle) {
          return targetTranslation.handle;
        }
      }
      
      // Fallback: retourner le handle original
      return handle;
    } catch (error) {
      console.error('Error getting translated handle:', error);
      return handle;
    }
  }
  
  const switchLanguage = async (newLocale: Locale) => {
    // Don't redirect if we're already on this locale
    if (newLocale === currentLang) return
    
    // Update language preference in the context
    setLanguage(newLocale)
    
    // Parse the path segments to handle localized paths
    const segments = pathname.split('/').filter(Boolean)
    
    // Check if we're on a recipe page
    if (isRecipePage(pathname) && segments.length > 2) {
      // Extract the current handle
      const currentHandle = extractHandleFromPath(pathname);
      
      // Get the translated handle for the target language
      const translatedHandle = await getTranslatedRecipeHandle(
        currentHandle!, 
        currentLang, 
        newLocale
      );
      
      // Get the recipe route segment for the target language
      const recipeSegment = getLocalizedPathSegment(newLocale, 'recipes');
      
      // Construct the new URL
      const newPath = `/${newLocale}/${recipeSegment}/${translatedHandle}`;
      
      router.push(newPath);
      return;
    }
    
    if (segments.length > 1 && isValidLocale) {
      const currentLocalizedSegment = segments[1]
      
      // Check if the current segment is a localized one in the current language
      const internalSegment = getInternalPathSegment(currentLang, currentLocalizedSegment)
      
      if (internalSegment) {
        // Now find the corresponding localized segment in the target language
        const targetLocalizedSegment = getLocalizedPathSegment(newLocale, internalSegment)
        
        // Build the new path with the target language and localized segment
        const newPath = [
          '', // For leading slash
          newLocale,
          targetLocalizedSegment,
          ...segments.slice(2) // Keep any remaining path segments
        ].join('/')
        
        router.push(newPath)
        return
      }
    }
    
    // Fallback to the standard approach if we couldn't do path translation
    // Path without the locale
    const pathnameWithoutLocale = segments.length > 1 ? segments.slice(1).join('/') : ''
    
    // Redirect to the same page but with the new locale
    router.push(`/${newLocale}${pathnameWithoutLocale ? `/${pathnameWithoutLocale}` : ''}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={compact ? "icon" : "sm"} 
          className={compact ? "w-full justify-center" : "flex items-center gap-1"}
        >
          <Globe className="h-4 w-4" />
          {!compact && (
            <>
              <span>{languageNames[currentLang]}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={compact ? "center" : "end"}>
        {locales.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => switchLanguage(lang)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{languageNames[lang]}</span>
            {lang === currentLang && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 