"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "../../_components/DashboardShell";
import PageHeader from "../../_components/PageHeader";
import ReceiptFormPanel from "./_components/ReceiptFormPanel";
import ReceiptUploadPanel from "./_components/ReceiptUploadPanel";
import { logout } from "@/services/authService";
import { supabaseClient } from "@/lib/client/supabaseClient";
import type { NewReceiptItem, OCRSteps } from "./_lib/newReceiptTypes";
import {
  createEmptyOCRSteps,
  createNewReceiptItem,
  normalizeParsedItems,
} from "./_lib/newReceiptUtils";
import { receiptCategoryOptions } from "./_lib/newReceiptTypes";

export default function NewReceiptPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [items, setItems] = useState<NewReceiptItem[]>([createNewReceiptItem()]);
  const [category, setCategory] = useState<string | null>(null);
  const [ocrSteps, setOcrSteps] = useState<OCRSteps>(createEmptyOCRSteps());
  const [amount, setAmount] = useState("0.00");
  const [date, setDate] = useState("");
  const [merchant, setMerchant] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabaseClient.auth.getUser();

      if (!data.user) {
        router.replace("/auth");
        return;
      }

      setUser({ id: data.user.id });
    };

    checkUser();
  }, [router]);

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    setAmount(String(total));
  }, [items]);

  const resetOcr = () => setOcrSteps(createEmptyOCRSteps());

  const handleLogout = async () => {
    await logout();
    router.replace("/auth");
  };

  const handleFileSelection = (selectedFile: File | null) => {
    setFile(selectedFile);
    setErrorMsg("");
    resetOcr();
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] || null;
    handleFileSelection(selected);

    if (selected) {
      void handleUpload(selected);
    }
  };

  const handleAddItem = () => {
    setItems((previous) => [...previous, createNewReceiptItem()]);
  };

  const handleDeleteItem = (id: string) => {
    setItems((previous) => previous.filter((item) => item.id !== id));
  };

  const handleItemChange = (
    id: string,
    field: keyof NewReceiptItem,
    value: number | string,
  ) => {
    setItems((previous) =>
      previous.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleUpload = async (selectedFile?: File) => {
    const target = selectedFile ?? file;

    if (!target) {
      setErrorMsg("Pilih file dulu");
      return;
    }

    if (!target.type.startsWith("image/")) {
      setErrorMsg("File harus berupa gambar");
      return;
    }

    if (!user) {
      setErrorMsg("User belum siap");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    resetOcr();

    try {
      setOcrSteps({ analyzing: 40, extracting: 0, categorizing: 0 });

      const fileName = `${Date.now()}-${target.name.replace(/\s/g, "-")}`;

      const { error: uploadError } = await supabaseClient.storage
        .from("receipts")
        .upload(`${user.id}/${fileName}`, target);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: publicData } = supabaseClient.storage
        .from("receipts")
        .getPublicUrl(`${user.id}/${fileName}`);

      setImageUrl(publicData.publicUrl);
      setOcrSteps({ analyzing: 100, extracting: 40, categorizing: 0 });

      const ocrResponse = await fetch("/api/ocr", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: publicData.publicUrl }),
      });

      if (!ocrResponse.ok) {
        throw new Error("OCR gagal");
      }

      const ocrData = await ocrResponse.json();

      if (!ocrData.text) {
        throw new Error("Teks tidak terbaca");
      }

      setOcrSteps({ analyzing: 100, extracting: 100, categorizing: 60 });

      const parseResponse = await fetch("/api/parse", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ocrData.text }),
      });

      if (!parseResponse.ok) {
        throw new Error("Parsing gagal");
      }

      const data = await parseResponse.json();
      const result = data.result;

      if (result.category) {
        setCategory(result.category);
      }

      setItems(
        result.items?.length
          ? normalizeParsedItems(result.items)
          : [createNewReceiptItem()],
      );

      setOcrSteps({ analyzing: 100, extracting: 100, categorizing: 100 });

      if (result.total) setAmount(String(result.total));
      if (result.date) setDate(result.date);
      if (result.merchant) setMerchant(result.merchant);

      if (result.items?.length > 0) {
        setNotes(`Items: ${result.items.length}`);
      }
    } catch (error: unknown) {
      setErrorMsg(
        error instanceof Error ? error.message : "Terjadi kesalahan",
      );
      resetOcr();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    const cleanItems = items.filter((item) => item.item_name && item.price > 0);

    try {
      const response = await fetch("/api/receipt/save", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          merchant,
          date,
          total: Number(amount),
          notes,
          category,
          items: cleanItems,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal simpan");
      }

      alert("Berhasil disimpan!");
      router.push("/dashboard/receipt");
    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : "Gagal simpan");
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const dropped = event.dataTransfer.files?.[0];

    if (dropped) {
      handleFileSelection(dropped);
      void handleUpload(dropped);
    }
  };

  const isOcrActive =
    ocrSteps.analyzing > 0 ||
    ocrSteps.extracting > 0 ||
    ocrSteps.categorizing > 0;

  return (
    <DashboardShell activeItem="receipt" onLogout={handleLogout}>
      <PageHeader
        title="New Entry"
        description="Upload a receipt or enter details manually."
      />

      {errorMsg && (
        <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 font-['Plus_Jakarta_Sans'] text-sm font-medium text-[#DC2626]">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 pb-8 lg:grid-cols-12">
        <ReceiptUploadPanel
          file={file}
          inputId="receipt-file-input"
          isOcrActive={isOcrActive}
          loading={loading}
          ocrSteps={ocrSteps}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          onFileInputChange={handleFileInputChange}
          onOpenPicker={() =>
            document.getElementById("receipt-file-input")?.click()
          }
        />

        <ReceiptFormPanel
          amount={amount}
          category={category}
          categoryOptions={receiptCategoryOptions}
          date={date}
          items={items}
          loading={loading}
          merchant={merchant}
          notes={notes}
          onAddItem={handleAddItem}
          onAmountChange={setAmount}
          onCancel={() => router.back()}
          onCategoryChange={setCategory}
          onDateChange={setDate}
          onDeleteItem={handleDeleteItem}
          onItemChange={handleItemChange}
          onMerchantChange={setMerchant}
          onNotesChange={setNotes}
          onSubmit={handleSave}
        />
      </div>
    </DashboardShell>
  );
}
