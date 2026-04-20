"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReceiptPaginationProps {
  onPageChange: (page: number) => void;
  page: number;
  totalPages: number;
}

export default function ReceiptPagination({
  onPageChange,
  page,
  totalPages,
}: ReceiptPaginationProps) {
  return (
    <div className="flex items-center justify-center pb-8 pt-2">
      <div className="flex items-center gap-1 rounded-full border border-[#E2E8F0] bg-white p-1.5">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#64748B] transition-colors hover:bg-[#F1F5F9] disabled:opacity-30"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-1 px-1">
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .slice(Math.max(0, page - 2), page + 1)
            .map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`flex h-9 w-9 items-center justify-center rounded-full font-['Plus_Jakarta_Sans'] text-sm transition-all ${
                  page === pageNumber
                    ? "bg-[#2563EB] font-bold text-white"
                    : "font-medium text-[#64748B] hover:bg-[#F1F5F9]"
                }`}
              >
                {pageNumber}
              </button>
            ))}
        </div>
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#64748B] transition-colors hover:bg-[#F1F5F9] disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
