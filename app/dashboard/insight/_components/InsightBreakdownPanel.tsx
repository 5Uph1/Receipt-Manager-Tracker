"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type {
  InsightCategorySummary,
  InsightMerchantSummary,
} from "../_lib/insightTypes";
import { formatRupiah } from "../../_lib/dashboardUtils";

interface InsightBreakdownPanelProps {
  categories: InsightCategorySummary[];
  topMerchants: InsightMerchantSummary[];
  totalSpent: number;
}

export default function InsightBreakdownPanel({
  categories,
  topMerchants,
  totalSpent,
}: InsightBreakdownPanelProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-bold text-[#0F172A]">By Category</h3>
          <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase text-slate-500">
            Sorted by High
          </span>
        </div>
        <div className="space-y-5">
          {categories.map((category) => {
            const percentOfTotal =
              totalSpent === 0
                ? "0"
                : ((category.total / totalSpent) * 100).toFixed(0);

            return (
              <div key={category.name} className="group">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-bold text-[#334155]">
                    {category.name}
                  </span>
                  <span className="font-mono font-medium text-[#64748B]">
                    {formatRupiah(category.total)}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${percentOfTotal}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </div>
                <div className="mt-1 text-[10px] font-medium text-[#94A3B8]">
                  {percentOfTotal}% dari total belanja
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-bold text-[#0F172A]">Top Merchants</h3>
        <div className="divide-y divide-[#F1F5F9]">
          {topMerchants.map((merchant) => (
            <div
              key={merchant.name}
              className="group flex items-center justify-between rounded-lg px-2 py-3 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold uppercase text-slate-500">
                  {merchant.name.substring(0, 2)}
                </div>
                <span className="text-sm font-semibold text-[#334155]">
                  {merchant.name}
                </span>
              </div>
              <span className="text-sm font-bold text-[#0F172A]">
                {formatRupiah(merchant.total)}
              </span>
            </div>
          ))}
        </div>
        <Link
          href="/dashboard/receipt"
          className="mt-4 flex w-full items-center justify-center gap-1 py-2 text-xs font-bold text-[#2563EB] hover:underline"
        >
          View All <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
