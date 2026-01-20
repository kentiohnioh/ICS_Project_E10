"use client";

import { Clock, Plus, Minus, TrendingUp } from "lucide-react";

export default function RecentActivity() {
  const activities = [
    {
      type: "stock-in",
      product: "Product A",
      quantity: 50,
      timestamp: "2 hours ago",
    },
    {
      type: "stock-out",
      product: "Product B",
      quantity: 30,
      timestamp: "4 hours ago",
    },
    {
      type: "order-created",
      product: "Product C",
      quantity: 100,
      timestamp: "1 day ago",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "stock-in":
        return <Plus className="h-4 w-4 text-green-500" />;
      case "stock-out":
        return <Minus className="h-4 w-4 text-orange-500" />;
      default:
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Clock className="h-5 w-5" />
          Recent Activity
        </h2>
      </div>
      <div className="divide-y divide-border">
        {activities.length > 0 ? (
          activities.map((activity, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-6 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-muted p-2">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {activity.product}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
              <p className="font-semibold text-foreground">
                {activity.quantity} units
              </p>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-center text-muted-foreground">
            No activities yet
          </div>
        )}
      </div>
    </div>
  );
}
