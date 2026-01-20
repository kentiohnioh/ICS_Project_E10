"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  products?: {
    name: string;
    sku: string;
  };
}

interface Order {
  id: string;
  supplier_id: string;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  total_amount: number;
  order_date: string;
  expected_delivery: string;
  suppliers?: {
    id: string;
    name: string;
  };
  order_items?: OrderItem[];
}

interface PurchaseOrderListProps {
  orders: Order[];
}

export default function PurchaseOrderList({
  orders,
}: PurchaseOrderListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700">
            Pending
          </Badge>
        );
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-700">
            Confirmed
          </Badge>
        );
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-700">
            Delivered
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-700">
            Cancelled
          </Badge>
        );
    }
  };

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">
          No purchase orders found. Create your first order to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Expected Delivery</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-sm">{order.id.slice(0, 8)}</TableCell>
              <TableCell className="font-medium">
                {order.suppliers?.name || "Unknown"}
              </TableCell>
              <TableCell className="text-sm">
                {order.order_items?.length || 0} items
              </TableCell>
              <TableCell className="font-semibold">
                ${order.total_amount.toFixed(2)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(order.order_date).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(order.expected_delivery).toLocaleDateString()}
              </TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
