'use client'

import { RecipeFormExample, ProfileFormExample } from '@/state/examples/FormExamples'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function FormExamplesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Complex Form Examples</h1>
      
      <Tabs defaultValue="recipe" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="recipe">Recipe Form</TabsTrigger>
          <TabsTrigger value="profile">Profile Form</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recipe">
          <div className="bg-muted p-4 rounded-lg mb-6">
            <h2 className="text-lg font-medium mb-2">About this example</h2>
            <p>
              This example demonstrates a multi-step form with validation, state persistence, and complex state management. 
              It uses the <code>useRecipeForm</code> hook which leverages <code>useDraft</code> for automatic 
              localStorage persistence. Try refreshing the page - your form data will be retained!
            </p>
          </div>
          <RecipeFormExample />
        </TabsContent>
        
        <TabsContent value="profile">
          <div className="bg-muted p-4 rounded-lg mb-6">
            <h2 className="text-lg font-medium mb-2">About this example</h2>
            <p>
              This example shows a profile editing form that handles both textual data and file uploads. 
              It uses the <code>useProfileForm</code> hook which validates inputs and manages the state between 
              edits. The form state is also auto-saved as you type.
            </p>
          </div>
          <ProfileFormExample />
        </TabsContent>
      </Tabs>
    </div>
  )
} 