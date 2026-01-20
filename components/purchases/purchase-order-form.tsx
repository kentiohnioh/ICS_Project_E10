"use client";

import React from "react"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface Supplier {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  unit_price: number;
}

interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export default function PurchaseOrderForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { product_id: "", quantity: 0, unit_price: 0 },
  ]);
  const [formData, setFormData] = useState({
    supplier_id: "",
    expected_delivery: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const supabase = getSupabaseClient();
      const [suppliersData, productsData] = await Promise.all([
        supabase.from("suppliers").select("id, name"),
        supabase.from("products").select("id, name, sku, unit_price"),
      ]);

      if (suppliersData.data) setSuppliers(suppliersData.data);
      if (productsData.data) setProducts(productsData.data);
    };
    fetchData();
  }, []);

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newItems = [...orderItems];
    if (field === "product_id") {
      const product = products.find((p) => p.id === value);
      newItems[index] = {
        ...newItems[index],
        product_id: value as string,
        unit_price: product?.unit_price || 0,
      };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setOrderItems(newItems);
  };

  const handleAddItem = () => {
    setOrderItems([
      ...orderItems,
      { product_id: "", quantity: 0, unit_price: 0 },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = getSupabaseClient();

      const totalAmount = orderItems.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      );

      const { data: orderData, error: orderError } = await supabase
        .from("purchase_orders")
        .insert([
          {
            supplier_id: formData.supplier_id,
            status: "pending",
            total_amount: totalAmount,
            expected_delivery: formData.expected_delivery,
            order_date: new Date().toISOString(),
          },
        ])
        .select();

      if (orderError || !orderData?.[0]) {
        setError(orderError?.message || "Failed to create order");
        return;
      }

      const orderId = orderData[0].id;

      // Insert order items
      const itemsToInsert = orderItems.map((item) => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: parseInt(item.quantity.toString()),
        unit_price: item.unit_price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsToInsert);

      if (itemsError) {
        setError(itemsError.message);
        return;
      }

      router.push("/dashboard/purchases");
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border border-border bg-card p-6"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-foreground">
            Supplier *
          </label>
          <select
            value={formData.supplier_id}
            onChange={(e) =>
              setFormData({ ...formData, supplier_id: e.target.value })
            }
            required
            className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">Select a supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            Expected Delivery *
          </label>
          <input
            type="date"
            value={formData.expected_delivery}
            onChange={(e) =>
              setFormData({ ...formData, expected_delivery: e.target.value })
            }
            required
            className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Order Items</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddItem}
          >
            + Add Item
          </Button>
        </div>

        {orderItems.map((item, index) => (
          <div
            key={index}
            className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-4"
          >
            <div>
              <label className="block text-xs font-medium text-muted-foreground">
                Product
              </label>
              <select
                value={item.product_id}
                onChange={(e) =>
                  handleItemChange(index, "product_id", e.target.value)
                }
                required
                className="mt-1 w-full rounded border border-input bg-background px-2 py-1 text-sm focus:border-primary focus:outline-none"
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground">
                Quantity
              </label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", parseInt(e.target.value))
                }
                required
                min="0"
                className="mt-1 w-full rounded border border-input bg-background px-2 py-1 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground">
                Unit Price
              </label>
              <input
                type="number"
                value={item.unit_price}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "unit_price",
                    parseFloat(e.target.value)
                  )
                }
                required
                step="0.01"
                min="0"
                className="mt-1 w-full rounded border border-input bg-background px-2 py-1 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground">
                Total
              </label>
              <div className="mt-1 rounded border border-border bg-muted px-2 py-1 text-sm font-semibold">
                ${(item.quantity * item.unit_price).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-muted p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Order Total:
          </span>
          <span className="text-2xl font-bold text-foreground">
            ${totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating..." : "Create Order"}
      </Button>
    </form>
  );
}
