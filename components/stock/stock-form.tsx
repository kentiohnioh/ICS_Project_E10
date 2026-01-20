"use client";

import React from "react"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  sku: string;
}

export default function StockForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    product_id: "",
    movement_type: "stock-in",
    quantity: "",
    notes: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = getSupabaseClient();
      const { data } = await supabase
        .from("products")
        .select("id, name, sku")
        .order("name");
      if (data) setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = getSupabaseClient();
      const { error: insertError } = await supabase
        .from("stock_movements")
        .insert([
          {
            product_id: formData.product_id,
            movement_type: formData.movement_type,
            quantity: parseInt(formData.quantity),
            notes: formData.notes,
          },
        ]);

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setFormData({
        product_id: "",
        movement_type: "stock-in",
        quantity: "",
        notes: "",
      });

      router.refresh();
      alert("Stock movement recorded successfully");
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border border-border bg-card p-6"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-foreground">
            Product *
          </label>
          <select
            name="product_id"
            value={formData.product_id}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.sku})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            Movement Type *
          </label>
          <select
            name="movement_type"
            value={formData.movement_type}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
          >
            <option value="stock-in">Stock In</option>
            <option value="stock-out">Stock Out</option>
            <option value="adjustment">Adjustment</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">
          Quantity *
        </label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
          min="0"
          className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
          placeholder="e.g., 50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
          placeholder="Add any notes about this movement..."
        />
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Recording..." : "Record Movement"}
      </Button>
    </form>
  );
}
