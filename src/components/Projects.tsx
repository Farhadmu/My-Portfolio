import { useMemo, useState, useEffect } from "react";
import {
  ExternalLink,
  Search,
  X,
  Layers,
  Sparkles,
  ArrowUpRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Tv,
} from "lucide-react";
import { useDynamicProjects } from "@/hooks/usePortfolioData";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";
import { GithubIcon } from "./BrandIcons";
import { type DynamicProject } from "@/lib/supabase";
import { sound } from "@/lib/sound";

export function Projects() {
  const { projects } = useDynamicProjects();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeProject, setActiveProject] = useState<DynamicProject | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "architecture" | "demo">("overview");
  const [activeSkillFilter, setActiveSkillFilter] = useState<string | null>(null);

  // Listen for cross-filtering from Skills or Terminal
  useEffect(() => {
    const handleFilterSkill = (e: Event) => {
      const customEvent = e as CustomEvent<{ skill: string }>;
      if (customEvent.detail?.skill) {
        setActiveSkillFilter(customEvent.detail.skill);
        setQuery(customEvent.detail.skill);
        setSelectedCategory("All");
      }
    };
    window.addEventListener("portfolio_filter_skill", handleFilterSkill);
    return () => window.removeEventListener("portfolio_filter_skill", handleFilterSkill);
  }, []);

  // Derive dynamic project categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [projects]);

  // Filter projects by category and search
  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchCat =
        selectedCategory === "All" ||
        (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.tagline?.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tech.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [projects, selectedCategory, query]);

  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Portfolio & Creations"
        title="Featured Projects"
        desc="Production-grade web apps, full-stack platforms, and software tools — built with clean code and real-world architectures."
      />

      {/* Category Pills & Search Bar */}
      <Reveal className="mb-10 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const count =
                cat === "All"
                  ? projects.length
                  : projects.filter(
                      (p) => p.category?.toLowerCase() === cat.toLowerCase()
                    ).length;
              const isActive = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => {
                    sound.click();
                    setSelectedCategory(cat);
                  }}
                  className={`mono inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? "border border-primary/50 bg-primary/15 text-primary shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                      : "border border-border/70 bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isActive ? "bg-primary text-primary-foreground font-bold" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search title, tech, stack…"
              className="w-full rounded-xl border border-border/70 bg-secondary/40 py-2 pl-9 pr-8 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
            />
            {query && (
              <button
                onClick={() => {
                  sound.click();
                  setQuery("");
                  setActiveSkillFilter(null);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Active Skill Filter Banner */}
        {activeSkillFilter && (
          <div className="flex items-center justify-between rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 text-xs animate-in fade-in">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Sparkles className="size-3.5 text-primary" />
              <span>
                Filtered by skill: <strong className="text-primary font-bold">{activeSkillFilter}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.click();
                setActiveSkillFilter(null);
                setQuery("");
              }}
              className="text-xs text-primary hover:underline font-semibold"
            >
              Clear filter ✕
            </button>
          </div>
        )}
      </Reveal>

      {/* Projects Grid — ALL CARDS SAME SIZE */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Layers className="mx-auto size-10 text-muted-foreground/40" />
          <h3 className="mt-3 text-sm font-semibold">No projects match your filter</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Try choosing a different project category or clearing your search term.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setQuery("");
            }}
            className="mt-4 text-xs text-primary underline underline-offset-4"
          >
            Show all projects
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredProjects.map((p, idx) => (
            <Reveal key={p.slug} delay={idx * 0.05} className="h-full">
              <TiltCard max={5} className="h-full">
                <article className="group panel flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
                  {/* Card Thumbnail Container — Uniform Aspect Ratio */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary/40 border-b border-border/40">
                    <img
                      src={p.image}
                      alt={`${p.title} preview`}
                      loading="lazy"
                      className="size-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                      <span className="mono rounded-lg border border-border/80 bg-background/85 px-2.5 py-1 text-[10px] font-semibold text-foreground backdrop-blur-md">
                        {p.category || "Full Stack"}
                      </span>

                      {p.featured && (
                        <span className="mono flex items-center gap-1 rounded-lg border border-amber/40 bg-amber/15 px-2 py-0.5 text-[10px] font-semibold text-amber backdrop-blur-md">
                          <Sparkles className="size-3" /> Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col p-5 justify-between">
                    <div>
                      {/* Title & Tagline */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                          {p.title}
                        </h3>
                      </div>
                      <p className="mono text-[11px] font-medium text-primary/80 mt-0.5">
                        {p.tagline}
                      </p>

                      {/* Description */}
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                        {p.description}
                      </p>

                      {/* Tech Chips */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {p.tech.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="mono rounded-md border border-border/60 bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                        {p.tech.length > 4 && (
                          <span className="mono rounded-md bg-secondary/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            +{p.tech.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
                      <div className="flex items-center gap-2">
                        {p.live && (
                          <a
                            href={p.live}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors"
                          >
                            <ExternalLink className="size-3" /> Live Demo
                          </a>
                        )}

                        {p.github && (
                          <a
                            href={p.github}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-secondary/50 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                          >
                            <GithubIcon className="size-3" /> Repo
                          </a>
                        )}
                      </div>

                      <button
                        onClick={() => setActiveProject(p)}
                        className="mono inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Info className="size-3.5" /> Details
                      </button>
                    </div>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      )}

      {/* Project Detail Modal */}
      {activeProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setActiveProject(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveProject(null)}
              className="absolute right-4 top-4 rounded-xl border border-border bg-secondary/80 p-1.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
              <span>{activeProject.category || "Full Stack"}</span>
              <span>•</span>
              <span>{activeProject.tagline}</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {activeProject.title}
            </h2>

            {/* Modal Tabs */}
            <div className="mt-4 flex items-center gap-1 border-b border-border/60 pb-2">
              <button
                type="button"
                onClick={() => {
                  sound.click();
                  setActiveTab("overview");
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === "overview"
                    ? "bg-primary/20 text-primary border border-primary/40 shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Overview & Features
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.click();
                  setActiveTab("architecture");
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === "architecture"
                    ? "bg-primary/20 text-primary border border-primary/40 shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Architecture & Tech Specs
              </button>
              {activeProject.live && (
                <button
                  type="button"
                  onClick={() => {
                    sound.click();
                    setActiveTab("demo");
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeTab === "demo"
                      ? "bg-primary/20 text-primary border border-primary/40 shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Live Walkthrough
                </button>
              )}
            </div>

            {/* Tab: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-4 pt-4 animate-in fade-in">
                <img
                  src={activeProject.image}
                  alt={activeProject.title}
                  className="aspect-video w-full rounded-2xl object-cover object-top border border-border/50 shadow-md"
                />

                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {activeProject.description}
                </p>

                {/* Key Features */}
                {activeProject.features && activeProject.features.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Key Deliverables & Capabilities
                    </h4>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {activeProject.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Architecture */}
            {activeTab === "architecture" && (
              <div className="space-y-4 pt-4 animate-in fade-in">
                {/* Challenges Solved */}
                {activeProject.challenges && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                    <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="size-3.5" /> Engineering Challenges & Solutions
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {activeProject.challenges}
                    </p>
                  </div>
                )}

                {/* System Specs */}
                <div className="rounded-xl border border-border/70 bg-secondary/30 p-4 space-y-2.5 text-xs">
                  <h4 className="font-bold text-foreground flex items-center gap-1.5">
                    <Code2 className="size-3.5 text-primary" /> Architectural Highlights
                  </h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Decoupled modular components with strict TypeScript interface definitions</li>
                    <li>• Low-latency client side rendering paired with optimized server data hydration</li>
                    <li>• Production environment with defensive error boundaries and telemetry logging</li>
                  </ul>
                </div>

                {/* Complete Stack */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                    Technologies & Dependencies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(activeProject.stack || activeProject.tech).map((item) => (
                      <span
                        key={item}
                        className="mono rounded-lg border border-border bg-secondary/60 px-2.5 py-1 text-[11px] text-foreground font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Demo */}
            {activeTab === "demo" && (
              <div className="space-y-4 pt-4 animate-in fade-in text-center">
                <div className="rounded-2xl border border-border/80 bg-zinc-950 p-6 flex flex-col items-center justify-center min-h-[260px]">
                  <Tv className="size-10 text-primary mb-3" />
                  <h4 className="text-base font-bold text-foreground">Interactive Live Preview</h4>
                  <p className="text-xs text-muted-foreground max-w-md mt-1 mb-4">
                    Launch the live production deployment of <strong>{activeProject.title}</strong> directly in your browser with full responsive interface and interactions.
                  </p>
                  <a
                    href={activeProject.live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all"
                  >
                    <ExternalLink className="size-4" /> Open Full Production App ↗
                  </a>
                </div>
              </div>
            )}

            {/* Modal Links Footer */}
            <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
              <div className="flex items-center gap-3">
                {activeProject.live && (
                  <a
                    href={activeProject.live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md hover:bg-primary/90"
                  >
                    <ExternalLink className="size-3.5" /> Visit Live
                  </a>
                )}
                {activeProject.github && (
                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary/80"
                  >
                    <GithubIcon className="size-3.5" /> Source Code
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
