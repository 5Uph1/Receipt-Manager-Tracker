"use client";

import { CalendarDays, Check, ChevronDown } from "lucide-react";
import type { DateFilter } from "../../_lib/dashboardTypes";

interface InsightDateFilterProps {
  dateFilter: DateFilter;
  endDate: string;
  onDateFilterChange: (value: DateFilter) => void;
  onEndDateChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  setShowDateDropdown: (value: boolean) => void;
  showDateDropdown: boolean;
  startDate: string;
}

export default function InsightDateFilter({
  dateFilter,
  endDate,
  onDateFilterChange,
  onEndDateChange,
  onStartDateChange,
  setShowDateDropdown,
  showDateDropdown,
  startDate,
}: InsightDateFilterProps) {
  const buttonLabel =
    dateFilter === "this_week"
      ? "This Week"
      : dateFilter === "this_month"
        ? "This Month"
        : dateFilter === "custom" && startDate && endDate
          ? `${startDate} - ${endDate}`
          : "Select Range";

  return (
    <div className="relative" onClick={(event) => event.stopPropagation()}>
      <button
        onClick={() => setShowDateDropdown(!showDateDropdown)}
        className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#0F172A] shadow-sm transition-all hover:bg-gray-50"
      >
        <CalendarDays size={16} className="text-[#2563EB]" />
        {buttonLabel}
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${showDateDropdown ? "rotate-180" : ""}`}
        />
      </button>

      {showDateDropdown && (
        <div className="absolute right-0 top-full z-[999] mt-2 w-64 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-xl">
          {(["this_week", "this_month"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => {
                onDateFilterChange(filter);
                setShowDateDropdown(false);
              }}
              className={`flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left font-['Plus_Jakarta_Sans'] text-sm transition-colors ${
                dateFilter === filter
                  ? "bg-[#EFF6FF] font-bold text-[#2563EB]"
                  : "text-[#0F172A] hover:bg-[#F8FAFC]"
              }`}
            >
              <CalendarDays size={14} />
              {filter === "this_week" ? "This Week" : "This Month"}
              {dateFilter === filter && <Check size={13} className="ml-auto" />}
            </button>
          ))}

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
              onClick={() => setShowDateDropdown(false)}
              className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] py-2.5 font-['Plus_Jakarta_Sans'] text-sm font-bold text-white transition-all hover:from-[#2563EB] hover:to-[#3B82F6]"
            >
              Terapkan
            </button>
          </div>

          {dateFilter && (
            <div className="px-4 pb-4">
              <button
                onClick={() => {
                  onDateFilterChange("");
                  setShowDateDropdown(false);
                }}
                className="w-full cursor-pointer py-2 font-['Plus_Jakarta_Sans'] text-xs text-[#94A3B8] transition-colors hover:text-[#DC2626]"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
