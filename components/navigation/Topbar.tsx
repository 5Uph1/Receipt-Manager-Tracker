"use client";

import Link from "next/link";

export default function Topbar() {
  return (
    <header className="fixed top-0 w-full md:w-[calc(100%-16rem)] bg-white border-b px-8 py-4 flex justify-between">
      <div>Kasih Uang Dah</div>

      <Link href="/dashboard/receipt/newReceipt">
        <button>Add Receipt</button>
      </Link>
    </header>
  );
}
