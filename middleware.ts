import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { canAccess, type UserProfile } from "@/lib/rbac";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;
  const isLoginPath = pathname === "/admin/login";

  // Not logged in → redirect to login
  if (!user && !isLoginPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // Logged in + on login page → redirect to admin
  if (user && isLoginPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/home";
    return NextResponse.redirect(url);
  }

  // Logged in — check role-based access
  if (user && !isLoginPath) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("user_id, role, permissions")
      .eq("user_id", user.id)
      .single();

    const userProfile = profile as UserProfile | null;

    // No profile yet → treat as admin (first-time setup) except for /admin/users
    if (!userProfile) {
      return supabaseResponse;
    }

    if (!canAccess(userProfile, pathname)) {
      // Employee hitting admin-only or unpermitted page → send to profile
      const url = request.nextUrl.clone();
      url.pathname = "/admin/profile";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
