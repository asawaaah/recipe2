import { Clock, Users } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { LocalizedLink } from "@/components/i18n/LocalizedLink"
import { useLang } from "@/app/providers"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface RecipeCardProps {
  id: string
  title: string
  description: string
  cookingTime?: number | null
  servings?: number | null
  imageUrl?: string | null
  className?: string
  listView?: boolean
  handle: string
  translations?: Array<{
    locale: string
    handle: string
  }>
}

export function RecipeCard({
  id,
  title,
  description,
  cookingTime,
  servings,
  imageUrl,
  className,
  listView = false,
  handle,
  translations = [],
}: RecipeCardProps) {
  const currentLang = useLang()
  
  // Get the localized handle if available, otherwise use the default handle
  const localizedHandle = translations.find(t => t.locale === currentLang)?.handle || handle
  
  // For grid view, we use the original layout
  if (!listView) {
    return (
      <LocalizedLink href={`/recipes/${localizedHandle}`}>
        <Card className={cn(
          "h-full overflow-hidden transition-all hover:shadow-lg flex flex-col",
          className
        )}>
          {imageUrl && (
            <div className="relative aspect-video w-full">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          <div className="flex flex-col flex-1 justify-between">
            <CardHeader className="px-2">
              <CardTitle className="line-clamp-2">{title}</CardTitle>
              <CardDescription className="line-clamp-2">{description}</CardDescription>
            </CardHeader>
            <CardContent className="p-2 pb-4 pt-0 mt-auto">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {cookingTime && (
                  <div className="flex items-center gap-1 min-w-[80px]">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span>{cookingTime} min</span>
                  </div>
                )}
                {servings && (
                  <div className="flex items-center gap-1 min-w-[80px]">
                    <Users className="h-4 w-4 flex-shrink-0" />
                    <span>{servings} servings</span>
                  </div>
                )}
              </div>
            </CardContent>
          </div>
        </Card>
      </LocalizedLink>
    )
  }
  
  // For list view, we use a different layout with image on the right
  return (
    <LocalizedLink href={`/recipes/${localizedHandle}`}>
      <Card className={cn(
        "overflow-hidden transition-all hover:shadow-lg h-24 flex flex-row items-center justify-between",
        className
      )}>
        <div className="flex-1 h-full py-2">
          <CardHeader className="py-0 px-2 space-y-1">
            <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
            <CardDescription className="line-clamp-1">{description}</CardDescription>
          </CardHeader>
          <CardContent className="p-2 py-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {cookingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span>{cookingTime} min</span>
                </div>
              )}
              {servings && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 flex-shrink-0" />
                  <span>{servings} servings</span>
                </div>
              )}
            </div>
          </CardContent>
        </div>
        {imageUrl ? (
          <div className="relative h-full w-24 overflow-hidden flex-shrink-0">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        ) : (
          // Empty placeholder to maintain consistent padding when no image
          <div className="w-6 h-full flex-shrink-0"></div>
        )}
      </Card>
    </LocalizedLink>
  )
} 