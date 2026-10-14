import { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  ExternalLink,
  Calendar,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  useAchievements,
  useAchievementSettings,
} from "@/hooks/usePortfolioData";
import { type AchievementItem } from "@/lib/supabase";
import { sound } from "@/lib/sound";
import { track } from "./analytics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

/* =========================================================
   CUSTOM HAND-DRAWN SKETCH SVG ICONS
   ========================================================= */
export function HandDrawnTrophy({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Cup body */}
      <path d="M6 4h12v5c0 3.3-2.7 6-6 6s-6-2.7-6-6V4z" />
      {/* Left handle */}
      <path d="M6 6H3.5a2 2 0 0 0-2 2v1a3 3 0 0 0 3 3H6" />
      {/* Right handle */}
      <path d="M18 6h2.5a2 2 0 0 1 2 2v1a3 3 0 0 1-3 3H18" />
      {/* Stem */}
      <path d="M12 15v3.5" />
      {/* Base */}
      <path d="M8 20h8" />
      <path d="M10 18.5h4" />
      {/* Sketchy star engraving */}
      <path d="M12 7.5l.6 1.3 1.4.2-1 1 .2 1.4-1.2-.6-1.2.6.2-1.4-1-1 1.4-.2z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export function HandDrawnCertificate({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Parchment frame with sketchy wave */}
      <path d="M4 4.5c0-.8.7-1.5 1.5-1.5h13c.8 0 1.5.7 1.5 1.5v12c0 .8-.7 1.5-1.5 1.5H5.5A1.5 1.5 0 0 1 4 16.5v-12z" />
      {/* Certificate lines */}
      <path d="M8 7h8" strokeDasharray="1 1" />
      <path d="M8 10h8" />
      <path d="M8 13h5" />
      {/* Hanging seal ribbon */}
      <circle cx="16" cy="15" r="2.2" fill="currentColor" opacity="0.25" />
      <path d="M15 17l-1 4 2-1 2 1-1-4" />
    </svg>
  );
}

export function HandDrawnMedal({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Ribbon drapery */}
      <path d="M8 3l4 7.5L16 3" />
      <path d="M6 3h12" />
      <path d="M10 3v4.5" />
      <path d="M14 3v4.5" />
      {/* Medal disc */}
      <circle cx="12" cy="14.5" r="4.5" />
      {/* Number 1 or inner star */}
      <path d="M12 12.5v4" strokeWidth="2.2" />
      <path d="M10.8 13.5l1.2-1" />
    </svg>
  );
}

export function HandDrawnStar({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.5l2.8 6.2 6.7.8-5 4.6 1.3 6.6-5.8-3.3-5.8 3.3 1.3-6.6-5-4.6 6.7-.8z" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function AchievementIcon({
  type,
  iconType,
  className = "size-3.5",
}: {
  type: string;
  iconType?: string;
  className?: string;
}) {
  const resolved = iconType || (type === "Competition" ? "trophy" : type === "Certificate" ? "certificate" : type === "Award" ? "medal" : "star");
  switch (resolved) {
    case "trophy":
      return <HandDrawnTrophy className={className} />;
    case "certificate":
      return <HandDrawnCertificate className={className} />;
    case "medal":
      return <HandDrawnMedal className={className} />;
    case "star":
    default:
      return <HandDrawnStar className={className} />;
  }
}

/* =========================================================
   LIGHTWEIGHT CONFETTI BURST (FOR COMPETITIONS)
   ========================================================= */
function MiniConfettiBurst() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 160,
        y: -30 - Math.random() * 80,
        rot: Math.random() * 360,
        color: ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"][i % 6],
        delay: Math.random() * 0.1,
        size: 4 + Math.random() * 5,
      })),
    []
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 z-40 overflow-visible"
    >
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.5, rotate: 0 }}
          animate={{
            x: p.x,
            y: p.y + 110,
            opacity: [1, 1, 0],
            scale: [0.8, 1, 0.4],
            rotate: p.rot + 360,
          }}
          transition={{ duration: 1.2, delay: p.delay, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size * 0.7,
            backgroundColor: p.color,
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
}

/* =========================================================
   MAIN POPUP COMPONENT
   ========================================================= */
export function AchievementPopup() {
  const { achievements } = useAchievements();
  const settings = useAchievementSettings();

  const enabledAchievements = achievements.filter((a) => a.enabled);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState<AchievementItem | null>(null);
  const [progressMs, setProgressMs] = useState(0);

  const cardDurationMs = (settings.durationSeconds || 6) * 1000;
  const startDelayMs = (settings.startDelaySeconds || 2.5) * 1000;

  // Track tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Initial start delay timer
  useEffect(() => {
    if (!settings.enabled || enabledAchievements.length === 0) return;
    const t = setTimeout(() => {
      setIsStarted(true);
    }, startDelayMs);
    return () => clearTimeout(t);
  }, [settings.enabled, enabledAchievements.length, startDelayMs]);

  const currentItem = enabledAchievements[currentIndex];

  // Sound triggers on card drop & stamp
  useEffect(() => {
    if (!isStarted || isFinished || !currentItem) return;
    if (settings.soundEnabled) {
      sound.paperDrop(true);
      if (currentItem.type === "Certificate" || currentItem.stampText) {
        const stampTimer = setTimeout(() => {
          sound.stamp(true);
        }, 320);
        return () => clearTimeout(stampTimer);
      }
    }
  }, [currentIndex, isStarted, isFinished, currentItem, settings.soundEnabled]);

  // Tick timer for current card
  useEffect(() => {
    if (!isStarted || isFinished || !currentItem || isHovered || isTabHidden || activeModalItem) {
      return;
    }

    const interval = 50; // update progress every 50ms
    const timer = setInterval(() => {
      setProgressMs((prev) => {
        const next = prev + interval;
        if (next >= cardDurationMs) {
          // Advance to next card
          if (currentIndex + 1 < enabledAchievements.length) {
            setCurrentIndex((i) => i + 1);
            return 0;
          } else {
            setIsFinished(true);
            return cardDurationMs;
          }
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [
    isStarted,
    isFinished,
    currentIndex,
    enabledAchievements.length,
    currentItem,
    isHovered,
    isTabHidden,
    activeModalItem,
    cardDurationMs,
  ]);

  if (!settings.enabled || !isStarted || isFinished || !currentItem) {
    return (
      <AchievementModal
        item={activeModalItem}
        onClose={() => {
          setActiveModalItem(null);
          if (currentIndex + 1 < enabledAchievements.length) {
            setCurrentIndex((i) => i + 1);
            setProgressMs(0);
          } else {
            setIsFinished(true);
          }
        }}
      />
    );
  }

  const handleDismissCurrent = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex + 1 < enabledAchievements.length) {
      setCurrentIndex((i) => i + 1);
      setProgressMs(0);
    } else {
      setIsFinished(true);
    }
  };

  const handleCardClick = () => {
    track("achievement_popup_click", {
      id: currentItem.id,
      title: currentItem.title,
      type: currentItem.type,
    });
    setActiveModalItem(currentItem);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  const typeColorClasses = {
    Competition: "bg-rose-100 text-rose-800 border-rose-700 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-600",
    Certificate: "bg-blue-100 text-blue-800 border-blue-700 dark:bg-blue-950/60 dark:text-blue-200 dark:border-blue-600",
    Award: "bg-amber-100 text-amber-900 border-amber-700 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-600",
    Other: "bg-emerald-100 text-emerald-800 border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-600",
  }[currentItem.type] || "bg-yellow-100 text-yellow-900 border-yellow-700";

  const progressPercent = Math.min(100, Math.max(0, (progressMs / cardDurationMs) * 100));

  // Fallback stamp text if not explicitly configured
  const displayStampText =
    currentItem.stampText ||
    (currentItem.type === "Competition"
      ? "6th!"
      : currentItem.type === "Certificate"
      ? "VERIFIED"
      : currentItem.type === "Award"
      ? "FINALIST"
      : "HONOR");

  const hasNextCard = currentIndex + 1 < enabledAchievements.length;
  const hasThirdCard = currentIndex + 2 < enabledAchievements.length;

  return (
    <>
      <aside
        role="status"
        aria-live="polite"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-3 inset-x-3 z-50 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-sm sm:w-full"
      >
        <AnimatePresence mode="wait">
          <div key={currentItem.id} className="relative">
            {/* DECK STACK: 2nd Card in Stack (behind) */}
            {hasNextCard && (
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-lg border-2 border-slate-900 bg-[#f7f4e9] dark:bg-[#18232e] dark:border-slate-600 shadow-[3px_3px_0px_#0f172a] dark:shadow-[3px_3px_0px_#000] rotate-[3deg] scale-[0.98] translate-y-1 -z-10 opacity-70 pointer-events-none transition-all duration-300"
              />
            )}

            {/* DECK STACK: 3rd Card in Stack (further behind) */}
            {hasThirdCard && (
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-lg border-2 border-slate-900 bg-[#f0ecdc] dark:bg-[#121b24] dark:border-slate-700 shadow-[2px_2px_0px_#0f172a] dark:shadow-[2px_2px_0px_#000] rotate-[-3.5deg] scale-[0.95] translate-y-2 -z-20 opacity-45 pointer-events-none transition-all duration-300"
              />
            )}

            {/* PAPER DROP ACTIVE CARD */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.1, bottom: 0.6 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 60 || info.velocity.y > 400) {
                  handleDismissCurrent();
                }
              }}
              initial={{ y: -70, opacity: 0, scale: 0.94, rotate: -3 }}
              animate={{ y: 0, opacity: 1, scale: 1, rotate: -1 }}
              exit={{
                y: 50,
                opacity: 0,
                scale: 0.86,
                rotate: 9,
                filter: "blur(1px)",
                transition: { duration: 0.22, ease: "easeIn" },
              }}
              transition={{ type: "spring", stiffness: 280, damping: 20 }}
              tabIndex={0}
              onClick={handleCardClick}
              onKeyDown={handleKeyDown}
              aria-label={`Achievement: ${currentItem.title}. Click for proof and details. Swipe down to dismiss.`}
              className="group relative cursor-pointer overflow-hidden rounded-lg border-2 border-slate-900 bg-[#fffdf5] dark:bg-[#141d26] dark:border-slate-500 p-4 shadow-[5px_5px_0px_#0f172a] dark:shadow-[5px_5px_0px_#000] transition-shadow hover:shadow-[7px_7px_0px_#0f172a] dark:hover:shadow-[7px_7px_0px_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {/* Confetti Burst for Competition Card */}
              {currentItem.type === "Competition" && <MiniConfettiBurst />}

              {/* Mobile Swipe Handle Indicator */}
              <div
                aria-hidden="true"
                className="sm:hidden absolute top-1.5 left-1/2 -translate-x-1/2 h-1 w-10 rounded-full bg-slate-300 dark:bg-slate-700"
              />

              {/* Top Masking Tape Accent */}
              <div
                aria-hidden="true"
                className="absolute -top-2.5 left-1/2 h-5 w-24 -translate-x-1/2 rotate-1 bg-amber-200/90 dark:bg-amber-900/60 border border-amber-400/80 dark:border-amber-700/60 shadow-xs"
              />

              {/* Top Row: Type Tag, Counter, and Close Button */}
              <div className="mb-2 flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide border rounded ${typeColorClasses}`}
                  >
                    <AchievementIcon
                      type={currentItem.type}
                      iconType={currentItem.iconType}
                      className="size-3"
                    />
                    {currentItem.type}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground font-bold">
                    {currentIndex + 1} of {enabledAchievements.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleDismissCurrent}
                  aria-label="Dismiss achievement card"
                  className="grid size-6 place-items-center rounded-md border border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-[1px_1px_0px_#0f172a] dark:shadow-[1px_1px_0px_#000] hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-rose-600 active:translate-x-0.5 active:translate-y-0.5"
                >
                  <X className="size-3.5 stroke-[2.5]" />
                </button>
              </div>

              {/* Main Title & Message */}
              <div className="space-y-1 pr-14">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                  {currentItem.title}
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium line-clamp-2">
                  {currentItem.shortMessage}
                </p>
              </div>

              {/* Handwritten Rubber Stamp Accent */}
              {displayStampText && (
                <div
                  aria-hidden="true"
                  className={`absolute right-3 top-10 pointer-events-none select-none ${
                    currentItem.type === "Certificate" ? "stamp-slam" : "rotate-[-7deg]"
                  }`}
                >
                  <span className="inline-block rounded-xs border-2 border-dashed border-rose-600 dark:border-rose-400 bg-rose-50/70 dark:bg-rose-950/40 px-1.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-300 shadow-xs">
                    {displayStampText}
                  </span>
                </div>
              )}

              {/* Footer Metadata */}
              <div className="mt-3 flex items-center justify-between border-t border-dashed border-slate-300 dark:border-slate-700 pt-2 text-[11px] text-slate-600 dark:text-slate-400">
                <span className="font-hand text-sm font-semibold truncate max-w-[190px] text-slate-800 dark:text-slate-200">
                  {currentItem.issuer}
                </span>
                <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {currentItem.date}
                </span>
              </div>

              {/* Click / Swipe hint */}
              <div className="mt-1 flex items-center justify-between text-[10px] text-primary font-semibold">
                <span>Proof &amp; Details ↗</span>
                <div className="flex items-center gap-1 font-mono text-muted-foreground text-[9px]">
                  {isHovered ? (
                    <span className="text-amber-600 dark:text-amber-400">paused</span>
                  ) : (
                    <span>swipe ↓ to close</span>
                  )}
                </div>
              </div>

              {/* Pencil-Line Timer Bar */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-200 dark:bg-slate-800 overflow-hidden"
              >
                <div
                  className="h-full bg-slate-800 dark:bg-slate-200 transition-[width] duration-75 ease-linear border-t border-dashed border-slate-600/30"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      </aside>

      <AchievementModal
        item={activeModalItem}
        onClose={() => {
          setActiveModalItem(null);
          if (currentIndex + 1 < enabledAchievements.length) {
            setCurrentIndex((i) => i + 1);
            setProgressMs(0);
          } else {
            setIsFinished(true);
          }
        }}
      />
    </>
  );
}

/* =========================================================
   DETAIL MODAL DIALOG
   ========================================================= */
function AchievementModal({
  item,
  onClose,
}: {
  item: AchievementItem | null;
  onClose: () => void;
}) {
  if (!item) return null;

  return (
    <Dialog open={Boolean(item)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg border-2 border-slate-900 dark:border-slate-600 bg-[#fdfbf7] dark:bg-[#141b24] p-6 shadow-[7px_7px_0px_#0f172a] dark:shadow-[7px_7px_0px_#000] sm:rounded-xl">
        <DialogHeader className="text-left space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded border border-slate-900 dark:border-slate-600 bg-amber-200 dark:bg-amber-900/60 px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase text-slate-900 dark:text-slate-100 shadow-[1px_1px_0px_#0f172a]">
              <AchievementIcon type={item.type} iconType={item.iconType} className="size-3.5" />
              {item.type}
            </span>
            <span className="font-mono text-xs text-muted-foreground font-semibold">
              {item.date}
            </span>
          </div>

          <DialogTitle className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            {item.title}
          </DialogTitle>

          <DialogDescription className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Building2 className="size-3.5 text-primary shrink-0" />
            <span>{item.issuer}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Big Image if available */}
        {item.image ? (
          <div className="relative my-2 overflow-hidden rounded-lg border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[2px_2px_0px_#0f172a]">
            <img
              src={item.image}
              alt={item.title}
              className="w-full max-h-64 object-cover object-center"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : (
          <div className="my-2 flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 bg-amber-50/50 dark:bg-amber-950/20 p-4 text-center">
            <AchievementIcon type={item.type} iconType={item.iconType} className="size-10 text-amber-600/60 dark:text-amber-400/60" />
          </div>
        )}

        {/* Short Summary Callout */}
        <div className="rounded-md border border-slate-300 dark:border-slate-700 bg-[#fefce8] dark:bg-amber-950/30 p-3 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-xs">
          "{item.shortMessage}"
        </div>

        {/* Full Details */}
        <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <h5 className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            Milestone Details
          </h5>
          <p className="whitespace-pre-wrap">{item.details}</p>
        </div>

        {/* Verify / Action Links */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-300 dark:border-slate-700 pt-4">
          {item.link ? (
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border-2 border-slate-900 dark:border-slate-600 bg-primary px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-[2px_2px_0px_#0f172a] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0f172a]"
            >
              <CheckCircle2 className="size-4" />
              <span>Verify / View Project ↗</span>
            </a>
          ) : (
            <span className="font-hand text-sm text-slate-500 dark:text-slate-400">
              Verified institutional achievement
            </span>
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border-2 border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 shadow-[2px_2px_0px_#0f172a] hover:bg-slate-100 dark:hover:bg-slate-700 active:translate-x-0.5 active:translate-y-0.5"
          >
            Close &amp; Next
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
