import { Locale } from "@/middleware"
import { getDictionary } from "@/dictionaries"
import { formatMessage } from "@/utils/server-dictionary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ServerTranslationDemoProps {
  locale: Locale
}

export async function ServerTranslationDemo({ locale }: ServerTranslationDemoProps) {
  // Get dictionary directly in the server component
  const dictionary = await getDictionary(locale)
  
  // Format a message with variables
  const authoredMessage = formatMessage(
    dictionary.recipe.authoredBy, 
    { author: 'Server Chef' }
  )
  
  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>{dictionary.common.language}: {locale}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">{dictionary.recipe.title}</h3>
          <p>{dictionary.recipe.description}</p>
        </div>
        
        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">{dictionary.recipe.ingredients}</h3>
          <ul className="list-disc pl-6">
            <li>Server Item 1</li>
            <li>Server Item 2</li>
            <li>Server Item 3</li>
          </ul>
        </div>
        
        <div className="flex items-center justify-between">
          <span>
            {dictionary.recipe.cookingTime}: 45 {dictionary.recipe.minutes}
          </span>
          <span>
            {authoredMessage}
          </span>
        </div>
      </CardContent>
    </Card>
  )
} 