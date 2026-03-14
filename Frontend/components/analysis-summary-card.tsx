"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AnalysisSummaryCardProps {
  title: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export function AnalysisSummaryCard({
  title,
  children,
  icon: Icon,
  className,
}: AnalysisSummaryCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}
