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
  
  const switchLanguage = (newLocale: Locale) => {
    // Don't redirect if we're already on this locale
    if (newLocale === currentLang) return
    
    // Update language preference in the context
    setLanguage(newLocale)
    
    // Parse the path segments to handle localized paths
    const segments = pathname.split('/').filter(Boolean)
    
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