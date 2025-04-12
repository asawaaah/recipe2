import { AppSidebar } from "@/components/ui/sidebar/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { RecipeCard } from "@/components/blocks/RecipeCard"
import { SearchForm } from "@/components/ui/sidebar/search-form"

// Placeholder data for development
const placeholderRecipes = Array.from({ length: 8 }, (_, i) => ({
  id: `placeholder-${i + 1}`,
  title: `Chocolate Fondant ${i + 1}`,
  description:
    "A decadent chocolate fondant with a perfectly gooey center. This classic French dessert is pure chocolate heaven.",
  cookingTime: 15,
  servings: 1,
  imageUrl: "/images/recipes/chocolate-fondant.jpg",
}))

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>All Recipes</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto w-full max-w-[180px] md:max-w-[400px]">
              <SearchForm />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {placeholderRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                description={recipe.description}
                cookingTime={recipe.cookingTime}
                servings={recipe.servings}
                imageUrl={recipe.imageUrl}
              />
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
