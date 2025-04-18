'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/app/providers';
import type { Dictionary } from '@/utils/dictionary';

export function useTranslation() {
  const lang = useLang();
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    import(`@/dictionaries/${lang}.json`)
      .then((dict) => {
        setDictionary(dict.default);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load dictionary:', error);
        
        // Fallback to English on error
        import('@/dictionaries/en.json')
          .then((dict) => {
            setDictionary(dict.default);
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
      });
  }, [lang]);

  const t = (key: string) => {
    if (!dictionary) return key;
    
    // Split the key by dots to access nested properties
    const keys = key.split('.');
    let value = keys.reduce((obj, k) => obj?.[k], dictionary as any);
    
    return value || key;
  };

  return { t, isLoading, dictionary, lang };
} 