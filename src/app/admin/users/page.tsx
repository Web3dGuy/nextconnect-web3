"use client";

import { useActiveAccount } from "@/hooks/useActiveAccount";
import { Users } from "lucide-react";

export default function UsersPage() {
  const account = useActiveAccount();

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Users</h1>

      <div className="rounded-xl border border-border bg-card p-8 text-center space-y-4">
        <Users className="h-12 w-12 mx-auto text-muted-foreground" />
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">User Management</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Connect this page to your backend to manage users, view connected
            wallets, and assign roles. Currently showing the connected admin.
          </p>
        </div>

        {account && (
          <div className="inline-block rounded-lg border border-border bg-background p-4 text-left text-sm">
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              <span className="text-muted-foreground">Address</span>
              <span className="font-mono text-xs">{account.address}</span>
              <span className="text-muted-foreground">Chain</span>
              <span>{account.chainId}</span>
              <span className="text-muted-foreground">Role</span>
              <span className="text-primary font-medium">Admin</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
