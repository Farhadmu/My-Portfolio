import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Hammer,
  BookOpen,
  GraduationCap,
  Sparkles,
  Clock,
  MapPin,
  Headphones,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useNowData } from "@/hooks/usePortfolioData";
import { useI18n } from "@/lib/i18n";
import { sound } from "@/lib/sound";

export function NowSection() {
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
    <section id="now" className="relative px-5 py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-md border-2 border-slate-900 dark:border-slate-600 bg-[#fef08a] dark:bg-amber-300 px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-slate-900 shadow-[2px_2px_0px_#0f172a]">
            <Clock className="size-3.5 text-slate-900" />
            <span>{isBn ? "বর্তমান সময় ও কাজ" : "/NOW MEMO"}</span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold sm:text-5xl text-foreground font-display">
            {t.now.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            {t.now.subtitle}
          </p>

          {/* Dynamic Updated Pill */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-slate-900 dark:border-slate-700 bg-emerald-50 dark:bg-emerald-950/60 px-4 py-1 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 shadow-[2px_2px_0px_#0f172a] dark:shadow-[2px_2px_0px_#000]">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {isBn ? `সর্বশেষ আপডেট: ${formattedTimeAgo}` : `Updated ${formattedTimeAgo}`}
            </span>
          </div>
        </div>

        {/* The Now Grid: 3 Notebook Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Card 1: Building */}
          <div className="relative rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-card p-6 shadow-[5px_5px_0px_#0f172a] dark:shadow-[5px_5px_0px_#000] flex flex-col justify-between">
            {/* Washi Tape Corner */}
            <div
              aria-hidden
              className="absolute -top-3 left-6 w-20 h-5 bg-amber-200/90 dark:bg-amber-400/30 border border-amber-400/80 rotate-[-2deg] shadow-xs"
            />

            <div>
              <div className="flex items-center gap-2 mb-4 text-primary font-bold text-lg border-b border-dashed border-slate-200 dark:border-slate-800 pb-2">
                <Hammer className="size-5" />
                <h3>{t.now.buildingHeading}</h3>
              </div>

              <div className="space-y-4">
                {nowData.building.map((item) => (
                  <div
                    key={item.id}
                    className="group rounded-lg border border-slate-200 dark:border-slate-800 bg-secondary/50 p-3.5 transition-all hover:-translate-y-0.5 hover:border-slate-400 dark:hover:border-slate-600"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                      {item.status && (
                        <span className="font-mono text-[9px] font-bold uppercase rounded px-1.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                          {item.status}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-200 dark:border-slate-800">
              <span className="font-mono text-[10px] text-muted-foreground">
                // active engineering sprints
              </span>
            </div>
          </div>

          {/* Card 2: Learning */}
          <div className="relative rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-card p-6 shadow-[5px_5px_0px_#0f172a] dark:shadow-[5px_5px_0px_#000] flex flex-col justify-between">
            {/* Washi Tape Corner */}
            <div
              aria-hidden
              className="absolute -top-3 left-6 w-20 h-5 bg-cyan-200/90 dark:bg-cyan-400/30 border border-cyan-400/80 rotate-[1.5deg] shadow-xs"
            />

            <div>
              <div className="flex items-center gap-2 mb-4 text-emerald-600 dark:text-emerald-400 font-bold text-lg border-b border-dashed border-slate-200 dark:border-slate-800 pb-2">
                <GraduationCap className="size-5" />
                <h3>{t.now.learningHeading}</h3>
              </div>

              <div className="space-y-4">
                {nowData.learning.map((item) => (
                  <div
                    key={item.id}
                    className="group rounded-lg border border-slate-200 dark:border-slate-800 bg-secondary/50 p-3.5 transition-all hover:-translate-y-0.5 hover:border-slate-400 dark:hover:border-slate-600"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                      {item.tag && (
                        <span className="font-mono text-[9px] font-bold rounded px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-200 dark:border-slate-800">
              <span className="font-mono text-[10px] text-muted-foreground">
                // system & theory depth
              </span>
            </div>
          </div>

          {/* Card 3: Reading & Current Focus */}
          <div className="relative rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-card p-6 shadow-[5px_5px_0px_#0f172a] dark:shadow-[5px_5px_0px_#000] flex flex-col justify-between">
            {/* Washi Tape Corner */}
            <div
              aria-hidden
              className="absolute -top-3 left-6 w-20 h-5 bg-rose-200/90 dark:bg-rose-400/30 border border-rose-400/80 rotate-[-1deg] shadow-xs"
            />

            <div>
              <div className="flex items-center gap-2 mb-4 text-rose-600 dark:text-rose-400 font-bold text-lg border-b border-dashed border-slate-200 dark:border-slate-800 pb-2">
                <BookOpen className="size-5" />
                <h3>{t.now.readingHeading}</h3>
              </div>

              <div className="space-y-4">
                {nowData.reading.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-slate-200 dark:border-slate-800 bg-secondary/50 p-3.5"
                  >
                    <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                    <span className="font-mono text-[11px] text-primary font-semibold">
                      by {item.author}
                    </span>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {item.note}
                    </p>
                  </div>
                ))}

                {/* Primary Focus Sticky Note */}
                <div className="rounded-lg border-2 border-slate-900 dark:border-slate-700 bg-[#fef9c3] dark:bg-[#34301d] p-3.5 shadow-sm rotate-[1deg]">
                  <span className="font-mono text-[10px] font-bold uppercase text-amber-900 dark:text-amber-200">
                    ⚡ {t.now.focusHeading}
                  </span>
                  <p className="font-hand text-sm sm:text-base leading-snug text-slate-900 dark:text-amber-100 mt-1 font-semibold">
                    "{nowData.currentFocus}"
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3 text-rose-500" /> {nowData.location}
              </span>
              {nowData.listeningTo && (
                <span className="inline-flex items-center gap-1 truncate max-w-[120px]" title={nowData.listeningTo}>
                  <Headphones className="size-3 text-emerald-500" /> {nowData.listeningTo}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* View Full /now Page Button */}
        <div className="mt-10 text-center">
          <a
            href="/now"
            onClick={() => sound.click()}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-900 dark:border-slate-600 bg-card px-5 py-2.5 text-xs font-bold text-foreground shadow-[3px_3px_0px_#0f172a] dark:shadow-[3px_3px_0px_#000] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0f172a] hover:bg-primary hover:text-primary-foreground"
          >
            <span>{t.now.viewPage}</span>
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
