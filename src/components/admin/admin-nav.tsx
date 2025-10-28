"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Hospital,
  Users,
  UserCog,
  Calendar,
  BarChart3,
  Settings,
  FileText,
  Building2,
  Activity,
  LogOut,
  Heart,
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Hospitals",
    href: "/admin/hospitals",
    icon: Hospital,
  },
  {
    title: "Doctors",
    href: "/admin/doctors",
    icon: UserCog,
  },
  {
    title: "Departments",
    href: "/admin/departments",
    icon: Building2,
  },
  {
    title: "Appointments",
    href: "/admin/appointments",
    icon: Calendar,
  },
  {
    title: "Patients",
    href: "/admin/patients",
    icon: Users,
  },
  {
    title: "Queue Management",
    href: "/admin/queue",
    icon: Activity,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 h-screen w-64 border-r bg-white">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="border-b p-6">
          <Link href="/admin" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <div>
              <p className="text-lg font-bold">MediQueue</p>
              <p className="text-xs text-gray-600">Admin Portal</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t p-4">
          <form action="/api/auth/signout" method="POST">
            <Button variant="ghost" className="w-full justify-start gap-3 text-red-600">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </div>
    </aside>
  );
}

