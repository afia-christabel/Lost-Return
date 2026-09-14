import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ClipboardList,
  Search,
  ShieldCheck,
  HandHeart,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Building2,
  FileCheck2,
  HelpCircle,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — UG Find & Return" },
      {
        name: "description",
        content:
          "Learn how the University of Ghana Lost & Found recovery process works. Simple reporting, automated matching, ownership verification, and safe handovers.",
      },
    ],
  }),
  component: HowItWorks,
});

export function HowItWorks() {
  return (
    <AppShell>
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-ug-navy py-14 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ug-navy-light/60 via-ug-navy to-black/80" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-ug-gold/30 bg-ug-gold/10 px-4 py-1.5 text-xs font-semibold text-ug-gold">
            <Sparkles className="h-3.5 w-3.5" /> Official Campus Recovery Workflow
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            How UG Lost &amp; Found <span className="text-gradient-gold">Works</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
            Designed specifically for the University of Ghana community to reunite students and
            staff with missing belongings quickly, privately, and securely.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* 4 Core Steps Grid */}
        <div className="space-y-12">
          {/* Step 1 */}
          <div className="grid gap-6 rounded-2xl border border-border bg-card p-6 md:grid-cols-12 md:items-center md:p-8 shadow-sm">
            <div className="md:col-span-5">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ug-gold/10 text-ug-gold font-bold text-lg mb-4">
                01
              </div>
              <h2 className="text-2xl font-bold text-foreground">1. Report an Item</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Whether you lost your student ID card, wallet, phone, or laptop—or found something
                around campus—start by submitting a structured report.
              </p>
              <ul className="mt-4 space-y-2 text-xs font-medium text-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Select precise campus location (Balme Library, Night Market, JQB, Halls)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Add public description &amp; optional photos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Define secret verification questions only the true owner can answer
                </li>
              </ul>
            </div>
            <div className="md:col-span-7 rounded-xl bg-muted/40 p-6 border border-border/60">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <ClipboardList className="h-5 w-5 text-ug-navy" />
                <span className="text-sm font-semibold text-foreground">
                  Privacy-First Reporting
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                Crucial identifying details (like lock screen photos, ID numbers, or serial numbers)
                stay encrypted and are never published publicly. They are stored securely for
                verification.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid gap-6 rounded-2xl border border-border bg-card p-6 md:grid-cols-12 md:items-center md:p-8 shadow-sm">
            <div className="md:col-span-7 order-2 md:order-1 rounded-xl bg-muted/40 p-6 border border-border/60">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <Search className="h-5 w-5 text-ug-navy" />
                <span className="text-sm font-semibold text-foreground">
                  Smart Match Score Algorithm
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                Our engine automatically cross-references lost reports with found reports across
                category, brand, colour, date range, and location proximity to produce a match
                confidence score (e.g. 94% Match).
              </p>
            </div>
            <div className="md:col-span-5 order-1 md:order-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ug-navy/10 text-ug-navy font-bold text-lg mb-4">
                02
              </div>
              <h2 className="text-2xl font-bold text-foreground">2. Automated Smart Matching</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                You don't need to manually scroll through hundreds of posts. Our matching algorithm
                connects lost reports with newly registered found items instantly.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid gap-6 rounded-2xl border border-border bg-card p-6 md:grid-cols-12 md:items-center md:p-8 shadow-sm">
            <div className="md:col-span-5">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg mb-4">
                03
              </div>
              <h2 className="text-2xl font-bold text-foreground">3. Prove Ownership</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                To claim a found item, claimants must pass private ownership verification.
              </p>
              <ul className="mt-4 space-y-2 text-xs font-medium text-foreground">
                <li className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-ug-gold" />
                  Answer secret verification questions
                </li>
                <li className="flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-ug-gold" />
                  Provide distinguishing features (e.g., sticker details, keychain type)
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-ug-gold" />
                  Admin moderation desk reviews and approves claim
                </li>
              </ul>
            </div>
            <div className="md:col-span-7 rounded-xl bg-muted/40 p-6 border border-border/60">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-semibold text-foreground">
                  Zero Fake Claims Guarantee
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                Expected answers are never revealed to claimants. Submitting fake answers records a
                strike against the student's UG account to prevent false claims.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="grid gap-6 rounded-2xl border border-border bg-card p-6 md:grid-cols-12 md:items-center md:p-8 shadow-sm">
            <div className="md:col-span-7 order-2 md:order-1 rounded-xl bg-muted/40 p-6 border border-border/60">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <Building2 className="h-5 w-5 text-ug-navy" />
                <span className="text-sm font-semibold text-foreground">
                  Official Campus Handover Points
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                Handovers take place at verified locations like Balme Library Security, Night Market
                Campus Post, or UG Security HQ. The 6-digit OTP code is checked by the officer to
                complete recovery.
              </p>
            </div>
            <div className="md:col-span-5 order-1 md:order-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-lg mb-4">
                04
              </div>
              <h2 className="text-2xl font-bold text-foreground">4. Safe OTP Handover</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Once approved, a unique 6-digit Handover OTP Code is issued. Both parties meet at an
                official campus security desk to complete the exchange.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Box */}
        <div className="mt-16 rounded-2xl bg-ug-navy p-8 text-center text-white shadow-xl">
          <h3 className="text-2xl font-bold">Ready to recover or return an item?</h3>
          <p className="mt-2 text-sm text-white/70">
            Submit a report in less than 2 minutes and let our campus system connect you.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-ug-gold text-ug-navy font-bold hover:bg-ug-gold-light"
            >
              <Link to="/report">
                <ClipboardList className="h-4 w-4" /> Report an Item
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              <Link to="/browse">
                <Search className="h-4 w-4" /> Browse Active Listings
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
