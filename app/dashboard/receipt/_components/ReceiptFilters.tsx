"use client";

import {
  CalendarDays,
  Check,
  ChevronDown,
  DollarSign,
  Search,
  Tag,
  X,
} from "lucide-react";
import type {
  ReceiptCategory,
  ReceiptDateFilter,
  ReceiptSortBy,
} from "../_lib/receiptTypes";

interface ReceiptFiltersProps {
  categories: ReceiptCategory[];
  dateButtonLabel: string;
  dateFilter: ReceiptDateFilter;
  endDate: string;
  onCategoryFilterChange: (value: string) => void;
  onDateFilterChange: (value: ReceiptDateFilter) => void;
  onDatePickerChange: (field: "startDate" | "endDate", value: string) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: ReceiptSortBy) => void;
  openDropdown: "category" | "date" | "sort" | null;
  search: string;
  selectedCategory: string;
  setOpenDropdown: (value: "category" | "date" | "sort" | null) => void;
  sortBy: ReceiptSortBy;
  sortLabel: string;
  startDate: string;
}

export default function ReceiptFilters({
  categories,
  dateButtonLabel,
  dateFilter,
  endDate,
  onCategoryFilterChange,
  onDateFilterChange,
  onDatePickerChange,
  onSearchChange,
  onSortChange,
  openDropdown,
  search,
  selectedCategory,
  setOpenDropdown,
  sortBy,
  sortLabel,
  startDate,
}: ReceiptFiltersProps) {
  const selectedCategoryLabel = selectedCategory
    ? categories.find((category) => category.id === selectedCategory)?.name
    : "Category";

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-3 md:p-4">
      {/* Search */}
      <div className="relative w-full">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]">
          <Search size={16} />
        </div>
        <input
          className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 pl-10 pr-10 font-['Plus_Jakarta_Sans'] text-sm text-[#0F172A] outline-none transition-all placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
          placeholder="Search merchants or notes..."
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        {search && (
          <button
            onClick={(event) => {
              event.stopPropagation();
              onSearchChange("");
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] transition-colors hover:text-[#0F172A]"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Filter Buttons — scroll horizontal di mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {/* Date Filter */}
        <div className="relative shrink-0">
          <button
            onClick={(event) => {
              event.stopPropagation();
              setOpenDropdown(openDropdown === "date" ? null : "date");
            }}
            className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 font-['Plus_Jakarta_Sans'] text-xs font-semibold transition-colors md:gap-2 md:px-3.5 md:py-2.5 md:text-sm ${
              dateFilter
                ? "bg-[#2563EB] text-white"
                : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
            }`}
          >
            <CalendarDays size={14} />
            {dateButtonLabel}
            <ChevronDown
              size={12}
              className={`transition-transform ${openDropdown === "date" ? "rotate-180" : ""}`}
            />
          </button>

          {openDropdown === "date" && (
            <div
              className="absolute top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              {(["this_week", "this_month"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    onDateFilterChange(filter);
                    setOpenDropdown(null);
                  }}
                  className={`flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left font-['Plus_Jakarta_Sans'] text-sm transition-colors ${
                    dateFilter === filter
                      ? "bg-[#EFF6FF] font-semibold text-[#2563EB]"
                      : "text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <CalendarDays size={14} />
                  {filter === "this_week" ? "Minggu Ini" : "Bulan Ini"}
                  {dateFilter === filter && (
                    <Check size={13} className="ml-auto" />
                  )}
                </button>
              ))}
              <div className="mx-4 my-1 border-t border-[#E2E8F0]" />
              <div className="space-y-3 p-4">
                <p className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  Custom Range
                </p>
                {[
                  {
                    label: "Dari",
                    value: startDate,
                    field: "startDate" as const,
                  },
                  {
                    label: "Sampai",
                    value: endDate,
                    field: "endDate" as const,
                  },
                ].map(({ field, label, value }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <label className="font-['Plus_Jakarta_Sans'] text-xs text-[#64748B]">
                      {label}
                    </label>
                    <input
                      type="date"
                      value={value}
                      onChange={(event) =>
                        onDatePickerChange(field, event.target.value)
                      }
                      className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 font-['Plus_Jakarta_Sans'] text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 [color-scheme:light]"
                    />
                  </div>
                ))}
                <button
                  onClick={() => setOpenDropdown(null)}
                  className="w-full cursor-pointer rounded-xl bg-[#2563EB] py-2.5 font-['Plus_Jakarta_Sans'] text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
                >
                  Terapkan
                </button>
              </div>
              {dateFilter && (
                <div className="px-4 pb-4">
                  <button
                    onClick={() => {
                      onDateFilterChange("");
                      onDatePickerChange("startDate", "");
                      onDatePickerChange("endDate", "");
                      setOpenDropdown(null);
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

        {/* Category Filter */}
        <div className="relative shrink-0">
          <button
            onClick={(event) => {
              event.stopPropagation();
              setOpenDropdown(openDropdown === "category" ? null : "category");
            }}
            className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 font-['Plus_Jakarta_Sans'] text-xs font-semibold transition-colors md:gap-2 md:px-3.5 md:py-2.5 md:text-sm ${
              selectedCategory
                ? "bg-[#2563EB] text-white"
                : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
            }`}
          >
            <Tag size={14} />
            {selectedCategoryLabel}
            <ChevronDown
              size={12}
              className={`transition-transform ${openDropdown === "category" ? "rotate-180" : ""}`}
            />
          </button>

          {openDropdown === "category" && (
            <div
              className="absolute top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                onClick={() => {
                  onCategoryFilterChange("");
                  setOpenDropdown(null);
                }}
                className={`w-full cursor-pointer px-4 py-3 text-left font-['Plus_Jakarta_Sans'] text-sm transition-colors ${
                  !selectedCategory
                    ? "bg-[#EFF6FF] font-semibold text-[#2563EB]"
                    : "text-[#0F172A] hover:bg-[#F8FAFC]"
                }`}
              >
                Semua Kategori
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    onCategoryFilterChange(category.id);
                    setOpenDropdown(null);
                  }}
                  className={`flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left font-['Plus_Jakarta_Sans'] text-sm transition-colors ${
                    selectedCategory === category.id
                      ? "bg-[#EFF6FF] font-semibold text-[#2563EB]"
                      : "text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.name}
                  {selectedCategory === category.id && (
                    <Check size={13} className="ml-auto" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort */}
        <div className="relative shrink-0">
          <button
            onClick={(event) => {
              event.stopPropagation();
              setOpenDropdown(openDropdown === "sort" ? null : "sort");
            }}
            className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 font-['Plus_Jakarta_Sans'] text-xs font-semibold transition-colors md:gap-2 md:px-3.5 md:py-2.5 md:text-sm ${
              sortBy !== "newest"
                ? "bg-[#2563EB] text-white"
                : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
            }`}
          >
            <DollarSign size={14} />
            {sortLabel}
            <ChevronDown
              size={12}
              className={`transition-transform ${openDropdown === "sort" ? "rotate-180" : ""}`}
            />
          </button>

          {openDropdown === "sort" && (
            <div
              className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              {[
                { key: "newest", label: "Newest" },
                { key: "oldest", label: "Oldest" },
                { key: "highest", label: "Highest Amount" },
                { key: "lowest", label: "Lowest Amount" },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => {
                    onSortChange(option.key as ReceiptSortBy);
                    setOpenDropdown(null);
                  }}
                  className={`flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left font-['Plus_Jakarta_Sans'] text-sm transition-colors ${
                    sortBy === option.key
                      ? "bg-[#EFF6FF] font-semibold text-[#2563EB]"
                      : "text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <DollarSign size={14} />
                  {option.label}
                  {sortBy === option.key && (
                    <Check size={13} className="ml-auto" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
