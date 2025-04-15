"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
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
    </NextThemesProvider>
  )
} 