"use client";

import type { ReactNode } from "react";

interface PageHeaderProps {
  action?: ReactNode;
  description: string;
  title: string;
}

export default function PageHeader({
  action,
  description,
  title,
}: PageHeaderProps) {
  return (
    <div className="flex w-full flex-col gap-3 pt-4">
      <div>
        <h1 className="mb-1 font-['Plus_Jakarta_Sans'] text-2xl font-bold tracking-tight text-[#0F172A] md:text-4xl">
          {title}
        </h1>
        <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#64748B]">
          {description}
        </p>
      </div>
      {action && <div className="w-full sm:w-auto">{action}</div>}
    </div>
  );
}
