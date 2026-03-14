"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Shield,
  DollarSign,
  Clock,
  Percent,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { AnalysisSummaryCard } from "@/components/analysis-summary-card";
import { ClarityScoreMeter } from "@/components/clarity-score-meter";
import { apiGetInsuranceInsights } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function InsuranceInsightsContent() {
  const searchParams = useSearchParams();
  const documentId = searchParams.get("documentId");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!documentId) return;
    async function fetchInsurance() {
      setLoading(true);
      setError("");
      try {
        const res = await apiGetInsuranceInsights(documentId!);
        setData(res.data);
      } catch (err: any) {
        setError(err.message || "Failed to load insurance insights");
      } finally {
        setLoading(false);
      }
    }
    fetchInsurance();
  }, [documentId]);

  if (!documentId) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Shield className="h-16 w-16 text-muted-foreground/50" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          No Insurance Document Selected
        </h2>
        <p className="mt-2 text-muted-foreground text-center max-w-md">
          Upload an insurance policy and select it to view insights.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/dashboard/upload">Upload Document</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">Loading Insurance Insights...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-16 w-16 text-destructive/50" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">Error</h2>
        <p className="mt-2 text-destructive text-center max-w-md">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Insurance Insights</h1>
        <p className="text-muted-foreground">Detailed analysis of your insurance policy</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Annual Premium" value={`$${(data.premium || 0).toLocaleString()}`} icon={DollarSign} />
        <StatsCard title="Coverage Amount" value={`$${(data.coverage || 0).toLocaleString()}`} icon={Shield} />
        <StatsCard title="Waiting Period" value={data.waitingPeriod || "N/A"} icon={Clock} />
        <StatsCard title="Co-pay Percentage" value={`${data.coPayPercentage || 0}%`} icon={Percent} />
      </div>

      {/* Clarity Score and Coverage Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        {data.clarityScore != null && (
          <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-foreground mb-4">Policy Clarity Score</h3>
            <ClarityScoreMeter score={data.clarityScore} size="lg" />
            <p className="mt-4 text-sm text-muted-foreground text-center max-w-xs">
              This score indicates how clearly the policy terms are written.
            </p>
          </div>
        )}

        {data.coverageDetails && data.coverageDetails.length > 0 && (
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Coverage Details</h3>
            <div className="space-y-3">
              {data.coverageDetails.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                  <div>
                    <p className="font-medium text-foreground">{item.category}</p>
                    <p className="text-sm text-muted-foreground">Deductible: ${(item.deductible || 0).toLocaleString()}</p>
                  </div>
                  <p className="text-lg font-bold text-foreground">${(item.limit || 0).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Exclusions and Claim Conditions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {data.exclusions && data.exclusions.length > 0 && (
          <AnalysisSummaryCard title="Policy Exclusions" icon={XCircle}>
            <div className="space-y-2">
              {data.exclusions.map((exclusion: string, index: number) => (
                <div key={index} className="flex items-start gap-3 rounded-lg bg-destructive/5 border border-destructive/20 p-3">
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{exclusion}</p>
                </div>
              ))}
            </div>
          </AnalysisSummaryCard>
        )}

        {data.claimConditions && data.claimConditions.length > 0 && (
          <AnalysisSummaryCard title="Claim Conditions" icon={CheckCircle}>
            <div className="space-y-2">
              {data.claimConditions.map((condition: string, index: number) => (
                <div key={index} className="flex items-start gap-3 rounded-lg bg-accent/10 border border-accent/20 p-3">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{condition}</p>
                </div>
              ))}
            </div>
          </AnalysisSummaryCard>
        )}
      </div>

      {/* Policy Duration */}
      {data.policyDuration && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Policy Duration</h3>
              <p className="text-muted-foreground">Your policy coverage period</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{data.policyDuration}</p>
              <p className="text-sm text-muted-foreground">Coverage Period</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InsuranceInsightsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    }>
      <InsuranceInsightsContent />
    </Suspense>
  );
}
