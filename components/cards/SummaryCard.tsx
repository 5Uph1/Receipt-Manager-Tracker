"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

export default function SummaryCard({
  totalSpent,
  percentage,
  loading,
  formatRupiah,
  comparisonLabel,
  children,
}: any) {
  return (
    <div className="bg-blue-600 p-8 rounded-2xl text-white">
      {children} {/* date filter masuk sini */}
      <div className="text-4xl font-bold">
        {loading ? "Loading..." : formatRupiah(totalSpent)}
      </div>
      <div className="flex gap-2 mt-2">
        {percentage >= 0 ? <TrendingUp /> : <TrendingDown />}
        {percentage.toFixed(1)}%<span>{comparisonLabel}</span>
      </div>
    </div>
  );
}
