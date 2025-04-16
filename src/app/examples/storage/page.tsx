'use client'

import { RecipeFormExample, FilterPanelExample, SearchPageExample } from '@/state/examples/StorageExamples'

export default function StorageExamplesPage() {
  return (
    <div className="container mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold mb-6">Storage Hooks Examples</h1>
      
      <section className="p-6 bg-card rounded-lg shadow">
        <RecipeFormExample />
      </section>
      
      <section className="p-6 bg-card rounded-lg shadow">
        <FilterPanelExample />
      </section>
      
      <section className="p-6 bg-card rounded-lg shadow">
        <SearchPageExample />
      </section>
      
      <div className="mt-8 p-4 bg-muted rounded-md">
        <h2 className="text-xl font-semibold mb-2">How These Examples Work</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Recipe Form Example</strong>: Uses <code>useDraft</code> to persist form data in localStorage. 
            Try entering data, refreshing the page, and notice your data is still there!
          </li>
          <li>
            <strong>Filter Panel Example</strong>: Uses <code>useSessionStorage</code> to remember UI state during your session.
            The panel state persists through refreshes but is cleared when you close the browser.
          </li>
          <li>
            <strong>Search Example</strong>: Uses <code>useUrlState</code> to store filters in the URL.
            Notice how the URL updates as you change filters, and how you can share this URL to preserve your filters.
          </li>
        </ul>
      </div>
    </div>
  )
} 