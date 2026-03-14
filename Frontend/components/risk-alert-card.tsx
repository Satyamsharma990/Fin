"use client";

import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskAlert {
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
}

interface RiskAlertCardProps {
  alert: RiskAlert;
}

export function RiskAlertCard({ alert }: RiskAlertCardProps) {
  const severityConfig = {
    high: {
      icon: AlertTriangle,
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/30",
      textColor: "text-destructive",
      iconColor: "text-destructive",
      label: "High Risk",
    },
    medium: {
      icon: AlertCircle,
      bgColor: "bg-warning/10",
      borderColor: "border-warning/30",
      textColor: "text-warning-foreground",
      iconColor: "text-warning",
      label: "Medium Risk",
    },
    low: {
      icon: Info,
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
      textColor: "text-foreground",
      iconColor: "text-primary",
      label: "Low Risk",
    },
  };

  const config = severityConfig[alert.severity];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex gap-4 rounded-lg border p-4",
        config.bgColor,
        config.borderColor
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          config.bgColor
        )}
      >
        <Icon className={cn("h-5 w-5", config.iconColor)} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className={cn("font-medium", config.textColor)}>{alert.title}</h4>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              config.bgColor,
              config.textColor
            )}
          >
            {config.label}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
      </div>
    </div>
  );
}
