"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardShell from "../_components/DashboardShell";
import PageHeader from "../_components/PageHeader";
import { logout } from "@/services/authService";
import ReceiptDetailDialog from "./_components/ReceiptDetailDialog";
import ReceiptFilters from "./_components/ReceiptFilters";
import ReceiptGrid from "./_components/ReceiptGrid";
import ReceiptPagination from "./_components/ReceiptPagination";
import type {
  ReceiptCategory,
  ReceiptData,
  ReceiptDateFilter,
  ReceiptSortBy,
} from "./_lib/receiptTypes";
import {
  getReceiptDateRange,
  receiptDateLabelMap,
  receiptSortLabelMap,
} from "./_lib/receiptUtils";

export default function ReceiptPage() {
  const router = useRouter();
  const [receipts, setReceipts] = useState<ReceiptData[]>([]);
  const [categories, setCategories] = useState<ReceiptCategory[]>([]);
  const [selected, setSelected] = useState<ReceiptData | null>(null);
  const [loadingReceipts, setLoadingReceipts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dateFilter, setDateFilter] = useState<ReceiptDateFilter>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<ReceiptSortBy>("newest");
  const [openDropdown, setOpenDropdown] = useState<
    "category" | "date" | "sort" | null
  >(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [receiptResponse, categoryResponse] = await Promise.all([
          fetch("/api/receipt", { credentials: "include" }),
          fetch("/api/categories", { credentials: "include" }),
        ]);

        const receiptData = await receiptResponse.json();
        const categoryData = await categoryResponse.json();

        setReceipts(receiptData.receipts ?? []);
        setCategories(categoryData.categories ?? []);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setLoadingReceipts(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    const fetchFilteredReceipts = async () => {
      setLoadingReceipts(true);

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("sort", sortBy);

      if (selectedCategory) {
        params.set("category_id", selectedCategory);
      }

      const { end, start } = getReceiptDateRange(
        dateFilter,
        startDate,
        endDate,
      );

      if (start) {
        params.set("start_date", start);
      }

      if (end) {
        params.set("end_date", end);
      }

      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      }

      try {
        const response = await fetch(
          `/api/receipt${params.toString() ? `?${params}` : ""}`,
          { credentials: "include" },
        );
        const data = await response.json();

        setReceipts(data.receipts ?? []);
        setTotalPages(data.totalPages ?? 1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingReceipts(false);
      }
    };

    fetchFilteredReceipts();
  }, [
    dateFilter,
    debouncedSearch,
    endDate,
    page,
    selectedCategory,
    sortBy,
    startDate,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    dateFilter,
    debouncedSearch,
    endDate,
    selectedCategory,
    sortBy,
    startDate,
  ]);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace("/auth");
  };

  const handleUpdated = (updated: ReceiptData) => {
    setReceipts((previous) =>
      previous.map((receipt) =>
        receipt.id === updated.id ? updated : receipt,
      ),
    );
    setSelected(updated);
  };

  const handleDeleted = (id: string) => {
    setReceipts((previous) => previous.filter((receipt) => receipt.id !== id));
    setSelected(null);
  };

  const handleDateFilterChange = (value: ReceiptDateFilter) => {
    setDateFilter(value);

    if (value !== "custom") {
      setStartDate("");
      setEndDate("");
    }
  };

  const handleDatePickerChange = (
    field: "startDate" | "endDate",
    value: string,
  ) => {
    if (field === "startDate") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }

    setDateFilter("custom");
  };

  const handleResetFilters = () => {
    setDateFilter("");
    setStartDate("");
    setEndDate("");
    setSelectedCategory("");
    setSearch("");
  };

  const { end: activeEnd, start: activeStart } = getReceiptDateRange(
    dateFilter,
    startDate,
    endDate,
  );

  const dateButtonLabel =
    dateFilter === "custom" && activeStart && activeEnd
      ? `${activeStart} - ${activeEnd}`
      : receiptDateLabelMap[dateFilter];

  return (
    <DashboardShell activeItem="receipt" onLogout={handleLogout}>
      {selected && (
        <ReceiptDetailDialog
          receipt={selected}
          categories={categories}
          onClose={() => setSelected(null)}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      )}

      <PageHeader
        title="All Receipts"
        description="Your complete financial archive, meticulously organized."
        action={
          <Link
            href="/dashboard/receipt/newReceipt"
            className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#1D4ED8]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                clipRule="evenodd"
              />
            </svg>
            Add Receipt
          </Link>
        }
      />

      <ReceiptFilters
        categories={categories}
        dateButtonLabel={dateButtonLabel}
        dateFilter={dateFilter}
        endDate={endDate}
        onCategoryFilterChange={setSelectedCategory}
        onDateFilterChange={handleDateFilterChange}
        onDatePickerChange={handleDatePickerChange}
        onSearchChange={setSearch}
        onSortChange={setSortBy}
        openDropdown={openDropdown}
        search={search}
        selectedCategory={selectedCategory}
        setOpenDropdown={setOpenDropdown}
        sortBy={sortBy}
        sortLabel={receiptSortLabelMap[sortBy]}
        startDate={startDate}
      />

      <ReceiptGrid
        dateFilterActive={Boolean(dateFilter)}
        loading={loadingReceipts}
        onOpenReceipt={setSelected}
        onResetFilters={handleResetFilters}
        receipts={receipts}
        selectedCategory={selectedCategory}
      />

      <ReceiptPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </DashboardShell>
  );
}
