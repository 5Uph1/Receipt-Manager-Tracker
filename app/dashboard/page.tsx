"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/services/authService";
import { supabaseClient } from "@/lib/client/supabaseClient";
import { exportToPDF } from "@/lib/exportPDF";
import DashboardActions from "./_components/DashboardActions";
import DashboardSidebar from "./_components/DashboardSidebar";
import DashboardSummaryCard from "./_components/DashboardSummaryCard";
import DashboardTopbar from "./_components/DashboardTopbar";
import RecentReceiptsCard from "./_components/RecentReceiptsCard";
import TopCategoriesCard from "./_components/TopCategoriesCard";
import type {
  CategorySummary,
  DateFilter,
  ReceiptItem,
} from "./_lib/dashboardTypes";
import {
  buildDateParams,
  getComparisonLabel,
  getDateRange,
} from "./_lib/dashboardUtils";

export default function Dashboard() {
  const router = useRouter();

  const [totalSpent, setTotalSpent] = useState(0);
  const [loadingTotal, setLoadingTotal] = useState(false);
  const [dateLabel, setDateLabel] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("this_month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [topCategories, setTopCategories] = useState<CategorySummary[]>([]);
  const [recentReceipts, setRecentReceipts] = useState<ReceiptItem[]>([]);
  const [loadingReceipts, setLoadingReceipts] = useState(false);
  const [allReceipts, setAllReceipts] = useState<ReceiptItem[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabaseClient.auth.getUser();

      if (!data.user) {
        router.replace("/auth");
      }
    };

    checkUser();
  }, [router]);

  useEffect(() => {
    const handleClickOutside = () => setShowDateDropdown(false);

    window.addEventListener("click", handleClickOutside);

    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingTotal(true);

      try {
        const { start, end, prevStart, prevEnd, label } = getDateRange(
          dateFilter,
          startDate,
          endDate,
        );

        const [currentRes, prevRes, categoryRes] = await Promise.all([
          fetch(`/api/receipt?${buildDateParams(start, end)}`),
          prevStart && prevEnd
            ? fetch(`/api/receipt?${buildDateParams(prevStart, prevEnd)}`)
            : Promise.resolve(null),
          fetch(`/api/categories/summary?${buildDateParams(start, end)}`),
        ]);

        const currentData = await currentRes.json();
        const prevData = prevRes ? await prevRes.json() : null;
        const categoryData = await categoryRes.json();

        const currentTotal = (currentData.receipts || []).reduce(
          (sum: number, receipt: ReceiptItem) => sum + (receipt.total_amount || 0),
          0,
        );

        const prevTotal = prevData
          ? prevData.receipts.reduce(
              (sum: number, receipt: ReceiptItem) =>
                sum + (receipt.total_amount || 0),
              0,
            )
          : 0;

        const diff =
          prevTotal === 0 ? 0 : ((currentTotal - prevTotal) / prevTotal) * 100;

        setTotalSpent(currentTotal);
        setPercentage(diff);
        setTopCategories(categoryData.categories || []);
        setAllReceipts(currentData.receipts || []);
        setDateLabel(label);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingTotal(false);
      }
    };

    fetchDashboardData();
  }, [dateFilter, startDate, endDate]);

  useEffect(() => {
    const fetchRecentReceipts = async () => {
      setLoadingReceipts(true);

      try {
        const response = await fetch("/api/receipt?page=1&limit=4", {
          credentials: "include",
        });

        const data = await response.json();
        setRecentReceipts(data.receipts || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingReceipts(false);
      }
    };

    fetchRecentReceipts();
  }, []);

  const comparisonLabel = getComparisonLabel(dateFilter, startDate, endDate);

  const handleLogout = async () => {
    await logout();
    router.replace("/auth");
  };

  const handleSelectPreset = (filter: "this_week" | "this_month") => {
    setDateFilter(filter);
    setStartDate("");
    setEndDate("");
    setShowDateDropdown(false);
  };

  const handleApplyCustomRange = () => {
    setShowDateDropdown(false);
  };

  const handleResetFilter = () => {
    setDateFilter("");
    setStartDate("");
    setEndDate("");
    setShowDateDropdown(false);
  };

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    setDateFilter("custom");
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    setDateFilter("custom");
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const exportReceipts = allReceipts.map((receipt) => ({
        id: receipt.id,
        merchant_name: receipt.merchant_name,
        total_amount: receipt.total_amount,
        receipt_date: receipt.receipt_date,
        image_url: receipt.image_url || undefined,
        categories: receipt.categories
          ? {
              name: receipt.categories.name || "Uncategorized",
              color: receipt.categories.color || "#94A3B8",
            }
          : undefined,
      }));

      await exportToPDF({
        totalSpent,
        dateLabel,
        percentage,
        comparisonLabel,
        topCategories,
        receipts: exportReceipts,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#0F172A] antialiased">
      <DashboardSidebar activeItem="dashboard" onLogout={handleLogout} />

      <main className="relative min-h-screen flex-1 pb-24 md:ml-64 md:pb-8">
        <DashboardTopbar />

        <div className="mx-auto max-w-6xl space-y-6 px-4 pb-8 pt-24 md:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <DashboardSummaryCard
              comparisonLabel={comparisonLabel}
              dateFilter={dateFilter}
              endDate={endDate}
              loadingTotal={loadingTotal}
              onApplyCustomRange={handleApplyCustomRange}
              onEndDateChange={handleEndDateChange}
              onResetFilter={handleResetFilter}
              onSelectPreset={handleSelectPreset}
              onStartDateChange={handleStartDateChange}
              percentage={percentage}
              showDateDropdown={showDateDropdown}
              startDate={startDate}
              toggleDateDropdown={() =>
                setShowDateDropdown((previous) => !previous)
              }
              totalSpent={totalSpent}
            />

            <TopCategoriesCard topCategories={topCategories} />
          </div>

          <RecentReceiptsCard
            loadingReceipts={loadingReceipts}
            recentReceipts={recentReceipts}
          />

          <DashboardActions
            isExporting={isExporting}
            onExport={handleExport}
          />
        </div>
      </main>
    </div>
  );
}
