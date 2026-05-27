"use client";

import Link from "next/link";

interface DashboardActionsProps {
  isExporting: boolean;
  onExport: () => void;
}

export default function DashboardActions({
  isExporting,
  onExport,
}: DashboardActionsProps) {
  return (
    <div className="flex flex-col gap-3 pb-4 pt-2 sm:flex-row">
      <Link href="/dashboard/insight" className="flex-1">
        <span className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[1.5rem] border border-[#E2E8F0] bg-white py-3.5 font-semibold text-[#0F172A] shadow-sm transition-all hover:border-[#2563EB]/30 hover:bg-[#F8FAFC] hover:text-[#2563EB] hover:shadow-md md:py-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5"
          >
            <path d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.452 6.712 6.712 0 0 1-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z" />
            <path
              fillRule="evenodd"
              d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z"
              clipRule="evenodd"
            />
          </svg>
          View Insights
        </span>
      </Link>

      <button
        onClick={onExport}
        disabled={isExporting}
        className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[1.5rem] border border-[#E2E8F0] bg-white py-3.5 font-semibold text-[#0F172A] shadow-sm transition-all hover:border-[#2563EB]/30 hover:bg-[#F8FAFC] hover:text-[#2563EB] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 md:py-4"
      >
        {isExporting ? (
          <>
            <svg
              className="size-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Exporting...
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5"
            >
              <path d="M11.47 1.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 0 1-1.06-1.06l3-3ZM11.25 7.5V15a.75.75 0 0 0 1.5 0V7.5h3.75a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h3.75Z" />
            </svg>
            Export Data
          </>
        )}
      </button>
    </div>
  );
}
