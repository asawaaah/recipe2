"use client"

import { useAuth } from "./useAuth"
import { useCurrentUserProfile } from "../queries/users"

export function useUser() {
  const { user: authUser, isLoading: isAuthLoading } = useAuth()
  
  // Use the standardized React Query hook for profile data
  const {
    data: profile,
    isLoading: isProfileLoading,
    error,
    refetch,
  } = useCurrentUserProfile()

  return {
    user: authUser,
    profile,
    isLoading: isAuthLoading || isProfileLoading,
    error,
    refetch,
  }
} 