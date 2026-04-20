import type {
  ReceiptDateFilter,
  ReceiptSortBy,
} from "./receiptTypes";

export const receiptDateLabelMap: Record<ReceiptDateFilter, string> = {
  this_week: "Minggu Ini",
  this_month: "Bulan Ini",
  custom: "Custom",
  "": "Date Range",
};

export const receiptSortLabelMap: Record<ReceiptSortBy, string> = {
  newest: "Newest",
  oldest: "Oldest",
  highest: "Highest Amount",
  lowest: "Lowest Amount",
};

export function createEmptyReceiptItem() {
  return {
    id: crypto.randomUUID(),
    item_name: "",
    price: 0,
    qty: 1,
  };
}

export function formatReceiptCurrency(num: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(num);
}

export function formatReceiptShortDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function formatReceiptLongDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
}

export function getReceiptDateRange(
  dateFilter: ReceiptDateFilter,
  startDate: string,
  endDate: string,
) {
  const today = new Date();

  if (dateFilter === "this_week") {
    const day = today.getDay();
    const diffToMon = day === 0 ? -6 : 1 - day;
    const start = new Date(today);
    start.setDate(today.getDate() + diffToMon);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    };
  }

  if (dateFilter === "this_month") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    };
  }

  if (dateFilter === "custom" && startDate && endDate) {
    return {
      start: startDate,
      end: endDate,
    };
  }

  return {
    start: "",
    end: "",
  };
}

export async function safeReceiptFetch(url: string, options: RequestInit) {
  const response = await fetch(url, options);
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error(`Server error (${response.status}): bukan JSON response`);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Request gagal");
  }

  return data;
}
