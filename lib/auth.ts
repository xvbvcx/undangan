import "server-only";
import { createClient } from "@/lib/supabase/server";

export type AuthedUser = {
  id: string;
  email: string | null;
  isAdmin: boolean;
};

// Loads the current Supabase user plus profile.role. Returns null when no user.
// Use this everywhere instead of duplicating the same pattern in routes.
export async function getCurrentUser(): Promise<AuthedUser | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? null,
    isAdmin: profile?.role === "admin"
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Response("Harus login.", { status: 401 });
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new Response("Harus login.", { status: 401 });
  if (!user.isAdmin) throw new Response("Akses ditolak.", { status: 403 });
  return user;
}
