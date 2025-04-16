"use client"

import { useAuth } from "@/state/hooks/useAuth"
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
  User,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" 
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function NavUser() {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const { user, isLoading, signOut } = useAuth()
  
  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  // Show loading state or sign in button based on auth state
  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          {/* Optional: Add a subtle loading indicator here */}
          <div className="h-10 w-full animate-pulse rounded-md bg-muted/50" />
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }
  
  if (!user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={() => router.push('/login')}
          >
            <div className="relative">
              <User className="mr-2 h-4 w-4" />
              <div className="absolute -bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-orange-500" />
            </div>
            Sign In
          </Button>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  const email = user.email || ''
  const display_name = user.user_metadata?.display_name

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {display_name?.[0]?.toUpperCase() || email[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {display_name || 'User'}
                </span>
                <span className="truncate text-xs">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {display_name?.[0]?.toUpperCase() || email[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {display_name || 'User'}
                  </span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck className="mr-2 h-4 w-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
