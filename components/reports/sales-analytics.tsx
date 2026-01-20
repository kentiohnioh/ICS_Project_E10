"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Plus, Minus } from "lucide-react";

interface Movement {
  id: string;
  movement_type: "stock-in" | "stock-out" | "adjustment";
  quantity: number;
  created_at: string;
  products?: {
    name: string;
    sku: string;
  };
}

interface SalesAnalyticsProps {
  movements: Movement[];
}

export default function SalesAnalytics({
  movements,
}: SalesAnalyticsProps) {
  const stats = useMemo(() => {
    const stockIn = movements
      .filter((m) => m.movement_type === "stock-in")
      .reduce((sum, m) => sum + m.quantity, 0);

    const stockOut = movements
      .filter((m) => m.movement_type === "stock-out")
      .reduce((sum, m) => sum + m.quantity, 0);

    const adjustments = movements
      .filter((m) => m.movement_type === "adjustment")
      .reduce((sum, m) => sum + m.quantity, 0);

    // Group movements by date
    const chartData: Record<string, { date: string; in: number; out: number }> = {};

    movements.forEach((movement) => {
      const date = new Date(movement.created_at).toLocaleDateString();
      if (!chartData[date]) {
        chartData[date] = { date, in: 0, out: 0 };
      }
      if (movement.movement_type === "stock-in") {
        chartData[date].in += movement.quantity;
      } else if (movement.movement_type === "stock-out") {
        chartData[date].out += movement.quantity;
      }
    });

    return {
      stockIn,
      stockOut,
      adjustments,
      chartData: Object.values(chartData).slice(-30), // Last 30 days
    };
  }, [movements]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Stock In
              </p>
              <p className="mt-2 text-3xl font-bold text-green-500">
                {stats.stockIn}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <Minus className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Stock Out
              </p>
              <p className="mt-2 text-3xl font-bold text-orange-500">
                {stats.stockOut}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Net Change
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {stats.stockIn - stats.stockOut}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Stock Movements (Last 30 Days)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="in" fill="#10b981" name="Stock In" />
            <Bar dataKey="out" fill="#f59e0b" name="Stock Out" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
