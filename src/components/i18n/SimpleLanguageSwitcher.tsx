'use client';

import { useRouter, usePathname } from 'next/navigation';
import { usePreferences } from '@/state/providers/PreferencesProvider';
import { locales, Locale } from '@/middleware';
import { useLang } from '@/app/providers';

const languageNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
};

export function SimpleLanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = useLang();
  const { setLanguage } = usePreferences();
  
  const switchLanguage = (newLang: string) => {
    // Update the preference
    setLanguage(newLang as Locale);
    
    // Extract the path without the language prefix
    const segments = pathname.split('/');
    const pathWithoutLang = segments.slice(2).join('/');
    
    // Navigate to the new language path
    router.push(`/${newLang}${pathWithoutLang ? `/${pathWithoutLang}` : ''}`);
  };
  
  return (
    <div className="relative group">
      <button className="flex items-center gap-1 rounded px-2 py-1 hover:bg-accent">
        <span>{languageNames[currentLang as keyof typeof languageNames]}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      
      <div className="absolute right-0 mt-1 hidden group-hover:block bg-background border rounded shadow-lg p-1 min-w-[120px] z-10">
        {locales.map((locale) => (
          <button
            key={locale}
            onClick={() => switchLanguage(locale)}
            className={`block w-full text-left px-3 py-1.5 rounded ${
              locale === currentLang ? 'bg-accent' : 'hover:bg-accent/50'
            }`}
          >
            {languageNames[locale as keyof typeof languageNames]}
          </button>
        ))}
      </div>
    </div>
  );
} 