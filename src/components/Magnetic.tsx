import { useEffect, useRef, useState } from "react";

/** Magnetic button/link wrapper — subtle pull toward the cursor. */
export function Magnetic({
  children,
  strength = 0.28,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [t, setT] = useState("translate3d(0,0,0)");
  const [fine, setFine] = useState(false);

  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  return (
    <span
      ref={ref}
      className={`inline-block will-change-transform ${className}`}
      style={{ transform: t, transition: "transform .3s cubic-bezier(.22,1,.36,1)" }}
      onPointerMove={(e) => {
        if (!fine) return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setT(
          `translate3d(${(e.clientX - (r.left + r.width / 2)) * strength}px, ${
            (e.clientY - (r.top + r.height / 2)) * strength
          }px, 0)`,
        );
      }}
      onPointerLeave={() => setT("translate3d(0,0,0)")}
    >
      {children}
    </span>
  );
}
