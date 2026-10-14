import { useState, useRef, useCallback, useEffect } from "react";
import { MoveHorizontal, Sparkles } from "lucide-react";
import { sound } from "@/lib/sound";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "INITIAL WIREFRAME",
  afterLabel = "PRODUCTION SYSTEM",
  className = "",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMove = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleStop = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleStop);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleStop);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleStop);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleStop);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleStop]);

  return (
    <div
      ref={containerRef}
      onMouseDown={() => {
        sound.click();
        setIsDragging(true);
      }}
      onTouchStart={() => {
        sound.click();
        setIsDragging(true);
      }}
      className={`relative select-none overflow-hidden rounded-xl border-3 border-slate-900 dark:border-slate-700 bg-slate-950 shadow-[6px_6px_0px_#0f172a] dark:shadow-[6px_6px_0px_#000] cursor-ew-resize group aspect-[16/10] sm:aspect-[16/9] ${className}`}
    >
      {/* After Image (Full background) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 size-full object-cover"
        loading="lazy"
      />

      {/* Before Image (Clipped overlay) */}
      <div
        className="absolute inset-0 size-full overflow-hidden"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 size-full object-cover grayscale contrast-125"
          loading="lazy"
        />
        {/* Wireframe blueprint grid texture for authentic architectural feel */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"
        />
      </div>

      {/* Floating Labels */}
      <div className="absolute top-3 left-3 z-20 pointer-events-none">
        <span className="rounded bg-slate-950/85 px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider text-amber-300 border border-amber-500/40 shadow-xs backdrop-blur-xs">
          ← {beforeLabel}
        </span>
      </div>

      <div className="absolute top-3 right-3 z-20 pointer-events-none">
        <span className="rounded bg-slate-950/85 px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider text-emerald-400 border border-emerald-500/40 shadow-xs backdrop-blur-xs">
          {afterLabel} →
        </span>
      </div>

      {/* Slider Divider Line */}
      <div
        className="absolute top-0 bottom-0 z-30 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Draggable Knob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-9 rounded-full border-2 border-slate-900 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-[2px_2px_0px_#0f172a] flex items-center justify-center transition-transform group-hover:scale-110">
          <MoveHorizontal className="size-4" />
        </div>
      </div>

      {/* Bottom helper badge */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
        <span className="rounded-full bg-slate-950/75 px-3 py-0.5 text-[9px] font-mono text-slate-300 border border-slate-700/50">
          ↔ Drag slider left or right
        </span>
      </div>
    </div>
  );
}
