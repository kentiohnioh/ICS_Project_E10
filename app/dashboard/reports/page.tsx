import { getSupabaseServer } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import InventoryReport from "@/components/reports/inventory-report";
import SalesAnalytics from "@/components/reports/sales-analytics";
import SupplierAnalytics from "@/components/reports/supplier-analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: "Reports & Analytics - Inventory Control System",
  description: "View detailed reports and analytics",
};

export default async function ReportsPage() {
  await requireRole(["admin", "manager", "viewer"]);
  const supabase = await getSupabaseServer();

  // Fetch data for reports
  const [productsData, movementsData, ordersData, suppliersData] =
    await Promise.all([
      supabase.from("products").select("*"),
      supabase
        .from("stock_movements")
        .select("*, products(name, sku)")
        .order("created_at", { ascending: false }),
      supabase.from("purchase_orders").select("*"),
      supabase.from("suppliers").select("*"),
    ]);

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="mt-2 text-muted-foreground">
          Comprehensive insights into your inventory operations
        </p>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="sales">Sales & Movements</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          <InventoryReport products={productsData.data || []} />
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <SalesAnalytics movements={movementsData.data || []} />
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-6">
          <SupplierAnalytics
            suppliers={suppliersData.data || []}
            orders={ordersData.data || []}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
