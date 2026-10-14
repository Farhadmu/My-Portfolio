import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ExternalLink,
  Calendar,
  Building2,
  CheckCircle2,
  X,
  Trophy,
  Award,
  Sparkles,
  Search,
} from "lucide-react";
import { useAchievements } from "@/hooks/usePortfolioData";
import { type AchievementItem } from "@/lib/supabase";
import { sound } from "@/lib/sound";
import { useI18n } from "@/lib/i18n";
import {
  HandDrawnTrophy,
  HandDrawnCertificate,
  HandDrawnMedal,
  HandDrawnStar,
} from "./AchievementPopup";

function PushPin({ color = "red" }: { color?: "red" | "gold" | "blue" | "silver" }) {
  const pinColors = {
    red: "bg-rose-600 border-rose-800 shadow-rose-900/40",
    gold: "bg-amber-500 border-amber-700 shadow-amber-900/40",
    blue: "bg-blue-600 border-blue-800 shadow-blue-900/40",
    silver: "bg-slate-300 border-slate-500 shadow-slate-900/40",
  };

  return (
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center">
      {/* Pin head */}
      <div
        className={`size-4 rounded-full border-2 ${pinColors[color]} shadow-md`}
      >
        <div className="size-1 bg-white/70 rounded-full mt-0.5 ml-0.5" />
      </div>
      {/* Pin needle shadow */}
      <div className="w-0.5 h-1.5 bg-slate-800/80 -mt-0.5" />
    </div>
  );
}

export function Corkboard() {
  const { achievements } = useAchievements();
  const { t, isBn } = useI18n();
  const [filter, setFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<AchievementItem | null>(null);

  const enabledItems = useMemo(
    () => achievements.filter((a) => a.enabled).sort((a, b) => a.sortOrder - b.sortOrder),
    [achievements]
  );

  const filteredItems = useMemo(() => {
    if (filter === "all") return enabledItems;
    if (filter === "competition") return enabledItems.filter((a) => a.type === "Competition");
    if (filter === "certificate") return enabledItems.filter((a) => a.type === "Certificate");
    if (filter === "award") return enabledItems.filter((a) => a.type === "Award" || a.type === "Other");
    return enabledItems;
  }, [enabledItems, filter]);

  // Subtle natural paper rotations for the stickers
  const rotations = [-2.5, 1.8, -1.2, 2.8, -3.1, 1.5, -2.0, 2.2];
  const pinColors: ("red" | "gold" | "blue" | "silver")[] = ["red", "gold", "blue", "gold", "red"];

  return (
    <section id="achievements" className="relative px-5 py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-md border-2 border-slate-900 dark:border-slate-600 bg-[#fef08a] dark:bg-amber-300 px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-slate-900 shadow-[2px_2px_0px_#0f172a]">
            <Trophy className="size-3.5 text-slate-900" />
            <span>{isBn ? "ওয়ার্কশপ পিন বোর্ড" : "WORKSHOP PIN BOARD"}</span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold sm:text-5xl text-foreground font-display">
            {t.corkboard.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            {t.corkboard.subtitle}
          </p>

          {/* Interactive Drag Hint */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 bg-card/80 px-4 py-1 text-xs font-mono text-muted-foreground">
            <span>{t.corkboard.dragHint}</span>
          </div>

          {/* Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "all", label: t.corkboard.filterAll },
              { id: "competition", label: t.corkboard.filterComp },
              { id: "certificate", label: t.corkboard.filterCert },
              { id: "award", label: t.corkboard.filterHack },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  sound.click();
                  setFilter(f.id);
                }}
                className={`rounded-md border-2 border-slate-900 dark:border-slate-600 px-3 py-1 text-xs font-bold transition-all shadow-[2px_2px_0px_#0f172a] dark:shadow-[2px_2px_0px_#000] ${
                  filter === f.id
                    ? "bg-primary text-primary-foreground -translate-y-0.5"
                    : "bg-card text-foreground hover:bg-secondary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* The Corkboard Frame */}
        <div className="relative rounded-2xl border-4 border-[#5c3a21] dark:border-[#2d1b10] bg-[#c29b6f] dark:bg-[#3d2716] p-6 sm:p-10 shadow-[10px_10px_0px_#0f172a] dark:shadow-[10px_10px_0px_#000]">
          {/* Cork texture overlay */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-xl opacity-30 pointer-events-none bg-[radial-gradient(#8c582e_1px,transparent_1px)] dark:bg-[radial-gradient(#1f1208_1px,transparent_1px)] [background-size:12px_12px]"
          />

          {/* Stickers Grid */}
          <div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => {
              const rot = rotations[index % rotations.length];
              const pinColor = pinColors[index % pinColors.length];

              return (
                <motion.div
                  key={item.id}
                  drag
                  dragConstraints={{ top: -40, bottom: 40, left: -40, right: 40 }}
                  whileHover={{ scale: 1.03, rotate: 0 }}
                  whileDrag={{ scale: 1.08, zIndex: 40, cursor: "grabbing" }}
                  style={{ rotate: `${rot}deg` }}
                  onClick={() => {
                    sound.pop();
                    setSelectedItem(item);
                  }}
                  className="group relative cursor-grab rounded-lg border-2 border-slate-900 dark:border-slate-700 bg-[#fffdf7] dark:bg-slate-900 p-5 shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] transition-shadow hover:shadow-[7px_7px_0px_#0f172a]"
                >
                  {/* Push Pin */}
                  <PushPin color={pinColor} />

                  {/* Stamp Badge (e.g. 6th!, Champion) */}
                  {item.stampText && (
                    <div className="absolute top-3 right-3 -rotate-12 rounded border-2 border-rose-600 bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 text-[10px] font-mono font-black uppercase text-rose-600 dark:text-rose-400 shadow-xs">
                      {item.stampText}
                    </div>
                  )}

                  {/* Type / Icon Badge */}
                  <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-900/20 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    {item.type === "Competition" && <HandDrawnTrophy className="size-3 text-amber-500" />}
                    {item.type === "Certificate" && <HandDrawnCertificate className="size-3 text-blue-500" />}
                    {item.type === "Award" && <HandDrawnMedal className="size-3 text-rose-500" />}
                    {item.type === "Other" && <HandDrawnStar className="size-3 text-emerald-500" />}
                    <span>{item.type}</span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 text-base sm:text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>

                  {/* Short message */}
                  <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.shortMessage || item.details}
                  </p>

                  {/* Issuer & Date */}
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-dashed border-slate-300 dark:border-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                    <span className="font-semibold truncate max-w-[140px]">{item.issuer}</span>
                    <span className="font-bold text-primary">{item.date}</span>
                  </div>

                  {/* Click detail hint */}
                  <div className="mt-2 text-right">
                    <span className="font-hand text-xs text-slate-500 dark:text-slate-400 group-hover:text-primary">
                      click for full details ➔
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <p className="font-mono text-sm">No pins found for this category.</p>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg rounded-xl border-3 border-slate-900 bg-white dark:bg-slate-900 p-6 shadow-[8px_8px_0px_#0f172a] dark:shadow-[8px_8px_0px_#000] max-h-[90vh] overflow-y-auto"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => {
                  sound.click();
                  setSelectedItem(null);
                }}
                className="absolute top-4 right-4 grid size-8 place-items-center rounded-md border-2 border-slate-900 bg-card text-foreground shadow-[2px_2px_0px_#0f172a] hover:bg-rose-500 hover:text-white transition-colors"
              >
                <X className="size-4" />
              </button>

              {/* Type and Stamp */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-900 bg-amber-100 dark:bg-amber-950 px-2.5 py-0.5 text-xs font-bold text-amber-900 dark:text-amber-200">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  {selectedItem.type}
                </span>
                {selectedItem.stampText && (
                  <span className="rounded border-2 border-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                    {selectedItem.stampText}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="mt-3 text-2xl font-extrabold text-foreground font-display">
                {selectedItem.title}
              </h3>

              {/* Meta details */}
              <div className="mt-3 flex flex-wrap gap-4 text-xs font-mono text-muted-foreground border-y border-slate-200 dark:border-slate-800 py-2.5">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="size-3.5 text-primary" />
                  <span>{selectedItem.issuer}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-emerald-600" />
                  <span>{selectedItem.date}</span>
                </span>
              </div>

              {/* Full Image if available */}
              {selectedItem.image && (
                <div className="mt-4 aspect-video overflow-hidden rounded-lg border-2 border-slate-900 dark:border-slate-700 bg-slate-100">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    className="size-full object-cover"
                  />
                </div>
              )}

              {/* Description & Details */}
              <div className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {selectedItem.details || selectedItem.shortMessage}
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                {selectedItem.link ? (
                  <a
                    href={selectedItem.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-900 bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-[2px_2px_0px_#0f172a] hover:-translate-y-0.5 transition-all"
                  >
                    <span>{t.corkboard.viewCredential}</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                ) : (
                  <span className="font-mono text-xs text-muted-foreground">
                    ✓ Verified Offline Credential
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="rounded-lg border-2 border-slate-900 bg-card px-4 py-2 text-xs font-bold text-foreground shadow-[2px_2px_0px_#0f172a] hover:bg-secondary"
                >
                  {t.common.close}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
