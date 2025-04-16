import { SidebarLayout } from "@/components/layouts/SidebarLayout"
import AllRecipes from "@/components/blocks/AllRecipes"

export default function AllRecipesPage() {
  return (
    <SidebarLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "All Recipes", isCurrentPage: true }
      ]}
    >
      <AllRecipes />
    </SidebarLayout>
  )
}
