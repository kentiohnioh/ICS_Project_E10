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
import { Badge } from "@/components/ui/badge";

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Order {
  id: string;
  supplier_id: string;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  total_amount: number;
}

interface SupplierAnalyticsProps {
  suppliers: Supplier[];
  orders: Order[];
}

export default function SupplierAnalytics({
  suppliers,
  orders,
}: SupplierAnalyticsProps) {
  const supplierStats = useMemo(() => {
    return suppliers.map((supplier) => {
      const supplierOrders = orders.filter(
        (o) => o.supplier_id === supplier.id
      );
      const totalSpent = supplierOrders.reduce(
        (sum, o) => sum + o.total_amount,
        0
      );
      const deliveredOrders = supplierOrders.filter(
        (o) => o.status === "delivered"
      ).length;
      const pendingOrders = supplierOrders.filter(
        (o) => o.status === "pending"
      ).length;

      return {
        supplier,
        totalOrders: supplierOrders.length,
        totalSpent,
        deliveredOrders,
        pendingOrders,
        avgOrderValue:
          supplierOrders.length > 0
            ? totalSpent / supplierOrders.length
            : 0,
      };
    });
  }, [suppliers, orders]);

  const totalStats = useMemo(() => {
    const totalSuppliers = suppliers.length;
    const totalSpent = supplierStats.reduce((sum, s) => sum + s.totalSpent, 0);
    const totalOrders = orders.length;
    const avgSpent = totalOrders > 0 ? totalSpent / totalOrders : 0;

    return { totalSuppliers, totalSpent, totalOrders, avgSpent };
  }, [supplierStats, orders]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Total Suppliers
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {totalStats.totalSuppliers}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Total Orders
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {totalStats.totalOrders}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Total Spent
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            ${totalStats.totalSpent.toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Avg Order Value
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            ${totalStats.avgSpent.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Supplier Details Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier Name</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead>Pending</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Avg Order Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {supplierStats.map((stat) => (
              <TableRow key={stat.supplier.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{stat.supplier.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.supplier.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-center font-semibold">
                  {stat.totalOrders}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-500/10 text-green-700">
                    {stat.deliveredOrders}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700">
                    {stat.pendingOrders}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold">
                  ${stat.totalSpent.toFixed(2)}
                </TableCell>
                <TableCell>${stat.avgOrderValue.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
