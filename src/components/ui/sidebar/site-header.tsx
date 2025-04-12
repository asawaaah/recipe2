import * as React from "react"
import { ChefHat } from "lucide-react"
import Link from "next/link"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link href="/" className="w-full">
          <SidebarMenuButton size="lg">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <ChefHat className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">My recipes</span>
              <span className="truncate text-xs">Best cookbook ever!</span>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  )
} 