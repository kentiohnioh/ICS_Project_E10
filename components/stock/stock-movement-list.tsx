"use client";

import { Plus, Minus, RotateCcw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Movement {
  id: string;
  product_id: string;
  movement_type: "stock-in" | "stock-out" | "adjustment";
  quantity: number;
  notes: string;
  created_at: string;
  products?: {
    id: string;
    name: string;
    sku: string;
  };
  users?: {
    id: string;
    full_name: string;
  };
}

interface StockMovementListProps {
  movements: Movement[];
}

export default function StockMovementList({
  movements,
}: StockMovementListProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "stock-in":
        return <Plus className="h-5 w-5 text-green-500" />;
      case "stock-out":
        return <Minus className="h-5 w-5 text-orange-500" />;
      default:
        return <RotateCcw className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "stock-in":
        return "Stock In";
      case "stock-out":
        return "Stock Out";
      default:
        return "Adjustment";
    }
  };

  if (movements.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">
          No stock movements recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map((movement) => (
            <TableRow key={movement.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getIcon(movement.movement_type)}
                  <span className="text-sm font-medium">
                    {getTypeLabel(movement.movement_type)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">
                    {movement.products?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {movement.products?.sku}
                  </p>
                </div>
              </TableCell>
              <TableCell className="font-semibold">
                {movement.movement_type === "stock-out" ? "-" : "+"}
                {movement.quantity}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(movement.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                {movement.notes || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
