"use client";

import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  unit_price: number;
  reorder_level: number;
  current_quantity?: number;
}

interface InventoryReportProps {
  products: Product[];
}

export default function InventoryReport({ products }: InventoryReportProps) {
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce(
      (sum, p) => sum + (p.unit_price * (p.current_quantity || 0)),
      0
    );
    const lowStockItems = products.filter(
      (p) => (p.current_quantity || 0) < p.reorder_level
    ).length;

    return { totalProducts, totalValue, lowStockItems };
  }, [products]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Total Products
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {stats.totalProducts}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Inventory Value
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            ${stats.totalValue.toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Low Stock Items
              </p>
              <p className="mt-2 text-3xl font-bold text-orange-500">
                {stats.lowStockItems}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Reorder Level</TableHead>
              <TableHead>Total Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const currentQty = product.current_quantity || 0;
              const isLowStock = currentQty < product.reorder_level;

              return (
                <TableRow key={product.id} className={isLowStock ? "bg-orange-50 dark:bg-orange-950/20" : ""}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                  <TableCell>${product.unit_price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={
                        isLowStock
                          ? "font-bold text-orange-500"
                          : "font-semibold"
                      }
                    >
                      {currentQty} units
                    </span>
                  </TableCell>
                  <TableCell>{product.reorder_level} units</TableCell>
                  <TableCell className="font-semibold">
                    ${(product.unit_price * currentQty).toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
