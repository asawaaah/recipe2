"use client"

import { AppProviders } from "./AppProviders"

// Export individual providers for flexibility
export { AuthProvider } from "./AuthProvider"
export { ThemeProvider } from "./ThemeProvider"
export { QueryProvider } from "./QueryProvider"
export { PreferencesProvider } from "./PreferencesProvider"

// Export the combined providers as default
export { AppProviders as Providers }

/**
 * @deprecated Use the new AppProviders component instead
 */
export { AppProviders } 