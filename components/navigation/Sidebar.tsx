"use client";

import Link from "next/link";

export default function Sidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <nav className="h-screen w-64 fixed left-0 top-0 bg-white border-r p-6 hidden md:flex flex-col">
      <div className="mb-8">Kasih Uang Dah</div>

      <Link href="#" className="mb-2">
        Dashboard
      </Link>
      <Link href="/dashboard/receipt">All Receipts</Link>
      <Link href="/dashboard/insight">Analytics</Link>

      <button onClick={onLogout} className="mt-auto">
        Logout
      </button>
    </nav>
  );
}
