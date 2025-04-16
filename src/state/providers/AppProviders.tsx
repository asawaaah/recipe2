'use client'

import { ReactNode } from 'react'
import { QueryProvider } from './QueryProvider'
import { ThemeProvider } from './ThemeProvider'
import { AuthProvider } from './AuthProvider'
import { PreferencesProvider } from './PreferencesProvider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from 'sonner'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <PreferencesProvider>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              {children}
              <Toaster
                position="top-center"
                expand={false}
                richColors={true}
                closeButton={true}
                offset="16px"
                duration={4000}
              />
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </PreferencesProvider>
    </QueryProvider>
  )
} 