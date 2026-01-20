import { getSupabaseServer } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import PurchaseOrderList from "@/components/purchases/purchase-order-list";
import PurchaseOrderForm from "@/components/purchases/purchase-order-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: "Purchase Orders - Inventory Control System",
  description: "Manage purchase orders",
};

export default async function PurchasesPage() {
  await requireRole(["admin", "manager"]);
  const supabase = await getSupabaseServer();

  const { data: orders, error } = await supabase
    .from("purchase_orders")
    .select(
      `
      *,
      suppliers (id, name),
      order_items (
        id,
        product_id,
        quantity,
        unit_price,
        products (name, sku)
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching purchase orders:", error);
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Purchase Orders</h1>
        <p className="mt-2 text-muted-foreground">
          Manage supplier purchase orders
        </p>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="new">Create Order</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <PurchaseOrderList orders={orders || []} />
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <div className="max-w-2xl">
            <PurchaseOrderForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
