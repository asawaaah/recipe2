"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { Label } from "@/components/ui/label"
import {
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { state, setOpen } = useSidebar()

  const handleSearchClick = () => {
    if (state === "collapsed") {
      setOpen(true)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }

  if (state === "collapsed") {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={handleSearchClick}
            className="h-8"
          >
            <Search className="size-4 shrink-0 opacity-50" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <div className="px-2 py-2">
      <form {...props}>
        <div className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            ref={inputRef}
            id="search"
            placeholder="Type to search..."
            className="h-8 pl-7"
          />
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
        </div>
      </form>
    </div>
  )
}
