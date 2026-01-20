import { requireAuth } from "@/lib/auth";
import { getSupabaseServer } from "@/lib/supabase/server";
import UserSettingsForm from "@/components/settings/user-settings-form";

export const metadata = {
  title: "Settings - Inventory Control System",
  description: "Manage your account settings",
};

export default async function SettingsPage() {
  const user = await requireAuth();
  const supabase = await getSupabaseServer();

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <div className="max-w-2xl">
        <UserSettingsForm user={userData} />
      </div>
    </div>
  );
}
