"use client";

import type { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";

type DashboardNavItem = "dashboard" | "receipt" | "insight";

interface DashboardShellProps {
  activeItem: DashboardNavItem;
  children: ReactNode;
  contentClassName?: string;
  onLogout: () => void;
  showAddReceipt?: boolean;
}

export default function DashboardShell({
  activeItem,
  children,
  contentClassName = "mx-auto max-w-6xl space-y-6 px-4 pb-24 pt-20 md:pb-8 md:px-8",
  onLogout,
  showAddReceipt = true,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#F8FAFC] text-[#0F172A] antialiased">
      <DashboardSidebar activeItem={activeItem} onLogout={onLogout} />

      <main className="relative min-h-screen w-full flex-1 overflow-x-hidden pb-24 md:ml-64 md:pb-8">
        <DashboardTopbar showAddReceipt={showAddReceipt} />
        <div className={contentClassName}>{children}</div>
      </main>
    </div>
  );
}
