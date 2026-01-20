import { getSupabaseServer } from "./supabase/server";

export async function getCurrentUser() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserRole() {
  const supabase = await getSupabaseServer();
  const user = await getCurrentUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")                    // correct table name
    .select("role")
    .eq("user_id", user.id)              // correct column name
    .single();

  if (error) {
    console.error("Error fetching user role:", error.message);
    if (error.code === "PGRST116") {
      console.warn(`No profile row found for user ${user.id}`);
    }
    return null;
  }

  return data?.role ?? null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(requiredRoles: string[]) {
  const user = await requireAuth();
  const role = await getUserRole();

  // Debug logs – very useful right now
  console.log("╔═══════════════════════════════╗");
  console.log("║ requireRole DEBUG             ║");
  console.log(`║ User ID: ${user?.id || 'none'}║`);
  console.log(`║ Fetched role: "${role}"       ║`);
  console.log(`║ Required roles: ${JSON.stringify(requiredRoles)} ║`);
  console.log("╚═══════════════════════════════╝");

  if (!role) {
    console.warn("Forbidden: no role found (missing profile row or role is null)");
    throw new Error("Forbidden: No profile or role set");
  }

  if (!requiredRoles.includes(role)) {
    const msg = `Forbidden: Insufficient role ('${role}') — allowed: ${requiredRoles.join(', ')}`;
    console.warn(msg);
    throw new Error(msg);
  }

  return { user, role };
}