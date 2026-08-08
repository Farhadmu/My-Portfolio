import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const LINES = [
  "$ init portfolio --mode=production",
  "> loading modules ......... ok",
  "> mounting 3d renderer .... ok",
  "> hydrating projects ...... ok",
  "> Initializing Portfolio...",
];

export function Loader({ onDone = () => {} }: { onDone?: () => void }) {
  const [pct, setPct] = useState(0);
  const [shown, setShown] = useState(0);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setOpen(false);
      onDone();
      return;
    }
    const t = setInterval(() => {
      setPct((p) => {
        const next = Math.min(100, p + Math.random() * 14 + 6);
        setShown(Math.min(LINES.length, Math.ceil((next / 100) * LINES.length)));
        if (next >= 100) {
          clearInterval(t);
          setTimeout(() => {
            setOpen(false);
            onDone();
          }, 450);
        }
        return next;
      });
    }, 170);
    return () => clearInterval(t);
  }, [onDone]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-background px-6"
          exit={{ opacity: 0, filter: "blur(10px)", scale: 1.03 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div aria-hidden className="grid-bg absolute inset-0" />
          <div className="panel relative w-full max-w-lg overflow-hidden p-0">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="size-2.5 rounded-full bg-destructive/80" />
              <span className="size-2.5 rounded-full bg-amber/80" />
              <span className="size-2.5 rounded-full bg-lime/80" />
              <span className="mono ml-2 text-xs text-muted-foreground">farhadul@portfolio: ~</span>
            </div>
            <div className="mono space-y-1.5 px-5 py-6 text-sm">
              {LINES.slice(0, shown).map((l) => (
                <motion.p
                  key={l}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={l.includes("Initializing") ? "text-primary" : "text-muted-foreground"}
                >
                  {l}
                </motion.p>
              ))}
              <span className="caret inline-block h-4 w-2 translate-y-0.5 bg-primary" />
            </div>
            <div className="px-5 pb-6">
              <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-[width] duration-200"
                  style={{ width: `${pct}%`, background: "var(--gradient-brand)" }}
                />
              </div>
              <div className="mono mt-2 flex justify-between text-[11px] text-muted-foreground">
                <span>booting interface</span>
                <span>{Math.round(pct)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
