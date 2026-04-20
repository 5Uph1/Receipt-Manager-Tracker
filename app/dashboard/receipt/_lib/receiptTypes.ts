import type { DateFilter } from "../../_lib/dashboardTypes";

export type ReceiptDateFilter = DateFilter;
export type ReceiptSortBy = "newest" | "oldest" | "highest" | "lowest";

export interface ReceiptItem {
  id: string;
  item_name: string;
  price: number;
  qty: number;
}

export interface ReceiptCategory {
  color: string;
  icon: string;
  id: string;
  name: string;
}

export interface ReceiptData {
  categories?: ReceiptCategory;
  category_id?: string;
  id: string;
  image_url: string;
  merchant_name: string;
  notes: string;
  receipt_date: string;
  receipt_items: ReceiptItem[];
  total_amount: number;
}
