import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
  Mail,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions — UG Find & Return" },
      {
        name: "description",
        content:
          "Find answers to common questions about reporting, searching, claiming, verifying, and recovering lost items at the University of Ghana.",
      },
    ],
  }),
  component: FAQPage,
});

const faqItems = [
  {
    category: "General",
    question: "Who can use the UG Lost & Found platform?",
    answer:
      "The platform is available to all registered University of Ghana students, faculty members, staff, and campus visitors who have lost or found items within university premises (Legon Main Campus, Korle-Bu, and City Campus).",
  },
  {
    category: "General",
    question: "Is there any fee to report or recover a lost item?",
    answer:
      "No. The service is 100% free of charge as part of the University of Ghana student welfare initiative. Selling found items or demanding finder's fees is strictly prohibited.",
  },
  {
    category: "Reporting",
    question: "What happens after I report a lost item?",
    answer:
      "Your report is indexed into the campus registry. Our Smart Match engine automatically scans all newly registered found items for similarities in category, brand, colour, location, and timeframe, alerting you as soon as a match is detected.",
  },
  {
    category: "Reporting",
    question: "Can I edit or cancel my report once my item is found?",
    answer:
      "Yes! You can mark your report as 'Resolved' at any time from your Activity Dashboard to stop further notifications.",
  },
  {
    category: "Verification & Claims",
    question: "How does the ownership verification system work?",
    answer:
      "When someone submits a claim for a found item, they must answer private verification questions set by the finder or admin (e.g. wallpaper description, key count, hidden mark). Expected answers are never shown publicly. Submissions are reviewed by the Security Moderation Desk.",
  },
  {
    category: "Verification & Claims",
    question: "What happens if someone submits a fake claim?",
    answer:
      "Fake claims trigger an immediate administrative flag on the user's UG Student ID. Multiple failed or malicious claim attempts result in account suspension and referral to Campus Security.",
  },
  {
    category: "Handover & Collection",
    question: "What is a Handover Code and how do I use it?",
    answer:
      "Once your ownership claim is approved by the moderation desk, you receive a unique 6-digit Handover OTP Code. Take this code and your Student ID to the designated campus handover post (e.g. Balme Library Security Desk) to collect your item.",
  },
  {
    category: "Handover & Collection",
    question: "How long are unclaimed items held by Campus Security?",
    answer:
      "Unclaimed items deposited at official security posts are retained for 90 days. After 90 days, unclaimed items are handled in accordance with official University of Ghana property disposition policy.",
  },
];

export function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "General",
    "Reporting",
    "Verification & Claims",
    "Handover & Collection",
  ];

  const filteredFaqs = faqItems.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AppShell>
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-ug-navy py-14 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ug-navy-light/60 via-ug-navy to-black/80" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-ug-gold/30 bg-ug-gold/10 px-4 py-1.5 text-xs font-semibold text-ug-gold">
            <HelpCircle className="h-3.5 w-3.5" /> Help Center &amp; Knowledge Base
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
            Have questions about reporting, verifying, or retrieving belongings on campus? Find
            quick answers below.
          </p>

          {/* FAQ Search Bar */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md shadow-lg">
              <Search className="h-5 w-5 text-ug-gold" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. verification, handover code, balme library)..."
                className="w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Category Chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-ug-navy text-ug-gold shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
              <HelpCircle className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-base font-semibold">No matching questions found</p>
              <p className="text-xs mt-1">Try searching for different keywords or select 'All'.</p>
            </div>
          ) : (
            filteredFaqs.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={item.question}
                  className="rounded-xl border border-border bg-card overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-foreground hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="rounded-md bg-ug-navy/10 px-2 py-0.5 text-[11px] font-bold text-ug-navy">
                        {item.category}
                      </span>
                      <span className="text-sm md:text-base">{item.question}</span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-ug-gold flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/50 bg-muted/20">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Contact Support Card */}
        <div className="mt-12 rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
          <h3 className="text-lg font-bold text-foreground">Still have questions?</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Our campus support desk is available Monday – Friday, 8:00 AM – 5:00 PM.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-ug-navy px-4 py-2 text-xs font-semibold text-ug-gold">
            <Mail className="h-4 w-4" /> lostandfound@ug.edu.gh
          </div>
        </div>
      </div>
    </AppShell>
  );
}
