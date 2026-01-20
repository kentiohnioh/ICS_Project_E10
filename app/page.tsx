import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BarChart3, Lock, Zap } from "lucide-react";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getCurrentUser();

  // Redirect to dashboard if already logged in
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-2xl font-bold text-foreground">ICS</div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="space-y-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground md:text-6xl">
            Inventory Control System
          </h1>
          <p className="text-xl text-muted-foreground">
            Streamline your inventory management with real-time tracking,
            automated stock alerts, and comprehensive reporting.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/signup">
              <Button size="lg">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
          Powerful Features
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Role-Based Access Control
            </h3>
            <p className="text-muted-foreground">
              Manage user permissions with admin, manager, warehouse, and viewer roles.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Real-Time Tracking
            </h3>
            <p className="text-muted-foreground">
              Monitor stock movements and get instant alerts for low stock items.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Advanced Analytics
            </h3>
            <p className="text-muted-foreground">
              Gain insights with detailed reports and analytics on inventory performance.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Ready to Transform Your Inventory Management?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Start using ICS today and take control of your inventory operations.
          </p>
          <Link href="/signup">
            <Button size="lg">
              Create Account <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-muted-foreground">
          <p>
            Inventory Control System © 2024. Built with modern technology
            for enterprise inventory management.
          </p>
        </div>
      </footer>
    </div>
  );
}
