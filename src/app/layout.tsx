import "@/styles/globals.css"
import { Providers } from "./providers"
import { Locale, defaultLocale } from "@/middleware"

export const metadata = {
  title: 'Recipe App',
  description: 'Your personal recipe manager',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  manifest: '/site.webmanifest',
  icons: [
    {
      rel: 'icon',
      url: '/favicon.ico',
      sizes: '32x32',
    },
    {
      rel: 'icon',
      url: '/images/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      rel: 'apple-touch-icon',
      url: '/images/icon-192.png',
      sizes: '192x192',
    },
  ],
}

interface RootLayoutProps {
  children: React.ReactNode;
  params?: { lang?: string };
}

export default function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  // Default to the default locale if not found in path
  const lang = (params?.lang || defaultLocale) as Locale;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <Providers lang={lang}>{children}</Providers>
      </body>
    </html>
  )
}
