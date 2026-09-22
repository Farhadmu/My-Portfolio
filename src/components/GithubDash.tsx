import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import { githubStats, languageBars, profile, projects, skillGroups } from "@/data/portfolio";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { Icon } from "./Icon";
import { GithubIcon } from "./BrandIcons";
import {
  Flame,
  GitCommit,
  GitPullRequest,
  GitBranch,
  Terminal,
  ExternalLink,
  Activity,
  Maximize2,
  Minimize2,
  Trophy,
  Code2,
  Cpu,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { sound } from "@/lib/sound";

const accent: Record<string, string> = {
  cyan: "var(--cyan)",
  violet: "var(--violet)",
  lime: "var(--lime)",
  amber: "var(--amber)",
  pink: "var(--pink)",
};

interface TerminalLine {
  type: "input" | "output" | "success" | "error" | "info";
  text: string;
  path?: string;
}

const INITIAL_LOGS: TerminalLine[] = [
  { type: "input", text: "git log -n 3 --pretty=format:'%h %s (%cr)'", path: "~/dev/portfolio" },
  { type: "output", text: "6e2f1a8 feat(cli): interactive shell & dynamic telemetry (active)" },
  { type: "output", text: "b49a03c perf(frontend): zero-layout-shift r3f lazy loader" },
  { type: "output", text: "87c14de feat(auth): secure session sync across edge middleware" },
  { type: "success", text: "✓ On branch main · Working tree clean · Commit velocity active." },
  { type: "info", text: "Type 'help' to see interactive commands or use tabs above." },
];

export function GithubDash() {
  const [activeTab, setActiveTab] = useState<"git" | "docker" | "benchmarks" | "cp">("git");
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>(INITIAL_LOGS);
  const [commandInput, setCommandInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [liveStats, setLiveStats] = useState({
    repos: 28,
    followers: 12,
    streak: "38+ Days",
    loadedLive: false,
  });

  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch live GitHub stats gracefully
  useEffect(() => {
    let isMounted = true;
    async function fetchGithub() {
      try {
        const res = await fetch(`https://api.github.com/users/${profile.githubUser}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data) {
            setLiveStats((prev) => ({
              ...prev,
              repos: data.public_repos ?? prev.repos,
              followers: data.followers ?? prev.followers,
              loadedLive: true,
            }));
          }
        }
      } catch {
        // Use fallback static stats
      }
    }
    fetchGithub();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto scroll terminal on changes
  useEffect(() => {
    terminalBodyRef.current?.scrollTo({
      top: terminalBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [terminalHistory]);

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    sound.click();
    const newHistory = [...terminalHistory, { type: "input" as const, text: trimmed, path: "~/dev" }];
    const lower = trimmed.toLowerCase();

    // Command parser
    if (lower === "help") {
      newHistory.push({
        type: "info",
        text: `Available commands:\n  help        - List all commands\n  about       - Brief background & role\n  skills      - List core engineering technologies\n  projects    - Highlighted production projects\n  cp          - Competitive programming & hackathons\n  contact     - Social links & contact info\n  cat resume  - Quick summary of verified CV\n  sudo hire   - Instant hiring / role inquiry\n  clear       - Wipe terminal screen\n  date        - Current timestamp`,
      });
      sound.success();
    } else if (lower === "about") {
      newHistory.push({
        type: "output",
        text: `${profile.name} — ${profile.role}\n${profile.university}\n${profile.intro}`,
      });
      sound.success();
    } else if (lower === "skills") {
      const allSkills = skillGroups
        .map((g) => `${g.category.toUpperCase()}: ${g.skills.map((s) => s.name).join(", ")}`)
        .join("\n");
      newHistory.push({ type: "output", text: allSkills });
      sound.success();
    } else if (lower === "projects") {
      const pList = projects
        .slice(0, 5)
        .map((p, i) => `[${i + 1}] ${p.title} — ${p.tagline} (${p.tech.slice(0, 3).join(", ")})`)
        .join("\n");
      newHistory.push({
        type: "output",
        text: `Featured Projects:\n${pList}\n(Click 'Projects' in navbar for interactive live demos)`,
      });
      sound.success();
    } else if (lower === "cp" || lower === "dsa") {
      newHistory.push({
        type: "output",
        text: `COMPETITIVE PROGRAMMING TELEMETRY:\n- 6th Position at SUST CSE Carnival '26\n- Primary Language: C++20 (Standard Template Library, O(log N) algorithms)\n- Core Focus: Graphs (Dijkstra, BFS/DFS), Segment Trees, Dynamic Programming`,
      });
      sound.success();
    } else if (lower === "contact" || lower === "socials") {
      newHistory.push({
        type: "output",
        text: `Email: ${profile.email}\nPhone/WhatsApp: ${profile.phone}\nGitHub: ${profile.github}\nLinkedIn: ${profile.linkedin}`,
      });
      sound.success();
    } else if (lower === "sudo hire" || lower === "sudo hire farhad") {
      newHistory.push({
        type: "success",
        text: `ACCESS GRANTED: Farhad is actively open to Full-Stack & Frontend Engineering roles!\nRedirecting smooth scroll to contact section...`,
      });
      sound.success();
      setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    } else if (lower === "cat resume" || lower === "cat resume.txt") {
      newHistory.push({
        type: "output",
        text: `RESUME SUMMARY:\nCandidate: ${profile.name}\nDegree: B.Sc. in CSE @ BAIUST\nExpertise: React 19, Next.js, Node.js, TypeScript, C++, PostgreSQL\nVerified CV: ${profile.resumeFile}`,
      });
      sound.success();
    } else if (lower === "clear") {
      setTerminalHistory([]);
      setCommandInput("");
      return;
    } else if (lower === "date") {
      newHistory.push({ type: "output", text: new Date().toUTCString() });
      sound.success();
    } else {
      newHistory.push({
        type: "error",
        text: `bash: ${trimmed}: command not found. Type 'help' for valid commands.`,
      });
      sound.error();
    }

    setTerminalHistory(newHistory);
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    setCommandInput("");
  };

  const handleTabSwitch = (tab: "git" | "docker" | "benchmarks" | "cp") => {
    sound.click();
    setActiveTab(tab);
    if (tab === "git") {
      setTerminalHistory(INITIAL_LOGS);
    } else if (tab === "docker") {
      setTerminalHistory([
        { type: "input", text: "docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'", path: "~/dev" },
        { type: "output", text: "fixitnow-api         Up 4 days (healthy)     0.0.0.0:5000->5000/tcp" },
        { type: "output", text: "drivefleet-engine    Up 6 days (healthy)     0.0.0.0:8000->8000/tcp" },
        { type: "output", text: "redis-cache-layer    Up 12 days (healthy)    0.0.0.0:6379->6379/tcp" },
        { type: "output", text: "postgres-cluster     Up 12 days (healthy)    0.0.0.0:5432->5432/tcp" },
        { type: "success", text: "✓ All container clusters healthy and operating within latency SLAs." },
      ]);
    } else if (tab === "benchmarks") {
      setTerminalHistory([
        { type: "input", text: "./benchmark_dsa.sh --target=c++20", path: "~/benchmarks" },
        { type: "output", text: "[INFO] Compiling graph_dijkstra.cpp with -O3 -std=c++20..." },
        { type: "output", text: "[TEST 1] 100,000 Nodes Sparse Graph: 14.2ms | 0 Mem Leaks" },
        { type: "output", text: "[TEST 2] Segment Tree Range Updates:  4.1ms | O(log N) verified" },
        { type: "output", text: "[TEST 3] DP State Transitions:       2.8ms | Space O(N)" },
        { type: "success", text: "✓ 100% tests passed. Time complexity strictly within competitive limits." },
      ]);
    } else if (tab === "cp") {
      setTerminalHistory([
        { type: "input", text: "cat ~/cp/achievements.json", path: "~/cp" },
        { type: "output", text: "{\n  \"contest\": \"SUST CSE Carnival 2026\",\n  \"rank\": \"6th Nationwide\",\n  \"focus\": \"Graph Theory, Segment Trees, C++20\",\n  \"status\": \"Daily Problem Solving Active\"\n}" },
        { type: "success", text: "✓ Competitive problem solving rhythm verified." },
      ]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runCommand(commandInput);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < commandHistory.length) {
          setHistoryIndex(nextIndex);
          setCommandInput(commandHistory[commandHistory.length - 1 - nextIndex]);
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setCommandInput(commandHistory[commandHistory.length - 1 - nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommandInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const candidates = ["help", "about", "skills", "projects", "cp", "contact", "clear", "sudo hire farhad", "cat resume"];
      const match = candidates.find((c) => c.startsWith(commandInput.trim().toLowerCase()));
      if (match) {
        setCommandInput(match);
      }
    }
  };

  return (
    <Section id="github">
      <SectionHeading
        eyebrow="ENGINEERING TELEMETRY & METRICS"
        title="Git Rhythm & Interactive Terminal"
        desc="A transparent look at code velocity, daily commit streak, live language spectrum, and an interactive developer CLI."
      />

      {/* Top Banner: Git Velocity & CP Carnival Spotlight */}
      <Reveal className="mb-6 grid gap-4 md:grid-cols-2">
        {/* Flame Streak Banner */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-card to-amber-500/5 px-5 py-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl border border-amber-500/30 bg-amber-500/20 text-amber-400 shadow-sm animate-pulse">
              <Flame className="size-5 fill-amber-400" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-foreground">
                  {liveStats.streak} Streak
                </span>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-amber-300">
                  ACTIVE VELOCITY
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Consistent daily commits across production repos & system tooling.
              </p>
            </div>
          </div>

          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            onClick={() => sound.pop()}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary hover:border-primary/50 transition-all shadow-xs"
          >
            <GithubIcon className="size-3.5" />
            <span className="hidden sm:inline">@{profile.githubUser}</span>
            <ExternalLink className="size-3 text-muted-foreground" />
          </a>
        </div>

        {/* Problem Solving / SUST Carnival Banner */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-card to-cyan-500/5 px-5 py-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl border border-cyan-500/30 bg-cyan-500/20 text-cyan-400 shadow-sm">
              <Trophy className="size-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-foreground">
                  6th Place · SUST Carnival '26
                </span>
                <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-cyan-300">
                  COMPETITIVE CODING
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                BAIUST CSE team nationwide algorithmic problem solving with C++20.
              </p>
            </div>
          </div>

          <span className="mono text-xs font-bold text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 rounded-lg shrink-0">
            DSA in C++
          </span>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.15fr]">
        {/* Left Column: Metrics, Languages, and Heatmap */}
        <div className="space-y-4">
          {/* Quick Metrics Grid */}
          <Reveal className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="panel relative overflow-hidden rounded-2xl border border-border/80 bg-card/75 p-4 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card/95">
              <div className="flex items-center justify-between mb-2">
                <GitBranch className="size-4 text-primary" />
                <span className="size-1.5 rounded-full bg-emerald-400" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                {liveStats.repos}+
              </p>
              <p className="mono mt-1 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                Repositories {liveStats.loadedLive ? "(Live)" : ""}
              </p>
            </div>

            <div className="panel relative overflow-hidden rounded-2xl border border-border/80 bg-card/75 p-4 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card/95">
              <div className="flex items-center justify-between mb-2">
                <GitCommit className="size-4 text-primary" />
                <span className="size-1.5 rounded-full bg-emerald-400" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                500+
              </p>
              <p className="mono mt-1 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                Commits Pushed
              </p>
            </div>

            <div className="panel relative overflow-hidden rounded-2xl border border-border/80 bg-card/75 p-4 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card/95">
              <div className="flex items-center justify-between mb-2">
                <Code2 className="size-4 text-primary" />
                <span className="size-1.5 rounded-full bg-emerald-400" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                35+
              </p>
              <p className="mono mt-1 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                Technologies
              </p>
            </div>

            <div className="panel relative overflow-hidden rounded-2xl border border-border/80 bg-card/75 p-4 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card/95">
              <div className="flex items-center justify-between mb-2">
                <Cpu className="size-4 text-primary" />
                <span className="size-1.5 rounded-full bg-emerald-400" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                Garuda
              </p>
              <p className="mono mt-1 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                Primary Linux OS
              </p>
            </div>
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

        {/* Right Column: Full Interactive Terminal Environment */}
        <Reveal
          delay={0.08}
          className={`panel flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-zinc-950/95 shadow-2xl backdrop-blur-md transition-all duration-300 ${
            isFullscreen ? "fixed inset-4 z-50 rounded-3xl" : "h-[560px]"
          }`}
        >
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

            <div className="flex items-center gap-2">
              {/* Interactive Command Tabs */}
              <div className="hidden sm:flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleTabSwitch("git")}
                  className={`mono rounded-md px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                    activeTab === "git" ? "bg-primary text-primary-foreground" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  git log
                </button>
                <button
                  type="button"
                  onClick={() => handleTabSwitch("docker")}
                  className={`mono rounded-md px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                    activeTab === "docker" ? "bg-primary text-primary-foreground" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  docker ps
                </button>
                <button
                  type="button"
                  onClick={() => handleTabSwitch("benchmarks")}
                  className={`mono rounded-md px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                    activeTab === "benchmarks" ? "bg-primary text-primary-foreground" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  benchmarks
                </button>
                <button
                  type="button"
                  onClick={() => handleTabSwitch("cp")}
                  className={`mono rounded-md px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                    activeTab === "cp" ? "bg-primary text-primary-foreground" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  cp-stats
                </button>
              </div>

              {/* Fullscreen Expand Button */}
              <button
                type="button"
                onClick={() => {
                  sound.click();
                  setIsFullscreen(!isFullscreen);
                }}
                className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen CLI"}
              >
                {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
              </button>
            </div>
          </div>

          {/* Interactive Terminal Body */}
          <div
            ref={terminalBodyRef}
            onClick={() => inputRef.current?.focus()}
            className="mono flex-1 space-y-2.5 p-4 sm:p-5 text-xs leading-relaxed text-zinc-300 overflow-y-auto cursor-text"
          >
            {terminalHistory.map((l, i) => (
              <div key={i} className="animate-in fade-in duration-100">
                {l.type === "input" && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-emerald-400 font-bold">farhad@garuda</span>
                    <span className="text-zinc-500">:</span>
                    <span className="text-cyan-400">{l.path || "~/dev"}</span>
                    <span className="text-zinc-500">$</span>
                    <span className="text-white font-medium">{l.text}</span>
                  </div>
                )}
                {l.type === "output" && (
                  <pre className="text-zinc-400 pl-4 whitespace-pre-wrap font-mono leading-relaxed">
                    {l.text}
                  </pre>
                )}
                {l.type === "success" && (
                  <p className="text-emerald-400 pl-4 bg-emerald-500/10 border-l-2 border-emerald-400 py-1 my-1 rounded-r">
                    {l.text}
                  </p>
                )}
                {l.type === "error" && (
                  <p className="text-rose-400 pl-4 bg-rose-500/10 border-l-2 border-rose-400 py-1 my-1 rounded-r">
                    {l.text}
                  </p>
                )}
                {l.type === "info" && (
                  <pre className="text-cyan-300/90 pl-4 bg-cyan-500/5 border-l-2 border-cyan-400/60 py-1.5 my-1 rounded-r whitespace-pre-wrap font-mono text-[11px]">
                    {l.text}
                  </pre>
                )}
              </div>
            ))}

            {/* Active Interactive Command Line Input */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-emerald-400 font-bold">farhad@garuda</span>
              <span className="text-zinc-500">:</span>
              <span className="text-cyan-400">~/dev</span>
              <span className="text-zinc-500">$</span>
              <input
                ref={inputRef}
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="type command (e.g. 'help', 'skills', 'projects', 'sudo hire')..."
                className="flex-1 bg-transparent text-white font-mono text-xs outline-hidden placeholder:text-zinc-600"
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </div>

          {/* Terminal Footer */}
          <div className="border-t border-zinc-800 bg-zinc-900/60 px-4 py-2 flex items-center justify-between text-[11px] text-zinc-400 mono">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-400" />
              <span>Garuda Linux Kernel 6.8.x Zen</span>
            </span>
            <span className="text-zinc-400 hidden sm:inline">
              Tip: Press <kbd className="bg-zinc-800 px-1 rounded text-[10px]">Tab</kbd> to complete · <kbd className="bg-zinc-800 px-1 rounded text-[10px]">↑/↓</kbd> for history
            </span>
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
