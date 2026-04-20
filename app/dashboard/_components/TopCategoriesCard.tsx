"use client";

import type { CategorySummary } from "../_lib/dashboardTypes";
import { formatRupiah } from "../_lib/dashboardUtils";

interface TopCategoriesCardProps {
  topCategories: CategorySummary[];
}

export default function TopCategoriesCard({
  topCategories,
}: TopCategoriesCardProps) {
  return (
    <div className="flex h-full flex-col rounded-[2rem] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold text-[#0F172A]">
        Top Categories
      </h3>

      <div className="flex-1 space-y-4">
        {topCategories.length > 0 ? (
          topCategories.map((category, index) => (
            <div key={`${category.name}-${index}`} className="flex items-center gap-4 group">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `${category.color}18`,
                  color: category.color,
                }}
              >
                <span>📊</span>
              </div>

              <div className="flex-1">
                <div className="text-sm font-bold text-[#0F172A]">
                  {category.name}
                </div>
                <div className="text-xs text-[#64748B]">
                  {category.count} transactions
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-[#0F172A]">
                  {formatRupiah(category.total)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center text-[#94A3B8]">
            <div className="mb-2 text-4xl">🧭</div>
            <p className="text-sm font-medium">No categories yet</p>
            <p className="text-xs">Your spending categories will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
