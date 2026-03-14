"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  FileText,
  Loader2,
} from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { apiGetDashboardStats, apiGetDocuments } from "@/lib/api";

export default function FinancialInsightsPage() {
  const [stats, setStats] = useState<any>(null);
  const [docCount, setDocCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, docsRes] = await Promise.all([
          apiGetDashboardStats(),
          apiGetDocuments(),
        ]);
        setStats(statsRes.data);
        setDocCount(docsRes.count);
      } catch (err) {
        console.error("Insights fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">No Insights Available</h2>
        <p className="mt-2 text-muted-foreground text-center max-w-md">
          Upload and analyze documents to see financial insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Financial Insights</h1>
        <p className="text-muted-foreground">Analytics summary of your document analysis activity</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Documents Analyzed" value={stats.documentsAnalyzed} icon={FileText} />
        <StatsCard title="Hidden Charges Found" value={stats.hiddenChargesDetected} icon={DollarSign} />
        <StatsCard title="Risky Clauses" value={stats.riskyClauses} icon={AlertTriangle} />
        <StatsCard title="Potential Savings" value={`$${stats.moneySaved.toLocaleString()}`} icon={TrendingUp} />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Savings Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Identified Hidden Fees</span>
              <span className="font-medium text-foreground">${stats.moneySaved.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Risky Clauses Found</span>
              <span className="font-medium text-foreground">{stats.riskyClauses}</span>
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Total Documents</span>
                <span className="text-xl font-bold text-accent">{stats.documentsAnalyzed}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Document Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Documents</span>
              <span className="font-medium text-foreground">{docCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Analyzed</span>
              <span className="font-medium text-foreground">{stats.documentsAnalyzed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Hidden Charges Detected</span>
              <span className="font-medium text-foreground">{stats.hiddenChargesDetected}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Risk Analysis</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Risk Alerts</span>
              <span className="font-medium text-foreground">{stats.riskyClauses}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Avg per Document</span>
              <span className="font-medium text-foreground">
                {stats.documentsAnalyzed > 0
                  ? (stats.riskyClauses / stats.documentsAnalyzed).toFixed(1)
                  : "0"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Charges Found</span>
              <span className="font-medium text-foreground">{stats.hiddenChargesDetected}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
