import { Suspense, lazy, useEffect, useRef, useState } from "react";

const Scene = lazy(() => import("./HeroScene"));

/**
 * Lazy, client-only wrapper for the WebGL hero object.
 * Falls back to a pure-CSS holographic orb on mobile / reduced motion.
 */
export function Hero3D() {
  const [enabled, setEnabled] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    setEnabled(!reduced && wide);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    // How far the Hero section has scrolled past the top of the viewport,
    // clamped 0→1. Updated via a ref (no setState) so scrolling never
    // triggers a React re-render — HeroScene reads this every WebGL frame.
    const onScroll = () => {
      const el = wrapRef.current?.closest("section") ?? wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = 1 - rect.bottom / (vh + rect.height);
      scrollProgress.current = Math.min(1, Math.max(0, raw));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);

  if (!enabled) return <StaticOrb />;

  return (
    <div ref={wrapRef} className="size-full">
      <Suspense fallback={<StaticOrb />}>
        <Scene scrollProgress={scrollProgress} />
      </Suspense>
    </div>
  );
}

export function StaticOrb() {
  return (
    <div className="relative grid aspect-square w-full place-items-center">
      <div
        className="float-slow absolute size-[62%] rounded-full opacity-70 blur-2xl"
        style={{ background: "var(--gradient-brand)" }}
      />
      <div className="glass relative size-[62%] rounded-full border-2 border-primary/30" />
      <div className="absolute size-[78%] animate-spin rounded-full border border-dashed border-accent/30 [animation-duration:26s]" />
      <div className="absolute size-[92%] animate-spin rounded-full border border-primary/20 [animation-duration:40s] [animation-direction:reverse]" />
    </div>
  );
}
