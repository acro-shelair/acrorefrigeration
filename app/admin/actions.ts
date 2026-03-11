"use server";

import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/logging";

export async function signOutAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Log before signing out while session is still valid
  await logActivity("logout", "auth", `Logged out: ${user?.email ?? "unknown"}`);

  await supabase.auth.signOut();
}
