"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiUploadDocument } from "@/lib/api";

const documentTypes = [
  { value: "insurance_policy", label: "Insurance Policy" },
  { value: "loan_agreement", label: "Loan Agreement" },
  { value: "credit_card_terms", label: "Credit Card Terms" },
  { value: "mortgage_document", label: "Mortgage Document" },
  { value: "other", label: "Other" },
];

interface UploadedFile {
  file: File;
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
  documentId?: string;
  error?: string;
}

export function FileUploader() {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [documentType, setDocumentType] = useState<string>("");

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const uploadFile = async (file: File) => {
    const newFile: UploadedFile = { file, progress: 0, status: "uploading" };
    setUploadedFiles((prev) => [...prev, newFile]);

    // Simulate progress while uploading
    const progressInterval = setInterval(() => {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.file === file && f.status === "uploading"
            ? { ...f, progress: Math.min(f.progress + 15, 90) }
            : f
        )
      );
    }, 300);

    try {
      const res = await apiUploadDocument(file, documentType || "other");
      clearInterval(progressInterval);

      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.file === file
            ? { ...f, progress: 100, status: "complete", documentId: res.data.documentId }
            : f
        )
      );
    } catch (err: any) {
      clearInterval(progressInterval);
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.file === file
            ? { ...f, status: "error", error: err.message || "Upload failed" }
            : f
        )
      );
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        Array.from(e.dataTransfer.files).forEach(uploadFile);
      }
    },
    [documentType]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(uploadFile);
    }
  };

  const removeFile = (file: File) => {
    setUploadedFiles((prev) => prev.filter((f) => f.file !== file));
  };

  const viewAnalysis = (documentId: string) => {
    router.push(`/dashboard/analysis?documentId=${documentId}`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Document Type
        </label>
        <Select value={documentType} onValueChange={setDocumentType}>
          <SelectTrigger className="w-full md:w-72">
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            {documentTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <p className="mt-4 text-lg font-medium text-foreground">
          Drag and drop your documents here
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          or click to browse files
        </p>
        <input
          type="file"
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={handleFileInput}
          accept=".pdf"
          multiple
        />
        <Button className="mt-4" variant="outline">
          Browse Files
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Supported format: PDF (Max 10MB)
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Uploaded Files</h3>
          {uploadedFiles.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <File className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {item.file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(item.file.size)}
                </p>
                {item.status === "uploading" && (
                  <Progress value={item.progress} className="mt-2 h-1" />
                )}
                {item.status === "processing" && (
                  <p className="mt-1 text-xs text-primary">
                    Processing document...
                  </p>
                )}
                {item.status === "complete" && (
                  <div className="mt-1 flex items-center gap-2">
                    <p className="flex items-center gap-1 text-xs text-accent">
                      <CheckCircle className="h-3 w-3" />
                      Upload complete
                    </p>
                    {item.documentId && (
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs"
                        onClick={() => viewAnalysis(item.documentId!)}
                      >
                        View Analysis →
                      </Button>
                    )}
                  </div>
                )}
                {item.status === "error" && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {item.error || "Upload failed"}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(item.file)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
