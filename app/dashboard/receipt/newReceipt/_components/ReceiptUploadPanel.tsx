"use client";

import { Camera, CloudUpload, FolderOpen, ScanLine } from "lucide-react";
import type { OCRSteps } from "../_lib/newReceiptTypes";

interface ReceiptUploadPanelProps {
  file: File | null;
  inputId: string;
  isOcrActive: boolean;
  loading: boolean;
  ocrSteps: OCRSteps;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenPicker: () => void;
}

export default function ReceiptUploadPanel({
  file,
  inputId,
  isOcrActive,
  loading,
  ocrSteps,
  onDragOver,
  onDrop,
  onFileInputChange,
  onOpenPicker,
}: ReceiptUploadPanelProps) {
  const ocrProgressSteps = [
    { label: "Analyzing document...", pct: ocrSteps.analyzing },
    { label: "Extracting text...", pct: ocrSteps.extracting },
    { label: "Categorizing data...", pct: ocrSteps.categorizing },
  ];

  return (
    <div className="flex flex-col gap-5 lg:col-span-5">
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileInputChange}
      />

      <div
        className="group flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E2E8F0] bg-white p-8 text-center transition-all hover:border-[#2563EB] hover:bg-[#EFF6FF]/30"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={onOpenPicker}
      >
        <div className="flex flex-col items-center">
          {file ? (
            <div className="mb-4 h-16 w-16 overflow-hidden rounded-xl ring-2 ring-[#2563EB] ring-offset-2">
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FF] transition-transform group-hover:scale-105">
              <CloudUpload size={24} className="text-[#2563EB]" />
            </div>
          )}
          <h3 className="mb-1 font-['Plus_Jakarta_Sans'] text-base font-semibold text-[#0F172A]">
            {file ? file.name : "Drag & Drop Receipt"}
          </h3>
          <p className="mb-5 font-['Plus_Jakarta_Sans'] text-sm text-[#64748B]">
            {file ? "Click to change file" : "or browse files (JPG, PNG, PDF)"}
          </p>
          <div
            className="flex w-full max-w-xs gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#F1F5F9] py-2.5 font-['Plus_Jakarta_Sans'] text-sm font-medium text-[#64748B] transition-colors hover:bg-[#E2E8F0]"
              onClick={onOpenPicker}
            >
              <Camera size={15} />
              Camera
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-2.5 font-['Plus_Jakarta_Sans'] text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
              onClick={onOpenPicker}
            >
              <FolderOpen size={15} />
              Browse
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF]">
            <ScanLine
              size={15}
              className={`text-[#2563EB] ${loading ? "animate-pulse" : ""}`}
            />
          </div>
          <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-semibold text-[#0F172A]">
            Auto-Extraction
          </h4>
          {!isOcrActive && !loading && (
            <span className="ml-auto font-['Plus_Jakarta_Sans'] text-xs text-[#94A3B8]">
              Awaiting upload
            </span>
          )}
        </div>
        <div className="space-y-4">
          {ocrProgressSteps.map((step) => (
            <div key={step.label}>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="font-['Plus_Jakarta_Sans'] text-[#64748B]">
                  {step.label}
                </span>
                <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[#2563EB]">
                  {step.pct}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#F1F5F9]">
                <div
                  className="h-1.5 rounded-full bg-[#2563EB] transition-all duration-500"
                  style={{ width: `${step.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
