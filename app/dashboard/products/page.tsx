// app/dashboard/stock/page.tsx
import { getSupabaseServer } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import StockMovementList from "@/components/stock/stock-movement-list";
import StockForm from "@/components/stock/stock-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackageSearch } from "lucide-react";

export const metadata = {
  title: "Stock Management - Inventory Control System",
  description: "Manage stock movements",
};

export default async function StockPage() {
  await requireRole(["admin", "manager", "stock_controller"]);

  const supabase = await getSupabaseServer();

  const { data: movements, error } = await supabase
    .from("stock_transactions")
    .select(
      `
      *,
      products (id, name, sku),
      users!user_id (id, full_name)   // ← CHANGE "user_id" to your actual FK column name
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching stock transactions:", error);
    return (
      <div className="space-y-6 p-8">
        <h1 className="text-3xl font-bold text-red-600">Error</h1>
        <p className="text-muted-foreground">
          Failed to load stock data: {error.message || "Unknown error"}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          (Code: {error.code || 'none'}) — {error.details || 'no details'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Stock Management</h1>
        <p className="mt-2 text-muted-foreground">
          Record stock movements and view history
        </p>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList>
          <TabsTrigger value="history">Movement History</TabsTrigger>
          <TabsTrigger value="new">Record Movement</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          {movements && movements.length > 0 ? (
            <StockMovementList movements={movements} />
          ) : (
            <div className="rounded-xl border border-dashed bg-muted/30 p-12 text-center">
              <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground/70 mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-semibold text-foreground mb-3">
                No stock movements yet
              </h3>
              <p className="text-muted-foreground mb-8">
                Record your first stock in/out transaction to start tracking changes.
              </p>
              <Link href="#new">
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Record Movement
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <div className="max-w-2xl">
            <StockForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}