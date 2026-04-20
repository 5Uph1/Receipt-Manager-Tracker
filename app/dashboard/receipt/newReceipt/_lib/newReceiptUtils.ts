import type { NewReceiptItem, OCRSteps } from "./newReceiptTypes";

export function createNewReceiptItem(): NewReceiptItem {
  return {
    id: crypto.randomUUID(),
    item_name: "",
    price: 0,
    qty: 1,
  };
}

export function createEmptyOCRSteps(): OCRSteps {
  return {
    analyzing: 0,
    extracting: 0,
    categorizing: 0,
  };
}

export function normalizeParsedItems(items: Record<string, unknown>[]) {
  return items.map((item) => ({
    id: crypto.randomUUID(),
    item_name: String(item.item_name || item.name || ""),
    price: Number(item.price) || 0,
    qty: Number(item.qty) || 1,
  }));
}
