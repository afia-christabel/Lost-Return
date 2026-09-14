import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Lock,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Send,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import { statusLabels, type MockItem } from "@/data/mock";
import { supabaseService } from "@/services/supabaseService";
import { toast } from "sonner";

export const Route = createFileRoute("/items/$itemId/")({
  head: () => ({
    meta: [
      { title: "Item Report Details — UG Lost & Found" },
      {
        name: "description",
        content:
          "Review the public details of a reported campus item, start a verified ownership claim, or report a concern.",
      },
      { property: "og:title", content: "Item Report Details — UG Lost & Found" },
      {
        property: "og:description",
        content: "Public item details with private ownership verification before handover.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ItemDetail,
});

function ItemDetail() {
  const { itemId } = Route.useParams();
  const [item, setItem] = useState<MockItem | null>(null);
  const [loading, setLoading] = useState(true);

  const [concernOpen, setConcernOpen] = useState(false);
  const [concernReason, setConcernReason] = useState("misleading_info");
  const [concernDetails, setConcernDetails] = useState("");
  const [reporterContact, setReporterContact] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    supabaseService.getItemById(itemId).then((fetched) => {
      setItem(fetched);
      setLoading(false);
    });
  }, [itemId]);

  if (loading) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-muted-foreground">
          Loading report details...
        </div>
      </AppShell>
    );
  }

  if (!item) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-xl font-semibold">Report not found</h1>
          <Button asChild className="mt-4">
            <Link to="/browse">Back to browse</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const facts = [
    ["Reference", item.reference],
    ["Category", item.category],
    ["Brand", item.brand ?? "Not stated"],
    ["Colour", item.colour ?? "Not stated"],
    ["Status", statusLabels[item.status]],
    ["Reported by", item.reporter],
  ] as const;

  const handleConcernSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concernDetails.trim()) {
      toast.error("Please provide details regarding your concern.");
      return;
    }

    try {
      await supabaseService.reportConcern({
        itemId: item.id,
        itemReference: item.reference,
        reason: concernReason,
        details: concernDetails.trim(),
        contactInfo: reporterContact || "Anonymous",
      });

      setIsSubmitted(true);
      toast.success("Security concern submitted to UG Moderation Desk");
    } catch {
      toast.error("Failed to submit concern. Please try again.");
    }
  };

  const resetConcernForm = () => {
    setConcernOpen(false);
    setIsSubmitted(false);
    setConcernReason("misleading_info");
    setConcernDetails("");
    setReporterContact("");
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link
          to="/browse"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to browse
        </Link>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <Badge variant={item.type === "found" ? "default" : "secondary"}>
              {item.type === "found" ? "Found item" : "Lost item"}
            </Badge>
            <h1 className="mt-2 text-2xl font-bold text-foreground">{item.name}</h1>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {item.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" /> {item.date}
              </span>
            </div>
          </div>
          {item.matchScore ? (
            <span className="rounded-md bg-accent px-2.5 py-1.5 text-sm font-semibold text-accent-foreground">
              {item.matchScore}% match
            </span>
          ) : null}
        </div>

        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-muted-foreground">{k}</dt>
              <dd className="mt-0.5 text-sm font-medium text-foreground">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/40 p-5">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
            <Lock className="h-4 w-4 text-ug-navy" /> Private details withheld
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Serial numbers, marks, stickers and contents are never shown publicly. If this is yours,
            you&apos;ll answer verification questions built from those details.
          </p>
        </div>

        {/* Action Buttons matching identical UI size and weight */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="sm:flex-1 bg-ug-navy text-white hover:bg-ug-navy-light shadow-md"
          >
            <Link to="/items/$itemId/claim" params={{ itemId: item.id }}>
              <ShieldCheck className="mr-2 h-4 w-4 text-ug-gold" /> Make a claim
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => setConcernOpen(true)}
            className="sm:flex-1 border-amber-300/80 bg-amber-50/50 text-amber-900 hover:bg-amber-100 hover:text-amber-950 font-semibold"
          >
            <ShieldAlert className="mr-2 h-4 w-4 text-amber-600" /> Report a concern
          </Button>
        </div>
      </div>

      {/* Report a Concern Dialog */}
      <Dialog open={concernOpen} onOpenChange={setConcernOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                <ShieldAlert className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-lg font-bold">Report a Security Concern</DialogTitle>
                <DialogDescription className="text-xs">
                  Listing: <span className="font-semibold text-foreground">{item.name}</span> (
                  {item.reference})
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {!isSubmitted ? (
            <form onSubmit={handleConcernSubmit} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="concernReason" className="text-xs font-semibold">
                  Nature of Concern
                </Label>
                <select
                  id="concernReason"
                  value={concernReason}
                  onChange={(e) => setConcernReason(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="misleading_info">Misleading or Incorrect Information</option>
                  <option value="suspected_fraud">Suspected Fraud or False Claim Attempt</option>
                  <option value="duplicate_recovered">
                    Item Already Recovered / Duplicate Post
                  </option>
                  <option value="inappropriate_content">
                    Inappropriate or Offensive Description
                  </option>
                  <option value="security_issue">Other Security Concern</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="concernDetails" className="text-xs font-semibold">
                  Detailed Explanation <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="concernDetails"
                  rows={4}
                  value={concernDetails}
                  onChange={(e) => setConcernDetails(e.target.value)}
                  placeholder="Describe why this listing requires moderation review..."
                  className="text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reporterContact" className="text-xs font-semibold">
                  Your Student ID / Contact Email (Optional)
                </Label>
                <Input
                  id="reporterContact"
                  type="text"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="e.g. 10982341 or student@st.ug.edu.gh"
                  className="text-sm"
                />
                <p className="text-[11px] text-muted-foreground">
                  Your contact details are visible only to the Security Moderation Desk.
                </p>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setConcernOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-600 text-white hover:bg-amber-700 font-semibold"
                >
                  <Send className="mr-2 h-4 w-4" /> Submit Concern
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <div className="py-6 text-center space-y-4">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">Concern Logged Successfully</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Thank you for keeping our campus safe. The University of Ghana Security Moderation
                  Desk has received your report for item{" "}
                  <span className="font-semibold">{item.reference}</span>.
                </p>
              </div>
              <Button
                onClick={resetConcernForm}
                className="mt-2 bg-ug-navy text-white hover:bg-ug-navy-light"
              >
                Done &amp; Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
