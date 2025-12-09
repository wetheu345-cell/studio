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
  SidebarRail,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/icons"
import { Calendar, Heart, Users, LayoutDashboard, LogOut, Settings, ClipboardList, Clock, Building, MessageSquare } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useUser } from "@/firebase"

export function AdminSidebar() {
  const pathname = usePathname()
  const { user } = useUser();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ['Admin', 'Manager', 'Instructor'] },
    { href: "/admin/schedule", label: "Full Schedule", icon: Calendar, roles: ['Admin', 'Manager'] },
    { href: "/admin/my-schedule", label: "My Schedule", icon: ClipboardList, roles: ['Admin', 'Instructor'] },
    { href: "/admin/availability", label: "Availability", icon: Clock, roles: ['Admin', 'Instructor'] },
    { href: "/admin/messaging", label: "Team Chat", icon: MessageSquare, roles: ['Admin', 'Manager', 'Instructor'] },
    { href: "/admin/horses", label: "Horses", icon: Heart, roles: ['Admin', 'Manager'] },
    { href: "/admin/instructors", label: "Instructors", icon: Users, roles: ['Admin', 'Manager'] },
    { href: "/admin/rentals", label: "Museum Rentals", icon: Building, roles: ['Admin', 'Manager'] },
  ]

  const accessibleNavItems = navItems.filter(item => user?.role && item.roles.includes(user.role));

  return (
    <Sidebar collapsible="icon" variant="floating">
        <SidebarRail />
        <SidebarHeader>
            <div className="flex items-center justify-between">
                <Logo className="h-7 w-auto" />
                <SidebarTrigger />
            </div>
        </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {accessibleNavItems.map((item) => (
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
             <SidebarMenuButton tooltip={{ children: "Log Out" }}>
                <LogOut />
                <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
