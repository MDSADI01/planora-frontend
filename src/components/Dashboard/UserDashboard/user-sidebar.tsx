"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarPlus2,
  CalendarCheck2,
  LayoutDashboard,
  MessageSquareText,
  UserCircle2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Profile",
    url: "/profile",
    icon: UserCircle2,
  },
  {
    title: "My Events",
    url: "/my-events",
    icon: CalendarCheck2,
  },
  {
    title: "Pending Invitations",
    url: "/pending-invitations",
    icon: LayoutDashboard,
  },
  {
    title: "My Reviews",
    url: "/my-reviews",
    icon: MessageSquareText,
  },
  {
    title: "Add Events",
    url: "/add-events",
    icon: CalendarPlus2,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="px-2 py-1">
          <p className="text-sm text-muted-foreground">User Dashboard</p>
          <p className="text-lg font-semibold">Planora</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
