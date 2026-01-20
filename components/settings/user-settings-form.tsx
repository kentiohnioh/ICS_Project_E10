"use client";

import React from "react"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getSupabaseClient } from "@/lib/supabase/client";

interface UserData {
  id: string;
  full_name: string;
  role: string;
}

export default function UserSettingsForm({ user }: { user?: UserData }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    fullName: user?.full_name || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage("New passwords do not match");
        return;
      }

      if (formData.newPassword.length < 6) {
        setMessage("Password must be at least 6 characters");
        return;
      }

      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Password updated successfully");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setMessage("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Account Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground">
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              disabled
              className="mt-1 w-full rounded-lg border border-input bg-muted px-4 py-2 text-foreground disabled:opacity-50"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Contact your administrator to change your name
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              User ID
            </label>
            <input
              type="text"
              value={user?.id || ""}
              disabled
              className="mt-1 w-full rounded-lg border border-input bg-muted px-4 py-2 font-mono text-sm text-foreground disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              Role
            </label>
            <input
              type="text"
              value={user?.role || ""}
              disabled
              className="mt-1 w-full rounded-lg border border-input bg-muted px-4 py-2 text-foreground disabled:opacity-50 capitalize"
            />
          </div>
        </div>
      </div>

      {/* Password Section */}
      <form onSubmit={handlePasswordChange} className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Change Password
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {message && (
            <div
              className={`rounded-lg p-3 text-sm ${
                message.includes("success")
                  ? "bg-green-500/10 text-green-700"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {message}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
