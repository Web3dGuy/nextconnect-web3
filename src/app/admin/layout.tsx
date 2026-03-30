"use client";

import { useRouter, usePathname } from "next/navigation";
import { ConnectButton } from "@/components/connect/ConnectButton";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Shield, Home, Settings, Users, FileText, Menu, X } from "lucide-react";
import { useState } from "react";

const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase();

const NAV_ITEMS = [
  { label: "Dashboard", icon: Home, href: "/admin" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Contracts", icon: FileText, href: "/admin/contracts" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const account = useActiveAccount();
  const { isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-semibold">Connect Wallet</h2>
          <p className="text-muted-foreground">
            Admin access requires wallet authentication
          </p>
          <div className="flex justify-center">
            <ConnectButton appName="NextConnect" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-destructive">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            {ADMIN_WALLET
              ? "This wallet is not authorized for admin access."
              : "No admin wallet configured. Set NEXT_PUBLIC_ADMIN_WALLET in your .env file."}
          </p>
          <Button variant="ghost" onClick={() => router.push("/")}>
            &larr; Back to home
          </Button>
        </div>
      </div>
    );
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-56 border-r border-border bg-card flex flex-col transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <Shield className="h-4 w-4 text-brand" />
            Admin Panel
          </h2>
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {NAV_ITEMS.map(({ label, icon: Icon, href }) => (
            <button
              key={href}
              onClick={() => {
                router.push(href);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors text-left cursor-pointer ${
                isActive(href)
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-border px-4 lg:px-6 py-3 flex items-center gap-2">
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <ThemeSwitcher />
          <ConnectButton appName="NextConnect" />
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
