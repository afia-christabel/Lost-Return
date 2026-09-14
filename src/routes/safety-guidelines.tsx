import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Lock,
  UserCheck,
  Phone,
  AlertTriangle,
  FileText,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/safety-guidelines")({
  head: () => ({
    meta: [
      { title: "Safety & Privacy Guidelines — UG Find & Return" },
      {
        name: "description",
        content:
          "Official safety guidelines and privacy rules for University of Ghana students and staff using the Lost & Found platform.",
      },
    ],
  }),
  component: SafetyGuidelines,
});

export function SafetyGuidelines() {
  return (
    <AppShell>
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-ug-navy py-14 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ug-navy-light/60 via-ug-navy to-black/80" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-ug-gold/30 bg-ug-gold/10 px-4 py-1.5 text-xs font-semibold text-ug-gold">
            <ShieldCheck className="h-3.5 w-3.5" /> Student Protection &amp; Security Standards
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Safety &amp; Privacy <span className="text-gradient-gold">Guidelines</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
            Essential guidelines to ensure safe handovers, prevent fraud, and protect personal data
            across campus.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Core Rules Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Rule 1 */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ug-gold/10 text-ug-gold">
                <Lock className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">
                1. Never Post Private Secret Details
              </h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              When reporting a lost or found item, do not publish unique identifying features in the
              public description (e.g. phone lock screen photo, engraved initials, serial numbers).
            </p>
            <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 font-medium border border-emerald-200">
              <CheckCircle2 className="inline h-3.5 w-3.5 mr-1" />
              Use our private verification questions feature instead—it keeps your secret criteria
              safe.
            </div>
          </div>

          {/* Rule 2 */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ug-navy/10 text-ug-navy">
                <Building2 className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">
                2. Official Campus Handover Points
              </h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Never agree to meet off-campus or in unlit, isolated areas. All handovers must take
              place at official university security posts.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-ug-gold" /> Balme Library Main Entrance Security
                Desk
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-ug-gold" /> Night Market Security Post
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-ug-gold" /> UG Security Services Headquarters
                (Legon)
              </li>
            </ul>
          </div>

          {/* Rule 3 */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UserCheck className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">
                3. Verify Student &amp; Staff ID
              </h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Before handing over any physical item, ask the claimant to present their valid
              University of Ghana Student/Staff ID card. Match their details with the approved claim
              record.
            </p>
          </div>

          {/* Rule 4 */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">4. Report Suspicious Activity</h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              If someone attempts to demand cash payments, finder's fees, or acts suspiciously,
              report them immediately to the Admin Desk or Campus Security.
            </p>
          </div>
        </div>

        {/* Emergency Contacts Banner */}
        <div className="mt-12 rounded-2xl border border-amber-200 bg-amber-50/50 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
            <h3 className="text-xl font-bold text-amber-900">
              Campus Emergency &amp; Security Contacts
            </h3>
          </div>
          <p className="mt-2 text-sm text-amber-800">
            For urgent assistance or to report lost high-value items (e.g. passport, official
            documents, heavy electronics):
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4 border border-amber-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                UG Security HQ
              </span>
              <p className="mt-1 font-bold text-foreground text-sm">+233 (0) 302 500 381</p>
            </div>
            <div className="rounded-xl bg-white p-4 border border-amber-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Legon Police Station
              </span>
              <p className="mt-1 font-bold text-foreground text-sm">+233 (0) 302 500 121</p>
            </div>
            <div className="rounded-xl bg-white p-4 border border-amber-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                UG Health Center
              </span>
              <p className="mt-1 font-bold text-foreground text-sm">+233 (0) 302 500 410</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
