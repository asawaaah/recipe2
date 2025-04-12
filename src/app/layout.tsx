import "@/styles/globals.css"
import { Providers } from "./providers"

export const metadata = {
  title: 'Recipe App',
  description: 'Your personal recipe manager',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
