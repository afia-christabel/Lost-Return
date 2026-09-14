import { Link } from "@tanstack/react-router";
import {
  Menu,
  Search,
  PlusCircle,
  Home,
  PackageSearch,
  Shield,
  Bell,
  LayoutDashboard,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";
import type { ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/browse", label: "Browse", icon: PackageSearch },
  { to: "/report", label: "Report", icon: PlusCircle },
  { to: "/dashboard", label: "Activity", icon: LayoutDashboard },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/admin", label: "Admin", icon: Shield },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-ug-gold via-ug-gold-light to-ug-gold" />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ug-navy shadow-lg">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ug-gold text-sm font-bold text-ug-navy shadow-md">
              UG
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold tracking-wide text-white">
                Lost &amp; Found
              </span>
              <span className="block text-[11px] font-medium text-ug-gold">
                University of Ghana
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white"
                activeProps={{ className: "bg-white/15 text-white" }}
              >
                {n.label}
              </Link>
            ))}
            <Button
              asChild
              size="sm"
              className="ml-3 bg-ug-gold text-ug-navy font-semibold hover:bg-ug-gold-light shadow-md"
            >
              <Link to="/report">
                <PlusCircle className="h-4 w-4" />
                Report Item
              </Link>
            </Button>
          </nav>

          {/* Mobile controls */}
          <div className="ml-auto flex items-center gap-1 md:hidden">
            <Button
              asChild
              size="icon"
              variant="ghost"
              className="text-white/80 hover:bg-white/10 hover:text-white"
            >
              <Link to="/browse" aria-label="Search items">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 border-l-ug-navy/20 bg-white">
                <div className="mt-4 flex items-center gap-3 border-b border-border px-1 pb-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ug-navy text-sm font-bold text-ug-gold">
                    UG
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm font-bold text-ug-navy">Lost &amp; Found</span>
                    <span className="block text-[11px] text-muted-foreground">
                      University of Ghana
                    </span>
                  </span>
                </div>
                <div className="mt-4 flex flex-col gap-1">
                  {nav.map((n) => (
                    <Link
                      key={n.to}
                      to={n.to}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-ug-navy/5"
                    >
                      <n.icon className="h-5 w-5 text-ug-navy/60" />
                      {n.label}
                    </Link>
                  ))}
                  <div className="mt-4 px-3">
                    <Button asChild className="w-full bg-ug-navy text-white hover:bg-ug-navy-light">
                      <Link to="/report">
                        <PlusCircle className="h-4 w-4" />
                        Report an Item
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      {/* Desktop Footer */}
      <footer className="hidden border-t border-border bg-ug-navy text-white md:block">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Brand column */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ug-gold text-sm font-bold text-ug-navy">
                  UG
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-bold text-white">Lost &amp; Found</span>
                  <span className="block text-[11px] text-ug-gold">University of Ghana</span>
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                The official University of Ghana lost and found platform. Report, match, verify, and
                recover belongings securely.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ug-gold">
                Quick Links
              </h4>
              <ul className="mt-4 space-y-2.5">
                {[
                  { to: "/browse", label: "Browse Items" },
                  { to: "/report", label: "Report Lost Item" },
                  { to: "/report", label: "Report Found Item" },
                  { to: "/dashboard", label: "My Activity" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-ug-gold"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ug-gold">
                Resources
              </h4>
              <ul className="mt-4 space-y-2.5">
                {[
                  { label: "How It Works", to: "/how-it-works" },
                  { label: "Safety Guidelines", to: "/safety-guidelines" },
                  { label: "FAQ", to: "/faq" },
                  { label: "Privacy Policy", to: "/privacy-policy" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-ug-gold"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ug-gold">
                Contact
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm text-white/60">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-ug-gold/70" />
                  University of Ghana, Legon
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-ug-gold/70" />
                  +233 (0) 302 500 381
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-ug-gold/70" />
                  lostandfound@ug.edu.gh
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row">
            <p>
              &copy; {new Date().getFullYear()} University of Ghana Lost &amp; Found. All rights
              reserved.
            </p>
            <p>Verified students and staff only. Never share identifying details publicly.</p>
          </div>
        </div>
      </footer>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden">
        <div className="grid grid-cols-6">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors"
              activeProps={{ className: "text-ug-navy" }}
            >
              <n.icon className="h-5 w-5" />
              {n.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
