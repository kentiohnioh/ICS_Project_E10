import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DashboardNav from "@/components/dashboard/dashboard-nav";
import Sidebar from "@/components/dashboard/sidebar";

export const metadata = {
  title: "Dashboard - ICS",
  description: "Inventory Control System Dashboard",
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNav user={user} />
        <main className="flex-1 overflow-auto bg-muted/40">{children}</main>
      </div>
    </div>
  );
}
