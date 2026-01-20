import { Package, TrendingUp, ShoppingCart } from "lucide-react";

interface MetricsProps {
  totalProducts: number;
  recentMovements: number;
  pendingOrders: number;
}

export default function DashboardMetrics({
  totalProducts,
  recentMovements,
  pendingOrders,
}: MetricsProps) {
  const metrics = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Recent Movements",
      value: recentMovements,
      subtitle: "(Last 30 days)",
      icon: TrendingUp,
      color: "bg-green-500/10 text-green-500",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: ShoppingCart,
      color: "bg-orange-500/10 text-orange-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.title}
            className="rounded-lg border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </p>
                <p className="mt-1 text-3xl font-bold text-foreground">
                  {metric.value}
                </p>
                {metric.subtitle && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {metric.subtitle}
                  </p>
                )}
              </div>
              <div className={`rounded-lg p-3 ${metric.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
