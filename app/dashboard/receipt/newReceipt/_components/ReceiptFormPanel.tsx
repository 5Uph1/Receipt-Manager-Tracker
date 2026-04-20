"use client";

import { CalendarDays, Check, ChevronDown, ShoppingCart, StickyNote, Store } from "lucide-react";
import type { NewReceiptItem } from "../_lib/newReceiptTypes";

interface ReceiptFormPanelProps {
  amount: string;
  category: string | null;
  categoryOptions: string[];
  date: string;
  items: NewReceiptItem[];
  loading: boolean;
  merchant: string;
  notes: string;
  onAddItem: () => void;
  onAmountChange: (value: string) => void;
  onCancel: () => void;
  onCategoryChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onDeleteItem: (id: string) => void;
  onItemChange: (
    id: string,
    field: keyof NewReceiptItem,
    value: number | string,
  ) => void;
  onMerchantChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export default function ReceiptFormPanel({
  amount,
  category,
  categoryOptions,
  date,
  items,
  loading,
  merchant,
  notes,
  onAddItem,
  onAmountChange,
  onCancel,
  onCategoryChange,
  onDateChange,
  onDeleteItem,
  onItemChange,
  onMerchantChange,
  onNotesChange,
  onSubmit,
}: ReceiptFormPanelProps) {
  const isOcrActive = amount !== "0.00" || merchant || notes || items.length > 1;

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 lg:col-span-7">
      <div className="mb-5 flex items-center justify-between border-b border-[#E2E8F0] pb-4">
        <h3 className="font-['Plus_Jakarta_Sans'] text-base font-semibold text-[#0F172A]">
          Receipt Details
        </h3>
        <span className="rounded-full bg-[#EFF6FF] px-2.5 py-1 font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
          {isOcrActive ? "AI Filling..." : "AI Filled"}
        </span>
      </div>

      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Total Amount
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#64748B]">
                  Rp.
                </span>
                <input
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-12 pr-4 font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#0F172A] outline-none transition-all placeholder:text-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                  type="text"
                  value={amount}
                  onChange={(event) => onAmountChange(event.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Date
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]">
                  <CalendarDays size={15} />
                </div>
                <input
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-3.5 pl-10 pr-4 font-['Plus_Jakarta_Sans'] text-sm font-medium text-[#0F172A] outline-none transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 [color-scheme:light]"
                  type="date"
                  value={date}
                  onChange={(event) => onDateChange(event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Merchant
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]">
                <Store size={15} />
              </div>
              <input
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-10 pr-4 font-['Plus_Jakarta_Sans'] text-sm font-medium text-[#0F172A] outline-none transition-all placeholder:text-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                type="text"
                value={merchant}
                onChange={(event) => onMerchantChange(event.target.value)}
                placeholder="Nama toko/merchant"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Category
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2563EB]">
                <ShoppingCart size={15} />
              </div>
              <select
                className="w-full cursor-pointer appearance-none rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-10 pr-10 font-['Plus_Jakarta_Sans'] text-sm font-medium text-[#0F172A] outline-none transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                value={category || categoryOptions[0]}
                onChange={(event) => onCategoryChange(event.target.value)}
              >
                {categoryOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B]">
                <ChevronDown size={15} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Items
              </label>
              <button
                type="button"
                onClick={onAddItem}
                className="font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-2.5"
                >
                  <input
                    value={item.item_name}
                    onChange={(event) =>
                      onItemChange(item.id, "item_name", event.target.value)
                    }
                    placeholder="Item name"
                    className="flex-1 bg-transparent px-2 py-1 font-['Plus_Jakarta_Sans'] text-sm text-[#0F172A] outline-none placeholder:text-[#CBD5E1]"
                  />
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(event) =>
                      onItemChange(item.id, "qty", Number(event.target.value))
                    }
                    className="w-14 rounded-lg border border-[#E2E8F0] bg-white px-2 py-1.5 text-center text-sm text-[#0F172A] outline-none transition-colors focus:border-[#2563EB]"
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={(event) =>
                      onItemChange(item.id, "price", Number(event.target.value))
                    }
                    className="w-24 rounded-lg border border-[#E2E8F0] bg-white px-2 py-1.5 text-sm text-[#0F172A] outline-none transition-colors focus:border-[#2563EB]"
                  />
                  <button
                    type="button"
                    disabled={items.length === 1}
                    onClick={() => onDeleteItem(item.id)}
                    className="px-1.5 text-sm text-[#94A3B8] transition-colors hover:text-[#DC2626] disabled:opacity-30"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Notes (Optional)
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-3.5 text-[#64748B]">
                <StickyNote size={15} />
              </div>
              <textarea
                className="w-full resize-none rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-10 pr-4 font-['Plus_Jakarta_Sans'] text-sm font-medium text-[#0F172A] outline-none transition-all placeholder:text-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                placeholder="Add context to this expense..."
                rows={3}
                value={notes}
                onChange={(event) => onNotesChange(event.target.value)}
              />
            </div>
          </div>

          <div className="mt-1 flex items-center justify-end gap-3 border-t border-[#E2E8F0] pt-4">
            <button
              className="rounded-xl px-4 py-2.5 font-['Plus_Jakarta_Sans'] text-sm font-medium text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#0F172A]"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-2.5 font-['Plus_Jakarta_Sans'] text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "Processing..." : "Save Receipt"}
              <Check size={15} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
