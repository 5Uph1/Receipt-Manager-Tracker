import type { DateFilter, DateRangeResult } from "./dashboardTypes";

export function formatRupiah(num: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getDateRange(
  dateFilter: DateFilter,
  startDate: string,
  endDate: string,
): DateRangeResult {
  const today = new Date();

  if (dateFilter === "this_week") {
    const day = today.getDay();
    const diffToMon = day === 0 ? -6 : 1 - day;

    const start = new Date(today);
    start.setDate(today.getDate() + diffToMon);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const prevStart = new Date(start);
    prevStart.setDate(start.getDate() - 7);

    const prevEnd = new Date(end);
    prevEnd.setDate(end.getDate() - 7);

    return {
      start,
      end,
      prevStart,
      prevEnd,
      label: "This Week",
    };
  }

  if (dateFilter === "this_month") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const prevStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const prevEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    return {
      start,
      end,
      prevStart,
      prevEnd,
      label: "This Month",
    };
  }

  if (dateFilter === "custom") {
    if (!startDate || !endDate) {
      return {
        start: null,
        end: null,
        prevStart: null,
        prevEnd: null,
        label: "",
      };
    }

    return {
      start: new Date(startDate),
      end: new Date(endDate),
      prevStart: null,
      prevEnd: null,
      label: "Custom Range",
    };
  }

  return {
    start: null,
    end: null,
    prevStart: null,
    prevEnd: null,
    label: "",
  };
}

export function buildDateParams(start: Date | null, end: Date | null) {
  const params = new URLSearchParams();

  if (start) {
    params.set("start_date", start.toISOString().split("T")[0]);
  }

  if (end) {
    params.set("end_date", end.toISOString().split("T")[0]);
  }

  return params.toString();
}

export function getComparisonLabel(
  dateFilter: DateFilter,
  startDate: string,
  endDate: string,
) {
  if (dateFilter === "this_month") return "vs last month";
  if (dateFilter === "this_week") return "vs last week";

  if (dateFilter === "custom") {
    if (!startDate || !endDate) return "";

    const daysDiff =
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24) +
      1;

    return `vs previous ${daysDiff} days`;
  }

  return "";
}
