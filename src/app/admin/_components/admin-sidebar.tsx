
'use client'

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/icons"
import { Calendar, Heart, Users, LayoutDashboard, LogOut, Settings, ClipboardList, Clock, Building, MessageSquare } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

export function AdminSidebar() {
  const pathname = usePathname()
  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/schedule", label: "Full Schedule", icon: Calendar },
    { href: "/admin/my-schedule", label: "My Schedule", icon: ClipboardList },
    { href: "/admin/availability", label: "Availability", icon: Clock },
    { href: "/admin/messaging", label: "Team Chat", icon: MessageSquare },
    { href: "/admin/horses", label: "Horses", icon: Heart },
    { href: "/admin/instructors", label: "Instructors", icon: Users },
    { href: "/admin/rentals", label: "Museum Rentals", icon: Building },
  ]
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between">
            <Logo className="h-7 w-auto" />
            <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={{ children: "Settings" }}>
                <Settings />
                <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/" tooltip={{ children: "Log Out" }}>
                <LogOut />
                <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
