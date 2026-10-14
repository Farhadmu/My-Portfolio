import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Paintbrush, RotateCcw, Heart, Check, Terminal } from "lucide-react";
import { sound } from "@/lib/sound";

interface EasterEggDoodleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EasterEggDoodleModal({ isOpen, onClose }: EasterEggDoodleModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState("#1d4ed8"); // Biro blue
  const [hasDoodled, setHasDoodled] = useState(false);

  // Initialize canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 380;
    canvas.height = 220;

    // Draw graph paper grid background on doodle canvas
    ctx.fillStyle = "#fffdf7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(29, 78, 216, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Default friendly doodle text
    ctx.font = '16px "Caveat", cursive, sans-serif';
    ctx.fillStyle = "#64748b";
    ctx.fillText("✍️ Scribble anything on Farhad's desk...", 16, 32);
  }, [isOpen]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasDoodled(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    sound.click();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#fffdf7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(29, 78, 216, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    setHasDoodled(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.85, rotate: 2 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}
          className="relative w-full max-w-lg rounded-xl border-3 border-slate-900 bg-white dark:bg-slate-900 p-6 shadow-[8px_8px_0px_#0f172a] dark:shadow-[8px_8px_0px_#000] overflow-hidden"
        >
          {/* Top Tape Sticker */}
          <div
            aria-hidden
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-36 h-7 bg-[#fef08a] border border-amber-400 rotate-[-1deg] shadow-sm z-20 flex items-center justify-center"
          >
            <span className="font-mono text-[10px] font-bold text-slate-800 tracking-wider">
              ✦ SECRET DOODLE ✦
            </span>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => {
              sound.click();
              onClose();
            }}
            className="absolute top-4 right-4 grid size-8 place-items-center rounded-md border-2 border-slate-900 bg-card text-foreground shadow-[2px_2px_0px_#0f172a] hover:bg-rose-500 hover:text-white transition-colors"
          >
            <X className="size-4" />
          </button>

          {/* Header */}
          <div className="mt-2 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-slate-900 bg-emerald-100 dark:bg-emerald-950 px-3 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 shadow-[1px_1px_0px_#0f172a]">
              <Sparkles className="size-3 text-emerald-600" />
              <span>EASTER EGG UNLOCKED (5 CLICKS)</span>
            </div>
            <h2 className="mt-3 text-2xl font-extrabold text-foreground font-display">
              You Found Farhad's Secret Sketchbook! 🎨
            </h2>
            <p className="mt-1 text-xs text-muted-foreground font-mono">
              "Talk is cheap. Show me the code &amp; pass the coffee." — Linus Torvalds
            </p>
          </div>

          {/* Hand-Drawn Animated SVG Doodle (Coffee + Terminal) */}
          <div className="mt-4 flex items-center justify-center py-2">
            <svg
              className="w-48 h-20 overflow-visible"
              viewBox="0 0 200 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Coffee Cup */}
              <rect x="20" y="30" width="36" height="40" rx="4" stroke="currentColor" strokeWidth="2.5" className="text-foreground" />
              {/* Handle */}
              <path d="M56 38C62 38 65 42 65 48C65 54 62 58 56 58" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-foreground" />
              {/* Steam ripples */}
              <path d="M30 24C32 18 28 14 30 8" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
              <path d="M42 22C44 16 40 12 42 6" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />

              {/* Heart in cup */}
              <path d="M34 50C34 46 38 46 38 50C38 54 34 56 34 56C34 56 30 54 30 50C30 46 34 46 34 50Z" fill="#ef4444" />

              {/* Terminal Screen Doodle */}
              <rect x="80" y="16" width="105" height="56" rx="4" stroke="currentColor" strokeWidth="2.5" className="text-foreground" fill="#0f172a" />
              <circle cx="90" cy="24" r="2" fill="#ef4444" />
              <circle cx="96" cy="24" r="2" fill="#f59e0b" />
              <circle cx="102" cy="24" r="2" fill="#10b981" />

              {/* Code lines */}
              <path d="M88 36H120" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
              <path d="M88 44H165" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
              <path d="M88 52H145" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
              <path d="M88 60H110" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          {/* Interactive Doodle Canvas */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="font-hand text-base text-slate-800 dark:text-slate-200 font-bold">
                Draw a quick scribble on the desk:
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { color: "#1d4ed8", label: "Blue" },
                  { color: "#dc2626", label: "Red" },
                  { color: "#16a34a", label: "Green" },
                  { color: "#0f172a", label: "Ink" },
                ].map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => setPenColor(c.color)}
                    style={{ backgroundColor: c.color }}
                    className={`size-4 rounded-full border border-slate-900 transition-transform ${
                      penColor === c.color ? "scale-125 ring-2 ring-primary ring-offset-1" : "hover:scale-110"
                    }`}
                  />
                ))}
                <button
                  type="button"
                  onClick={clearCanvas}
                  title="Clear canvas"
                  className="ml-2 inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="size-3" /> Clear
                </button>
              </div>
            </div>

            <div className="relative rounded-lg border-2 border-slate-900 dark:border-slate-700 overflow-hidden shadow-inner">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full touch-none cursor-crosshair bg-[#fffdf7]"
              />
            </div>
          </div>

          {/* Footer note & Dismiss Button */}
          <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <p className="font-mono text-[10px] text-muted-foreground">
              ⚡ Handcrafted with React 19 + TanStack Start
            </p>
            <button
              type="button"
              onClick={() => {
                sound.pop();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border-2 border-slate-900 bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-[2px_2px_0px_#0f172a] hover:-translate-y-0.5 transition-all"
            >
              <Check className="size-3.5" />
              <span>Back to Workshop</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
