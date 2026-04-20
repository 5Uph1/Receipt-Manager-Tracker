"use client";

import { CalendarClock, PieChart, Receipt, Store, TrendingDown, TrendingUp } from "lucide-react";
import { formatRupiah } from "../../_lib/dashboardUtils";

interface InsightSummarySectionProps {
  averagePerDay: number;
  comparisonLabel: string;
  leadingCategoryName?: string;
  loading: boolean;
  percentage: number;
  totalReceipts: number;
  totalSpent: number;
  uniqueMerchants: number;
}

export default function InsightSummarySection({
  averagePerDay,
  comparisonLabel,
  leadingCategoryName,
  loading,
  percentage,
  totalReceipts,
  totalSpent,
  uniqueMerchants,
}: InsightSummarySectionProps) {
  return (
    <div className="space-y-6 lg:col-span-2">
      <div className="group relative overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
        <div className="absolute right-0 top-0 p-8 opacity-10 transition-transform group-hover:scale-110">
          <PieChart size={120} className="text-[#2563EB]" />
        </div>
        <div className="relative z-10">
          <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-[#64748B]">
            Total Spent
          </p>
          <h2 className="mb-4 text-4xl font-black text-[#0F172A]">
            {loading ? "..." : formatRupiah(totalSpent)}
          </h2>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span
              className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold ${
                percentage > 0
                  ? "bg-red-50 text-red-600"
                  : percentage < 0
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-gray-100 text-gray-500"
              }`}
            >
              {percentage > 0 ? (
                <TrendingUp size={14} />
              ) : percentage < 0 ? (
                <TrendingDown size={14} />
              ) : null}
              {percentage > 0 ? "+" : ""}
              {percentage.toFixed(1)}%
            </span>

            <span className="text-xs font-medium text-[#64748B]">
              {comparisonLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Receipt size={20} />
          </div>
          <p className="text-xs font-bold uppercase tracking-tighter text-[#64748B]">
            Total Receipt
          </p>
          <p className="text-xl font-black text-[#0F172A]">{totalReceipts}</p>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Store size={20} />
          </div>
          <p className="text-xs font-bold uppercase tracking-tighter text-[#64748B]">
            Merchant
          </p>
          <p className="text-xl font-black text-[#0F172A]">{uniqueMerchants}</p>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <CalendarClock size={20} />
          </div>
          <p className="text-xs font-bold uppercase tracking-tighter text-[#64748B]">
            Average/Day
          </p>
          <p className="text-xl font-black text-[#0F172A]">
            {formatRupiah(averagePerDay)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] p-6 text-white shadow-lg shadow-blue-100">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">💡</div>
          <div>
            <h4 className="mb-1 font-bold">Smart Analysis</h4>
            <p className="text-sm leading-relaxed text-blue-100">
              {percentage > 0
                ? `Your spending increased by ${percentage}% compared to usual.`
                : percentage < 0
                  ? `Your spending decreased by ${Math.abs(percentage)}% compared to usual.`
                  : "Your spending is stable compared to the previous period."}{" "}
              Most of it is allocated to the{" "}
              <strong>{leadingCategoryName || "essential"}</strong> category.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
