"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { History, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentTable } from "@/components/document-table";
import { apiGetDocuments } from "@/lib/api";

export default function DocumentHistoryPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const res = await apiGetDocuments();
      setDocuments(res.data);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Document History</h1>
          <p className="text-muted-foreground">View and manage all your analyzed documents</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/upload">
            <Plus className="mr-2 h-4 w-4" />
            Upload New
          </Link>
        </Button>
      </div>

      {/* Documents Table */}
      {documents.length > 0 ? (
        <DocumentTable documents={documents} onDelete={handleDelete} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-border bg-card">
          <History className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="mt-4 text-xl font-semibold text-foreground">No Documents Yet</h2>
          <p className="mt-2 text-muted-foreground text-center max-w-md">
            Upload your first document to start analyzing.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/dashboard/upload">
              <Plus className="mr-2 h-4 w-4" />
              Upload Document
            </Link>
          </Button>
        </div>
      )}

      {/* Document Stats */}
      {documents.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Documents</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{documents.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Analyzed</p>
            <p className="mt-1 text-2xl font-bold text-accent">
              {documents.filter((d) => d.status === "analyzed").length}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Processing</p>
            <p className="mt-1 text-2xl font-bold text-primary">
              {documents.filter((d) => d.status === "processing").length}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Insurance Policies</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {documents.filter((d) => d.type === "insurance_policy").length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
