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
    <div className="flex h-full flex-col rounded-[2rem] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
      <h3 className="mb-5 text-base font-bold text-[#0F172A] md:mb-6 md:text-lg">
        Top Categories
      </h3>

      <div className="flex-1 space-y-3 md:space-y-4">
        {topCategories.length > 0 ? (
          topCategories.map((category, index) => (
            <div
              key={`${category.name}-${index}`}
              className="flex items-center gap-3"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl md:h-10 md:w-10"
                style={{
                  backgroundColor: `${category.color}18`,
                  color: category.color,
                }}
              >
                <span className="text-base">📊</span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-[#0F172A]">
                  {category.name}
                </div>
                <div className="text-xs text-[#64748B]">
                  {category.count} transactions
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-sm font-bold text-[#0F172A]">
                  {formatRupiah(category.total)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center text-[#94A3B8]">
            <div className="mb-2 text-4xl">🧭</div>
            <p className="text-sm font-medium">No categories yet</p>
            <p className="text-xs">Your spending categories will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
