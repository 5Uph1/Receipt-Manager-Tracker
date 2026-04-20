export interface InsightCategorySummary {
  color: string;
  count: number;
  name: string;
  total: number;
}

export interface InsightMerchantSummary {
  count: number;
  name: string;
  total: number;
}

export interface InsightReceipt {
  merchant_name?: string;
  total_amount?: number;
}
