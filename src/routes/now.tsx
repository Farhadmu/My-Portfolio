import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Clock,
  Hammer,
  GraduationCap,
  BookOpen,
  MapPin,
  Headphones,
  Sparkles,
  ExternalLink,
  Laptop,
} from "lucide-react";
import { useNowData } from "@/hooks/usePortfolioData";
import { useI18n } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { sound } from "@/lib/sound";

export const Route = createFileRoute("/now")({
  head: () => ({
    meta: [
      { title: "What I'm Doing Now — Md. Farhadul Islam" },
      {
        name: "description",
        content:
          "Public log of what Farhad is building, learning, and reading right now. Inspired by Derek Sivers' /now movement.",
      },
    ],
  }),
  component: NowPage,
});

function NowPage() {
  const { nowData } = useNowData();
  const { t, isBn } = useI18n();

  const formattedTimeAgo = useMemo(() => {
    try {
      if (!nowData.updatedAt) return "recently";
      return formatDistanceToNow(new Date(nowData.updatedAt), { addSuffix: true });
    } catch {
      return "recently";
    }
  }, [nowData.updatedAt]);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto max-w-4xl px-5 pb-24 pt-32">
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            to="/"
            onClick={() => sound.click()}
            className="inline-flex items-center gap-2 rounded-md border-2 border-slate-900 dark:border-slate-600 bg-card px-3 py-1.5 text-xs font-bold text-foreground shadow-[2px_2px_0px_#0f172a] hover:-translate-y-0.5 transition-all"
          >
            <ArrowLeft className="size-3.5" />
            <span>{isBn ? "← পোর্টফোলিওতে ফিরে যান" : "← Back to Portfolio"}</span>
          </Link>
        </div>

        {/* Paper Document Container */}
        <div className="relative rounded-2xl border-3 border-slate-900 dark:border-slate-700 bg-card p-6 sm:p-12 shadow-[8px_8px_0px_#0f172a] dark:shadow-[8px_8px_0px_#000]">
          {/* Top Tape Sticker */}
          <div
            aria-hidden
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-44 h-8 bg-[#fef08a] dark:bg-amber-300 border border-amber-400 rotate-[-1deg] shadow-sm z-20 flex items-center justify-center"
          >
            <span className="font-mono text-xs font-bold text-slate-900 tracking-wider">
              ✦ /NOW PAGE ✦
            </span>
          </div>

          {/* Header */}
          <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Farhad's Active Workdesk · 2026
              </span>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950 px-3 py-0.5 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {isBn ? `সর্বশেষ আপডেট: ${formattedTimeAgo}` : `Updated ${formattedTimeAgo}`}
                </span>
              </div>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl text-foreground font-display">
              {t.now.title}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t.now.subtitle}{" "}
              <a
                href="https://nownownow.com/about"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-primary font-semibold"
              >
                Learn about the /now movement ↗
              </a>
            </p>
          </div>

          {/* Primary Focus Sticky */}
          <div className="my-8 rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-[#fef9c3] dark:bg-[#34301d] p-5 shadow-[3px_3px_0px_#0f172a] rotate-[0.5deg]">
            <span className="font-mono text-[11px] font-bold uppercase text-amber-900 dark:text-amber-200">
              ⚡ {t.now.focusHeading}
            </span>
            <p className="font-hand text-lg sm:text-xl leading-relaxed text-slate-900 dark:text-amber-100 mt-1 font-semibold">
              "{nowData.currentFocus}"
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-10">
            {/* Section 1: Building */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-primary font-bold text-xl border-b border-dashed border-slate-300 dark:border-slate-700 pb-2">
                <Hammer className="size-5" />
                <h2>{t.now.buildingHeading}</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {nowData.building.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border-2 border-slate-900 dark:border-slate-700 bg-secondary/60 p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-base text-foreground">{item.title}</h3>
                      {item.status && (
                        <span className="font-mono text-[10px] font-bold uppercase rounded px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-400">
                          {item.status}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Learning */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-emerald-600 dark:text-emerald-400 font-bold text-xl border-b border-dashed border-slate-300 dark:border-slate-700 pb-2">
                <GraduationCap className="size-5" />
                <h2>{t.now.learningHeading}</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {nowData.learning.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border-2 border-slate-900 dark:border-slate-700 bg-secondary/60 p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-sm text-foreground">{item.title}</h3>
                      {item.tag && (
                        <span className="font-mono text-[9px] font-bold rounded px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-400">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Reading */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-rose-600 dark:text-rose-400 font-bold text-xl border-b border-dashed border-slate-300 dark:border-slate-700 pb-2">
                <BookOpen className="size-5" />
                <h2>{t.now.readingHeading}</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {nowData.reading.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border-2 border-slate-900 dark:border-slate-700 bg-secondary/60 p-4 shadow-sm"
                  >
                    <h3 className="font-bold text-base text-foreground">{item.title}</h3>
                    <span className="font-mono text-xs text-primary font-semibold">
                      by {item.author}
                    </span>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Location & Gear */}
            <div className="rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50 p-5">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider font-mono">
                {t.now.locationHeading}
              </h3>
              <div className="mt-3 flex flex-wrap gap-4 text-xs font-mono text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4 text-rose-500" />
                  <span>{nowData.location}</span>
                </span>
                {nowData.listeningTo && (
                  <span className="inline-flex items-center gap-1.5">
                    <Headphones className="size-4 text-emerald-500" />
                    <span>{nowData.listeningTo}</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Laptop className="size-4 text-primary" />
                  <span>Garuda Linux / Neovim &amp; VSCode</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
