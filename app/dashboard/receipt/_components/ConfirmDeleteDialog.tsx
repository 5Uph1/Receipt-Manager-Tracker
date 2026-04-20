"use client";

import { RefreshCw, Trash2 } from "lucide-react";

interface ConfirmDeleteDialogProps {
  loading: boolean;
  merchantName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteDialog({
  loading,
  merchantName,
  onCancel,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0F172A]/30 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-3xl border border-[#E2E8F0] bg-white p-7 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-100 bg-red-50">
          <Trash2 size={22} className="text-[#DC2626]" />
        </div>
        <h3 className="mb-1.5 text-center font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0F172A]">
          Hapus Receipt?
        </h3>
        <p className="mb-6 text-center font-['Plus_Jakarta_Sans'] text-sm leading-relaxed text-[#64748B]">
          <span className="font-semibold text-[#0F172A]">{merchantName}</span>{" "}
          akan dihapus permanen dan tidak bisa dikembalikan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl bg-[#F1F5F9] py-2.5 font-['Plus_Jakarta_Sans'] text-sm font-semibold text-[#64748B] transition-colors hover:bg-[#E2E8F0]"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#DC2626] py-2.5 font-['Plus_Jakarta_Sans'] text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            {loading ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
