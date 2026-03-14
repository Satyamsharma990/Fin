"use client";

import { FileUploader } from "@/components/file-uploader";
import { Shield, Lock, Zap, FileCheck } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Processing",
    description: "Your documents are encrypted and processed securely.",
  },
  {
    icon: Zap,
    title: "Fast Analysis",
    description: "Get results in seconds with our AI-powered engine.",
  },
  {
    icon: FileCheck,
    title: "Accurate Results",
    description: "Industry-leading accuracy for contract analysis.",
  },
  {
    icon: Lock,
    title: "Private & Confidential",
    description: "Documents are deleted after processing.",
  },
];

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload Document</h1>
        <p className="mt-1 text-muted-foreground">
          Upload your financial contracts for AI-powered analysis
        </p>
      </div>

      {/* Upload Area */}
      <div className="rounded-xl border border-border bg-card p-6">
        <FileUploader />
      </div>

      {/* Features Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <feature.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mt-3 font-medium text-foreground">{feature.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Supported Documents */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Supported Document Types
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { type: "Insurance Policies", desc: "Health, life, auto, home" },
            { type: "Loan Agreements", desc: "Personal, auto, business" },
            { type: "Credit Card Terms", desc: "Terms and conditions" },
            { type: "Mortgage Documents", desc: "Home loan contracts" },
          ].map((item) => (
            <div key={item.type} className="rounded-lg bg-muted/50 p-4">
              <p className="font-medium text-foreground">{item.type}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
