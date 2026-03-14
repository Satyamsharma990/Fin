"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FileText, DollarSign, AlertTriangle, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalysisSummaryCard } from "@/components/analysis-summary-card";
import { RiskAlertCard } from "@/components/risk-alert-card";
import { apiGetAnalysis } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function AnalysisResultsContent() {
  const searchParams = useSearchParams();
  const documentId = searchParams.get("documentId");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!documentId) return;

    async function fetchAnalysis() {
      setLoading(true);
      setError("");
      try {
        const res = await apiGetAnalysis(documentId!);
        setData(res.data);
      } catch (err: any) {
        setError(err.message || "Failed to load analysis");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalysis();
  }, [documentId]);

  if (!documentId) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <FileText className="h-16 w-16 text-muted-foreground/50" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          No Document Selected
        </h2>
        <p className="mt-2 text-muted-foreground text-center max-w-md">
          Upload a document and click &quot;View Analysis&quot; to see the AI-powered results.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Analyzing Document...
        </h2>
        <p className="mt-2 text-muted-foreground text-center max-w-md">
          Our AI is analyzing your document using Google Gemini. This may take a moment.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle className="h-16 w-16 text-destructive/50" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">Analysis Failed</h2>
        <p className="mt-2 text-destructive text-center max-w-md">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analysis Results</h1>
          <p className="text-muted-foreground">{data.documentName}</p>
        </div>
      </div>

      {/* Document Summary */}
      <AnalysisSummaryCard title="Document Summary" icon={FileText}>
        <p className="text-muted-foreground leading-relaxed">{data.summary}</p>
      </AnalysisSummaryCard>

      {/* Financial Breakdown */}
      {data.financialBreakdown && Object.keys(data.financialBreakdown).length > 0 && (
        <AnalysisSummaryCard title="Financial Overview" icon={DollarSign}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(data.financialBreakdown)
              .filter(([, v]) => v !== 0 && v !== null)
              .map(([key, value]) => (
                <div key={key} className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {typeof value === "number" ? `$${(value as number).toLocaleString()}` : String(value)}
                  </p>
                </div>
              ))}
          </div>
        </AnalysisSummaryCard>
      )}

      {/* Repayment Chart */}
      {data.repaymentData && data.repaymentData.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Principal vs Interest
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.repaymentData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="year" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={{ stroke: "var(--border)" }} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={{ stroke: "var(--border)" }} />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="principal" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Principal" />
                <Bar dataKey="interest" fill="var(--chart-2)" radius={[4, 4, 0, 0]} name="Interest" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Hidden Charges */}
      {data.hiddenCharges && data.hiddenCharges.length > 0 && (
        <AnalysisSummaryCard title="Hidden Charges Detected" icon={DollarSign}>
          <div className="space-y-3">
            {data.hiddenCharges.map((charge: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
              >
                <div>
                  <p className="font-medium text-foreground">{charge.name}</p>
                  <p className="text-sm text-muted-foreground">{charge.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-destructive">${charge.amount}</p>
                </div>
              </div>
            ))}
            <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/30 p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-destructive">Total Hidden Charges</p>
                <p className="text-xl font-bold text-destructive">
                  ${data.hiddenCharges.reduce((sum: number, c: any) => sum + (c.amount || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </AnalysisSummaryCard>
      )}

      {/* Risk Alerts */}
      {data.riskAlerts && data.riskAlerts.length > 0 && (
        <AnalysisSummaryCard title="Risk Alerts" icon={AlertTriangle}>
          <div className="space-y-3">
            {data.riskAlerts.map((alert: any, index: number) => (
              <RiskAlertCard key={index} alert={alert} />
            ))}
          </div>
        </AnalysisSummaryCard>
      )}

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recommendations</h3>
          <div className="space-y-2">
            {data.recommendations.map((rec: string, index: number) => (
              <div key={index} className="flex items-start gap-3 rounded-lg bg-primary/5 border border-primary/20 p-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                  {index + 1}
                </span>
                <p className="text-sm text-foreground">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnalysisResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    }>
      <AnalysisResultsContent />
    </Suspense>
  );
}
