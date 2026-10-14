import { useState } from "react";
import { profile } from "@/data/portfolio";
import { useHomeSectionsConfig, useProfileConfig } from "@/hooks/usePortfolioData";
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
    accent: "text-blue-700 border-blue-900 bg-blue-50",
    body: "Designing decoupled, modular software systems with strict API contracts (REST, tRPC), deterministic FSM state, and clean separation of concerns.",
    tags: ["Clean Architecture", "API Contracts", "FSM State"],
  },
  {
    num: "02",
    title: "Algorithmic Problem Solving (DSA)",
    icon: Binary,
    accent: "text-violet-700 border-violet-900 bg-violet-50",
    body: "Rigorous daily DSA in modern C++. Mastering Graph algorithms, Trees, Dynamic Programming, and asymptotic time & space complexity optimization.",
    tags: ["C++20", "Graph Theory", "Dynamic Programming", "O(log n)"],
  },
  {
    num: "03",
    title: "High-Performance Full-Stack Web",
    icon: Code2,
    accent: "text-emerald-700 border-emerald-900 bg-emerald-50",
    body: "Production Next.js App Router, React Server Components (RSC), low-latency streaming SSR, optimistic cache updates, and fluid 60fps micro-interactions.",
    tags: ["Next.js 15", "TypeScript", "React", "Zero-Shift UI"],
  },
  {
    num: "04",
    title: "Database & Data Engineering",
    icon: Database,
    accent: "text-amber-800 border-amber-900 bg-amber-50",
    body: "PostgreSQL relational schemas, indexing strategies, ACID transaction safety, and query profiling, alongside NoSQL and in-memory Redis caching layers.",
    tags: ["PostgreSQL", "Redis", "MongoDB", "ACID & Indexing"],
  },
  {
    num: "05",
    title: "Linux Systems & DevOps CI/CD",
    icon: Terminal,
    accent: "text-sky-700 border-sky-900 bg-sky-50",
    body: "Native Arch/Garuda Linux power user. Docker containerization, automated GitHub Actions pipelines, shell automation, and zero-downtime deployment.",
    tags: ["Arch/Garuda Linux", "Docker", "CI/CD", "Shell Automation"],
  },
  {
    num: "06",
    title: "AI Integration & Modern Tooling",
    icon: Sparkles,
    accent: "text-rose-700 border-rose-900 bg-rose-50",
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
  const profileConfig = useProfileConfig();
  const homeSections = useHomeSectionsConfig();
  const aboutData = homeSections.about;

  return (
    <Section id="about">
      <SectionHeading
        eyebrow="ABOUT ME & PHILOSOPHY"
        title={aboutData.title || "Who's Behind the Systems?"}
        desc={aboutData.desc || "Software Engineer specializing in scalable full-stack architectures, low-latency interfaces, and algorithmic problem solving."}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* Left Column: Workshop Notebook Sheet */}
        <div className="panel flex flex-col justify-between overflow-hidden rounded-lg border-2 border-slate-900 bg-white p-6 sm:p-7 shadow-[4px_4px_0px_#0f172a]">
          <div>
            {/* Document Header Bar */}
            <div className="mb-6 flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-rose-600 border border-slate-900" />
                <span className="size-2.5 rounded-full bg-amber-400 border border-slate-900" />
                <span className="size-2.5 rounded-full bg-emerald-600 border border-slate-900" />
                <span className="font-mono ml-2 text-[11px] font-bold text-slate-800">
                  farhad@garuda-swe:~/about_engineer.ts
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded border border-slate-900 bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 shadow-[1px_1px_0px_#0f172a]">
                <span className="size-1.5 rounded-full bg-emerald-600" />
                <span>ACTIVE SWE</span>
              </div>
            </div>

            {/* Engineer Profile Header */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              {/* Photo with clean offset frame */}
              <div className="relative size-28 shrink-0 overflow-hidden rounded-lg border-2 border-slate-900 bg-white p-1 shadow-[3px_3px_0px_#0f172a] sm:size-32">
                <img
                  src={profileConfig.avatar || profile.photo}
                  alt={profileConfig.name || profile.name}
                  className="size-full rounded object-cover"
                  loading="lazy"
                  width={256}
                  height={256}
                />
                <span className="font-mono absolute bottom-2 left-2 rounded border border-slate-900 bg-white px-2 py-0.5 text-[9px] font-bold text-slate-900 shadow-sm">
                  {profile.shortName}
                </span>
              </div>

              {/* Bio Details */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    {profileConfig.name || profile.name}
                  </h3>
                  <span className="rounded border border-slate-900 bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-slate-900 shadow-[1px_1px_0px_#0f172a]">
                    Software Engineer
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-primary">
                  {profileConfig.subRole || "Computer Science & Engineering · BAIUST"}
                </p>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {aboutData.bioText || profileConfig.bio ||
                    "Architecting resilient web systems, scalable backend pipelines, and low-latency user interfaces backed by rigorous computer science fundamentals."}
                </p>
              </div>
            </div>

            {/* Focus points & notes */}
            {aboutData.focusPoints && aboutData.focusPoints.length > 0 && (
              <div className="mt-5 space-y-1.5 border-t-2 border-dashed border-slate-300 pt-4">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-800">
                  // CURRENT ENGINEERING FOCUS
                </p>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {aboutData.focusPoints.map((pt, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-800 font-medium">
                      <span className="size-1.5 rounded-full bg-primary shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Tabs Switcher */}
            <div className="mt-6 border-t-2 border-slate-900 pt-5">
              <div className="flex items-center gap-1.5 rounded-lg border-2 border-slate-900 bg-[#f3ede2] p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("tenets")}
                  className={`flex-1 rounded py-1.5 text-xs font-bold transition-all ${
                    activeTab === "tenets"
                      ? "bg-primary text-white shadow-[1px_1px_0px_#0f172a]"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                >
                  ⚡ Core Tenets
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("telemetry")}
                  className={`flex-1 rounded py-1.5 text-xs font-bold transition-all ${
                    activeTab === "telemetry"
                      ? "bg-primary text-white shadow-[1px_1px_0px_#0f172a]"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                >
                  🐧 Linux Telemetry
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("metrics")}
                  className={`flex-1 rounded py-1.5 text-xs font-bold transition-all ${
                    activeTab === "metrics"
                      ? "bg-primary text-white shadow-[1px_1px_0px_#0f172a]"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                >
                  🏆 Key Milestones
                </button>
              </div>

              {/* Tab 1: Core Tenets */}
              {activeTab === "tenets" && (
                <div className="mt-4 grid gap-2.5">
                  {engineeringTenets.map((t, idx) => {
                    const TenetIcon = t.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-md border border-slate-300 bg-amber-50/50 p-2.5 shadow-sm"
                      >
                        <div className="grid size-7 shrink-0 place-items-center rounded border border-slate-900 bg-white text-primary shadow-[1px_1px_0px_#0f172a]">
                          <TenetIcon className="size-3.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{t.title}</h4>
                          <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                            {t.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: Linux Telemetry */}
              {activeTab === "telemetry" && (
                <div className="mt-4 rounded-md border-2 border-slate-900 bg-slate-900 p-3.5 font-mono text-[11px] leading-relaxed text-slate-200 shadow-[2px_2px_0px_#0f172a] overflow-x-auto">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-2 mb-2.5">
                    <span>SYSTEM ENVIRONMENT // DEV TELEMETRY</span>
                    <span className="text-emerald-400">● LIVE</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sky-300 font-bold">OS:</span>
                      <span>Garuda Linux x86_64 (Arch-based / Linux 6.x Zen)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-violet-300 font-bold">Shell:</span>
                      <span>Zsh + Starship Prompt (Fast &amp; minimal)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-300 font-bold">Editor:</span>
                      <span>Neovim (Lua config) &amp; VS Code with Vim Mode</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-300 font-bold">Languages:</span>
                      <span>C++20, TypeScript, JavaScript, Go, SQL, Python</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sky-300 font-bold">Full-Stack:</span>
                      <span>React 19, Next.js 15, Node.js, Express, TailwindCSS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-rose-300 font-bold">Databases:</span>
                      <span>PostgreSQL, Redis (In-Memory), MongoDB, Firebase</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-pink-300 font-bold">DevOps:</span>
                      <span>Docker, GitHub Actions CI/CD, Nginx, systemd</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Milestones & Metrics */}
              {activeTab === "metrics" && (
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <div className="rounded-md border-2 border-slate-900 bg-blue-50 p-3 shadow-[2px_2px_0px_#0f172a]">
                    <div className="text-xl font-extrabold text-blue-800">6th Rank</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">SUST CSE Carnival '26</div>
                    <div className="text-[10px] text-slate-600 mt-1">Inter-University Competitive Event</div>
                  </div>
                  <div className="rounded-md border-2 border-slate-900 bg-violet-50 p-3 shadow-[2px_2px_0px_#0f172a]">
                    <div className="text-xl font-extrabold text-violet-800">500+</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">DSA Problems Solved</div>
                    <div className="text-[10px] text-slate-600 mt-1">C++ &amp; Advanced Algorithms</div>
                  </div>
                  <div className="rounded-md border-2 border-slate-900 bg-emerald-50 p-3 shadow-[2px_2px_0px_#0f172a]">
                    <div className="text-xl font-extrabold text-emerald-800">10+</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">Production Projects</div>
                    <div className="text-[10px] text-slate-600 mt-1">Full-Stack Shipped Applications</div>
                  </div>
                  <div className="rounded-md border-2 border-slate-900 bg-amber-50 p-3 shadow-[2px_2px_0px_#0f172a]">
                    <div className="text-xl font-extrabold text-amber-800">Top 300</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">Programming Hero Track</div>
                    <div className="text-[10px] text-slate-600 mt-1">Elite Engineering Cohort</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Skill & Tech Tags */}
          <div className="mt-6 flex flex-wrap gap-2 border-t-2 border-slate-900 pt-4">
            {[
              "⚡ Systems Architecture",
              "🧩 Competitive Programming",
              "🐧 Garuda Linux",
              "🛡️ Type-Safe Contracts",
              "🌐 Full-Stack Engineering",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded border border-slate-900 bg-[#f4efe6] px-2.5 py-1 text-xs font-bold text-slate-800 shadow-[1px_1px_0px_#0f172a]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: 6 Engineering Pillars Bento Grid */}
        <div className="grid gap-3.5 sm:grid-cols-2">
          {engineeringPillars.map((pillar) => {
            const PillarIcon = pillar.icon;
            return (
              <TiltCard key={pillar.num} className="h-full">
                <article className="panel flex h-full flex-col justify-between rounded-lg border-2 border-slate-900 bg-white p-4 sm:p-5 shadow-[3px_3px_0px_#0f172a] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0f172a]">
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <span className={`grid size-9 place-items-center rounded border-2 border-slate-900 ${pillar.accent} shadow-[1px_1px_0px_#0f172a]`}>
                        <PillarIcon className="size-4" />
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-500">
                        0{pillar.num}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
                      {pillar.title}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-slate-600 font-medium">
                      {pillar.body}
                    </p>
                  </div>

                  <div className="mt-3.5 flex flex-wrap gap-1.5 border-t border-slate-200 pt-2.5">
                    {pillar.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-slate-300 bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold text-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
