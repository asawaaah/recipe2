"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function HeaderSearch({ ...props }: React.ComponentProps<"form">) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <div className="px-2 py-2">
      <form {...props}>
        <div className="relative">
          <Label htmlFor="header-search" className="sr-only">
            Search
          </Label>
          <Input
            ref={inputRef}
            id="header-search"
            placeholder="Type to search..."
            className="h-8 pl-7"
          />
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
        </div>
      </form>
    </div>
  )
} 