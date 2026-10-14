import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "@tanstack/react-router";
import { sound } from "@/lib/sound";

/**
 * Hand-drawn drafting compass SVG icon
 */
function HandDrawnCompass({ className = "size-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Top hinge circle */}
      <circle cx="24" cy="10" r="4.5" className="stroke-primary" />
      <circle cx="24" cy="10" r="1.5" className="fill-primary stroke-none" />
      {/* Top handle peg */}
      <path d="M24 5.5V2" />
      {/* Left leg (needle point) */}
      <path d="M21 14L10 42" strokeDasharray="1 1" />
      <path d="M10 42L8.5 45" strokeWidth="3" className="stroke-foreground" />
      {/* Right leg (graphite pencil) */}
      <path d="M27 14L38 42" />
      <path d="M38 42L40 45" strokeWidth="3.2" className="stroke-primary" />
      {/* Crossbar divider adjusting wheel */}
      <path d="M14 28C19 30 29 30 34 28" strokeDasharray="3 2" />
      <circle cx="24" cy="29" r="2.5" className="fill-muted stroke-border" />
    </svg>
  );
}

/**
 * Hand-drawn open notebook with sketching pencil SVG
 */
function HandDrawnNotebook({ className = "size-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Left page */}
      <path d="M10 16C18 14 26 15 32 18V50C26 47 18 46 10 48V16Z" className="fill-card stroke-foreground" />
      {/* Right page */}
      <path d="M32 18C38 15 46 14 54 16V48C46 46 38 47 32 50V18Z" className="fill-card stroke-foreground" />
      {/* Spine binding rings */}
      <path d="M30 20C30 20 32 19 34 20" strokeWidth="2.8" className="stroke-primary" />
      <path d="M30 28C30 28 32 27 34 28" strokeWidth="2.8" className="stroke-primary" />
      <path d="M30 36C30 36 32 35 34 36" strokeWidth="2.8" className="stroke-primary" />
      <path d="M30 44C30 44 32 43 34 44" strokeWidth="2.8" className="stroke-primary" />
      {/* Page lines */}
      <path d="M14 24H28" strokeDasharray="2 2" className="stroke-muted-foreground/60" />
      <path d="M14 30H27" strokeDasharray="2 2" className="stroke-muted-foreground/60" />
      <path d="M14 36H28" strokeDasharray="2 2" className="stroke-muted-foreground/60" />
      <path d="M36 24H50" strokeDasharray="2 2" className="stroke-muted-foreground/60" />
      <path d="M36 30H48" strokeDasharray="2 2" className="stroke-muted-foreground/60" />
      <path d="M36 36H50" strokeDasharray="2 2" className="stroke-muted-foreground/60" />
    </svg>
  );
}

export function PageLoader() {
  const router = useRouter();

  // 100% visible on initial entry, blocking the screen completely
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phrase, setPhrase] = useState("Opening Farhad's notebook...");
  const [countdownText, setCountdownText] = useState("Loading portfolio (3s)...");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initial 3-second entrance sequence
  useEffect(() => {
    // Lock background scrolling completely while loader is active
    document.body.style.overflow = "hidden";

    try {
      sound.paperDrop();
    } catch {}

    const TOTAL_MS = 3000; // Exact 3 seconds as requested
    const startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(100, Math.floor((elapsed / TOTAL_MS) * 100));
      setProgress(rawProgress);

      const remainingSecs = Math.max(0, (TOTAL_MS - elapsed) / 1000).toFixed(1);
      setCountdownText(`Ready in ${remainingSecs}s...`);

      if (elapsed < 1000) {
        setPhrase("Opening Farhad's notebook...");
      } else if (elapsed < 2000) {
        setPhrase("Drafting blueprints & systems...");
      } else if (elapsed < 2750) {
        setPhrase("Calibrating workspace & modules...");
      } else {
        setPhrase("Welcome to Farhad's portfolio!");
      }

      if (elapsed >= TOTAL_MS) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setProgress(100);
        setCountdownText("Ready!");

        try {
          sound.stamp();
        } catch {}

        // Allow 300ms to see 100% before smooth exit reveal
        setTimeout(() => {
          setIsVisible(false);
          document.body.style.overflow = "";
        }, 300);
      }
    }, 25);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.body.style.overflow = "";
    };
  }, []);

  // 2. Link click transition loader helper
  const startTransition = useCallback((msg: string, duration = 1000) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    document.body.style.overflow = "hidden";
    setIsVisible(true);
    setProgress(15);
    setPhrase(msg);
    setCountdownText("Opening...");

    try {
      sound.paperDrop();
    } catch {}

    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(95, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setProgress(100);
        setTimeout(() => {
          setIsVisible(false);
          document.body.style.overflow = "";
        }, 220);
      }
    }, 25);
  }, []);

  // 3. Global link click listener
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");

      if (
        !href ||
        target === "_blank" ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      let navMsg = "Turning page...";
      if (href.includes("/blog")) navMsg = "Opening tech notes & essays...";
      else if (href.includes("/admin")) navMsg = "Authenticating dashboard...";
      else if (href === "/" || href.endsWith("/#")) navMsg = "Loading portfolio desk...";
      else if (href.startsWith("#") || href.includes("#")) navMsg = "Navigating to section...";

      startTransition(navMsg, 900);
    };

    document.addEventListener("click", handleGlobalClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
    };
  }, [startTransition]);

  // 4. Router navigation event subscription
  useEffect(() => {
    const unsubBefore = router.subscribe("onBeforeLoad", (event) => {
      let msg = "Opening page...";
      const to = event?.toLocation?.pathname || "";
      if (to === "/blog") msg = "Opening engineering essays...";
      else if (to === "/admin") msg = "Entering Admin workspace...";
      else if (to === "/") msg = "Returning to main desk...";
      startTransition(msg, 900);
    });

    return () => {
      unsubBefore();
    };
  }, [router, startTransition]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="page-loader-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -45,
            scale: 0.98,
            transition: { duration: 0.45, ease: [0.32, 0.72, 0, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#fbfaf5] dark:bg-[#141b24] bg-graph px-4 select-none cursor-wait"
          style={{ willChange: "transform, opacity" }}
          aria-live="polite"
          aria-busy="true"
        >
          {/* Centered Notebook Paper Card */}
          <motion.div
            initial={{ scale: 0.94, y: 20, rotate: -1 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.96, y: -25, rotate: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md rounded-2xl border-2 border-slate-900 dark:border-slate-500 bg-card p-6 sm:p-8 shadow-[8px_8px_0px_#0f172a] dark:shadow-[8px_8px_0px_#000] bg-ruled overflow-hidden"
          >
            {/* Masking tape on top */}
            <div className="tape-strip -top-3.5 left-1/2 -translate-x-1/2 w-36 bg-[#f5e6b8] dark:bg-[#786438] border border-amber-300/50" />

            {/* Left margin line (Notebook red line) */}
            <div className="absolute left-7 top-0 bottom-0 w-px bg-red-400/50 dark:bg-amber-400/40" />

            <div className="relative pl-6">
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b-2 border-slate-900/10 dark:border-slate-700 pb-3 mb-6 text-xs font-mono text-muted-foreground">
                <span className="flex items-center gap-2 font-bold tracking-wider uppercase text-foreground">
                  <span className="size-2.5 rounded-full bg-primary animate-ping" />
                  FARHAD.DEV
                </span>
                <span className="tracking-widest font-semibold text-primary">{countdownText}</span>
              </div>

              {/* Animated Hand-Drawn Notebook & Compass */}
              <div className="my-5 flex items-center justify-center gap-6">
                <motion.div
                  animate={{
                    rotate: [0, -6, 6, 0],
                    y: [0, -4, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.4,
                    ease: "easeInOut",
                  }}
                >
                  <HandDrawnNotebook className="size-14 text-primary" />
                </motion.div>

                <div className="h-12 w-px bg-border border-dashed" />

                <motion.div
                  animate={{
                    rotate: [0, 22, -16, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                >
                  <HandDrawnCompass className="size-12 text-foreground" />
                </motion.div>
              </div>

              {/* Dynamic Handwritten Phrase */}
              <div className="text-center my-4 min-h-[40px] flex items-center justify-center">
                <p className="font-handwriting text-2xl sm:text-3xl text-foreground font-bold tracking-wide">
                  {phrase}
                </p>
              </div>

              {/* 3-Second Drafting Ruler Progress Bar */}
              <div className="mt-5 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-muted-foreground font-semibold">
                  <span>0 cm [START]</span>
                  <span className="font-bold text-primary text-sm tracking-wider">{progress}%</span>
                  <span>20 cm [READY]</span>
                </div>

                <div className="relative h-4 w-full rounded-md border-2 border-slate-900 dark:border-slate-600 bg-secondary/70 p-0.5 overflow-hidden">
                  {/* Ruler tick marks */}
                  <div
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, currentColor 0, currentColor 1px, transparent 1px, transparent 10px)",
                    }}
                  />

                  {/* Graphite / Chalk Fill */}
                  <motion.div
                    className="h-full rounded bg-primary"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>
              </div>

              {/* Bottom Stamp & Signature */}
              <div className="mt-6 pt-3 border-t-2 border-dashed border-border/80 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span className="stamp-box px-2.5 py-1 text-[10px] font-bold text-primary uppercase border-2 border-primary/60 rounded -rotate-2 inline-block shadow-[1px_1px_0px_currentColor]">
                  PORTFOLIO v2.4
                </span>
                <span className="font-semibold text-foreground/80">MD. FARHADUL ISLAM</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Backwards compatibility export
 */
export function Loader({ onDone = () => {} }: { onDone?: () => void }) {
  useEffect(() => {
    onDone();
  }, [onDone]);

  return null;
}
