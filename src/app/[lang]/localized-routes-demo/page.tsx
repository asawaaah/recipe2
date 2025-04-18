import React from 'react'
import { LocalizedLink } from '@/components/i18n/LocalizedLink'
import { Locale, locales } from '@/middleware'
import { withLocale } from '@/components/i18n/withLocale'
import { pathMappings } from '@/utils/route-mappings'
import { SidebarLayout } from '@/components/layouts/SidebarLayout'

export default withLocale<{ params: { lang: Locale } }>(({ t, params }) => {
  const { lang } = params

  return (
    <SidebarLayout
      breadcrumbs={[
        { label: t('common.home'), href: '/' },
        { label: 'Localized Routes Demo', isCurrentPage: true }
      ]}
    >
      <div className="space-y-8 p-6">
        <section className="space-y-4">
          <h1 className="text-3xl font-bold">{t('common.welcomeMessage')}</h1>
          <p className="text-xl">
            This page demonstrates how localized routes work in the application.
          </p>
          <p>Current language: <span className="font-bold">{lang}</span></p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Navigation Examples</h2>
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Main Navigation</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <LocalizedLink 
                  href="/recipes" 
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                >
                  {t('common.allRecipes')}
                </LocalizedLink>
                <span>→ uses localized path for "recipes"</span>
              </li>
              <li className="flex items-center gap-4">
                <LocalizedLink 
                  href="/my-cookbook" 
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                >
                  {t('common.myCookbook')}
                </LocalizedLink>
                <span>→ uses localized path for "my-cookbook"</span>
              </li>
            </ul>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Dynamic Parameters</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <LocalizedLink 
                  href="/recipes/[handle]"
                  handle="pasta-carbonara"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                >
                  Pasta Carbonara
                </LocalizedLink>
                <span>→ uses localized path with dynamic parameter</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Path Mappings</h2>
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Route Segments by Language</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {locales.map(locale => (
                <div key={locale} className="bg-background p-4 rounded-md">
                  <h4 className="font-bold mb-2">{locale.toUpperCase()}</h4>
                  <ul className="space-y-2 text-sm">
                    {Object.entries(pathMappings[locale]).map(([localized, internal]) => (
                      <li key={localized} className="flex gap-2">
                        <span className="font-mono">/{localized}</span>
                        {locale !== 'en' && (
                          <span className="text-muted-foreground">← /{internal}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Switch Language</h2>
          <div className="flex gap-3">
            {locales.map(locale => (
              <LocalizedLink
                key={locale}
                href="/localized-routes-demo"
                locale={locale}
                className={`px-4 py-2 rounded-md ${locale === lang 
                  ? 'bg-secondary font-bold' 
                  : 'bg-secondary/50'}`}
              >
                {locale.toUpperCase()}
              </LocalizedLink>
            ))}
          </div>
        </section>
      </div>
    </SidebarLayout>
  )
}) 