import { SidebarLayout } from "@/components/layouts/SidebarLayout"

export default function Page() {
  return (
    <SidebarLayout
      breadcrumbs={[
        { label: "Building Your Application", href: "#" },
        { label: "Data Fetching", isCurrentPage: true }
      ]}
    >
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </SidebarLayout>
  )
}
