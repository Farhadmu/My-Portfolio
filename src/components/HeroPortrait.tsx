import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import laptopImg from "@/assets/farhad-laptop.png";
import hackathonTeamImg from "@/assets/farhad-hackathon-team.jpg";
import { sound } from "@/lib/sound";
import { Terminal, Code, Pause, Play, Sparkles } from "lucide-react";

interface HeroPortraitProps {
  initialPhoto: string;
  name?: string;
}

const SNIPPETS = [
  "const farhad = new Engineer();",
  "import { ship } from '@farhad/craft';",
  "function optimize(ux: Experience) {",
  "  return ux.elevate({ fast: true });",
  "}",
  "01000110 01000001 01010010 01001000",
  "01000001 01000100 00100000 01010101",
  "await deploy({ production: true });",
  "git commit -m 'feat: ship clean craft';",
  "sys.kernel.render(<FarhadAtWork />);",
  "0x7F 0x45 0x4C 0x46 0x02 0x01 0x01",
  "stack: ['React', 'Next.js', 'TypeScript'];",
  "while (building) { learn(); ship(); }",
];

const CODE_CHARS = "010101010101ABCDEF0123456789<>{}/=+-*&|!~@#$%^;:?_";

const PHOTOS = [
  {
    id: 0,
    tag: "PORTRAIT // 01",
    subtag: "FOUNDER & BUILDER",
    caption: "Farhad @ work — 2026 ✦",
    note: '"Building digital products with clean engineering, real deployments & measurable craft."',
    category: "// dev notes",
    focus: "object-top",
  },
  {
    id: 1,
    tag: "IN THE LAB // 02",
    subtag: "ACTIVE CODING SESSION",
    caption: "Farhad @ Terminal // Building Products ⚡",
    note: '"At the terminal — converting complex requirements into robust, high-performance code."',
    category: "// live terminal",
    focus: "object-[center_25%]",
  },
  {
    id: 2,
    tag: "HACKATHON // 03",
    subtag: "TEAM DEEP WORK & PAIR CODING",
    caption: "Farhad & Team @ 24h Hackathon 🏆",
    note: '"In the arena — intense collaboration, high-velocity sprints & solving hard algorithmic challenges together."',
    category: "// war room",
    focus: "object-center",
  },
];

export function HeroPortrait({ initialPhoto, name = "Md. Farhadul Islam" }: HeroPortraitProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrambledCaption, setScrambledCaption] = useState(PHOTOS[0].caption);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Photos array (3 rotating perspectives)
  const photos = [
    { ...PHOTOS[0], src: initialPhoto },
    { ...PHOTOS[1], src: laptopImg || "/farhad-laptop.png" },
    { ...PHOTOS[2], src: hackathonTeamImg || "/farhad-hackathon-team.jpg" },
  ];

  // Scramble text effect for caption
  const scrambleTo = useCallback((targetText: string) => {
    let iteration = 0;
    const maxIterations = 14;
    const interval = setInterval(() => {
      setScrambledCaption(
        targetText
          .split("")
          .map((char, index) => {
            if (char === " " || char === "—" || char === "✦" || char === "⚡" || char === "/") {
              return char;
            }
            if (index < (iteration / maxIterations) * targetText.length) {
              return targetText[index];
            }
            return CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
          })
          .join("")
      );

      iteration += 1;
      if (iteration > maxIterations) {
        clearInterval(interval);
        setScrambledCaption(targetText);
      }
    }, 40);
  }, []);

  // Trigger code transition to a specific or next photo
  const triggerTransition = useCallback(
    (targetIndex?: number) => {
      if (isTransitioning) return;
      const nextIdx = targetIndex !== undefined ? targetIndex : (activeIndex + 1) % photos.length;
      if (nextIdx === activeIndex) return;

      setIsTransitioning(true);
      sound.click();

      // Start caption scramble
      scrambleTo(photos[nextIdx].caption);

      // At 550ms (peak code density), switch the image under the code rain
      setTimeout(() => {
        setActiveIndex(nextIdx);
        setProgress(0);
      }, 550);

      // End transition at 1200ms
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1250);
    },
    [activeIndex, isTransitioning, photos, scrambleTo]
  );

  // Matrix Code Canvas Animation during transition
  useEffect(() => {
    if (!isTransitioning) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 380);

    const fontSize = 13;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(0).map(() => Math.floor(Math.random() * -20));

    let frame = 0;

    const renderMatrix = () => {
      // Semi-transparent black wash for trailing fade
      ctx.fillStyle = "rgba(10, 15, 29, 0.22)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head of the drop is bright white/cyan, body is emerald/green
        if (Math.random() > 0.88) {
          ctx.fillStyle = "#67e8f9"; // cyan head
          ctx.shadowColor = "#06b6d4";
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = "#10b981"; // emerald body
          ctx.shadowColor = "#059669";
          ctx.shadowBlur = 4;
        }

        ctx.fillText(char, x, y);
        ctx.shadowBlur = 0;

        // Reset drop
        if (y > height && Math.random() > 0.96) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      // Draw random code snippet in center for cinematic cyber decode
      if (frame > 10 && frame < 55) {
        ctx.fillStyle = "rgba(2, 6, 23, 0.75)";
        ctx.fillRect(16, height / 2 - 32, width - 32, 64);
        ctx.strokeStyle = "#06b6d4";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(16, height / 2 - 32, width - 32, 64);

        ctx.fillStyle = "#38bdf8";
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.fillText("> KERNEL::CONTEXT_SWITCH()", 26, height / 2 - 12);
        ctx.fillStyle = "#a7f3d0";
        ctx.font = '11px "JetBrains Mono", monospace';
        const snippet = SNIPPETS[(frame + activeIndex) % SNIPPETS.length];
        ctx.fillText(snippet.slice(0, 28), 26, height / 2 + 10);
      }

      frame++;
      animationFrameRef.current = requestAnimationFrame(renderMatrix);
    };

    animationFrameRef.current = requestAnimationFrame(renderMatrix);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isTransitioning, activeIndex]);

  // 10-Second Automatic Interval Timer
  useEffect(() => {
    if (isPaused) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const stepMs = 100;
    const totalMs = 10000; // 10 seconds per user requirement

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (stepMs / totalMs) * 100;
        if (next >= 100) {
          triggerTransition();
          return 0;
        }
        return next;
      });
    }, stepMs);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPaused, triggerTransition]);

  return (
    <div
      className="relative mx-auto flex flex-col items-center justify-center pt-4 sm:pt-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Polaroid Frame */}
      <div className="relative rotate-[-2deg] transition-transform duration-300 hover:rotate-0">
        {/* Masking tape on top */}
        <div
          aria-hidden
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-amber-200/90 dark:bg-amber-400/30 border border-amber-400/80 rotate-[1deg] shadow-sm z-30 pointer-events-none"
        />

        <div className="polaroid w-64 sm:w-76 relative bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 shadow-[6px_6px_0px_#0f172a] dark:shadow-[6px_6px_0px_#000] rounded-sm p-3 pb-4">
          {/* Top HUD bar over image inside polaroid */}
          <div className="mb-2 flex items-center justify-between text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 px-0.5">
            <div className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="tracking-wider">{photos[activeIndex].tag}</span>
            </div>
            <div className="inline-flex items-center gap-1 text-[9px] text-muted-foreground">
              {isPaused ? (
                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                  <Pause className="size-2.5" /> PAUSED
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Terminal className="size-2.5 text-primary" /> 10s LOOP
                </span>
              )}
            </div>
          </div>

          {/* Main Photo Container */}
          <div className="relative aspect-[4/5] overflow-hidden rounded border-2 border-slate-900 dark:border-slate-700 bg-slate-950 group">
            {/* Active Image */}
            <img
              src={photos[activeIndex].src}
              alt={`${name} - ${photos[activeIndex].tag}`}
              className={`size-full object-cover ${photos[activeIndex].focus} transition-all duration-700 ${
                isTransitioning ? "scale-105 brightness-90 filter blur-[0.5px]" : "scale-100 brightness-100"
              }`}
              width={600}
              height={750}
              loading="eager"
              decoding="async"
            />

            {/* CRT Scanline Overlay (always subtle, intensifies during transition) */}
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 ${
                isTransitioning
                  ? "opacity-90 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.35)_0px,rgba(0,0,0,0.35)_1px,transparent_1px,transparent_3px)]"
                  : "opacity-25 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15)_0px,rgba(0,0,0,0.15)_1px,transparent_1px,transparent_4px)]"
              }`}
            />

            {/* Laser Scan Beam that sweeps during transition */}
            {isTransitioning && (
              <motion.div
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
                className="pointer-events-none absolute left-0 right-0 h-8 z-20 bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent shadow-[0_0_15px_#22d3ee]"
              />
            )}

            {/* Glitch Slices Layer during transition */}
            {isTransitioning && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-20 mix-blend-screen opacity-70 animate-pulse"
                style={{
                  backgroundImage: `url(${photos[(activeIndex + 1) % photos.length].src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  clipPath: "polygon(0 20%, 100% 20%, 100% 38%, 0 38%, 0 65%, 100% 65%, 100% 75%, 0 75%)",
                  transform: "translateX(4px)",
                  filter: "hue-rotate(90deg) contrast(150%)",
                }}
              />
            )}

            {/* Matrix Code Canvas (Fades in dynamically during code transition) */}
            <AnimatePresence>
              {isTransitioning && (
                <motion.canvas
                  ref={canvasRef}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.95 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="pointer-events-none absolute inset-0 z-20 size-full"
                />
              )}
            </AnimatePresence>

            {/* Digital HUD Status Pill at top-left inside photo */}
            <div className="absolute top-2 left-2 z-20 pointer-events-none">
              <span className="inline-flex items-center gap-1 rounded bg-slate-950/80 backdrop-blur-xs px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-400 border border-emerald-500/40 shadow-xs">
                <Code className="size-2.5 text-cyan-400" />
                {isTransitioning ? "TRANSMITTING..." : "BUFFER::ONLINE"}
              </span>
            </div>

            {/* Manual Switch Trigger on hover / tap */}
            <button
              type="button"
              onClick={() => triggerTransition()}
              title="Click to transition now"
              className="absolute top-2 right-2 z-20 inline-flex items-center gap-1 rounded bg-slate-900/85 hover:bg-primary text-white px-2 py-1 text-[10px] font-mono font-bold border border-slate-700 shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="size-2.5 text-yellow-300" />
              <span>SWAP</span>
            </button>

            {/* 10-Second Progress Indicator Bar along bottom edge */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900/60 z-20 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-primary transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Polaroid Caption with Scramble Decoder effect */}
          <div className="mt-3 text-center">
            <p className="font-hand text-lg sm:text-xl text-slate-800 dark:text-slate-100 font-bold min-h-[1.75rem] flex items-center justify-center transition-colors">
              {scrambledCaption}
            </p>
          </div>

          {/* Bottom Switcher Controls */}
          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              {photos.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => triggerTransition(idx)}
                  className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded transition-all ${
                    activeIndex === idx
                      ? "bg-primary text-primary-foreground border border-slate-900 dark:border-slate-600 shadow-[1px_1px_0px_#0f172a]"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent"
                  }`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>

            <span className="font-mono text-[9px] text-slate-500 dark:text-slate-400 font-semibold tracking-wide">
              {isTransitioning ? "DECODING CODE..." : "AUTO 10S"}
            </span>
          </div>
        </div>
      </div>

      {/* Pinned Sticky Note Annotation */}
      <div className="relative -mt-6 sm:-mt-8 ml-auto mr-4 w-56 sm:w-64 rotate-[3deg] rounded-md border-2 border-slate-900 dark:border-slate-600 bg-[#fef9c3] dark:bg-[#34301d] p-3.5 shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] z-20 transition-transform duration-200 hover:rotate-1">
        {/* Cute pin dot */}
        <div
          aria-hidden
          className="absolute -top-2 left-4 size-4 rounded-full bg-rose-600 border border-slate-900 shadow-sm"
        />
        <p className="font-hand text-base sm:text-lg leading-snug text-slate-900 dark:text-amber-100 font-semibold">
          {photos[activeIndex].note}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-mono text-[9px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
            {photos[activeIndex].category}
          </span>
          <span className="font-mono text-[9px] text-slate-500 dark:text-amber-200/70 font-semibold">
            {photos[activeIndex].subtag}
          </span>
        </div>
      </div>
    </div>
  );
}
