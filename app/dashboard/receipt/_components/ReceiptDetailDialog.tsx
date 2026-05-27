"use client";

import {
  Check,
  ChevronDown,
  Pencil,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import type {
  ReceiptCategory,
  ReceiptData,
  ReceiptItem,
} from "../_lib/receiptTypes";
import {
  createEmptyReceiptItem,
  formatReceiptCurrency,
  formatReceiptLongDate,
  safeReceiptFetch,
} from "../_lib/receiptUtils";

interface ReceiptDetailDialogProps {
  categories: ReceiptCategory[];
  onClose: () => void;
  onDeleted: (id: string) => void;
  onUpdated: (updated: ReceiptData) => void;
  receipt: ReceiptData;
}

export default function ReceiptDetailDialog({
  categories,
  onClose,
  onDeleted,
  onUpdated,
  receipt,
}: ReceiptDetailDialogProps) {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [merchantName, setMerchantName] = useState(receipt.merchant_name);
  const [receiptDate, setReceiptDate] = useState(receipt.receipt_date);
  const [totalAmount, setTotalAmount] = useState(String(receipt.total_amount));
  const [notes, setNotes] = useState(receipt.notes ?? "");
  const [categoryId, setCategoryId] = useState(receipt.category_id ?? "");
  const [items, setItems] = useState<ReceiptItem[]>(
    receipt.receipt_items?.length
      ? receipt.receipt_items
      : [createEmptyReceiptItem()],
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [categorizing, setCategorizing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    setTotalAmount(String(total));
  }, [items]);

  const selectedCategory =
    categories.find((category) => category.id === categoryId) ??
    receipt.categories;

  const handleAddItem = () => {
    setItems((previous) => [...previous, createEmptyReceiptItem()]);
  };

  const handleDeleteItem = (id: string) => {
    setItems((previous) => previous.filter((item) => item.id !== id));
  };

  const handleItemChange = (
    id: string,
    field: keyof ReceiptItem,
    value: number | string,
  ) => {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg("");

    try {
      const data = await safeReceiptFetch(`/api/receipt/${receipt.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant_name: merchantName,
          receipt_date: receiptDate,
          total_amount: parseFloat(totalAmount),
          notes,
          category_id: categoryId || null,
          items,
        }),
      });

      onUpdated(data.receipt);
      setMode("view");
    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await safeReceiptFetch(`/api/receipt/${receipt.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      onDeleted(receipt.id);
      onClose();
    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : "Gagal menghapus");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleAICategorize = async () => {
    setCategorizing(true);
    setErrorMsg("");

    try {
      const data = await safeReceiptFetch(
        `/api/receipt/${receipt.id}/categorize`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      onUpdated(data.receipt);
      setCategoryId(data.receipt.category_id ?? "");
    } catch (error: unknown) {
      setErrorMsg(
        error instanceof Error ? error.message : "Gagal kategorisasi AI",
      );
    } finally {
      setCategorizing(false);
    }
  };

  return (
    <>
      {showDeleteConfirm && (
        <ConfirmDeleteDialog
          merchantName={receipt.merchant_name}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          loading={deleting}
        />
      )}

      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/25 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="relative flex w-full flex-col overflow-hidden border border-[#E2E8F0] bg-white shadow-2xl max-h-screen rounded-none sm:max-h-[90vh] sm:max-w-md sm:rounded-3xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div
            className="absolute left-0 right-0 top-0 h-[3px]"
            style={{ backgroundColor: selectedCategory?.color ?? "#2563EB" }}
          />

          <div className="flex shrink-0 items-center justify-between border-b border-[#F1F5F9] px-6 pb-4 pt-6">
            <div className="flex gap-1 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-1">
              <button
                onClick={() => setMode("view")}
                className={`rounded-lg px-3 py-1.5 font-['Plus_Jakarta_Sans'] text-xs font-semibold transition-all ${
                  mode === "view"
                    ? "border border-[#E2E8F0] bg-white text-[#0F172A] shadow-sm"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                Detail
              </button>
              <button
                onClick={() => setMode("edit")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-['Plus_Jakarta_Sans'] text-xs font-semibold transition-all ${
                  mode === "edit"
                    ? "border border-[#E2E8F0] bg-white text-[#0F172A] shadow-sm"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <Pencil size={11} />
                Edit
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAICategorize}
                disabled={categorizing}
                title="Re-kategorisasi dengan AI"
                className="flex items-center gap-1.5 rounded-xl border border-blue-100 bg-[#EFF6FF] px-3 py-1.5 font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#2563EB] transition-colors hover:bg-blue-100 disabled:opacity-50"
              >
                {categorizing ? (
                  <RefreshCw size={12} className="animate-spin" />
                ) : (
                  <Sparkles size={12} />
                )}
                {categorizing ? "AI..." : "AI"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-red-50 hover:text-[#DC2626]"
              >
                <Trash2 size={15} />
              </button>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-[#F1F5F9] hover:text-[#0F172A]"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mx-6 mt-3 shrink-0 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 font-['Plus_Jakarta_Sans'] text-xs text-[#DC2626]">
              {errorMsg}
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {mode === "view" ? (
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl"
                    style={{
                      backgroundColor: `${selectedCategory?.color ?? "#2563EB"}18`,
                    }}
                  >
                    {selectedCategory?.icon ?? "🧾"}
                  </div>
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans'] text-lg font-bold leading-tight text-[#0F172A]">
                      {receipt.merchant_name}
                    </h2>
                    <p className="mt-0.5 font-['Plus_Jakarta_Sans'] text-xs text-[#64748B]">
                      {formatReceiptLongDate(receipt.receipt_date)}
                    </p>
                  </div>
                </div>

                {selectedCategory && (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      color: selectedCategory.color,
                      backgroundColor: `${selectedCategory.color}18`,
                    }}
                  >
                    {selectedCategory.icon} {selectedCategory.name}
                  </span>
                )}

                <div className="border-t border-[#F1F5F9]" />

                <div>
                  <p className="mb-3 font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Items
                  </p>
                  <div className="space-y-2">
                    {receipt.receipt_items?.length > 0 ? (
                      receipt.receipt_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EFF6FF]">
                              <ShoppingBag
                                size={12}
                                className="text-[#2563EB]"
                              />
                            </div>
                            <div>
                              <span className="font-['Plus_Jakarta_Sans'] text-sm font-medium text-[#0F172A]">
                                {item.item_name}
                              </span>
                              <div className="font-['Plus_Jakarta_Sans'] text-xs text-[#64748B]">
                                {item.qty} × {formatReceiptCurrency(item.price)}
                              </div>
                            </div>
                          </div>
                          <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0F172A]">
                            {formatReceiptCurrency(item.qty * item.price)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="py-4 text-center font-['Plus_Jakarta_Sans'] text-sm text-[#94A3B8]">
                        Tidak ada item
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t border-[#F1F5F9]" />

                {receipt.notes && (
                  <div>
                    <p className="mb-1.5 font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                      Notes
                    </p>
                    <p className="font-['Plus_Jakarta_Sans'] text-sm leading-relaxed text-[#64748B]">
                      {receipt.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                  <span className="font-['Plus_Jakarta_Sans'] text-sm font-semibold text-[#64748B]">
                    Total
                  </span>
                  <span
                    className="font-['Plus_Jakarta_Sans'] text-2xl font-bold"
                    style={{ color: selectedCategory?.color ?? "#2563EB" }}
                  >
                    {formatReceiptCurrency(receipt.total_amount)}
                  </span>
                </div>

                {receipt.image_url && (
                  <a
                    href={receipt.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={receipt.image_url}
                      alt="Receipt"
                      className="h-32 w-full cursor-zoom-in rounded-xl border border-[#E2E8F0] object-cover opacity-75 transition-opacity hover:opacity-100"
                    />
                    <p className="mt-2 text-center font-['Plus_Jakarta_Sans'] text-xs text-[#94A3B8]">
                      Tap untuk lihat full
                    </p>
                  </a>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Merchant
                  </label>
                  <input
                    value={merchantName}
                    onChange={(event) => setMerchantName(event.target.value)}
                    className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 font-['Plus_Jakarta_Sans'] text-sm font-medium text-[#0F172A] outline-none transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={receiptDate}
                    onChange={(event) => setReceiptDate(event.target.value)}
                    className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 font-['Plus_Jakarta_Sans'] text-sm font-medium text-[#0F172A] outline-none transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 [color-scheme:light]"
                  />
                </div>

                <div>
                  <div className="mb-2.5 flex items-center justify-between">
                    <p className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                      Items
                    </p>
                    <button
                      onClick={handleAddItem}
                      className="font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
                    >
                      + Add Item
                    </button>
                  </div>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-2"
                      >
                        <input
                          value={item.item_name}
                          onChange={(event) =>
                            handleItemChange(
                              item.id,
                              "item_name",
                              event.target.value,
                            )
                          }
                          placeholder="Item name"
                          className="flex-1 bg-transparent px-2 py-1 font-['Plus_Jakarta_Sans'] text-sm text-[#0F172A] outline-none placeholder:text-[#CBD5E1]"
                        />
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(event) =>
                            handleItemChange(
                              item.id,
                              "qty",
                              Number(event.target.value),
                            )
                          }
                          className="w-14 rounded-lg border border-[#E2E8F0] bg-white px-2 py-1.5 text-center text-sm text-[#0F172A] outline-none transition-colors focus:border-[#2563EB]"
                        />
                        <input
                          type="number"
                          value={item.price}
                          onChange={(event) =>
                            handleItemChange(
                              item.id,
                              "price",
                              Number(event.target.value),
                            )
                          }
                          className="w-24 rounded-lg border border-[#E2E8F0] bg-white px-2 py-1.5 text-sm text-[#0F172A] outline-none transition-colors focus:border-[#2563EB]"
                        />
                        <button
                          disabled={items.length === 1}
                          onClick={() => handleDeleteItem(item.id)}
                          className="px-1.5 text-sm text-[#94A3B8] transition-colors hover:text-[#DC2626] disabled:opacity-30"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {items.length === 0 && (
                      <p className="py-2 text-center font-['Plus_Jakarta_Sans'] text-xs text-[#94A3B8]">
                        Belum ada item
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Total Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#64748B]">
                      Rp
                    </span>
                    <input
                      type="number"
                      value={totalAmount}
                      onChange={(event) => setTotalAmount(event.target.value)}
                      className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-10 pr-4 font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0F172A] outline-none transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                      Kategori
                    </label>
                    <button
                      onClick={handleAICategorize}
                      disabled={categorizing}
                      className="flex items-center gap-1 font-['Plus_Jakarta_Sans'] text-[10px] font-semibold text-[#2563EB] transition-colors hover:text-[#1D4ED8] disabled:opacity-50"
                    >
                      {categorizing ? (
                        <RefreshCw size={11} className="animate-spin" />
                      ) : (
                        <Sparkles size={11} />
                      )}
                      {categorizing ? "AI..." : "Auto AI"}
                    </button>
                  </div>
                  <div className="relative">
                    <select
                      value={categoryId}
                      onChange={(event) => setCategoryId(event.target.value)}
                      className="w-full cursor-pointer appearance-none rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 font-['Plus_Jakarta_Sans'] text-sm font-medium text-[#0F172A] outline-none transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                    >
                      <option value="">- Tanpa Kategori -</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B]">
                      <ChevronDown size={15} />
                    </div>
                  </div>
                  {selectedCategory && (
                    <span
                      className="inline-flex w-fit items-center gap-1.5 rounded-lg px-2.5 py-1 font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        color: selectedCategory.color,
                        backgroundColor: `${selectedCategory.color}18`,
                      }}
                    >
                      {selectedCategory.icon} {selectedCategory.name}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={3}
                    placeholder="Tambah catatan..."
                    className="resize-none rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 font-['Plus_Jakarta_Sans'] text-sm font-medium text-[#0F172A] outline-none transition-all placeholder:text-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => {
                      setMode("view");
                      setErrorMsg("");
                    }}
                    className="flex-1 rounded-xl bg-[#F1F5F9] py-2.5 font-['Plus_Jakarta_Sans'] text-sm font-semibold text-[#64748B] transition-colors hover:bg-[#E2E8F0]"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-2.5 font-['Plus_Jakarta_Sans'] text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-50"
                  >
                    {saving ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <Check size={14} />
                    )}
                    {saving ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
