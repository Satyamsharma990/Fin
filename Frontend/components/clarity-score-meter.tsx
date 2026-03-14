"use client";

import { cn } from "@/lib/utils";

interface ClarityScoreMeterProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function ClarityScoreMeter({ score, size = "md" }: ClarityScoreMeterProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent";
    if (score >= 60) return "text-chart-5";
    if (score >= 40) return "text-warning";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  const sizeConfig = {
    sm: { container: "h-24 w-24", text: "text-2xl", label: "text-xs" },
    md: { container: "h-32 w-32", text: "text-3xl", label: "text-sm" },
    lg: { container: "h-40 w-40", text: "text-4xl", label: "text-base" },
  };

  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className={cn("relative", config.container)}>
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn("transition-all duration-1000", getScoreColor(score))}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold", config.text, getScoreColor(score))}>
            {score}
          </span>
          <span className={cn("text-muted-foreground", config.label)}>
            / 100
          </span>
        </div>
      </div>
      <p className={cn("mt-2 font-medium", getScoreColor(score))}>
        {getScoreLabel(score)}
      </p>
      <p className="text-xs text-muted-foreground">Policy Clarity Score</p>
    </div>
  );
}
