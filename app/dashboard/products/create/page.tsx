import { requireRole } from "@/lib/auth";
import ProductForm from "@/components/products/product-form";

export const metadata = {
  title: "Create Product - Inventory Control System",
  description: "Create a new product",
};

export default async function CreateProductPage() {
  await requireRole(["admin", "manager"]);

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create Product</h1>
        <p className="mt-2 text-muted-foreground">
          Add a new product to your catalog
        </p>
      </div>

      <div className="max-w-2xl">
        <ProductForm />
      </div>
    </div>
  );
}
