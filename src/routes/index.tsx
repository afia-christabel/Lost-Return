import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  ShieldCheck,
  Sparkles,
  HandHeart,
  ArrowRight,
  ClipboardList,
  CheckCircle2,
  TrendingUp,
  Users,
  MapPin,
  Clock,
  ChevronRight,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ItemCard } from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { stats, categories, locations, type MockItem } from "@/data/mock";
import { supabaseService } from "@/services/supabaseService";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UG Find & Return — University of Ghana Lost & Found" },
      {
        name: "description",
        content:
          "The official University of Ghana Lost & Found platform. Report lost or found items, get smart matches, and recover belongings through verified handovers.",
      },
      { property: "og:title", content: "UG Find & Return — University of Ghana Lost & Found" },
      {
        property: "og:description",
        content:
          "Verified campus lost and found: smart matching, private ownership verification, and safe handovers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const steps = [
  {
    icon: ClipboardList,
    title: "Report",
    subtitle: "Describe your item",
    body: "Submit a detailed description of what you lost or found. Private identifying details stay hidden — they're used only for ownership verification.",
    accent: "bg-ug-gold/10 text-ug-gold",
    number: "01",
  },
  {
    icon: Search,
    title: "Match",
    subtitle: "Smart matching engine",
    body: "Our system automatically scores and matches lost and found reports based on category, brand, colour, location and date with a confidence score.",
    accent: "bg-ug-navy/10 text-ug-navy",
    number: "02",
  },
  {
    icon: ShieldCheck,
    title: "Verify",
    subtitle: "Prove ownership",
    body: "Claimants answer private verification questions only the true owner can answer. Expected answers are never revealed — verification happens securely.",
    accent: "bg-emerald-50 text-emerald-600",
    number: "03",
  },
  {
    icon: HandHeart,
    title: "Recover",
    subtitle: "Safe handover",
    body: "A unique one-time handover code ensures secure collection at an official campus point. Both parties confirm — creating a full audit trail.",
    accent: "bg-blue-50 text-blue-600",
    number: "04",
  },
];

export function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [itemList, setItemList] = useState<MockItem[]>([]);

  useEffect(() => {
    supabaseService.getItems().then(setItemList);
  }, []);

  const recentFound = itemList.filter((i) => i.type === "found").slice(0, 3);
  const recentLost = itemList.filter((i) => i.type === "lost").slice(0, 3);

  // Live autocomplete matches for hero search
  const liveMatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return itemList
      .filter(
        (i) =>
          i.name.toLowerCase().includes(query) ||
          i.category.toLowerCase().includes(query) ||
          i.location.toLowerCase().includes(query) ||
          i.reference.toLowerCase().includes(query) ||
          (i.brand && i.brand.toLowerCase().includes(query)),
      )
      .slice(0, 4);
  }, [searchQuery, itemList]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      navigate({ to: "/browse" });
    } else {
      navigate({
        to: "/browse",
        search: { q: searchQuery.trim() },
      });
    }
  };

  const handleQuickChipClick = (chipText: string) => {
    setSearchQuery(chipText);
    navigate({
      to: "/browse",
      search: { q: chipText },
    });
  };

  return (
    <AppShell>
      {/* ══════════════════════════════════════════════
          HERO SECTION — Campus background with blue overlay
          ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-campus.png')" }}
        />
        {/* Navy overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-ug-navy/95 via-ug-navy/90 to-ug-navy/80" />
        {/* Subtle decorative pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-ug-gold/30 bg-ug-gold/10 px-4 py-1.5 text-xs font-semibold text-ug-gold backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              Official University of Ghana Platform
            </span>

            {/* Heading */}
            <h1 className="mt-6 text-4xl font-bold leading-[1.15] tracking-tight text-white md:text-5xl lg:text-6xl">
              Lost something <span className="text-gradient-gold">on campus?</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
              Find your belongings or help return items to their rightful owners through our secure,
              verified recovery process.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 bg-ug-gold px-8 text-sm font-semibold text-ug-navy shadow-lg shadow-ug-gold/20 hover:bg-ug-gold-light"
              >
                <Link to="/report">
                  <ClipboardList className="h-4 w-4" />
                  Report Lost Item
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="h-12 border-2 border-white/20 bg-white/10 px-8 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20"
              >
                <Link to="/report">
                  <Sparkles className="h-4 w-4" />
                  Report Found Item
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="h-12 px-8 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
              >
                <Link to="/browse">
                  Browse Listings
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Functional Search bar */}
            <div className="relative mt-10 max-w-2xl">
              <form onSubmit={handleSearchSubmit} className="relative z-20">
                <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 p-1.5 backdrop-blur-md shadow-2xl">
                  <div className="flex flex-1 items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm">
                    <Search className="h-5 w-5 text-ug-navy/50" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                      placeholder="Search by item name, category, location, or reference..."
                      className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="h-12 bg-ug-gold px-7 text-sm font-bold text-ug-navy hover:bg-ug-gold-light shadow-md"
                  >
                    Search
                  </Button>
                </div>
              </form>

              {/* Live Autocomplete Dropdown */}
              {isFocused && searchQuery.trim() && (
                <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-border bg-card p-2 shadow-2xl backdrop-blur-xl animate-fade-in">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                    Live Matching Campus Listings ({liveMatches.length})
                  </div>
                  {liveMatches.length === 0 ? (
                    <div className="p-4 text-center text-xs text-muted-foreground">
                      No direct matches for "{searchQuery}". Press Enter to view all listings on
                      Browse page.
                    </div>
                  ) : (
                    <div className="divide-y divide-border/50">
                      {liveMatches.map((item) => (
                        <Link
                          key={item.id}
                          to="/items/$itemId"
                          params={{ itemId: item.id }}
                          className="flex items-center justify-between p-3 transition-colors hover:bg-muted/50 rounded-lg"
                        >
                          <div>
                            <div className="font-semibold text-sm text-foreground">{item.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                              <span>{item.category}</span>
                              <span>&bull;</span>
                              <span>{item.location}</span>
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              item.type === "found"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {item.type.toUpperCase()}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                  <div className="border-t border-border pt-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit()}
                      className="w-full py-2 text-xs font-semibold text-ug-navy hover:bg-ug-navy/5 rounded-md flex items-center justify-center gap-1"
                    >
                      View all matching results for "{searchQuery}"{" "}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Search Suggestion Chips */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/70">
                <span className="font-medium text-white/50">Popular:</span>
                {["Balme Library", "Student ID", "Charger", "Backpack", "Keys"].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleQuickChipClick(chip)}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium text-white transition-all hover:bg-ug-gold hover:text-ug-navy hover:border-ug-gold"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {[
              { icon: ClipboardList, ...stats[0] },
              { icon: CheckCircle2, ...stats[1] },
              { icon: TrendingUp, ...stats[2] },
              { icon: Users, ...stats[3] },
            ].map((s) => (
              <div
                key={s.label}
                className="group rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <div className="flex items-center gap-2">
                  <s.icon className="h-4 w-4 text-ug-gold/70" />
                  <span className="text-xs font-medium text-white/50">{s.label}</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-white md:text-3xl">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          HOW IT WORKS
          ══════════════════════════════════════════════ */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-20 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-ug-gold/20 bg-ug-gold/5 px-4 py-1.5 text-xs font-semibold text-ug-navy">
              <Sparkles className="h-3.5 w-3.5 text-ug-gold" />
              Our Process
            </span>
            <h2 className="mt-4 text-2xl font-bold text-foreground md:text-3xl">How It Works</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
              A simple, secure four-step process to reunite you with your belongings. Every step is
              designed to protect privacy and verify true ownership.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-ug-gold/30 hover:shadow-md hover:-translate-y-1"
              >
                {/* Step number */}
                <span className="absolute -top-3 right-4 rounded-full bg-ug-navy px-3 py-1 text-[10px] font-bold text-white shadow-sm">
                  Step {s.number}
                </span>

                {/* Icon */}
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${s.accent}`}
                >
                  <s.icon className="h-6 w-6" />
                </div>

                <h3 className="mt-4 text-lg font-bold text-foreground">{s.title}</h3>
                <p className="text-xs font-medium text-ug-gold">{s.subtitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>

                {/* Connector for desktop */}
                {i < steps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                    <ChevronRight className="h-5 w-5 text-ug-gold/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          RECENTLY FOUND ITEMS
          ══════════════════════════════════════════════ */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-20 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
                Recently Found
              </span>
              <h2 className="mt-3 text-xl font-bold text-foreground md:text-2xl">
                Items Waiting for Their Owners
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                These items were recently found on campus and are being held securely.
              </p>
            </div>
            <Link
              to="/browse"
              className="hidden items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:inline-flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentFound.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          RECENTLY LOST ITEMS
          ══════════════════════════════════════════════ */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-20 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                <Clock className="h-3 w-3" />
                Recently Reported Lost
              </span>
              <h2 className="mt-3 text-xl font-bold text-foreground md:text-2xl">
                Help Someone Find Their Belongings
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Have you seen any of these items? Help a fellow student by reporting a found match.
              </p>
            </div>
            <Link
              to="/browse"
              className="hidden items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:inline-flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentLost.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CATEGORIES & LOCATIONS
          ══════════════════════════════════════════════ */}
      <section className="border-t border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-20 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Categories */}
            <div>
              <h3 className="text-lg font-bold text-foreground">Browse by Category</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Find items organised by type for faster searching.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    to="/browse"
                    className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-ug-gold/40 hover:bg-ug-gold/5 hover:text-ug-navy"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div>
              <h3 className="text-lg font-bold text-foreground">Campus Locations</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Common areas where items are lost and found on campus.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {locations.map((loc) => (
                  <Link
                    key={loc}
                    to="/browse"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-ug-navy/30 hover:bg-ug-navy/5"
                  >
                    <MapPin className="h-3.5 w-3.5 text-ug-navy/50" />
                    {loc}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA BANNER
          ══════════════════════════════════════════════ */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-ug-navy p-8 md:p-12">
            {/* Gold accent corners */}
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-ug-gold/10" />
            <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-ug-gold/10" />

            <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white md:text-3xl">
                  Found something on campus?
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/60">
                  Don't leave it unattended. Report it through UG Find &amp; Return and help a
                  fellow student recover their belongings through our secure, verified process.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 bg-ug-gold px-8 font-semibold text-ug-navy hover:bg-ug-gold-light"
                >
                  <Link to="/report">Report Found Item</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/20 bg-transparent px-8 font-semibold text-white hover:bg-white/10"
                >
                  <Link to="/browse">
                    Browse Items <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
