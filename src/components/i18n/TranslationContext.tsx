'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { Locale, locales, defaultLocale } from '@/middleware'
import { usePathname } from 'next/navigation'

// Define the type for our dictionary
export type Dictionary = {
  handle: {
    recipes: string
  }
  common: {
    home: string
    allRecipes: string
    myCookbook: string
    login: string
    signup: string
    language: string
    create: string
    edit: string
    save: string
    cancel: string
    delete: string
    welcome: string
    welcomeMessage: string
  }
  homepage: {
    viewComponents: string
    cookbookWithSidebar: string
  }
  recipe: {
    title: string
    description: string
    ingredients: string
    instructions: string
    cookingTime: string
    servings: string
    addToFavorites: string
    removeFromFavorites: string
    createRecipe: string
    editRecipe: string
    deleteRecipe: string
    emptyRecipes: string
    createFirstRecipe: string
    minutes: string
    authoredBy: string
  }
  auth: {
    common: {
      back: string
      username: string
      email: string
      password: string
      confirmPassword: string
      forgotPassword: string
      dontHaveAccount: string
      alreadyHaveAccount: string
      continueWithEmail: string
      continueWithGoogle: string
      orContinueWith: string
      logOut: string
      termsAndPolicy: string
    }
    login: {
      title: string
      subtitle: string
      emailOrUsername: string
      emailOrUsernamePlaceholder: string
      password: string
      forgotPassword: string
      signIn: string
      signingIn: string
      or: string
      continueWithGoogle: string
      noAccount: string
      signUp: string
      imageAlt: string
      termsNotice: string
    }
    signup: {
      title: string
      subtitle: string
      email: string
      emailPlaceholder: string
      continueWithEmail: string
      orContinueWith: string
      signUpWithGoogle: string
      chooseUsername: string
      usernamePlaceholder: string
      setUsername: string
      createPassword: string
      confirmPassword: string
      creatingAccount: string
      createAccount: string
      alreadyHaveAccount: string
      signIn: string
    }
    verifyEmail: {
      title: string
      sentVerificationLink: string
      checkSpam: string
      backToLogin: string
    }
    callback: {
      loginSuccess: string
      authFailed: string
      welcomeMessage: string
      usernameUpdateFailed: string
      chooseUsername: string
      usernameDescription: string
      usernamePlaceholder: string
      saving: string
      saveUsername: string
      authenticating: string
    }
  }
  validation: {
    required: string
    invalidEmail: string
    passwordLength: string
    passwordMatch: string
    invalidUsername: string
    usernameTaken: string
  }
  errors: {
    general: string
    loginFailed: string
    signupFailed: string
    loadingFailed: string
    authFailed: string
  }
}

type TranslationContextType = {
  dictionary: Dictionary
  locale: Locale
}

const TranslationContext = createContext<TranslationContextType | null>(null)

export function TranslationProvider({
  dictionary,
  locale,
  children,
}: {
  dictionary: Dictionary
  locale: Locale
  children: ReactNode
}) {
  return (
    <TranslationContext.Provider value={{ dictionary, locale }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  
  // Get the current pathname to extract the locale
  const pathname = usePathname()
  const pathLang = pathname?.split('/')?.[1] as Locale
  const isValidLocale = locales.includes(pathLang as Locale)
  
  // Use the path language if valid, otherwise use the context language
  const locale = isValidLocale ? pathLang : context.locale
  const { dictionary } = context
  
  // Helper function to get a nested translation by dot notation
  const t = (key: string): string => {
    const keys = key.split('.')
    let result: any = dictionary
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k]
      } else {
        console.warn(`Translation key not found: ${key}`)
        return key
      }
    }
    
    return result
  }
  
  return {
    t,
    locale,
    dictionary
  }
} 