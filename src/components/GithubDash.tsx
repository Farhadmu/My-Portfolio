import { useState } from "react";
import { githubStats, languageBars, profile } from "@/data/portfolio";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { Icon } from "./Icon";
import { GithubIcon } from "./BrandIcons";
import { Flame, GitCommit, GitPullRequest, GitBranch, Terminal, ExternalLink, Activity } from "lucide-react";

const accent: Record<string, string> = {
  cyan: "var(--cyan)",
  violet: "var(--violet)",
  lime: "var(--lime)",
  amber: "var(--amber)",
  pink: "var(--pink)",
};

const terminalTabs = {
  git: [
    { p: "farhad@garuda", c: "~/dev/portfolio", cmd: "git log -n 4 --pretty=format:'%h %s (%cr)'" },
    { out: "6e2f1a8 feat(architecture): uniform project cards & category matrix (2h ago)" },
    { out: "b49a03c perf(frontend): zero-layout-shift r3f lazy loader (yesterday)" },
    { out: "87c14de feat(auth): httpOnly cookies session sync across edge middleware (3d ago)" },
    { out: "90da512 chore(ci): automated vitest & bundle size analyzer pipeline (5d ago)" },
    { p: "farhad@garuda", c: "~/dev/portfolio", cmd: "git status" },
    { ok: "On branch main · Your branch is up to date with 'origin/main'. Nothing to commit, working tree clean." },
  ],
  docker: [
    { p: "farhad@garuda", c: "~/dev", cmd: "docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'" },
    { out: "fixitnow-api         Up 4 days (healthy)     0.0.0.0:5000->5000/tcp" },
    { out: "drivefleet-engine    Up 6 days (healthy)     0.0.0.0:8000->8000/tcp" },
    { out: "redis-cache-layer    Up 12 days (healthy)    0.0.0.0:6379->6379/tcp" },
    { out: "postgres-cluster     Up 12 days (healthy)    0.0.0.0:5432->5432/tcp" },
    { ok: "✓ All container clusters healthy and operating within latency SLAs." },
  ],
  benchmarks: [
    { p: "farhad@garuda", c: "~/benchmarks", cmd: "./benchmark_dsa.sh --target=c++20" },
    { out: "[INFO] Compiling graph_dijkstra.cpp with -O3 -std=c++20..." },
    { out: "[TEST 1] 100,000 Nodes Sparse Graph: 14.2ms | 0 Mem Leaks" },
    { out: "[TEST 2] Segment Tree Range Updates:  4.1ms | O(log N) verified" },
    { out: "[TEST 3] DP State Transitions:       2.8ms | Space O(N)" },
    { ok: "✓ 100% tests passed. Time complexity strictly within competitive limits." },
  ],
};

export function GithubDash() {
  const [activeTab, setActiveTab] = useState<"git" | "docker" | "benchmarks">("git");

  return (
    <Section id="github">
      <SectionHeading
        eyebrow="ENGINEERING TELEMETRY & METRICS"
        title="Git Rhythm & System Logs"
        desc="A transparent look at code velocity, daily commit streak, language spectrum, and local developer telemetry."
      />

      {/* Flame Streak Banner */}
      <Reveal className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-card to-amber-500/5 px-6 py-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl border border-amber-500/30 bg-amber-500/20 text-amber-400 shadow-sm animate-pulse">
            <Flame className="size-5 fill-amber-400" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-foreground">
                {githubStats.find((s) => s.label === "Longest Streak")?.value ?? "38+ Days"} Streak
              </span>
              <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                ACTIVE VELOCITY
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Consistent daily commits across production repos, system tooling, and competitive problem solving.
            </p>
          </div>
        </div>

        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/80 px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary hover:border-primary/50 transition-all shadow-sm"
        >
          <GithubIcon className="size-4" />
          <span>Follow @{profile.githubUser}</span>
          <ExternalLink className="size-3 text-muted-foreground" />
        </a>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.15fr]">
        {/* Left Column: Metrics, Languages, and Heatmap */}
        <div className="space-y-4">
          {/* Quick Metrics Grid */}
          <Reveal className="grid grid-cols-2 gap-3 sm:gap-4">
            {githubStats.map((s) => (
              <div
                key={s.label}
                className="panel relative overflow-hidden rounded-2xl border border-border/80 bg-card/75 p-4 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card/95"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon name={s.icon} className="size-4 text-primary" />
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                </div>
                <p className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                  {s.value}
                </p>
                <p className="mono mt-1 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  {s.label}
                </p>
              </div>
            ))}
          </Reveal>

          {/* Language Breakdown */}
          <Reveal delay={0.06} className="panel rounded-2xl border border-border/80 bg-card/75 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="mono text-[11px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
                Language Spectrum
              </h3>
              <span className="mono text-[10px] text-primary">By Commit Volume</span>
            </div>
            <div className="space-y-3">
              {languageBars.map((l) => (
                <div key={l.name}>
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="font-medium text-foreground">{l.name}</span>
                    <span className="mono font-semibold text-muted-foreground">{l.pct}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary/80">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${l.pct}%`, background: accent[l.accent] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Contribution Heatmap */}
          <Reveal delay={0.1} className="panel rounded-2xl border border-border/80 bg-card/75 p-5 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="mono text-[11px] uppercase tracking-[0.2em] font-bold text-muted-foreground flex items-center gap-1.5">
                <Activity className="size-3.5 text-primary" /> Commit Activity Grid
              </h3>
              <span className="mono text-[10px] text-muted-foreground">Past 26 Weeks</span>
            </div>
            <Heatmap />
            <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/40 pt-2.5">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <span className="size-2 rounded-sm bg-secondary" />
                <span className="size-2 rounded-sm bg-cyan-950" />
                <span className="size-2 rounded-sm bg-cyan-700" />
                <span className="size-2 rounded-sm bg-cyan-400" />
              </div>
              <span>More Active</span>
            </div>
          </Reveal>
        </div>

        {/* Right Column: Live Terminal Environment with Interactive Tabs */}
        <Reveal delay={0.08} className="panel flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-zinc-950/95 shadow-2xl backdrop-blur-md">
          {/* Terminal Window Top Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-rose-500/80" />
              <span className="size-2.5 rounded-full bg-amber-500/80" />
              <span className="size-2.5 rounded-full bg-emerald-500/80" />
              <span className="mono ml-2 text-[11px] text-zinc-400">
                farhad@garuda-linux: ~/dev
              </span>
            </div>

            {/* Interactive Command Tabs */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("git")}
                className={`mono rounded-md px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                  activeTab === "git" ? "bg-primary text-primary-foreground" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                git log
              </button>
              <button
                onClick={() => setActiveTab("docker")}
                className={`mono rounded-md px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                  activeTab === "docker" ? "bg-primary text-primary-foreground" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                docker ps
              </button>
              <button
                onClick={() => setActiveTab("benchmarks")}
                className={`mono rounded-md px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                  activeTab === "benchmarks" ? "bg-primary text-primary-foreground" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                benchmarks
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="mono flex-1 space-y-2.5 p-5 text-xs leading-relaxed text-zinc-300 overflow-y-auto">
            {terminalTabs[activeTab].map((l, i) => (
              <div key={i} className="animate-in fade-in duration-150">
                {l.cmd && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-emerald-400 font-bold">{l.p}</span>
                    <span className="text-zinc-500">:</span>
                    <span className="text-cyan-400">{l.c}</span>
                    <span className="text-zinc-500">$</span>
                    <span className="text-white font-medium">{l.cmd}</span>
                  </div>
                )}
                {l.out && <p className="text-zinc-400 pl-4">{l.out}</p>}
                {l.ok && (
                  <p className="text-emerald-400 pl-4 bg-emerald-500/10 border-l-2 border-emerald-400 py-1 my-1 rounded-r">
                    {l.ok}
                  </p>
                )}
              </div>
            ))}

            {/* Prompt Cursor */}
            <div className="flex items-center gap-1.5 pt-2">
              <span className="text-emerald-400 font-bold">farhad@garuda</span>
              <span className="text-zinc-500">:</span>
              <span className="text-cyan-400">~/dev</span>
              <span className="text-zinc-500">$</span>
              <span className="inline-block h-3.5 w-2 bg-primary animate-pulse" />
            </div>
          </div>

          {/* Terminal Footer */}
          <div className="border-t border-zinc-800 bg-zinc-900/50 px-4 py-2.5 flex items-center justify-between text-[11px] text-zinc-400 mono">
            <span>Garuda Linux Kernel 6.8.x Zen</span>
            <span className="text-emerald-400 font-semibold">● 0 Crashes · 99.9% Uptime</span>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/** Deterministic pseudo-random contribution grid */
function Heatmap() {
  const weeks = 26;
  const cells = Array.from({ length: weeks * 7 }, (_, i) => {
    const v = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const n = Math.abs(v);
    return n > 0.8 ? 4 : n > 0.62 ? 3 : n > 0.42 ? 2 : n > 0.22 ? 1 : 0;
  });

  return (
    <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-1">
      {cells.map((lvl, i) => (
        <span
          key={i}
          title={`${lvl * 3 + 1} contributions`}
          className="size-2 shrink-0 rounded-[2.5px] sm:size-2.5 transition-colors hover:ring-1 hover:ring-primary"
          style={{
            background:
              lvl === 0
                ? "var(--muted)"
                : `color-mix(in oklab, var(--cyan) ${lvl * 25}%, var(--muted))`,
          }}
        />
      ))}
    </div>
  );
}
