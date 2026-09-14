import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Lock, Eye, FileText, Database, UserCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy & Data Protection — UG Find & Return" },
      {
        name: "description",
        content:
          "Official privacy policy and data governance statement for the University of Ghana Lost & Found platform.",
      },
    ],
  }),
  component: PrivacyPolicy,
});

export function PrivacyPolicy() {
  return (
    <AppShell>
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-ug-navy py-14 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ug-navy-light/60 via-ug-navy to-black/80" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-ug-gold/30 bg-ug-gold/10 px-4 py-1.5 text-xs font-semibold text-ug-gold">
            <Lock className="h-3.5 w-3.5" /> Institutional Data Governance
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Privacy <span className="text-gradient-gold">Policy</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
            How the University of Ghana collects, protects, and handles personal information on the
            Lost &amp; Found registry.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        {/* Section 1 */}
        <section className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <Database className="h-6 w-6 text-ug-navy" />
            <h2 className="text-xl font-bold text-foreground">1. Information We Collect</h2>
          </div>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              To facilitate secure recovery of lost items on campus, we collect the following
              limited data:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-foreground font-medium">
              <li>
                Student / Staff Identification (Full Name, Student ID Number, Official UG Email).
              </li>
              <li>
                Report Details (Item category, brand, approximate location, date lost/found, public
                photos).
              </li>
              <li>
                Secret Verification Details (Private descriptions, lock screen parameters, expected
                verification answers).
              </li>
              <li>Handover Records (OTP verification logs, security desk officer timestamps).</li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <Lock className="h-6 w-6 text-emerald-600" />
            <h2 className="text-xl font-bold text-foreground">
              2. How Secret Verification Answers Are Protected
            </h2>
          </div>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Secret identifying characteristics (e.g. engravings, password hints, hidden marks) are
              classified as <strong>Restricted Data</strong>.
            </p>
            <p>
              Restricted data is encrypted at rest and is never rendered publicly on the website.
              Only verified Security Moderation Desk officers and the true claimant during active
              claim review are granted permission to access secret verification answers.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <FileText className="h-6 w-6 text-ug-gold" />
            <h2 className="text-xl font-bold text-foreground">
              3. Compliance with Ghana Data Protection Act
            </h2>
          </div>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              This platform strictly complies with the{" "}
              <strong>Data Protection Act, 2012 (Act 843)</strong> of the Republic of Ghana. We
              adhere to the core principles of lawful processing, purpose specification, data
              minimization, and security safeguards.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <Eye className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-foreground">
              4. Data Retention &amp; Deletion Policy
            </h2>
          </div>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Active lost and found reports remain in the registry for a maximum of 90 days. Once an
              item is marked as "Recovered" or reaches the 90-day retention limit, associated
              private verification notes are automatically archived or purged in accordance with
              university audit schedules.
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
