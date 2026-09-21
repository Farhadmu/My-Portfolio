import { useState } from "react";
import { profile } from "@/data/portfolio";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";
import {
  Terminal,
  Layers,
  Database,
  Code2,
  Sparkles,
  Binary,
  ShieldCheck,
  Zap,
  Boxes,
} from "lucide-react";

// 6 Core Software Engineering Pillars
const engineeringPillars = [
  {
    num: "01",
    title: "Software Architecture & Systems",
    icon: Layers,
    accent: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10",
    glow: "group-hover:border-cyan-500/40",
    body: "Designing decoupled, modular software systems with strict API contracts (REST, tRPC), deterministic FSM state, and clean separation of concerns.",
    tags: ["Clean Architecture", "API Contracts", "FSM State"],
  },
  {
    num: "02",
    title: "Algorithmic Problem Solving (DSA)",
    icon: Binary,
    accent: "text-violet-400 border-violet-500/20 bg-violet-500/10",
    glow: "group-hover:border-violet-500/40",
    body: "Rigorous daily DSA in modern C++. Mastering Graph algorithms, Trees, Dynamic Programming, and asymptotic time & space complexity optimization.",
    tags: ["C++20", "Graph Theory", "Dynamic Programming", "O(log n)"],
  },
  {
    num: "03",
    title: "High-Performance Full-Stack Web",
    icon: Code2,
    accent: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
    glow: "group-hover:border-emerald-500/40",
    body: "Production Next.js App Router, React Server Components (RSC), low-latency streaming SSR, optimistic cache updates, and fluid 60fps micro-interactions.",
    tags: ["Next.js 15", "TypeScript", "React", "Zero-Shift UI"],
  },
  {
    num: "04",
    title: "Database & Data Engineering",
    icon: Database,
    accent: "text-amber-400 border-amber-500/20 bg-amber-500/10",
    glow: "group-hover:border-amber-500/40",
    body: "PostgreSQL relational schemas, indexing strategies, ACID transaction safety, and query profiling, alongside NoSQL and in-memory Redis caching layers.",
    tags: ["PostgreSQL", "Redis", "MongoDB", "ACID & Indexing"],
  },
  {
    num: "05",
    title: "Linux Systems & DevOps CI/CD",
    icon: Terminal,
    accent: "text-sky-400 border-sky-500/20 bg-sky-500/10",
    glow: "group-hover:border-sky-500/40",
    body: "Native Arch/Garuda Linux power user. Docker containerization, automated GitHub Actions pipelines, shell automation, and zero-downtime deployment.",
    tags: ["Arch/Garuda Linux", "Docker", "CI/CD", "Shell Automation"],
  },
  {
    num: "06",
    title: "AI Integration & Modern Tooling",
    icon: Sparkles,
    accent: "text-pink-400 border-pink-500/20 bg-pink-500/10",
    glow: "group-hover:border-pink-500/40",
    body: "Integrating LLM APIs, semantic search with vector embeddings, AI-assisted engineering workflows, and building intelligent, real-world product features.",
    tags: ["LLM Orchestration", "Vector Embeddings", "AI Tooling"],
  },
];

const engineeringTenets = [
  {
    icon: Zap,
    title: "Algorithmic Rigor & Efficiency",
    desc: "Optimizing time & space complexity ($O(1)$ / $O(\\log n)$). Active competitive programmer with 500+ challenges solved in C++.",
  },
  {
    icon: ShieldCheck,
    title: "End-to-End Type Safety & Contracts",
    desc: "Strict schemas with TypeScript & Zod. Eliminating runtime failure points and undefined states before code touches staging.",
  },
  {
    icon: Boxes,
    title: "Deterministic State & Modular Architecture",
    desc: "Clear separation between domain logic, data fetching, and presentation. State machines that prevent illegal UI states.",
  },
  {
    icon: Terminal,
    title: "Linux-First & Systems Mindset",
    desc: "Daily driving Garuda/Arch Linux. Deep appreciation for system calls, threads, memory footprint, and network socket I/O.",
  },
];

export function About() {
  const [activeTab, setActiveTab] = useState<"tenets" | "telemetry" | "metrics">("tenets");

  return (
    <Section id="about">
      <SectionHeading
        eyebrow="ENGINEERING PHILOSOPHY & CRAFT"
        title="Who's Behind the Systems?"
        desc="Software Engineer specializing in scalable full-stack architectures, low-latency interfaces, and algorithmic problem solving."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* Left Column: The Software Engineer Profile Bento */}
        <Reveal className="panel overflow-hidden border-border/80 bg-card/75 p-6 sm:p-8 backdrop-blur-md shadow-2xl flex flex-col justify-between transition-all">
          <div>
            {/* Terminal Window Header Bar */}
            <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-rose-500/80" />
                <span className="size-2.5 rounded-full bg-amber-500/80" />
                <span className="size-2.5 rounded-full bg-emerald-500/80" />
                <span className="mono ml-2 text-[11px] text-muted-foreground/80">
                  farhad@garuda-swe:~/about_engineer.ts
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                <span>ACTIVE SWE</span>
              </div>
            </div>

            {/* Engineer Profile Header */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              {/* Photo with holographic ring */}
              <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl border-2 border-primary/40 p-1 shadow-lg shadow-primary/10 sm:size-32">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="size-full rounded-xl object-cover"
                  loading="lazy"
                  width={256}
                  height={256}
                />
                <span className="mono absolute bottom-2 left-2 rounded-md bg-background/90 px-2 py-0.5 text-[9px] font-semibold text-primary border border-primary/30 backdrop-blur-sm">
                  {profile.shortName}
                </span>
              </div>

              {/* Bio Details */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                    {profile.name}
                  </h3>
                  <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    Software Engineer
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-primary/90">
                  Computer Science &amp; Engineering · <span className="text-foreground">BAIUST</span>
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Architecting resilient web systems, scalable backend pipelines, and low-latency user
                  interfaces backed by rigorous computer science fundamentals.
                </p>
              </div>
            </div>

            {/* Engineering Narrative */}
            <div className="mt-5 space-y-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground border-t border-border/40 pt-4">
              <p>
                My engineering approach is grounded in core CS fundamentals: understanding memory,
                concurrency, algorithmic complexity, and OS abstractions—then projecting those
                principles into production web systems and clean API contracts.
              </p>
              <p>
                Whether decomposing complex graph algorithms in <strong className="text-foreground">C++</strong>,
                architecting typed <strong className="text-foreground">Next.js</strong> full-stack applications, or tuning relational
                schemas in <strong className="text-foreground">PostgreSQL</strong>, I build software that survives production and delivers measurable impact.
              </p>
            </div>

            {/* Interactive Engineering Tabs Switcher */}
            <div className="mt-6 border-t border-border/50 pt-5">
              <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-secondary/50 p-1">
                <button
                  onClick={() => setActiveTab("tenets")}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                    activeTab === "tenets"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ⚡ Core Tenets
                </button>
                <button
                  onClick={() => setActiveTab("telemetry")}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                    activeTab === "telemetry"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  🐧 Linux Telemetry
                </button>
                <button
                  onClick={() => setActiveTab("metrics")}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                    activeTab === "metrics"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  🏆 Key Milestones
                </button>
              </div>

              {/* Tab 1: Core Tenets */}
              {activeTab === "tenets" && (
                <div className="mt-4 grid gap-2.5 animate-in fade-in duration-200">
                  {engineeringTenets.map((t, idx) => {
                    const TenetIcon = t.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-xl border border-border/50 bg-secondary/30 p-2.5 transition-colors hover:border-primary/30"
                      >
                        <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <TenetIcon className="size-3.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-foreground">{t.title}</h4>
                          <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                            {t.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: Linux Telemetry (Neofetch style) */}
              {activeTab === "telemetry" && (
                <div className="mt-4 rounded-xl border border-border/70 bg-zinc-950/90 p-3.5 font-mono text-[11px] leading-relaxed text-zinc-300 shadow-inner animate-in fade-in duration-200 overflow-x-auto">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-zinc-800 pb-2 mb-2.5">
                    <span>SYSTEM ENVIRONMENT // DEV TELEMETRY</span>
                    <span className="text-emerald-400">● LIVE</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400">OS:</span>
                      <span>Garuda Linux x86_64 (Arch-based / Linux 6.x Zen)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-violet-400">Shell:</span>
                      <span>Zsh + Starship Prompt (Fast &amp; minimal)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">Editor:</span>
                      <span>Neovim (Lua config) &amp; VS Code with Vim Mode</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400">Languages:</span>
                      <span>C++20, TypeScript, JavaScript, Go, SQL, Python</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sky-400">Full-Stack:</span>
                      <span>React 19, Next.js 15, Node.js, Express, TailwindCSS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-rose-400">Databases:</span>
                      <span>PostgreSQL, Redis (In-Memory), MongoDB, Firebase</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-pink-400">DevOps:</span>
                      <span>Docker, GitHub Actions CI/CD, Nginx, systemd</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Milestones & Metrics */}
              {activeTab === "metrics" && (
                <div className="mt-4 grid grid-cols-2 gap-2.5 animate-in fade-in duration-200">
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
                    <div className="text-xl font-bold text-primary">6th Rank</div>
                    <div className="text-xs font-semibold text-foreground mt-0.5">SUST CSE Carnival '26</div>
                    <div className="text-[10px] text-muted-foreground mt-1">Inter-University Competitive Event</div>
                  </div>
                  <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-3">
                    <div className="text-xl font-bold text-violet-400">500+</div>
                    <div className="text-xs font-semibold text-foreground mt-0.5">DSA Problems Solved</div>
                    <div className="text-[10px] text-muted-foreground mt-1">C++ &amp; Advanced Algorithms</div>
                  </div>
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
                    <div className="text-xl font-bold text-emerald-400">10+</div>
                    <div className="text-xs font-semibold text-foreground mt-0.5">Production Projects</div>
                    <div className="text-[10px] text-muted-foreground mt-1">Full-Stack Shipped Applications</div>
                  </div>
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
                    <div className="text-xl font-bold text-amber-400">Top 300</div>
                    <div className="text-xs font-semibold text-foreground mt-0.5">Programming Hero Track</div>
                    <div className="text-[10px] text-muted-foreground mt-1">Elite Engineering Cohort</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Skill & Tech Tags */}
          <div className="mt-6 flex flex-wrap gap-2 border-t border-border/40 pt-4">
            {[
              "⚡ Systems Architecture",
              "🧩 Competitive Programming",
              "🐧 Garuda Linux",
              "🛡️ Type-Safe Contracts",
              "🌐 Full-Stack Engineering",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-border/60 bg-secondary/50 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Right Column: 6 Engineering Pillars Bento Grid */}
        <div className="grid gap-3.5 sm:grid-cols-2">
          {engineeringPillars.map((pillar, i) => {
            const PillarIcon = pillar.icon;
            return (
              <Reveal key={pillar.num} delay={i * 0.05}>
                <TiltCard className="h-full">
                  <article
                    className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/75 p-4 sm:p-5 backdrop-blur-sm transition-all duration-300 hover:bg-card/95 hover:shadow-xl ${pillar.glow}`}
                  >
                    {/* Top row: Number and Icon */}
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <span className={`grid size-9 place-items-center rounded-xl border ${pillar.accent} transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
                          <PillarIcon className="size-4" />
                        </span>
                        <span className="mono text-xs font-bold text-muted-foreground/60 group-hover:text-primary transition-colors">
                          {pillar.num}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {pillar.title}
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {pillar.body}
                      </p>
                    </div>

                    {/* Tech Pills at bottom */}
                    <div className="mt-3.5 flex flex-wrap gap-1.5 border-t border-border/40 pt-2.5">
                      {pillar.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-secondary/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
