"use client";

import Link from "next/link";
import { Eye, Trash2, FileText, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { apiDeleteDocument } from "@/lib/api";

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: string;
  fileSize: string;
}

interface DocumentTableProps {
  documents: Document[];
  onDelete?: (id: string) => void;
}

const typeLabels: Record<string, string> = {
  insurance_policy: "Insurance",
  loan_agreement: "Loan",
  credit_card_terms: "Credit Card",
  mortgage_document: "Mortgage",
  other: "Other",
};

export function DocumentTable({ documents, onDelete }: DocumentTableProps) {
  const handleDelete = async (id: string) => {
    try {
      await apiDeleteDocument(id);
      onDelete?.(id);
    } catch (err: any) {
      alert(err.message || "Failed to delete document");
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document Name</TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
            <TableHead className="hidden sm:table-cell">Upload Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Size</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{doc.name}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="secondary">
                  {typeLabels[doc.type] || doc.type}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {new Date(doc.uploadDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge
                  variant={doc.status === "analyzed" ? "default" : "outline"}
                  className={
                    doc.status === "analyzed"
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }
                >
                  {doc.status === "analyzed"
                    ? "Analyzed"
                    : doc.status === "processing"
                      ? "Processing"
                      : doc.status === "error"
                        ? "Error"
                        : "Pending"}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                {doc.fileSize}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/analysis?documentId=${doc.id}`}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Analysis
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 text-destructive"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
