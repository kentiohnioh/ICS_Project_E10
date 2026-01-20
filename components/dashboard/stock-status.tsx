"use client";

import { AlertTriangle, TrendingDown } from "lucide-react";

export default function StockStatus() {
  const lowStockItems = [
    { name: "Product A", current: 5, minimum: 10 },
    { name: "Product B", current: 3, minimum: 10 },
    { name: "Product C", current: 8, minimum: 20 },
  ];

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Low Stock Alerts
        </h2>
      </div>
      <div className="divide-y divide-border">
        {lowStockItems.length > 0 ? (
          lowStockItems.map((item) => (
            <div key={item.name} className="flex items-center justify-between px-6 py-3">
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  Min: {item.minimum}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-lg font-bold text-destructive">
                    {item.current}
                  </p>
                </div>
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-center text-muted-foreground">
            All items are in stock
          </div>
        )}
      </div>
    </div>
  );
}
