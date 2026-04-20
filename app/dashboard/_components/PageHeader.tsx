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
    <div className="flex flex-col gap-4 pt-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="mb-1 font-['Plus_Jakarta_Sans'] text-3xl font-bold tracking-tight text-[#0F172A] md:text-4xl">
          {title}
        </h1>
        <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#64748B]">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
