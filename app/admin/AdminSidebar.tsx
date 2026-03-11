"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signOutAction } from "./actions";
import {
  FileText,
  Users,
  Wrench,
  Building2,
  Tag,
  FolderOpen,
  MessageSquare,
  LogOut,
  ExternalLink,
  UserCircle,
  ScrollText,
  Settings2,
  MapPin,
  Home,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import acroLogo from "@/assets/acro-logo.png";
import type { UserProfile, PermissionKey } from "@/lib/rbac";
import { Badge } from "@/components/ui/badge";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  permission?: PermissionKey | "admin_only";
};

const navItems: NavItem[] = [
  { label: "Home Page",    href: "/admin/home",     icon: Home,               permission: "admin_only" },
  { label: "Settings",     href: "/admin/settings", icon: SlidersHorizontal,  permission: "admin_only" },
  { label: "Posts", href: "/admin/posts", icon: FileText, permission: "posts" },
  {
    label: "Services",
    href: "/admin/services",
    icon: Wrench,
    permission: "services",
  },
  {
    label: "Industries",
    href: "/admin/industries",
    icon: Building2,
    permission: "industries",
  },
  { label: "Brands", href: "/admin/brands", icon: Tag, permission: "brands" },
  // { label: "Projects",     href: "/admin/projects",     icon: FolderOpen,    permission: "projects" },
  { label: "Locations", href: "/admin/locations", icon: MapPin, permission: "locations" },
  {
    label: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquare,
    permission: "testimonials",
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
    permission: "admin_only",
  },
  {
    label: "Logs",
    href: "/admin/logs",
    icon: ScrollText,
    permission: "admin_only",
  },
  {
    label: "Maintenance",
    href: "/admin/maintenance",
    icon: Settings2,
    permission: "admin_only",
  },
];

function canSeeItem(item: NavItem, profile: UserProfile): boolean {
  if (profile.role === "admin") return true;
  if (item.permission === "admin_only") return false;
  if (!item.permission) return true;
  return profile.permissions.includes(item.permission);
}

export default function AdminSidebar({
  userEmail,
  profile,
}: {
  userEmail: string;
  profile: UserProfile;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    await signOutAction();
    router.push("/admin/login");
    router.refresh();
  };

  const visibleItems = navItems.filter((item) => canSeeItem(item, profile));

  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-zinc-950 flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Image
            src={acroLogo}
            alt="Acro Refrigeration"
            width={36}
            height={36}
            className="rounded-full flex-shrink-0"
          />
          <div>
            <p className="text-white font-semibold text-sm leading-none">
              Acro Refrigeration
            </p>
            <p className="text-zinc-500 text-xs mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visibleItems.map(({ label, href, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-zinc-800 space-y-0.5">
        {/* Profile link (employees) */}
        {profile.role === "employee" && (
          <Link
            href="/admin/profile"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              pathname === "/admin/profile"
                ? "bg-primary text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <UserCircle className="w-4 h-4 flex-shrink-0" />
            My Profile
          </Link>
        )}

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          View Site
        </Link>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign Out
        </button>
        <div className="px-3 pt-3 space-y-1">
          <p className="text-xs text-zinc-600 truncate">{userEmail}</p>
          <Badge
            variant={profile.role === "admin" ? "default" : "secondary"}
            className="text-xs"
          >
            {profile.role === "admin" ? "Administrator" : "Employee"}
          </Badge>
        </div>
      </div>
    </aside>
  );
}
