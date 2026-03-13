"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  BookOpen,
  LayoutDashboard,
  MessageSquare,
  Trophy,
  FileText,
  Users,
  BarChart3,
  Settings,
  BookMarked,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "STUDENT" | "STAFF" | "ADMIN";

const studentNav = [
  { label: "Dashboard", href: "/student", icon: LayoutDashboard },
  { label: "My Courses", href: "/student/courses", icon: BookOpen },
  { label: "Assignments", href: "/student/assignments", icon: FileText },
  { label: "Progress", href: "/student/progress", icon: Trophy },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Resources", href: "/resources", icon: BookMarked },
];

const staffNav = [
  { label: "Dashboard", href: "/staff", icon: LayoutDashboard },
  { label: "My Students", href: "/staff/students", icon: Users },
  { label: "Wellness", href: "/staff/wellness", icon: Heart },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Resources", href: "/resources", icon: BookMarked },
];

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Forms", href: "/admin/forms", icon: FileText },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const navByRole: Record<Role, typeof studentNav> = {
  STUDENT: studentNav,
  STAFF: staffNav,
  ADMIN: adminNav,
};

interface AppSidebarProps {
  role: Role;
  userName: string;
}

export function AppSidebar({ role, userName }: AppSidebarProps) {
  const pathname = usePathname();
  const nav = navByRole[role];

  return (
    <aside className="flex h-screen w-64 flex-col bg-black text-white fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight">
            One Refugee
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {nav.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/student" || href === "/staff" || href === "/admin"
              ? pathname === href
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[#E07B39] text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-white/10 px-4 py-4 flex items-center gap-3">
        <UserButton />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{userName}</p>
          <p className="text-xs text-white/50 capitalize">{role.toLowerCase()}</p>
        </div>
      </div>
    </aside>
  );
}
