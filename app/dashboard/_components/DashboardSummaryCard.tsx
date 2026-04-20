"use client";

import { CalendarDays, Check, ChevronDown, TrendingDown, TrendingUp } from "lucide-react";
import type { DateFilter } from "../_lib/dashboardTypes";
import { formatRupiah } from "../_lib/dashboardUtils";

interface DashboardSummaryCardProps {
  comparisonLabel: string;
  dateFilter: DateFilter;
  endDate: string;
  loadingTotal: boolean;
  onApplyCustomRange: () => void;
  onResetFilter: () => void;
  onSelectPreset: (filter: Exclude<DateFilter, "custom" | "">) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  percentage: number;
  showDateDropdown: boolean;
  startDate: string;
  toggleDateDropdown: () => void;
  totalSpent: number;
}

export default function DashboardSummaryCard({
  comparisonLabel,
  dateFilter,
  endDate,
  loadingTotal,
  onApplyCustomRange,
  onEndDateChange,
  onResetFilter,
  onSelectPreset,
  onStartDateChange,
  percentage,
  showDateDropdown,
  startDate,
  toggleDateDropdown,
  totalSpent,
}: DashboardSummaryCardProps) {
  const buttonLabel =
    dateFilter === "this_week"
      ? "This Week"
      : dateFilter === "this_month"
        ? "This Month"
        : dateFilter === "custom" && startDate && endDate
          ? `${startDate} - ${endDate}`
          : "Select Range";

  return (
    <div className="relative flex min-h-[280px] flex-col overflow-visible rounded-[2rem] bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] p-8 shadow-lg shadow-blue-200 lg:col-span-2">
      <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
        <div className="absolute right-[-10%] top-[-50%] h-[300px] w-[300px] rounded-full bg-blue-400/20 blur-[80px]" />
      </div>

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <h2 className="mb-1 text-lg font-semibold tracking-tight text-blue-100">
            Total Spent
          </h2>

          <div className="relative" onClick={(event) => event.stopPropagation()}>
            <button
              onClick={toggleDateDropdown}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 font-['Plus_Jakarta_Sans'] text-sm font-medium transition-colors ${
                dateFilter
                  ? "border border-white/30 bg-white/20 text-white"
                  : "border border-white/20 bg-white/10 text-blue-100 hover:bg-white/20"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
                  clipRule="evenodd"
                />
              </svg>
              {buttonLabel}
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${showDateDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {showDateDropdown && (
              <div className="absolute top-full z-[999] mt-2 w-64 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-xl">
                <button
                  onClick={() => onSelectPreset("this_week")}
                  className={`flex w-full items-center gap-2 px-4 py-3 text-left font-['Plus_Jakarta_Sans'] text-sm transition-colors ${
                    dateFilter === "this_week"
                      ? "bg-[#EFF6FF] font-bold text-[#2563EB]"
                      : "text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <CalendarDays size={14} />
                  This Week
                  {dateFilter === "this_week" && <Check size={13} className="ml-auto" />}
                </button>

                <button
                  onClick={() => onSelectPreset("this_month")}
                  className={`flex w-full items-center gap-2 px-4 py-3 text-left font-['Plus_Jakarta_Sans'] text-sm transition-colors ${
                    dateFilter === "this_month"
                      ? "bg-[#EFF6FF] font-bold text-[#2563EB]"
                      : "text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <CalendarDays size={14} />
                  This Month
                  {dateFilter === "this_month" && <Check size={13} className="ml-auto" />}
                </button>

                <div className="mx-4 my-1 border-t border-[#E2E8F0]" />

                <div className="space-y-3 p-4">
                  <p className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Custom Range
                  </p>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-['Plus_Jakarta_Sans'] text-xs text-[#64748B]">
                      Dari
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(event) => onStartDateChange(event.target.value)}
                      className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 font-['Plus_Jakarta_Sans'] text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-['Plus_Jakarta_Sans'] text-xs text-[#64748B]">
                      Sampai
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(event) => onEndDateChange(event.target.value)}
                      className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 font-['Plus_Jakarta_Sans'] text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                    />
                  </div>

                  <button
                    onClick={onApplyCustomRange}
                    className="w-full rounded-xl bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] py-2.5 font-['Plus_Jakarta_Sans'] text-sm font-bold text-white transition-all hover:from-[#2563EB] hover:to-[#3B82F6]"
                  >
                    Terapkan
                  </button>
                </div>

                {dateFilter && (
                  <div className="px-4 pb-4">
                    <button
                      onClick={onResetFilter}
                      className="w-full py-2 font-['Plus_Jakarta_Sans'] text-xs text-[#94A3B8] transition-colors hover:text-[#DC2626]"
                    >
                      Reset Filter
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <button className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="relative z-0 mt-8">
        <div className="mb-4 text-[4rem] leading-none font-extrabold tracking-tighter text-white">
          {loadingTotal ? "Loading..." : formatRupiah(totalSpent)}
        </div>

        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="flex items-center gap-1 rounded-md bg-white/20 px-2 py-0.5 text-white">
            {percentage >= 0 ? <TrendingUp /> : <TrendingDown />}
            <span
              className={`text-sm font-semibold ${
                percentage >= 0 ? "text-green-300" : "text-red-300"
              }`}
            >
              {percentage >= 0 ? "+" : ""}
              {percentage.toFixed(1)}%
            </span>
          </span>
          <span className="text-blue-100">{comparisonLabel}</span>
        </div>
      </div>
    </div>
  );
}
