import { getSupabaseServer } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import DashboardMetrics from "@/components/dashboard/metrics";
import RecentActivity from "@/components/dashboard/recent-activity";
import StockStatus from "@/components/dashboard/stock-status";

export const metadata = {
  title: "Dashboard - Inventory Control System",
  description: "Overview of your inventory management system",
};

export default async function DashboardPage() {
  const user = await requireAuth();
  const supabase = await getSupabaseServer();

  // Fetch dashboard data - use correct Supabase v2 syntax for counts
  const [productsResult, stockResult, ordersResult] = await Promise.all([
    // Total products count (no rows returned)
    supabase
      .from("products")
      .select("id", { count: "exact", head: true }),

    // Recent stock movements count (last 30 days)
    supabase
      .from("stock_movements")
      .select("id", { count: "exact", head: true })
      .gte(
        "created_at",
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      ),

    // Pending purchase orders count
    supabase
      .from("purchase_orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  // Safely extract counts (default to 0 if null or error)
  const totalProducts = productsResult.count ?? 0;
  const recentMovements = stockResult.count ?? 0;
  const pendingOrders = ordersResult.count ?? 0;

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back, {user.user_metadata?.full_name || "User"}!
        </p>
      </div>

      {/* Metrics */}
      <DashboardMetrics
        totalProducts={totalProducts}
        recentMovements={recentMovements}
        pendingOrders={pendingOrders}
      />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <StockStatus />
        <RecentActivity />
      </div>
    </div>
  );
}