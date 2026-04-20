"use client";

import { MoreVertical, Receipt, RefreshCw } from "lucide-react";
import type { ReceiptData } from "../_lib/receiptTypes";
import { formatReceiptCurrency, formatReceiptShortDate } from "../_lib/receiptUtils";

interface ReceiptGridProps {
  dateFilterActive: boolean;
  loading: boolean;
  onOpenReceipt: (receipt: ReceiptData) => void;
  onResetFilters: () => void;
  receipts: ReceiptData[];
  selectedCategory: string;
}

export default function ReceiptGrid({
  dateFilterActive,
  loading,
  onOpenReceipt,
  onResetFilters,
  receipts,
  selectedCategory,
}: ReceiptGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {receipts.map((receipt) => (
        <div
          key={receipt.id}
          onClick={() => onOpenReceipt(receipt)}
          className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 transition-all hover:border-[#2563EB]/20 hover:shadow-md hover:shadow-[#2563EB]/5"
        >
          <div
            className="absolute left-0 top-0 h-full w-[3px] rounded-l-2xl"
            style={{ backgroundColor: receipt.categories?.color }}
          />
          <div className="mb-5 flex items-start justify-between pl-3">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                style={{
                  backgroundColor: `${receipt.categories?.color ?? "#2563EB"}18`,
                }}
              >
                {receipt.categories?.icon ?? "🧾"}
              </div>
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-semibold leading-tight text-[#0F172A]">
                  {receipt.merchant_name}
                </h3>
                <p className="mt-0.5 font-['Plus_Jakarta_Sans'] text-xs text-[#64748B]">
                  {formatReceiptShortDate(receipt.receipt_date)}
                </p>
              </div>
            </div>
            <button
              className="rounded-lg p-1 text-[#E2E8F0] opacity-0 transition-colors hover:bg-[#EFF6FF] hover:text-[#2563EB] group-hover:opacity-100"
              onClick={(event) => {
                event.stopPropagation();
                onOpenReceipt(receipt);
              }}
              title="View Detail"
            >
              <MoreVertical size={16} />
            </button>
          </div>

          <div className="mt-auto pl-3">
            <div className="mb-2.5 flex items-center gap-2">
              {receipt.categories && (
                <span
                  className="rounded-lg px-2 py-0.5 font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    color: receipt.categories.color,
                    backgroundColor: `${receipt.categories.color}18`,
                  }}
                >
                  {receipt.categories.icon} {receipt.categories.name}
                </span>
              )}
              <span className="flex items-center gap-1 font-['Plus_Jakarta_Sans'] text-xs text-[#94A3B8]">
                <Receipt size={11} /> {receipt.receipt_items?.length ?? 0} items
              </span>
            </div>
            <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold tracking-tight text-[#0F172A]">
              {formatReceiptCurrency(receipt.total_amount)}
            </div>
          </div>
        </div>
      ))}

      {loading && (
        <div className="col-span-full flex justify-center py-16">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF]">
              <RefreshCw size={20} className="animate-spin text-[#2563EB]" />
            </div>
            <p className="font-['Plus_Jakarta_Sans'] text-sm font-semibold text-[#0F172A]">
              Memuat Receipts...
            </p>
            <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#64748B]">
              Mohon tunggu sebentar
            </p>
          </div>
        </div>
      )}

      {!loading && receipts.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-[#F1F5F9]">
            <Receipt size={24} className="text-[#94A3B8]" />
          </div>
          <p className="mb-1 font-['Plus_Jakarta_Sans'] text-sm font-semibold text-[#0F172A]">
            Tidak ada receipt
          </p>
          <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#64748B]">
            {dateFilterActive || selectedCategory
              ? "Coba ubah atau reset filter"
              : "Tambah receipt pertamamu"}
          </p>
          {(dateFilterActive || selectedCategory) && (
            <button
              onClick={onResetFilters}
              className="mt-4 rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] px-4 py-2 font-['Plus_Jakarta_Sans'] text-sm text-[#64748B] transition-colors hover:bg-[#E2E8F0]"
            >
              Reset Semua Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
