import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function RecipeLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header Loading */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-2/3" />
          <div className="flex items-center gap-2 ml-auto">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-full" />
      </div>

      {/* Image and Quick Info Loading */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <Skeleton className="aspect-[16/9] w-full rounded-lg mb-6" />
          <div className="flex gap-4 justify-center">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-32" />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Ingredients Loading */}
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-6 w-1/4" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions Loading */}
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 