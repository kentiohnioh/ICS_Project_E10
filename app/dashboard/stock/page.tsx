// app/dashboard/stock/page.tsx
import { getSupabaseServer } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import StockMovementList from "@/components/stock/stock-movement-list";
import StockForm from "@/components/stock/stock-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: "Stock Management - Inventory Control System",
  description: "Manage stock movements",
};

export default async function StockPage() {
  // Only these roles can access this page
  await requireRole(["admin", "manager", "stock_controller"]);

  const supabase = await getSupabaseServer();

  const { data: movements, error } = await supabase
    .from("stock_movements")
    .select(
      `
      *,
      products (id, name, sku),
      users (id, full_name)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching stock movements:", error);
    // You might want to show an error UI here instead of just logging
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

          {/* Only Admin, Manager, Stock Controller can see/create new movements */}
          <TabsTrigger value="new">Record Movement</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <StockMovementList movements={movements || []} />
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