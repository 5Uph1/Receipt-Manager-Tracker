"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "../_components/DashboardShell";
import InsightBreakdownPanel from "./_components/InsightBreakdownPanel";
import InsightDateFilter from "./_components/InsightDateFilter";
import InsightSummarySection from "./_components/InsightSummarySection";
import { logout } from "@/services/authService";
import { supabaseClient } from "@/lib/client/supabaseClient";
import type { DateFilter } from "../_lib/dashboardTypes";
import {
  buildDateParams,
  getComparisonLabel,
  getDateRange,
} from "../_lib/dashboardUtils";
import type {
  InsightCategorySummary,
  InsightMerchantSummary,
  InsightReceipt,
} from "./_lib/insightTypes";

export default function InsightsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [totalReceipts, setTotalReceipts] = useState(0);
  const [uniqueMerchants, setUniqueMerchants] = useState(0);
  const [avgPerDay, setAvgPerDay] = useState(0);
  const [categories, setCategories] = useState<InsightCategorySummary[]>([]);
  const [topMerchants, setTopMerchants] = useState<InsightMerchantSummary[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter>("this_month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDateDropdown, setShowDateDropdown] = useState(false);

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
    const fetchData = async () => {
      setLoading(true);

      try {
        const range = getDateRange(dateFilter, startDate, endDate);

        if (!range.start || !range.end) {
          setCategories([]);
          setTopMerchants([]);
          return;
        }

        const { end, prevEnd, prevStart, start } = range;

        const [currentResponse, previousResponse, categoryResponse] =
          await Promise.all([
            fetch(`/api/receipt?${buildDateParams(start, end)}`),
            prevStart && prevEnd
              ? fetch(`/api/receipt?${buildDateParams(prevStart, prevEnd)}`)
              : Promise.resolve(null),
            fetch(`/api/categories/summary?${buildDateParams(start, end)}`),
          ]);

        const currentData = await currentResponse.json();
        const previousData = previousResponse
          ? await previousResponse.json()
          : null;
        const categoryData = await categoryResponse.json();

        const currentReceipts: InsightReceipt[] = currentData.receipts || [];
        const previousReceipts: InsightReceipt[] = previousData?.receipts || [];

        const currentTotal = currentReceipts.reduce(
          (sum, receipt) => sum + (receipt.total_amount || 0),
          0,
        );
        const previousTotal = previousReceipts.reduce(
          (sum, receipt) => sum + (receipt.total_amount || 0),
          0,
        );

        const merchantMap = new Map<string, InsightMerchantSummary>();

        currentReceipts.forEach((receipt) => {
          const name = receipt.merchant_name || "Unknown";
          const existing = merchantMap.get(name) || { name, total: 0, count: 0 };

          merchantMap.set(name, {
            name,
            total: existing.total + (receipt.total_amount || 0),
            count: existing.count + 1,
          });
        });

        const days =
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;
        const average = currentTotal > 0 ? Math.round(currentTotal / days) : 0;
        const diff =
          previousTotal === 0
            ? currentTotal === 0
              ? 0
              : 100
            : ((currentTotal - previousTotal) / previousTotal) * 100;

        setTotalSpent(currentTotal);
        setTotalReceipts(currentReceipts.length);
        setUniqueMerchants(merchantMap.size);
        setAvgPerDay(average);
        setCategories(categoryData.categories || []);
        setTopMerchants(
          Array.from(merchantMap.values())
            .sort((a, b) => b.total - a.total)
            .slice(0, 5),
        );
        setPercentage(diff);
      } catch (error) {
        console.error(error);
        setCategories([]);
        setTopMerchants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateFilter, endDate, startDate]);

  useEffect(() => {
    const handleClickOutside = () => setShowDateDropdown(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace("/auth");
  };

  const handleDateFilterChange = (value: DateFilter) => {
    setDateFilter(value);

    if (value !== "custom") {
      setStartDate("");
      setEndDate("");
    }
  };

  const comparisonLabel = getComparisonLabel(dateFilter, startDate, endDate);

  return (
    <DashboardShell
      activeItem="insight"
      onLogout={handleLogout}
      contentClassName="mx-auto max-w-6xl space-y-6 px-4 pb-8 pt-24 md:px-8"
    >
      <div className="mb-2 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
            Spending Insights
          </h1>
          <p className="text-sm text-[#64748B]">
            In-depth analysis of your financial expenses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <InsightDateFilter
            dateFilter={dateFilter}
            endDate={endDate}
            onDateFilterChange={handleDateFilterChange}
            onEndDateChange={(value) => {
              setEndDate(value);
              setDateFilter("custom");
            }}
            onStartDateChange={(value) => {
              setStartDate(value);
              setDateFilter("custom");
            }}
            setShowDateDropdown={setShowDateDropdown}
            showDateDropdown={showDateDropdown}
            startDate={startDate}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <InsightSummarySection
          averagePerDay={avgPerDay}
          comparisonLabel={comparisonLabel}
          leadingCategoryName={categories[0]?.name}
          loading={loading}
          percentage={percentage}
          totalReceipts={totalReceipts}
          totalSpent={totalSpent}
          uniqueMerchants={uniqueMerchants}
        />

        <InsightBreakdownPanel
          categories={categories}
          topMerchants={topMerchants}
          totalSpent={totalSpent}
        />
      </div>
    </DashboardShell>
  );
}
