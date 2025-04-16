"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Utensils,
  Command,
  Frame,
  ChefHat,
  Map,
  PieChart,
  Settings2,
  CookingPot,
} from "lucide-react"

import { NavMain } from "@/components/ui/sidebar/nav-main"
import { NavProjects } from "@/components/ui/sidebar/nav-projects"
import { NavUser } from "@/components/ui/sidebar/nav-user"
import { SiteHeader } from "@/components/ui/sidebar/site-header"
import { SearchForm } from "@/components/ui/sidebar/search-form"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  navMain: [
    {
      title: "My recipes",
      url: "/my-cookbook",
      icon: CookingPot,
      isActive: true,
      items: [
        {
          title: "Pizza dough",
          url: "/recipes/pizza-dough-by-john-doe",
        },
        {
          title: "Main courses",
          url: "/my-cookbook",
        },
        {
          title: "Desserts",
          url: "/my-cookbook",
        },
      ],
    },
    {
      title: "All recipes",
      url: "/all-recipes",
      icon: Utensils,
      isActive: true,
      items: [
        {
          title: "By country",
          url: "#",
        },
        {
          title: "By diet",
          url: "#",
        },
        {
          title: "By type",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SiteHeader />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
