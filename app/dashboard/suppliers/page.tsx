import { getSupabaseServer } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import SupplierList from "@/components/suppliers/supplier-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = {
  title: "Suppliers - Inventory Control System",
  description: "Manage your suppliers",
};

export default async function SuppliersPage() {
  await requireRole(["admin", "manager"]);
  const supabase = await getSupabaseServer();

  const { data: suppliers, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching suppliers:", error);
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Suppliers</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your supplier contacts and information
          </p>
        </div>
        <Link href="/dashboard/suppliers/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </Link>
      </div>

      <SupplierList suppliers={suppliers || []} />
    </div>
  );
}
