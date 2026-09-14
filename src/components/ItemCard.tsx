import { Link } from "@tanstack/react-router";
import { MapPin, CalendarDays, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { statusLabels, type MockItem } from "@/data/mock";

const statusColors: Record<MockItem["status"], string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  matched: "bg-amber-50 text-amber-700 border-amber-200",
  under_verification: "bg-blue-50 text-blue-700 border-blue-200",
  recovered: "bg-ug-navy/5 text-ug-navy border-ug-navy/20",
};

export function ItemCard({ item }: { item: MockItem }) {
  return (
    <Link
      to="/items/$itemId"
      params={{ itemId: item.id }}
      className="group relative block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:border-ug-gold/40 hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Gold top accent */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-ug-gold/0 via-ug-gold to-ug-gold/0 opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Badge
                className={
                  item.type === "found"
                    ? "border-ug-navy/20 bg-ug-navy text-white hover:bg-ug-navy-light"
                    : "border-ug-gold/30 bg-ug-gold/10 text-ug-navy hover:bg-ug-gold/20"
                }
              >
                {item.type === "found" ? "Found" : "Lost"}
              </Badge>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusColors[item.status]}`}
              >
                {statusLabels[item.status]}
              </span>
            </div>
            <h3 className="mt-2.5 text-base font-semibold text-foreground group-hover:text-ug-navy transition-colors">
              {item.name}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {item.category}
              {item.brand ? ` · ${item.brand}` : ""} · {item.reference}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {item.matchScore ? (
              <span
                className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold ${
                  item.matchScore >= 80
                    ? "bg-emerald-50 text-emerald-700"
                    : item.matchScore >= 60
                      ? "bg-amber-50 text-amber-700"
                      : "bg-red-50 text-red-600"
                }`}
              >
                {item.matchScore}%
              </span>
            ) : null}
            <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover:text-ug-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-ug-navy/50" /> {item.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-ug-navy/50" /> {item.date}
          </span>
        </div>
      </div>
    </Link>
  );
}
