"use client";

import Link from "next/link";

interface DashboardTopbarProps {
  addReceiptHref?: string;
  showAddReceipt?: boolean;
}

export default function DashboardTopbar({
  addReceiptHref = "/dashboard/receipt/newReceipt",
  showAddReceipt = true,
}: DashboardTopbarProps) {
  return (
    <header className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-[#E2E8F0] bg-white/80 px-4 py-3 font-['Plus_Jakarta_Sans'] text-sm tracking-tight text-[#2563EB] shadow-sm backdrop-blur-md md:w-[calc(100%-16rem)] md:px-8 md:py-4">
      <div className="flex items-center gap-4">
        <div className="text-lg font-bold tracking-tighter text-[#2563EB] md:hidden">
          Receipt Manager
        </div>
      </div>

      <div className="flex items-center gap-3">
        {showAddReceipt && (
          <Link
            href={addReceiptHref}
            className="hidden cursor-pointer items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#1D4ED8] md:flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                clipRule="evenodd"
              />
            </svg>
            Add Receipt
          </Link>
        )}

        <img
          alt="User Profile Avatar"
          className="h-8 w-8 cursor-pointer rounded-full border-2 border-[#E2E8F0] shadow-sm md:h-9 md:w-9"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn-bmMKzyWPnvl9AV-a887bnf4uNuXj_4pgP3cPEZoUlx3W-7VGkfD6-jLBj6c62lj9aCu-uWzMq6kc_dXPdEfxklFudXo7EO8bIxBwt87kaW5itzWge75VF3P4-yweyAeswjSxTt5OYyf479Kbt_Y9KrZElu0LnO_5p0XXG_FmL_YjwXgc0YHVOc3a9Zs4DlF_0ryR5DJfbt5RGV_dzVYui7EgBxFAKJ5A0wSI3iC8TkWCeN8zP_CvziVTrDAFoMAIaqv5OTV-L0"
        />
      </div>
    </header>
  );
}
