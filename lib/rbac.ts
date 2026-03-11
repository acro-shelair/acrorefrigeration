export type Role = "admin" | "employee";

export interface UserProfile {
  user_id: string;
  role: Role;
  permissions: PermissionKey[];
}

// All assignable permission keys — must match admin sidebar sections
export const PERMISSION_KEYS = [
  "posts",
  "services",
  "industries",
  "brands",
  "projects",
  "testimonials",
  "locations",
  "portal",
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  posts:        "Posts",
  services:     "Services",
  industries:   "Industries",
  brands:       "Brands",
  projects:     "Projects",
  testimonials: "Testimonials",
  locations:    "Locations",
  portal:       "Portal",
};

// Predefined permission sets
export const PERMISSION_PRESETS: Record<string, { label: string; permissions: PermissionKey[] }> = {
  content_editor: {
    label: "Content Editor",
    permissions: ["posts", "services", "industries", "brands", "projects", "testimonials", "locations"],
  },
  posts_only: {
    label: "Posts Only",
    permissions: ["posts"],
  },
  content_only: {
    label: "Content Only",
    permissions: ["posts", "testimonials"],
  },
  locations_manager: {
    label: "Locations Manager",
    permissions: ["locations", "services", "industries"],
  },
  custom: {
    label: "Custom",
    permissions: [],
  },
};

// Path → permission key mapping
// "admin_only" = only admins, never assignable to employees
export const PATH_PERMISSION_MAP: Record<string, PermissionKey | "admin_only"> = {
  "/admin/posts":        "posts",
  "/admin/services":     "services",
  "/admin/industries":   "industries",
  "/admin/brands":       "brands",
  "/admin/projects":     "projects",
  "/admin/testimonials": "testimonials",
  "/admin/locations":    "locations",
  "/admin/users":        "admin_only",
  "/admin/logs":         "admin_only",
  "/admin/maintenance":  "admin_only",
};

export function canAccess(
  profile: UserProfile | null,
  pathname: string
): boolean {
  if (!profile) return false;
  if (profile.role === "admin") return true;

  // Employees always have access to their own profile
  if (pathname.startsWith("/admin/profile")) return true;

  // Find matching permission for this path
  const matchedKey = Object.entries(PATH_PERMISSION_MAP).find(([path]) =>
    pathname.startsWith(path)
  );

  if (!matchedKey) return true; // Unknown path — allow (e.g. /admin itself)
  const [, required] = matchedKey;

  if (required === "admin_only") return false;
  return profile.permissions.includes(required);
}
