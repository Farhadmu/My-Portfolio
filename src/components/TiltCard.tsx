import { useRef, useState, type ReactNode } from "react";

/**
 * Lightweight 3D tilt wrapper — pointer driven, disabled on touch/coarse pointers.
 */
export function TiltCard({
  children,
  className = "",
  max = 9,
  scale = 1.02,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<string>("perspective(1100px)");
  const [glow, setGlow] = useState({ x: 50, y: 50, on: false });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setStyle(
      `perspective(1100px) rotateY(${(px - 0.5) * max * 2}deg) rotateX(${(0.5 - py) * max * 2}deg) scale(${scale})`,
    );
    setGlow({ x: px * 100, y: py * 100, on: true });
  };

  const reset = () => {
    setStyle("perspective(1100px)");
    setGlow((g) => ({ ...g, on: false }));
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ transform: style, transition: "transform .35s cubic-bezier(.22,1,.36,1)" }}
      className={`group relative will-change-transform ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(340px circle at ${glow.x}% ${glow.y}%, color-mix(in oklab, var(--cyan) 16%, transparent), transparent 70%)`,
          opacity: glow.on ? 1 : 0,
        }}
      />
      {children}
    </div>
  );
}
