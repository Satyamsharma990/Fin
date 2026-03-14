"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Landmark, DollarSign, Calendar, Percent, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { AnalysisSummaryCard } from "@/components/analysis-summary-card";
import { RiskAlertCard } from "@/components/risk-alert-card";
import { apiGetLoanInsights } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";

export default function LoanAnalysisPage() {
  const searchParams = useSearchParams();
  const documentId = searchParams.get("documentId");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!documentId) return;
    async function fetchLoan() {
      setLoading(true);
      setError("");
      try {
        const res = await apiGetLoanInsights(documentId!);
        setData(res.data);
      } catch (err: any) {
        setError(err.message || "Failed to load loan insights");
      } finally {
        setLoading(false);
      }
    }
    fetchLoan();
  }, [documentId]);

  if (!documentId) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Landmark className="h-16 w-16 text-muted-foreground/50" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">No Loan Document Selected</h2>
        <p className="mt-2 text-muted-foreground text-center max-w-md">
          Upload a loan agreement and select it to view analysis.
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
        <h2 className="mt-4 text-xl font-semibold text-foreground">Loading Loan Analysis...</h2>
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
        <h1 className="text-2xl font-bold text-foreground">Loan Analysis</h1>
        <p className="text-muted-foreground">Comprehensive breakdown of your loan agreement</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Interest Rate" value={`${data.interestRate || 0}%`} icon={Percent} />
        <StatsCard title="EMI Amount" value={`$${(data.emiAmount || 0).toLocaleString()}`} icon={DollarSign} />
        <StatsCard title="Total Repayment" value={`$${(data.totalRepayment || 0).toLocaleString()}`} icon={TrendingUp} />
        <StatsCard title="Loan Duration" value={`${data.loanDuration || 0} months`} icon={Calendar} />
      </div>

      {/* Loan Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Principal Amount</p>
          <p className="mt-2 text-3xl font-bold text-foreground">${(data.principalAmount || 0).toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total Interest</p>
          <p className="mt-2 text-3xl font-bold text-destructive">${(data.totalInterest || 0).toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Monthly EMI</p>
          <p className="mt-2 text-3xl font-bold text-primary">${(data.emiAmount || 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {data.principalVsInterest && data.principalVsInterest.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Principal vs Interest (Yearly)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.principalVsInterest}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="year" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={{ stroke: "var(--border)" }} />
                  <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={{ stroke: "var(--border)" }} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="principal" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Principal" />
                  <Bar dataKey="interest" fill="var(--chart-3)" radius={[4, 4, 0, 0]} name="Interest" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {data.emiSchedule && data.emiSchedule.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Outstanding Balance Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.emiSchedule}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={{ stroke: "var(--border)" }} />
                  <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={{ stroke: "var(--border)" }} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Area type="monotone" dataKey="balance" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.3} name="Outstanding Balance" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* EMI Schedule Table */}
      {data.emiSchedule && data.emiSchedule.length > 0 && (
        <AnalysisSummaryCard title="EMI Schedule" icon={Calendar}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Month</th>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">EMI</th>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">Principal</th>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">Interest</th>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">Balance</th>
                </tr>
              </thead>
              <tbody>
                {data.emiSchedule.map((row: any, index: number) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-3 px-4 text-foreground">{row.month}</td>
                    <td className="py-3 px-4 text-right text-foreground">${(row.emi || 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-accent">${(row.principal || 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-destructive">${(row.interest || 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-foreground font-medium">${(row.balance || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnalysisSummaryCard>
      )}

      {/* Risk Alerts */}
      {data.riskAlerts && data.riskAlerts.length > 0 && (
        <AnalysisSummaryCard title="Loan Risk Alerts" icon={Landmark}>
          <div className="space-y-3">
            {data.riskAlerts.map((alert: any, index: number) => (
              <RiskAlertCard key={index} alert={alert} />
            ))}
          </div>
        </AnalysisSummaryCard>
      )}
    </div>
  );
}
