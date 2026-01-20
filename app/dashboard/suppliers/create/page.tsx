import { requireRole } from "@/lib/auth";
import SupplierForm from "@/components/suppliers/supplier-form";

export const metadata = {
  title: "Add Supplier - Inventory Control System",
  description: "Add a new supplier",
};

export default async function CreateSupplierPage() {
  await requireRole(["admin", "manager"]);

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Add Supplier</h1>
        <p className="mt-2 text-muted-foreground">
          Register a new supplier to your system
        </p>
      </div>

      <div className="max-w-2xl">
        <SupplierForm />
      </div>
    </div>
  );
}
