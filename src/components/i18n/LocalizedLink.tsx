'use client'

import Link from 'next/link'
import { useLang } from '@/app/providers'
import { ComponentProps } from 'react'

type LocalizedLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string // The path without language prefix
  locale?: string // Optional override for the current language
}

/**
 * A Link component that automatically adds the current language prefix to the href
 * 
 * @example
 * ```tsx
 * <LocalizedLink href="/recipes">All Recipes</LocalizedLink>
 * // Will render as <a href="/en/recipes">All Recipes</a> if the current language is English
 * ```
 */
export function LocalizedLink({ href, locale, ...props }: LocalizedLinkProps) {
  const currentLang = useLang()
  const language = locale || currentLang
  
  // Don't modify external URLs (those starting with http:// or https://)
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return <Link href={href} {...props} />
  }
  
  // Add language prefix to internal links
  // If href already starts with /, keep it; otherwise add it
  const path = href.startsWith('/') ? href : `/${href}`
  const localizedHref = `/${language}${path}`
  
  return <Link href={localizedHref} {...props} />
} 