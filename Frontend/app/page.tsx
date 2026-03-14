import Link from "next/link";
import {
  Shield,
  FileSearch,
  AlertTriangle,
  DollarSign,
  ChevronRight,
  FileText,
  Sparkles,
  Lock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: FileSearch,
    title: "AI Document Simplification",
    description:
      "Transform complex financial contracts into clear, easy-to-understand summaries.",
  },
  {
    icon: AlertTriangle,
    title: "Hidden Charges Detection",
    description:
      "Automatically identify and highlight hidden fees that could cost you money.",
  },
  {
    icon: DollarSign,
    title: "Loan Repayment Breakdown",
    description:
      "Visualize your loan structure with detailed principal vs. interest analysis.",
  },
  {
    icon: Shield,
    title: "Insurance Clause Explanation",
    description:
      "Understand your coverage, exclusions, and claim conditions clearly.",
  },
  {
    icon: Sparkles,
    title: "Financial Risk Alerts",
    description:
      "Get instant warnings about potentially risky terms and conditions.",
  },
  {
    icon: Lock,
    title: "Secure Document Processing",
    description:
      "Your documents are encrypted and processed with enterprise-grade security.",
  },
];

const steps = [
  {
    number: "01",
    title: "Upload Financial Document",
    description:
      "Simply drag and drop your insurance policy, loan agreement, or any financial contract.",
  },
  {
    number: "02",
    title: "AI Analyzes the Contract",
    description:
      "Our advanced AI reads and processes every clause, fee, and condition in seconds.",
  },
  {
    number: "03",
    title: "View Simplified Insights",
    description:
      "Get a clear breakdown with risk alerts, hidden charges, and financial projections.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              FinGuardian
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
          <Button asChild className="md:hidden">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,var(--primary)_0%,transparent_100%)] opacity-10" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">
                AI-Powered Contract Analysis
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance">
              Understand Insurance and Loan Contracts in Seconds
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
              FinGuardian uses advanced AI to analyze your financial documents,
              detect hidden charges, and explain complex terms in simple
              language. Stop signing contracts you don't fully understand.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto"
              >
                <Link href="/dashboard">
                  View Demo
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 sm:mt-24">
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute -inset-4 rounded-2xl bg-primary/5 blur-2xl" />
              <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
                <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-destructive/50" />
                  <div className="h-3 w-3 rounded-full bg-warning/50" />
                  <div className="h-3 w-3 rounded-full bg-accent/50" />
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg bg-background border border-border p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Documents Analyzed
                          </p>
                          <p className="text-2xl font-bold text-foreground">
                            47
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-background border border-border p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Hidden Charges Found
                          </p>
                          <p className="text-2xl font-bold text-foreground">
                            23
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-background border border-border p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Money Saved
                          </p>
                          <p className="text-2xl font-bold text-foreground">
                            $12,450
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything You Need to Understand Your Contracts
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful AI-driven features that help you make informed financial
              decisions.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How FinGuardian Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Three simple steps to understand any financial contract.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="relative flex gap-6 md:gap-10"
                >
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      {step.number}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="mt-4 h-full w-px bg-border" />
                    )}
                  </div>
                  <div className="pb-12">
                    <h3 className="text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to Understand Your Contracts?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Start analyzing your financial documents today. No credit card
              required.
            </p>
            <div className="mt-10">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="bg-background text-foreground hover:bg-background/90"
              >
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">
                FinGuardian
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                Product
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link
                href="https://github.com"
                className="hover:text-foreground transition-colors"
              >
                GitHub
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              2024 FinGuardian. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
