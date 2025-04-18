import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Locale } from '@/middleware'
import { Loader } from '@/components/ui/loader'
import { fetchRecipe } from '@/services/recipes'
import { TranslationManager } from '@/components/recipes/TranslationManager'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LocalizedLink } from '@/components/i18n/LocalizedLink'

interface TranslatePageProps {
  params: {
    lang: Locale
    handle: string
  }
}

export default function TranslatePage({ params }: TranslatePageProps) {
  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          asChild
        >
          <LocalizedLink href={`/recipes/${params.handle}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to Recipe
          </LocalizedLink>
        </Button>
        <h1 className="text-2xl font-bold ml-4">Manage Translations</h1>
      </div>
      
      <Separator className="my-6" />
      
      <Suspense fallback={<Loader />}>
        <TranslationContent params={params} />
      </Suspense>
    </div>
  )
}

async function TranslationContent({ params }: TranslatePageProps) {
  const recipe = await fetchRecipe(params.handle)
  
  if (!recipe) {
    return notFound()
  }
  
  return (
    <TranslationManager
      recipe={{
        ...recipe,
        user: recipe.user ?? null, // Convert undefined to null
        ingredients: recipe.ingredients ?? [], // Ensure ingredients is never undefined
        instructions: recipe.instructions ?? [] // Ensure instructions is never undefined
      }}
      locale={params.lang}
    />
  )
}