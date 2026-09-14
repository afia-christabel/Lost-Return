import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { KeyRound, Clock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/ItemCard";
import { claimStatusLabels, type ClaimRecord, type MockItem } from "@/data/mock";
import { supabaseService } from "@/services/supabaseService";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Reports & Claims — UG Lost & Found" },
      {
        name: "description",
        content:
          "Track your lost and found reports, ownership claims, verification progress and handover codes.",
      },
      { property: "og:title", content: "My Reports & Claims — UG Lost & Found" },
      {
        property: "og:description",
        content: "One place to follow your reports, claims and scheduled item handovers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [claimsList, setClaimsList] = useState<ClaimRecord[]>([]);
  const [reportsList, setReportsList] = useState<MockItem[]>([]);

  useEffect(() => {
    supabaseService.getMyClaims().then(setClaimsList);
    supabaseService.getItems().then((items) => setReportsList(items.slice(0, 4)));
  }, []);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground">My activity</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your reports, ownership claims and collection details.
        </p>

        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            My claims
          </h2>
          <div className="mt-3 space-y-3">
            {claimsList.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">No active claims found.</p>
            ) : (
              claimsList.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-border bg-card p-4 sm:flex sm:items-center sm:gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs text-muted-foreground">{c.reference}</p>
                    <p className="mt-0.5 font-semibold text-foreground">{c.itemName}</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> Submitted {c.submitted}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-3 sm:mt-0">
                    <Badge variant={c.status === "approved" ? "default" : "secondary"}>
                      {claimStatusLabels[c.status] || c.status}
                    </Badge>
                    {c.handoverCode ? (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-accent px-2.5 py-1.5 font-mono text-xs font-semibold text-accent-foreground">
                        <KeyRound className="h-3.5 w-3.5" /> {c.handoverCode}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              My reports
            </h2>
            <Button asChild size="sm" variant="outline">
              <Link to="/report">New report</Link>
            </Button>
          </div>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {reportsList.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
          {reportsList.length === 0 && (
            <p className="mt-4 text-xs text-muted-foreground">No reports created yet.</p>
          )}
        </section>
      </div>
    </AppShell>
  );
}
