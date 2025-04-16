'use client'

import { STORAGE_KEYS } from '../utils/storage'
import { useDraft } from '../hooks/useDraft'
import { useSessionStorage } from '../hooks/useSessionStorage'
import { useUrlState } from '../utils/url'

// Define types for the recipe form
interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

interface RecipeDraft {
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
}

/**
 * Example of using useDraft to persist a recipe form
 */
export function RecipeFormExample() {
  // Define initial state for the recipe draft
  const initialRecipe: RecipeDraft = {
    title: '',
    description: '',
    ingredients: [],
    instructions: []
  }
  
  // Use the useDraft hook to persist the form state
  const { draft, updateDraft, clearDraft } = useDraft<RecipeDraft>(
    STORAGE_KEYS.DRAFT_RECIPE,
    initialRecipe
  )
  
  // Update a single field in the draft
  const updateField = (field: keyof RecipeDraft, value: any) => {
    updateDraft(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // Add an ingredient
  const addIngredient = (ingredient: Ingredient) => {
    updateDraft(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredient]
    }))
  }
  
  // Handle form submission
  const handleSubmit = () => {
    // Use the draft data to submit the form
    console.log('Submitting recipe:', draft)
    
    // After successful submission, clear the draft
    clearDraft()
  }
  
  return (
    <div>
      <h2>Recipe Form with Auto-Save</h2>
      <input
        value={draft.title}
        onChange={e => updateField('title', e.target.value)}
        placeholder="Recipe title"
      />
      {/* More form fields */}
      <button onClick={handleSubmit}>Submit Recipe</button>
      <button onClick={clearDraft}>Clear Draft</button>
    </div>
  )
}

/**
 * Example of using useSessionStorage for ephemeral UI state
 */
export function FilterPanelExample() {
  // Use sessionStorage for filter panel state that's only needed during the current browser session
  const [isFilterOpen, setIsFilterOpen] = useSessionStorage('filter_panel_open', false)
  
  return (
    <div>
      <button onClick={() => setIsFilterOpen(!isFilterOpen)}>
        {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
      </button>
      
      {isFilterOpen && (
        <div className="filter-panel">
          {/* Filter controls */}
        </div>
      )}
    </div>
  )
}

/**
 * Example of using useUrlState for shareable filter state
 */
export function SearchPageExample() {
  const { setParam, getParam, clearParams } = useUrlState()
  
  // Get current filter values from URL
  const query = getParam('q') || ''
  const category = getParam('category') || ''
  
  // Handle search input
  const handleSearch = (searchQuery: string) => {
    setParam('q', searchQuery)
  }
  
  // Handle category selection
  const handleCategoryChange = (selectedCategory: string) => {
    setParam('category', selectedCategory)
  }
  
  // Clear all filters
  const handleClearFilters = () => {
    clearParams()
  }
  
  return (
    <div>
      <h2>Recipe Search</h2>
      <input
        value={query}
        onChange={e => handleSearch(e.target.value)}
        placeholder="Search recipes..."
      />
      
      <select 
        value={category}
        onChange={e => handleCategoryChange(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="breakfast">Breakfast</option>
        <option value="lunch">Lunch</option>
        <option value="dinner">Dinner</option>
      </select>
      
      <button onClick={handleClearFilters}>Clear Filters</button>
      
      {/* Search results would go here */}
    </div>
  )
} 