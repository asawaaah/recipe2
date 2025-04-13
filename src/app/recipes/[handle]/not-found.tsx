import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function RecipeNotFound() {
  return (
    <div className="container mx-auto py-16 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Recipe Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Sorry, we couldn't find the recipe you're looking for. It may have been removed or the URL might be incorrect.
          </p>
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/recipes">
                Browse All Recipes
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 