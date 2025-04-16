# Recipe2 State Management

This directory contains the state management system for the Recipe2 application. It uses a combination of React Query for server state and Context API for client state.

## Directory Structure

- `providers/`: Context providers for various types of state
  - `AppProviders.tsx`: Combined providers for easy application setup
  - `AuthProvider.tsx`: Authentication state management
  - `ThemeProvider.tsx`: Theme state management
  - `PreferencesProvider.tsx`: User preferences state management
  - `QueryProvider.tsx`: React Query configuration

- `hooks/`: Custom hooks for accessing state
  - `useAuth.ts`: Hook for authentication state
  - `useUser.ts`: Hook for user data
  - `useRecipes.ts`: Hooks for recipe data
  - `usePreferences.ts`: Hook for user preferences
  - `useModal.ts`: Utility hook for modal state

- `queries/`: React Query definitions
  - `recipes.ts`: Recipe-related queries and mutations
  - `users.ts`: User-related queries and mutations

- `utils/`: Utility functions
  - `storage.ts`: Local storage utilities
  - `transforms.ts`: Data transformation utilities

## Usage

### Setting Up Providers

Import the `Providers` component from `src/state/providers` and wrap your application:

```tsx
import { Providers } from "@/state/providers"

export default function App({ children }) {
  return (
    <Providers>
      {children}
    </Providers>
  )
}
```

### Using State Hooks

Import hooks from `src/state` to access different types of state:

```tsx
import { useAuth, useRecipes, usePreferences } from "@/state"

function MyComponent() {
  const { user } = useAuth()
  const { recipes } = useRecipes()
  const { favoriteRecipes, addFavorite } = usePreferences()
  
  // ...
}
```

### Query Keys

React Query keys are standardized and exported for consistent cache invalidation:

```tsx
import { recipeKeys, userKeys } from "@/state"

queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
```

## Best Practices

1. **Server vs Client State**: Use React Query for server data, Context for UI state
2. **Invalidation**: Use the standardized query keys for cache invalidation
3. **Persistence**: User preferences are automatically persisted to localStorage
4. **Type Safety**: All state is properly typed with TypeScript 