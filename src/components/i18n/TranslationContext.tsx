'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { Locale } from '@/middleware'

// Define the type for our dictionary
export type Dictionary = {
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
    emailLabel: string
    usernameLabel: string
    passwordLabel: string
    confirmPasswordLabel: string
    signupButton: string
    loginButton: string
    logoutButton: string
    forgotPassword: string
    dontHaveAccount: string
    alreadyHaveAccount: string
    continueWithEmail: string
    continueWithGoogle: string
    orContinueWith: string
    chooseUsername: string
    createPassword: string
    setUsername: string
    loginAccountHeading: string
    createAccountHeading: string
    createAccountSubheading: string
    loginAccountSubheading: string
    termsAndPolicy: string
    verifyEmail: string
    verifyEmailMessage: string
    verifyEmailInstructions: string
    backToLogin: string
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
  
  const { dictionary, locale } = context
  
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