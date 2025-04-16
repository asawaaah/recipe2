# Recipe2 State Management Guide

This document outlines the state management approach used in the Recipe2 application. It provides guidelines for when to use each type of state management and includes examples for reference.

## Table of Contents

1. [Types of State](#types-of-state)
2. [When to Use Each Approach](#when-to-use-each-approach)
3. [Guidelines for Adding New State](#guidelines-for-adding-new-state)
4. [Examples](#examples)
5. [Directory Structure](#directory-structure)

## Types of State

Recipe2 manages different types of application state using specialized tools for each:

### 1. Server State

**Definition**: Data that exists on the server which needs to be synchronized with the client.

**Examples**:
- Recipe data from the database
- User profiles
- Comments
- Tags

**Management Tool**: React Query (TanStack Query)

### 2. UI State

**Definition**: State that controls the UI but doesn't need to be persisted to the server.

**Examples**:
- Modal open/closed state
- Tab selections
- Accordion expansions
- Toast notifications

**Management Tool**: React's useState or custom hooks like useModal

### 3. User Preferences

**Definition**: User-specific settings that persist across sessions.

**Examples**:
- Theme preferences (dark/light mode)
- UI density settings
- Favorite recipes
- View mode preferences (grid/list)

**Management Tool**: React Context (PreferencesProvider) with localStorage persistence

### 4. Form State

**Definition**: Data captured from forms, often with multiple steps, validation, and persistence.

**Examples**:
- Recipe creation/editing form
- Profile editing form
- Registration forms

**Management Tool**: Custom form hooks (useRecipeForm, useProfileForm) with localStorage drafts

### 5. URL State

**Definition**: State that is reflected in and controlled by the URL.

**Examples**:
- Search queries
- Filter parameters
- Current page number
- Sort order

**Management Tool**: Custom useUrlState hook

### 6. Session State

**Definition**: Temporary state that persists during a browser session but is cleared on closing.

**Examples**:
- Filter panel open/closed state
- Tutorial progress
- Temporary UI preferences

**Management Tool**: useSessionStorage hook

## When to Use Each Approach

### Use React Query For:

- Any data that comes from or must be synchronized with the server
- Data that needs to be cached, refetched, or invalidated
- Shared data that multiple components need access to
- Data that requires background refetching or polling

```tsx
// Example: Fetching recipes with React Query
function RecipeList() {
  const { data: recipes, isLoading } = useRecipes();
  
  if (isLoading) return <Spinner />;
  
  return (
    <div>
      {recipes.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
```

### Use React Context For:

- Theme and appearance settings
- User authentication state
- Application-wide preferences
- Any state that many components need access to, but doesn't come from the server

```tsx
// Example: Accessing theme preferences from context
function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </button>
  );
}
```

### Use Local Component State (useState) For:

- Component-specific UI state
- State that doesn't need to be shared between components
- Temporary data that doesn't need persistence

```tsx
// Example: Toggle state in a component
function Accordion({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>{title}</button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}
```

### Use Form Hooks For:

- Multi-step forms
- Forms that need validation
- Forms that need draft saving
- Complex form logic

```tsx
// Example: Using a form hook
function RecipeForm() {
  const { formData, errors, updateBasicInfo, addIngredient, nextStep } = useRecipeForm();
  
  return (
    <form>
      <input 
        value={formData.title} 
        onChange={e => updateBasicInfo({ title: e.target.value })}
      />
      {errors.title && <p>{errors.title}</p>}
      {/* Form fields and controls */}
    </form>
  );
}
```

### Use URL State For:

- Search parameters
- Filter settings that should be shareable
- Any state that should be bookmarkable or shareable via URL

```tsx
// Example: Managing filter state in the URL
function RecipeFilter() {
  const { setParam, getParam, clearParams } = useUrlState();
  const category = getParam('category') || '';
  
  return (
    <div>
      <select 
        value={category}
        onChange={e => setParam('category', e.target.value)}
      >
        <option value="">All</option>
        <option value="breakfast">Breakfast</option>
        <option value="dinner">Dinner</option>
      </select>
      <button onClick={clearParams}>Clear Filters</button>
    </div>
  );
}
```

### Use Session Storage For:

- State that should persist during a browsing session
- UI state that should survive page refreshes but doesn't need long-term storage

```tsx
// Example: Remembering panel state during session
function FilterPanel() {
  const [isOpen, setIsOpen] = useSessionStorage('filter_panel', false);
  
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Hide Filters' : 'Show Filters'}
      </button>
      {isOpen && <div>{/* Filter controls */}</div>}
    </div>
  );
}
```

## Guidelines for Adding New State

When adding new state to the application, follow these guidelines:

### 1. Identify the Type of State

Ask yourself:
- Is this data from a server? → Use React Query
- Is this user preference data? → Use PreferencesProvider
- Is this form data? → Use a form hook
- Is this UI-only state? → Use useState or a UI hook
- Should this state be shareable via URL? → Use useUrlState
- Is this temporary session state? → Use useSessionStorage

### 2. Choose the Right Level of State

Ask yourself:
- Does only one component need this state? → Use local state
- Do multiple related components need this state? → Use a custom hook
- Does the entire app need this state? → Use context or React Query

### 3. Consider Persistence Needs

Ask yourself:
- Should this state persist across page refreshes? → Use localStorage or useSessionStorage
- Should this state persist across browser sessions? → Use localStorage
- Should this state be shareable? → Use URL state

### 4. Follow Existing Patterns

- Look at similar features and follow the same patterns
- Reuse existing hooks and utilities when possible
- Keep consistent naming conventions

### 5. Create Specialized Hooks for Complex State

If state logic involves:
- Multiple related pieces of state
- Complex validation
- Side effects
- Persistence logic

Then create a custom hook to encapsulate this logic.

## Examples

### Server State with React Query

```tsx
// src/state/queries/recipes.ts
export const recipeKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: (filters: RecipeFilters) => [...recipeKeys.lists(), filters] as const,
  details: () => [...recipeKeys.all, 'detail'] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
};

export function useRecipes(filters?: RecipeFilters) {
  const supabase = createClient();
  
  return useQuery({
    queryKey: recipeKeys.list(filters || {}),
    queryFn: async () => {
      let query = supabase.from('recipes').select('*');
      
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });
}

// Usage in a component
function RecipeList({ category }) {
  const { data, isLoading } = useRecipes({ category });
  
  if (isLoading) return <Spinner />;
  
  return (
    <div>
      {data.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
```

### UI State with Context

```tsx
// src/state/providers/PreferencesProvider.tsx
export function PreferencesProvider({ children }) {
  const [recipeViewMode, setRecipeViewMode] = useState(
    getStorageItem(STORAGE_KEYS.RECIPE_VIEW_MODE, 'grid')
  );
  
  // Persist to localStorage when changed
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.RECIPE_VIEW_MODE, recipeViewMode);
  }, [recipeViewMode]);
  
  return (
    <PreferencesContext.Provider value={{
      recipeViewMode,
      setRecipeViewMode,
      // Other preferences...
    }}>
      {children}
    </PreferencesContext.Provider>
  );
}

// Usage in a component
function ViewToggle() {
  const { recipeViewMode, setRecipeViewMode } = usePreferences();
  
  return (
    <div>
      <button 
        className={recipeViewMode === 'grid' ? 'active' : ''}
        onClick={() => setRecipeViewMode('grid')}
      >
        Grid
      </button>
      <button 
        className={recipeViewMode === 'list' ? 'active' : ''}
        onClick={() => setRecipeViewMode('list')}
      >
        List
      </button>
    </div>
  );
}
```

### Form State with Custom Hooks

```tsx
// src/state/hooks/useRecipeForm.ts
export function useRecipeForm(initialData?: Partial<Recipe>) {
  const [activeStep, setActiveStep] = useState(0);
  const { draft: formData, updateDraft, clearDraft } = useDraft(
    STORAGE_KEYS.DRAFT_RECIPE,
    initialData || { title: '', ingredients: [] }
  );
  const [errors, setErrors] = useState({});
  
  const validateCurrentStep = () => {
    // Validation logic...
    return isValid;
  };
  
  const nextStep = () => {
    if (validateCurrentStep()) {
      setActiveStep(prev => prev + 1);
    }
  };
  
  // More form logic...
  
  return {
    formData,
    errors,
    activeStep,
    nextStep,
    // Other properties and methods...
  };
}

// Usage in a component
function RecipeCreator() {
  const { formData, activeStep, nextStep, updateBasicInfo } = useRecipeForm();
  
  return (
    <div>
      {activeStep === 0 && (
        <div>
          <input
            value={formData.title}
            onChange={e => updateBasicInfo({ title: e.target.value })}
          />
          <button onClick={nextStep}>Next</button>
        </div>
      )}
      {/* Other steps */}
    </div>
  );
}
```

### URL State with Custom Hooks

```tsx
// src/state/utils/url.ts
export function useUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const setParam = useCallback((key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === undefined || value === null || value === '') {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    
    const newSearch = params.toString();
    const query = newSearch ? `?${newSearch}` : '';
    
    router.push(`${pathname}${query}`);
  }, [searchParams, pathname, router]);
  
  // More URL state methods...
  
  return {
    setParam,
    getParam: key => searchParams.get(key),
    // Other methods...
  };
}

// Usage in a component
function RecipeSearch() {
  const { setParam, getParam } = useUrlState();
  const query = getParam('q') || '';
  
  return (
    <div>
      <input
        value={query}
        onChange={e => setParam('q', e.target.value)}
        placeholder="Search recipes..."
      />
    </div>
  );
}
```

## Directory Structure

The state management code is organized in the `src/state` directory:

```
src/state/
├── hooks/              # Custom hooks for state management
│   ├── useAuth.ts      # Authentication state
│   ├── useRecipes.ts   # Recipe data adapters
│   ├── useRecipeForm.ts# Recipe form state
│   ├── useProfileForm.ts# Profile form state
│   ├── useDraft.ts     # Draft persistence hook
│   ├── useModal.ts     # Modal state hook
│   ├── useSessionStorage.ts # Session storage hook
│   └── index.ts        # Export all hooks
├── providers/          # React Context providers
│   ├── AuthProvider.tsx# Authentication provider
│   ├── PreferencesProvider.tsx # User preferences provider
│   ├── ThemeProvider.tsx # Theme provider
│   ├── QueryProvider.tsx # React Query provider
│   └── index.tsx       # Combined providers
├── queries/            # React Query definitions
│   ├── recipes.ts      # Recipe queries and mutations
│   ├── users.ts        # User queries and mutations
│   └── index.ts        # Export all queries
├── utils/              # Utility functions
│   ├── storage.ts      # localStorage utilities
│   ├── url.ts          # URL state utilities
│   └── transforms.ts   # Data transformation utilities
└── index.ts            # Main exports
```

For more detailed examples and implementation details, refer to the source code in the respective directories.

## Conclusion

By following these guidelines and using the appropriate state management tools for each type of state, we maintain a clean, predictable, and maintainable codebase. This approach scales well as the application grows, provides a good developer experience, and ensures a responsive user experience. 