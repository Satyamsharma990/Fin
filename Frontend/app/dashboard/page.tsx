"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { apiGetDashboardStats, apiGetDocuments } from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ documentsAnalyzed: 0, hiddenChargesDetected: 0, riskyClauses: 0, moneySaved: 0 });
  const [recentDocs, setRecentDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, docsRes] = await Promise.all([
          apiGetDashboardStats(),
          apiGetDocuments(),
        ]);
        setStats(statsRes.data);
        setRecentDocs(docsRes.data.slice(0, 3));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back{user ? `, ${user.name}` : ""}
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your documents
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/upload">
            Upload Document
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Documents Analyzed"
          value={stats.documentsAnalyzed}
          icon={FileText}
        />
        <StatsCard
          title="Hidden Charges Found"
          value={stats.hiddenChargesDetected}
          icon={AlertTriangle}
        />
        <StatsCard
          title="Risky Clauses"
          value={stats.riskyClauses}
          icon={TrendingUp}
          description="Identified across all documents"
        />
        <StatsCard
          title="Money Saved"
          value={`$${stats.moneySaved.toLocaleString()}`}
          icon={DollarSign}
        />
      </div>

      {/* Recent Documents */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Recent Documents
          </h3>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/history">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        {recentDocs.length > 0 ? (
          <div className="space-y-3">
            {recentDocs.map((doc: any) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(doc.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/analysis?documentId=${doc.id}`}>View</Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2">No documents yet</p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/upload">Upload your first document</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
