export interface NewReceiptItem {
  id: string;
  item_name: string;
  price: number;
  qty: number;
}

export interface OCRSteps {
  analyzing: number;
  categorizing: number;
  extracting: number;
}

export const receiptCategoryOptions = [
  "Groceries",
  "Dining",
  "Transport",
  "Entertainment",
  "Utilities",
];
