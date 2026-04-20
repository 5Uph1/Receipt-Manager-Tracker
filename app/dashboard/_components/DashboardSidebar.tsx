"use client";

import Link from "next/link";

type DashboardNavItem = "dashboard" | "receipt" | "insight";

interface DashboardSidebarProps {
  activeItem: DashboardNavItem;
  onLogout: () => void;
}

export default function DashboardSidebar({
  activeItem,
  onLogout,
}: DashboardSidebarProps) {
  const navClassName = (item: DashboardNavItem) =>
    item === activeItem
      ? "flex items-center gap-3 rounded-xl bg-[#EFF6FF] px-4 py-3 font-sans text-[#2563EB] shadow-none transition-transform duration-200"
      : "flex items-center gap-3 rounded-xl px-4 py-3 font-sans text-[#64748B] transition-all duration-200 hover:translate-x-1 hover:bg-[#F1F5F9] hover:text-[#0F172A]";

  return (
    <nav className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col gap-2 border-r border-[#E2E8F0] bg-white p-6 font-['Plus_Jakarta_Sans'] text-sm font-medium text-[#2563EB] shadow-sm md:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <img
          alt="Organization Logo"
          className="h-10 w-10 rounded-xl object-cover shadow-sm"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpFdbNhBPx53_96RY_1kuq04tCyBHhvulrwsNfwNPjqVXa6C80G26SqDjwpmYZe7rlw6hoiZzZvttUG9Zuulhj16cmPrFclIdjztY5-jfbOj1xfcNYltdFarQbbSVSWFiAH16IaJUBkt0FgcP6D8QY8PU3cPxhNMa9VKmXB0jBIsAwj7Y5r_WwMHKbErJcN5uPe-DLm7X3qQbI1TAVqveYomo8HXVoRTrErhfbdiKSgw9BUz7nxUBPgmZPSQvBXGHGt-BYg_u61Hk"
        />
        <div>
          <div className="font-sans text-md font-extrabold tracking-tight text-[#2563EB]">
            Receipt Manager
          </div>
          <div className="font-sans text-xs text-[#64748B]">
            Premium Archive
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <Link className={navClassName("dashboard")} href="/dashboard">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5"
          >
            <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
            <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
          </svg>
          Dashboard
        </Link>

        <Link className={navClassName("receipt")} href="/dashboard/receipt">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5"
          >
            <path
              fillRule="evenodd"
              d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z"
              clipRule="evenodd"
            />
            <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
          </svg>
          All Receipts
        </Link>

        <Link className={navClassName("insight")} href="/dashboard/insight">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5"
          >
            <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
          </svg>
          Analytics
        </Link>
      </div>

      <div className="mt-auto">
        <button
          onClick={onLogout}
          className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] px-4 py-3 font-sans font-bold text-white shadow-sm transition-all hover:from-[#2563EB] hover:to-[#3B82F6] hover:shadow-md"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
