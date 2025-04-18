"use client"

import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher"
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavLanguage() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex justify-center">
        <LanguageSwitcher compact={isCollapsed} />
      </SidebarMenuItem>
    </SidebarMenu>
  )
} 