export type DateFilter = "this_week" | "this_month" | "custom" | "";

export interface CategorySummary {
  color: string;
  count: number;
  name: string;
  total: number;
}

export interface ReceiptCategory {
  color?: string;
  name?: string;
}

export interface ReceiptItem {
  categories?: ReceiptCategory | null;
  id: string;
  image_url?: string | null;
  merchant_name: string;
  receipt_date: string;
  total_amount: number;
}

export interface DateRangeResult {
  end: Date | null;
  label: string;
  prevEnd: Date | null;
  prevStart: Date | null;
  start: Date | null;
}
