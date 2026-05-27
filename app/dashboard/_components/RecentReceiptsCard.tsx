"use client";

import Link from "next/link";
import type { ReceiptItem } from "../_lib/dashboardTypes";
import { formatDate, formatRupiah } from "../_lib/dashboardUtils";

interface RecentReceiptsCardProps {
  loadingReceipts: boolean;
  recentReceipts: ReceiptItem[];
}

export default function RecentReceiptsCard({
  loadingReceipts,
  recentReceipts,
}: RecentReceiptsCardProps) {
  return (
    <div className="rounded-[2rem] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-8">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold tracking-tight text-[#0F172A] md:text-xl">
          Recent Receipts
        </h3>
        <Link
          href="/dashboard/receipt"
          className="flex cursor-pointer items-center gap-1 text-sm font-medium text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
        >
          View Archive
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4"
          >
            <path
              fillRule="evenodd"
              d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>

      <div className="space-y-1">
        {!loadingReceipts &&
          recentReceipts.map((receipt) => (
            <div
              key={receipt.id}
              className="group flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-3 transition-all hover:border-[#E2E8F0] hover:bg-[#F8FAFC]"
            >
              <img
                src={receipt.image_url || "/placeholder.png"}
                className="h-11 w-11 shrink-0 rounded-xl border border-[#E2E8F0] object-cover md:h-12 md:w-12"
                alt={receipt.merchant_name}
              />

              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-[#0F172A] md:text-base">
                  {receipt.merchant_name}
                </div>
                <div className="flex flex-wrap items-center gap-1 text-xs text-[#64748B]">
                  <span>{formatDate(receipt.receipt_date)}</span>
                  <span className="h-1 w-1 rounded-full bg-[#CBD5E1]" />
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: receipt.categories?.color }}
                  >
                    {receipt.categories?.name || "Uncategorized"}
                  </span>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-sm font-bold text-[#0F172A] md:text-lg">
                  {formatRupiah(receipt.total_amount)}
                </div>
              </div>
            </div>
          ))}

        {!loadingReceipts && recentReceipts.length === 0 && (
          <div className="py-6 text-center text-sm text-[#94A3B8]">
            No receipts yet
          </div>
        )}

        {loadingReceipts && (
          <div className="group relative flex items-center overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
              <span className="flex items-center gap-1 text-xs font-bold text-[#2563EB] animate-pulse">
                <span className="animate-spin text-[14px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M8 16H3v5" />
                  </svg>
                </span>
                Processing Scan
              </span>
            </div>
            <div className="mr-4 h-12 w-12 rounded-xl bg-[#E2E8F0]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded bg-[#E2E8F0]" />
              <div className="h-3 w-1/4 rounded bg-[#E2E8F0]" />
            </div>
            <div className="text-right">
              <div className="h-5 w-16 rounded bg-[#E2E8F0]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
